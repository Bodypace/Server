# Bodypace primary server

Bodypace REST and Socket.IO server

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

1. Make sure you have installed

    * [NodeJS](https://nodejs.org/)

    * [npm](https://www.npmjs.com/) 

    * [Docker](https://www.docker.com/) (for MySQL, you can use locally installed MySQL and alter step 3)

2. Install your dependencies

    ```
    npm install
    ```

3. Set up dev environment

    ```
    . dev/env
    ```

4. Start MySQL server (with Docker)

    ```
    db/up
    ```

5. Run tests (optional)

    ```
    npm test
    ```

6. Start server

    ```
    npm start
    ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
