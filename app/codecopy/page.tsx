"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState<{ id: number; content: string }[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const buttonClass = "bg-blue-500 hover:bg-blue-600 text-white";

  // 显示提示信息，自动消失
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  // 加载历史内容
  const loadHistory = async () => {
    const { data, error } = await supabase
      .from("clipboard")
      .select("id, content")
      .order("id", { ascending: false })
      .limit(10);
    if (error) {
      console.error(error);
      return;
    }
    if (data) setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showMessage("已复制到剪贴板!");
    } catch {
      showMessage("复制失败");
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      showMessage("已粘贴内容");
    } catch {
      showMessage("粘贴失败");
    }
  };

  const handleSave = async () => {
    const { error } = await supabase.from("clipboard").insert([{ content: text }]);
    if (error) {
      showMessage("保存失败");
    } else {
      showMessage("已保存到数据库!");
      loadHistory();
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("clipboard").delete().eq("id", id);
    if (error) {
      showMessage("删除失败");
    } else {
      showMessage("已删除历史记录");
      loadHistory();
    }
  };

  const handleCopyHistory = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showMessage("历史记录已复制!");
    } catch {
      showMessage("复制失败");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-4 relative">
      <h1 className="text-2xl font-bold mb-4">代码复制粘贴</h1>
      <textarea
        className="w-full max-w-md h-40 p-2 border border-gray-300 rounded-md mb-4 resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="在这里输入内容..."
      />
      <div className="flex gap-4 mb-6">
        <Button onClick={handleCopy} className={buttonClass}>复制</Button>
        <Button onClick={handlePaste} className={buttonClass}>粘贴</Button>
        <Button onClick={handleSave} className={buttonClass}>保存</Button>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">历史记录</h2>
        <div className="flex flex-col gap-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-start hover:shadow-md transition-shadow"
            >
              <div
                className="flex-1 mr-3 break-words cursor-pointer"
                onClick={() => setText(item.content)}
              >
                {item.content}
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className="text-blue-500 hover:text-blue-700 text-sm"
                  onClick={() => handleCopyHistory(item.content)}
                >
                  复制
                </button>
                <button
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 简单提示气泡 */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-md transition-all">
          {message}
        </div>
      )}
    </div>
  );
}
