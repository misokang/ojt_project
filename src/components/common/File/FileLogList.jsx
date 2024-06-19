import {Fragment, memo, useCallback, useContext, useEffect, useState} from "react";
import {util} from "@/common/Common";
import "@/components/File/File.css";
import ServiceApi from "@/common/ServiceApi";
import {modalContext} from "@/components/Common/Modal";
import {loadingSpinnerContext} from "@/components/Common/LoadingSpinner";

/**
 * @className : FileLogList
 * @description : 파일로그 컴포넌트
 * @date : 2022-02-04 오후 4:08
 * @author : chauki
 * @version : 1.0.0
 * @see
 * @history :
**/
const FileLogList = (props) => {

    const loadingSpinner = useContext(loadingSpinnerContext);
    // data state 설정
    const [data, setData] = useState({
        defaultValue :  null,
        fileNo : null,
        fileLogList : null,
        show : false,
        mode : "DETAIL"
    });

    const modal = useContext(modalContext);

    //todo componentDidUpdate
    useEffect(() => {
        updateData();
    }, [props.defaultValue, props.fileNo, props.fileLogList, props.show, props.mode]);

    /**
     * @funcName : updateData
     * @description : 데이터를 업데이트를 한다.
     * @param :
     * @return :
     * @exception :
     * @date : 2022-02-04 오후 4:08
     * @author : chauki
     * @see
     * @history :
    **/
    const updateData = () => {
        setData(prevState => ({
            ...prevState,
            defaultValue : props.defaultValue ? props.defaultValue : null,
            fileLogList : props.fileLogList ? [...props.fileLogList] : null,
            fileNo: props.fileNo ? props.fileNo : null,
            show : props.show,
            mode : props.mode ? props.mode : "DETAIL"
        }));
    };

    /**
     * @funcName : onClickShowFileLog
     * @description : 파일로그 show/hide 클릭 이벤트 핸들러
     * @param event : 이벤트 객체
     * @return :
     * @exception :
     * @date : 2022-02-04 오후 4:09
     * @author : chauki
     * @see
     * @history :
    **/
    const onClickShowFileLog = useCallback((event) => {
        if (props.onChange && props.onChange instanceof Function) {
            props.onChange(!data.show);
        }
        setData(prevState => (({
            ...prevState,
            show : !data.show
        })));
    }, [data]);

    /**
     * @funcName : fileDownload
     * @description : 파일다운로드를 한다.
     * @param fileNo : 파일 번호
     * @return :
     * @exception :
     * @date : 2022-02-04 오후 4:09
     * @author : chauki
     * @see
     * @history :
    **/

    useEffect(() => {
        if(props.onClickVal){
            fileDownload(data.fileNo)
        }
    }, [props.onClickVal]);

    const fileDownload = useCallback(async (fileNo) => {
        loadingSpinner.show();
        try {
            await ServiceApi.file.reqGetFileDownload(fileNo);
        }catch (err) {
            modal.showAlert("알림", "파일을 다운로드 하지 못하였습니다.");
        }finally {
            loadingSpinner.hide();
        }
    }, []);

    return (
        <Fragment>
            <div className={"ns-file-log"} style={props.style || null}>
                {
                    data.defaultValue
                    ?
                        <div className={"fileList"}>
                            {
                                data.mode === "DETAIL"
                                ?
                                    <Fragment>
                                        <div className={"file-wrapper"}>
                                            {
                                                data.fileLogList &&
                                                <a className={"file-log"} href={"#"} onClick={onClickShowFileLog} />
                                            }
                                            <span className={"ellipsis"} style={{width : "calc(100% - 50px)"}}>{util.setInitialValueForString(data.defaultValue, "-")}</span>
                                        </div>
                                        {
                                            data.defaultValue &&
                                            <div className={"file-download-wrapper"}>
                                                <a className={"download"} onClick={() => fileDownload(data.fileNo)}>다운로드</a>
                                                {/*<span className={"k-icon k-i-attachment-45"}></span>*/}
                                            </div>
                                        }
                                    </Fragment>
                                :
                                    <Fragment>
                                        <div className={"file-wrapper"}>
                                            {
                                                data.fileLogList &&
                                                <a className={"file-log"} href={"#"} onClick={onClickShowFileLog} />
                                            }
                                            <span className={"ellipsis simple"} style={{width : "calc(100% - 20px)", maxWidth : "none"}}  onClick={() => fileDownload(data.fileNo)}>{util.setInitialValueForString(data.defaultValue, "-")}</span>
                                        </div>
                                    </Fragment>
                            }

                            <div className={"file-log-wrapper"} style={{display : data.show === true ? "block" : "none"}}>
                                <ul>
                                    {
                                        data.fileLogList && data.fileLogList.map((item, index) => (
                                            <li key={index}>
                                                <a className={"ellipsis"}>{item.fileNm}</a>
                                                <span className={"mt5"}>{item.rgstDttm}</span>
                                                <a className={"download mt5"} onClick={() => fileDownload(item.attchNo)}>다운로드</a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    :   "-"
                }
            </div>
        </Fragment>
    );
};
export default memo(FileLogList);
