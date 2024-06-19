import {memo} from "react";

/**
 * 커스텀 준비중 컴포넌트
 *
 * @author parksujin
 * @version 1.0
 **/
export const CustomReadyModal = (modal, event) => {
    event.preventDefault();
    event.stopPropagation();
    modal.showAlert("알림", "준비중입니다.");
};
memo(CustomReadyModal);
