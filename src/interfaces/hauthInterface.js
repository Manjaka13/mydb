const http = require("../services/http");
/*
    Interface communication to HAuth
*/

const hauthInterface = {
    // HAuth doc
    getDocumentation: () => http.get("/")
        .then((result) => {
            if (result.status === 0)
                throw result.caption;
            else
                return result.payload;
        }),

    // Verifies token on HAuth side
    verify: (token) => http.post("user/verify", { token })
        .then((result) => {
            if (result.status === 0)
                throw result.caption;
            else
                return result.payload;
        })
};

module.exports = hauthInterface;
