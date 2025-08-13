import React, { useEffect } from 'react'
import { MenuIcon, School, Store } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import DarkMode from '@/DarkMode'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Link, useNavigate } from 'react-router-dom'
import { userLoggedOut } from '@/features/authslice'
import { useLogoutUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'




const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };
  console.log(user);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User log out.")
      navigate("/login");
    }
  }, [isSuccess])
  return (
    <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex items-center justify-between h-full gap-10 px-4">
        <div className='flex items-center gap-2'>
          <School size={"30"} />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl">SkillXpert</h1>
          </Link>
          
        </div>
        <div className='flex items-center gap-5'>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={user?.photoURL || "https://github.com/evilrabbit.png"}
                    alt="@evilrabbit"
                  />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem><Link to="my-learning">My Learning</Link></DropdownMenuItem>
                  <DropdownMenuItem><Link to="profile">Edit Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>Log out</DropdownMenuItem>
                </DropdownMenuGroup>
                {
                  user.role === "instructor" && (
                   <>
                   <DropdownMenuSeparator/>
                <DropdownMenuItem><Link to="/admin/dashboard">
                  Dashboard
                </Link></DropdownMenuItem>
                   </> 
                  )
                }

              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='flex items-center gap-2'>
              <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between h-full px-4">
        <h1 className='font-extrabold text-2xl'>BrightPath</h1>
        <MobilNavbar />
      </div>
    </div>
  )
}

export function MobilNavbar() {
  const role = "instructor";

  return (
    <Sheet className="">
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full bg-gray-200 hover:bg-gray-200" variant="outline"><MenuIcon /></Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-2/3">
        <SheetHeader className="flex flex-row justify-between mt-10">
          <SheetTitle>BrigthPath</SheetTitle>
          <DarkMode />
        </SheetHeader>

        <nav className='flex flex-col space-y-4 ml-4 w-10/12'>
          <span className=""><Link to="my-learning">My Learning</Link></span>
          <span className=""><Link to="profile">Edit Profile</Link></span>
          <span className="">Log out</span>
          {
            role === "instructor" && (

              <Button type="submit" className="">Dashboard</Button>
            )
          }
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default Navbar