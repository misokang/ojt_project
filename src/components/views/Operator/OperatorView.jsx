import {Fragment, memo} from "react";
import OperatorList from "@/components/service/Operator/OperatorList.jsx";
import "@/components/views/Operator/OperatorView.css"

const OperatorView = () => {
    return (
        <Fragment>
            <div className={"v-operator"}>
                {/*{console.log('ttt')}*/}
                <OperatorList/>
            </div>
        </Fragment>
    )
};
export default memo(OperatorView);