wittycli
======

Wit.ai CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/wittycli.svg)](https://npmjs.org/package/wittycli)
[![Downloads/week](https://img.shields.io/npm/dw/wittycli.svg)](https://npmjs.org/package/wittycli)
[![License](https://img.shields.io/npm/l/wittycli.svg)](https://github.com/Projects/wittycli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g wittycli
$ wittycli COMMAND
running command...
$ wittycli (-v|--version|version)
wittycli/0.0.5 win32-x64 node-v12.19.0
$ wittycli --help [COMMAND]
USAGE
  $ wittycli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`wittycli apps:post`](#wittycli-appspost)
* [`wittycli export`](#wittycli-export)
* [`wittycli help [COMMAND]`](#wittycli-help-command)
* [`wittycli import`](#wittycli-import)
* [`wittycli message`](#wittycli-message)
* [`wittycli test`](#wittycli-test)

## `wittycli apps:post`

Creates a new app for an existing user.

```
USAGE
  $ wittycli apps:post

OPTIONS
  -a, --auth=auth
      (required) Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP 
      header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it 
      publicly. You can obtain one in Settings for your app. Alternatively you can set WIT_AUTH_TOKEN environment 
      variable.

  -h, --help
      show CLI help

  -l, --lang=lang
      (required) Language code, in the ISO 639-1 format.

  -n, --name=name
      (required) Name of the new app.

  -p, --private
      Private if flag provided.

  -t, --timezone=timezone
      Default timezone of your app. Defaults to America/Los_Angeles.

  -v, --version=version
      Every request requires a version parameter either in the URL or in the headers. This parameter is a date that 
      represents the "version" of the Wit API. We'll try to minimize backwards-incompatible changes we make to the API, 
      but when we do make these changes, this parameter will allow you to continue to use the API as before and give you 
      time to transition to the new implementation if you want. As of June 1st, 2014, requests that do not include a 
      version parameter will hit the latest version of our API.

  --dot=dot
      Use dot notation (https://github.com/rhalff/dot-object#pick-a-value-using-dot-notation) to retrieve a value from 
      json response.

EXAMPLE
  $ wittycli apps create --name=witapp --lang=en --private --timezone=Europe/Brussels
```

_See code: [src\commands\apps\post.ts](https://github.com/ShyykoSerhiy/wittycli/blob/v0.0.5/src\commands\apps\post.ts)_

## `wittycli export`

Exports Get a URL where you can download a ZIP file containing all of your app data. This ZIP file can be used to create a new app with the same data.

```
USAGE
  $ wittycli export

OPTIONS
  -a, --auth=auth
      (required) Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP 
      header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it 
      publicly. You can obtain one in Settings for your app. Alternatively you can set WIT_AUTH_TOKEN environment 
      variable.

  -d, --dir=dir
      Path of the output directory. If set this command will download a ZIP file and unzip to a provided directory.

  -h, --help
      show CLI help

  -o, --output=output
      Path of the output file. If set this command will download a ZIP file to a provided path.

  -v, --version=version
      Every request requires a version parameter either in the URL or in the headers. This parameter is a date that 
      represents the "version" of the Wit API. We'll try to minimize backwards-incompatible changes we make to the API, 
      but when we do make these changes, this parameter will allow you to continue to use the API as before and give you 
      time to transition to the new implementation if you want. As of June 1st, 2014, requests that do not include a 
      version parameter will hit the latest version of our API.

  --dot=dot
      Use dot notation (https://github.com/rhalff/dot-object#pick-a-value-using-dot-notation) to retrieve a value from 
      json response.

EXAMPLE
  $ wittycli export --output="./app.zip"
```

_See code: [src\commands\export.ts](https://github.com/ShyykoSerhiy/wittycli/blob/v0.0.5/src\commands\export.ts)_

## `wittycli help [COMMAND]`

display help for wittycli

```
USAGE
  $ wittycli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src\commands\help.ts)_

## `wittycli import`

Create a new app with all the app data from the exported app.

```
USAGE
  $ wittycli import

OPTIONS
  -a, --auth=auth
      (required) Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP 
      header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it 
      publicly. You can obtain one in Settings for your app. Alternatively you can set WIT_AUTH_TOKEN environment 
      variable.

  -d, --dir=dir
      Path of the import directory. If set this command will ZIP provided directory and import it.

  -f, --file=file
      Path of the import file. A ZIP file containing all of your app data.

  -h, --help
      show CLI help

  -n, --name=name
      (required) Name of the new app.

  -p, --private
      Private if flag provided.

  -v, --version=version
      Every request requires a version parameter either in the URL or in the headers. This parameter is a date that 
      represents the "version" of the Wit API. We'll try to minimize backwards-incompatible changes we make to the API, 
      but when we do make these changes, this parameter will allow you to continue to use the API as before and give you 
      time to transition to the new implementation if you want. As of June 1st, 2014, requests that do not include a 
      version parameter will hit the latest version of our API.

  --dot=dot
      Use dot notation (https://github.com/rhalff/dot-object#pick-a-value-using-dot-notation) to retrieve a value from 
      json response.

EXAMPLE
  $ wittycli import --name=witapp --private --file ./app.zip
```

_See code: [src\commands\import.ts](https://github.com/ShyykoSerhiy/wittycli/blob/v0.0.5/src\commands\import.ts)_

## `wittycli message`

Returns the extracted meaning from a sentence, based on the app data.

```
USAGE
  $ wittycli message

OPTIONS
  -a, --auth=auth
      (required) Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP 
      header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it 
      publicly. You can obtain one in Settings for your app. Alternatively you can set WIT_AUTH_TOKEN environment 
      variable.

  -h, --help
      show CLI help

  -n, --numberofintents=numberofintents
      [default: 1] The maximum number of n-best intents and traits you want to get back. The default is 1, and the maximum 
      is 8.

  -q, --query=query
      (required) User's query, between 0 and 280 characters.

  -t, --tag=tag
      A specific tag you want to use for the query. See GET /apps/:app/tags.

  -v, --version=version
      Every request requires a version parameter either in the URL or in the headers. This parameter is a date that 
      represents the "version" of the Wit API. We'll try to minimize backwards-incompatible changes we make to the API, 
      but when we do make these changes, this parameter will allow you to continue to use the API as before and give you 
      time to transition to the new implementation if you want. As of June 1st, 2014, requests that do not include a 
      version parameter will hit the latest version of our API.

  --dot=dot
      Use dot notation (https://github.com/rhalff/dot-object#pick-a-value-using-dot-notation) to retrieve a value from 
      json response.

EXAMPLE
  $ wittycli message --query="Set temperature to 70 degrees" --numberofintents=8
```

_See code: [src\commands\message.ts](https://github.com/ShyykoSerhiy/wittycli/blob/v0.0.5/src\commands\message.ts)_

## `wittycli test`

Tests the wittycli app with the provided file of expected utterances.

```
USAGE
  $ wittycli test

OPTIONS
  -a, --auth=auth
      (required) Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP 
      header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it 
      publicly. You can obtain one in Settings for your app. Alternatively you can set WIT_AUTH_TOKEN environment 
      variable.

  -f, --file=file
      (required) Filepath of the file with utterances in format of the Array<ResponseOfTheMessageAPI>

  -h, --help
      show CLI help

  -p, --parallel=parallel
      [default: 10] Max amount of parallel requests

  -v, --version=version
      Every request requires a version parameter either in the URL or in the headers. This parameter is a date that 
      represents the "version" of the Wit API. We'll try to minimize backwards-incompatible changes we make to the API, 
      but when we do make these changes, this parameter will allow you to continue to use the API as before and give you 
      time to transition to the new implementation if you want. As of June 1st, 2014, requests that do not include a 
      version parameter will hit the latest version of our API.

EXAMPLE
  $ wittycli test --file="./example/test.json"
```

_See code: [src\commands\test.ts](https://github.com/ShyykoSerhiy/wittycli/blob/v0.0.5/src\commands\test.ts)_
<!-- commandsstop -->
