const moment = require("moment");
const jwt = require("../jwt.js");
const connection = require("../connection.js");

const signUp = (req, res) => {
  const { email, password, name, agree } = req.body;
  connection.query(
    `SELECT * FROM Users WHERE email = '${email}'`,
    (error, rows) => {
      if (error) {
        return res.status(400).json({
          data: null,
          message: "다시 요청 해주세요.",
        });
      }

      if (rows.length) {
        return res.status(400).json({
          data: null,
          message: "이미 존재하는 계정 입니다.",
        });
      }

      const format = "YYYY-MM-DD hh:mm:ss";
      const createdDate = moment().format(format);
      const modifiedDate = createdDate;

      connection.query(
        `INSERT INTO Users (email, password, name, role, createdDate, modifiedDate) values ('${email}', '${password}', '${name}', 'user', '${createdDate}', '${modifiedDate}')`,
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

      connection.query(
        `select * from Users where password = '${password}' and email = '${email}'`,
        (error, rows) => {
          if (!rows || !rows.length) {
            return res.status(401).json({
              data: null,
              message: "비밀번호가 틀렸습니다.",
            });
          }

          const [user] = rows;

          const accessToken = jwt.sign(user); // accessToken 발급

          res.status(200).send({
            data: { accessToken },
          });
        }
      );
    }
  );
};

const refresh = (req, res) => {
  // accessToken이 복호화가 되는지 체크한다.
  // 새 accessToken을 발급해준다
  const { cookies } = req;

  if (!cookies || !cookies.accessToken)
    return res.status(400).json({ message: "토큰이 없습니다." });

  const { accessToken } = cookies;

  const { ok, message, token } = jwt.refresh(accessToken);

  if (!ok) {
    return res.status(401).json({ message });
  }

  return res.status(200).json({ data: { accessToken: token } });
};

module.exports = {
  signUp,
  login,
  refresh,
};
