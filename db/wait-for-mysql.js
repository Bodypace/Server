const app = require('./src/app')
const sequelize = app.get('sequelizeClient')


const timer = ms => new Promise( res => setTimeout(res, ms))

const sleep = process.env.MF_BB_PL_MYSQL_WAIT_SLEEP || 2000
const retries = process.env.MF_BB_PL_MYSQL_WAIT_RETRY || 10

let retry = 0


function tryToConnect() {
  console.log('Trying to connect to mysql... (attempt:', retry, '/', retries, ')')
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      process.exit(0)
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
      if (retry >= retries) {
        process.exit(1)
      }
      retry += 1
      timer(sleep).then(tryToConnect)
    });
}

tryToConnect()