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
   { title: "镜像", description: "提速                                     ****", href: "/edgeone", thumbnail: "/images/logowasu.png", carddate: "2025-10-13更新" },
    { title: "表格v01", description: "工程信息（功能少快速）                                         ****", href: "/0906projects", thumbnail: "/images/logowasu.png", carddate: "2025-09-08更新" },
    { title: "表格v03", description: "工程信息（慢速）                                         ****", href: "/0923xdatagrid", thumbnail: "/images/logowasu.png", carddate: "2025-09-24更新" },
    { title: "xlsx", description: "上传单份xlsx并显示（支持多sheet）                                    ****", href: "/xlsxupload0924", thumbnail: "/images/xlsxupload.png", carddate: "2025-09-24更新" },    
    { title: "工程量与施工人", description: "至2025-ST-137分册     *****    *************    ", href: "/workermoney", thumbnail: "/images/chineseyuan.png", carddate: "2025-08-29"   },    
    { title: "下载", description: "融合专线未上传部分                                     ***", href: "/rhzx0813",                          thumbnail: "/images/xlsxdownload.png", carddate: "2025-08-13" },
    { title: "图纸查询", description: "2023--2025年157分册图纸                            ***", href: "/0708",                         thumbnail: "/images/pdfdownload.png", carddate: "2025-08-20更新"  },
    { title: "代维井信息", description: "代维井信息查看，拱墅区部分                         ***",  href: "/daiwei0612", thumbnail: "/images/well.jpg", carddate: "2025-06-13" },
     { title: "原链接", description: "未修改之前          页面链接                         ***",  href: "/p0820", thumbnail: "/images/naturallink.png", carddate: "2025-08-20" },
    { title: "全局搜索", description: "至2025-162分册 支持多关健字与减号(-) ****高亮匹配与跳转。", href: "/comprehensivesearch", thumbnail: "/images/Internetsearch.png", carddate: "2025-09-26更新" },
    { title: "文章", description: "                                                       ****", href: "/blog", thumbnail: "/images/blog1.png", carddate: "2025-08-25" },
    { title: "xlsx", description: "批量上传xlsx并显示                                      ****", href: "/xlsxupload0910", thumbnail: "/images/xlsxupload.png", carddate: "2025-09-10更新" },    
    { title: "微型服务器", description: "首次运行时有病毒提示，可忽略                       ***", href: "/微型服务器.zip", thumbnail: "/images/zipdownload.png", carddate: "2025-05-08" },
    { title: "截屏", description: "后台截屏，每秒一张                                     ***", href: "/screenshot0708.zip", badge: "热门", thumbnail: "/images/zipdownload.png", carddate: "2025-07-08" },
    { title: "智能工具", description: "代码生成、**********批量操作与自动化流程。                ", href: "/ai-tools", badge: "AI", thumbnail: "/images/thumb-ai.jpg" },    
    { title: "安全中心", description: "权限、角色与审计日志，保护你的业务数据。             *******", href: "/security", thumbnail: "/images/thumb-security.jpg" },    
    { title: "表格v02", description: "工程信息（淘汰版）                                         ****", href: "/0915mrt", thumbnail: "/images/logowasu.png", carddate: "2025-09-16更新" },
];

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
