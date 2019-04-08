const { request } = require("cowl");
const joinURL = require("url-join");
const VError = require("verror");
const Connector = require("./Connector.js");

/**
 * Remote connector class for connecting Vulpes APIs to
 * clients
 * @augments Connector
 */
class RemoteConnector extends Connector {
    /**
     * Constructor for a RemoteConnector
     * @param {String} apiURL The URL root to the Vulpes API (eg: "http://localhost/api/v1")
     */
    constructor(apiURL) {
        super();
        this._apiURL = apiURL;
    }

    /**
     * The API URL base
     * @type {String}
     * @memberof RemoteConnector
     * @readonly
     */
    get apiURL() {
        return this._apiURL;
    }

    /**
     * Get a job for an ID
     * @param {String} jobID The ID of the job
     * @returns {Promise.<VulpesJob>} The job matching the ID
     * @memberof RemoteConnector
     */
    async getJob(jobID) {
        const url = joinURL(this.apiURL, `/job/${jobID}`);
        try {
            const { data } = await request(url);
            return data.job;
        } catch (err) {
            throw new VError({
                info: {
                    statusCode: err.statusCode || 0,
                    statusText: err.status || ""
                },
                cause: err
            }, "Failed to get job");
        }
    }

    /**
     * Get a job tree by a member's ID
     * @param {String} jobID The job ID to fetch the tree for
     * @returns {Promise.<Array.<VulpesJob>>} A promise that resolves with an array
     *  of vulpes jobs
     * @memberof RemoteConnector
     */
    async getJobTree(jobID) {
        const url = joinURL(this.apiURL, `/job-tree/${jobID}`);
        let results;
        try {
            results = await request(url);
        } catch (err) {
            throw new VError({
                info: {
                    statusCode: err.statusCode || 0,
                    statusText: err.status || ""
                },
                cause: err
            }, "Failed to get job tree");
        }
        return results.data.jobs;
    }

    /**
     * Get the time at the point where the Service is running
     * @returns {Promise.<Number>} A promise that resolves with the timestamp of the server
     * @memberof RemoteConnector
     */
    async getServiceTime() {
        const url = joinURL(this.apiURL, "/time");
        let results;
        try {
            results = await request(url);
        } catch (err) {
            throw new VError({
                info: {
                    statusCode: err.statusCode || 0,
                    statusText: err.status || ""
                },
                cause: err
            }, "Failed to get service time");
        }
        return results.data.time;
    }

    /**
     * Query the remote service for jobs
     * @param {Object} query The jobs query (refer to Vulpes documentation)
     * @param {Object=} options Query options
     * @returns {Promise.<Array.<VulpesJob>>} A promise that resolves with an array
     *  of jobs
     * @memberof RemoteConnector
     */
    async queryJobs(query, options = {}) {
        const url = joinURL(this.apiURL, "/query/jobs");
        let results;
        try {
            results = await request({
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query,
                    options
                })
            })
        } catch (err) {
            throw new VError({
                info: {
                    statusCode: err.statusCode || 0,
                    statusText: err.status || ""
                },
                cause: err
            }, "Failed querying jobs");
        }
        return results.data.jobs;
    }

    /**
     * Reset a job with an ID
     * @param {String} jobID The job ID
     * @returns {Promise} A promise that resolves once the reset has been
     *  completed
     * @memberof RemoteConnector
     */
    async resetJob(jobID) {
        const url = joinURL(this.apiURL, `/job/${jobID}/reset`);
        try {
            await request(url);
        } catch (err) {
            throw new VError({
                info: {
                    statusCode: err.statusCode || 0,
                    statusText: err.status || ""
                },
                cause: err
            }, "Failed to reset job");
        }
    }

    /**
     * Start a job - fetches a job from the server
     * @returns {Promise.<VulpesJob>} A promise that resolves with a
     *  job to undertake
     * @memberof RemoteConnector
     */
    async startJob() {
        const url = joinURL(this.apiURL, "/work");
        let data;
        try {
            const { data: dataRaw } = await request(url);
            data = dataRaw;
        } catch (err) {
            throw new VError({
                info: {
                    statusCode: err.statusCode || 0,
                    statusText: err.status || ""
                },
                cause: err
            }, "Failed to start job");
        }
        const { job } = data;
        return job;
    }

    /**
     * Stop/Complete a job
     * @param {String} jobID The job ID
     * @param {String} resultType The result type: {@link https://github.com/Kiosked/vulpes/blob/master/API.md#ResultType ResultType}
     * @param {Object=} resultData The result data
     * @memberof RemoteConnector
     */
    async stopJob(jobID, resultType, resultData = {}) {
        const url = joinURL(this.apiURL, `/job/${jobID}/result`);
        try {
            await request({
                url,
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: resultType,
                    data: resultPayload
                })
            });
        } catch (err) {
            throw new VError({
                info: {
                    statusCode: err.statusCode || 0,
                    statusText: err.status || ""
                },
                cause: err
            }, "Failed to stop job");
        }
    }

    /**
     * Update job progress
     * @param {String} jobID The ID of the job to update progress for
     * @param {Number} currentValue The current progress value
     * @param {Number} maxValue The maximum progress value
     * @memberof RemoteConnector
     */
    async updateProgress(jobID, currentValue, maxValue) {
        const resultPayload = {
            "%progressCurrent": currentValue,
            "%progressMax": maxValue
        };
        const url = joinURL(this.apiURL, `/job/${jobID}/result`);
        try {
            await request({
                url,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: resultPayload
                })
            });
        } catch (err) {
            throw new VError({
                info: {
                    statusCode: err.statusCode || 0,
                    statusText: err.status || ""
                },
                cause: err
            }, "Failed to update job progress");
        }
    }

    /**
     * @typedef {Object} ServerStatus
     * @property {String} status - The status of the server (ok/offline/init)
     * @property {String} api - The server version
     * @property {Number} started - UTC timestamp of when the server was started
     */

    /**
     * Fetch the current system status
     * @returns {Promise.<ServerStatus>} A promise that resolves with the server state
     * @memberof RemoteConnector
     */
    async _getStatus() {
        const url = joinURL(this.apiURL, "/status");
        try {
            const { data } = await request(url);
            return data;
        } catch (err) {
            throw new VError({
                info: {
                    statusCode: err.statusCode || 0,
                    statusText: err.status || ""
                },
                cause: err
            }, "Failed to get status");
        }
    }
}

module.exports = RemoteConnector;
