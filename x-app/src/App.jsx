import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import Template from "./Template";
import Home from "./pages/Home";
import { ThemeProvider } from "./components/theme-provider";

import { AppContextProvider } from "./AppContextProvider";
import LikedUsers from "./pages/LikedUsers";
import Comment from "./pages/Comment";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";
import Follower from "./pages/Follower";
import Following from "./pages/Following";
import Edit from "./pages/Edit";
import Search from "./pages/Search";
import Notis from "./pages/Notis";
import Chat from "./pages/Chat";
import ChatPage from "./pages/ChatPage";


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/likedusers/:id",
        element: <LikedUsers />
      },
      {
        path: "/details/:id", 
        element: <Comment/>
      },
      {
        path: "/newpost", 
        element: <NewPost />
      },
      {
        path: "/profile/:id", 
        element: <Profile />
      },
      {
        path: "/followers/:id", 
        element: <Follower />
      },
      {
        path: "/following/:id", 
        element: <Following />
      },
      {
        path: "/edit", 
        element: <Edit />
      },
      {
        path: "/search", 
        element: <Search />
      },
      {
        path: "/notis", 
        element: <Notis />
      },
      {
        path: "/chats/:id", 
        element: <Chat />
      },
      {
        path: "/chat/:id", 
        element: <ChatPage />
      }
    ]
  }
]);


export default function App() {




  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}  afterSignOutUrl="/">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppContextProvider>
          <RouterProvider router={router} />
        </AppContextProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
