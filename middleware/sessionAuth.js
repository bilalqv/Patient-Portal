
const whiteListedPaths = [ '/patient/dashboard', '/patient/login', '/patient/logout' ];

const authorizeSession = (req, res, next) => {
  if( isUrlWhiteListed( req.url ) ){
    return next();
  }
  if(req.session.authorized) {
    next();
  } else {
    res.redirect('/patient/dashboard');
  }
}

function isUrlWhiteListed( url ){
 return whiteListedPaths.includes(url);
}

module.exports = {
  authorizeSession,
}