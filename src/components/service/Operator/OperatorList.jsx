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



    return (<div>hello</div>);
};

export default memo(OperatorList);