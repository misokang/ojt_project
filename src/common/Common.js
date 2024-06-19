import axios from "axios";
import {JSEncrypt} from "jsencrypt";

/**
 * ajax 패키지
 * - ajax 관련 패키지를 정의한다.
 *
 * @author chauki
 * @version 1.0
 **/
export const ajax = {

    /**
     * api를 전송한다.
     * - axios 라이브러리 사용
     *
     * @param url api url 정보
     * @param options 옵션정보
     * @author chauki
     * @version 1.0
     **/
    requestApi: (url, options) => {
        const _axios = axios.create();

        //파라미터 설정
        let params = {};
        if (options.params !== undefined && options.params !== null) {
            params = options.params;
        }

        //method 설정
        let method = "get";
        if (options.method !== undefined && options.method !== null) {
            method = options.method;
            if (method.toLowerCase() === "post" || method.toLowerCase() === "put") {
                params = JSON.stringify(params);
                //console.log(params);
            }
        }

        //request 요청 시, loadingBar를 표출할 경우, interceptor로 loadingBar 표출
        if (options.isLoading !== undefined && options.el !== undefined && new Boolean(options.isLoading) instanceof Boolean) {
            _axios.interceptors.request.use(function (config) {
                return config;
            }, function (error) {
                return Promise.reject(error);
            });

            _axios.interceptors.response.use(function (response) {
                // 응답 받으면 로딩 끄기
                return response;
            }, function (error) {
                // 응답 에러 시에도 로딩 끄기
                return Promise.reject(error);
            });
        }

        return new Promise((resolve, reject) => {
            _axios
                .request({
                    method: method,
                    headers: {"content-type": "application/json"},
                    url: url,
                    params: (method.toLowerCase() === "get" || method.toLowerCase() === "delete") ? params : null,
                    data: (method.toLowerCase() === "put" || method.toLowerCase() === "post") ? params : null
                })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((res) => {
                    reject(res.data);
                });
        });
    }
};

/**
 * util 모듈
 *
 * @author chauki
 * @version 1.0
 **/
export const util = {

    /**
     * Form에서 데이터를 가져온다.
     *
     * @param form form 엘리먼트
     * @return
     * @author chauki
     * @version 1.0
     **/
    getFormData: (form) => {
        let field, params = {};
        if (typeof form === 'object' && form.nodeName === "FORM") {
            let len = form.elements.length;
            for (let i = 0; i < len; i++) {
                field = form.elements[i];
                if (field.name &&
                    !field.disabled &&
                    field.type !== 'file' &&
                    field.type !== 'reset' &&
                    field.type !== 'submit' &&
                    field.type !== 'button') {
                    if (field.type === 'select-multiple') {
                        for (let j = form.elements[i].options.length - 1; j >= 0; j--) {
                            if (field.options[j].selected) {
                                if (encodeURIComponent(field.options[j].value !== "")) {
                                    params[encodeURIComponent(field.name)] = encodeURIComponent(field.options[j].value)
                                }
                            }
                        }
                    } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                        if (encodeURIComponent(field.value) !== "") {
                            params[encodeURIComponent(field.name)] = encodeURIComponent(field.value)
                        }
                    }
                }
            }
        }
        return params;
    },

    /**
     * Hash Map 형태의 값을 초기화한다.
     *
     * @param targetData string 데이터
     * @param fieldName 변수명(key 값)
     * @param initialValue string
     * @author chauki
     * @version 1.0
     **/
    setInitialValueForHash: (targetData, fieldName, initialValue) => {
        if (targetData === undefined || targetData === null) {
            if (initialValue !== undefined) {
                return initialValue;
            }
            return null;
        }
        if (initialValue === undefined) {
            initialValue = null;
        }
        return targetData[fieldName] !== undefined && targetData[fieldName] !== null ? targetData[fieldName] : initialValue;
    },

    /**
     * String 형태의 값을 초기화한다.
     *
     * @param value 값
     * @param initialValue string
     * @author chauki
     * @version 1.0
     **/
    setInitialValueForString: (value, initialValue) => {
        if (value === undefined || value === null) {
            if (initialValue !== undefined) {
                return initialValue;
            }
            return null;
        }
        if (initialValue === undefined) {
            initialValue = null;
        }
        return value;
    },

    /**
     * Number 형태의 값을 초기화한다.
     *
     * @param value 값
     * @param initialValue Number
     * @author chauki
     * @version 1.0
     **/
    setInitialValueForNumber: (value, initialValue) => {
        if (initialValue === undefined) {
            initialValue = 0;
        }
        if (value === undefined || value === null) {
            return initialValue;
        }
        return value;
    },

    /**
     * kendo dropdownlist의 값을 세팅한다.
     *
     * @param code code 정보
     * @param text string
     * @return
     * @author chauki
     * @version 1.0
     **/
    setKendoDropDownListValue: (code, text) => {
        let tmpData = {};
        if (code !== undefined && code !== null) {
            tmpData["code"] = code;
        }
        if (text !== undefined && text !== null) {
            tmpData["text"] = text;
        }
        return tmpData;
    },

    /**
     * 공통코드로 kendo dropdownlist의 값을 세팅한다.
     *
     * @param sbctgCd sbctgCd 정보
     * @param sbctgNm sbctgNm 정보
     * @author chauki
     * @version 1.0
     **/
    setKendoDropDownListValueCommonCode: (sbctgCd, sbctgNm) => {
        let tmpData = {};
        if (sbctgCd !== undefined && sbctgCd !== null) {
            tmpData["sbctgCd"] = sbctgCd;
        }
        if (sbctgNm !== undefined && sbctgNm !== null) {
            tmpData["sbctgNm"] = sbctgNm;
        }
        return tmpData;
    },

    /**
     * kendo datepicker 값을 세팅한다.
     *
     * @param date date 값 (string or date object)
     * @author chauki
     * @version 1.0
     **/
    setKendoDatePickerValue: (date) => {
        return date !== undefined && date !== null
            ? (date instanceof Date) ? date : new Date(date)
            : null;
    },

    /**
     * min ~ max 까지 랜덤 숫자를 리턴한다.
     *
     * @param min 최소값
     * @param max 최대값
     * @author chauki
     * @version 1.0
     **/
    randomIntFromInterval: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    /**
     * 요일 값(0:일,1:월,2:화,3:수,4:목,5:금,6:토)에 해당하는 문자열을 리턴한다.
     *
     * @param day 요일값
     * @return
     * @author Yudy
     * @version 1.0
     **/
    getStringDayWeek: (day) => {
        switch (day) {
            case 0:
                return "일";
            case 1:
                return "월";
            case 2:
                return "화";
            case 3:
                return "수";
            case 4:
                return "목";
            case 5:
                return "금";
            case 6:
                return "토";
            default:
                return "";

        }
    },

    /**
     * 년월일 형태로 리턴
     *
     * @param dateTime date()_
     * @author khlee
     * @version 1.0
     **/
    changeDate: (dateTime) => {
        const moment = require('moment');

        const publish_date = moment(dateTime).format('YYYY년 MM월 DD일')
        return publish_date
    },

    /**
     * color hex 값을 rgb로 변환한다.
     *
     * @param hex hex color 값
     * @param opacity 투명도
     * @author chauki
     * @version 1.0
     **/
    hexToRgba: (hex, opacity) => {
        if (opacity === undefined || opacity === null) {
            opacity = 1;
        }
        const rgb = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
            , (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16));
        return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opacity + ")";
    },

    /**
     * converts RGBA to HEX
     *
     * @author ChoiJisoo
     * @version 1.0
     **/
    rgbaToHex: (rgba) => {
        const values = rgba
            .replace(/rgba?\(/, '')
            .replace(/\)/, '')
            .replace(/[\s+]/g, '')
            .split(',');

        const a = parseFloat(values[3] || 1),
            r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
            g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
            b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);

        return "#" +
            ("0" + r.toString(16)).slice(-2) +
            ("0" + g.toString(16)).slice(-2) +
            ("0" + b.toString(16)).slice(-2);
    },

    /**
     * 랜덤 hex 값을 생성환다.
     *
     * @param size 크기
     * @author chauki
     * @version 1.0
     **/
    randomHex: (size) => {
        let result = [];
        let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

        for (let n = 0; n < size; n++) {
            result.push(hexRef[Math.floor(Math.random() * 16)]);
        }
        return "#" + result.join('');
    },

    /**
     * 랜덤 색상값을 생성한다.
     *
     * @param color 색상
     * @author chauki
     * @version 1.0
     **/
    getRandomColor: (color) => {
        if (color) {
            let p = 1,
                temp,
                random = Math.random(),
                result = '#';

            console.log(color);
            while (p < color.length) {
                temp = parseInt(color.slice(p, p += 2), 16);
                console.log(temp);
                temp += Math.floor((255 - temp) * random);
                result += temp.toString(16).padStart(2, '0');
            }
            return result;
        } else {
            return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
        }
    },

    /**
     * 차트 x축 배열을 반환한다.
     *
     * @param option 옵션정보
     * @return
     * @author parksujin
     * @version 1.0
     **/
    getTimesArray: (option) => {
        let timesArray = [];
        switch (option.search) {
            case "DAY":
                timesArray = [
                    "00", "01", "02", "03", "04", "05", "06", "07",
                    "08", "09", "10", "11", "12", "13", "14", "15",
                    "16", "17", "18", "19", "20", "21", "22", "23"
                ]
                break;
            case "MONTH":
                let day = 1;
                const collectDtYear = parseInt(option.collectDt.substr(0, 4));
                const collectDtDay = parseInt(option.collectDt.substr(4, 2));
                let lastDay = new Date(collectDtYear, collectDtDay, 0).getDate();
                while (day <= lastDay) {
                    timesArray.push(day);
                    day++;
                }
                break;
            default :
                break;
        }
        return timesArray;
    },

    /**
     * API 결과 분석
     *
     * @param res Api Response
     * @return {boolean}    NS_OK 가 아닐 때 팝업 표출
     * @since 2024-4-18 Yh.Kim </br>
     */
    apiValidationCheck: (res) => {
        if (res && res.status && res.status === 'NS_OK') {
            return true
        } else if (res && res.status && res.status === 'NS_ER_AT_01') {
            return true
        } else {
            // Modal.showAlert('알림', res.message)
            return false
        }
    },

    /**
     * RSA 암호화
     *
     * @param publicKey Server 에서 가져온 Public Key
     * @param text      암호화 값
     * @returns {string|string} 결과
     * @since 2024-4-18 Yh.Kim </br>
     */
    encryptText: (publicKey, text) => {
        const encrypt = new JSEncrypt();

        // public key 설정
        encrypt.setPublicKey(publicKey);

        return encrypt.encrypt(text) || "";
    }

};
