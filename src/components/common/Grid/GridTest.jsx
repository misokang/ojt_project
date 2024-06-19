import {Fragment, memo, useCallback, useState} from 'react';
import {Grid, GridColumn as Column} from '@progress/kendo-react-grid';
import "components/Grid/GridTest.css";
import data from '@/components/Grid/data.json';
import {RadioButton} from "@progress/kendo-react-inputs";

function GridTest() {

    //데이터
    const [gridData, setGridData] = useState(data);
    //확장, 축소 컬럼 데이터
    let [stateColumns, setStateColumns] = useState(columns);
    //확장일 때 true
    const [gridExpand, setExpand] = useState(true);

    let preNo = 1;
    let newNo = true;
    let leftWidth = 0;

    const handleChange = useCallback(e => {
        if (e.value === 'expand') {
            setExpand(true);
            setStateColumns(columns);
        } else {
            setExpand(false);
            setStateColumns(stateColumns.filter(element => element.collapse === false))
        }
    }, [gridExpand, stateColumns]);


    const cellRender = (cell, props) => {

        if (newNo && props.field == "totalSales.1") {
            //console.log(cell);
            newNo = false;
            leftWidth = 0;
        }
        //console.log(props.field);
        //console.log(props.dataItem[props.field]);

        //병합하는 필드인지 확인
        const arr = ["no", "teamName", "contractName", "contractDay", "sales", "pmName"];
        if (arr.includes(props.field)) {
            //새로운 no가 나오면 true로 바꿔줌
            if (props.dataItem.no !== preNo) {
                if (props.field === "no") {
                    preNo = props.dataItem.no;
                    newNo = true;
                }
            }
            //병합하는 필드 + 첫no 인지
            if (newNo) {
                let value = stateColumns.filter((key) => {
                    return key.field === props.field
                });
                leftWidth += value[0].preWidth;
                return (
                    <td className={"k-grid-content-sticky"} rowSpan={4} style={{left: leftWidth}}>
                        {props.dataItem[props.field]}
                    </td>
                )
                //처음나온 no가 아니면 null 리턴
            } else {
                return null;
            }
        }

        //병합하지 않고 스크롤 고정 하는 cell
        const arr1 = ["pos", "pop", "totalSales.total", "totalPurchase.total"];
        if (arr1.includes(props.field)) {
            return cell;
        }

        //병합하지 않고 스크롤 고정 안하는 cell
        const dataList = cell.props.children.split(",");
        let state = "";

        if (dataList[1] ==="code1") {
            state = "#ff0000";
        }
        const data = dataList[0];

        return (
            <td style={{left: leftWidth, background: state}}>
                {data}
            </td>
        )

    }

    return (
        <Fragment>
            <div className={"ns-grid wdfull"}>
                <RadioButton name="group1" value="expand" checked={gridExpand} label="전체모드"
                             onChange={handleChange}/>
                <RadioButton name="group1" value="collapse" checked={!gridExpand} label="축소모드"
                             onChange={handleChange}/>
                <br/><br/>

                <Grid
                    style={{
                        height: 500,
                        textAlign: "center"
                    }}
                    data={gridData}
                    cellRender={cellRender}
                >

                    {stateColumns.map(
                        (column, idx) =>
                            <Column
                                key={idx}
                                field={column.field}
                                title={column.title}
                                width={column.width}
                                locked={column.locked}
                            />
                    )}
                    {gridExpand &&
                    <Column title="총액" locked={true}>
                        <Column field="totalSales.total" title="매출" width="90px" locked={true}/>
                        <Column field="totalPurchase.total" title="매입" width="90px" locked={true}/>
                    </Column>
                    }

                    <Column title="2021년 1월">
                        <Column field="totalSales.1" title="매출" width="90px"/>
                        <Column field="totalPurchase.1" title="매입" width="90px"/>
                    </Column>
                    <Column title="2021년 2월">
                        <Column field="totalSales.2" title="매출" width="90px"/>
                        <Column field="totalPurchase.2" title="매입" width="90px"/>
                    </Column>
                    <Column title="2021년 3월">
                        <Column field="totalSales.3" title="매출" width="90px"/>
                        <Column field="totalPurchase.3" title="매입" width="90px"/>
                    </Column>
                    <Column title="2021년 4월">
                        <Column field="totalSales.4" title="매출" width="90px"/>
                        <Column field="totalPurchase.4" title="매입" width="90px"/>
                    </Column>
                    <Column title="2021년 5월">
                        <Column field="totalSales.5" title="매출" width="90px"/>
                        <Column field="totalPurchase.5" title="매입" width="90px"/>
                    </Column>
                    <Column title="2021년 6월">
                        <Column field="totalSales.6" title="매출" width="90px"/>
                        <Column field="totalPurchase.6" title="매입" width="90px"/>
                    </Column>
                    <Column title="2021년 7월">
                        <Column field="totalSales.7" title="매출" width="90px"/>
                        <Column field="totalPurchase.7" title="매입" width="90px"/>
                    </Column>
                    <Column title="2021년 8월">
                        <Column field="totalSales.8" title="매출" width="90px"/>
                        <Column field="totalPurchase.8" title="매입" width="90px"/>
                    </Column>
                    <Column title="2021년 9월">
                        <Column field="totalSales.9" title="매출" width="90px"/>
                        <Column field="totalPurchase.9" title="매입" width="90px"/>
                    </Column>
                    <Column title="2021년 10월">
                        <Column field="totalSales.10" title="매출" width="90px"/>
                        <Column field="totalPurchase.10" title="매입" width="90px"/>
                    </Column>
                    <Column title="2021년 11월">
                        <Column field="totalSales.11" title="매출" width="90px"/>
                        <Column field="totalPurchase.11" title="매입" width="90px"/>
                    </Column>
                    <Column title="2021년 12월">
                        <Column field="totalSales.12" title="매출" width="90px"/>
                        <Column field="totalPurchase.12" title="매입" width="90px"/>
                    </Column>
                </Grid>
            </div>
        </Fragment>
    )
}


const columns = [
    {
        collapse: false,
        title: '번호',
        field: 'no',
        preWidth: 0,
        width: '60px',
        locked: true
    },
    {
        collapse: false,
        title: '팀',
        field: 'teamName',
        preWidth: 60,
        width: '100px',
        locked: true
    },
    {
        collapse: false,
        title: '계약명',
        field: 'contractName',
        preWidth: 100,
        width: '200px',
        locked: true
    },
    {
        collapse: true,
        title: '계약일-준공일',
        field: 'contractDay',
        preWidth: 200,
        width: '100px',
        locked: true
    }, {
        collapse: true,
        title: '영업',
        field: 'sales',
        preWidth: 100,
        width: '90px',
        locked: true
    }, {
        collapse: true,
        title: 'PM',
        field: 'pmName',
        preWidth: 90,
        width: '90px',
        locked: true
    }, {
        collapse: true,
        title: '매출처',
        field: 'pos',
        preWidth: 90,
        width: '100px',
        locked: true
    }, {
        collapse: true,
        title: '매입처',
        field: 'pop',
        preWidth: 100,
        width: '100px',
        locked: true
    }];

export default memo(GridTest);



