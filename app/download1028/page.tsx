"use client";

import { useState } from "react";
import PocketBase from "pocketbase";

interface DownloadRecord {
  id: string;
  title: string;
  path: string;
  filestorage: string ; // 兼容单文件或多文件字段
  size:  string;
  created: string;
}

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_API );

export default function DownloadsPage() {
  const [records, setRecords] = useState<DownloadRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // 分页状态
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // 构造 PocketBase filter（支持多关键字 AND、-排除）
const buildFilter = (raw: string) => {
  const str = raw.trim();
  if (!str) return undefined;

  const parts = str.split(/\s+/).filter(Boolean);

  const includes: string[] = [];
  const excludes: string[] = [];

  for (const p of parts) {
    if (p.startsWith("-")) {
      const w = p.slice(1).trim();
      if (w) excludes.push(escapeForPB(w));
    } else {
      includes.push(escapeForPB(p));
    }
  }

  // ✅ 修复 PocketBase 语法错误：使用 path !~ 而不是 !(path ~)
  const incFilter = includes.map((w) => `path ~ "${w}"`).join(" && ");
  const excFilter = excludes.map((w) => `path !~ "${w}"`).join(" && ");

  if (incFilter && excFilter) return `${incFilter} && ${excFilter}`;
  if (incFilter) return incFilter;
  if (excFilter) return excFilter;
  return undefined;
};

  // 简单转义双引号（防止 PocketBase filter 解析出错）
  const escapeForPB = (s: string) => s.replace(/"/g, '\\"');

  // 获取某页数据（page 从 1 开始）
  const fetchRecords = async (requestedPage = 1) => {
    const filterQuery = buildFilter(query || "");
    // 如果未搜索过且 query 为空，不加载（页面初始只显示搜索框）
    if (!filterQuery && !searched) {
      setRecords([]);
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const res = await pb
        .collection("downloads")
        .getList<DownloadRecord>(requestedPage, perPage, {
          sort: "-created",
          filter: filterQuery,
          $autoCancel: false,
        });


      // PocketBase getList 返回: { page, perPage, totalItems, totalPages, items }
      setRecords(res.items );
      setPage(res.page || requestedPage);
      setTotalPages(res.totalPages || 0);
      setTotalItems(res.totalItems || 0);
    } catch (err) {
      console.error("Fetch downloads error:", err);
      // 发生错误时清空结果（或保持上页结果也可以）
      setRecords([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setPage(1);
    fetchRecords(1);
  };

  // 下载：使用 title 作为文件名（兼容单文件或数组）
  const handleDownload = async (record: DownloadRecord) => {
    try {
      const fileField = record.filestorage;
      // 取第一个文件名（如果是数组）
      const filename = Array.isArray(fileField) ? fileField[0] : fileField;
      if (!filename) {
        console.warn("No file to download for record", record.id);
        return;
      }

      // 用 pb.getFileUrl 生成带 token 的下载 URL（third arg {download:true} 不保证浏览器保存为指定名）
      const url = pb.getFileUrl(record, filename, {});

      // fetch 到 blob，再用 a.download 指定文件名为 title + 保留原扩展名（如果有）
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`fetch error ${resp.status}`);
      const blob = await resp.blob();

 

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);

      // 安全地生成下载名（去掉路径中可能的非法字符）
      const safeTitle = (record.title || "download").replace(/[\/\\?%*:|"<>]/g, "-");
      a.download = `${safeTitle}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error("Download error:", err);
      alert("下载失败，请查看控制台日志");
    }
  };

  const gotoPage = (p: number) => {
    if (p < 1 || (totalPages && p > totalPages)) return;
    setPage(p);
    fetchRecords(p);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">文件下载</h1>

      {/* 搜索框 */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder='输入关键字搜索（空格分隔；减号表示排除，例如：images 2025 -backup）'
          className="border border-gray-300 rounded-md px-4 py-2 grow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "搜索中..." : "搜索"}
        </button>
      </form>

      {/* 搜索后才显示结果区域 */}
      {(!searched || (records.length === 0 && !loading)) && (
        <p className="text-gray-500 text-center">
          {!searched ? "请输入关键字开始搜索" : "未找到匹配的文件"}
        </p>
      )}

      {records.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full border border-gray-200 rounded-md">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-2 text-left">标题</th>
                <th className="p-2 text-left">Path</th>
                <th className="p-2 text-left">大小</th>
                <th className="p-2 text-left">上传时间</th>
                <th className="p-2 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="p-2 align-top">{record.title}</td>
                  <td className="p-2 align-top break-all">{record.path}</td>
                  <td className="p-2 align-top">{record.size}</td>
                  <td className="p-2 align-top">{new Date(record.created).toLocaleString()}</td>
                  <td className="p-2 text-center align-top">
                    <button
                      onClick={() => handleDownload(record)}
                      className="text-blue-600 hover:underline"
                    >
                      下载
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 分页 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              第 {page} / {totalPages || 1} 页 · 共 {totalItems} 条
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => gotoPage(1)}
                disabled={page === 1 || loading}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                首页
              </button>
              <button
                onClick={() => gotoPage(page - 1)}
                disabled={page === 1 || loading}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                上一页
              </button>

              {/* 简单显示当前页附近的页码（±2） */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                if (p < page - 2 || p > page + 2) return null;
                return (
                  <button
                    key={p}
                    onClick={() => gotoPage(p)}
                    disabled={p === page || loading}
                    className={`px-2 py-1 border rounded ${
                      p === page ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => gotoPage(page + 1)}
                disabled={totalPages ? page === totalPages || loading : true}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                下一页
              </button>
              <button
                onClick={() => gotoPage(totalPages || page)}
                disabled={totalPages ? page === totalPages || loading : true}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                尾页
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



