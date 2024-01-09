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
      // const sql = `select a.id, a.type, a.sendUserId, b.avatar, b.name, a.message, a.sendTime from messages a left join users b on a.sendUserId = b.id where a.type = "public"`
      // const historyMessages = await db.sequelize.query(sql, { type: QueryTypes.SELECT })


      const { roomName, sendUser } = data
      socket.join(roomName)

      const historyMessages = await Message.findAll({ where: { roomName } })
      // let clients = await io.in(roomName).fetchSockets()
      // console.log('client')
      // console.log(clients)

      onlineUsers.push({
        socketId: socket.id,
        name: sendUser,
      })

      //const result = { joinedUser: data, onlineUsers, historyMessages }
      const result = { joinedUser: sendUser, roomName, historyMessages }
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


