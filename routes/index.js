const express = require('express')
const router = express.Router()
const messageController = require('../controllers/message-controller')

router.delete('/messages/all', messageController.deleteMessages)
router.post('/messages/getNextPage', messageController.getMessages)
// // const passport = require('../config/passport')
// // const localAuthenticate = passport.authenticate('local', { session: false })
// const { authenticated, fieldExamine } = require('../middleware/auth')
// const userController = require('../controllers/user-controller')
// const storyController = require('../controllers/story-controller')
// const storyRouter = require('./modules/stories')
// const followshipRouter = require('./modules/followships')
// const clapRouter = require('./modules/claps')
// const userRouter = require('./modules/users')
// const responseRouter = require('./modules/responses')
// const { apiErrorHandler } = require('../middleware/error-handler')

// router.post('/signIn', fieldExamine, localAuthenticate, userController.signIn)
// router.post('/user/response', userController.getResponse)
// router.post('/user/followers', userController.getFollowers)
// router.post('/user/followings', userController.getFollowings)
// router.post('/user', userController.getUser)

// router.post('/story/claps', storyController.getClaps)
// router.post('/story/responses', storyController.getResponses)
// router.get('/stories', storyController.getStories)
// router.post('/story', storyController.getStory)

// router.use('/story', authenticated, storyRouter)
// router.use('/followship', authenticated, followshipRouter)
// router.use('/clap', authenticated, clapRouter)
// router.use('/response', authenticated, responseRouter)
// router.use('/user', authenticated, userRouter)

// router.use('/', apiErrorHandler)
module.exports = router
