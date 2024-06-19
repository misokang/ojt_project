import {Fragment, memo} from "react";
import SampleList from "@/components/service/Sample/SampleList";

const SampleView = () => {
    return (
        <Fragment>
            <div className={"v-sample"}>
                {/*{console.log('ttt')}*/}
                <SampleList/>
            </div>
        </Fragment>
    )
};
export default memo(SampleView);