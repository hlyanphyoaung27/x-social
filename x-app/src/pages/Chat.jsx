import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UsersList from "@/components/UsersList";
import { getFollowers, getFollowing, getUser } from "@/lib/fetcher";




import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

export default function Chat() {
    const navigate = useNavigate()
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
                        {user.following.map(following => {
                            return <p onClick={() => {navigate(`/chat/${following._id}`)}}>{following.name}</p>
                        })}
                   
                </div>             
                  )}
            </div>
        </>
    )
}