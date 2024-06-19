import {Fragment} from "react";
import '@progress/kendo-theme-default/dist/all.css';
import "@/assets/css/common.css"; //TODO 원복
import "@/assets/css/kendo_custom.css";
import LoginView from "@/components/views/Login/LoginView.jsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import {Cookies} from "react-cookie";
import OperatorView from "@/components/views/Operator/OperatorView.jsx";


function App() {
    const auth = useSelector((store) => store.auth);
    const cookies = new Cookies();

    return (
        <Fragment>
            <BrowserRouter >
                <Routes>
                    {
                        auth && auth.isLogin && cookies.get("isLogin") === true ? (
                            <Route path={'/'} element={
                                location.pathname === "/login" ? <Navigate replace to={"/"} /> : <OperatorView />
                            }/>
                        ) : (
                            <Route path={'/*'} element={<LoginView/>}/>
                        )
                    }
                    <Route path={"/"} element={<LoginView/>}/>
                    <Route path={"/operator"} element={<OperatorView/>}/>

                </Routes>
            </BrowserRouter>
        </Fragment>
    )
}

export default App
