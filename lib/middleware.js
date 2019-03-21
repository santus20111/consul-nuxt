const express = require('express')

const app = express()

const { Router } = require('express')

const router = Router()
router.get('', function (req, res, next) {
    res.json({status: 'ok'})
})

app.use(router)

// Export the server middleware
module.exports = {
    path: '/health',
    handler: app
}
