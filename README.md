### How to use:
* Create next file at the root level:
`.env`

* Now add next environment variables to the file:
```
JWT_SECRET="someSecret"
DB_NAME="piazzaDB"
MONGO_DB_CONN_STRING="connString"

```

* To install all dependencies and dev dependencies run:
  `$ npm i`

* To start the API run:
  `$ npm start`


### Tests
* Running tests locally relly on having a working mongo cluster on your system.
If you have a Docker desktop there is a docker-compose.yml file which will spin up a mongo container just run:
```$ docker compose up -d```

* Now run:
`$ npm test`

### To do
* Add API documentation, like swagger or something like this.
* Improve test coverage
* Implement Auth0 authentication

## Stretch:
* Build a simple FE 