const database = require("./database");

const getUsers = (req, res) => {
    database
    .query("select * from users")
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data");
    });
  };
  
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
  const postUser = (req, res) => {
    const {firstname, lastname, email, city, language, hashedPassword} = req.body;
  
    database
      .query(
        "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES ( ?, ?, ?, ?, ?, ?)",
        [firstname, lastname, email, city, language, hashedPassword]
      )
      .then(([result]) => {
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving the users");
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
        res.sendStatus(204).send("User modifié avec succès");
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
        console.log(result)
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.send("User supprimé avec succès").sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.send("Error deleting the user").status(500);
      });
  };
  const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
    const { email } = req.body;
    database
      .query("select * from users where email = ?", [email])
      .then(([users]) => {
        if (users[0] != null) {
          req.user = users[0];
          next();
        } else {
          res.sendStatus(401);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

  module.exports = {

    getUserById,
    getUsers,
    postUser,
    updateUser,
    deleteUser,
    getUserByEmailWithPasswordAndPassToNext
  }