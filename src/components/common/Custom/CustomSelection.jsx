import {Fragment, memo, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import "@/components/common/Custom/Custom.css";
import {ListBox, ListBoxToolbar, processListBoxData} from "@progress/kendo-react-all";

/**
 * 커스텀 Selection 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const CustomSelection = ({   data,
                             selectedData,
                             dataItemKey,
                             textField,
                             onClickTransfer
                         }) => {

    /**
     * listbox state
     */
    const [listData, setListData] = useState({
        originData : [],
        selectedData : []
    });

    /**
     * last selected index
     */
    const lastSelectedIndex = useRef(0);

    /**
     * selected ref
     */
    const selectionRef = useRef(null);

    /**
     * selected field
     */
    const selectedField = "selected";

    //todo componentWillMount
    //화면에 표출되지 전에 부모의 영역을 체크하여 높이만큼 크기를 세팅한다.
    useLayoutEffect(() => {
        if (selectionRef.current) {
            selectionRef.current.querySelectorAll(".k-listbox").forEach((node) => {
                node.style.height = selectionRef.current.parentElement.offsetHeight + "px";
            });
        }
    }, []);

    //todo componentDidUpdate
    useEffect(() => {
        //selected 정보가 있을 경우
        if (selectedData !== undefined && selectedData !== null && Array.isArray(selectedData)) {
            const tmpOrinData = [...data];
            const tmpSelectedData = [...selectedData];
            const newOriginData = tmpSelectedData.map((item) => {
                return tmpOrinData.filter((item2) => {
                    return item[dataItemKey] !== item2[dataItemKey]
                })
            })[0];
            setListData(prevState => ({
                ...prevState,
                originData: newOriginData,
                selectedData: tmpSelectedData
            }));
        }else {
            setListData(prevState => ({
                ...prevState,
                originData: [
                    ...data
                ]
            }));
        }
    }, [data, selectedData]);

    /**
     * ListBox 내 항목을 선택한다.
     *
     * @param event 이벤트 객체
     * @param originData 왼쪽 기존 데이터
     * @param selectedData 오른쪽 선택된 데이터
     * @author chauki
     * @version 1.0
     **/
    const onItemClickHandler = useCallback((event, originData, selectedData) => {
        let last = lastSelectedIndex.current;
        const newData = [...listData[originData]];
        const current = newData.findIndex(
            (dataItem) => dataItem === event.dataItem
        );

        if (!event.nativeEvent.shiftKey) {
            lastSelectedIndex.current = last = current;
        }

        if (!event.nativeEvent.ctrlKey) {
            newData.forEach((item) => (item.selected = false));
        }

        const select = !event.dataItem.selected;
        for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
            newData[i].selected = select;
        }
        setListData(prevState => ({
            ...prevState,
            [originData]: newData,
            [selectedData]: listData[selectedData].map((item) => {
                item[selectedField] = false;
                return item;
            }),
        }));
    }, [listData]);

    /**
     * transfer 버튼 선택 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onClickTransferHandler = useCallback((event) => {
        let toolName = event.toolName || "";
        let result = processListBoxData(
            listData.originData,
            listData.selectedData,
            toolName,
            selectedField
        );

        const tmpOriginData = result.listBoxOneData.map((item) => {
            item.selected = false;
            return item;
        });

        const tmpSelectedData = result.listBoxTwoData.map((item) => {
            item.selected = false;
            return item;
        });

        setListData(prevState => ({
            ...prevState,
            originData: tmpOriginData,
            selectedData: tmpSelectedData,
        }));
        //상위로 전송
        if (onClickTransfer && onClickTransfer instanceof Function) {
            onClickTransfer([...tmpSelectedData]);
        }
    }, [listData, onClickTransfer]);

    return (
        <Fragment>
            <div className={"ns-custom-selection"} ref={selectionRef}>
                <div className={"row"}>
                    <div className={"col"}>
                        <ListBox
                            data={listData.originData}
                            textField={textField ? textField : "text"}
                            selectedField={selectedField}
                            onItemClick={(event) => onItemClickHandler(event, "originData", "selectedData")}
                            toolbar={() => {
                                return (
                                    <ListBoxToolbar
                                        tools={[
                                            //"moveUp",
                                            //"moveDown",
                                            "transferTo",
                                            "transferFrom"
                                            //"transferAllTo",
                                            //"transferAllFrom",
                                            //"remove",
                                        ]}
                                        data={listData.originData}
                                        dataConnected={listData.selectedData}
                                        onToolClick={onClickTransferHandler}
                                    />
                                );
                            }}
                        />
                    </div>
                    <div className={"col rl"}>
                        <ListBox
                            data={listData.selectedData}
                            textField={textField ? textField : "text"}
                            selectedField={selectedField}
                            onItemClick={(event) => onItemClickHandler(event, "selectedData", "originData")}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
export default memo(CustomSelection);
