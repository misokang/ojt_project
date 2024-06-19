import {Fragment, memo, useCallback, useState} from "react";
import {Input} from "@progress/kendo-react-all";
import "@/components/common/Custom/Custom.css";

/**
 * 휴대폰 입력 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const CustomCellPhoneNumberBox = ({   value,
                                      className,
                                      style,
                                      onChange,
                                      ...restProps}) => {

    /**
     * value state 설정
     */
    const [itemData, setItemData] = useState(value ? value : "");

    /**
     * onchange 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onChangeHandler = useCallback((event) => {
        const value = event.value.replace(/[^0-9|\-]/g, '')
        setItemData(value);
        if (onChange && onChange instanceof Function) {
            onChange(event);
        }
    }, [onChange]);

    return (
        <Fragment>
            <div className={"ns-cellphone-number-box"}>
                <Input
                    {...restProps}
                    style={style ? style : null}
                    className={className ? className : ""}
                    placeholder={"`-` 를 포함하여 입력해주세요."}
                    pattern={"^(01[0|1|6|7|8|9]{1})-[0-9]{3,4}-[0-9]{4}$"}
                    validationMessage={"핸드폰 형식이 아닙니다."}
                    maxLength={13}
                    value={itemData}
                    onChange={onChangeHandler}
                />
            </div>
        </Fragment>
    );
};

export default memo(CustomCellPhoneNumberBox);
