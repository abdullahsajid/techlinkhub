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
      user_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES signup(id) ON DELETE CASCADE
    )
  `,callback)
};

exports.down = function(db, callback) {
  db.runSql(`ALTER TABLE skills DROP FOREIGN KEY user_id`, function(err) {
    if (err) return callback(err);
    db.dropTable('skills', callback);
  });
};

exports._meta = {
  "version": 1
};
