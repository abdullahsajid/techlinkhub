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
    CREATE TABLE orgsociallinks(
      id INT PRIMARY KEY AUTO_INCREMENT,
      social_name VARCHAR(255),
      link VARCHAR(255),
      userProf_id INT NOT NULL,
      userLink_id INT NOT NULL,
      FOREIGN KEY (userProf_id) REFERENCES org_profile(id) ON DELETE CASCADE,
      FOREIGN KEY (userLink_id) REFERENCES candidate.signup(id) ON DELETE CASCADE
    )
  `,callback)
};

exports.down = function(db, callback) {
  db.runSql(`ALTER TABLE orgsociallinks DROP FOREIGN KEY user_id`, function(err) {
    if (err) return callback(err);
    db.dropTable('orgsociallinks', callback);
  });
};

exports._meta = {
  "version": 1
};
