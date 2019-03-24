const EventEmitter = require("events");

class Job extends EventEmitter {
    constructor(jobData) {
        super();
        this._jobData = jobData;
        this.worker = null;
    }

    get data() {
        return this._jobData.data;
    }

    get id() {
        return this._jobData.id;
    }

    get status() {
        return this._jobData.status;
    }

    get type() {
        return this._jobData.type;
    }

    async stop(resultType, resultData = {}) {
        await this.worker.connector.stopJob(this.id, resultType, resultData);
    }

    async updateProgress(current, max) {
        await this.worker.connector.updateProgress(this.id, current, max);
    }
}

module.exports = Job;
