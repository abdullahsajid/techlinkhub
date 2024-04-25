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
  db.runSql(`CREATE TABLE projects(
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    project_title VARCHAR(255),
    project_description TEXT,
    project_start_date DATE,
    project_end_date DATE,
    project_budget INT,
    project_status VARCHAR(255),
    project_type VARCHAR(255),
    project_skills JSON,
    user_id INT,
    project_org_id INT,
    createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_org_id) REFERENCES org_profile(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES candidate.signup(id) ON DELETE CASCADE
  )`,callback)
};

exports.down = function(db,callback) {
  db.dropTable('projects',callback)
};

exports._meta = {
  "version": 1
};
