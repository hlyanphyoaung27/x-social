import { useApp } from "@/AppContextProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {  useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Edit() {

    const navigate = useNavigate()

    const {auth, setAuth} = useApp();
    const [hasError , setHaserror ] = useState(false);
    const [errMsg, setErrMsg] = useState("")
    const nameRef = useRef();
    const usernameRef = useRef();
    const bioRef = useRef();
    // const pswRef = useRef();


    return (
        <>
            <Card>
                <CardHeader>
                    <h1 className="font-semibold">Edit your profile...</h1>
                </CardHeader>
                {hasError && (
                    <Alert>
                        <AlertDescription>
                            {errMsg}
                        </AlertDescription>
                    </Alert>
                )}

                <CardContent>
                    <form 
                    onSubmit={ e => {
                        e.preventDefault();
                        setHaserror(false);

                        let name = nameRef.current.value;
                        let bio = bioRef.current.value;
                        // let password = pswRef.current.value;
                        
                        (async() => {
                            const result = name || bio
                            if(!result){
                                setErrMsg("Name or password required");
                                setHaserror(true);
                                return 
                            }
                            setAuthUser(result);
                            navigate(`/profile/${auth._id}`)
                        })();
                    }}  
                    >
                        <div className="mb-3">
                            <small className="ms-1 text-muted-foreground">Name</small>
                            <Input
                            required
                            ref={nameRef}
                            defaultValue = {auth.name}
                            className="mt-2"  />
                        </div>
                        <div className="mb-3">
                            <small className="ms-1 text-muted-foreground">Username</small>
                            <Input 
                            disabled
                            ref={usernameRef}
                            defaultValue={auth.username}
                            className="mt-2"  />
                        </div>
                        <div className="mb-3">
                            <small className="ms-1 text-muted-foreground">Bio ( Optional )</small>
                            <Input 
                            ref={bioRef}
                            defaultValue={auth.bio}
                            className="mt-2"  />
                        </div>
                        <div className="mb-5">
                            <small className="ms-1 text-muted-foreground">Password</small>
                            <Input 
                            // ref={pswRef}
                            placeholder = "Leave blank to unchange."
                            className="mt-2"  />
                        </div>
                    <Button 
                    type="submit"
                    className="w-full" 
                    variant="secondary">
                        Update profile
                    </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}