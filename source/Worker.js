const EventEmitter = require("events");
const ms = require("ms");
const Connector = require("./Connector.js");
const Job = require("./Job.js");

const WORKER_CHECK_DELAY = ms("5s");
const WORKER_CHECK_ERROR_DELAY = ms("15s");

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

class Worker extends EventEmitter {
    constructor(connector) {
        super();
        if (connector instanceof Connector !== true) {
            throw new Error("Provided value not an instance of Connector");
        }
        this._connector = connector;
        this._job = null;
        this._timer = null;
        this.checkDelay = WORKER_CHECK_DELAY;
        this.errorCheckDelay = WORKER_CHECK_ERROR_DELAY;
    }

    get connector() {
        return this._connector;
    }

    get job() {
        return this._job;
    }

    get running() {
        return this._timer !== null;
    }

    start() {
        if (this.running) {
            throw new Error("Cannot start: already running");
        }
        this._startTimer();
    }

    stop() {
        if (this.running) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    async _startJob() {
        if (this.job) {
            throw new Error("Cannot start new job: One is already pending on this worker");
        }
        const jobData = await this.connector.getNextJob();
        if (jobData) {
            const job = new Job(jobData);
            job.worker = this;
            this._job = job;
            return job;
        }
        return null;
    }

    _startTimer(delay = this.checkDelay) {
        if (this._timer === null) {
            return;
        }
        clearTimeout(this._timer);
        this._timer = setTimeout(async () => {
            try {
                const job = await this._startJob();
                if (job) {
                    this.emit("job", {
                        job
                    });
                } else {
                    this._startTimer();
                }
            } catch (err) {
                this._startTimer(this.errorCheckDelay);
            }
        }, delay);
    }
}

module.exports = Worker;
