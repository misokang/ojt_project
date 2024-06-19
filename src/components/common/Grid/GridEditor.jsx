import {cloneElement, Fragment, memo, useCallback, useEffect, useRef, useState} from "react";
import "@/components/Grid/Grid.css";
import {Formik} from "formik";
import {Input, Tooltip} from "@progress/kendo-react-all";

/**
 * mode type
 */
const modeTypes = Object.freeze({
    ADD: "ADD",
    DETAIL: "DETAIL",
    MODIFY: "MODIFY"
});


/**
 * editor Custom Grid 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
export const GridEditor = memo((props) => {

    /**
     * data state 설정
     */
    const [data, setData] = useState(null);

    /**
     * read only
     */
    const [readOnly, setReadOnly] = useState(props.readOnly ? props.readOnly : false);

    /**
     * 추가 버튼 표출 여부
     */
    const [addButton, setAddButton] = useState(props.addButton !== undefined ? props.addButton : true);

    /**
     * 삭제 버튼 표출 여부
     */
    const [deleteButton, setDeleteButton] = useState(props.deleteButton !== undefined ? props.deleteButton : true);

    /**
     * 자식노드
     */
    const [children, setChildren] = useState(null);

    /**
     * grid ref
     */
    const gridRef = useRef(null);

    /**
     * form ref
     */
    const formRef = useRef(null);

    /**
     * form key
     */
    let formikKey = 0;

    //todo componentDidUpdate
    useEffect(() => {
        updateData();
    }, [props.data]);
    
    /**
     * 데이터를 업데이트 한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const updateData = () => {
        if (props.children) {
            if (Array.isArray(props.children)) {
                setChildren([...props.children]);
            } else {
                setChildren([props.children]);
            }
        }

        const tmpData = [...props.data];
        formikKey = new Date().getTime();
        tmpData && tmpData.filter((item, i) => {
            return item["mode"] = item.mode && item.mode !== modeTypes.DETAIL ? item.mode :  modeTypes.DETAIL;
        });
        if (props.getRef && props.getRef instanceof Function) {
            props.getRef(gridRef);
        }
        setData({
            originData: tmpData ? JSON.stringify([...tmpData]) : null,
            newData: tmpData ? [...tmpData] : null
        });
    };

    /**
     * cell onchange 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @param type 항목 타입(name)
     * @param index row index
     * @author chauki
     * @version 1.0
     **/
    const onChange = useCallback((event, type, index) => {
        const tmpData = [...data.newData];
        if (Array.isArray(type) && Array.isArray(event.value)) {
            type.map((item, idx) => {
                tmpData[index][item] = event.value[idx];
            });
        } else {
            tmpData[index][type] = event.value;
        }

        setData(preState => ({
            ...preState,
            newData: [
                ...tmpData
            ]
        }));
    }, [data]);

    /**
     * row를 추가한다.
     *
     * @param event 이밴트 객체
     * @author chauki
     * @version 1.0
     **/
    const onClickAdd = useCallback((event, childNodes) => {
        event.preventDefault();
        event.stopPropagation();
        let item = {};
        childNodes && childNodes.map((node, index) => {
            item[node.props.field] = null;
        });
        item["mode"] = modeTypes.ADD;
        const tmpData = [...data.newData, item];
        setData(preState => ({
            ...preState,
            newData: [
                ...tmpData
            ]
        }));
    }, [data]);

    /**
     * 수정버튼 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @param index row index
     * @author chauki
     * @version 1.0
     **/
    const onClickModify = useCallback((event, index) => {
        event.preventDefault();
        event.stopPropagation();
        const tmpData = [...data.newData];
        tmpData[index].mode = modeTypes.MODIFY;
        setData(preState => ({
            ...preState,
            newData: [
                ...tmpData
            ]
        }));
    }, [data]);

    /**
     * 취소버튼 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @param item 항목
     * @param index row index
     * @author chauki
     * @version 1.0
     **/
    const onClickCancel = useCallback((event, item, index) => {
        event.preventDefault();
        event.stopPropagation();
        const tmpData = [...JSON.parse(data.originData)];
        const tmpNewData = [...data.newData];
        if (item.mode === modeTypes.ADD) {
            tmpNewData.splice(index, 1);
        } else {
            tmpData[index].mode = modeTypes.DETAIL;
            tmpNewData[index] = tmpData[index];
        }
        setData(preState => ({
            ...preState,
            newData: [
                ...tmpNewData
            ]
        }));
        if (props.onClickCancel && props.onClickCancel instanceof Function) {
            props.onClickCancel(event, item, index);
        }
    }, [data, props.onClickCancel]);

    /**
     * submit 이벤트 핸들러
     *
     * @param formData form 데이터
     * @author chauki
     * @version 1.0
     **/
    const onSubmit = useCallback((formData, a) => {
        if (props.onSubmit && props.onSubmit instanceof Function) {
            props.onSubmit(formData);
        }
    }, [data]);

    return (
        <Fragment>
            <div className={"ns-grid-editor"} ref={gridRef}
                 id={props.id !== undefined && props.id !== null ? props.id : ""}>
                <table className={"grid-table table"}>
                    <colgroup>
                        {
                            children && children.map((node, index) => {
                                return <col key={index}
                                            style={{
                                    display: node.props.hidden !== undefined && node.props.hidden !== null && node.props.hidden === true ? "none" : "",
                                    width: node.props.width !== undefined && node.props.width !== null ? node.props.width + "px" : ""}}/>
                            })
                        }
                        {
                            !readOnly ? <col style={{width: "105px"}} /> : null
                        }
                    </colgroup>
                    <thead style={{display: "table-header-group"}}>
                    <tr className={"header tr"}>
                        {
                            children && children.map((node, index) => {
                                if (node.props.field !== "add") {
                                    return <th className={"th"} key={index} style={{
                                        display: node.props.hidden !== undefined && node.props.hidden !== null && node.props.hidden === true ? "none" : "",
                                        width: node.props.width !== undefined && node.props.width !== null ? node.props.width + "px" : ""
                                    }}>{node.props.title ? node.props.title : node.props.field}</th>
                                }
                            })
                        }
                        {
                            /*
                            * [원본]
                            * !readOnly
                            * ? <th className={"th"} style={{width : "100px"}}><a className={"plusBtn fl ml5"} onClick={(event) => onClickAdd(event, props.children)}>추가</a></th>
                            * : props.onInputCowork
                            * ? <th className={"th"} style={{width : "100px"}}><a className={"plusBtn fl ml5"} onClick={(event) => onClickPopup(event)}>추가</a></th>
                            * : null
                            * */

                            !readOnly ?
                                <th className={"th"} style={{width: "105px"}}>
                                    {addButton ?
                                        <a className={"btn"}
                                           onClick={(event) => onClickAdd(event, props.children)}>
                                            추가
                                        </a> : null}
                                </th>
                                : null

                        }
                    </tr>
                    </thead>
                    <tbody style={{display: "table-row-group"}}>
                    {
                        data && data.newData && data.newData.map((item, idx) => {
                            const tmpData = {...item};
                            const formKey = "formik-" + idx;
                            const trkey = formKey + "-tr-" + idx + "-";
                            return <Fragment key={trkey + "-row"}>
                                <tr id={trkey} key={trkey} className={"tr"} onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    props.onClick ? props.onClick(trkey, tmpData) : null
                                }}>
                                    <Formik
                                        key={idx}
                                        enableReinitialize={true}
                                        initialValues={tmpData}
                                        onSubmit={onSubmit}>
                                        {
                                            formik => {
                                                //const trkey = formKey + "-tr-" + idx;
                                                return (
                                                    <Fragment>
                                                        {
                                                            children && children.map((node, index) => {
                                                                if (node.props.field !== "add") {
                                                                    const tdKey = trkey + "-td-" + index;
                                                                    const tmpProps = {
                                                                        ...node.props,
                                                                        data: tmpData[node.props.field],
                                                                        subData: node.props.subField ? tmpData[node.props.subField] : null,
                                                                        dataSet: {...tmpData},
                                                                        index: idx,
                                                                        onChange: onChange,
                                                                        mode: tmpData.mode,
                                                                        key: tdKey,
                                                                        wrapperKey: trkey,
                                                                        gridId: props.id
                                                                    };
                                                                    return cloneElement(node, tmpProps);
                                                                }
                                                            })
                                                        }
                                                        {
                                                            !readOnly
                                                                ?
                                                                <td className={"td"}>
                                                                    <div className={"control-btn"}>
                                                                        {/*<a className={"saveBtn fl mr10"}*/}
                                                                        {/*   style={{display: item.mode !== modeTypes.DETAIL ? "block" : "none"}}*/}
                                                                        {/*   onClick={formik.handleSubmit}>저장</a>*/}
                                                                        <Tooltip
                                                                            anchorElement={"target"}
                                                                            position={"right"}>
                                                                            <a className={"saveBtn fl mr10"}
                                                                                    style={{display: item.mode !== modeTypes.DETAIL ? "block" : "none"}}
                                                                                    onClick={formik.handleSubmit}
                                                                                    title={"저장"}>저장</a>
                                                                        </Tooltip>
                                                                        {/*<a className={"cancelBtn fl"}*/}
                                                                        {/*   style={{display: item.mode !== modeTypes.DETAIL ? "block" : "none"}}*/}
                                                                        {/*   onClick={(event) => onClickCancel(event, item, idx)}>취소</a>*/}
                                                                        <Tooltip
                                                                            anchorElement={"target"}
                                                                            position={"right"}>
                                                                            <a className={"cancelBtn fl"}
                                                                                    style={{display: item.mode !== modeTypes.DETAIL ? "block" : "none"}}
                                                                                    onClick={(event) => onClickCancel(event, item, idx)}
                                                                                    title={"취소"}>취소</a>
                                                                        </Tooltip>
                                                                        {/*<a className={"modBtn fl mr10"}*/}
                                                                        {/*   style={{display: item.mode !== modeTypes.DETAIL ? "none" : "block"}}*/}
                                                                        {/*   onClick={(event) => onClickModify(event, idx)}>수정</a>*/}
                                                                        <Tooltip
                                                                            anchorElement={"target"}
                                                                            position={"right"}>
                                                                            <a className={"modBtn fl mr10"}
                                                                                    style={{display: item.mode !== modeTypes.DETAIL ? "none" : "block"}}
                                                                                    onClick={(event) => onClickModify(event, idx)}
                                                                                    title={"수정"}>수정</a>
                                                                        </Tooltip>

                                                                        {
                                                                            deleteButton === true
                                                                                ?
                                                                                // <a className={"delBtn fl"}
                                                                                //      style={{display: item.mode !== modeTypes.DETAIL ? "none" : "block"}}
                                                                                //      onClick={formik.handleSubmit}>삭제</a>
                                                                                <Tooltip
                                                                                    anchorElement={"target"}
                                                                                    position={"right"}>
                                                                                    <a className={"delBtn fl"}
                                                                                            style={{display: item.mode !== modeTypes.DETAIL ? "none" : "block"}}
                                                                                            onClick={formik.handleSubmit}
                                                                                            title={"삭제"}>삭제</a>
                                                                                </Tooltip>
                                                                                : null
                                                                        }

                                                                    </div>
                                                                </td>


                                                                : null
                                                        }
                                                    </Fragment>
                                                )
                                            }
                                        }
                                    </Formik>
                                </tr>
                                {
                                    children && children.map((node, index) => {
                                        if (node.props.field === "add") {
                                            const tmpProps = {
                                                ...node.props,
                                                index: idx,
                                                ...tmpData,
                                                width: gridRef.current.offsetWidth,
                                                children: props.children,
                                                readOnly: readOnly,
                                                gridId: props.id,
                                                trkey: trkey
                                            };
                                            return cloneElement(node, tmpProps)
                                        }
                                    })
                                }

                            </Fragment>
                        })
                    }
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
});

/**
 * GridEditorColum 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
export const GridEditorColumn = memo((props) => {

    //hidden cell 설정
    const hidden = props.hidden !== undefined && props.hidden !== null ? props.hidden : false;

    return (
        <Fragment>
            <td style={{display: hidden !== undefined && hidden !== null && hidden === true ? "none" : "",
                        width: props.width !== undefined && props.width !== null ? props.width + "px" : ""}}
                key={props.key} className={hidden !== undefined && hidden !== null && hidden === true ? "td hide" : "td show"}>
                {
                    hidden !== undefined && hidden !== null && hidden === true
                        ? <Input type={"hidden"} value={""}/>
                        : cloneElement(props.cell, props)
                }
            </td>
        </Fragment>
    )
});

/**
 * GridEditorRow 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
export const GridEditorRow = memo((props) => {
    let length = 0;
    props.children && props.children.map((item, index) => {
        if (item.props.field !== "add" &&
            (item.props.hidden == undefined || (item.props.hidden != undefined && !item.props.hidden))) {
            length += 1;
        }
    });

    if (!props.readOnly) {
        length += 1;
    }

    //hidden cell 설정
    const hidden = props.mode && props.mode === "MODIFY" ? false : true;

    return (
        <Fragment>
            {
                props.readOnly !== undefined && props.readOnly
                    ?
                    <tr key={props.trkey + "add"} id={props.trkey + "add"} className={"tr add"}
                        style={{width: "100%", display: props.hidden ? "none" : "table-row"}}>
                        <td className={"td"} colSpan={length}>
                            {
                                cloneElement(props.cell, props)
                            }
                        </td>
                    </tr>
                    :
                    !hidden &&
                    <tr key={props.trkey + "add"} id={props.trkey + "-add"} className={"tr add"}
                        style={{width: "100%"}}>
                        <td className={"td"} colSpan={length}>
                            {
                                cloneElement(props.cell, props)
                            }
                        </td>
                    </tr>
            }
        </Fragment>
    )
});
