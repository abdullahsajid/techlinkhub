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
  db.runSql(`CREATE TABLE skillQuestions(
    sq_id INT PRIMARY KEY AUTO_INCREMENT,
    sq_question TEXT,
    sq_options JSON,
    sq_answer VARCHAR(255),
    user_id INT NOT NULL,
    skill_id INT,
    FOREIGN KEY (user_id) REFERENCES candidate.signup(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill_type(st_id) ON DELETE CASCADE
  )`,callback)
};

exports.down = function(db,callback) {
  db.runSql(`DROP TABLE skillQuestions`,callback)
};

exports._meta = {
  "version": 1
};
