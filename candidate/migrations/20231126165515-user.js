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
    CREATE TABLE users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      banner_url VARCHAR(255),
      avatar_url VARCHAR(255),
      name VARCHAR(50) NOT NULL,
      bio TEXT,
      education TEXT,
      experience TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,callback);
};

exports.down = function(db,callback) {
  db.dropTable('users',callback)
};

exports._meta = {
  "version": 1
};
