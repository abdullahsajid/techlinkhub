const CandidateRepository = require('./candidate-repo')

class chat{

    constructor(){
        this.CandidateRepository = new CandidateRepository()
    }

    async createChat({chatname,sender_id,your_id,latestMessage}){
        const exists = await this.CandidateRepository.db.query(
            `SELECT *,
            (
                SELECT JSON_OBJECT(
                           'id', senPro.id,
                           'avatar', senPro.avatar_url,
                           'name', senPro.name
                        )
                    FROM profile senPro
                    WHERE c.sender_id = senPro.user_id
            ) AS profile
            FROM chats c 
            WHERE sender_id = ? AND your_id = ?`,
            [sender_id,your_id]
        )
        
        if(exists[0].length > 0){
            let userDetails = {exist:exists[0],message:'already exists'}
            return userDetails
        }

        await this.CandidateRepository.db.query(
            `INSERT INTO chats (chatname,sender_id,your_id,latestMessage) VALUES(?,?,?,?)`,
            [chatname,sender_id,your_id,latestMessage]
        )
        const newChat = await this.CandidateRepository.db.query(
            `SELECT *,
            (
                SELECT JSON_OBJECT(
                           'id', senPro.id,
                           'avatar', senPro.avatar_url,
                           'name', senPro.name
                        )
                    FROM profile senPro
                    WHERE c.sender_id = senPro.user_id
            ) AS profile
            FROM chats c
            WHERE sender_id = ? AND your_id = ?`,
            [sender_id, your_id]
        );
        return newChat[0]
    }

    async createMessage({sender_id,content,chat_id}){
        const message = await this.CandidateRepository.db.query(
            `INSERT INTO messages (sender_id,content,chat_id) VALUES(?,?,?)`,
            [sender_id,content,chat_id]
        )
        let data = message[0]
        if(data?.affectedRows  === 1){
            const test = await this.CandidateRepository.db.query(
                `UPDATE chats SET latestMessage = ? WHERE chatId = ? `,[data.insertId,chat_id]
            )
        }

        const retrievedata = await this.CandidateRepository.db.query(`
            SELECT *,
                (SELECT JSON_OBJECT(
                    'id',p.id,
                    'avatar',p.avatar_url,
                    'name',p.name,
                    'createAt',p.createdAt
                    )
                    FROM profile p
                    WHERE messages.sender_id = p.user_id 
                ) AS profileinfo,
                (SELECT JSON_OBJECT(
                    'chatId',c.chatId,
                    'sender_id',c.sender_id,
                    'your_id',c.your_id
                    )
                    FROM chats c
                    WHERE messages.chat_id = c.chatId 
                ) AS chatinfo
            FROM messages 
            WHERE message_id = ?
        `,[data.insertId])

        return retrievedata
    }

    async fetchChatsUser({ id }) {
        let chatUser = await this.CandidateRepository.db.query(`
            SELECT c.*,
                (SELECT JSON_OBJECT(
                            'id', p1.id,
                            'avatar', p1.avatar_url,
                            'name', p1.name
                        )
                    FROM profile p1
                    WHERE c.sender_id = p1.user_id
                ) AS sender,
                (SELECT JSON_OBJECT(
                            'id', p2.id,
                            'avatar', p2.avatar_url,
                            'name', p2.name
                        )
                    FROM profile p2
                    WHERE c.your_id = p2.user_id
                ) AS user,
                (SELECT JSON_OBJECT(
                    'mess_id', m.message_id,
                    'senderProfile', (
                        SELECT JSON_OBJECT(
                                   'id', senPro.id,
                                   'avatar', senPro.avatar_url,
                                   'name', senPro.name
                                )
                            FROM profile senPro
                            WHERE m.sender_id = senPro.user_id
                    ),
                    'content', m.content
                )
                FROM messages m
                WHERE c.latestMessage = m.message_id
                ) AS latestMessage
            FROM chats c
            WHERE c.your_id = ?
        `, [id]);
    // console.log(chatUser);
        if (chatUser[0].length === 0) {
            chatUser = await this.CandidateRepository.db.query(`
                SELECT c.*,
                    (SELECT JSON_OBJECT(
                                'id', p1.id,
                                'avatar', p1.avatar_url,
                                'name', p1.name
                            )
                        FROM profile p1
                        WHERE c.your_id = p1.user_id
                    ) AS sender,
                    (SELECT JSON_OBJECT(
                                'id', p2.id,
                                'avatar', p2.avatar_url,
                                'name', p2.name
                            )
                        FROM profile p2
                        WHERE c.sender_id = p2.user_id
                    ) AS user,
                    (SELECT JSON_OBJECT(
                        'mess_id', m.message_id,
                        'senderProfile', (
                            SELECT JSON_OBJECT(
                                    'id', senPro.id,
                                    'avatar', senPro.avatar_url,
                                    'name', senPro.name
                                    )
                            FROM profile senPro
                            WHERE m.sender_id = senPro.user_id
                        ),
                        'content', m.content
                    )
                    FROM messages m
                    WHERE c.latestMessage = m.message_id
                    ) AS latestMessage
                FROM chats c
                WHERE c.sender_id = ?
            `, [id]);
        }
    
        return chatUser[0];
    }
    

    async fetchAllMessage({id}){
        const message = await this.CandidateRepository.db.query(
            `SELECT mes.message_id,mes.sender_id,mes.content,mes.createdAt,
            (SELECT JSON_OBJECT(
                        'id',c.chatId,
                        'chatname',c.chatname,
                        'senderId',c.sender_id,
                        'yourid',c.your_id,
                        'latestMessage',c.latestMessage,
                        'createAt',c.createdAt
                    )
                FROM chats c
                WHERE mes.chat_id = c.chatId 
            ) AS chatinfo,
            (SELECT JSON_OBJECT(
                    'id',p.id,
                    'avatar',p.avatar_url,
                    'name',p.name,
                    'createAt',p.createdAt
                    )
                FROM profile p
                WHERE mes.sender_id = p.user_id 
            ) AS profileinfo
            FROM messages mes
            WHERE mes.chat_id = ?
            `,[id]
        )
        return message[0]
    }

}

module.exports = chat

// JOIN profile p1 ON c.your_id = p1.user_id
//                 JOIN profile p2 ON c.sender_id = p2.user_id
//                 JOIN messages m ON c.latestMessage = m.message_id
//                 JOIN profile senPro ON m.sender_id = senPro.user_id
// GROUP BY c.sender_id