import { Clerk } from "@clerk/clerk-js";

const clerkPubKey = "pk_test_Zml0LWxlbW1pbmctNzIuY2xlcmsuYWNjb3VudHMuZGV2JA";
const clerk = new Clerk(clerkPubKey);
await clerk.load();

const api = import.meta.env.VITE_API;
const ws  = new WebSocket("ws://localhost:8080/subscribe");


ws.addEventListener("open", async () => {
  try {
    const token = await clerk.session.getToken({ template: "x" });
    // const token = 
    console.log(token)
    console.log("connection initiated");
    ws.send(token);
  } catch (error) {
    console.error("Error getting token:", error);
  }
});



export default  function WS() {
  return ws;
}

//Login user verify
export async function fetchVerify() {

    const token = await clerk.session.getToken({ template: "x" })
    // const token = 
    console.log(token);
    const res = await fetch(`${api}/users/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(res.ok) {
      return res.json();
    }
    return false;
}

//GEt post
export async function getPosts() {
  const token = await clerk.session.getToken({ template: "x" });
    const res = await fetch(`${api}/posts`,  {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if(res.ok) {
        return res.json();
    }
    return false;
}

export async function fetchPost(id) {
  const res = await fetch(`${api}/posts/${id}`);
  return res.json();
}

//Like & Unlike
export async function putLike(id) {
	
  const token = await clerk.session.getToken({ template: "x" });
	const res = await fetch(`${api}/posts/like/${id}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
  const data = await res.json();
  console.log(data);
	return res.ok;
}
export async function putUnLike(id) {
    const token = await clerk.session.getToken({template: "x"});
    const res = await fetch(`${api}/posts/unlike/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const data = await res.json();
    console.log(data);
    return res.ok
}
  
export async function putFollow(id) {
  const token = await clerk.session.getToken({template: "x"});
  const res = await fetch(`${api}/users/follow/${id}`, {
      method: "PUT",
      headers: {
          Authorization: `Bearer ${token}`
      }
  });
  const data = await res.json();
  console.log(data);
  return res.ok
}

export async function putUnFollow(id) {
  const token = await clerk.session.getToken({template: "x"});
  const res = await fetch(`${api}/users/unfollow/${id}`, {
      method: "PUT",
      headers: {
          Authorization: `Bearer ${token}`
      }
  });
  const data = await res.json();
  console.log(data);
  return res.ok
}

export async function putComment(body, origin) {
  const token = await clerk.session.getToken({template: "x"});
  const res = await fetch(`${api}/posts/comment/${origin}`, {
    method: "POST",
    body: JSON.stringify({body}),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();
  console.log(data);
  return res.ok
}

export async function putPost(body) {
  const token = await clerk.session.getToken({template: "x"});
  const res = await fetch(`${api}/posts`, {
    method: "POST",
    body: JSON.stringify({body}),
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`
    }
  });
  return res.json()
}

export async function getUser(id) {
  const res = await fetch(`${api}/users/${id}`);
  if(!res) return false
  return await res.json();
}

export async function getFollowers(id) {
  const res = await fetch(`${api}/users/followers/${id}`);
  if(!res) return false;
  return await res.json()
}

export async function getFollowing(id) {
  const res = await fetch(`${api}/users/following/${id}`);
  if(!res) return false;
  return await res.json()
}

export async function fetchSearch(q) {
  const res = await fetch(`${api}/users/profile/search?q=${q}`);
  if(!res) return false;
  return await res.json()
}

export async function fetchSearchPost(q) {
  const res = await fetch(`${api}/posts/searchpost/search?q=${q}`);
  if(!res) return false;
  return await res.json()
}

export async function uploadPhoto(id, formData) {
  const token = await clerk.session.getToken({template: "x"});
  const res = await fetch(`${api}/users/photo/${id}`, {
    method: "POST",
    body: formData,
    Authorization: {
      headers:  `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function uploadCover(id, formData) {
  const token = await clerk.session.getToken({template: "x"});
  const res = await fetch(`${api}/users/cover/${id}`, {
    method: "POST",
    body: formData,
    Authorization: {
      headers:  `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function fetchNotis(){
  const token = await clerk.session.getToken({template: "x"});
  const res = await fetch(`${api}/notis`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json();
}

export async function putNotiRead(id) {
  const token = await clerk.session.getToken({template: "x"});
  const res = await fetch(`${api}/notis/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return await res.json();
}

export async function getChat() {
  const token = await clerk.session.getToken({template: "x"});
  const res = await fetch(`${api}/chats`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();
  console.log(data);

  return res.json(data)
}

export async function putChat (origin, body) {
  const token = await clerk.session.getToken({template: "x"});
  const res = await fetch(`${api}/chats/${origin}`, {
    method: "POST",
    body: JSON.stringify({body}),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  return await res.json();
}

