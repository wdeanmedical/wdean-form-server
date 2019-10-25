const db = require('@util/db')
const { selectForm } = require('@persistence/sql/selectForm')

// HELPERS
const { logAction } = require('./helper')

const routes = require('../routers/routes')

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
  [routes.TEST_API]: {
    GET: (req, res) => {
      res.json({ route: '/api/testApi' })
    },
  },
  [routes.HEALTH_CHECK]: {
    GET: (req, res) => {
      res.status(200).send()
    },
  },
  [routes.POST_HELPER_LOG_ACTION]: {
    POST: (req, res) => {
      logAction(req, res)
    },
  },
  [routes.GET_CITIZEN_ABOUT_ME]: {
    GET: async (req, res) => {
      const { userID } = req.user
      sendResponse(res, await runStatement(res, req.conn, getStatement(req, [userID])))
    },
  },
}

module.exports = { getProcessor }
