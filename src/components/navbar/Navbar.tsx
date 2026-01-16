"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import {
  Menu, Search, LogOut, UserCircle, LogIn, Plus,
  Bell, MessageSquare,
  MapPin, Upload, Globe, Image, MapPinned, LayoutGrid,
} from "lucide-react"
import { Sidebar } from "../sidebar/Sidebar"
import { Link, useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"

export function Navbar() {
  const router = useRouter()
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { data: session, isPending } = authClient.useSession()
  const [openCreate, setOpenCreate] = useState(false)

  const Logout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/") },
    })
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur shadow-soft">
      <div className="flex h-16 items-center gap-4 px-4 md:px-8">

        {/* Hamburger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0"><Sidebar /></SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-primary">Food</span>
          <span className="text-muted-foreground">Terest</span>
        </Link>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search recipes, ideas..." className="pl-9 rounded-full bg-muted/50" />
          </div>
        </div>
        <Button size="icon" variant="ghost" className="sm:hidden" onClick={() => setShowMobileSearch(true)}>
          <Search className="h-5 w-5" />
        </Button>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1.5 md:gap-3">

          {/* Create dropdown */}
          {session?.user && (
            <DropdownMenu open={openCreate} onOpenChange={setOpenCreate}>
              <DropdownMenuTrigger asChild>
                <div
                  onMouseEnter={() => setOpenCreate(true)}
                  className=""
                >
                  <Button className="rounded-full cursor-pointer bg-primary text-primary-foreground">
                    <Plus className="md:mr-1 h-4 w-4" /> <span className="hidden md:block">Create</span>
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 py-2 cursor-pointer"
                onMouseEnter={() => setOpenCreate(true)}
                onMouseLeave={() => setOpenCreate(false)}
              >
                <DropdownMenuItem onClick={() => router.push("/create/pin-button")}><MapPin className="mr-3 h-4 w-4  hover:cursor-pointer " /> PinIt Button</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/create/pin")}><Upload className="mr-3 h-4 w-4" /> Upload a pin</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/create/from-website")}><Globe className="mr-3 h-4 w-4" /> Add from a website</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/create/gallery")}><Image className="mr-3 h-4 w-4" /> Gallery pin</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/create/place")}><MapPinned className="mr-3 h-4 w-4" /> Add a Place</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/create/board")}><LayoutGrid className="mr-3 h-4 w-4" /> Create board</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Inbox */}
          {session?.user && (
            <Button className="hidden md:flex" size="icon" variant="ghost" onClick={() => router.push("/inbox")}>
              <MessageSquare className="h-5 w-5" />
            </Button>
          )}

          {/* Activity Dropdown */}
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="px-3 py-2 text-sm font-semibold">Recent Activity</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>❤️ Alex liked your pin</DropdownMenuItem>
                <DropdownMenuItem>💬 Sara commented on your pin</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/activity")} className="text-primary">
                  View all activity
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Profile / Auth */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image || "/user.jpg"} />
                    <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem><UserCircle className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={Logout} className="text-destructive"><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isPending && (
              <Link href="/login">
                <Button className="rounded-full bg-primary text-primary-foreground"><LogIn className="mr-2 h-4 w-4" /> Login</Button>
              </Link>
            )
          )}

          {isPending && <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />}
        </div>

        {/* Mobile search bar */}
        {showMobileSearch && (
          <div className="absolute inset-x-0 top-0 h-16 bg-background z-50 flex items-center px-3 gap-2">
            <Button size="icon" variant="ghost" onClick={() => setShowMobileSearch(false)}>←</Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4" />
              <Input autoFocus placeholder="Search recipes, ideas..." className="pl-9 rounded-full bg-muted/50" />
            </div>
          </div>
        )}

      </div>
    </header>
  )
}
