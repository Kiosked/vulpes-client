const { request } = require("cowl");
const joinURL = require("url-join");
const Connector = require("./Connector.js");

class RemoteConnector extends Connector {
    constructor(apiURL) {
        super();
        this._apiURL = apiURL;
    }

    get apiURL() {
        return this._apiURL;
    }

    async getNextJob() {
        const url = joinURL(this.apiURL, "/work");
        const { data } = await request(url);
        const { job } = data;
        return job;
    }

    async stopJob(jobID, resultType, resultData = {}) {
        const url = joinURL(this.apiURL, `/job/${jobID}/result`);
        const resp = await request({
            url,
            method: "POST"
        });
    }

    async updateProgress(jobID, currentValue, maxValue) {

    }
}

module.exports = RemoteConnector;
