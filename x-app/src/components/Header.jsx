import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"
import { Input } from "./ui/input"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { BellIcon, ChatBubbleIcon, EnterIcon, HomeIcon, Pencil2Icon, PersonIcon, PlusIcon } from "@radix-ui/react-icons"
import { SignedOut, SignInButton, SignOutButton, SignUpButton, useUser } from "@clerk/clerk-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { set } from "date-fns"
import { useApp } from "@/AppContextProvider"
import Home from "@/pages/Home"
import { ArrowLeft } from "lucide-react"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"




export default function Header() {

    const navigate = useNavigate();
    const {pathname} = useLocation()
    // const {user} = useUser();

    const { auth, setAuth, notiCount } = useApp();
    console.log(notiCount)

    const images = import.meta.env.VITE_IMAGES_URL;
    let photo ;
    if(auth.photo) {
        photo = `${images}/${auth.photo}`
    }

    const DrawerList = (
        <div>
            <div className="flex h-[230px]  rounded-md relative justify-center">
                <Avatar className="w-[100px] h-[100px] mt-8  absolute ">
                    <AvatarImage src = {photo} />
                    <AvatarFallback>H</AvatarFallback>
                </Avatar>
                <h2 className="absolute font-normal  mt-36">{auth.name}</h2>
                <small className="absolute  mt-[172px]">@{auth.username}</small>
            </div>

            <Separator className="rounded-md" orientation="horizontal"/>

            <div className="mt-6 rounded-md " >
                <Button variant="ghost" className="w-[300px] justify-start" 
                onClick={() => navigate("/")} >
                    <HomeIcon className="ms-3 h-[25px] w-[25px]" />
                    <span className="ms-5 font-semibold">Home</span>
                </Button>

            </div>

            {!auth && (<div className="mt-2" >

                {/* clerk */}

                <SignUpButton>
                    <Button variant="ghost" className="w-[300px] justify-start ">
                        <Pencil2Icon className="ms-3 h-[25px] w-[25px]" />
                        <span className="ms-5 font-semibold">Register</span>
                    </Button>
                </SignUpButton>



                <SignInButton>
                    <Button variant="ghost" className="w-[300px] mb-4 justify-start mt-1">
                        <EnterIcon className="ms-3 h-[25px] w-[25px]" />
                        <span className="ms-5 font-semibold">Login</span>
                    </Button>
                </SignInButton>

            </div>)}

            {auth && (
                <div className="mt=2">
                    <Button variant="ghost" className="w-[300px]  justify-start mt-1" onClick = {() => {
                        navigate(`/profile/${auth._id}`)
                    }}>
                        <PersonIcon className="ms-3 h-[25px] w-[25px]" />
                        <span className="ms-5 font-semibold">Profile</span>
                    </Button>

                    <SignOutButton>
                        <Button variant="ghost" className="w-[300px] mb-4 justify-start mt-1" onClick = { () => {
                            setAuth(false);
                        ;
                    }}>
                            <EnterIcon className="ms-3 h-[25px] w-[25px]" />
                            <span className="ms-5 font-semibold">Logout</span>
                        </Button>
                    </SignOutButton>

                </div>
            )}
        </div>

    )

    return (
        <>
            <nav className="border  rounded-md py-2 px-4 mb-4 flex justify-between sticky top-0 backdrop-blur-md  bg-background">

                <div className="flex">

                    {pathname === '/' ? (
                         <Drawer direction="left">
                         <DrawerTrigger>
                             <Button variant="ghost" className="mx-2">
                                 <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                             </Button>
                         </DrawerTrigger>
 
                         <DrawerContent className="flex flex-col rounded-t-[10px] h-full w-[300px] mt-24 fixed bottom-0 right-0">
                             <DrawerClose>
                                 {DrawerList}
                             </DrawerClose>
                         </DrawerContent>
                     </Drawer> 
                    ) : (
                        <Button className="mx-2" size="icon" variant="ghost" onClick={() => navigate(-1)}>
                            <ArrowLeft className="mt-0.5"/>
                        </Button>
                    )}
                   

                    <h1 className="font-semibold mt-2">Social</h1>
                   
                </div>

                <div className="flex">
                <Button  variant="ghost" size="icon" onClick={() => {
                    navigate("/newpost")
                }}>
                      <PlusIcon className="w-[20px] h-[20px] " />
                    </Button>

                    <Button className="ms-1" size="icon" variant="ghost" onClick={() => {navigate("/search")}}>
                        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </Button>

                    <Button className="ms-1" size="icon" variant="ghost" onClick = {() => {navigate(`/chats/${auth._id}`)}}>
                       <ChatBubbleIcon className="w-[20px] h-[20px]" />
                    </Button>

                    <Button className="ms-1" size="icon" variant="ghost" onClick={() => {navigate("/notis")}}>
                        
                         <BellIcon className="absolute h-[20px] w-[20px]"/>
                        
                            <Badge variant="destructive" className="relative ms-5 mb-3.5">
                                
                                {notiCount}
                            </Badge>    
                       
                        
                    </Button>

                    <ModeToggle />
                </div>

            </nav>
        </>
    )
}