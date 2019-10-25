/* ******************** IMPORTS ******************** */

// DEPENDENCIES
const express = require('express')

// CONTROLLERS
const controller = require('@controllers/controller')

// ROUTES
const routes = require('../routers/routes')

// MIDDLEWARE

/* ******************** VARIABLES ******************** */

const router = express.Router()

/* ******************** ROUTES ******************** */

/* ******************** UTILITY ******************** */

router.get(routes.TEST_API, controller.main)
router.get(routes.HEALTH_CHECK, controller.main)
router.post(routes.POST_HELPER_LOG_ACTION, controller.main)

module.exports = router
