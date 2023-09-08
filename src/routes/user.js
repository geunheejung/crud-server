const jwt = require("../jwt.js");
const connection = require("../connection.js");

const signUp = (req, res) => {
  const { email, password, username } = req.body;
  connection.query(
    `SELECT * FROM Users WHERE email = '${email}'`,
    (error, rows) => {
      if (error) {
        return res.status(400).json({
          data: null,
          message: "다시 요청 해주세요.",
        });
      }

      if (rows) {
        return res.status(400).json({
          data: null,
          message: "이미 존재하는 계정 입니다.",
        });
      }

      connection.query(
        `INSERT INTO Users (email, password, username) values ('${email}', '${password}', '${username}')`,
        (error, rows) => {
          if (error || !rows) {
            return res.status(400).json({
              data: null,
              message: "다시 요청 해주세요.",
            });
          }

          return res.status(200).json({
            data: true,
            message: "유저가 추가 되었습니다.",
          });
        }
      );
    }
  );
};

const login = (req, res) => {
  const { email, password } = req.body;

  connection.query(
    `select * from Users where email = '${email}'`,
    (error, rows) => {
      if (!rows || !rows.length) {
        return res.status(401).json({
          data: null,
          message: "사용자가 존재하지 않습니다.",
        });
      }

      console.log(user);

      connection.query(
        `select * from Users where password = '${password}'`,
        (error, rows) => {
          if (!rows || !rows.length) {
            return res.status(401).json({
              data: null,
              message: "비밀번호가 틀렸습니다.",
            });
          }

          const accessToken = jwt.sign(user); // accessToken 발급

          res.status(200).send({
            data: { accessToken },
          });
        }
      );
    }
  );
};

module.exports = {
  signUp,
  login,
};
