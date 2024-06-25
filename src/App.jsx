import {Fragment} from "react";
import '@progress/kendo-theme-default/dist/all.css';
import "@/assets/css/common.css";
import "@/assets/css/kendo_custom.css";
import LoginView from "@/views/Login/LoginView.jsx";
import SampleView from "@/views/Sample/SampleView.jsx";
import OperatorDetailView from "@/components/service/Operator/OperatorDetailView.jsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Cookies} from "react-cookie";
import MainView from "@/views/MainView.jsx";
import AddForm from "./components/Post/AddForm";
import BoardView from "./views/Board/boardView";
import 'bootstrap/dist/css/bootstrap.min.css';
import BoardDetail from "./views/Board/BoardDetail.jsx";
function App() {
    // const auth = useSelector((store) => store.auth);
    const cookies = new Cookies();

    cookies.set("isLogin", true);
    const auth = {isLogin : false}

    return (
        <Fragment>
            <BrowserRouter >
                <Routes>
                {/* <Route path={'/'} element={<MainView />}/> */}
                <Route path={"/"} element={<LoginView/>}/>
                <Route path={'/main'} element={<MainView />}/>
                {/* <Route path={'/login'} element={<LoginView/>}/> */}
                <Route path={'/sample'} element={<SampleView/>}/>
                <Route path={'/operator'} element={<OperatorDetailView/>}/>
                <Route path={'/board'} element={<BoardView/>}/>
                <Route path={'/boardDetail'} element={<BoardDetail/>}/>
                </Routes>
            </BrowserRouter>
        </Fragment>
    )
}

export default App
