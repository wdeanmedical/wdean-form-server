const db = require('@util/db')
const { selectForm } = require('@persistence/sql/selectForm')

// HELPERS
const { logAction } = require('./helper')

const getProcessor = req => {
  const { method } = req
  const { path } = req.route
  return config[path][method]
}

const sendResponse = (res, result) => {
  if (result) {
    res.json({ error: null, result })
  }
}

const config = {
  ['/public/testApi']: {
    GET: (req, res) => {
      res.json({ message: 'testing' })
    },
  },
}

module.exports = { getProcessor }