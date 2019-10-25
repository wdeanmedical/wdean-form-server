const Joi = require('joi')

const { logActionSchema } = require('@validation')

const routes = require('../routers/routes')

const getValidator = req => {
  const { method } = req
  const { path } = req.route
  return config[path][method]
}

const config = {
  /* ******************** UTILITY ******************** */
  [routes.TEST_API]: { GET: undefined },
  [routes.HEALTH_CHECK]: { GET: undefined },
  [routes.POST_HELPER_LOG_ACTION]: { POST: logActionSchema },
}

module.exports = { getValidator }
