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
  db.runSql(`CREATE TABLE postimg(
    postImg_id INT PRIMARY KEY AUTO_INCREMENT,
    public_id INT,
    url VARCHAR(255),
    postImg__id INT NOT NULL,
    postImgUser_id INT NOT NULL,
    FOREIGN KEY (postImg__id) REFERENCES post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (postImgUser_id) REFERENCES signup(id) ON DELETE CASCADE
  )`,callback)
};

exports.down = function(db,callback) {
  db.dropTable('postimg',callback)
};

exports._meta = {
  "version": 1
};
