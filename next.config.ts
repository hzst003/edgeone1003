import type { NextConfig } from "next";

const nextConfig: NextConfig = {
reactStrictMode: true,
  images: {
    unoptimized: true, // 防止 next/image 优化出错
    domains: ["edgeone.hzst.online"], // 如果引用外部图像
  },
};

export default nextConfig;
