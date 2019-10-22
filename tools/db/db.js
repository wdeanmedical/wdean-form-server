require('../secrets');
const fs = require('fs');
const knex = require('knex');
const task = require('../task');

// The list of available commands, e.g. node tools/db.js rollback
const commands = [
  'version',
  'migrate',
  'rollback',
  'migration',
  'seed-initial',
  'seed-supplemental'
];
const command = process.argv[2];

let config = {
  client: 'mysql',
  migrations: {
    tableName: 'migrations',
    directory: 'tools/sql/migrations'
  },
  debug: false
};

switch (process.env.NODE_ENV) {
  case 'local':
  case 'remoteDev':
  case 'aws':
  case 'awsprod':
  case 'development':
  case 'staging':
    config.connection = {
      host: process.env.SQL_WRITE_HOST,
      port: process.env.SQL_WRITE_PORT || 3306,
      user: process.env.SQL_WRITE_USER,
      password: process.env.SQL_WRITE_PW,
      database: process.env.SQL_DB_NAME
    };
    break;
  default:
    break;
}

// The template for database migration files (see templates/*.js)
const version = new Date()
  .toISOString()
  .substr(0, 16)
  .replace(/\D/g, '');
const template = `module.exports.up = async (db) => {\n  \n};\n
module.exports.down = async (db) => {\n  \n};\n
module.exports.configuration = { transaction: true };\n`;

module.exports = task('db', async () => {
  let db;

  if (!commands.includes(command)) {
    throw new Error(`Unknown command: ${command}`);
  }
  try {
    switch (command) {
      case 'version':
        db = knex(config);
        await db.migrate.currentVersion(config);
        break;
      case 'migration':
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.writeFileSync(
          `tools/sql/migrations/${version}_${process.argv[3] || 'new'}.js`,
          template,
          'utf8'
        );
        break;
      case 'rollback':
        db = knex(config);
        await db.migrate.rollback(config);
        break;
      case 'seed-initial':
        config.seeds = { directory: './tools/sql/seeds/initial' };
        db = knex(config);
        await db.seed.run(config);
        break;
      case 'seed-supplemental':
        config.seeds = { directory: './tools/sql/seeds/supplemental' };
        db = knex(config);
        await db.seed.run(config);
        break;
      default:
        db = knex(config);
        await db.migrate.latest(config);
    }
  } finally {
    if (db) {
      await db.destroy();
    }
  }
});
