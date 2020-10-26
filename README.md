witcli
======

Wit.ai CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/witcli.svg)](https://npmjs.org/package/witcli)
[![Downloads/week](https://img.shields.io/npm/dw/witcli.svg)](https://npmjs.org/package/witcli)
[![License](https://img.shields.io/npm/l/witcli.svg)](https://github.com/Projects/witcli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g witcli
$ witcli COMMAND
running command...
$ witcli (-v|--version|version)
witcli/0.0.2 win32-x64 node-v12.19.0
$ witcli --help [COMMAND]
USAGE
  $ witcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`witcli apps:post`](#witcli-appspost)
* [`witcli export`](#witcli-export)
* [`witcli help [COMMAND]`](#witcli-help-command)
* [`witcli import`](#witcli-import)
* [`witcli message`](#witcli-message)
* [`witcli test`](#witcli-test)

## `witcli apps:post`

Creates a new app for an existing user.

```
USAGE
  $ witcli apps:post

OPTIONS
  -a, --auth=auth
      (required) Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP 
      header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it 
      publicly. You can obtain one in Settings for your

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
  $ witcli apps create --name=witapp --lang=en --private --timezone=Europe/Brussels
```

_See code: [src\commands\apps\post.ts](https://github.com/ShyykoSerhiy/witcli/blob/v0.0.2/src\commands\apps\post.ts)_

## `witcli export`

Exports Get a URL where you can download a ZIP file containing all of your app data. This ZIP file can be used to create a new app with the same data.

```
USAGE
  $ witcli export

OPTIONS
  -a, --auth=auth
      (required) Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP 
      header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it 
      publicly. You can obtain one in Settings for your

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
  $ witcli export --output="./app.zip"
```

_See code: [src\commands\export.ts](https://github.com/ShyykoSerhiy/witcli/blob/v0.0.2/src\commands\export.ts)_

## `witcli help [COMMAND]`

display help for witcli

```
USAGE
  $ witcli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src\commands\help.ts)_

## `witcli import`

Create a new app with all the app data from the exported app.

```
USAGE
  $ witcli import

OPTIONS
  -a, --auth=auth
      (required) Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP 
      header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it 
      publicly. You can obtain one in Settings for your

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
  $ witcli import --name=witapp --private --file ./app.zip
```

_See code: [src\commands\import.ts](https://github.com/ShyykoSerhiy/witcli/blob/v0.0.2/src\commands\import.ts)_

## `witcli message`

Returns the extracted meaning from a sentence, based on the app data.

```
USAGE
  $ witcli message

OPTIONS
  -a, --auth=auth
      (required) Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP 
      header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it 
      publicly. You can obtain one in Settings for your

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
  $ witcli message --query="Set temperature to 70 degrees" --numberofintents=8
```

_See code: [src\commands\message.ts](https://github.com/ShyykoSerhiy/witcli/blob/v0.0.2/src\commands\message.ts)_

## `witcli test`

Tests the witcli app with the provided file of expected utterances.

```
USAGE
  $ witcli test

OPTIONS
  -a, --auth=auth
      (required) Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP 
      header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it 
      publicly. You can obtain one in Settings for your

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
  $ witcli test --file="./example/test.json"
```

_See code: [src\commands\test.ts](https://github.com/ShyykoSerhiy/witcli/blob/v0.0.2/src\commands\test.ts)_
<!-- commandsstop -->
