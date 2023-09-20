const jwt = require("jsonwebtoken");
const redisClient = require("./redis");

const parsingToken = (req) => {
  const {
    cookies: { accessToken },
    headers: { authorization },
  } = req;

  if (accessToken !== "undefined" || !accessToken) return accessToken;

  const [, token] = authorization.split(" ");

  return token;
};

const sign = (userId, expiresIn) => {
  // access token 발급
  const payload = {
    id: userId,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY, {
    algorithm: "HS256", // 대칭키
    expiresIn: expiresIn || "30s",
  });

  return token;
};

const refreshTokenSign = (userId) => {
  const refreshToken = sign(userId, "5m");

  return refreshToken;
};

const verify = (token) => {
  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);

    return {
      ok: true,
      id: decoded.id.toString(),
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
};

const refresh = (token) => {
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

  const newAccessToken = sign(id);

  return {
    ok: true,
    token: newAccessToken,
  };
};

const refreshVerify = async (token, refreshToken) => {
  /*
  1. accessToken, refreshToken이 왔는지 체크한다.
2. accessToken이 만료되었는지 체크한다.
  2.1 accessToken 만료 -> refreshToken이 redis에 token과 같은지 체크한다.
    2.1.1 refreshToken 불일치 -> 로그아웃
    2.1.2 refreshToken 일치 -> refreshToken 이 유효한지 체크한다.
      2.1.1.1 refreshToken 만료 -> 로그아웃
      2.1.1.2 refreshToken 유효 -> accessToken 갱신
  2.2 accessToken 유효 -> 패스
  */

  if (!token || !refreshToken)
    return {
      ok: false,
      message: "Not Found",
    };

  const verifyAccessToken = verify(token);

  if (!verifyAccessToken.ok) {
    const verifyRefreshToken = verify(refreshToken);

    if (!verifyRefreshToken.ok) {
      return {
        ok: false,
        message: "Refresh Token Expired",
      };
    }

    const serverRefreshToken = await redisClient.v4.get(verifyRefreshToken.id);

    if (serverRefreshToken !== refreshToken) {
      return {
        ok: false,
        message: "Not Matched Refresh Token",
      };
    }

    const newAccessToken = sign(verifyRefreshToken.id);

    return {
      ok: true,
      token: newAccessToken,
    };
  }
};

module.exports = {
  sign,
  verify,
  refresh,
  refreshTokenSign,
  parsingToken,
  refreshVerify,
};
