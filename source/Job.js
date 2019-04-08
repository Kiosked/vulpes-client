const EventEmitter = require("events");
const {
    JOB_RESULT_TYPE_FAILURE,
    JOB_RESULT_TYPE_FAILURE_SOFT,
    JOB_RESULT_TYPE_SUCCESS,
    JOB_RESULT_TYPE_TIMEOUT
} = require("vulpes/symbols");

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

    async stop(resultType, resultData = {}) {
        const jobID = this.id;
        await this.worker.connector.stopJob(jobID, resultType, resultData);
        this._jobData = null;
        this.emit("jobStopped", {
            jobID,
            resultType,
            resultData
        });
    }

    async updateProgress(current, max) {
        await this.worker.connector.updateProgress(this.id, current, max);
        this.emit("jobProgress", {
            jobID: this.id,
            currentProgress: current,
            maxProgress: max
        });
    }
}

Job.ResultType = {
    Failure: JOB_RESULT_TYPE_FAILURE,
    SoftFailure: JOB_RESULT_TYPE_FAILURE_SOFT,
    Success: JOB_RESULT_TYPE_SUCCESS,
    Timeout: JOB_RESULT_TYPE_TIMEOUT
};

module.exports = Job;
