const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.auth;
  if(token){
    try{
      jwt.verify(token, process.env.SECRET);
      next();
      
    }catch(error){res.sendStatus(401).json({status: "failed", message: "Unathorized"});}
  } else {
      res.sendStatus(401).json({status: "failed", message: "Unathorized"});
  }

};