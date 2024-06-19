import axios from "axios";
/*import {useQuery} from "@tanstack/react-query";*/

export const sample = {
    /*useSampleListQuery : (stdgCd, regionLevel, search) => {
        return useQuery({
            queryKey: ["reqSampList", stdgCd, regionLevel, search],
            queryFn: async () => await axios.get("/api/common/region/stdg", {
                params : {
                    stdgCd : stdgCd ? stdgCd : null,
                    regionLevel : regionLevel ? regionLevel : null,
                    search : search ? search : null
                }
            }),
            select : (data) => {
                console.log(data);
                return data.data.result;
            },
        });
    }*/
    reqGetSampleList: (stdgCd, regionLevel, search) => {
        return axios.get("/api/common/region/stdg", {
            params: {
                stdgCd: stdgCd ? stdgCd : null,
                regionLevel: regionLevel ? regionLevel : null,
                search: search ? search : null
            }
        })
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    reqPostSampleList: ({skip, take}) => {
        const params = {
            skip: skip,
            take: take
        }

        return axios.post("/api/v1/operator/dynamic-search", params)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    reqPostSampleCreate: ({userId, userName, authorityId, telephone, cellphone, position, department}) => {
        const params = {
            "userId": userId,
            "userName": userName,
            "authorityId": authorityId,
            "telephone": telephone,
            "cellphone": cellphone,
            "position": position,
            "department": department,
            "isUse": true
        }

        return axios.post("/api/v1/operator/create", params)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    reqPostSampleModify: ({userId, userName, authorityId, telephone, cellphone, position, department}) => {
        const params = {
            "userId": userId,
            "userName": userName,
            "authorityId": authorityId,
            "telephone": telephone,
            "cellphone": cellphone,
            "position": position,
            "department": department,
            "isUse": true
        }

        return axios.post("/api/v1/operator/modify", params)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    reqPostSampleDelete: ({userId}) => {
        const params = {
            "userId": userId

        }

        console.log(params)

        return axios.post("/api/v1/operator/delete", params)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    }
};