const express = require("express");
const { Service } = require("vulpes");
const { createVulpesAPIRouter } = require("vulpes-api");
const app = express();
const port = 9090;

const service = new Service();

service.initialise().then(() => {
    app.get("/", (req, res) => {
        res.send("...");
    });

    app.use("/api", createVulpesAPIRouter(service));

    app.get("/tests/reset", function(req, res) {
        service
            .queryJobs()
            .then(jobs => Promise.all(jobs.map(job =>
                service.removeJob(job.id)
            )))
            .then(service.addJob({
                type: "generic"
            }))
            .then(() => {
                res.send("ok");
            })
            .catch(err => {
                res.status(500).send("Internal server error");
            });
    });

    app.listen(port, () => {
        console.log(`Application listening on port ${port}`);
    });
});
