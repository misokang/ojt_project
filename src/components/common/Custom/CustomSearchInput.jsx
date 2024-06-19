import {Fragment, memo, useCallback, useState} from "react";
import {Input} from "@progress/kendo-react-all";
import "@/components/common/Custom/Custom.css";


/**
 * 커스텀 검색 Input box 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const CustomSearchInput = (props) => {

    /**
     * 검색어 state 설정
     */
    const [searchNm, setSearchNm] = useState("");

    /**
     * onchange 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onChangeHandler = useCallback((event) => {
        setSearchNm(event.value);
    }, [searchNm]);

    /**
     * 검색을 수행한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const doSearch = () => {
        if (props.onSubmit && props.onSubmit instanceof Function) {
            props.onSubmit(searchNm);
        }
    };

    return (
        <Fragment>
            <div className={"ns-search-input"}>
                <div className={"input search mb20"}>
                    <span className={"search-icon"}
                          onClick={doSearch} />
                    <Input
                        {...props}
                        value={searchNm}
                        type={"text"}
                        onChange={(event) => onChangeHandler(event)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                doSearch();
                            }
                        }}
                    />
                </div>
            </div>
        </Fragment>
    );
};
export default memo(CustomSearchInput);