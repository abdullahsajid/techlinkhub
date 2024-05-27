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
  db.runSql(`CREATE TABLE messages(
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT DEFAULT NULL,
    content TEXT,
    chat_id INT DEFAULT NULL,
    FOREIGN KEY (chat_id) REFERENCES chats(chatId) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,callback)
};

exports.down = function(db,callback) {
  db.dropTable('messages',callback)
};

exports._meta = {
  "version": 1
};
