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
    CREATE TABLE skills(
      id INT PRIMARY KEY AUTO_INCREMENT,
      skill_name VARCHAR(255),
      user_id INT,
      resume_id INT,
      FOREIGN KEY (resume_id) REFERENCES resume(id) ON DELETE CASCADE
      FOREIGN KEY (user_id) REFERENCES signup(id) ON DELETE CASCADE
    )
  `,callback)
};

exports.down = function(db,callback) {
  db.dropTable
};

exports._meta = {
  "version": 1
};
