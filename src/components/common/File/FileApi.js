import axios from "axios";

export const file = {

    /**
     * @className : reqGetFileGroupNo
     * @description : 파일 그룹번호를 생성한다.
     * @date : 2022-01-14 오전 11:26
     * @author : 강보경
     * @version : 1.0.0
     * @see
     * @history :
     **/
    reqGetFileGroupNo: function () {
        return axios.get("/api/file/fileGroupNo")
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * @description 파일을 업로드 한다.
     * @author lhs
     * @date 2024-01-31
     * @param
     **/
    reqPostFileUpload: function (param) {

        // if(param.files !== null && param.files !== undefined){
        //     if(!isNaN(param.files.size)){
        //         // 단일파일 100MB
        //         if(util.getFileSize(param.files.size, 'mb') > 100){
        //             const res = {errorMsg : '파일 용량이 100MB를 초과하여 업로드할 수 없습니다.'};
        //             return res;
        //         }
        //     }
        // }

        return axios.post("/api/file/fileUpload", param, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }})
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            })
    },

    /**
     * @FuntionName : reqDeleteFileList
     * @description : 파일 목록을 삭제한다.
     * @date : 2022-01-25 오전 10:11
     * @author : 강보경
     * @version : 1.0.0
     * @see
     * @history :
     **/
    reqDeleteFileList: function (attchNoList) {
        return axios.delete("/api/file/", {params: attchNoList})
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },


    /**
     * @description 파일을 조회해서 Blob타입으로 반환
     * @author lhs
     * @date 2024-01-31
     * @param
     **/
    reqGetFileInfo: function (attachNo) {
        return axios.get("/api/file/" + attachNo, {responseType : 'blob'})
            .then((res) => {
                let blob = new Blob([res.data], { type: res.headers['content-type'] })
                return blob;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    reqGetFileDownload: function (attchNo) {
        return axios.get("/api/file/download/" + attchNo,
            {
                responseType: "blob",
            })
            .then((res) => {
                const fileName = decodeURI(res.headers["content-disposition"].split("UTF-8''")[1]); //.match(/"(.*)"/).pop();
                const url = window.URL.createObjectURL(new Blob([res.data]));
                let link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },

    reqGetFileDownloadTest: function (attchNo) {
        return axios.get("/api/file/downloadTest/" + attchNo,
            {
                responseType: "blob",
            })
            .then((res) => {
                const fileName = decodeURI(res.headers["content-disposition"].split("UTF-8''")[1]); //.match(/"(.*)"/).pop();
                const url = window.URL.createObjectURL(new Blob([res.data]));
                let link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

};
