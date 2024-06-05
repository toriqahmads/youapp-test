## Description

This is a project for technical test at YouApp.
Build with [Nest](https://github.com/nestjs/nest), [MongoDB](https://www.mongodb.com) [SocketIO] (https://socket.io)
Served with [Docket](https://www.docker.com/)

## Installation

```bash
$ git clone https://github.com/toriqahmads/youapp-test
$ cd youapp-test
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Use Docker

Adjust the MongoDB host inside `.env.docker` file with `host.docker.internal`

```bash
$ rm rf node_modules
$ docker build -t youapp-test .
$ docker run -d -p 4000:4000 youapp-test
```

Application started and listen at http://localhost:4000

## Use Docker Compose

```bash
$ rm rf node_modules
$ docker-compose build
$ docker-compose up -d
```

Application started and listen at http://localhost:4000
