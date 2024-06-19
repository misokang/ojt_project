import {Fragment, memo, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {DropDownList} from "@progress/kendo-react-all";
import axios from "axios";
import "@/components/common/Custom/Custom.css";

/**
 * kendo DropDownList Custom
 *
 * @author parksujin
 * @version 1.0
 **/
const CustomDropDownList = ({   remoteUrl,
                                data,
                                defaultValue,
                                dataItemKey,
                                options,
                                getRef,
                                ...restProps}) => {

    /**
     * data state
     */
    const [itemData, setItemData] = useState({
        defaultValue: null,
        options: [],
        loading: false
    });

    /**
     * drop down ref
     */
    const dropDownRef = useRef();

    /**
     * clean up 변수
     */
    let isComponentMounted = true;

    //todo componentDidMount
    useLayoutEffect(() => {
        initData();
    }, []);

    //todo componentDidUpdate
    useLayoutEffect(() => {
        updateData();
    }, [data, defaultValue, options]);

    //todo componentDidUnMount
    useEffect(() => {
        return () => {
            isComponentMounted = false;
        };
    }, []);

    /**
     * 데이터를 초기화한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const initData = () => {
        if (remoteUrl) {
            setItemData(prevState => ({
                ...prevState,
                loading: true
            }));
            getRemoteData(remoteUrl);
        } else {
            setItemData(prevState => ({
                ...prevState,
                options: data !== undefined && data !== null ? data : []
            }));
        }
    };

    /**
     * 데이터를 초기화한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const updateData = () => {
        if (getRef && getRef instanceof Function) {
            getRef(dropDownRef);
        }

        if (data) {
            let tmpDefaultValue = getDefaultValueMap(data, defaultValue, dataItemKey);
            setItemData(prevState => ({
                ...prevState,
                defaultValue: tmpDefaultValue,
                options: data
            }));
            return;
        }
        if (itemData.options) {
            let tmpDefaultValue = getDefaultValueMap(itemData.options, defaultValue, dataItemKey);
            setItemData(prevState => ({
                ...prevState,
                defaultValue: tmpDefaultValue,
                //options : props.data
            }));
        }
    };

    /**
     * 원격 데이터를 받아서 dropdownlist의 옵션값을 설정한다.
     *
     * @param url 외부 url 정보
     * @author chauki
     * @version 1.0
     **/
    const getRemoteData = async (url) => {
        const {defaultValue, dataItemKey} = restProps;
        const {data} = await reqGetRemoteData(url);
        let result;

        if (data && isComponentMounted) {
            if (data.result.length !== undefined) {
                result = data.result;
            } else {
                result = data.result;
                Object.values(data.result).filter(el => {
                    if (Array.isArray(el) && el.length !== 0) {
                        result = el;
                    }
                })
            }
            let tmpDefaultValue = getDefaultValueMap(result, defaultValue, dataItemKey);
            if (tmpDefaultValue === undefined) {
                tmpDefaultValue = "";
            }
            setItemData(prevState => ({
                ...prevState,
                defaultValue: tmpDefaultValue,
                options: [...result],
                loading: false
            }));
        }
    };

    /**
     * default 값을 매핑한다.
     *
     * @param dataSet 데이터 set
     * @param defaultValue default 값
     * @param itemKey 항목 key
     * @author chauki
     * @version 1.0
     **/
    const getDefaultValueMap = (dataSet, defaultValue, itemKey) => {
        let tmpDefaultValue = null;
        if (defaultValue !== undefined && defaultValue !== null && dataSet.length > 0) {
            tmpDefaultValue = dataSet.filter((item) => {
                return item[itemKey] === defaultValue;
            })[0];
        }
        return tmpDefaultValue;
    };

    /**
     * 외부 데이터를 조회한다.
     *
     * @param url 외부 url 정보
     * @author chauki
     * @version 1.0
     **/
    const reqGetRemoteData = (url) => {
        return axios.get(url)
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    };

    /**
     * dropdownlist open 이벤트 핸들러
     *
     * @author chauki
     * @version 1.0
     **/
    const onOpen = useCallback(() => {
        dropDownRef.current._element.childNodes[0].classList.add("k-state-focused");
    }, []);

    /**
     * dropdownlist close 이벤트 핸들러
     *
     * @author chauki
     * @version 1.0
     **/
    const onClose = useCallback(() => {
        dropDownRef.current._element.childNodes[0].classList.remove("k-state-focused");
    }, []);

    return (
        <Fragment>
            <div className={"ns-custom-dropdwonlist"}>
                {
                    remoteUrl
                        ?
                        <DropDownList
                            {...restProps}
                            ref={dropDownRef}
                            defaultValue={itemData.defaultValue}
                            data={itemData.options}
                            loading={itemData.loading}
                            onClose={onClose}
                            onOpen={onOpen}
                            label={"선택"}
                        />
                        : <DropDownList
                            {...restProps}
                            ref={dropDownRef}
                            value={itemData.defaultValue}
                            data={itemData.options}
                            loading={itemData.loading}
                            onClose={onClose}
                            onOpen={onOpen}
                            label={"선택"}
                        />
                }
            </div>
        </Fragment>
    );
};
export default memo(CustomDropDownList);
