const routes = require('../../routers/routes')

const interpolate = (template, args, updateList) => {
  return template(args, updateList)
}

const getStatement = (req, args, updateList) => {
  const cleanArgs = args.map(arg => req.conn.escape(arg)) // escape all arguments to prevent injection
  const { method } = req
  const { path } = req.route
  const statement = interpolate(config[path][method], cleanArgs, updateList)
  return statement
}

const selectCompany = args => {
  return `
    SELECT 
    name, nickname, aboutUs, category, EIN, website, founded, size, corpGroup,
    addressOne, addressTwo, city, state, zipCode, hqAddressOne, hqAddressTwo, 
    hqCity, hqState, hqZipCode, companyID, memberSince,
    facebookUrl, linkedinUrl, twitterUrl, instagramUrl
    FROM company
    WHERE companyID = ${args[0]}
  `
}

const updateCompany = (args, updateList) => {
  return `
    UPDATE company
    SET 
      updatedAt = ROUND(UNIX_TIMESTAMP(UTC_TIME(4)) * 1000),
      ${updateList}
    WHERE companyID = ${args[0]}
  `
}

const selectUser = args => {
  return `
    SELECT 
    aboutMe, currentCity, currentState, userID, username, firstName, lastName, citizenType,
    memberSince,addressOne, addressTwo, phone, city, state, zipCode,
    facebookUrl, linkedinUrl, twitterUrl, instagramUrl
    FROM user
    WHERE userID = ${args[0]}
  `
}

const updateUser = (args, updateList) => {
  return `
    UPDATE user
    SET 
      updatedAt = ROUND(UNIX_TIMESTAMP(UTC_TIME(4)) * 1000),
      ${updateList}
    WHERE userID = ${args[0]}
  `
}

const selectCitizenAboutMe = args => {
  return ` SELECT aboutMe FROM user WHERE userID = ${args[0]}`
}

const deleteMember = args => {
  return `
    UPDATE company_user
    SET 
      deletedAt = ROUND(UNIX_TIMESTAMP(UTC_TIME(4)) * 1000),
      deleted = 1
    WHERE memberID = ${args[0]}
  `
}

const config = {
  [routes.GET_COMPANY_ABOUT]: { GET: selectCompany },
  [routes.PUT_COMPANY_ABOUT]: { PUT: updateCompany },
  [routes.COMPANY_BASIC_INFO]: { GET: selectCompany, PUT: updateCompany },
  [routes.GET_COMPANY_LOCATIONS]: { GET: selectCompany },
  [routes.PUT_COMPANY_LOCATIONS]: { PUT: updateCompany },
  [routes.COMPANY_MEMBER]: { GET: selectCompany, PUT: updateCompany, DELETE: deleteMember },
  [routes.COMPANY_OVERVIEW]: { GET: selectCompany, PUT: updateCompany },
  [routes.COMPANY_PROFILE]: { GET: selectCompany },
  [routes.GET_CITIZEN_ABOUT_ME]: { GET: selectUser },
  [routes.GET_CITIZEN_ABOUT_ME_PUBLIC]: { GET: selectCitizenAboutMe },
  [routes.PUT_CITIZEN_ABOUT_ME]: { PUT: updateUser },
  [routes.GET_CITIZEN_ADDRESS]: { GET: selectUser },
  [routes.PUT_CITIZEN_ADDRESS]: { PUT: updateUser },
  [routes.GET_CITIZEN_BASIC_INFO]: { GET: selectUser },
  [routes.PUT_CITIZEN_BASIC_INFO]: { PUT: updateUser },
}

module.exports = { getStatement }
