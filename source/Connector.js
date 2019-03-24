class Connector {
    async getNextJob() {
        throw new Error("Not implemented");
    }

    async stopJob() {
        throw new Error("Not implemented");
    }

    async updateProgress() {
        throw new Error("Not implemented");
    }
}

module.exports = Connector;
