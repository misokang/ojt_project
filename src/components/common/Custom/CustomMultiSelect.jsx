import {cloneElement, Fragment, memo, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {MultiSelect} from "@progress/kendo-react-all";
import axios from "axios";
import "@/components/common/Custom/Custom.css";

/**
 * kendo MultiSelect Custom
 *
 * @author khlee
 * @version 1.0
 **/
const CustomMultiSelect = ({   remoteUrl,
                               data,
                               defaultValue,
                               dataItemKey,
                               textField,
                               remoteDataField,
                               options,
                               takeRef,
                               ...restProps}) => {

    /**
     * data state
     */
    const [itemData, setItemData] = useState({
        defaultValue: null,
        options: [],
        loading: false,
        originData: []
    });

    /**
     * multi selected ref
     */
    const multiSelectRef = useRef(null);

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
     * 데이터를 업데이트한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const updateData = () => {
        if (data) {
            let tmpDefaultValue = getDefaultValueMap(data, defaultValue, dataItemKey);
            setItemData(prevState => ({
                ...prevState,
                defaultValue: tmpDefaultValue,
                options: data
            }));
            return;
        }
        if (data.options) {
            let tmpDefaultValue = getDefaultValueMap(data.options, defaultValue, dataItemKey);
            setItemData(prevState => ({
                ...prevState,
                defaultValue: tmpDefaultValue,
                //options : props.data
            }));
        }

        if (takeRef && takeRef instanceof Function) {
            takeRef(multiSelectRef);
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
        if (data && isComponentMounted) {
            let tmpDefaultValue = getDefaultValueMap(data.result, defaultValue, dataItemKey);
            if (tmpDefaultValue === undefined) {
                tmpDefaultValue = "";
            }
            setItemData(prevState => ({
                ...prevState,
                defaultValue: tmpDefaultValue,
                options: remoteDataField ? [...data.result[remoteDataField]] : [...data.result],
                originData: remoteDataField ? [...data.result[remoteDataField]] : [...data.result],
                loading: false
            }));
        }
    };

    /**
     * default 값에 대한 key/value 값을 가져온다
     *
     * @param dataSet data set
     * @param defaultValue default 값
     * @param itemKey key 정보
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
     * 필터 change 이벤트 핸들러
     * - 입력값을 필터하여 dropdownlist에 표출한다.
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onFilterChange = useCallback((event) => {
        const filter = event.filter.value;
        const newOptions = itemData.originData.filter((item) => {
            return item[textField].includes(filter)
        })
        setItemData(prevState => ({
            ...prevState,
            options: newOptions
        }))
    }, [itemData, textField]);

    /**
     * 목록 render
     *
     * @param element 엘리먼트
     * @author chauki
     * @version 1.0
     **/
    const listNoDataRender = (element) => {
        const noData = (
            <h4
                style={{
                    fontSize: "1em",
                }}
            >
        <span
            className="k-icon k-i-warning"
            style={{
                fontSize: "2.5em",
            }}
        />
                <br />
                <br />
                검색 결과가 없습니다.
            </h4>
        );
        return cloneElement(element, { ...element.props }, noData);
    };

    return (
        <Fragment>
            {
                remoteUrl
                    ?
                    <MultiSelect
                        {...restProps}
                        ref={multiSelectRef}
                        defaultValue={itemData.defaultValue}
                        data={itemData.options}
                        loading={itemData.loading}
                        filterable={true}
                        onFilterChange={onFilterChange}
                        listNoDataRender={listNoDataRender}
                    />
                    :
                    <MultiSelect
                        {...restProps}
                        ref={multiSelectRef}
                        value={itemData.defaultValue}
                        data={itemData.options}
                        loading={itemData.loading}
                        filterable={true}
                        onFilterChange={onFilterChange}
                        listNoDataRender={listNoDataRender}
                    />

            }
        </Fragment>
    );
};
export default memo(CustomMultiSelect);