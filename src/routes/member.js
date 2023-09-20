const connection = require("../connection");
const jwt = require("../jwt");

// 사용자 정보 조회
const getUser = (req, res) => {
  const accessToken = jwt.parsingToken(req);

  if (!accessToken) {
    return res.status(401).json({ data: null, message: "권한이 없습니다." });
  }

  const { id, ok } = jwt.verify(accessToken);

  if (!ok) {
    return res
      .status(401)
      .json({ data: null, message: "인증이 만료 되었습니다" });
  }

  connection.query(
    `select * from Users where userId = '${id}'`,
    (error, rows) => {
      if (error) {
        return res
          .status(400)
          .json({ data: null, message: "다시 요청 해주세요." });
      }

      if (!rows.length) {
        return res
          .status(400)
          .json({ data: null, message: "존재 하지 않는 유저 입니다." });
      }

      const [user] = rows;

      const { password, ..._user } = user;

      return res.status(200).json({ data: _user });
    }
  );
};

module.exports = {
  getUser,
};
