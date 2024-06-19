import {Fragment, memo, useCallback, useLayoutEffect, useRef, useState} from "react";
import "@/components/File/File.css";
import {ComboBox} from "@progress/kendo-react-dropdowns";

/**
 * @className : FileUpload
 * @description : 파입업로드 컴포넌트
 * @date : 2022-01-03 오후 5:57
 * @author : chauki
 * @version : 1.0.0
 * @see
 * @history :
**/
const FileUpload = (props) => {
    //file state 설정
    const [file, setFile] = useState({
        fileNm : "",
        fileInfo : null
    });

    const defaultAccept = ".zip, .hwp, .hwpx, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt, .bmp, .jpg, .jpeg, .gif, .png, .pdf";
    const accept = props.accept ? props.accept : defaultAccept;
    const fileRef= useRef();

    useLayoutEffect(() => {
        initData();
    }, [])

    //todo componentDIdUpdate
    useLayoutEffect(() => {
        updateData();
    }, [props.defaultValue]);

    const initData = () => {

    };

    const updateData = () => {
        setFile(prevState => ({
            ...prevState,
            fileNm: props.defaultValue ? props.defaultValue : null
        }));
    };

    /**
     * @funcName : onClickFile
     * @description : 파일 업로드 팝업창을 표출한다.
     * @param event : 이벤트 객체
     * @return :
     * @exception :
     * @date : 2022-01-03 오후 5:58
     * @author : chauki
     * @see
     * @history :
    **/
    const onClickFile = useCallback((event) => {
        if (fileRef.current) {
            fileRef.current._element.previousSibling.click();
        }
    }, [file]);

    /**
     * @funcName : onChangeFile
     * @description : 파일 선택 이벤트 핸들러
     * @param event : 이벤트 객체
     * @return :
     * @exception :
     * @date : 2022-01-03 오후 5:58
     * @author : chauki
     * @see
     * @history :
    **/
    const onChangeFile = useCallback((event) => {
        if(event.value !== null){
            if (event.target.files.length > 0) {
                const fileInfo = event.target.files[0];
                setFile(prevState => ({
                    ...prevState,
                    fileNm : fileInfo.name,
                    fileInfo: fileInfo
                }));
    
                if (props.onChange && props.onChange instanceof Function) {
                    props.onChange(event, fileInfo);
                }
    
                event.target.value = "";
    
            }
        }else{
            //선택한 파일 삭제 시
            setFile(prevState => ({
                ...prevState,
                fileNm : "",
                fileInfo : null
            }));

            if (props.onChange && props.onChange instanceof Function) {
                props.onChange(event, null);
            }
        }
      
    }, [file]);

    return (
        <Fragment>
            <div className={"ns-file-upload"}>
                <div className={"file-wrapper"} onClick={onClickFile}>
                    <input
                        type={"file"}
                        name={"fileInfo"}
                        style={{display : "none"}}
                        // 서버와 동일하게 맞춤
                        accept={accept}
                        onChange={onChangeFile}
                    />
                    <ComboBox
                        ref={fileRef}
                        className={""}
                        placeholder={"파일을 선택하세요."}
                        opened={false}
                        disabled={true}
                        value={file.fileNm}
                        style={ props.style || null }
                        onChange={onChangeFile}
                        clearButton = {props.clearButton == undefined || props.clearButton == null ? true : false}
                    />
                </div>

            </div>
        </Fragment>
    );
};
export default memo(FileUpload);
