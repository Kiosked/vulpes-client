const { RemoteConnector, Worker } = require("../../../source/index.js");

describe("jobs", function() {
    beforeEach(function() {
        return resetService().then(() => {
            this.worker = new Worker(new RemoteConnector("http://localhost:9090/api"));
        });
    });

    it("can be started", function(done) {
        this.worker.checkDelay = 200;
        this.worker.once("job", result => {
            this.worker.stop();
            const { job } = result;
            expect(job).to.be.an("object");
            done();
        });
        this.worker.start();
    });
});
