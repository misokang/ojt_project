import {Fragment, memo, useEffect, useState} from 'react';
import {Grid} from '@progress/kendo-react-grid';
import {Button, getSelectedState, GridColumn, GridToolbar} from "@progress/kendo-react-all";
import {getter} from "@progress/kendo-react-common";

function GridView({filter, operatorData, btnListener, filterChange}) {
    const SELECTED_FIELD = "selected";
    const [selectedState, setSelectedState] = useState({});
    const DATA_ITEM_KEY = "userId";
    const idGetter = getter(DATA_ITEM_KEY);
    const [dataState, setDataState] = useState(
        operatorData.map((dataItem) =>
            Object.assign(
                {
                    selected: false,
                },
                dataItem
            )
        )
    );

    const [selectedData, setSelectedData] = useState({})

    useEffect(() => {
        setDataState(operatorData.map((dataItem) =>
            Object.assign(
                {
                    selected: false,
                },
                dataItem
            )
        ))
    }, [operatorData]);

    useEffect(() => {
        console.log(dataState)
    }, [dataState]);

    const onSelectionChange = (event) => {
        const newSelectedState = getSelectedState({
            event, selectedState: selectedState, dataItemKey: DATA_ITEM_KEY,
        });
        setSelectedState(newSelectedState);
    };

    const DetailBtnCell = ({cellProps, type}) => {
        return (<td>
            <Button onClick={() => btnListener(type, cellProps.dataItem)}>{type === 'MOD' ? '수정' : '삭제'}</Button>
        </td>);
    };

    return (
        <Fragment>
            <GridToolbar>
                <div className="k-form-buttons">
                    <Button onClick={() => btnListener("ADD")}>등록</Button>
                    {/*<Button onClick={() => btnListener("DEL", selectedData)}>삭제</Button>*/}
                </div>
            </GridToolbar>
            <Grid
                sort={filter.sort}
                pageable={true}
                skip={filter.skip}
                take={filter.take}
                total={operatorData.length}
                selectedField={"selected"}
                selectable={{
                    enabled: true, drag: false, mode: "single",
                }}
                data={dataState.map((item, idx) => ({
                    ...item, no: idx + 1, selected: selectedState[idGetter(item)]
                }))}
                onSelectionChange={onSelectionChange}
                dataItemKey={DATA_ITEM_KEY}
                onSortChange={e => filterChange('sort', e)}
                onPageChange={e => filterChange('page', e)}
            >
                <GridColumn key={0} field={'no'} title={'번호'}/>
                <GridColumn key={1} field={'userId'} title={'사용자 ID'}/>
                <GridColumn key={2} field={'userName'} title={'이름'}/>
                <GridColumn key={3} field={'authorityName'} title={'권한명'}/>
                <GridColumn key={4} field={'telephone'} title={'전화번호'}/>
                <GridColumn key={5} field={'modifyDate'} title={'수정일시'}/>
                <GridColumn key={6} field={'modify'} title={'수정'} cell={(props) => <DetailBtnCell cellProps={props} type={"MOD"}/>}/>
                <GridColumn key={7} field={'delete'} title={'삭제'} cell={(props) => <DetailBtnCell cellProps={props} type={"DEL"}/>}/>
            </Grid>
        </Fragment>
    )
}

export default memo(GridView);



