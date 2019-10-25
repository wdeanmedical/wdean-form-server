// load dependencies
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const morgan = require('morgan')
const { logger } = require('@util/logger')

// AUTH MIDDLEWARE
const { getMySqlConnection } = require('@middleware')

// get API routers
const router = require('./routers/router')

// Start express app
const app = express()
