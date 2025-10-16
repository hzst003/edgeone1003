// File: app/card-gallery/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

type CardProps = {
  title: string;
  description?: string;
  href: string;
  thumbnail?: string;
  badge?: string;
  external?: boolean;
  carddate?: string;
};

const fallbackThumb = "/images/thumb-placeholder.jpg";

// 侧图卡片风格
function CardSide({ title, description, href, thumbnail, badge, external, carddate }: CardProps) {
  const isExternal = external || href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="flex gap-4 items-center rounded-xl border bg-white dark:bg-gray-800 shadow hover:shadow-lg transition group"
    >
      {/* 左侧图片 */}
      <div className="w-28 h-28 relative flex-shrink-0">
        <Image
          src={thumbnail || fallbackThumb}
          alt={title}
          fill
          className="object-cover rounded-l-xl"
        />
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
            {title}
            {isExternal && <span className="ml-1 text-xs opacity-70">↗</span>}
          </h3>
          {badge && (
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-800/30 dark:text-blue-200">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 whitespace-pre-wrap">
            {description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1 font-medium">
            进入 →
          </span>
          <span>{carddate}</span>
        </div>
      </div>
    </Link>
  );
}

// ------------------ 数据 ------------------
const ITEMS = [
   { title: "代码拷贝", description: "copy                                     ****", href: "/codecopy", thumbnail: "/images/codecopy.png", carddate: "2025-10-13更新" },
    { title: "表格v01", description: "工程信息                                         ****", href: "/projects", thumbnail: "/images/logowasu.png", carddate: "2025-09-08更新" },
    { title: "文件管理", description: "上传下载                                         ****", href: "/files", thumbnail: "/images/zipdownload.png", carddate: "2025-10-14更新" },
{ title: "代维井信息", description: "代维井信息查看，拱墅区部分                         ***",  href: "/daiwei", thumbnail: "/images/well.jpg", carddate: "2025-10-16" },
  ]

// ------------------ 页面 ------------------
export default function CardGallery() {
  return (
    <main className="min-h-dvh bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="mx-auto max-w-7xl mb-80">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl"></h1>
        </header>
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch"
          aria-label="Card Gallery"
        >
          {ITEMS.map((item, idx) => (
            <CardSide key={idx} {...item} />
          ))}
        </section>
      </div>
         
    </main>
  );
}
