import {Fragment} from "react";
import '@progress/kendo-theme-default/dist/all.css';
import "@/assets/css/common.css";
import "@/assets/css/kendo_custom.css";
import LoginView from "@/views/Login/LoginView.jsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Cookies} from "react-cookie";
import MainView from "@/views/MainView.jsx";


function App() {
    // const auth = useSelector((store) => store.auth);
    const cookies = new Cookies();

    cookies.set("isLogin", true);
    const auth = {isLogin : true}

    return (
        <Fragment>
            <BrowserRouter >
                <Routes>
                    {
                        auth && auth.isLogin && cookies.get("isLogin") === true ? (
                            <Route path={'/'} element={
                                location.pathname === "/login" ? <Navigate replace to={"/"} /> : <MainView />
                            }/>
                        ) : (
                            <Route path={'/*'} element={<LoginView/>}/>
                        )
                    }
                    <Route path={"/"} element={<LoginView/>}/>
                </Routes>
            </BrowserRouter>
        </Fragment>
    )
}

export default App
