"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";

import { Client, Databases, Query, Models } from "appwrite";

type Record = Models.Document & {
  $id: string;
  photo: string | null;
  location: string | null;
  well: string | null;
  longitude: number | null;
  latitude: number | null;
  name1: string | null;
  name2: string | null;
};

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

const databases = new Databases(client);

async function getRecords(): Promise<Record[]> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_TABLE_RECORDS_ID as string;

  const limit = 1000;
  let offset = 0;
  let allDocs: Record[] = [];

  while (true) {
    const res = await databases.listDocuments<Record>(databaseId, collectionId, [
      Query.limit(limit),
      Query.offset(offset),
    ]);
    allDocs = allDocs.concat(res.documents);
    if (res.documents.length < limit) break;
    offset += limit;
  }

  return allDocs;
}

export default function RecordsPage() {
  const [data, setData] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // 每列筛选文本
  const [filters, setFilters] = useState({
    location: "",
    well: "",
    longitude: "",
    latitude: "",
    name1: "",
    name2: "",
  });

  useEffect(() => {
    getRecords()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 全局图片数组
  const images = useMemo(
    () => data.filter((r) => r.photo).map((r) => r.photo!),
    [data]
  );

  const handlePreview = (photo: string) => {
    const index = images.indexOf(photo);
    if (index >= 0) setPreviewIndex(index);
  };

  // 过滤数据
  const filteredRows = useMemo(() => {
    if (loading) return [];
    return data.filter((r) => {
      return (
        (!filters.location ||
          r.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.well || r.well?.toLowerCase().includes(filters.well.toLowerCase())) &&
        (!filters.longitude ||
          r.longitude?.toString().includes(filters.longitude)) &&
        (!filters.latitude ||
          r.latitude?.toString().includes(filters.latitude)) &&
        (!filters.name1 ||
          r.name1?.toLowerCase().includes(filters.name1.toLowerCase())) &&
        (!filters.name2 ||
          r.name2?.toLowerCase().includes(filters.name2.toLowerCase()))
      );
    });
  }, [data, filters, loading]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);

  // 键盘控制图片浏览
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (previewIndex === null) return;
      if (e.key === "ArrowLeft") {
        setPreviewIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : 0
        );
      } else if (e.key === "ArrowRight") {
        setPreviewIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : 0
        );
      } else if (e.key === "Escape") {
        setPreviewIndex(null);
      }
    },
    [previewIndex, images.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="p-4">
      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-2 py-1 text-center w-12">#</th>
              <th className="border px-2 py-1">照片</th>
              <th className="border px-2 py-1">
                地点(预览退出按ESC)
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-1 py-0.5 text-xs"
                  placeholder="筛选"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, location: e.target.value }))
                  }
                />
              </th>
              <th className="border px-2 py-1">
                井号
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-1 py-0.5 text-xs"
                  placeholder="筛选"
                  value={filters.well}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, well: e.target.value }))
                  }
                />
              </th>
              <th className="border px-2 py-1">
                经度
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-1 py-0.5 text-xs"
                  placeholder="筛选"
                  value={filters.longitude}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, longitude: e.target.value }))
                  }
                />
              </th>
              <th className="border px-2 py-1">
                纬度
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-1 py-0.5 text-xs"
                  placeholder="筛选"
                  value={filters.latitude}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, latitude: e.target.value }))
                  }
                />
              </th>
              <th className="border px-2 py-1">
                道路1
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-1 py-0.5 text-xs"
                  placeholder="筛选"
                  value={filters.name1}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, name1: e.target.value }))
                  }
                />
              </th>
              <th className="border px-2 py-1">
                道路2
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-1 py-0.5 text-xs"
                  placeholder="筛选"
                  value={filters.name2}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, name2: e.target.value }))
                  }
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, idx) => (
              <tr key={row.$id} className="hover:bg-gray-50">
                <td className="border px-2 py-1 text-center">
                  {(page - 1) * pageSize + idx + 1}
                </td>
                <td className="border px-2 py-1">
                  {row.photo ? (
                    <img
                      src={row.photo}
                      alt="photo"
                      className="w-12 h-12 object-cover rounded border border-gray-200 cursor-pointer"
                      onClick={() => handlePreview(row.photo!)}
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-400 text-xs rounded border border-gray-200">
                      无
                    </div>
                  )}
                </td>
                <td className="border px-2 py-1">{row.location}</td>
                <td className="border px-2 py-1">{row.well}</td>
                <td className="border px-2 py-1">{row.longitude}</td>
                <td className="border px-2 py-1">{row.latitude}</td>
                <td className="border px-2 py-1">{row.name1}</td>
                <td className="border px-2 py-1">{row.name2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <div>
          第 {page} / {totalPages} 页，共 {filteredRows.length} 条
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            上一页
          </button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </button>

          <select
            className="border px-2 py-1 rounded"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[20, 100, 200, 500].map((n) => (
              <option key={n} value={n}>
                {n} / 页
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="mt-4 text-center text-gray-500">加载中...</div>}

      {/* 图片预览 Modal */}
      {previewIndex !== null && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewIndex(null)}
        >
          {/* 左箭头 */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl font-bold z-50"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewIndex((prev) =>
                prev !== null ? (prev - 1 + images.length) % images.length : 0
              );
            }}
          >
            ‹
          </button>

          {/* 图片 */}
          <img
            src={images[previewIndex]}
            alt="preview"
            className="max-h-[90%] max-w-[90%] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 右箭头 */}
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl font-bold z-50"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewIndex((prev) =>
                prev !== null ? (prev + 1) % images.length : 0
              );
            }}
          >
            ›
          </button>

          {/* 关闭按钮 */}
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold"
            onClick={() => setPreviewIndex(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
