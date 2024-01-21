const { Server } = require('socket.io')
const { Message, Client } = require('./models')
const { QueryTypes } = require('sequelize')
const db = require('./models/index')

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  })


  let onlineUsers = []

  io.on('connection', (socket) => {
    console.log(`user ${socket.id} is connected.`)

    socket.on('join', async (data) => {

      const { roomName, sendUser } = data
      socket.join(roomName)

      //訊息總數量
      const messageCount = await Message.count({ where: { roomName } })
      console.log(`messageCount: ${messageCount}`)


      //每頁數量
      const pageSize = 16

      //總頁數
      const totalPages = Math.ceil(messageCount / pageSize)

      //limit
      let limit = messageCount >= pageSize ? pageSize : messageCount

      if(limit === 0){
        limit = undefined
      }
      console.log(`limit: ${limit}`)

      const historyMessages = await Message.findAndCountAll(
        {
          where: { roomName },
          offset: (totalPages - 1) * pageSize,
          limit
        })

      onlineUsers.push({
        socketId: socket.id,
        name: sendUser,
      })

      const pagination = {
        totalPages,
        page: totalPages,
        pageSize: 16
      }

      const result = {
        joinedUser: sendUser,
        roomName,
        historyMessages,
        pagination
      }

      io.to(roomName).emit('person joined', result)
    })

    socket.on('message', async (data) => {
      try {
        await Message.create({
          roomName: data.roomName,
          sendUser: data.sendUser,
          message: data.message,
          sendTime: data.sendTime
        })

        io.to(data.roomName).emit('message:recieved', data)

      } catch (error) {
        console.log(error)
        // throw new Error(error)
      }
    })

    // socket.on('left publicRoom', (data) => {
    //   let leftUser = {}
    //   onlineUsers = onlineUsers.filter((user) => {
    //     if (user.socketId === socket.id) {
    //       leftUser = {
    //         ...user
    //       }
    //     }
    //     return user.userId !== data.userId
    //   })
    //   const result = { leftUser, onlineUsers }
    //   io.emit('person left', result)
    //   socket.disconnect()
    // })

    socket.on('disconnect', () => {
      let leftUser = {}
      onlineUsers = onlineUsers.filter((user) => {
        if (user.socketId === socket.id) {
          leftUser = {
            ...user
          }
        }
        return user.socketId !== socket.id
      })
      const result = { leftUser, onlineUsers }
      io.emit('person left', result)
      console.log(`user ${socket.id} left.`)
    })
  })
}


