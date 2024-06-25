import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
// import axios from "/src/common/Axios"
import axios from "axios";
import { api, boardApi } from "@/common/Axios.jsx";
import { useNavigate } from 'react-router-dom';
import './Board.css';
function BoardView() {

  const navigate = useNavigate();
  const [post, setPost] = useState([]);
  const navigateToList = (seq) => {
    navigate("/boardDetail", { state: {'seq':seq} });
  }

  const clickDetail = (e)=> {
    let seq = e.target.parentNode.childNodes[0].innerHTML;
    navigateToList(seq);
  
    // 서버랑 통신하는 코드
    // boardApi.get("/member/list.do").then(res => {
    //   console.log("통신 확인");
    //   console.log(res)
    // });

  
    // boardApi.get("/member/list.do", param).then(res => {
    //   console.log("통신 확인");
    //   console.log(res)
    // });  
    
  }

  useEffect(() => {
      // fetch("https://www.omdbapi.com/?t=a&apikey=5446cd68").then(res => console.log(res.body))
  //     openApi.get("/?t=a&apikey=5446cd68").then(res => {
  //         console.log(res)
  //         setPost(res.data)
  //     });
  // }, []);

  // api.get("/listArea.do?page=1&pageBlock=50&areaCode=AC01").then(res => {
  //     let data = res.data[0].resultList;
  //     setPost(data);
  //     // setPost(res.data);
  // });
  api.get("api/board/list").then(res => {
    console.log(res)
    setPost(res.data.result);
    console.log(post);
    
});
  

  },[]);

  return (
      <div className="container">
        <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>게시글번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>내용</th>
              <th>작성일시</th>
            </tr>
          </thead>
          <tbody>
            {
              post.map((data, idx)=>{
                return (
                  <tr onClick={clickDetail} key={idx}>
                    <td>{data.id}</td>
                    <td>{data.title}</td>
                    <td>{data.writer}</td>
                    <td>{data.detail}</td>
                    <td>{data.write_time}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
        </div>
        </div>
  );
}

export default BoardView;
