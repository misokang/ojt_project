import {createContext, Fragment, useState} from 'react';
import {Notification, NotificationGroup, Slide} from '@progress/kendo-react-all';
import propTypes from "prop-types";

/**
 * notification context
 */
const notificationContext = createContext(null);

/**
 * notification 타입
 */
const NotificationTypes = Object.freeze({
    INFO : "info",
    SUCCESS : "success",
    WARNING : "warning",
    ERROR : "error",
    NONE : "none"
});

/**
 * 타입아웃 정보
 */
const TIMEOUT = 5000;

/**
 * notification Queue
 *
 * @author chauki
 * @version 1.0
 **/
class NotiQueue {

    /**
     * Queue 생성자
     *
     * @author chauki
     * @version 1.0
     **/
    constructor() {
        this.arr = [];
    };

    /**
     * 데이터를 push 한다.
     *
     * @param item 데이터
     * @author chauki
     * @version 1.0
     **/
    put = (item) => {
        this.arr.push(item);
    };

    /**
     * 데이터를 pop 한다.
     *
     * @author chauki
     * @version 1.0
     **/
    get = () => {
        return this.arr.shift();
    };

    /**
     * Queue 사이즈를 반환한다.
     *
     * @author chauki
     * @version 1.0
     **/
    size = () => {
        return this.arr.length;
    };
}

/**
 * Queue 객체
 */
const queue = new NotiQueue();


/**
 * Notification Provider 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const NotificationProvider = (props) => {

    /**
     * notification state
     */
    const [notification, setNotification] = useState({
        type : NotificationTypes.INFO,
        title : "알림",
        content : "",
        confirmCallback : null,
        show : false
    });

    /**
     * Info Notification을 표출한다.
     *
     * @param title 제목
     * @param content 내용
     * @param callback 닫기 버튼 callback
     * @author chauki
     * @version 1.0
     **/
    const info = (title, content, callback) => {
        setQueue(NotificationTypes.INFO, title, content,callback);
    };

    /**
     * Success Notification을 표출한다.
     *
     * @param type Notification Type
     * @param title 제목
     * @param content 내용
     * @param callback 닫기 버튼 callback
     * @author chauki
     * @version 1.0
     **/
    const success = (title, content, callback) => {
        setQueue(NotificationTypes.SUCCESS, title, content,callback);
    };

    /**
     * Error Notification을 표출한다.
     *
     * @param type Notification Type
     * @param title 제목
     * @param content 내용
     * @param callback 닫기 버튼 callback
     * @author chauki
     * @version 1.0
     **/
    const error = (title, content, callback) => {
        setQueue(NotificationTypes.ERROR, title, content,callback);
    };

    /**
     * Warning Notification을 표출한다.
     *
     * @param type Notification Type
     * @param title 제목
     * @param content 내용
     * @param callback 닫기 버튼 callback
     * @author chauki
     * @version 1.0
     **/
    const warning = (title, content, callback) => {
        setQueue(NotificationTypes.WARNING, title, content,callback);
    };

    /**
     * Normal Notification을 표출한다.
     *
     * @param type Notification Type
     * @param title 제목
     * @param content 내용
     * @param callback 닫기 버튼 callback
     * @author chauki
     * @version 1.0
     **/
    const normal = (title, content, callback) => {
        setQueue(NotificationTypes.NONE, title, content,callback);
    };

    /**
     * Notification 정보를 Queue에 저장한다.
     *
     * @param type Notification Type
     * @param title 제목
     * @param content 내용
     * @param callback 닫기 버튼 callback
     * @author chauki
     * @version 1.0
     **/
    const setQueue = (type, title, content, callback) => {
        queue.put({
            type : type,
            title : title,
            content : content,
            callback : callback
        });

        //현재 화면에 Notificaition이 없다면 바로 출력
        //있다면, 기존 Notification이 끝나고 난 후, Queue에서 하나씩 표출
        if (!notification.show) {
            getQueue();
        }
    };

    /**
     * Notificaiton 정보룰 Queue에서 하나씩 가져온다.
     *
     * @author chauki
     * @version 1.0
     **/
    const getQueue = () => {
        const item = queue.get();
        createNotification(item.type, item.title, item.content, TIMEOUT, item.callback);
    };

    /**
     * Notification을 생성한다.
     *
     * @param type Notification Type
     * @param title 제목
     * @param content 내용
     * @param callback 닫기 버튼 callback
     * @author chauki
     * @version 1.0
     **/
    const createNotification = (type, title, content, timeout, callback) => {
        setNotification({
            type : type,
            title : (title !== undefined && title !== null) ? title : "알림",
            content: (content !== undefined && content !== null) ? content : "",
            confirmCallback : (callback != null && callback instanceof Function) ? callback : null,
            show : true
        });

        if (timeout !== undefined && timeout !== null && !Number.isNaN(timeout)) {
            setTimeout(() => {
                setNotification({
                    ...notification,
                    show :  false
                });
                if (queue.size() != 0) {
                    setTimeout(() => {
                        getQueue();
                    }, 1000);
                }
            }, timeout);
        }
    };

    /**
     * Notification을 close 한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const close = () => {
        if (notification.confirmCallback != null) {
            notification.confirmCallback.call();
        }
        setNotification({
            ...notification,
            show : false
        });
    };

    /**
     * Notification을 초기화한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const clear = () => {
        close();
    };

    return (
        <notificationContext.Provider value={{info, success, warning, error, normal, clear}} {...props}>
            {props.children}
            <NotificationItem
                type={notification.type}
                title={notification.title}
                content={notification.content}
                onClose={close}
                show={notification.show} />
        </notificationContext.Provider>
    );
};

NotificationProvider.propTypes = {
    children : propTypes.node
};

/**
 * Notification 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const NotificationItem = ({type,
                          title,
                          content,
                          onClose,
                          show}) => {
    return (
        <Fragment>
            <NotificationGroup style={{right : "0", bottom : "0", alignItems : "flex-start", flexWrap : "wrap-reverse", padding: "10px"}}>
                <Slide direction={"left"}>
                    {
                        show
                        ? <Notification
                                style={{padding : "10px", width : "250px"}}
                                key={type}
                                type={{style: type, icon: true}}
                                closable={true}
                                onClose={onClose}>
                                <div>
                                    <h4 className={"mb15"}><b>{title}</b></h4>
                                    {
                                        content && content.split("\n").map((item, idx) => {
                                            return (<span key={idx}>{item}<br/></span>)
                                        })
                                    }
                                </div>
                          </Notification>
                        : null
                    }
                </Slide>
            </NotificationGroup>
        </Fragment>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export {notificationContext, NotificationProvider};