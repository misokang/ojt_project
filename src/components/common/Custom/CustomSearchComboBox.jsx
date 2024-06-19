import {Fragment, memo, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {ComboBox} from "@progress/kendo-react-all";
import "@/components/common/Custom/Custom.css";
import axios from "axios";


/**
 * 검색 DropDownList
 *
 * @author chauki
 * @version 1.0
 **/
const CustomSearchComboBox = ({   remoteUrl,
                                  data,
                                  defaultValue,
                                  dataItemKey,
                                  textField,
                                  remoteDataField,
                                  takeRef,
                                  ...restProps}) => {

    /**
     * data state
     */
    const [itemData, setItemData] = useState({
        defaultValue: null,
        options: [],
        loading: false,
        originData: [],
        skip: 0,
        pageSize: 10,
        total: 0
    });

    /**
     * combo ref
     */
    const comboRef = useRef(null);

    /**
     * default value ref
     */
    const defaultValueRef = useRef(null);

    /**
     * filtered data ref
     */
    const filteredDataRef = useRef(null);

    /**
     * clean up 변수
     */
    let isComponentMounted = true;

    //todo componentDidMount
    useLayoutEffect(() => {
        initData();
    }, []);

    //todo componentDidUpDate
    useLayoutEffect(() => {
        updateData();
    }, [data, defaultValue]);

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
                options: data !== undefined && data !== null ? data : [],
                originData: data !== undefined && data !== null ? data : [],
                total: data !== undefined && data !== null ? data.length : 0
            }));
            filteredDataRef.current = data.slice();
        }
    };

    /**
     * 데이터를 업데이트한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const updateData = () => {
        if (defaultValue) {
            defaultValueRef.current = defaultValue;
        }
        if (data) {
            let tmpDefaultValue = getDefaultValueMap(data, defaultValue, dataItemKey);
            setItemData(prevState => ({
                ...prevState,
                defaultValue: tmpDefaultValue,
                options: data.slice(0, data.pageSize),
            }));
            return;
        }
        if (data.options) {
            let tmpDefaultValue = getDefaultValueMap(data.options, defaultValue, dataItemKey);
            setItemData(prevState => ({
                ...prevState,
                defaultValue: tmpDefaultValue,
            }));
        }
        if (takeRef && takeRef instanceof Function) {
            takeRef(comboRef);
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
            let tmpDefaultValue = getDefaultValueMap(data.result, defaultValue ? defaultValue : defaultValueRef.current, dataItemKey);
            if (tmpDefaultValue === undefined) {
                tmpDefaultValue = "";
            }
            setItemData(prevState => ({
                ...prevState,
                defaultValue: tmpDefaultValue,
                options: remoteDataField ? [...data.result[remoteDataField]] : [...data.result],
                originData: remoteDataField ? [...data.result[remoteDataField]] : [...data.result],
                total: data.result.length,
                loading: false
            }));
            filteredDataRef.current = data.result.slice();
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
     * focus 일 때, dropdownlist를 표출한다.
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onFocus = useCallback((event) => {
       // event.target._element.getElementsByClassName("k-input-button")[0].click();
    }, []);

    /**
     *  close 일 때, combobox radius를 변경한다.
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onClose = useCallback((event) => {
        comboRef.current._element.childNodes[0].classList.remove("k-state-focused");
    }, []);

    /**
     * filter change 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onFilterChange = (event) => {
        const filter = event.filter.value;
        filteredDataRef.current = data.originData.filter((item) => {
            return item[textField].includes(filter)
        });

        const newSubsetData = filteredDataRef.current.slice(0, data.pageSize);
        setItemData(prevState => ({
            ...prevState,
            options: newSubsetData,
            skip: 0,
            total: filteredDataRef.current.length
        }));
    };

    /**
     * page change 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const pageChange = (event) => {
        const skip = event.page.skip;
        const take = event.page.take;
        const newSubsetData = filteredDataRef.current.slice(skip, skip + take);
        setItemData(prevState => ({
            ...prevState,
            options: newSubsetData,
            skip: skip
        }));
    };

    return (
        <Fragment>
            <div className={"ns-search-combobox"}>
                {
                    <ComboBox
                        {...restProps}
                        ref={comboRef}
                        defaultValue={itemData.defaultValue}
                        data={itemData.options}
                        loading={itemData.loading}
                        filterable={true}
                        onFilterChange={onFilterChange}
                        onFocus={onFocus}
                        onClose={onClose}
                        virtual={{
                            total: itemData.total,
                            pageSize: itemData.pageSize,
                            skip: itemData.skip,
                        }}
                        onPageChange={pageChange}
                        valueRender={(element) => {
                            return <Fragment key={element.key}>
                                <div className={"search"}>{element}</div>
                            </Fragment>
                        }
                        }
                        popupSettings={{
                            height: "300px",
                        }}
                    />
                }
            </div>
        </Fragment>
    );
};
export default memo(CustomSearchComboBox);
