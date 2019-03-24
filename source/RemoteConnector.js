const { request } = require("cowl");
const joinURL = require("url-join");
const Connector = require("./Connector.js");

class RemoteConnector extends Connector {
    constructor(apiURL) {
        super();
        this._apiURL = apiURL;
    }

    async getNextJob() {

    }

    async stopJob(jobID, resultType, resultData = {}) {

    }

    async updateProgress(jobID, currentValue, maxValue) {

    }
}

module.exports = RemoteConnector;
