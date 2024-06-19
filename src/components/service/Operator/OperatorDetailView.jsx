import {Fragment, memo, useCallback, useState} from "react";
import {Button, Input} from "@progress/kendo-react-all";
import CustomDropDownList from "@/components/common/Custom/CustomDropDownList.jsx";
import {Form, Formik} from "formik";

const OperatorDetailView = ({type, target, onSubmitCallback, initData}) => {

    const [data, setData] = useState({
        userId: (initData && initData.userId) ? initData.userId : "",
        userName: (initData && initData.userName) ? initData.userName : "",
        telephone: (initData && initData.telephone) ? initData.telephone : "",
        cellphone: (initData && initData.cellphone) ? initData.cellphone : "",
        position: (initData && initData.position) ? initData.position : "",
        department: (initData && initData.department) ? initData.department : "",
        authorityId: (initData && initData.authorityId) ? initData.authorityId : "AUTH000002"
    })

    const onCloseClick = useCallback(() => {
        if (target) {
            console.log(target)
            target.close();
        }
    }, [target]);

    const onBtnClick = useCallback(() => {
        console.log(">>>onAddClick", type, data)
        onSubmitCallback(type, data)
    }, [data, onSubmitCallback]);

    const onChangeHandler = useCallback((name, event) => {
        console.log(">>>onChangeHandler", event)
        setData(prevState => ({
            ...prevState,
            [name]: event.value
        }));
    }, []);

    return (
        <Fragment>
            <Formik
                enableReinitialize={true}
                onSubmit={onBtnClick}
                initialValues={data}>
                <Form>
                    <div className={"popTbl"}>
                        <table className={"tbl iptCol2"}>
                            <colgroup>
                                <col width={"340"}/>
                                <col width={"40"}/>
                                <col width={"340"}/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <td>
                                    <div className={"cmn_pop_ipt"}>
                                        <span className={"iptTit"}>사용자 ID</span>
                                        <Input
                                            name={"userId"}
                                            type={"text"}
                                            style={{width: "100%"}}
                                            placeholder={"아이디를 입력해주세요."}
                                            defaultValue={data.userId}
                                            disabled={type === 'MOD'}
                                            required={true}
                                            onChange={(event) => onChangeHandler("userId", event)}
                                        />
                                    </div>
                                </td>
                                <td></td>
                                <td>
                                    <div className={"cmn_pop_ipt"}>
                                        <span className={"iptTit"}>이름</span>
                                        <Input
                                            name={"userName"}
                                            type={"text"}
                                            style={{width: "100%"}}
                                            defaultValue={data.userName}
                                            placeholder={"이름를 입력해주세요."}
                                            required={true}
                                            onChange={(event) => onChangeHandler("userName", event)}
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <div className="cmn_pop_ipt w218">
                                        <span className={"iptTit"}>권한</span>
                                        <CustomDropDownList
                                            style={{width: "100%"}}
                                            textField={"text"}
                                            dataItemKey={"value"}
                                            defaultValue={data.authorityId}
                                            data={[
                                                {text: '관리자 권한', value: 'AUTH000001'},
                                                {text: '사용자 권한', value: 'AUTH000002'},
                                            ]}
                                            onChange={(event) => onChangeHandler("authorityId", event.value)}
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={"cmn_pop_ipt"}>
                                        <span className={"iptTit"}>전화번호</span>
                                        <Input
                                            name={"tel"}
                                            type={"tel"}
                                            style={{width: "100%"}}
                                            defaultValue={data.telephone}
                                            inputMode={"tel"}
                                            placeholder={"전화번호를를 입력해주세요."}
                                            required={true}
                                            onChange={(event) => onChangeHandler("telephone", event)}
                                        />
                                    </div>
                                </td>
                                <td></td>
                                <td>
                                    <div className={"cmn_pop_ipt"}>
                                        <span className={"iptTit"}>휴대번호</span>
                                        <Input
                                            name={"cellphone"}
                                            type={"tel"}
                                            style={{width: "100%"}}
                                            defaultValue={data.cellphone}
                                            placeholder={"휴대번호를를 입력해주세요."}
                                            required={true}
                                            onChange={(event) => onChangeHandler("cellphone", event)}
                                        />
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div className={"cmn_pop_ipt"}>
                                        <span className={"iptTit"}>직위</span>
                                        <Input
                                            name={"position"}
                                            type={"text"}
                                            style={{width: "100%"}}
                                            defaultValue={data.position}
                                            placeholder={"직위를 입력해주세요."}
                                            required={true}
                                            onChange={(event) => onChangeHandler("position", event)}
                                        />
                                    </div>
                                </td>
                                <td></td>
                                <td>
                                    <div className={"cmn_pop_ipt"}>
                                        <span className={"iptTit"}>소속</span>
                                        <Input
                                            name={"department"}
                                            type={"text"}
                                            placeholder={"소속를 입력해주세요."}
                                            defaultValue={data.department}
                                            style={{width: "100%"}}
                                            required={true}
                                            onChange={(event) => onChangeHandler("department", event)}
                                        />
                                    </div>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                    <div className={"decoLine"}></div>
                    <div className={"popBtn"}>
                        <div className={"btnWrap"}>
                            {type && type === 'ADD' ?
                                <Button type={"submit"} className={"btnL k-button-solid-primary"}> 등록 </Button> : null
                            }
                            {type && type === 'MOD' ?
                                <Button type={"submit"} className={"btnL btnTxt k-button-solid-primary"}> 수정 </Button> : null
                            }
                            <Button className={"btnL btnTxt type01"} onClick={onCloseClick}> 취소 </Button>
                        </div>
                    </div>
                </Form>
            </Formik>
        </Fragment>
    );
};

export default memo(OperatorDetailView);