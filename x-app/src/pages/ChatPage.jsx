import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getChat, putChat } from "@/lib/fetcher";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";


export default function ChatPage() {
    const bodyRef = useRef();
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [chats, setChats ] = useState([]);

    useEffect(() => {
        getChat().then(data => {
            setChats(data);
            
        });
        console.log(chats)
        setLoading(false);
    },[]);

    return (
        <>
           {loading ? <p>loading...</p> : (
            <div>
                {chats.map(chat => {
                    return <p>{chat.body}</p>
                })}
            <form onSubmit={(e) => {
                e.preventDefault();
                const body = bodyRef.current.value;
                if(!body) return false;
                putChat(id, body);
           }}>
                <Input  ref={bodyRef} />
                <Button type = "submit" className="mt-2">Send </Button>
           </form>
        </div>
        )}
        </>
    )
}