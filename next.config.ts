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
};



export default nextConfig;
