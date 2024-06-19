import {Fragment, memo, useCallback, useContext, useEffect, useState} from "react";
import "@/components/service/Operator/Operator.css";
import ServiceApi from "@/common/ServiceApi";
import {Button} from "@progress/kendo-react-all";
import {util} from "@/common/Common";
import {modalContext} from "@/components/common/Context/Modal.jsx";
import {windowPopupContext} from "@/components/common/Context/WindowPopup.jsx";
import OperatorDetailView from "@/components/service/Operator/OperatorDetailView.jsx";
import GridView from "@/components/common/Grid/GridView.jsx";

const OperatorList = () => {

    const [filter, setFilter] = useState({
        skip: 0, take: 10, sort: []
    });

    const [loading, setLoading] = useState(false);
    const [operatorData, setOperatorData] = useState({});
    const popup = useContext(windowPopupContext);
    const modal = useContext(modalContext);

    useEffect(() => {
        reqGetSampleList();
    }, [filter]);

    const reqGetSampleList = async () => {
        try {
            setLoading(true);
            const result = await ServiceApi.sample.reqPostSampleList(filter);
            if (util.apiValidationCheck(result)) {
                setOperatorData(result.items)
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }

    const filterChange = (type, event) => {
        console.log(type, event)
        if (type === 'page') {
            const take = event.page.take
            setFilter({
                ...(filter), page: event.page, take: take
            });
        } else {
            setFilter({
                ...(filter), [name]: event.value
            });
        }
    };

    const DetailBtnCell = ({cellProps}) => {
        return (<td>
            <Button onClick={() => onBtnClickListener("MOD", cellProps.dataItem)}>수정</Button>
        </td>);
    };

    const onBtnClickListener = useCallback((type, dataItem) => {
        let title = ""
        if (type === 'DEL') {
            // console.log('dataItem', dataItem)
            onDeleteOperator(dataItem)
            return
        } else if (type === 'MOD') {
            title = "수정하기"
        } else {
            title = "등록하기"
        }
        popup.showWindowPopup(title, <OperatorDetailView
            target={popup}
            modal={modal}
            type={type}
            initData={dataItem}
            onSubmitCallback={onSubmitCallback}
        />, {
            width: 1000
        });
    }, [])

    const onSubmitCallback = useCallback(async (type, data) => {
        let result = {}
        if (type === 'ADD')
            result = await ServiceApi.sample.reqPostSampleCreate(data);
        else {
            result = await ServiceApi.sample.reqPostSampleModify(data);
        }

        popup.close()
        reqGetSampleList()
    }, [popup])

    const onDeleteOperator = async (data) => {
        const result = await ServiceApi.sample.reqPostSampleDelete(data);
        reqGetSampleList()
    }

    return (<Fragment>
        <div className={"ns-operator-list"}>
            {operatorData && operatorData.length !== undefined ?
                <GridView
                    filter={filter}
                    operatorData={operatorData}
                    btnListener={onBtnClickListener}
                    filterChange={filterChange}
                /> : null}
        </div>
    </Fragment>);
};

export default memo(OperatorList);