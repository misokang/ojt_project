import {createContext, Fragment, useCallback, useLayoutEffect, useRef, useState} from 'react';
import {Button, Window} from '@progress/kendo-react-all';
import propTypes from "prop-types";

/**
 * 팝업 context
 */
const windowPopupContext = createContext(null);

/**
 *  WindowPopupProvider 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const WindowPopupProvider = (props) => {

    /**
     * popup state
     */
    const [windowPopup, setWindowPopup] = useState({
        title: "알림",
        show: false,
        component: null
    });

    /**
     * window ref
     */
    let windowRef = useRef(null);

    /**
     * 윕도우 팝업을 show 한다.
     *
     * @param title string
     * @param component JSX.Element 들어간 컴포넌트
     * @param options 옵션정보
     * @author chauki
     * @version 1.0
     **/
    const showWindowPopup = (title, component, options) => {
        setWindowPopup(prevState => ({
            ...prevState,
            title: title,
            show: true,
            component: component ? component : null,
            options: options
        }));
    };

    /**
     * 윈도우 팝업을 close 한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const close = () => {
        setWindowPopup(prevState => ({
            ...prevState,
            show: false
        }));
    };

    /**
     * 윈도우 팝업을 clear 한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const clear = () => {
        close();
    };

    return (
        <windowPopupContext.Provider value={{close, showWindowPopup, clear, windowRef}} {...props}>
            {/* eslint-disable-next-line react/prop-types */}
            {props.children}
            <WindowPopup
                windowRef={windowRef}
                show={windowPopup.show}
                title={windowPopup.title}
                component={windowPopup.component}
                options={windowPopup.options}
                onClose={close}/>
        </windowPopupContext.Provider>
    );
};

WindowPopupProvider.propTypes = {
    children: propTypes.node
};

/**
 * 윈도우 팝업 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const WindowPopup = ({
                         windowRef,
                         show,
                         title,
                         component,
                         options,
                         isHeaderHide,
                         onClose
                     }) => {


    //todo componentDidUpdate
    useLayoutEffect(() => {
        if (windowRef.current) {
            let window = windowRef.current.windowElement;
            // window.querySelector(".popup-window .k-window-actions").classList.add("hide");
        }

        //min|maximize 버튼 숨김
        if (show) {
            if (windowRef.current) {
                // setTimeout(() => {
                let window = windowRef.current.windowElement;
                let height = window.offsetHeight;
                window.style.top = "calc(50% - " + (height / 2) + "px)";
                //   })

            }
        }
        if (isHeaderHide !== undefined && isHeaderHide) {
            if (windowRef.current) {
                windowRef.current.windowElement.querySelector(".k-window-titlebar-actions").classList.add("hide");
            }
        }


    }, [windowRef, show]);

    /**
     * onMove 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onMove = useCallback((event) => {
        if (windowRef && windowRef.current) {
            const bodyWidth = document.getElementsByTagName("body")[0].clientWidth;
            const bodyHeight = document.getElementsByTagName("body")[0].clientHeight;
            const offsetRight = event.left + event.width;
            const offsetHeight = event.top + event.height;

            if (offsetRight >= bodyWidth) {
                windowRef.current.windowElement.style.left = (bodyWidth - event.width) + "px";
            }

            if (offsetHeight >= bodyHeight) {
                windowRef.current.windowElement.style.top = (bodyHeight - event.height) + "px";
            }
        }
    }, []);

    return (
        <Fragment>
            {/* <Fade className={props.show ? "pos-abs" : ""}>*/}
            {
                show ?
                    <Window
                        {...windowRef}
                        className={"cmn_popup"}
                        title={
                            <div className={"popTit"}>
                                <h3>사용자 <span className={"fcGreen"}>{title}</span></h3>
                                {
                                    options && options.showRefreshButton === true &&
                                    <Button onClick={(event) => {
                                        if (options && options.onRefresh && options.onRefresh instanceof Function) {
                                            options.onRefresh(event);
                                        }
                                    }}>
                                        {/*<span><i className={"k-icon k-i-refresh"}></i></span>*/}
                                    </Button>
                                }
                            </div>
                        }
                        width={(options && options.width) ? options.width : null}
                        height={(options && options.height) ? options.height : null}
                        minHeight={(options && options.minHeight) ? options.minHeight : null}
                        modal={true}
                        resizable={false}
                        draggable={(options && options.draggable) ? options.draggable : false}
                        doubleClickStageChange={false}
                        onClose={onClose}
                        onStageChange={options && options.onStageChange ? options.onStageChange : null}
                        onMove={onMove}>
                        {component}
                    </Window> : null
            }
            {/* </Fade>*/}
        </Fragment>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export {windowPopupContext, WindowPopupProvider};
