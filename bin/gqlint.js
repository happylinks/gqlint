#!/usr/bin/env node
'use strict';

var fs = require('fs');
var gqlint = require('../lib/gqlint');
var path = require('path');
var pkg = require('../package.json');
var program = require('commander');
var reportResult;

initProgram();
runProgram();

function initProgram() {
  program
    .version(pkg.version)
    .usage('[options] <path>')
    .description('Lint GraphQL queries and schemas.')
    .option(
      '-r, --reporter <reporter>',
      'the reporter to use: stylish (default), compact, json',
      'stylish'
    )
    .option(
      '-c, --config <config>',
      'the config file to use: .gqlint (default)',
      '.gqlint'
    )
    .parse(process.argv);
  reportResult = loadReporter(program.reporter);
}

function getGQLintConfig() {
  let data;

  try {
    data = fs.readFileSync(program.config, { encoding: 'utf8' });
  } catch (e) {
    console.error('Found no config file, running with default config.');
    return;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Could not parse .gqlint file.');
    throw e;
  }
}

function runProgram() {
  if (program.args.length > 1) {
    program.help();
  }
  if (program.args[0]) {
    return runProgramOnFile(program.args[0]);
  }
  runProgramOnStdIn();
}

function runProgramOnFile(fileName) {
  fs.readFile(fileName, { encoding: 'utf8' }, function(error, data) {
    if (error) {
      console.error('File "' + fileName + '" could not be found');
      process.exit(1);
    }
    handleInputSuccess(data, fileName);
  });
}

function runProgramOnStdIn() {
  if (isTty(process.stdin)) {
    program.help();
  }
  captureStdIn(handleInputSuccess);
}

function handleInputSuccess(data, fileName) {
  const gqlintConfig = getGQLintConfig();
  var result = gqlint(data, fileName, gqlintConfig || {});
  var output = reportResult(result, program);
  console.log(output);
  if (reportShouldFail(result)) {
    process.exit(1);
  }
}

function loadReporter(name) {
  var reporter = requireFirst(
    ['../reporter/' + name, name, path.join(process.cwd(), name)],
    null
  );
  if (!reporter) {
    console.error('Reporter "' + name + '" could not be found');
    process.exit(1);
  }
  return reporter;
}

function requireFirst(stack, defaultReturn) {
  if (!stack.length) {
    return defaultReturn;
  }
  try {
    return require(stack.shift());
  } catch (error) {
    return requireFirst(stack, defaultReturn);
  }
}

function reportShouldFail(result) {
  let fail = false;

  result.forEach(file => {
    file.messages.forEach(message => {
      if (message.severity === 2) {
        fail = true;
      }
    });
  });

  return fail;
}

function captureStdIn(done) {
  var data = '';
  process.stdin.resume();
  process.stdin.on('data', function(chunk) {
    data += chunk;
  });
  process.stdin.on('end', function() {
    done(data, 'stdin');
  });
}

function isTty(stream) {
  return stream.isTTY === true;
}
