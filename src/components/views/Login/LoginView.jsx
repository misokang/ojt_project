import {Fragment, memo} from "react";
import Login from "@/components/service/Login/Login.jsx";

const LoginView = () => {
    return (
        <Fragment>
            <Login />
        </Fragment>
    )
}
export default memo(LoginView);
