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

exports.up = function(db,callback){
  db.runSql(`CREATE TABLE profile(
      id INT PRIMARY KEY AUTO_INCREMENT,
      banner_url VARCHAR(255),
      avatar_url VARCHAR(255),
      name VARCHAR(50) NOT NULL,
      bio TEXT,
      education TEXT,
      experience TEXT,
      about TEXT DEFAULT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      user_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES signup(id) ON DELETE CASCADE
  )`,callback)
};

exports.down = function(db,callback) {
  db.dropTable('profile',callback)
};

exports._meta = {
  "version": 1
};
