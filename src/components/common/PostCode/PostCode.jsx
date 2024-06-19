import {Fragment, memo} from 'react';
import DaumPostcode from "react-daum-postcode";

/**
 * 우편번호 검색 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const PostCode = (props) => {

    /**
     * 우편번호 검색 시, 우편번호 정보 콜백 이벤트 핸들러
     *
     * @param data 선택된 우편번호 정보
     * @author chauki
     * @version 1.0
     **/
    const onCompleteHandle = (data) => {
        let postCode = data.zonecode;
        let fullAddress = data.address;
        let extraAddress = '';

        //도로명 주소일 경우
        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        //우편번호 정보
        const postData = {
            postCode : postCode,
            roadAddr : fullAddress,
            jibunAddr : data.jibunAddr,
            origin : data
        };

        //callback 함수가 있을 경우 callback 함수로 정보 전달
        if (props.onComplete && props.onComplete instanceof Function) {
            props.onComplete(postData);
        }
    }
    return (
        <Fragment>
            <DaumPostcode
                {...props}
                onComplete={onCompleteHandle}
                autoClose={false}
            />
        </Fragment>
    );
};
export default memo(PostCode);
