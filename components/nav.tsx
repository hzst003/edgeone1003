"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Menu } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Image from "next/image";
export default function Navbar() {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { name: "首页", href: "/" },
    { name: "服务", href: "/services" },
    { name: "关于我们", href: "/about" },
    { name: "联系我们", href: "/contact" },
  ]

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="返回首页" className="inline-flex items-center gap-6">
          <Image
            src="/xulogo.png"    // 放在 public/logo.svg
            alt="MySite Logo"
            width={45}
            height={45}
            priority={true}
            style={{ height: "auto" }}
          />
          <span className="text-xl font-bold text-blue-600">Ai 建站</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              {/* ✅ 无障碍标题，屏幕阅读器可见，视觉上隐藏 */}
              <VisuallyHidden>
                <SheetTitle>导航菜单</SheetTitle>
              </VisuallyHidden>

              <div className="flex flex-col mt-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-gray-700 text-lg font-medium hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Separator className="my-2" />
                <Button className="mt-2">登录</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
