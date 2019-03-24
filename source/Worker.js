const Connector = require("./Connector.js");
const Job = require("./Job.js");

class Worker {
    constructor(connector) {
        if (connector instanceof Connector !== true) {
            throw new Error("Provided value not an instance of Connector");
        }
        this._connector = connector;
        this._job = null;
    }

    get connector() {
        return this._connector;
    }

    get job() {
        return this._job;
    }

    async getNextJob() {
        const jobData = await this.connector.getNextJob();
        if (jobData) {
            const job =  new Job(jobData);
            job.worker = this;
            return job;
        }
        return null;
    }
}

module.exports = Worker;
