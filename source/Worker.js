const EventEmitter = require("events");
const ms = require("ms");
const uuid = require("uuid/v4");
const { clearDelayedInterval, setDelayedInterval } = require("delayable-setinterval");
const Connector = require("./Connector.js");
const Job = require("./Job.js");

const WORKER_CHECK_DELAY = ms("10s");
const WORKER_CHECK_ERROR_DELAY = ms("20s");
const WORKER_REGISTER_DELAY = ms("30s");

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

/**
 * Client worker
 * @augments EventEmitter
 * @memberof module:VulpesClient
 */
class Worker extends EventEmitter {
    /**
     * Constructor for the worker
     * @param {Connector} connector A connector instance
     * @memberof Worker
     */
    constructor(connector) {
        super();
        if (connector instanceof Connector !== true) {
            throw new Error("Provided value not an instance of Connector");
        }
        this._id = uuid();
        this._connector = connector;
        this._job = null;
        this._timer = null;
        this._registerTimer = null;
        this.checkDelay = WORKER_CHECK_DELAY;
        this.errorCheckDelay = WORKER_CHECK_ERROR_DELAY;
        this.workerRegisterDelay = WORKER_REGISTER_DELAY;
    }

    /**
     * The connector instance
     * @type {Connector}
     * @readonly
     * @memberof Worker
     */
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
            clearTimeout(this._registerTimer);
            this._timer = null;
            this._registerTimer = null;
        }
    }

    async _startJob() {
        if (this.job) {
            throw new Error("Cannot start new job: One is already pending on this worker");
        }
        const jobData = await this.connector.startJob();
        if (jobData) {
            const job = new Job(jobData);
            job.worker = this;
            this._job = job;
            return job;
        }
        return null;
    }

    _startTimer(delay = this.checkDelay) {
        if (this._timer !== null) {
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
                    this._timer = null;
                    this._startTimer();
                }
            } catch (err) {
                this.emit("error", {
                    type: "start-job",
                    error: err
                });
                this._timer = null;
                this._startTimer(this.errorCheckDelay);
            }
        }, delay);
    }

    _startRegisterTimer() {
        // this._registerTimer = setTimeout()
    }
}

module.exports = Worker;
