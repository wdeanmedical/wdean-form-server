const util = require('util')
const mysql = require('mysql')

const { AppError } = require('@errors')

const {
  DB_ERROR,
  DB_POOL_ERROR,
  // DB_READ_ERROR,
  // DB_WRITE_ERROR
} = require('@errors/errorMessages')

const state = { pool: null, mode: null }
// const READ = 'read';
// const WRITE = 'write';
const SQL_CONNECTION = process.env.NODE_ENV

const connect = mode =>
  // TODO is mode param used? no longer needed, keeping for back compatibility
  new Promise((resolve, reject) => {
    state.pool = mysql.createPool({
      host: process.env.SQL_WRITE_HOST,
      port: process.env.SQL_WRITE_PORT || 3306,
      user: process.env.SQL_WRITE_USER,
      password: process.env.SQL_WRITE_PW,
      database: process.env.SQL_DB_NAME,
    })
    state.mode = mode
    resolve()

    // TODO examine previous idea of separate read/write configurations
    // case 'production':
    //   state.pool = mysql.createPoolCluster();

    //   state.pool.add('WRITE', {
    //     host: process.env.SQL_PROD_WRITE_HOST,
    //     user: process.env.SQL_PROD_WRITE_USER,
    //     password: process.env.SQL_PROD_WRITE_PW,
    //     database: process.env.SQL_PRO_DB
    //   });

    //   state.pool.add('READ', {
    //     host: process.env.SQL_PROD_READ_HOST,
    //     user: process.env.SQL_PROD_READ_USER,
    //     password: process.env.SQL_PROD_READ_PW,
    //     database: process.env.SQL_PRO_DB
    //   });

    //   state.mode = mode;
    //   resolve();
    //   break;
  })

const get = type =>
  new Promise((resolve, reject) => {
    const pool = state.pool
    if (!pool) {
      reject(new AppError(DB_POOL_ERROR))
    }

    switch (type) {
      // case READ:
      //   state.pool.getConnection('READ*', (err, connection) => {
      //     if (err) {
      //       reject(new AppError(`${DB_READ_ERROR}: ${err}`));
      //     } else {
      //       resolve(connection);
      //     }
      //   });
      //   break;
      // case WRITE:
      //   state.pool.getConnection('WRITE', (err, connection) => {
      //     if (err) {
      //       reject(new AppError(`${DB_WRITE_ERROR}: ${err}`));
      //     } else {
      //       resolve(connection);
      //     }
      //   });
      //   break;
      case SQL_CONNECTION:
        // Promisify for Node.js async/await.
        state.pool.query = util.promisify(state.pool.query)

        resolve(state.pool)
        break
      default:
        reject(new AppError(DB_ERROR))
        break
    }
  })

const keysToUpdateList = (conn, keys) => {
  return Object.keys(keys)
    .filter(key => typeof keys[key] != 'undefined')
    .map(key => {
      return `${key} = ${conn.escape(keys[key])}`
    })
    .join(', ')
}

module.exports = {
  // READ,
  // WRITE,
  SQL_CONNECTION,
  connect,
  get,
  keysToUpdateList,
}
