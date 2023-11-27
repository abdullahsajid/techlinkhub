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
    ALTER TABLE signup
    ADD COLUMN name VARCHAR(255) NOT NULL
  `,callback)
};

exports.down = function(db,callback) {
  db.runSql(`
    ALTER TABLE signup
    DROP COLUMN name
  `,callback)
};

exports._meta = {
  "version": 1
};
