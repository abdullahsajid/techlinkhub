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
  db.runSql(`CREATE TABLE resume(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    title VARCHAR(255),
    img VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cand_user_id INT NOT NULL,
    FOREIGN KEY (cand_user_id) REFERENCES signup(id) ON DELETE CASCADE
  )`,callback)
};

exports.down = function(db,callback) {
  db.dropTable('resume',callback)
};

exports._meta = {
  "version": 1
};
