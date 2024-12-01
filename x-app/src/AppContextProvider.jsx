import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import WS, { fetchNotis, fetchVerify } from "./lib/fetcher";




// Define your API URL
const api = "http://localhost:8080"; // Adjust as needed

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppContextProvider({ children }) {
  const [auth, setAuth ] = useState(false);
  const [notiCount, setNotiCount ] = useState(null);
  
  useEffect(() => {
	

		const ws = WS();
		ws.addEventListener("message", e => {
			const msg = JSON.parse(e.data);
			if (msg.type === "notis") {
				setNotiCount(msg.count);
			}
		});

		fetchVerify().then(user => setAuth(user));

		
		fetchNotis().then(data =>
			setNotiCount(data.filter(noti => !noti.read).length)
		);
	}, []);

  return (
    <AppContext.Provider value={{ auth, setAuth, notiCount, setNotiCount }}>
      {children}
    </AppContext.Provider>
  );
}
