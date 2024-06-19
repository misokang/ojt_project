import {createContext, Fragment, useLayoutEffect, useRef, useState} from 'react';
import {Button, Window} from '@progress/kendo-react-all';
import propTypes from "prop-types";

/**
 * modal context
 */
const modalContext = createContext(null);

/**
 * Modal Provider 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const ModalProvider = (props) => {

    /**
     * modal state
     */
    const [modal, setModal] = useState({
        type : "alert",
        title : "알림",
        content : "",
        btnList : null,
        show : false,
        isBtnHide : false,
        confirmCallback : null,
        options : null
    });

    /**
     * Alert를 화면에 표출한다.
     *
     * @param title 제목
     * @param content 내용
     * @param options 옵션 정보
     * @param callback 콜백함수
     * @author chauki
     * @version 1.0
     **/
    const showAlert = (title, content, options, callback) => {
        setModal(prevState => ({
            ...prevState,
            type : "alert",
            title : title,
            content : content,
            show : true,
            confirmCallback : (callback != null && callback instanceof Function) ? callback : null,
            isBtnHide : options && options.isBtnHide ? options.isBtnHide : false
        }));
    };

    /**
     * Confirm창을 화면에 표출한다.
     *
     * @param title 제목
     * @param content 내용
     * @param btnOptions 버튼 옵션
     * @author chauki
     * @version 1.0
     **/
    const showConfirm = (title, content, btnOptions) => {
        setModal(prevState => ({
            ...prevState,
            type : "confirm",
            title : title,
            content : content,
            btnList : btnOptions && btnOptions.btns ? btnOptions.btns : null,
            show : true,
            isBtnHide : btnOptions && btnOptions.isBtnHide ? btnOptions.isBtnHide : false,
            confirmCallback : null
        }));
    };

    /**
     *  modal 창을 close 한다
     *
     * @author chauki
     * @version 1.0
     **/
    const close = () => {
        setModal(prevState => ({
            ...prevState,
            show : false
        }));
    };

    /**
     * 확인 클릭 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const confirm = (event) => {
        if (modal.confirmCallback != null && modal.type === "alert") {
            modal.confirmCallback.call(undefined, event);
        }
        close(event);
    };

    /**
     * modal을 clear 한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const clear = () => {
        close(null);
    };

    return (
        <modalContext.Provider value={{close, showAlert, showConfirm, clear}} {...props}>
            {props.children}
            <Modal
                type={modal.type}
                show={modal.show}
                title={modal.title}
                content={modal.content}
                btns={modal.btnList}
                isBtnHide={modal.isBtnHide}
                width={400}
                onConfirm={confirm}
                onClose={close} />
        </modalContext.Provider>
    );
};

ModalProvider.propTypes = {
    children : propTypes.node
};

/**
 * Modal 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const Modal = ({type,
               show,
               title,
               content,
               btns,
               isBtnHide,
               width,
               onConfirm,
               onClose}) => {

    /**
     * window popup ref
     */
    const windowRef = useRef();

    //todo componentDidUpdate
    useLayoutEffect(() => {
        //min|maximize 버튼 숨김
        if (show) {
            if (windowRef && windowRef.current) {
                const window = windowRef.current.windowElement;
                if (window.querySelector(".alert-window .k-window-actions")) {
                    window.querySelector(".alert-window .k-window-actions").classList.add("hide");
                }
                if (window.querySelector(".alert-window .k-i-window-minimize")) {
                    window.querySelector(".alert-window .k-i-window-minimize").style.display = "none";
                }
                if (window.querySelector(".alert-window .k-i-window-maximize")) {
                    window.querySelector(".alert-window .k-i-window-maximize").style.display = "none";
                }
                window.style.top =  "calc(50% - " + (window.offsetHeight / 2) + "px)";
            }
        }
    });

    return (
        <Fragment>
            {/*<Fade className={props.show ? "pos-abs" : ""}>*/}
                {
                    show ?
                        <Window
                            {...windowRef}
                            className={"alert-window"}
                            title={title}
                            initialWidth={width}
                            minHeight={200}
                            modal={true}
                            resizable={false}
                            draggable={false}
                            doubleClickStageChange={false}
                            onClose={onClose}>
                            <div className={"content-wrapper popupLayer"}>
                                <div>
                                    {
                                        content &&
                                        content.split("\n").map((item, idx) => {
                                            return (<strong key={idx}>{item}<br/></strong>)
                                        })
                                    }
                                </div>
                            </div>
                            {
                                !isBtnHide ? <div className={"mt20 ac"}>
                                        {
                                            // 1. type이 alert인지 confirm인지 판별
                                            // 2. alert 일 경우, 확인버튼을 만들고 callback을 생성한다.
                                            // 3. confirm 일 경우, btn 파라미터가 있는지 판별하고
                                            //    있을 경우, btns의 갯수만큼 버튼 생성
                                            //    없을 경우, 확인/취소 버튼을 default로 생성
                                            type === "alert"
                                                ? <Button className={"btn"} style={{width : "135px"}} onClick={onConfirm}>확인</Button>
                                                : (btns != null
                                                        ? <div>
                                                            {
                                                                btns.map((item, idx) => {
                                                                    return <Button key={idx}
                                                                                   className={"btn " + (idx !== btns.length-1 ? "mr10" : "")}
                                                                                   style={{width : (item.width !== undefined ? item.width +"px" : "120px"), background : (item.background ? item.background : "rgba(58, 65, 80, 0.3)")}}
                                                                                   onClick={(event) => {
                                                                                       if ((item.click !== null || true) && item.click instanceof Function) {
                                                                                           event.preventDefault();
                                                                                           event.stopPropagation();
                                                                                           item.click.call(undefined, event);
                                                                                       }
                                                                                       if (onClose && onClose instanceof Function) {
                                                                                           onClose(event);
                                                                                       }
                                                                                   }}>{item.title}</Button>
                                                                })
                                                            }
                                                        </div>
                                                        : <div>
                                                            <Button className={"btn mr10"} style={{background : "rgba(58, 65, 80, 0.3)"}} onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                onConfirm(event);
                                                            }}>확인</Button>
                                                            <Button className={"btn"} style={{background : "rgba(58, 65, 80, 0.3)"}} onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                onClose(event);
                                                            }}>취소</Button>
                                                        </div>
                                                )
                                        }
                                    </div>
                                    : null
                            }

                        </Window>: null
                }
           {/* </Fade>*/}
        </Fragment>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export {modalContext, ModalProvider, Modal};
