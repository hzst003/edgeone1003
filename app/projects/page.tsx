"use client";

import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import type { Post } from "@/lib/appwrite";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await databases.listDocuments(databaseId, collectionId);
      setPosts(res.documents as unknown as Post[]);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">📘 实时加载数据</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">暂无数据</p>
      ) : (
        posts.map((p) => (
          <div key={p.$id} className="border p-4 rounded mb-3">
            <h2 className="font-semibold text-lg">{p.name}</h2>
            <p>{p.code}</p>
          </div>
        ))
      )}
    </div>
  );
}
