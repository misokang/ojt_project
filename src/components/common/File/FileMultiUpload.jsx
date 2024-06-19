import {Fragment, memo, useCallback, useContext, useEffect, useRef, useState} from "react";
import {Upload} from "@progress/kendo-react-all";
import ServiceApi from "@/common/ServiceApi";
import {modalContext} from "@/components/Common/Modal";
import {loadingSpinnerContext} from "@/components/Common/LoadingSpinner";
import "@/components/File/File.css";

const FileMultiUpload = (props) => {
    const fileRef = useRef();
    const loadingSpinner = useContext(loadingSpinnerContext);
    const mode = props.mode !== null && props.mode !== undefined ? props.mode : "read";
    const multiple = useState(props.multiple ? props.multiple : true);
    const [fileGrpNo, setFileGrpNo] = useState(props.fileGrpNo !== null && props.fileGrpNo !== undefined ? props.fileGrpNo : null);
    const [delFileList, setDelFileList] = useState("");
    const extension =  props.allowedExtensions !== null && props.allowedExtensions != undefined ?
        props.allowedExtensions : ["zip", "hwp",  "hwpx", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "bmp", "jpg", "jpeg", "gif", "png", "pdf"]
    const acc = extension.map(item => (
        item = "." + item
    ))


    const modal = useContext(modalContext);

    useEffect(() => {
        if (props.mode === 'write') {
            if (props.isFileSubmit) {
                onDelFile();
            }
        } else {
            if (fileRef.current) {
                fileRef.current.querySelector(".k-file-size").innerText = "파일 크기 정보가 없습니다."
            }
        }
    }, [props.isFileSubmit, fileGrpNo]);
    /**
     * @className : onSaveFile
     * @description : 파일을 저장한다.
     * @date : 2022-01-17 오전 9:14
     * @author : 강보경
     * @version : 1.0.0
     * @see
     * @history :
     **/
    const onSaveFile = () => {
        let uploadBtn = fileRef.current.querySelector(".ns-file-multiupload .k-button.k-upload-selected");

        if (uploadBtn !== null) {
            if (fileGrpNo === null) {
                reqGetFileGroupNo();
                return;
            } else {
                uploadBtn.click();
            }
        } else {
            props.onSuccessCallback(fileGrpNo);
        }
    };

    /**
     * @FuntionName : onDelFile
     * @description : 파일을 삭제한다.
     * @date : 2022-01-25 오전 9:43
     * @author : 강보경
     * @version : 1.0.0
     * @see
     * @history :
     **/
    const onDelFile = async () => {
        if (delFileList.length > 0) {
            //파일삭제
            loadingSpinner.show(fileRef.current);
            try {
                const result = await ServiceApi.file.reqDeleteFileList({attchNoList: delFileList});
                if (result === true) {
                    onSaveFile();
                }
                loadingSpinner.hide();
            } catch (e) {
                console.log(e);
            }
        } else {
            onSaveFile();
        }
    };

    /**
     * @className : reqGetFileGroupNo
     * @description : 파일그룹번호를 생성한다.
     * @date : 2022-01-17 오전 9:15
     * @author : 강보경
     * @version : 1.0.0
     * @see
     * @history :
     **/
    const reqGetFileGroupNo = async () => {
        // console.log(">>>>>>>>>> FILE - reqGetFileGroupNo <<<<<<<<<<");

        try {
            const result = await ServiceApi.file.reqGetFileGroupNo();
            setFileGrpNo(result.attchGroupNo);
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * @className : onFileStatusChange
     * @description : 모든 파일이 저장되었는지 확인한 후 콜백한다.
     * @author : 강보경
     * @version : 1.0.0
     * @see
     * @history :
     **/
    const onFileStatusChange = (e) => {
        // console.log(">>>>>>>>>> FILE - onFileStatusChange <<<<<<<<<<");

        let complete = true;
        e.newState.map((file, index) => {
            if (file.progress > 100) {
                complete = false;
                return;
            }
        });
        if (complete) {
            if (fileRef.current.querySelector(".k-upload-files .k-text-error") === null)
                props.onSuccessCallback(fileGrpNo);
            else
                props.onFailCallback();
        }
    };

    const onChangeFileList = useCallback((event) => {
        let errorList = fileRef.current.querySelectorAll(".k-upload-files .k-file-error");
        for (let el of errorList){
            el.remove();
            modal.showAlert("알림", "지원하지 않는 확장자 파일은 업로드 할 수 없습니다");
        }

        if (fileRef.current) {
            if (fileRef.current.querySelector(".k-upload-files")) {
                fileRef.current.querySelector(".k-dropzone").classList.add("none-border");
            } else {
                fileRef.current.querySelector(".k-dropzone").classList.remove("none-border");
            }
        }
    }, []);

    const onFileDownload = useCallback(async (fileNo) => {
        try {
            const result = await ServiceApi.file.reqGetFileDownload(fileNo);
        } catch (err) {
            modal.showAlert("알림", "파일을 다운로드하지 못하였습니다.");
        }
    }, []);

    return (
        <Fragment>
            <div className={"ns-file-multiupload "} ref={fileRef}>
                <div className={mode}>
                    <Upload
                        batch={false}
                        multiple={props.multiple !== undefined && props.multiple !== null ? props.multiple : true}
                        accept={acc.toString()}
                        restrictions={{
                            allowedExtensions:
                                props.allowedExtensions !== null && props.allowedExtensions != undefined ?
                                    props.allowedExtensions
                                    : ["zip", "hwp", "hwpx", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "bmp", "jpg", "jpeg", "gif", "png", "pdf"],
                        }}
                        defaultFiles={
                            props.defaultFiles !== null && props.defaultFiles !== undefined ?
                                props.defaultFiles
                                : []}
                        withCredentials={false}
                        autoUpload={false}
                        /* showActionButtons={false}*/
                        onClick={(e) => {
                            if (props.defaultFiles !== null && props.defaultFiles !== undefined && mode === 'read') {
                                onFileDownload(props.defaultFiles[e].uid)
                            }
                        }}
                        onAdd={(e) => {
                            onChangeFileList(e)
                        }}
                        onRemove={(e) => {
                            onChangeFileList(e)
                            if (mode === 'write') {
                                if (e.affectedFiles[0].attchNo !== null && e.affectedFiles[0].attchNo !== undefined) {
                                    // let list = [...delFileList];
                                    // list.push(e.affectedFiles[0]);
                                    // setDelFileList(list);
                                    // let list = [...delFileList,e.affectedFiles[0].attchNo];
                                    // setDelFileList(list);
                                    // console.log(delFileList);
                                    if (delFileList === "")
                                        setDelFileList(e.affectedFiles[0].attchNo);
                                    else
                                        setDelFileList(delFileList + "," + e.affectedFiles[0].attchNo);
                                }
                            }
                        }}
                        onBeforeUpload={(e) => {
                            if (mode === 'write') {
                                e.additionalData.fileGroupNo = fileGrpNo;
                            }
                        }}
                        onStatusChange={(e) => {
                            if (props.mode === 'write') {
                                onFileStatusChange(e);
                            }
                        }}
                        saveUrl={"/api/file/fileUpload"}
                        saveHeaders={{"content-type": "multipart/form-data; charset=UTF-8"}}
                    />
                </div>
            </div>
        </Fragment>
    );
};
export default memo(FileMultiUpload)
