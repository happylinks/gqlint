# GQLint
[![Build Status](https://travis-ci.org/happylinks/gqlint.svg?branch=master)](https://travis-ci.org/happylinks/gqlint) [![Coverage Status](https://coveralls.io/repos/github/happylinks/gqlint/badge.svg?branch=master)](https://coveralls.io/github/happylinks/gqlint?branch=master)

GQLint is a GraphQL linter with custom rules.

Please create tickets with new ideas for GraphQL rules.

## Table of Contents
- Installation
- Usage
- Command line
- Configuration
- Rules
- Plugins
- TODO
- Inspiration

## Installation
npm:
```sh
npm install -g gqlint
```

## Usage

```sh

  Usage: gqlint [options] <path>

  Lint GraphQL queries and schemas.

  Options:
    
    -h, --help                  output usage information
    -V, --version               output the version number
    -r, --reporter <reporter>   the reporter to use: stylish (default), compact, json
    -c, --config <config>       the config file to use: .gqlint (default)

```

## Command line
![cli](https://raw.githubusercontent.com/happylinks/gqlint/master/cli.png)

## Configuration

You can create your own .gqlint file which contains the list of rules you want to check, and to what severity.
This is mostly the same format as used by ESLint.

```json
{
    "rules": {
        "camelcase": "warning",
        "fieldname.typename": "warning",
        "relay.connection": "warning", 
        "relay.id": "warning", 
        "singular.mutations": "warning"
    }
}
```

The keys of the rules object are the names of the GQLint rules we currently have in GQLint. The value is the error level of the rule and can be one of these values:

* `"off"` or `0` - turn the rule off
* `"warn"` or `1` - turn the rule on as a warning (doesn't affect exit code)
* `"error"` or `2` - turn the rule on as an error (exit code will be 1)

The three error levels allow you control over how GQLint applies rules.

## Rules
- CamelCase
- Fieldname Typename
- Relay Connection
- Relay ID
- Singular Mutations

## Plugins

### Vim
I created a plugin for ALE in the plugins/vim folder. You can add this to your vim config after installing the tool.
If you want me to make a plugin for your editor, please open an issue (or a PR).

## TODO
- [x] Create .gqlint file to enable/disable rules.
- [ ] Make more rules.
- [ ] Refactor.

## Inspiration
- [ESLint](https://github.com/eslint/eslint)
- [Proselint](https://github.com/amperser/proselint/)

