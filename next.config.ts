import type { NextConfig } from "next";

const nextConfig: NextConfig = {
reactStrictMode: true,
  images: {
    unoptimized: true, // 防止 next/image 优化出错
    domains: ["edgeone.hzst.online"], // 如果引用外部图像
     remotePatterns: [
      {
        protocol: 'https',
        hostname: 'net-cloud.xhey.top',
        pathname: '/group/photo/**', // 匹配该路径下所有图片
      },
    ],
  },

  // ✅ 忽略 TypeScript 类型检查错误
  typescript: {
    ignoreBuildErrors: true,
  },
  // ✅ 忽略 ESLint 检查错误（例如变量未使用等）
  eslint: {
    ignoreDuringBuilds: true,
  },
};



export default nextConfig;
