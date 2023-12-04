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
  db.runSql(`CREATE TABLE org_profile(
    id INT PRIMARY KEY AUTO_INCREMENT,
    org_name VARCHAR(255) NOT NULL,
    description TEXT,
    org_email VARCHAR(255) DEFAULT NULL,
    industry VARCHAR(255) DEFAULT NULL,
    location VARCHAR(255) DEFAULT NULL,
    banner_url VARCHAR(255) DEFAULT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL,
    org_website VARCHAR(255) DEFAULT NULL,
    founded_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id int NOT NULL,
    FOREIGN KEY (user_id) REFERENCES candidate.signup(id) ON DELETE CASCADE
  )`,callback)
};

exports.down = function(db,callback) {
  db.dropTable('org_profile',callback)
};

exports._meta = {
  "version": 1
};
