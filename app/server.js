/* eslint-disable no-process-exit */
// Get environment variables
require('../config/environments')

// get dependencies
const fs = require('fs')
const { logger } = require('@util/logger')

// get or set port and protocol
const PORT = process.env.PORT || 8080
const PROTOCOL = process.env.PROTOCOL || 'http'
