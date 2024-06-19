import {cloneElement, Fragment, memo, useCallback, useEffect, useRef, useState} from "react";
import "components/Grid/Grid.css";

/**
 * 모드 타입
 */
const modeTypes = Object.freeze({
    ADD : "ADD",
    DETAIL : "DETAIL",
    MODIFY : "MODIFY"
});

/**
 * editor Custom Grid 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
export const GridCustomEditor = memo((props) => {

    /**
     * data state 설정
     */
    const [data, setData] = useState(null);

    /**
     * col group
     */
    const [colgroup, setColgroup] = useState(props.colgroup !== null && props.colgroup !== undefined ? props.colgroup : []);

    /**
     * line
     */
    const [line, setLine] = useState(props.line !== null && props.line !== undefined ? props.line : 1);

    /**
     * read only
     */
    const [readOnly, setReadOnly] = useState(props.readOnly ? props.readOnly : false);

    /**
     * child 컴포넌트
     */
    const [children, setChildren] = useState(null);

    /**
     * grid ref
     */
    const gridRef = useRef(null);

    //todo componentDidUpdate
    useEffect(() => {
        updateData();
    }, [props.data]);

    //todo componentDidUpdate
    useEffect(() => {
        if(props.isSubmit){
            props.setData(data);
        }
    }, [props.isSubmit]);

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
            }else {
                setChildren([props.children]);
            }
        }

        const tmpData = [...props.data];
        tmpData && tmpData.filter((item, i) => {
            return item["mode"] = modeTypes.ADD;
        });
        if (props.getRef && props.getRef instanceof Function) {
            props.getRef(gridRef);
        }
        setData({
            originData : tmpData ? JSON.stringify([...tmpData]) : null,
            newData : tmpData ? [...tmpData] : null
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
        }else {
            tmpData[index][type] = event.value;
        }

        setData(preState => ({
            ...preState,
            newData : [
                ...tmpData
            ]
        }));

        if(props.afterAction !== undefined && props.afterAction !== null){
            props.afterAction(tmpData);
        }
    }, [data]);

    /**
     * row를 추가한다.
     *
     * @param event 이밴트 객체
     * @param childNodes 자식 노드
     * @return
     * @author chauki
     * @version 1.0
     **/
    const onClickAdd = useCallback((event, childNodes) => {
        let item = {};
        childNodes && childNodes.map((node, index) => {
            item[node.props.field] = null;
        });
        item["mode"] = modeTypes.ADD;
        const tmpData = [...data.newData, item];
        setData(preState => ({
            ...preState,
            newData : [
                ...tmpData
            ]
        }));

        if(props.afterAction !== undefined && props.afterAction !== null){
            props.afterAction(tmpData);
        }
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
        const tmpData = [...data.newData];
        tmpData[index].mode = modeTypes.MODIFY;
        setData(preState => ({
            ...preState,
            newData : [
                ...tmpData
            ]
        }));

        if(props.afterAction !== undefined && props.afterAction !== null){
            props.afterAction(tmpData);
        }
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
        const tmpData = [...JSON.parse(data.originData)];
        const tmpNewData = [...data.newData];

        if (item.mode === modeTypes.ADD) {
            tmpNewData.splice(index, 1);
        }else {
            tmpData[index].mode = modeTypes.DETAIL;
            tmpNewData[index] = tmpData[index];
        }
        setData(preState => ({
            ...preState,
            newData : [
                ...tmpNewData
            ]
        }));

        if(props.afterAction !== undefined && props.afterAction !== null){
            props.afterAction(tmpNewData);
        }
    }, [data]);

    /**
     * submit 이벤트 핸들러
     *
     * @param formData form 데이터
     * @author chauki
     **/
    // const onSubmit = useCallback((formData, a) => {
    //     console.log(formData);
    //     if (props.onSubmit && props.onSubmit instanceof Function) {
    //         props.onSubmit(formData);
    //     }
    // }, [data]);

    return (
        <Fragment>
            <div className={"ns-grid-custom-editor"} ref={gridRef} id={props.id !== undefined && props.id !== null ? props.id : ""}>
                <table className={"grid-table table"}>
                    <colgroup>
                        {
                            colgroup && colgroup.map((item, index)=>(
                                <col key={index} width={item} />
                            ))
                        }
                    </colgroup>
                    <thead style={{display : "table-header-group"}}>
                    <tr className={"header tr"}>
                        {
                            children && children.map((node, index) => {
                                if (node.props.field !== "add") {
                                    return <th className={"th"} key={index}  style={{display : node.props.hidden !== undefined &&  node.props.hidden !== null &&  node.props.hidden === true ? "none" : "", width : node.props.width !== undefined && node.props.width !== null ? node.props.width + "px" : "" }}>{node.props.title ? node.props.title : node.props.field}</th>
                                }
                            })
                        }
                        {
                            !readOnly && <th className={"th"} style={{width : "100px"}}><a className={"plusBtn fl ml5"} onClick={(event) => onClickAdd(event, props.children)}>추가</a></th>
                        }
                    </tr>
                    </thead>
                    <tbody style={{display : "table-row-group"}}>
                    {
                        data && data.newData && data.newData.map((item, idx) => {
                            const tmpData = {...item};
                            const formKey = "formik-" + idx;
                            const trkey = formKey +"-tr-" + idx + "-";
                            return <Fragment key={trkey + "-row"}>
                                <tr id={trkey} key={trkey+"0"} >
                                    {
                                        children && children.map((node, index) => {
                                            if(node.props.next === null || node.props.next === undefined){
                                                if (node.props.field !== "add") {
                                                    const tdKey = trkey + "-td-" + index;
                                                    const tmpProps = {
                                                        ...node.props,
                                                        data : tmpData[node.props.field],
                                                        subData : node.props.subField ? tmpData[node.props.subField] : null,
                                                        dataSet : {...tmpData},
                                                        index : idx,
                                                        onChange : onChange,
                                                        mode : tmpData.mode,
                                                        key : tdKey,
                                                        wrapperKey : trkey,
                                                        gridId : props.id
                                                    };
                                                    return cloneElement(node, tmpProps);
                                                }
                                            }
                                        })
                                    }
                                    {
                                        !readOnly
                                            ?
                                            <td className={"td"} rowSpan={line}>
                                                {/*<a className={"saveBtn fl mr10"} style={{display : item.mode !== modeTypes.DETAIL ? "block" : "none"}} onClick={formik.handleSubmit}>저장</a>*/}
                                                <a className={"cancelBtn fl mr10"} style={{display : item.mode !== modeTypes.DETAIL ? "block" : "none"}} onClick={(event) => onClickCancel(event, item, idx)}>취소</a>
                                                {/*<a className={"modBtn fl mr10"} style={{display : item.mode !== modeTypes.DETAIL ? "none" : "block"}} onClick={(event) => onClickModify(event, idx)}>수정</a>*/}
                                                {/*<a className={"delBtn fl mr10"} style={{display : item.mode !== modeTypes.DETAIL ? "none" : "block"}} onClick={formik.handleSubmit}>삭제</a>*/}
                                            </td>


                                            :   null
                                    }
                                </tr>
                                <tr id={trkey} key={trkey+"1"} className={"tr"} >
                                    {
                                        children && children.map((node, index) => {
                                            if(node.props.next !== null && node.props.next !== undefined){
                                                if (node.props.field !== "add") {
                                                    const tdKey = trkey + "-td-" + index;
                                                    const tmpProps = {
                                                        ...node.props,
                                                        data : tmpData[node.props.field],
                                                        subData : node.props.subField ? tmpData[node.props.subField] : null,
                                                        dataSet : {...tmpData},
                                                        index : idx,
                                                        onChange : onChange,
                                                        mode : tmpData.mode,
                                                        key : tdKey,
                                                        wrapperKey : trkey,
                                                        gridId : props.id
                                                    };
                                                    return cloneElement(node, tmpProps);
                                                }
                                            }
                                        })
                                    }
                                </tr>
                                {
                                    children && children.map((node, index) => {
                                        if (node.props.field === "add") {
                                            const tmpProps = {
                                                ...node.props,
                                                index : idx,
                                                ...tmpData,
                                                width : gridRef.current.offsetWidth,
                                                children : props.children,
                                                readOnly : readOnly,
                                                gridId : props.id,
                                                trkey : trkey
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
 * GridCustomEditorColum 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
export const GridCustomEditorColumn = memo((props) => {

    /**
     * row span
     */
    const rowSpan = props.rowSpan !== undefined && props.rowSpan !== null ? props.rowSpan : 1;

    /**
     * col span
     */
    const colSpan = props.colSpan !== undefined && props.colSpan !== null ? props.colSpan : 1;

    /**
     * style
     */
    const style = props.style !== undefined && props.style !== null ? props.style : {};

    return (
        <Fragment>
            <td style={style} rowSpan={rowSpan} colSpan={colSpan} key={props.key} className={"td"}>
                {
                    cloneElement(props.cell, props)
                }
            </td>
        </Fragment>
    )
});

/**
 * GridCustomEditorRow 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
export const GridCustomEditorRow = memo((props) => {
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
                    <tr key={props.trkey + "add"} id={props.trkey + "add"} className={"tr add"} style={{width : "100%", display : props.hidden ? "none" : "table-row"}}  >
                        <td className={"td"} colSpan={length}>
                            {
                                cloneElement(props.cell, props)
                            }
                        </td>
                    </tr>
                    :
                    !hidden &&
                    <tr key={props.trkey + "add"} id={props.trkey + "-add"} className={"tr add"} style={{width : "100%"}}  >
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
