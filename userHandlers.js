

  const database = require("./database");

  const postUser = (req, res) => {
    const { firstname, lastname, email, city, language } = req.body;
  
    database
        .query(
            "INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
            [firstname, lastname, email, city, language]
        )
        .then(([result]) => {
            res.location(`/api/users/${result.insertId}`).sendStatus(201);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error- saving the user");
        })
  };

//   const getUsers = (req, res) => {
//     database
//       .query("select * from users")
//       .then(([users]) => {
//         res.json(users);
//       })
//       .catch((err) => {
//         console.error(err);
//         res.status(500).send("Error retrieving data from database");
//       });
//   };


/*La route renvoyant une liste d'utilisateurs les renvoie tous si aucun paramètre n'est passé via l'URL.
 Sinon, elle retourne une liste filtrée selon le paramètre de requête language ou city.
 (bonus) Si les paramètres language et city sont tous les 2 fournis, les éléments renvoyés doivent répondre aux deux conditions de filtrage.
 GET api/users renvoie un statut 200 même si la liste est vide.*/

  const getUsers = (req,res) => {
    let sql = "SELECT * FROM users";
    const sqlValues = [];

    if (req.query.language != null) {
        sql += "WHERE language = ?";
        sqlValues.push(req.query.language);
    if(req.query.city != null) {
        sql += "and city <= ?";
        sqlValues.push(req.query.city);
    }    
    } else if(req.query.city != null) {
        sql += "WHERE city <= ?";
        sqlValues.push(req.query.city);
    }

    database
        .query(sql, sqlValues)
        .then(([users]) => {
            res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
  }


  const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("select * from users where id = ?", [id])
      .then(([users]) => {
        if (users[0] != null) {
          res.json(users[0]);
        } else {
          res.status(404).send("Not Found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

  const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;
  
    database
      .query(
        "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
        [firstname, lastname, email, city, language, id]
      )
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error editing the user");
      });
  };

  const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("delete from users where id = ?", [id])
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error deleting the user");
      });
  };
    
  module.exports = {
    getUsers,
    getUserById,
    postUser, //don't forget to export your function ;)
    updateUser, //don't forget to export your function;)
    deleteUser, //don't forget to export your function;)
  };