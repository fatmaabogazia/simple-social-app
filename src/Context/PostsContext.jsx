import axios from "axios";
import { createContext } from "react";


export let PostsContext = createContext();

export function PostsContextProvider(props) {

    async function getPosts() {
        return await axios.get("https://route-posts.routemisr.com/posts", {
            headers: {
                // token: localStorage.getItem("userToken")
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            }
        }).then((res) => {
            return res.data.data.data.posts;

        }).catch((err) => {
            return err;
        })
    }

    return <PostsContext.Provider value={{ getPosts }}>
        {props.children}
    </PostsContext.Provider>

}