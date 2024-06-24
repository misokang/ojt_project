import {useEffect, useState} from "react";
// import axios from "/src/common/Axios"
import axios from "axios";
import {openApi, api} from "@/common/Axios.jsx";

const PostView = () => {

    const [post, setPost] = useState([]);
    useEffect(() => {
        api.get("api/board/list").then(res => {
            console.log(res)
            setPost(res.data);
            console.log(post);
            
        });
        // fetch("https://www.omdbapi.com/?t=a&apikey=5446cd68").then(res => console.log(res.body))
    //     openApi.get("/?t=a&apikey=5446cd68").then(res => {
    //         console.log(res)
    //         setPost(res.data)
    //     });
    // }, []);
// https://www.pettravel.kr/api/    listArea.do?page=1&pageBlock=10&areaCode=AC01
    // api.get("/listArea.do?page=1&pageBlock=50&areaCode=AC01").then(res => {
    //     console.log(res)
    //     setPost(res.data);
    //     console.log(post);
        
    // });
    
     // console.log("post", post)
    // console.log(post[0]?.resultList),
    // console.log (post[0]?.resultList.map(item => item.title ))
    },[]);
 return (
    <div>
    </div>
 )
    };


export default PostView;
