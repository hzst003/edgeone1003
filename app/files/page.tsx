"use client";

import { useState, useEffect } from "react";
import { storage, generateId } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";

const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export default function FilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  // 加载文件列表
  const fetchFiles = async () => {
    try {
      const res = await storage.listFiles(bucketId);
      setFiles(res.files);
    } catch (err) {
      console.error("获取文件列表失败：", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // 上传文件
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    try {
      const uploadTasks = Array.from(e.target.files).map((file) =>
        storage.createFile(bucketId, generateId(), file)
      );
      await Promise.all(uploadTasks);
      await fetchFiles();
    } catch (err) {
      console.error("上传失败：", err);
    } finally {
      setUploading(false);
      e.target.value = ""; // 清空 input
    }
  };

  // 下载单个文件
  const handleDownload = (fileId: string, fileName: string) => {
    const url = storage.getFileDownload(bucketId, fileId);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  // 删除单个文件
  const handleDelete = async (fileId: string) => {
    if (!confirm("确定要删除这个文件吗？")) return;
    try {
      await storage.deleteFile(bucketId, fileId);
      await fetchFiles();
    } catch (err) {
      console.error("删除失败：", err);
    }
  };

  // 选择文件（多选）
  const toggleSelect = (fileId: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.has(fileId) ? newSet.delete(fileId) : newSet.add(fileId);
      return newSet;
    });
  };

  // 批量下载
  const handleBatchDownload = () => {
    files
      .filter((f) => selectedFiles.has(f.$id))
      .forEach((f) => handleDownload(f.$id, f.name));
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (!confirm("确定要删除选中的文件吗？")) return;
    for (const id of selectedFiles) {
      await storage.deleteFile(bucketId, id);
    }
    setSelectedFiles(new Set());
    await fetchFiles();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold mb-4">📂 文件管理系统</h1>

      <div className="flex items-center space-x-2">
        <input
          id="fileInput"
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          type="button"
          onClick={() => document.getElementById("fileInput")?.click()}
          disabled={uploading}
        >
          {uploading ? "上传中..." : "上传文件"}
        </Button>

        {selectedFiles.size > 0 && (
          <>
            <Button variant="outline" onClick={handleBatchDownload}>
              批量下载 ({selectedFiles.size})
            </Button>
            <Button variant="destructive" onClick={handleBatchDelete}>
              批量删除 ({selectedFiles.size})
            </Button>
          </>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">选择</th>
              <th className="p-2 text-left">文件名</th>
              <th className="p-2 text-left">大小</th>
              <th className="p-2 text-left">上传时间</th>
              <th className="p-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.$id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.$id)}
                    onChange={() => toggleSelect(file.$id)}
                  />
                </td>
                <td className="p-2 break-all">{file.name}</td>
                <td className="p-2">
                  {(file.sizeOriginal / 1024).toFixed(1)} KB
                </td>
                <td className="p-2">
                  {new Date(file.$createdAt).toLocaleString("zh-CN")}
                </td>
                <td className="p-2 text-right space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(file.$id, file.name)}
                  >
                    下载
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(file.$id)}
                  >
                    删除
                  </Button>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  暂无文件
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
