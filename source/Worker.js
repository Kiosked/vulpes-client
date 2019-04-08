const Connector = require("./Connector.js");
const Job = require("./Job.js");

/**
 * A remote job payload (may not be complete)
 * @typedef {Object} VulpesJob
 * @property {String} id - The job ID
 * @property {String} type - The job type
 * @property {String} status - The job status (pending etc.): {@link https://github.com/Kiosked/vulpes/blob/master/API.md#Status Status}
 * @property {String} priority - The priority of the job: {@link https://github.com/Kiosked/vulpes/blob/master/API.md#Priority Priority}
 * @property {Number} created - The creation timestamp (UTC)
 * @property {Array.<String>} parents - Array of parent IDs
 * @property {Object} data - The job data (initialisation)
 * @property {Object} result - The results of the job's previous execution
 * @property {String} result.type - The type of result: {@link https://github.com/Kiosked/vulpes/blob/master/API.md#ResultType ResultType}
 * @property {Object} result.data - The result data
 */

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
