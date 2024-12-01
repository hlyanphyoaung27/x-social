import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { putPost } from "@/lib/fetcher";
import { data } from "autoprefixer";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
    const bodyRef = useRef();
    const navigate = useNavigate()
    const {toast} = useToast()
    return (
        <Card className = "py-5 px-5">
            <form onSubmit={e => {
                e.preventDefault()
                const body = bodyRef.current.value
                if(!body) return false
                putPost(body).then(data => {
                    navigate('/')
                    toast({
                        title: "New post uploaded",
                      })
                })
            }}>
                <Textarea ref={bodyRef} />
                <Button type="submit" variant="outline" className="w-full mt-4">Post</Button>
            </form>
        </Card>
    )
}