import {Fragment, memo, useEffect, useState} from "react";
import {ClipLoader} from "react-spinners";
import "@/components/common/Loading/Loading.css";

/**
 * loading spinner 컴포넌트
 *
 * @author chauki
 * @version 1.0
**/
const LoadingLocalSpinner = (props) => {

    /**
     * data state
     */
    const [data, setData] = useState({
        loading : false,
        color : "#fff",
        size : 20
    });

    //todo componentDidUpdate
    useEffect(() => {
        updateData();
    }, [props.loading]);

    /**
     * 데이터를 업데이트 한다.
     *
     * @author chauki
     * @version 1.0
    **/
    const updateData = () => {
        setData(prevState => ({
            ...prevState,
            ...props
        }));
    };

    return (
        <Fragment>
            <div className={"ns-loading-spinner"}>
                <div className={"spinner-box"}>
                    <ClipLoader color={data.color} loading={data.loading} size={data.size}/>
                </div>
            </div>
        </Fragment>
    );
};
export default memo(LoadingLocalSpinner);
