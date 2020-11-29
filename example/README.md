# Example of tests using wittycli

To try out tests you need to import this project firs. For this execute this command 

```sh
wittycli -a=<WITAI_AUTH_TOKEN> import --file ./exported.zip --name "tryingtests" --private --dot access_token --wait
```

it will output new auth_token for newly created wit.ai app. Use this token in next command to run tests.

```sh
wittycli test -a=<NEW_WITAI_AUTH_TOKEN> -f="./test.json" -p=20
```

Some of the tests are designed to fail. Look into the description field of each test to for more details.