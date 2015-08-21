# exec-retry [![Circle CI](https://circleci.com/gh/vdemedes/exec-retry.svg?style=svg)](https://circleci.com/gh/vdemedes/exec-retry)

`child_process.exec` with a retry functionality using [retry](https://npmjs.org/package/retry).


### Features

- Retry a command until success
- Set retry options (see [retry](https://www.npmjs.com/package/retry#retry-timeouts-options))
- It even returns streams, just like node's `exec`, oh wow


### Installation

```
$ npm install exec-retry --save
```


### Usage

```javascript
const exec = require('exec-retry');

exec('curl https://www.roqet.io', function (err, stdout, stderr) {
  // done!
});


// now set max retries number
exec('curl https://www.roqet.io', { retries: 3 }, function (err, stdout, stderr) {
  // fails after 3 retries
});


// and streams!
let ps = exec('ping google.com', function () {
  // done!
});

ps.stdout.on('data', function (data) {
  // stream output
});
```


### Tests

[![Circle CI](https://circleci.com/gh/vdemedes/exec-retry.svg?style=svg)](https://circleci.com/gh/vdemedes/exec-retry)

```
$ make test
```


### License

exec-retry is released under the MIT license.
