const axios = require("axios");
const { hauthUrl, requestHeaders } = require("../helpers/const.js");

/*
	Interface communication to HAuth
*/

const hauthInterface = {
	// Verifies token on HAuth side
	verify: (token) => new Promise((resolve, reject) => {
		const headers = { ...requestHeaders, "Authorization": `Bearer ${token}` };
		axios
			.post(`${hauthUrl}/verify`, undefined, { headers })
			.then(({ data }) => {
				if (data.status === 0)
					throw data.caption;
				else
					resolve(data.payload);
			})
			.catch((e) => reject(e?.response?.data?.errors[0]?.message || e))
	})
};

module.exports = hauthInterface;
