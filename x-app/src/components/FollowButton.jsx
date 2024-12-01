import { useApp } from "@/AppContextProvider"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { putFollow, putUnFollow } from "@/lib/fetcher"

export  default function FollowButton({ user }) {
    const { auth, setAuth } = useApp()
    const [followed, setFollowed] = useState(false);

    useEffect( () => {
        if(auth.following) {
            setFollowed(auth.following.includes(user._id))
        }
    },[auth.following, user._id])
    return (
        <div>
            {auth._id === user._id ? (
                <></>
            ) : (
                <Button
                    onClick={(e) => {
                        e.stopPropagation()
                        if (followed) {
                        const updatefollowing = auth.following.filter(user => user !== user._id)
                            setAuth({ ...auth,  updatefollowing});
                            putUnFollow(user._id)
                        } else {
                           const updatefollowing = [...auth.following,user._id];
                            setAuth({ ...auth, updatefollowing });
                            putFollow(user._id)
                        }
                        setFollowed(!followed)
                    }}
                    variant={followed ? "secondary" : "outline"}
                    size = "sm"
                >
                    {followed ? "following" : "follow"}
                </Button>
            )
            }
        </div>
    )
}