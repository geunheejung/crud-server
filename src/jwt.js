const jwt = require("jsonwebtoken");

const sign = (user) => {
  // access token 발급
  const payload = {
    id: user.userId,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_KEY, {
    algorithm: "HS256", // 대칭키
    expiresIn: "30s",
  });

  return accessToken;
};

const verify = (token) => {
  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
    return {
      ok: true,
      id: decoded.id,
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
};

module.exports = {
  sign,
  verify,
  refresh: (token) => {
    let decoded = verify(token);
    const { ok, message } = decoded;

    if (message === "invalid signature") {
      return {
        ok: false,
        message: "권한이 없습니다.",
      };
    }

    decoded = jwt.decode(token);

    const { id } = decoded;

    const newAccessToken = sign({ userId: id });

    return {
      ok: true,
      token: newAccessToken,
    };
  },
};
