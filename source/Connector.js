const VError = require("verror");

const NI = "Not implemented";

class Connector {
    /**
     * @typedef {Object} GetLatestJobTreeOptions
     * @property {Boolean=} useResult - Whether to use result data or initialisation
     *  data. Default is false (initialisation data).
     */

    /**
     * Get the latest job tree for some criteria
     * @param {Object} dataQuery Query item for quering job data (from 'data' onwards)
     * @param {GetLatestJobTreeOptions=} options Fetch options
     * @returns {Promise.<Array.<VulpesJob>>} A promise that resolves with an array
     *  of vulpes jobs
     * @memberof Connector
     */
    async getLatestJobTree(dataQuery, { useResult = false } = {}) {
        if (typeof dataQuery !== "object" || !dataQuery) {
            throw new Error("Expected data query as first parameter");
        }
        const query = Object.keys(dataQuery).reduce(
            (newQuery, key) =>
                Object.assign(newQuery, {
                    [useResult ? `result.data.${key}` : `data.${key}`]: dataQuery[key]
                }),
            {}
        );
        try {
            const [ job ] = await this.queryJobs(query, { limit: 1, sort: "created", order: "desc" });
            if (!job) {
                return null;
            }
            return await this.getJobTree(job.id);
        } catch (err) {
            throw new VError(err, "Failed getting latest job tree");
        }
    }

    async getJob() {
        throw new Error(NI);
    }

    async getJobTree() {
        throw new Error(NI);
    }

    async queryJobs() {
        throw new Error(NI);
    }

    async resetJob() {
        throw new Error(NI);
    }

    async startJob() {
        throw new Error(NI);
    }

    async stopJob() {
        throw new Error(NI);
    }

    async updateProgress() {
        throw new Error(NI);
    }
}

module.exports = Connector;
