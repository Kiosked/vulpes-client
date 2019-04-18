## Modules

<dl>
<dt><a href="#module_VulpesClient">VulpesClient</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#RemoteConnector">RemoteConnector</a> ⇐ <code>Connector</code></dt>
<dd><p>Remote connector class for connecting Vulpes APIs to
clients</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#GetLatestJobTreeOptions">GetLatestJobTreeOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ServerStatus">ServerStatus</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#VulpesJob">VulpesJob</a> : <code>Object</code></dt>
<dd><p>A remote job payload (may not be complete)</p>
</dd>
</dl>

<a name="module_VulpesClient"></a>

## VulpesClient

* [VulpesClient](#module_VulpesClient)
    * [.Worker](#module_VulpesClient.Worker) ⇐ <code>EventEmitter</code>
        * [new Worker(connector)](#new_module_VulpesClient.Worker_new)

<a name="module_VulpesClient.Worker"></a>

### VulpesClient.Worker ⇐ <code>EventEmitter</code>
Client worker

**Kind**: static class of [<code>VulpesClient</code>](#module_VulpesClient)  
**Extends**: <code>EventEmitter</code>  
<a name="new_module_VulpesClient.Worker_new"></a>

#### new Worker(connector)
Constructor for the worker


| Param | Type | Description |
| --- | --- | --- |
| connector | <code>Connector</code> | A connector instance |

<a name="RemoteConnector"></a>

## RemoteConnector ⇐ <code>Connector</code>
Remote connector class for connecting Vulpes APIs to
clients

**Kind**: global class  
**Extends**: <code>Connector</code>  

* [RemoteConnector](#RemoteConnector) ⇐ <code>Connector</code>
    * [new RemoteConnector(apiURL)](#new_RemoteConnector_new)
    * [.apiURL](#RemoteConnector+apiURL) : <code>String</code>
    * [.getJob(jobID)](#RemoteConnector+getJob) ⇒ [<code>Promise.&lt;VulpesJob&gt;</code>](#VulpesJob)
    * [.getJobTree(jobID)](#RemoteConnector+getJobTree) ⇒ <code>Promise.&lt;Array.&lt;VulpesJob&gt;&gt;</code>
    * [.getServiceTime()](#RemoteConnector+getServiceTime) ⇒ <code>Promise.&lt;Number&gt;</code>
    * [.queryJobs(query, [options])](#RemoteConnector+queryJobs) ⇒ <code>Promise.&lt;Array.&lt;VulpesJob&gt;&gt;</code>
    * [.registerWorker(workerID)](#RemoteConnector+registerWorker) ⇒ <code>Promise</code>
    * [.resetJob(jobID)](#RemoteConnector+resetJob) ⇒ <code>Promise</code>
    * [.startJob()](#RemoteConnector+startJob) ⇒ [<code>Promise.&lt;VulpesJob&gt;</code>](#VulpesJob)
    * [.stopJob(jobID, resultType, [resultData])](#RemoteConnector+stopJob)
    * [.updateProgress(jobID, currentValue, maxValue)](#RemoteConnector+updateProgress)
    * [._getStatus()](#RemoteConnector+_getStatus) ⇒ [<code>Promise.&lt;ServerStatus&gt;</code>](#ServerStatus)
    * [.getLatestJobTree(dataQuery, [options])](#Connector+getLatestJobTree) ⇒ <code>Promise.&lt;Array.&lt;VulpesJob&gt;&gt;</code>

<a name="new_RemoteConnector_new"></a>

### new RemoteConnector(apiURL)
Constructor for a RemoteConnector


| Param | Type | Description |
| --- | --- | --- |
| apiURL | <code>String</code> | The URL root to the Vulpes API (eg: "http://localhost/api/v1") |

<a name="RemoteConnector+apiURL"></a>

### remoteConnector.apiURL : <code>String</code>
The API URL base

**Kind**: instance property of [<code>RemoteConnector</code>](#RemoteConnector)  
**Read only**: true  
<a name="RemoteConnector+getJob"></a>

### remoteConnector.getJob(jobID) ⇒ [<code>Promise.&lt;VulpesJob&gt;</code>](#VulpesJob)
Get a job for an ID

**Kind**: instance method of [<code>RemoteConnector</code>](#RemoteConnector)  
**Returns**: [<code>Promise.&lt;VulpesJob&gt;</code>](#VulpesJob) - The job matching the ID  

| Param | Type | Description |
| --- | --- | --- |
| jobID | <code>String</code> | The ID of the job |

<a name="RemoteConnector+getJobTree"></a>

### remoteConnector.getJobTree(jobID) ⇒ <code>Promise.&lt;Array.&lt;VulpesJob&gt;&gt;</code>
Get a job tree by a member's ID

**Kind**: instance method of [<code>RemoteConnector</code>](#RemoteConnector)  
**Returns**: <code>Promise.&lt;Array.&lt;VulpesJob&gt;&gt;</code> - A promise that resolves with an array
 of vulpes jobs  

| Param | Type | Description |
| --- | --- | --- |
| jobID | <code>String</code> | The job ID to fetch the tree for |

<a name="RemoteConnector+getServiceTime"></a>

### remoteConnector.getServiceTime() ⇒ <code>Promise.&lt;Number&gt;</code>
Get the time at the point where the Service is running

**Kind**: instance method of [<code>RemoteConnector</code>](#RemoteConnector)  
**Returns**: <code>Promise.&lt;Number&gt;</code> - A promise that resolves with the timestamp of the server  
<a name="RemoteConnector+queryJobs"></a>

### remoteConnector.queryJobs(query, [options]) ⇒ <code>Promise.&lt;Array.&lt;VulpesJob&gt;&gt;</code>
Query the remote service for jobs

**Kind**: instance method of [<code>RemoteConnector</code>](#RemoteConnector)  
**Returns**: <code>Promise.&lt;Array.&lt;VulpesJob&gt;&gt;</code> - A promise that resolves with an array
 of jobs  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> | The jobs query (refer to Vulpes documentation) |
| [options] | <code>Object</code> | Query options |

<a name="RemoteConnector+registerWorker"></a>

### remoteConnector.registerWorker(workerID) ⇒ <code>Promise</code>
Register the worker on the remote service

**Kind**: instance method of [<code>RemoteConnector</code>](#RemoteConnector)  
**Returns**: <code>Promise</code> - A promise that resolves once registration
 is complete  

| Param | Type | Description |
| --- | --- | --- |
| workerID | <code>String</code> | The worker's ID (UUID) |

<a name="RemoteConnector+resetJob"></a>

### remoteConnector.resetJob(jobID) ⇒ <code>Promise</code>
Reset a job with an ID

**Kind**: instance method of [<code>RemoteConnector</code>](#RemoteConnector)  
**Returns**: <code>Promise</code> - A promise that resolves once the reset has been
 completed  

| Param | Type | Description |
| --- | --- | --- |
| jobID | <code>String</code> | The job ID |

<a name="RemoteConnector+startJob"></a>

### remoteConnector.startJob() ⇒ [<code>Promise.&lt;VulpesJob&gt;</code>](#VulpesJob)
Start a job - fetches a job from the server

**Kind**: instance method of [<code>RemoteConnector</code>](#RemoteConnector)  
**Returns**: [<code>Promise.&lt;VulpesJob&gt;</code>](#VulpesJob) - A promise that resolves with a
 job to undertake  
<a name="RemoteConnector+stopJob"></a>

### remoteConnector.stopJob(jobID, resultType, [resultData])
Stop/Complete a job

**Kind**: instance method of [<code>RemoteConnector</code>](#RemoteConnector)  

| Param | Type | Description |
| --- | --- | --- |
| jobID | <code>String</code> | The job ID |
| resultType | <code>String</code> | The result type: [ResultType](https://github.com/Kiosked/vulpes/blob/master/API.md#ResultType) |
| [resultData] | <code>Object</code> | The result data |

<a name="RemoteConnector+updateProgress"></a>

### remoteConnector.updateProgress(jobID, currentValue, maxValue)
Update job progress

**Kind**: instance method of [<code>RemoteConnector</code>](#RemoteConnector)  

| Param | Type | Description |
| --- | --- | --- |
| jobID | <code>String</code> | The ID of the job to update progress for |
| currentValue | <code>Number</code> | The current progress value |
| maxValue | <code>Number</code> | The maximum progress value |

<a name="RemoteConnector+_getStatus"></a>

### remoteConnector.\_getStatus() ⇒ [<code>Promise.&lt;ServerStatus&gt;</code>](#ServerStatus)
Fetch the current system status

**Kind**: instance method of [<code>RemoteConnector</code>](#RemoteConnector)  
**Returns**: [<code>Promise.&lt;ServerStatus&gt;</code>](#ServerStatus) - A promise that resolves with the server state  
<a name="Connector+getLatestJobTree"></a>

### remoteConnector.getLatestJobTree(dataQuery, [options]) ⇒ <code>Promise.&lt;Array.&lt;VulpesJob&gt;&gt;</code>
Get the latest job tree for some criteria

**Kind**: instance method of [<code>RemoteConnector</code>](#RemoteConnector)  
**Returns**: <code>Promise.&lt;Array.&lt;VulpesJob&gt;&gt;</code> - A promise that resolves with an array
 of vulpes jobs  

| Param | Type | Description |
| --- | --- | --- |
| dataQuery | <code>Object</code> | Query item for quering job data (from 'data' onwards) |
| [options] | [<code>GetLatestJobTreeOptions</code>](#GetLatestJobTreeOptions) | Fetch options |

<a name="GetLatestJobTreeOptions"></a>

## GetLatestJobTreeOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [useResult] | <code>Boolean</code> | Whether to use result data or initialisation  data. Default is false (initialisation data). |

<a name="ServerStatus"></a>

## ServerStatus : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| status | <code>String</code> | The status of the server (ok/offline/init) |
| api | <code>String</code> | The server version |
| started | <code>Number</code> | UTC timestamp of when the server was started |

<a name="VulpesJob"></a>

## VulpesJob : <code>Object</code>
A remote job payload (may not be complete)

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The job ID |
| type | <code>String</code> | The job type |
| status | <code>String</code> | The job status (pending etc.): [Status](https://github.com/Kiosked/vulpes/blob/master/API.md#Status) |
| priority | <code>String</code> | The priority of the job: [Priority](https://github.com/Kiosked/vulpes/blob/master/API.md#Priority) |
| created | <code>Number</code> | The creation timestamp (UTC) |
| parents | <code>Array.&lt;String&gt;</code> | Array of parent IDs |
| data | <code>Object</code> | The job data (initialisation) |
| result | <code>Object</code> | The results of the job's previous execution |
| result.type | <code>String</code> | The type of result: [ResultType](https://github.com/Kiosked/vulpes/blob/master/API.md#ResultType) |
| result.data | <code>Object</code> | The result data |

