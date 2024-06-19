import {cloneElement, Fragment, useCallback, useContext, useEffect, useState} from 'react'
import {useHistory, useLocation} from "react-router";
import '@components/common/MegaMenu/MegaMenu.css';
import {data} from "@components/common/NaviMenu/NaviMenu";
import {useSelector} from "react-redux";
import {modalContext} from "@components/common/Common/Modal";

/**
 * 메가메뉴 컴포넌트
 *
 * @author youngkwan-ji
 * @version 1.0
 **/
const MegaMenu = (props) => {
    return (
        <div className={'ns-mega-menu'}>
            {
                props.container
                /*   ?   props.container // use custom
                   :   // use default
                       <React.Fragment>
                           <MegaMenuBrand title={props.title} logo={props.logo}/>
                           <MegaMenuList data={props.data} remoteUrl={props.remoteUrl}/>
                       </React.Fragment>*/
            }
        </div>
    )
};

/**
 * 메가 메뉴 Container
 *
 * @author youngkwan-ji
 * @version 1.0
 **/
const MegaMenuContainer = (props) => {

    /**
     * open 여부
     */
    const [isOpen, setIsOpen] = useState(false);

    /**
     * 메뉴 open 이벤트 콜백
     *
     * @author youngkwan-ji
     * @version 1.0
     **/
    const dropMenuOpen = useCallback(()=> {
        setIsOpen(true)
    },[isOpen])

    /**
     * 메뉴 close 이벤트 콜백
     *
     * @author youngkwan-ji
     * @version 1.0
     **/
    const dropMenuClose = useCallback(()=> {
        setIsOpen(false)
    },[isOpen])

    /**
     * 메뉴 이벤트 등록
     *
     * @param elem 엘리먼트
     * @author youngkwan-ji
     * @version 1.0
     **/
    const AddDropMenuEventProps = (elem) => {
        return cloneElement(elem, {
            onMenuOpen: dropMenuOpen
            , onMenuClose: dropMenuClose
        })
    };

    return (
        <Fragment>
            <div className={isOpen ? "ns-menu-container open" : "ns-menu-container close"}
                 onMouseLeave={dropMenuClose}>
                <ul className={"ns-menu-items"}>
                    {
                        props.leftItems
                            ? <li className={"mega-left-item"}
                                  onMouseEnter={dropMenuOpen}>
                                {AddDropMenuEventProps(props.leftItems)}
                            </li>
                            : null
                    }
                    {
                        props.centerItems
                            ? <li className={"mega-center-item"}
                                  onMouseEnter={dropMenuOpen}>
                                {AddDropMenuEventProps(props.centerItems)}
                            </li>
                            : null
                    }
                    {
                        props.rightItems
                            ? <li className={"mega-right-item"}>
                                {AddDropMenuEventProps(props.rightItems)}
                            </li>
                            : null
                    }
                </ul>
            </div>
        </Fragment>
    );
};

/**
 * 메가메뉴 목록 컴포넌트
 *
 * @author youngkwan-ji
 * @version 1.0
 **/
const MegaMenuList = (props) => {

    /**
     * auth state
     */
    const auth = useSelector((store) => store.auth);

    /**
     * location
     */
    const location = useLocation();

    /**
     * location path
     */
    const [locationPath, setLocationPath] = useState([]);

    /**
     * 메뉴 목록 state
     */
    const [menuList, setMenuList] = useState(null);

    //todo componentDidMount
    useEffect(() => {
        if (!props.sso) {
            if (auth.user) {
                if (auth.user.userGrad === "U01") { //일반운용자
                    const tmpData = data.filter((item) => {
                        return item.path !== "settings" && item.path !== "systems";
                    });
                    setMenuList([...tmpData]);
                }else {
                    setMenuList([...data]);
                }
            }
        }else {
            const tmpData = data.filter((item) => {
                return item.path !== "settings" && item.path !== "systems";
            });
            setMenuList([...tmpData]);
        }
    }, []);

    //todo componentDidUpdate
    useEffect(() => {
        const paths = location.pathname.split("/")
        paths.splice(0, 1)
        setLocationPath(paths)
    }, [location]);

    return (
        <Fragment>
            {
                menuList &&
                <MegaMenuWrapper data={menuList}
                                 onMenuOpen={props.onMenuOpen}
                                 onMenuClose={props.onMenuClose}
                                 nowLocation={locationPath}/>
            }
        </Fragment>
    );
};

/**
 * 메가 메뉴 Wrapper 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const MegaMenuWrapper = (props) => {
    const [menuInfo, setMenuInfo] = useState(
        props.data
    )
    return (
        <Fragment>
            <ul className={"ns-menu-list-dept-0"}>
                {
                    menuInfo.map((dept1, index) => (
                        <MegaMenuItem data={dept1} key={index} dept={0} url={dept1.url}
                                      onMenuOpen={props.onMenuOpen}
                                      onMenuClose={props.onMenuClose}
                                      nowLocation={props.nowLocation}/>
                    ))
                }
            </ul>
        </Fragment>
    );
};

/**
 * 메가 메뉴 항목 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const MegaMenuItem = (props) => {

    /**
     * selected menu state
     */
    const [isSelectedMenu, setIsSelectedMenu] = useState(false);

    /**
     * history
     * @type {unknown}
     */
    const history = useHistory();

    /**
     * modal context
     */
    const modal = useContext(modalContext);

    /**
     * auth state
     */
    const auth = useSelector((store) => store.auth);

    //todo componentDidUpdate
    useEffect(() => {
        if (props.nowLocation.length > props.dept)
            props.nowLocation[props.dept] === props.data.path ? setIsSelectedMenu(true) : setIsSelectedMenu(false)
    }, [props.nowLocation]);

    /**
     * 화면으로 이동한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const goURL = useCallback(() => {
        if (props.url !== null && props.url !== undefined && props.url !== "") {
            if (props.data.path && props.data.path === "twin") {
                if (auth.user.userId) {
                    const url = props.url + "/sso?autoLogin=true&key=" + btoa(auth.user.userId);
                    window.open(url,"_self");
                }else {
                    modal.showAlert("알림", "사용자 정보가 없습니다.");
                }
            }else {
                history.push(props.url);
            }
        }
        props.onMenuClose()
    },[props])

    return (
        <Fragment>
            {
                <li className={isSelectedMenu ? "now" : null}>
                    <a onClick={goURL}>
                        {
                            props.dept === 1
                                ? <strong className={isSelectedMenu ? "now" : null}>{props.data.title}</strong>
                                : <span className={isSelectedMenu ? "now" : null}>{props.data.title}</span>
                        }
                    </a>
                    {
                        props.data.subMenu.length === 0 ?
                            null
                            : <ul className={"ns-menu-list-dept-" + (props.dept + 1)}>
                                {
                                    props.data.subMenu.map((dept2, index2) => (
                                        <MegaMenuItem data={dept2} key={props.dept + "-" + index2} dept={props.dept + 1} url={dept2.url}
                                                      onMenuOpen={props.onMenuOpen} onMenuClose={props.onMenuClose} nowLocation={props.nowLocation}/>
                                    ))
                                }
                            </ul>
                    }
                </li>

            }
        </Fragment>
    );
};

export {MegaMenu, MegaMenuContainer, MegaMenuList}
