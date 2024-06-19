import {Fragment, memo, useEffect, useState} from "react";
import "@/components/service/Sample/Sample.css";
import ServiceApi from "@/common/ServiceApi";
import {TableList} from "@/components/common/Table/TableList";
import {Tooltip} from "@progress/kendo-react-all";
import {util} from "@/common/Common";

const SampleList = () => {

    /*const dispatch = useDispatch();

    const [sampleData, setSampleData] = useState({
        selectedList : [],
        stdgCd : null,
        regionLevel : 0,
        search: null
    });


    const {data, isLoading} = ServiceApi.sample.useSampleListQuery(sampleData.stdgCd, sampleData.regionLevel, sampleData.search);

    const onChange = useCallback((event) => {
        setSampleData(prevState => ({
            ...prevState,
            search : event.value
        }));
    }, [sampleData]);

    const onClickSubmit = useCallback(() => {
        console.log(sampleData.search);
    }, [sampleData]);*/

    const [sampleData, setSampleData] = useState({
        selectedList : [],
        stdgCd : null,
        regionLevel : 0,
        search: null,
        sampleList : []
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        reqGetSampleList(sampleData.stdgCd, sampleData.regionLevel, sampleData.search);
    }, []);

    const reqGetSampleList = async (stdgCd, regionLevel, search) => {
        try {
            setLoading(true);
            const result = await ServiceApi.sample.reqGetSampleList(stdgCd, regionLevel, search);
            setSampleData(prevState => ({
                ...prevState,
                sampleList: [...result]
            }))
            setLoading(false);
        }catch (err) {
            setLoading(false);
        }
    }


    return (
        <Fragment>
            <div className={"ns-sample-list"}>
                {
                    <TableList
                        itemList={sampleData.sampleList}
                        columns={[
                            {field: "법정동 코드", key: "stdgCd", primary: true},
                            {field: "시도", key: "ctpvNm", cell: <TextCell field={"ctpvNm"}/>},
                            {field: "시군구", key: "sggNm", cell: <TextCell field={"sggNm"}/>},
                            {field: "레벨", key: "regionLevel"},
                            {field: "X좌표", key: "centerXCrdn"},
                            {field: "Y좌표", key: "centerYCrdn"}
                        ]}
                        onChangeData={setSampleData}
                        selectable={true}
                        controlButtons={[
                        ]}
                        loading={loading}
                        pageable={false}
                        disableList={[]}
                        selectedList={null}
                        onClickItem={null}
                    />
                }
            </div>
        </Fragment>
    );
};

const TextCell = (props) => {
    return (
        <Fragment>
            <Tooltip
                anchorElement={"target"}
                position={"top"}>
                <div className={"k-text-ellipsis"} title={props[props.field]}>{util.setInitialValueForString(props[props.field], "-")}</div>
            </Tooltip>
        </Fragment>
    );
};

export default memo(SampleList);