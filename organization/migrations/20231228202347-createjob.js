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
  db.runSql(`CREATE TABLE createjob(
    cj_id INT PRIMARY KEY AUTO_INCREMENT,
    cj_title VARCHAR(255),
    cj_category VARCHAR(255),
    cj_location VARCHAR(255),
    cj_type VARCHAR(255),
    cj_description TEXT,
    cj_responsibility TEXT,
    cj_requirement TEXT,
    cj_qualification TEXT,
    cj_skills JSON,
    cj_orgProId INT NOT NULL,
    cj_user_id INT NOT NULL,
    FOREIGN KEY (cj_orgProId) REFERENCES org_profile(id) ON DELETE CASCADE,
    FOREIGN KEY (cj_user_id) REFERENCES candidate.signup(id) ON DELETE CASCADE
  )`,callback)
};

exports.down = function(db,callback) {
  db.dropTable('createjob',callback)
};

exports._meta = {
  "version": 1
};
