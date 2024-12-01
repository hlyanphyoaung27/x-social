import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UsersList from "@/components/UsersList";
import { fetchPost, getPosts } from "@/lib/fetcher";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LikedUsers() {
    const { id } = useParams();
    const [ users, setUsers ] = useState([]);
    const [ loading , setLoading ] = useState(true);

    useEffect(() => {
		fetchPost(id).then(data => {
            console.log(data)
			setUsers(data.likes);
			setLoading(false);
		});
	}, [id]);

    console.log(users)
    return(
        <Card>
            <CardHeader className="mb-4">
            <h3 className="font-semibold">The people who liked your post...</h3>

            </CardHeader>
                <UsersList users={users}/>
               
           
        </Card>
    )
}