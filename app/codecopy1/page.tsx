"use client";

import { useState, useEffect } from "react";
import { databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  // ✅ 获取所有文档
  const fetchCodes = async () => {
    try {
      setFetching(true);
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TABLE_CODECOPY_ID!,
      );
      setList(res.documents);
    } catch (err) {
      console.error(err);
      alert("获取数据失败");
    } finally {
      setFetching(false);
    }
  };

  // ✅ 保存
  const saveCode = async () => {
    if (!code.trim()) return;

    try {
      setLoading(true);

      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TABLE_CODECOPY_ID!,
        ID.unique(),
        {
          code,
        },
      );

      setCode("");
      fetchCodes(); // 重新加载
    } catch (err) {
      console.error(err);
      alert("保存失败");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 删除
  const deleteCode = async (id: string) => {
    if (!confirm("确定删除？")) return;

    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TABLE_CODECOPY_ID!,
        id,
      );
      fetchCodes();
    } catch (err) {
      console.error(err);
      alert("删除失败");
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    fetchCodes();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6 gap-6">
      {/* 新增区域 */}
      <Card className="w-full max-w-2xl">
        <CardContent className="space-y-4 p-6">
          <h1 className="text-xl font-bold">代码粘贴保存</h1>

          <Textarea
            placeholder="在这里粘贴你的代码..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />

          <Button onClick={saveCode} disabled={loading}>
            {loading ? "保存中..." : "保存"}
          </Button>
        </CardContent>
      </Card>

      {/* 列表区域 */}
      <Card className="w-full max-w-2xl">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">已保存代码</h2>

          {fetching && <p>加载中...</p>}

          {list.map((item) => (
            <div
              key={item.$id}
              className="border rounded p-4 space-y-2 bg-white"
            >
              <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
                {item.code}
              </pre>

              <Button
                variant="destructive"
                onClick={() => deleteCode(item.$id)}
              >
                删除
              </Button>
            </div>
          ))}

          {!fetching && list.length === 0 && (
            <p className="text-gray-500">暂无数据</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

