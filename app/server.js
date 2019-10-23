/* eslint-disable no-process-exit */
// Get environment variables
require('../config/environments')

// get dependencies
const fs = require('fs')

// get or set port and protocol
const PORT = process.env.PORT || 8080
const PROTOCOL = process.env.PROTOCOL || 'http'
