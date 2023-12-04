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
  db.runSql(`CREATE TABLE candidate_post_likes(
    id INT PRIMARY KEY AUTO_INCREMENT,
    userPost_id INT NOT NULL,
    usercandId INT NOT NULL,
    FOREIGN KEY (userPost_id) REFERENCES candidatepost(post_id) ON DELETE CASCADE,
    FOREIGN KEY (usercandId) REFERENCES signup(id) ON DELETE CASCADE
  )`,callback)
};

exports.down = function(db,callback) {
  db.dropTable('candidate_post_likes',callback)
};

exports._meta = {
  "version": 1
};
