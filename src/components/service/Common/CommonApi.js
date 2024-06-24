import axios from "axios";
/*import {useQuery} from "@tanstack/react-query";*/

export const common = {
    reqGetPublicKey: (emplId, pwd) => {
        const params = {
            emplId: emplId,
            pwd: pwd
        }
        return axios.post("/api/v1/public-key", params)
            .then((res) => {
                console.log("common.res : ", res);
                return res.data;
            })
            .catch((err) => {
                console.log("common.res.err ", err);
                return err.response.data.message;
            });
    }
};