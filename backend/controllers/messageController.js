const Message = require('../models/Message');


const sendMessage = async(req,res) =>{
    try{
        const {username , text} = req.body;

        if(!username || !text){
            return res.status(400).json({error:'Username and text are required'});
        }

        const newMessage = new Message({username,text});
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch(error){
        console.error('Error sending message:',error.message);
        res.status(500).json({error: 'Server error while sending message'});
    }
};


const getMessages = async(req,res) => {
    try{
        const message = await Message.find().sort({timestamp:1});
        res.status(200).json(message);
    } catch(error){
        console.error('error fetching message:',error.message);
        res.status(500).json({error: 'Server error while fetching messages '});
    }
};


module.exports = {sendMessage,getMessages};