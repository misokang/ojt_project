import {createContext, Fragment, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Button, Window} from '@progress/kendo-react-all';
import {modalContext} from "@/components/common/Context/Modal";
import propTypes from "prop-types";


/**
 * multi popup context
 */
const multiWindowPopupContext = createContext(null);

/**
 * multi Popup provider 컴포넌트
 *
 * @author youngkwan-ji
 * @version 1.0
 **/
const MultiWindowPopupProvider = (props) => {

    /**
     * multi popup 목록 state
     */
    const [multiWindowPopupList, setMultiWindowPopupList] = useState({});

    /**
     * popup ref
     */
    const ref = useRef(null);

    /**
     * modal context
     */
    const modal = useContext(modalContext);

    //todo componentDidUpdate
    useEffect(() => {
        ref.current = multiWindowPopupList
    }, [multiWindowPopupList]);

    /**
     * 팝업을 생성한다.
     *
     * @param id 팝업 아이디
     * @param title 제목
     * @param component 컴포넌트
     * @param options 옵션정보
     * @author youngkwan-ji
     * @version 1.0
     **/
    const addWindowPopup = (id, title, component, options) => {
        if (options.maxCnt && options.maxCnt <= Object.values((ref.current)).length)
            return modal.showAlert("알림", "팝업은 최대 " + options.maxCnt +"개까지만 사용할 수 있습니다.");

        if (ref.current[id] !== null && ref.current[id] !== undefined) {
            // 열려있는
            const popup = ref.current[id]
            return modal.showAlert("알림", '"' + popup.props.title + '"' + "가 이미 존재 합니다.");
        } else {
            if (options.showGrid) {
                const popWidth = options.width ? options.width : options.initialWidth ? options.initialWidth : null
                const popHeight = options.height ? options.height : options.initialHeight ? options.initialHeight : null
                const position = getPosition(popWidth, popHeight, options.showGrid)
                if (position.left && position.top) {
                    options.initialTop = position.top
                    options.initialLeft = position.left
                }
            }

            const popup = <MultiWindowPopup
                                            title={title}
                                            component={component}
                                            options={options}
                                            onClose={remove}
                                            key={id}
                                            id={id}/>
            setMultiWindowPopupList(prevState => ({
                ...prevState,
                [id]: popup
            }));
        }
    };

    /**
     * 팝업 위치정보를 가져온다.
     *
     * @param pWidth 너비
     * @param pHeight 높이
     * @param align 배치 타입
     * @author youngkwan-ji
     * @version 1.0
     **/
    const getPosition = (pWidth, pHeight, align) => {
        const DEFAULT_LEFT_MARGIN = 15
        const DEFAULT_TOP_MARGIN = 15

        const width = pWidth + DEFAULT_LEFT_MARGIN
        const height = pHeight + DEFAULT_TOP_MARGIN
        const popCnt = Object.values((ref.current)).length + 1

        let topResult;
        let leftResult
        if (align === "vertical"){
            // 현재 화면 상 수직 한줄에 띄울 수 있는 팝업 갯수
            const visibleVerticalCnt = Math.floor(window.innerHeight / height)
            const standard = popCnt / visibleVerticalCnt
            const horizonPoint = Math.floor(Object.values((ref.current)).length / visibleVerticalCnt)
            const verticalPoint = (standard - horizonPoint) === 0 ? 1 :(standard - horizonPoint)

            topResult = (visibleVerticalCnt * verticalPoint * height) - height + DEFAULT_TOP_MARGIN
            leftResult = (horizonPoint * width) + DEFAULT_LEFT_MARGIN
        }else{
            // 현재 화면 상 수평 한줄에 띄울 수 있는 팝업 갯수
            const visibleHorizonCnt = Math.floor(window.innerWidth / width)
            const standard = popCnt / visibleHorizonCnt
            const horizonPoint = Math.floor(Object.values((ref.current)).length / visibleHorizonCnt)
            const verticalPoint = (standard - horizonPoint) === 0 ? 1 :(standard - horizonPoint)

            topResult = (horizonPoint * height) + DEFAULT_TOP_MARGIN
            leftResult = (visibleHorizonCnt * verticalPoint * width) - width + DEFAULT_LEFT_MARGIN
        }

        // 화면 다차면 중앙
        if ((topResult + pHeight) >= window.innerHeight
            || (leftResult + pWidth) >= window.innerWidth){
            topResult = null
            leftResult = null
        }

        return {left :leftResult, top : topResult}
    };

    /**
     * 팝업을 삭제한다.
     *
     * @param id 팝업 아이디
     * @author youngkwan-ji
     * @version 1.0
     **/
    const remove = (id) => {
        setMultiWindowPopupList(prevState => {
            const prevList = {...prevState}
            delete prevList[id]
            return prevList
        });
    };

    /**
     * 팝업을 초기화한다.
     *
     * @author youngkwan-ji
     * @version 1.0
     **/
    const clear = () => {
        setMultiWindowPopupList({})
    };

    return (
        <multiWindowPopupContext.Provider value={{addWindowPopup, remove, clear, multiWindowPopupList}} {...props}>
            {props.children}
            {Object.values((multiWindowPopupList))}
        </multiWindowPopupContext.Provider>
    );
};

MultiWindowPopupProvider.propTypes = {
    children : propTypes.node
};


/**
 * multi 팝업 컴포넌트
 *
 * @author youngkwan-ji
 * @version 1.0
 **/
const MultiWindowPopup = ({title,
                          component,
                          options,
                          onClose,
                          key,
                          id}) => {

    /**
     * window ref
     */
    const windowRef = useRef();

    /**
     * 최소화 여부
     */
    const isMinimum = false;

    /**
     * onMove 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @author youngkwan-ji
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
            <Window
                {...windowRef}
                className={isMinimum ? "ns-multi-popup-window popup-window minimum " : "ns-multi-popup-window popup-window"}
                id={id}
                title={
                    <div className={"title-wrapper"}>
                        <span className={options.titleCls ? options.titleCls : ""}>{title}</span>
                        {
                            options && options.showRefreshButton === true &&
                            <Button onClick={(event) => {
                                if (options && options.onRefresh && options.onRefresh instanceof Function) {
                                    options.onRefresh(event);
                                }
                            }}>
                                <span><i className={"k-icon k-i-refresh"}></i></span>
                            </Button>
                        }
                    </div>

                }
                initialTop={options.initialTop ? options.initialTop : undefined}
                initialLeft={options.initialLeft ? options.initialLeft : undefined}
                width={(options && options.width) ? options.width : undefined}
                height={(options && options.height) ? options.height : undefined}
                initialWidth={(options && options.initialWidth) ? options.initialWidth : undefined}
                initialHeight={(options && options.initialHeight) ? options.initialHeight : undefined}
                modal={(options && options.modal != null) ? options.modal : true}
                resizable={(options && options.resizable) ? options.resizable : false}
                draggable={(options && options.draggable) ? options.draggable : false}
                onStageChange={options.onStageChange}
                doubleClickStageChange={false}
                onClose={() => {
                    onClose(id);
                    if (options.onClose && options.onClose instanceof Function) {
                        options.onClose(id);
                    }
                }}
                onMove={onMove}>
                {component}

                {/* <div className={"ns-multi-popup-window-content"} style={{display: isMinimum ? 'none' : 'flex'}}>
                {props.component}
                <WindowActionsBar>
                    <Button
                        className={"ns-multi-popup-close btn"}
                        onClick={() => props.onClose(props.id)}
                    >닫기
                    </Button>
                </WindowActionsBar>
            </div>*/}
            </Window>
        </Fragment>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export default {multiWindowPopupContext, MultiWindowPopupProvider};
