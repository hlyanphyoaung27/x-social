import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import { Avatar, AvatarFallback } from "./ui/avatar"
import { HeartIcon, ChatBubbleIcon, HeartFilledIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useApp } from "@/AppContextProvider"
import { useNavigate } from "react-router-dom"




export default function CmtTemplate({ post, like, unlike }) {
    const { auth } = useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    

    const isLiked = () => {
        if (!post.likes) return false;
        return post.likes.find(like => {
            return like._id === auth._id;
        });
    }

    console.log(post)


    return (
        <Card className="mb-4" >
            <CardHeader>
                <div className="flex">
                    <Avatar className="w-[38px] h-[38px] ">
                        <AvatarFallback>
                            {post.owner.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ms-2">
                        <small className="font-medium text-sm block mb-1 ">
                            {post.owner.name}
                        </small>
                        <p >
                            {post.body}
                        </p>

                    </div>
                </div>
            </CardHeader>
            <CardFooter className="flex justify-end">
                <div className="flex">
                    <small className="text-muted-foreground font-thin mx-8">
                        {format(post.created, "MM-dd-yyyy")}
                    </small>
                </div>

                <div className="flex">
                    {isLiked() && (
                        <Button variant="ghost" size="icon" onClick={() => {
                            unlike(post._id);

                        }}>
                            <HeartFilledIcon className="h-[20px] w-[20px] text-red-400" />
                        </Button>
                    )}

                    {!isLiked() && (
                        <Button variant="ghost" size="icon" onClick={e => {
                            e.stopPropagation();

                            like(post._id);
                        }}>
                            <HeartIcon className="h-[20px] w-[20px]" />
                        </Button>
                    )}



                    <Button variant="ghost" size="icon" onClick={() => navigate(`/likedusers/${post._id}`)}>
                        {post.likes ? post.likes.length : 0}
                    </Button>


                    <Button variant="ghost" size="icon">
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