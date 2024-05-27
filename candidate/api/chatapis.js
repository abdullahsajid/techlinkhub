const chatService = require('../services/chat-service')
const auth = require('./middleware/auth')

module.exports = (app) => {
    const ChatService = new chatService()

    app.post('/createChats',auth,async (req,res) => {
        try{
            const data = await ChatService.chat({
                chatname:req.body.chatname,
                sender_id:req.body.sender_id,
                your_id:req.user.id,
                latestMessage:req.body.latestMessage
            })
            res.status(201).json({data,success:true})
        }catch(err){
            res.status(500).json({message:err.message,success:false})
        }
    })

    app.post('/createMessages',auth,async (req,res) => {
        try{
            const data = await ChatService.message({
                sender_id:req.body.sender_id,
                content:req.body.content,
                chat_id:req.body.chat_id
            })
            res.status(201).json({data,success:true})
        }catch(err){
            res.status(500).json({message:err.message,success:false})
        }
    })

    app.get('/retrieveChats',auth,async (req,res) => {
        try{
            const data = await ChatService.userChats({id:req.user.id})
            res.status(201).json({data,success:true})
        }catch(err){
            res.status(500).json({message:err.message,success:false})
        }
    })

    app.get('/fetchAllMessages/:id',auth,async (req,res) => {
        try{
            const data = await ChatService.summonAllMessage({id:req.params.id})
            res.status(201).json({data,success:true})
        }catch(err){
            res.status(500).json({message:err.message,success:false})
        }
    })
    
}
