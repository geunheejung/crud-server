const tokenValidateMiddleware = (req, res, next) => {
  const {
    path,
    headers: { authorization },
  } = req;

  const whiteList = ["/auth/login", "/auth/signup"];

  if (whiteList.includes(path)) {
    next();
    return;
  }

  if (!authorization) {
    return res.status(401).json({ data: null, message: "권한이 없습니다." });
  }

  const [, token] = authorization.split(" ");

  const { id, ok } = jwt.verify(token);

  if (!ok) {
    return res
      .status(400)
      .json({ data: null, message: "인증이 만료 되었습니다." });
  }

  next();
};

module.exports = tokenValidateMiddleware;
