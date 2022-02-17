const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    console.log(req.body);
    const token = req.header('auth-token');
    if(!token) return res.status(401).send({"status":401});

    try{
      const verified = jwt.verify(token, process.env.TOKEN);
      req.user = verified;
      next();
    }catch(e){
        res.status(400).send({"status":400});
    }
}