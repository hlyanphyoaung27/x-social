import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function Template () {
    return (
        <>
            <Header />
            <div className = "max-w-screen-sm mx-auto px-3 mb-3 ">
                <Outlet />
            </div>
        </>
    )
}