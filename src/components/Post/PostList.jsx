import {useEffect, useState} from "react";
// import axios from "/src/common/Axios"
import axios from "axios";
import {openApi} from "@/common/Axios.jsx";

const PostView = () => {

    const [post, setPost] = useState({});
    useEffect(() => {

        // fetch("https://www.omdbapi.com/?t=a&apikey=5446cd68").then(res => console.log(res.body))
        openApi.get("/?t=a&apikey=5446cd68").then(res => {
            console.log(res)
            setPost(res.data)
        });
    }, []);

    console.log("post", post)
    return (
        <div>
            {post.Title}
        </div>
    );
};

export default PostView;
