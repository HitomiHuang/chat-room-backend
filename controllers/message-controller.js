const { Message, Client } = require('../models')
const awsHandler = require('../util/aws-helpers')
const pageSize = 16

const messageController = {
  getMessages: async(req, res, next) => {
    try{
      const { roomName, page } = req.body

      const nextPageMessages = await Message.findAll(
        {
          where: { roomName },
          offset: (page - 1) * pageSize,
          limit: 16,
        })

          return res.status(200).json({
            tatus: 'success',
            data: {
              nextPageMessages
            }
          })
    }catch(error){
      next(error)
    }
  },
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
  },
  uploadImg: async (req, res, next) => {
    try { 
      const user = req.body.userName?.trim()
      const roomName = req.body?.roomName?.trim()

      const filePath = await awsHandler.addImg(roomName, user, req.file)

      return res.status(200).json({
        status: 'success',
        data: filePath
      })

    } catch (err) {
      next(err)
    }
  },
}

module.exports = messageController