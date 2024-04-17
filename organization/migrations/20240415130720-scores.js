"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.runSql(
    `CREATE TABLE scores(
      id INT PRIMARY KEY AUTO_INCREMENT,
      score INT,
      badge VARCHAR(255),
      skillType INT,
      user_id INT,
      FOREIGN KEY (user_id) REFERENCES candidate.signup(id) ON DELETE CASCADE,
      FOREIGN KEY (skillType) REFERENCES skill_type(st_id) ON DELETE CASCADE
    )`,
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTbl("scores", callback);
};

exports._meta = {
  version: 1,
};
