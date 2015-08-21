'use strict';

/**
 * Dependencies
 */

const assert = require('assert');
const fake = require('fake-exec');
const exec = require('./');


/**
 * Tests
 */

describe ('exec-retry', function () {

  it ('successful first attempt', function (done) {
    fake('ls');

    exec('ls', done);
  });

  it ('retry failed command', function (done) {
    fake('ls', 1);

    setTimeout(function () {
      fake('ls', 0);
    }, 1000);

    exec('ls', done);
  });

  it ('stop retrying after N tries', function (done) {
    this.timeout(4000);

    fake('ls', 1);

    exec('ls', { retries: 2 }, function (err) {
      assert(typeof err === 'object', 'no error passed');

      done();
    });
  });

  it ('stream stdout', function (done) {
    this.timeout(6000);

    fake('ping google.com', 1);

    setTimeout(function () {
      fake.clear();
    }, 1000);

    let hasData = false;

    let ps = exec('ping google.com', { timeout: 2000 }, function () {
      assert(hasData, 'data was not received');

      done();
    });

    ps.stdout.on('data', function (data) {
      hasData = true;

      assert(/64 bytes/.test(data), 'unknown output');
    });
  });

});
