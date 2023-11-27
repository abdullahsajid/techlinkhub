'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db,callback) {
  db.runSql(`
    ALTER TABLE users
    ADD COLUMN banner_url VARCHAR(255),
    ADD COLUMN avatar_url VARCHAR(255),
    ADD COLUMN experience TEXT,
    ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `,callback)
};

exports.down = function(db,callback) {
  db.runSql(`
    ALTER TABLE users
    DROP COLUMN banner_url,
    DROP COLUMN avatar_url,
    DROP COLUMN experience,
    DROP COLUMN createdAt,
    DROP COLUMN updatedAt
  `,callback)
};

exports._meta = {
  "version": 1
};
