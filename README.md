# Vulpes Client
> JavaScript job worker client for the Vulpes platform

## About

Vulpes is a job management platform that requires _workers_ to check for and receive work, and then for them to submit a result after attempting to do the work. Vulpes Client provides a simple API with which to perform these worker operations.


## Usage

Usage is quite simple - create a `Worker` instance, connect it to a Vulpes API endpoint and start listening:

```javascript
const { RemoteConnector, Worker } = require("vulpes-client");

const worker = new Worker(new RemoteConnector(API_URI));
worker.on("job", payload => startJob(payload.job));
```

`Worker` is an `EventEmitter`, and it emits `job` events when a job is ready to start. It will not emit more `job` events if a job is currently running on the worker. You can stop/complete a job by calling [`Job#stop`](https://github.com/Kiosked/vulpes-client/blob/master/API.md#Job+stop) with a result type and result payload.

Check out the [API documentation](API.md) for more information on class usage.
