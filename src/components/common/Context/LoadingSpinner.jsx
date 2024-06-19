import {createContext, Fragment, useState} from 'react';
import {ClipLoader} from "react-spinners";
import propTypes from "prop-types";

/**
 * loading spinner context
 */
const loadingSpinnerContext = createContext(null);

/**
 * Loading Spinner Provider 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const LoadingProvider = (props) => {

    /**
     * spinner state
     */
    const [spinner, setSpinner] = useState({
        loading : false,
        target : null,
        color : "#fff",
        size : 20
    });

    /**
     * Loading Spinner를 show 한다.
     *
     * @param target target 엘리먼트(optional) - target 엘리먼트 내에 loading spinner 생성
     * @param color loading spinner color(optional)
     * @param size loading spinner size(optional)
     * @author chauki
     * @version 1.0
     **/
    const show = (target, color, size) => {
        setSpinner({
            loading : true,
            target :  (target !== undefined && target !== null) ? target : spinner.target,
            color : (color !== undefined && color !== null) ? color : spinner.color,
            size : (size !== undefined && size !== null) ? size : spinner.size
        });
    };

    /**
     * Loading Spinner를 hide 한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const hide = () => {
        //setTimeout(() => {
            setSpinner({
                ...spinner,
                loading : false
            });
        //}, 300);
    };

    /**
     * loading spinner를 clear 한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const clear = () => {
        hide();
    };

    return (
        <loadingSpinnerContext.Provider value={{show, hide, clear}} {...props}>
            {props.children}
            <LoadingSpinner
                loading={spinner.loading}
                color={spinner.color}
                size={spinner.size}
                target={spinner.target}
            />
        </loadingSpinnerContext.Provider>
    );
};

LoadingProvider.propTypes = {
    children: propTypes.node
};

/**
 * Loading Spinner 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const LoadingSpinner = ({loading, color, size, target}) => {

    /**
     * mask style
     */
    let maskStyle;
    if (target == null) {
        maskStyle = {
            position : "absolute",
            top : "0",
            width : "100%",
            height : "100%",
            backgroundColor: "transparent",
            opacity: "1",
            zIndex: 300000
        };
    }
    //target이 있을 경우,
    //target 영역에 loading spinner를 생성하기 위해 영역 계산
    else {
        const rect = target.getBoundingClientRect();
        maskStyle = {
            position : "absolute",
            top : rect.top,
            left : rect.left,
            width : rect.width,
            height : rect.height,
            backgroundColor: "transparent",
            opacity: "1"
        };
    }

    //spinner style 설정
    const padding = 20;
    const css = {
        margin:"0 auto",
        position: "absolute",
        left:"calc(50% - " + (parseInt(size/2) + padding) + "px)",
        top:"calc(50% - " + (parseInt(size/2) + padding) + "px)",
        padding: padding +"px",
/*        border : "1px solid #ddd",*/
        borderRadius: "5px",
        background : "rgba(58, 65, 80, 0.6)",
        zIndex : 30000
    };

    return (
        <Fragment>
            {
                loading
                    ? <div style={maskStyle}>
                        <div style={css}>
                            <ClipLoader color={color} loading={loading} size={size}/>
                        </div>
                      </div>
                    : null
            }
        </Fragment>
    );
};

export {loadingSpinnerContext, LoadingProvider};
