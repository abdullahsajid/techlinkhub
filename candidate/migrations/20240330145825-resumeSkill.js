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
  db.runSql(`CREATE TABLE resume_skill(
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resume_id INT,
    user_id INT,
    FOREIGN KEY (resume_id) REFERENCES resume(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES signup(id) ON DELETE CASCADE
  )`,callback)
};

exports.down = function(db,callback) {
  db.dropTable('resume_skill',callback)
};

exports._meta = {
  "version": 1
};
