const jwt = require("jsonwebtoken");

module.exports = {
  sign: (user) => {
    // access token 발급
    console.log(user);
    const payload = {
      id: user.userId,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_KEY, {
      algorithm: "HS256", // 대칭키
      expiresIn: "5m",
    });

    return accessToken;
  },
  verify: (token) => {
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
  },
};
