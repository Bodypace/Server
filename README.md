# Bodypace primary server

Bodypace REST and Socket.IO server

## How to use it

```bash
 # if you tweak those values update also .db.yml
 $ cp .env.example .env
```

```bash
 # make sure NodeJS, npm and Docker are installed
 $ npm install
 $ npm run db     # later run `npm run stop` to stop MySQL
 $ npm test       # optional
 $ npm start      # or `npm run dev` for instant refresh on code change
```

```bash
 # for interactive experimentation
 $ node repl.js
```