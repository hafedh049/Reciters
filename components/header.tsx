"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Info, Mail, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 md:h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl md:text-2xl font-bold text-primary">QuranicAudio</span>
        </Link>
        <nav className="flex items-center">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn(
              "hidden md:flex relative group",
              isActive("/") && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
              {isActive("/") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-foreground scale-x-100 group-hover:scale-x-90 transition-transform duration-200"></span>
              )}
            </Link>
          </Button>
          <Button
            variant={isActive("https://quran.com") ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn(
              "hidden md:flex relative group",
              isActive("https://quran.com") && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Link href="https://quran.com" target="_blank">
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Quran.com</span>
              {isActive("https://quran.com") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-foreground scale-x-100 group-hover:scale-x-90 transition-transform duration-200"></span>
              )}
            </Link>
          </Button>
          <Button
            variant={isActive("/about") ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn(
              "hidden md:flex relative group",
              isActive("/about") && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Link href="/about">
              <Info className="mr-2 h-4 w-4" />
              <span>About</span>
              {isActive("/about") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-foreground scale-x-100 group-hover:scale-x-90 transition-transform duration-200"></span>
              )}
            </Link>
          </Button>
          <Button
            variant={isActive("/contact") ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn(
              "hidden md:flex relative group",
              isActive("/contact") && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" />
              <span>Contact</span>
              {isActive("/contact") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-foreground scale-x-100 group-hover:scale-x-90 transition-transform duration-200"></span>
              )}
            </Link>
          </Button>

          {/* Mobile icons only */}
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="icon"
            asChild
            className={cn(
              "md:hidden relative",
              isActive("/") && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Link href="/">
              <Home className="h-5 w-5" />
              {isActive("/") && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-foreground rounded-full"></span>
              )}
            </Link>
          </Button>
          <Button
            variant={isActive("https://quran.com") ? "default" : "ghost"}
            size="icon"
            asChild
            className={cn(
              "md:hidden relative",
              isActive("https://quran.com") && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Link href="https://quran.com" target="_blank">
              <BookOpen className="h-5 w-5" />
              {isActive("https://quran.com") && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-foreground rounded-full"></span>
              )}
            </Link>
          </Button>
          <Button
            variant={isActive("/about") ? "default" : "ghost"}
            size="icon"
            asChild
            className={cn(
              "md:hidden relative",
              isActive("/about") && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Link href="/about">
              <Info className="h-5 w-5" />
              {isActive("/about") && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-foreground rounded-full"></span>
              )}
            </Link>
          </Button>
          <Button
            variant={isActive("/contact") ? "default" : "ghost"}
            size="icon"
            asChild
            className={cn(
              "md:hidden relative",
              isActive("/contact") && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Link href="/contact">
              <Mail className="h-5 w-5" />
              {isActive("/contact") && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-foreground rounded-full"></span>
              )}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

