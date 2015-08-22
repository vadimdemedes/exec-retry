'use strict';

/**
 * Dependencies
 */

const through = require('through2');
const retry = require('retry');
const exec = require('child_process').exec;


/**
 * Expose exec-retry
 */

module.exports = execRetry;


/**
 * Exec with retry
 */

function execRetry (command, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof callback !== 'function') {
    callback = noop;
  }

  // retry 2 times by default
  if (!options.retries) {
    options.retries = 2;
  }

  let stdout = stream();
  let stderr = stream();

  let operation = retry.operation(options);

  operation.attempt(function () {
    let ps = exec(command, options, function (err) {
      let isKilled = err && err.killed && err.signal === 'SIGTERM';

      if (!isKilled && operation.retry(err)) {
        return;
      }

      if (err) {
        return callback.apply(null, arguments);
      }

      stdout.destroy();
      stderr.destroy();

      callback.apply(null, arguments);
    });

    // fake-exec module does not return
    // a ChildProcess object
    if (!ps) return;

    pipeData(ps.stdout, stdout);
    pipeData(ps.stderr, stderr);
  });

  return {
    stdout: stdout,
    stderr: stderr
  };
}


/**
 * Helpers
 */

function stream () {
  let stream = through(function (data, encoding, callback) {
    if (this._destroyed) {
      return;
    }

    this.push(data);

    callback();
  });

  stream.setEncoding('utf-8');

  return stream;
}

function pipeData (src, dest) {
  src.on('data', function (data) {
    dest.write(data);
  });
}


/**
 * Utilities
 */

function noop () {

}
