'use strict';

/**
 * Dependencies
 */

const fake = require('fake-exec');
const test = require('tape');
const exec = require('./');


/**
 * Tests
 */

test ('successful first attempt', function (t) {
  t.plan(1);

  fake('ls');

  exec('ls', function (err) {
    t.equal(err, null);
  });

});

test ('retry failed command', function (t) {
  t.plan(1);

  fake('ls', 1);

  setTimeout(function () {
    fake('ls', 0);
  }, 2000);

  exec('ls', function (err) {
    t.equal(err, null);
  });
});

test ('stop retrying after N tries', function (t) {
  t.plan(1);

  fake('ls', 1);

  exec.timeouts = {
    retries: 2
  };

  exec('ls', function (err) {
    t.equal(typeof err, 'object');
  });
});

test ('stream stdout', function (t) {
  fake('ping google.com', 1);

  setTimeout(function () {
    fake.clear();
  }, 2000);

  let ps = exec('ping google.com', { timeout: 5000 }, function () {
    t.end();
  });

  ps.stdout.on('data', function (data) {
    t.equal(/64 bytes/.test(data), true);
  });
});
