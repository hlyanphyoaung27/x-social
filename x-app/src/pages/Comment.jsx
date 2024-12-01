import { useApp } from "@/AppContextProvider";
import CmtTemplate from "@/components/CmtTemplate";
import PostCard from "@/components/PostCard";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { fetchPost, putComment, putLike, putUnLike } from "@/lib/fetcher";
import { FaceIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { PopoverContent } from "@radix-ui/react-popover";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function Comment() {
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const { auth } = useApp();
    const bodyRef = useRef();  
    const divRef = useRef(null); 
    const [commentAdded, setCommentAdded] = useState(false);
   
    

    useEffect(() => {
        fetchPost(id).then(data => {
            setPost(data);
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        if (commentAdded && divRef.current) {
            divRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            setCommentAdded(false); 
        }
    }, [commentAdded, post.comments]);

    const like = _id => {
        post.likes = [...post.likes, auth];
        setPost({ ...post });
        putLike(_id);
    };

    const commentLike = _id => {
        post.comments = post.comments.map(comment => {
            if (comment._id === _id) {
                comment.likes = [...comment.likes, auth];
            }
            return comment;
        });
        setPost({ ...post });
        putLike(_id);
    };

    const unLike = _id => {
        post.likes = post.likes.filter(like => like._id !== auth._id);
        setPost({ ...post });
        putUnLike(_id);
    };

    const commentUnlike = _id => {
        post.comments = post.comments.map(comment => {
            if (comment._id === _id) {
                comment.likes = comment.likes.filter(like => like._id !== auth._id);
            }
            return comment;
        });
        setPost({ ...post });
        putUnLike(_id);
    };

    const handleEmojiSelect = ({emoji}) => {
       bodyRef.current.value += emoji   
        }

    
    const handleSubmit = async (e) => {

        e.preventDefault();
        
        const body = bodyRef.current.value;
        if (!body) return false;
        await putComment(body, post._id);
    
       
        const reFetchPost = await fetchPost(post._id);
        setPost(reFetchPost);
        bodyRef.current.value = "";
        setCommentAdded(true); 
    };

    

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <PostCard
                        key={post._id}
                        post={post}
                        like={like}
                        unlike={unLike}
                    />

                    <Badge variant="outline" className="mb-4 py-2 px-5 ms-2">
                        <h2 className="font-bold">{post.comments.length} Comments</h2>
                    </Badge>

                    <div>
                        {post.comments.map(comment => (
                            <CmtTemplate
                                key={comment._id}
                                post={comment}
                                like={commentLike}
                                unlike={commentUnlike}
                            />
                        ))}
                    </div>
                </>
            )}

            <Card className="sticky bottom-0 py-5 px-5">
                <form className="flex" onSubmit={handleSubmit}>
                    <Input ref={bodyRef}  placeholder="Write a comment..." />
                    <Popover >
                        <PopoverTrigger asChild>
                            <Button className="ms-1" variant="ghost" size="icon">
                                <FaceIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent >
                            <Card className="mb-2">
                            <EmojiPicker  emojiStyle="apple" onEmojiClick={handleEmojiSelect}/>
                            </Card>
                        </PopoverContent>
                    </Popover>
                    <Button
                        variant="outline"
                        size="icon"
                        type="submit"
                        className="ms-1"
                    >
                        <PaperPlaneIcon />
                    </Button>
                    
                </form>
            </Card>
            <div ref={divRef} />
        </div>
    );
}
