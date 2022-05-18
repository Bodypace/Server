# Bodypace primary server

Bodypace REST and Socket.IO server

## How to use it locally

run below, then visit [Postman/bodypace](https://postman.com/bodypace) 
```bash
 $ cp .env.example .env  # if you tweak those values update also .db.yml
 $ npm install
 $ npm run db     # requires Docker, later run `npm run stop` to stop MySQL
 $ npm test       # optional

 # start server (choose one)
 $ npm run start  # normal run 
 $ npm run dev    # instant refresh on code change
 $ npm run repl   # interactive shell
```