const { Message, Client } = require('../models')

const messageController = {
  deleteMessages: async(req, res, next) => {
    try{
      await Message.truncate()
      return res.status(200).json({
        status: 'success',
        data: {}
      })
    }catch(error){
      next(error)
    }
  }
}

module.exports = messageController