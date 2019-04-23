const EventEmitter = require("events");
const {
    JOB_RESULT_TYPE_FAILURE,
    JOB_RESULT_TYPE_FAILURE_SOFT,
    JOB_RESULT_TYPE_SUCCESS,
    JOB_RESULT_TYPE_TIMEOUT
} = require("vulpes/symbols");

/**
 * Job class
 * @augments EventEmitter
 */
class Job extends EventEmitter {
    /**
     * Constructor for the Job class
     * @param {Object} jobData The job data, containing the entire job payload
     * @memberof Job
     */
    constructor(jobData) {
        super();
        this._jobData = jobData;
        this.worker = null;
    }

    /**
     * The job's data
     * @type {Object}
     * @readonly
     * @memberof Job
     */
    get data() {
        return this._jobData.data;
    }

    /**
     * The job ID
     * @type {String}
     * @readonly
     * @memberof Job
     */
    get id() {
        return this._jobData.id;
    }

    /**
     * The full job payload reference
     * @type {Object}
     * @readonly
     * @memberof Job
     */
    get jobData() {
        return this._jobData;
    }

    /**
     * The current job status
     * @type {String}
     * @readonly
     * @memberof Job
     */
    get status() {
        return this._jobData.status;
    }

    /**
     * The job type
     * @type {String}
     * @readonly
     * @memberof Job
     */
    get type() {
        return this._jobData.type;
    }

    /**
     * Get the time left to complete the job
     * @returns {Promise.<Number|Infinity>} Returns the time left in milliseconds or Infinity if
     *  no limit is imposed
     * @memberof Job
     */
    async getTimeLeft() {
        const { times, timeLimit = null } = this._jobData;
        if (!timeLimit) {
            return Infinity;
        }
        const { started } = times;
        const now = await this.worker.connector.getServiceTime();
        const timeLeft = timeLimit - (now - started);
        return timeLimit > 0 ? timeLimit : 0;
    }

    /**
     * Stop the job, setting a result
     * @param {String} resultType The type of result
     * @param {Object=} resultData Optional result payload
     * @returns {Promise}
     * @memberof Job
     */
    async stop(resultType, resultData = {}) {
        const jobID = this.id;
        await this.worker.connector.stopJob(jobID, resultType, resultData);
        this._jobData = null;
        this.emit("jobStopped", {
            jobID,
            resultType,
            resultData
        });
        if (this.worker.running) {
            this.worker._job = null;
            this.worker._timer = null;
            this.worker._startTimer();
        }
    }

    /**
     * Update the job's progress
     * @param {Number} current The current progress value (must be 0 or greater and less than or equal to max)
     * @param {Number} max The max progress value (must be greater than or equal to current)
     * @returns {Promise}
     * @memberof Job
     */
    async updateProgress(current, max) {
        await this.worker.connector.updateProgress(this.id, current, max);
        this.emit("jobProgress", {
            jobID: this.id,
            currentProgress: current,
            maxProgress: max
        });
    }
}

/**
 * Job result type
 * @type {Object}
 * @name ResultType
 * @memberof Job
 * @static
 */
Job.ResultType = {
    /**
     * Failure result type
     * @type {String}
     * @memberof ResultType
     */
    Failure: JOB_RESULT_TYPE_FAILURE,
    /**
     * Soft-failure result type
     * @type {String}
     * @memberof ResultType
     */
    SoftFailure: JOB_RESULT_TYPE_FAILURE_SOFT,
    /**
     * Success result type
     * @type {String}
     * @memberof ResultType
     */
    Success: JOB_RESULT_TYPE_SUCCESS,
    /**
     * Timeout-based failure result type
     * @type {String}
     * @memberof ResultType
     */
    Timeout: JOB_RESULT_TYPE_TIMEOUT
};

module.exports = Job;
