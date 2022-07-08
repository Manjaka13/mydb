const axios = require("axios");
const { hauthUrl, requestHeaders } = require("../helpers/const.js");

/*
    Service for API requests
*/

const http = {
    get: (endpoint, data) => new Promise((resolve, reject) => {
        if (typeof endpoint != "string")
            reject("Please provide endpoint");
        else
            axios
                .get(`${hauthUrl}/${endpoint}`, {
                    params: data,
                    headers: requestHeaders,
                })
                .then(({ data }) => resolve(data))
                .catch((e) => reject(e?.response?.data?.errors[0]?.message));
    }),
    post: (endpoint, data) => new Promise((resolve, reject) => {
        if (typeof endpoint != "string")
            reject("Please provide endpoint");
        else
            axios
                .post(`${hauthUrl}/${endpoint}`, data, {
                    headers: requestHeaders,
                })
                .then(({ data }) => resolve(data))
                .catch((e) => reject(e?.response?.data?.errors[0]?.message));
    })
};

module.exports = http;
