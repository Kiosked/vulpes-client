const { expect } = require("chai");
const sinon = require("sinon");
const { request } = require("cowl");

function resetService() {
    return request("http://localhost:9090/tests/reset");
}

Object.assign(global, {
    expect,
    sinon,

    resetService
});

