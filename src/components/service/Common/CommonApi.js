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
                return res.data;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    }
};