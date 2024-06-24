import {Fragment, memo, useCallback, useState} from "react";
import {Button, Input} from "@progress/kendo-react-all";
import {Form, Formik} from "formik";
import ServiceApi from "@/common/ServiceApi.js";
import {util} from "@/common/Common.js";
import {useNavigate} from "react-router";
import {Cookies} from "react-cookie";
import {useDispatch} from "react-redux";
import {setAuthList} from "@/redux/reducer/AuthReducer.js";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cookies = new Cookies();

    const [formData, setFormData] = useState({
        emplId: "",
        pwd: null
    })

    async function doLogin() {
        //let id = formData.emplId, pwd = formData.pwd;
        //const publicKey = await ServiceApi.common.reqGetPublicKey(id, pwd);
        const publicKey = await ServiceApi.common.reqGetPublicKey();
        if (util.apiValidationCheck(publicKey)) {
            const encryptPwd = util.encryptText(publicKey.item.publicKey, formData.pwd)

            const result = await ServiceApi.login.reqPostLoginInfo(formData.emplId, encryptPwd)
           // const result = await ServiceApi.login.reqPostLoginInfo(formData.emplId, pwd);
            if (util.apiValidationCheck(result)) {
                localStorage.setItem("refreshToken", result.item.refreshToken);
                cookies.set("isLogin", true, {path: "/"});

                dispatch(setAuthList({
                    ...result.item
                }))

                 navigate("/operator", {replace: true})
                // navigate("/board", {replace: true})
            }
        }
    }

    const onChangeHandler = useCallback((name, event) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: event.value
        }));
    }, []);

    return (
        <Fragment>
            <Formik onSubmit={doLogin} initialValues={formData}>
                <Form>
                    <div className={"login"}>
                        <main className="loginWrap">
                            <div className="loginContents">

                                <h1 className="loginLogo">React <span className="fcGreen">Sample</span></h1>
                                <fieldset className="loginForm">
                                    <Input
                                        name={"id"}
                                        type={"text"}
                                        placeholder={"아이디를 입력해주세요."}
                                        value={formData.emplId}
                                        onChange={(event) => onChangeHandler("emplId", event)}
                                        required={true}
                                    />
                                    <Input
                                        name={"password"}
                                        type={"password"}
                                        placeholder={"비밀번호를 입력해주세요"}
                                        minLength={4}
                                        maxLength={16}
                                        onChange={(event) => onChangeHandler("pwd", event)}
                                        required={true}
                                    />
                                </fieldset>
                                <div className="loginBtm">
                                </div>
                                <Button
                                    themeColor={"primary"}
                                    className={"loginBtn h60"}
                                    id={"login"}
                                    type={"submit"}>로그인</Button>
                            </div>
                        </main>
                    </div>
                </Form>
            </Formik>
        </Fragment>
    )
}

export default memo(Login);
