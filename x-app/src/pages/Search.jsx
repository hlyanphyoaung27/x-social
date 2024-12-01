import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersList from "@/components/UsersList";
import { fetchSearch, fetchSearchPost } from "@/lib/fetcher";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TabsContent } from "@radix-ui/react-tabs";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
    const nameRef = useRef()
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    return (
        <div>

            <div className="flex items-center border-2 ps-3 mb-3 rounded-xl">
                <MagnifyingGlassIcon className="h-[25px] w-[25px] ms-2 text-muted-foreground" />
                <input
                    className="flex bg-transparent w-full py-3 ms-2 px-3 outline-none"
                    placeholder="Search..."
                    ref={nameRef}
                    onKeyUp={() => {
                        const q = nameRef.current.value;
                        fetchSearch(q).then(data => setUsers(data));
                        fetchSearchPost(q).then(data => setPosts(data));
                        console.log(users)
                        console.log(posts)
                    }
                    }
                />
            </div>

            <Tabs defaultValue="user" >
                <TabsList className="w-full justify-around bg-transparent rounded-lg">
                    <TabsTrigger value="user">
                        Users
                    </TabsTrigger>
                    <Separator orientation="vertical" />
                    <TabsTrigger value="post">
                        Posts
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="user" className="mt-5">
                    <UsersList className="mb-6" users={users} />
                </TabsContent>
                <TabsContent value="post" className="mt-5">
                    {posts.map(post => {
                        return (
                            <PostCard key={post._id} post={post} />
                        )
                    })}
                </TabsContent>
            </Tabs>










        </div>
    )
}