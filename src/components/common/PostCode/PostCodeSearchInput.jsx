import {Fragment, memo, useCallback, useEffect, useRef, useState} from "react";
import "@/components/PostCode/PostCode.css";
import PostCode from "@/components/PostCode/PostCode";
import {Button, Input, Popup} from "@progress/kendo-react-all";


/**
 * 우편번호 검색 Input 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const PostCodeSearchInput = (props) => {

    /**
     * data state
     */
    const [data, setData] = useState({
        postCode : "",
        show : false
    });

    /**
     * input ref
     */
    const inputRef = useRef(null);

    /**
     * center ref
     */
    const contentRef = useRef(null);

    //todo componentDidUpdate
    useEffect(() => {
        updateData();
    }, [props.defaultValue]);

    /**
     * 데이터를 업데이트 한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const updateData = () => {
        if(props.defaultValue !== null){
            setData(prevState => ({
                ...prevState,
                postCode : props.defaultValue
            }))
        }
    };

    /**
     * show PostCode dropdownList
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onShowPostCode = useCallback((event) => {
        if (!data.show) {
            event.target.classList.add("k-state-focused");
        }else {
            event.target.classList.remove("k-state-focused");
        }
        setData(prevState => ({
            ...prevState,
            show : !data.show
        }));
    }, [data]);

    /**
     * 우편번호 검색 완료 이벤트 핸들러
     *
     * @param postData 선택된 우편번호 정보
     * @author chauki
     * @version 1.0
     **/
    const onComplete = useCallback((postData) => {
        if (props.onComplete && props.onComplete instanceof Function) {
            props.onComplete(postData);
        }
        setData(prevState => ({
            ...prevState,
            postCode : postData.postCode,
            show : false
        }));
    }, [data]);

    /**
     * postcode dropdownlist close 이벤트
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onClose = useCallback((event) => {
        if (inputRef.current) {
            inputRef.current._input.classList.remove("k-state-focused");
        }
    }, []);

    /**
     * 팝업을 닫는다.
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onClosePopup = useCallback((event) => {
        setData(prevState => ({
            ...prevState,
            show : false
        }))
    }, [data]);

    return (
        <Fragment>
            <div className={"ns-post-search-input"}>
                <Input
                    style={props.style ? props.style : null}
                    ref={inputRef}
                    onClick={onShowPostCode}
                    readOnly={true}
                    value={data.postCode}
                    placeholder={props.placeholder ? props.placeholder : null}
                />
                <Popup
                    className={"popup-wrapper-postcode"}
                    offset={{
                        top : inputRef.current ? inputRef.current._input.getBoundingClientRect().top + inputRef.current._input.offsetHeight : 0,
                        left : inputRef.current ? inputRef.current._input.getBoundingClientRect().left : 0
                    }}
                    style={{width: inputRef.current ? inputRef.current._input.offsetWidth < 350 ? "350px" : inputRef.current._input.offsetWidth : "350px"}}
                    show={data.show}
                    onClose={onClose}>
                    <div tabIndex={0}
                         ref={contentRef}>
                        <PostCode onComplete={onComplete}
                                  focusInput={true}
                                  hideEngBtn={true}
                                  hideMapBtn={true}
                        />
                    </div>
                    <div className={"ar"}>
                        <Button style={{width: "100%", color: "#000", borderRadius : "0px"}} onClick={onClosePopup}>닫기</Button>
                    </div>
                </Popup>
            </div>
        </Fragment>
    )
};
export default memo(PostCodeSearchInput);
