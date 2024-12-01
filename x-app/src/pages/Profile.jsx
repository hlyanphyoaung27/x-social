import { useApp } from "@/AppContextProvider";
import FollowButton from "@/components/FollowButton";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUser, putLike, putUnLike, uploadCover, uploadPhoto } from "@/lib/fetcher";
import { data } from "autoprefixer";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
    const { id } = useParams()

    const [post, setPost] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState("");
    const [cover, setCover] = useState("")

    const { auth } = useApp()
    const navigate = useNavigate()



    const like = _id => {

        const result = post.map(post => {
            if (post._id === _id) {
                post.likes = [...post.likes, auth]
            }
            return post
        })
        setPost(result);
        putLike(_id);
    }

    const unlike = _id => {

        const result = post.map(post => {
            if (post._id === _id) {
                post.likes = post.likes.filter(like => like._id !== auth._id)
            }
            return post
        })
        setPost(result);
        putUnLike(_id)
    }

    useEffect(() => {
        (async () => {
            const data = await getUser(id);
            setPost(data.posts);
            setUser(data.user)

            const images = import.meta.env.VITE_IMAGES_URL;
            if (data.user.photo) {
                setPhoto(`${images}/${data.user.photo}`);
            }

            if (data.user.cover) {
                setCover(`${images}/${data.user.cover}`);
            }


            console.log(photo)

            setLoading(false)
        })();
    }, [id, auth])

    const getFile = async () => {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: "Images",
                    accept: {
                        "image/*": [".jpg", ".png", ".jpeg"]
                    }
                }
            ],
            excludeAcceptAllOption: true,
            multiple: false
        });
        return await fileHandle.getFile()
    }

    const changePhoto = async e => {
        if (auth._id !== id) return false;
        const file = await getFile();
        setPhoto(URL.createObjectURL(file));

        const filename =
            file.type === "image/png"
                ? `${id}-photo.png`
                : `${id}-photo.jpg`;

        const formData = new FormData();
        formData.append("photo", file, filename)
        uploadPhoto(auth._id, formData);
    }

    const changeCover = async e => {
        if (auth._id !== id) return false;
        const file = await getFile();
        setCover(URL.createObjectURL(file));

        const filename =
            file.type === "image/png"
                ? `${id}-cover.png`
                : `${id}-cover.jpg`

        const formData = new FormData();
        formData.append("cover", file, filename)
        uploadCover(auth._id, formData)
    }

    return (
        <>
            {loading ? <h1>loading...</h1> : (
                <div>
                    <Card className="h-[200px] flex bg-gray-700 cursor-pointer" onClick={changeCover}>
                        <img src={cover} className="w-full" alt="" />
                    </Card>
                    <div className="flex justify-center items-center mt-[-70px]" >
                        <Avatar className="h-[128px] w-[128px]  cursor-pointer" onClick={changePhoto}>
                            <AvatarImage src={photo} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex justify-center my-4">
                        {auth._id === id ? (<Button variant="secondary" onClick={() => { navigate(`/edit`) }}>
                            Edit Profile
                        </Button>) : (
                            <FollowButton user={user} onClick={() => {
                                setUser()
                            }} />
                        )}
                    </div>

                    <div className="flex justify-center">
                        <h1 className="font-medium">{user.name} <small className="font-thin ms-2">@{user.username}</small></h1>

                    </div>

                    <p className="text-center my-2">{user.bio}</p>

                    <div className="flex justify-center mt-2 mb-10 cursor-pointer">
                        <p onClick={() => {
                            navigate(`/following/${user._id}`)
                        }}>{user.following ? user.following.length : 0} Following</p>
                        <p className="  ms-3" onClick={() => {
                            navigate(`/followers/${user._id}`)
                        }}>
                            {user.followers ? user.followers.length : 0} Followers
                        </p>

                    </div>

                    {post.map(post => {
                        console.log(post.likes)
                        return <PostCard
                            key={post._id}
                            post={post}
                            like={like}
                            unlike={unlike}
                        />
                    })}
                </div>
            )}


        </>
    )
}