import { useApp } from "@/AppContextProvider"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { CardContent } from "./ui/card"
import {  useState } from "react"
import { putFollow, putUnFollow } from "@/lib/fetcher"
import FollowButton from "./FollowButton"
import { useNavigate } from "react-router-dom"

export default function UsersList({ users  }) {
   
const navigate = useNavigate();
    const { auth, setAuth } = useApp()

return (
    <div >
            {users.map(user => {
                
                return (
                    <CardContent className="flex justify-between">
                        <div className="flex">
                            <Avatar className="w-[50px] h-[50px] ">
                                <AvatarFallback>
                                    {user.name[0]}
                                </AvatarFallback>
                            </Avatar>

                            <div className="ms-3 cursor-pointer" onClick={() => navigate(`/profile/${user._id}`)}>
                                <p className="font-normal" >{user.name}</p>
                                <small className="font-thin text-purple-400">{user.bio}</small>

                            </div>
                        </div>

                        <FollowButton user={user}/>
                    </CardContent>
                )
            })}
        </div>

    )
}

