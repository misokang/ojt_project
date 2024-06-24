import axios from "axios";
/*import {useQuery} from "@tanstack/react-query";*/

export const login = {
    reqPostLoginInfo: (emplId, pwd) => {
        const params = {
            id: emplId,
            password: pwd
        }
        // return axios.post("/api/v1/login", params)
        return axios.post("/api/auth/login.do", params)
            .then((res) => {
                console.log("axios post return res", res);
                return res.data;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    }
};