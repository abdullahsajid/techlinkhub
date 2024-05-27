const chatRepo = require('../database/repository/chat-repo')

class chatService{
    constructor(){
        this.chatRepo = new chatRepo()
    }

    async chat({chatname,sender_id,your_id,latestMessage}){
        const chat = await this.chatRepo.createChat({chatname,sender_id,your_id,latestMessage})
        return chat
    }

    async message({sender_id,content,chat_id}){
        const message = await this.chatRepo.createMessage({sender_id,content,chat_id})
        return message
    }

    async userChats({id}){
        const data = await this.chatRepo.fetchChatsUser({id})
        return data
    }

    async summonAllMessage({id}){
        const data = await this.chatRepo.fetchAllMessage({id})
        return data
    }

}

module.exports = chatService

