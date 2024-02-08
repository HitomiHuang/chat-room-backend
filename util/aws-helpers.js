const aws = require('aws-sdk')
const crypto = require('crypto')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const s3 = new aws.S3(
  {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
  }
)

const awsHandler = {
  addImg: async (roomName, user, file) => {
    try {
      const paramsList = {
        Bucket: 'blog-poc-image-bucket',
        Delimiter: '/',
        Prefix: `${roomName}/${user}/`
      }

      // const dataList = await s3.listObjects(paramsList).promise()
      // const dataLength = dataList.Contents.length + 1
      const idCrypto = crypto.randomBytes(6).toString('hex')

      const params = {
        Bucket: 'blog-poc-image-bucket',
        Key: `${roomName}/${user}/${idCrypto}`,
        Body: file.buffer,
        ContentType: file.mimetype
      }

      const data = await new aws.S3.ManagedUpload({ service: s3, params }).promise()
      return data.Location
      
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = awsHandler
