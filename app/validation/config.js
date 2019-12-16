const Joi = require('joi')
const { logActionSchema } = require('@validation')

const getValidator = req => {
  const { method } = req
  const { path } = req.route
  return config[path][method]
}

const config = {
  /* ******************** UTILITY ******************** */
  ['/public/testApi']: { GET: undefined },
  ['/public/getForm']: { GET: undefined },
}

module.exports = { getValidator }
