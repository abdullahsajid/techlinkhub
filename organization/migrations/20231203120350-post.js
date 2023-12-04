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
  db.runSql(`CREATE TABLE post(
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userProfile_id INT NOT NULL,
    user__id INT NOT NULL,
    FOREIGN KEY (userProfile_id) REFERENCES org_profile(id) ON DELETE CASCADE,
    FOREIGN KEY (user__id) REFERENCES candidate.signup(id) ON DELETE CASCADE
  )`,callback)
};

exports.down = function(db,callback) {
  db.dropTable('post',callback)
};

exports._meta = {
  "version": 1
};
