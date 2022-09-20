const argon2 = require("argon2");
/*Configuration pour Argon2 :
config mini de 15 Mio de mémoire
nbre itérations 2
degré de parallélisme 1
*/
const jwt = require("jsonwebtoken"); // don't forget to import

const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  };
  /* On récupère le mot de passe à hacher à partir de
req.body.password
Et le mot de passe HACHE est stocké dans
req.body.hashedPassword
*/

const hashPassword = (req, res, next) => {
  // hash the password using argon2 then call next()
  argon2
  .hash(req.body.password, hashingOptions)
  .then((hashedPassword) => {
    console.log(hashedPassword);

    req.body.hashedPassword = hashedPassword;
    delete req.body.password;

    next();
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
};

const verifyPassword = (req, res) => {
    argon2
      .verify(req.user.hashedPassword, req.body.password)
      .then((isVerified) => {
        if (isVerified) {
          const payload = { sub: req.user.id };
  
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
  
          delete req.user.hashedPassword;
          res.send({ token, user: req.user });
        } else {
          res.sendStatus(401);
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  const verifyToken = (req, res, next) => {
    try {
        const authorizationHeader = req.get("Authorization");
    
        if (authorizationHeader == null) {
          throw new Error("Authorization header is missing");
        }
    
        const [type, token] = authorizationHeader.split(" ");
    
        if (type !== "Bearer") {
          throw new Error("Authorization header has not the 'Bearer' type");
        }
    
        req.payload = jwt.verify(token, process.env.JWT_SECRET);
    
        next();
      } catch (err) {
        console.error(err);
        res.sendStatus(401);
      }
    };

module.exports = {
  hashPassword,
  verifyPassword, // don't forget to export express 08 //;
  verifyToken, // express 08 //

};