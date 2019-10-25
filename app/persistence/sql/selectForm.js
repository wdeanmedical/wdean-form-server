const { AppError } = require('@errors')
const { DB_ERROR } = require('@errors/errorMessages')

module.exports.selectForm = async (conn, userID) => {
  const query = `
    SELECT 
    aboutMe, currentCity, currentState, userID, username, firstName, lastName, citizenType,
    memberSince,addressOne, addressTwo, phone, city, state, zipCode,
    facebookUrl, linkedinUrl, twitterUrl, instagramUrl
    FROM user
    WHERE userID = ${conn.escape(userID)}
  `

  let userDetails = {}

  try {
    userDetails = await conn.query(query)
    userDetails = userDetails[0]
  } catch (error) {
    throw new AppError(`${DB_ERROR}: ${error}`)
  }

  return userDetails
}
