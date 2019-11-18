# tenttiarkisto-backend

## Setup

Postgres database on docker and [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) to manage node process.

1. Install 
   - [Docker Desktop Community](https://www.docker.com/products/docker-desktop)
   - npm (or [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows)
2. Run
   - `docker-compose up`
   - `npm start`
3. Goto [`localhost:3002`](http://localhost:3002)

## Routes

[API description](./API.md)

## Testing

Folder `requests` contains simple API tests using [REST Client](https://github.com/Huachao/vscode-restclient)