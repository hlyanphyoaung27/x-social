import { useApp } from "@/AppContextProvider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchNotis, putNotiRead } from "@/lib/fetcher";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Key } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Notis() {
    const navigate = useNavigate();
    const { notiCount, setNotiCount } = useApp();
    const [notis, setNotis] = useState([]);

    useEffect(() => {
        fetchNotis().then(data => {
            setNotis(data);

            setNotiCount(data.filter(noti => !noti.read).length)
        })
    }, [])

    const readNoti = id => {
        console.log(id)
        putNotiRead(id);
        setNotiCount(notiCount - 1);
        setNotis(notis.map(noti => {
            if(noti._id == id )  noti.read = true;
            return noti
        }))
    }

    const images = import.meta.env.VITE_IMAGES_URL;


    return (
        <div className="cursor-pointer">
            <div className="flex justify-end  mb-4">
                <button className="border-[1px] rounded-lg px-2 py-1.5 "
                onClick={() => {
                    setNotis(notis.map(noti => {
                     putNotiRead(noti._id)
                       noti.read = true;
                       setNotiCount(0)
                       return noti;
                    }))
                }}
                >
                    <small> Marks all read</small>
                </button>
            </div>

            {notis.map(noti => {
                
                let photo;
                if (noti.user.photo) {
                    photo = `${images}/${noti.user.photo}`
                }

                console.log(noti)
                return (
                    <div className="border-[1px]   py-2.5 px-4 rounded-xl mb-1.5" 
                    style={{opacity: noti.read ? 0.4 : 1}}
                    key={noti._id}
                    >

                        <div className="flex" onClick={() => {
                        navigate(`/details/${noti.target}`)
                        readNoti(noti._id)
                    }}>
                            <Avatar className=" w-[50px] h-[50px] ">
                                <AvatarImage src={photo} />

                                <AvatarFallback className="bg-muted">
                                    {noti.user.name[0]}
                                </AvatarFallback>

                            </Avatar>
                            <div className="ms-3 mt-0.5 font-normal">
                                <p className="font-medium inline">{noti.user.name} </p>{noti.msg}
                                <small className="text-muted-foreground block">
                                {formatDistance(noti.created, new Date())} ago
                                </small>
                            </div>
                            
                        </div>
                    </div >
                )
            })}
        </div>
    )
}