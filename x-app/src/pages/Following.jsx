import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UsersList from "@/components/UsersList";
import { getFollowers, getFollowing, getUser } from "@/lib/fetcher";




import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

export default function Following() {
    const {id} = useParams();
    const [loading , setLoading] = useState(true);
    const [user, setUser ] = useState([]);
    useEffect(() => {
        getFollowing(id).then(data => {
            console.log(data)
            setUser(data);
            console.log(user)
            setLoading(false)
        })
    },[id])
    return (
        <>
            <div>
                {loading ? <p>loading</p> : (
                <div> 
                   <Card>
                        <CardHeader>
                        <h1 className="mb-2 font-semibold">{user.name}'s Following</h1>
                        </CardHeader>
                        <CardContent>
                            <UsersList users = {user.following} />
                        </CardContent>
                   </Card>
                </div>             
                  )}
            </div>
        </>
    )
}