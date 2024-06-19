import {sample} from "@/components/service/Sample/SampleApi";
import axios from "axios";
import {login} from "@/components/service/Login/LoginApi.js";
import {common} from "@/components/service/Common/CommonApi.js";

//axios 전역 설정
axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.timeout = 30000;

axios.interceptors.response.use(function (response) {
    const {data, config} = response;
    if (data.status === "NS_ER_AT_03") {
        if (localStorage.getItem("refreshToken")) {
            config.headers.set('RefreshToken', localStorage.getItem("refreshToken"))//refreshToken 셋팅
            return axios.request(config);    // api 재조회
        }
    }

    return response;
}, function (error) {

})

export default {
    sample,
    login,
    common
};
