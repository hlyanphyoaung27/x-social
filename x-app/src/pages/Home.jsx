
import { useApp } from "@/AppContextProvider";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import  { getPosts, putLike, putUnLike } from "@/lib/fetcher";


import { useEffect, useState } from "react";

export default function Home () {
    const [ posts , setPosts ] = useState([]);
    const {auth} = useApp();

  console.log(posts)
   

    const like = _id  => {
		const result = posts.map(post => {
			if (post._id === _id) {
				post.likes = [...post.likes, auth];
			}

			return post;
		});

		setPosts(result);
		 putLike(_id);
	};

	const unlike = _id => {
		const result = posts.map(post => {
			if (post._id === _id) {
				post.likes = post.likes.filter(like => like._id !== auth._id);
			}

			return post;
		});

		setPosts(result);
		putUnLike(_id);
	};

    useEffect( () => {
        (async () => {
            const data = await getPosts();
            if(!data ) console.log("fetch error");
            console.log(data)

            setPosts(data)
        })();
        },[]);

    return (
        
        <div>
            <div className="text-center mb-4 space-x-4 ">
                <Button variant="ghost" >Latest</Button>
                <span className="border-r-2"></span>
                <Button variant= "ghost">Followed</Button>

            </div>
            <div>
                
                {posts.map(post => (
                <PostCard
                    key={post._id}
                    post={post}
                    like={like}
                    unlike={unlike}
                />
            ))}
            </div>
        </div>
 
    )
}