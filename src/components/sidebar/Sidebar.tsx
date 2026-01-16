"use client"

import Link from "next/link"
import {
  Flame,
  TrendingUp,
  Gift,
  Video,
  Tag,
  Users2,
  Link2,
  HelpCircle,
  FileText,
  Info,
  ChevronRightIcon,
  Grid,
  Layers,
} from "lucide-react"
import { categories, giftRanges, MenuPages } from "@/constants/Sidebar"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { Separator } from "../ui/separator"

export function Sidebar() {
  return (
    <aside className="bg-background">
      <nav className="p-4 space-y-1 mt-8">
        <CategoriesMega />
        <Separator />

        <SidebarLink href="/new" icon={<Flame className="h-4 w-4" />}>
          New
        </SidebarLink>

        <SidebarLink href="/popular" icon={<TrendingUp className="h-4 w-4" />}>
          Popular
        </SidebarLink>

        <GiftsMenu />

        <SidebarLink href="/videos" icon={<Video className="h-4 w-4" />}>
          Videos
        </SidebarLink>

        <SidebarLink href="/" icon={<Tag className="h-4 w-4" />}>
          Tags
        </SidebarLink>

        <Separator className="my-2" />

        <SidebarLink href="/top-users" icon={<Users2 className="h-4 w-4" />}>
          Top users
        </SidebarLink>

        <Separator className="my-2" />

        <SidebarLink href="/pinlt" icon={<Link2 className="h-4 w-4" />}>
          PinIt Button
        </SidebarLink>

        <Pages />

        <SidebarLink href="/help" icon={<HelpCircle className="h-4 w-4" />}>
          Help / Contact Us
        </SidebarLink>

        <SidebarLink href="/terms" icon={<FileText className="h-4 w-4" />}>
          Terms & Privacy
        </SidebarLink>

        <SidebarLink href="/about" icon={<Info className="h-4 w-4" />}>
          What is FoodTerest
        </SidebarLink>
      </nav>
    </aside>
  )
}

function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
        "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      )}
    >
      {icon}
      {children}
    </Link>
  )
}

function CategoriesMega() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            )}
          >
            <Grid className="h-4 w-4" />
            <span className="flex justify-between w-full items-center">Categories <ChevronRightIcon size={16} /></span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          align="start"
          className="w-[700px] rounded-xl border-0 bg-background shadow-soft p-4"
        >
          <div className="grid grid-cols-3 gap-x-6 gap-y-1">
            {categories.map((item, i) => (
              <Link
                key={i}
                href={`/category/${item.slug}`}
                className="
          block px-3 py-2 text-sm rounded-md
          text-muted-foreground
          hover:text-white hover:bg-red-500
          transition-colors
        "
              >
                {item.name}
              </Link>
            ))}
          </div>
        </PopoverContent>

      </div>
    </Popover>
  )
}

function GiftsMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <PopoverTrigger asChild>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Gift className="h-4 w-4" />

            <span className="flex justify-between w-full items-center">Gifts <ChevronRightIcon size={16} /></span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          align="start"
          className="w-[180px] shadow-soft rounded-lg border-0 bg-background p-2"
        >
          <div className="flex flex-col">
            {giftRanges.map((item, i) => (
              <Link
                key={i}
                href={`/gifts/${item.slug}`}
                className="px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-white hover:bg-red-500 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  )
}

function Pages() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <PopoverTrigger asChild>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Layers className="h-4 w-4" />

            <span className="flex justify-between w-full items-center">Pages <ChevronRightIcon size={16} /></span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          align="start"
          className="w-[180px] shadow-soft rounded-lg border-0 bg-background p-2"
        >
          <div className="flex flex-col">
            {MenuPages.map((item, i) => (
              <Link
                key={i}
                href={`/gifts/${item.slug}`}
                className="px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-white hover:bg-red-500 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  )
}