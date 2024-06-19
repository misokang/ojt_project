import {cloneElement, Fragment, useCallback, useEffect, useState} from 'react'
import '@/components/common/Table/Table.css';
import {Button, Checkbox, ListView, Pager} from "@progress/kendo-react-all";
import LoadingLocalSpinner from "@/components/common/Loading/LoadingLocalSpinner";

/**
 * 목록 컴포넌트
 *
 * @author youngkwan-Ji
 * @version 1.0
 **/
const TableList = (props) => {

    /**
     * data state
     */
    const [data, setData] = useState({
        columns: props.columns ? props.columns : null,              // 컬럼정보
        selectable: props.selectable ? props.selectable : false,    // row check 가능여부
        selectedList: props.selectedList ? props.selectedList : [], // checked row
        pageNo: props.pageNo ? props.pageNo : 0,                    // pageNo
        limit: props.limit ? props.limit : 10,                      // limit
        primaryKey: props.columns.filter(column => column.primary === true).length > 0  // row 식별키
            ? props.columns.filter(column => column.primary === true)[0].key : null,
        onClickItem: props.onClickItem ? props.onClickItem : null,  // row onClick 이벤트
        disableList : props.disableList ? props.disableList : [],
        // pageable: props.pageable ? props.pageable : true
        pageable: props.pageable === undefined || props.pageable === true ? true : props.pageable,
        selectedItem : props.selectedItem ? {...props.selectedItem} : null,
        deSelectedItem : props.deSelectedItem ? {...props.deSelectedItem} : null,
        infinity : props.infinity ? props.infinity : false,
        itemList : []
    });

    //todo componentDidUpdate
    useEffect(() => {
        props.onChangeData && props.onChangeData(prevState => ({
            ...prevState,
            ...data
        }));
    }, [data.pageNo, data.limit, data.selectedList]);

    //todo componentDidUpdate
    useEffect(() => {
        setData(prevState => ({
            ...prevState,
            itemList : props.infinity && props.infinity === true ? props.itemList.splice(0,20) : [...props.itemList],
            selectedList: props.selectedList ? props.selectedList : []
        }));
    }, [props.itemList, props.selectedList]);

    //todo componentDidUpdate
    useEffect(() => {
        setData(prevState => ({
            ...prevState,
            columns: props.columns ? props.columns : []
        }));
    }, [props.columns]);

    //todo componentDidUpdate
    useEffect(() => {
        setData(prevState => ({
            ...prevState,
            disableList : props.disableList ? props.disableList : []
        }));
    }, [props.disableList]);

    //todo componentDidUpate
    useEffect(() => {
        setData(prevState => ({
            ...prevState,
            pageNo : props.pageNo
        }))
    }, [props.pageNo])

    /**
     * 체크박스 컴포넌트 onClick 이벤트
     *
     * @param checked 체크여부
     * @param item 해당 row 정보
     * @author youngkwan-Ji
     * @version 1.0
     **/
    const onCheck = useCallback((checked, item) => {
        if (checked) {
            setData(prevState => ({
                ...prevState,
                selectedList: [...data.selectedList, item],
                selectedItem : {...item}
            }));
        } else {
            const deleted = data.selectedList.filter(selectedItem =>
                selectedItem[data.primaryKey] !== item[data.primaryKey]
            )
            setData(prevState => ({
                ...prevState,
                selectedList: [...deleted],
                deSelectedItem: {...item}
            }));
        }

    }, [data.selectedList]);

    /**
     * 헤더 체크박스 컴포넌트 onClick 이벤트
     *
     * @param checked 체크여부
     * @author youngkwan-Ji
     * @version 1.0
     **/
    const onCheckAll = useCallback((checked) => {
        let key = null;
        const keyItem = props.columns.filter((item) => item.primary && item.primary === true)[0];
        if (keyItem) {
            key = keyItem["key"];
        }

        if (checked) {

            //todo 현재 단일키 일 경우에만 적용
            // 추후, 복수개 키 일 경우 로직 필요
            if (key) {
                let list = [];
                data.itemList.map((item, idx) => {
                    if(props.disableList.filter((disableItem) => disableItem[key] === item[key]).length === 0){ //본인일때만
                        list.push(item)
                    }
                });

                if (data.selectedList.length > 0) { //다른 페이지에 체크한 데이터가 있을때 합침
                    list = data.selectedList.concat(list);
                }

                setData(prevState => ({
                    ...prevState,
                    selectedList: list,
                }));
            }else {
                setData(prevState => ({
                    ...prevState,
                    selectedList: [...data.itemList],
                }));
            }
        } else {
            let removeCheckAll = [];
            if (data.selectedList.length > 0) { //다른 페이지에 체크한 데이터가 있을때 중복데이터 제거
                removeCheckAll = data.selectedList.filter(dataItem => {
                    return !data.itemList.some(item => item.routeId === dataItem.routeId)
                });
            }

            setData(prevState => ({
                ...prevState,
                selectedList: removeCheckAll,
            }));
        }
    }, [data.itemList, data.selectedList]);

    /**
     * page onChange 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @author youngkwan-Ji
     * @version 1.0
     **/
    const onChangePage = useCallback((event) => {
        setData(prevState => ({
            ...prevState,
            pageNo: event.skip,
            limit: event.take
        }));
    }, []);

    // /**
    //  * 조회 갯수 선택 이벤트 핸들러
    //  *
    //  * @param event 이벤트 객체
    //  * @return
    //  * @author chauki
    //  * @version 1.0
    //  **/
    // const onChangeLimit = useCallback((event) => {
    //     props.onChangeLimit && props.onChangeLimit(prevState => ({
    //         ...prevState,
    //         pageNo: 0,
    //         limit: event.value.limit
    //     }));
    // }, [props.onChangeLimit]);

    /**
     * 컴포넌트 props에 state를 추가한다.
     *
     * @param elems 컴포넌트 객체
     * @author youngkwan-Ji
     * @version 1.0
     **/
    const addStateToProps = useCallback((elems) => {
        return elems.map((elem, idx) => cloneElement(elem, {
            key: idx,
            ...data
        }))
    }, [data]);

    const onScrollHandler = useCallback((event) => {
        const e = event.nativeEvent;
        if (e.target.scrollTop + 10 >= e.target.scrollHeight - e.target.clientHeight) {
            const moreData = data.itemList.splice(0, 10);
            if (moreData.length > 0) {
                setData(prevState => ({
                    ...prevState,
                    itemList : data.itemList.concat(moreData)
                }));
            }
        }
    }, [data]);

    return (
        <div className={`ns-table-list ${props.className ? props.className : ""}`} ref={props.ref ? props.ref : null}>
            <div className="tblList">
                <div className={"tbl"}>
                    <div className={"info-wrapper"}>
                        {
                            props.totalCnt !== null && props.totalCnt !== undefined &&
                            <div className={"info"}>
                                <strong>총 <i>{props.totalCnt ? props.totalCnt.toLocaleString() : 0}</i> <span>건</span></strong>
                            </div>
                        }
                        {
                            addStateToProps(props.controlButtons ? props.controlButtons : [])
                        }
                    </div>
                    <TableListHeader {...data}
                                     itemList={data.itemList}
                                     onCheckAll={onCheckAll}
                    />
                    {
                        props.loading
                            ? <div><LoadingLocalSpinner loading={props.loading}/></div>
                            : data.itemList && data.itemList.length > 0
                                ? (
                                    <Fragment>
                                        <ListView
                                            onScroll={onScrollHandler}
                                            style={props.height ? {height:props.height} : null}
                                            data={data.itemList}
                                            item={(listViewItemProps) => {
                                                return <TableListItem {...listViewItemProps}
                                                                      {...data}
                                                                      onCheck={onCheck}
                                                />
                                            }}
                                        />
                                        {
                                            data.pageable === true && props.totalCnt > 0 ?
                                                <Pager
                                                    skip={data.pageNo}
                                                    take={data.limit}
                                                    onPageChange={onChangePage}
                                                    total={props.totalCnt}
                                                    info={true}
                                                    pageSizes={[10, 20]}
                                                    previousNext={true}
                                                /> :
                                                null
                                        }
                                    </Fragment>
                                )
                                : <div className={"list-item empty"}>
                                    <div className={"item"}>검색결과가 없습니다.</div>
                                </div>
                    }
                </div>
            </div>
        </div>
    )
};

/**
 * 목록 헤더 컴포넌트
 *
 * @author youngkwan-Ji
 * @version 1.0
 **/
const TableListHeader = (props) => {

    const isCheck = () => {
        //항목이 없을 경우 false
        if (props.itemList.length === 0) {
            return false;
        }else {
            //선택된 항목이 있고, 그 항목이 목록 항목에 포함되면 true
            if (props.selectedList.length > 0 && props.itemList.filter((item) => props.selectedList.some((i) => i[props.primaryKey] === item[props.primaryKey])).length > 0) {
                return true;
            }
            if (props.selectedList.length === props.itemList.length - props.itemList.filter((item) => props.disableList.some((i) => i[props.primaryKey] === item[props.primaryKey])).length) {
                return false;
            }
        }

        return false;
    }

    return (
        <Fragment>
            <table className={"tbl header"}>
                <thead>
                <tr>
                    {
                        props.selectable
                        && <th style={{width: "70px"}} className={"checkAll"}>
                            <Checkbox
                                checked={isCheck()}
                                onChange={(e) => props.onCheckAll(e.target.value)}
                            />
                        </th>
                    }
                    {
                        props.columns.map((column, idx) => {
                                return (<th key={idx}
                                            style={{width: column.width ? column.width : "", display: column.hidden !== undefined && column.hidden !== null && column.hidden === true ? "none" : ""}}>{column.field}</th>)
                            }
                        )
                    }
                </tr>
                </thead>
            </table>
        </Fragment>
    );
};

/**
 * 목록 row 컴포넌트
 *
 * @author youngkwan-Ji
 * @version 1.0
 **/
const TableListItem = (props) => {

    /**
     * 항목 아이템 클릭 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @param data 항목 정보
     * @author chauki
     * @version 1.0
     **/
    const onClickItem = useCallback((event, data) => {
        event.preventDefault();
        event.stopPropagation();
        if (props.onClickItem && props.onClickItem instanceof Function) {
            props.onClickItem(data);
        }
    }, [props.onClickItem]);

    return (
        <Fragment>
            <div className={"list-item"}
                 key={props.index}>
                {
                    props.selectable &&
                    <div className={"item"} style={{width: "70px"}}>
                        {
                            props.disableList.filter((item) => item[props.primaryKey] === props.dataItem[props.primaryKey]).length === 0
                            ?
                                <Checkbox
                                    checked={props.selectedList.filter(selectedItem =>
                                        selectedItem[props.primaryKey] === props.dataItem[props.primaryKey]
                                    ).length > 0}
                                    onChange={(e) => props.onCheck(e.target.value, props.dataItem)}
                                />
                            : null
                        }

                    </div>
                }
                {
                    props.columns.map((column, idx) => {
                        if (column.cell) {
                            return <div key={idx}
                                        className={`item ac ${column.className ? column.className : ""} ${column.ellipsis !== undefined && column.ellipsis === false ? "" : "k-text-ellipsis" }`}
                                        style={{
                                            width: column.width ? column.width : "",
                                            display: column.hidden !== undefined && column.hidden !== null && column.hidden === true ? "none" : ""
                                        }}
                                        onClick={(event) => onClickItem(event, props.dataItem)}>
                                {cloneElement(column.cell, props.dataItem)}
                            </div>
                        } else {
                            return <div key={idx}
                                        className={`item ac ${column.className ? column.className : ""} ${column.ellipsis !== undefined && column.ellipsis === false ? "" : "k-text-ellipsis" }`}
                                        style={{
                                            width: column.width ? column.width : "",
                                            display: column.hidden !== undefined && column.hidden !== null && column.hidden === true ? "none" : ""
                                        }}
                                        onClick={(event) => onClickItem(event, props.dataItem)}>
                                {props.dataItem[column.key] ? props.dataItem[column.key] : "-"}
                                {/*{ props.dataItem[column.key].length > 10 ? props.dataItem[column.key].substring(0,5)+'...' : props.dataItem[column.key] }*/}
                            </div>
                        }
                    })
                }
            </div>
        </Fragment>
    );
};

/**
 * 목록 제어 버튼 컴포넌트
 *
 * @author youngkwan-Ji
 * @version 1.0
 **/
const TableControlButton = (props) => {
    return (
        <Fragment>
            <div className={"btn-group"} style={{marginLeft: 10, display : props.hidden !== undefined && props.hidden !== null && props.hidden === true ? "none" : ""}}>
                {
                    props.children
                        ?
                        cloneElement(props.children, {
                            className: props.className,
                            title: props.title,
                            onClick: (event) => props.onClick(props.selectedList, event)
                        })
                        : <Button themeColor={"primary"} className={props.className ? props.className : "b-btn"} onClick={(event) => props.onClick(props.selectedList, event)}>{props.title}</Button>
                }
            </div>
        </Fragment>
    );
};

export {TableList, TableControlButton}
