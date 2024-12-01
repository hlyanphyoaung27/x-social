import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { HeartIcon, ChatBubbleIcon, HeartFilledIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useApp } from "@/AppContextProvider"
import { useNavigate } from "react-router-dom"




export default function PostCard({ post, like, unlike }) {
    const {auth} = useApp();
    const navigate = useNavigate();



    const isLiked = () =>{ 
        if(!post.likes) return false;
		  return post.likes.find(like => {
			return like._id === auth._id;
		});
	}

    

    const images = import.meta.env.VITE_IMAGES_URL;
    let photo;
    if(post.owner.photo) {
        photo = `${images}/${post.owner.photo}`
    }
 

    return (
        <Card className="mb-4 cursor-pointer">
            <CardHeader>
                <div className="flex ">
                    <Avatar className="w-[65px] h-[65px] ">
                        <AvatarImage src={photo}/>
                        <AvatarFallback className="bg-muted">
                            {post.owner.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ms-2 mt-2"> 
                        <h3 className="font-medium" onClick={() => navigate(`/profile/${post.owner._id}`)}>
                            {post.owner.name}
                        </h3>
                        <small className="text-muted-foreground font-thin">
                            {format(post.created, "MM-dd-yyyy")}
                        </small>
                    </div>
                </div>
            </CardHeader>
            <CardContent  onClick={() => navigate(`/details/${post._id}`)}>
                <p>
                    {post.body}
                </p>
            </CardContent>
            <CardFooter className="justify-around">
                <div className="flex">
                    {isLiked() && (
                        <Button variant="ghost" size="icon" onClick={() => {
                            unlike(post._id);  
                           
                        }}>
                            <HeartFilledIcon   className="h-[20px] w-[20px] text-red-400" />
                        </Button>
                    )}
                    
                    {!isLiked() && (
                        <Button variant="ghost" size="icon" onClick={e => {
                            e.stopPropagation();
                            
                            like(post._id);
                        }}>
                            <HeartIcon  className="h-[20px] w-[20px]" />
                        </Button>
                    )}



                    <Button variant="ghost" size="icon" onClick = {() => navigate(`/likedusers/${post._id}`)}>
                        {post.likes ? post.likes.length : 0}
                    </Button>
                </div>

                <div className="flex">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/details/${post._id}`)}>
                        <ChatBubbleIcon className="h-[20px] w-[20px]" />
                    </Button>
                    <Button variant="ghost" size="icon" >
                        {post.comments ? post.comments.length : 0}
                    </Button>
                </div>
            </CardFooter>
        </Card>

    );
}