const jwtHelper = require("../helper/jwt.helper");
const db=require("dotenv").config();

let tokenList = {};
// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-milestone-0102-Sin-hello-world!!!";
// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-milestone-0102-Sin-hello-world!!!";

const login = async (req, res) => {
  try {
    const userFakeData = {
      _id: "1234-5678-910JQK-sinjun",
      name: "Sin Jun",
      cmnd: req.body.cmnd,
    };

    const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
    
    const refreshToken = await jwtHelper.generateToken(userFakeData, refreshTokenSecret, refreshTokenLife);
    // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
    // lưu ý trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
    tokenList[refreshToken] = {accessToken, refreshToken};

    res.status(200);
    return res.send({accessToken, refreshToken});
  } catch (error) {
    res.status(500);
    return res.send(error);
  }
}

const refreshToken = async (req, res) => {
  // User gửi mã refresh token kèm theo trong body
  const refreshTokenFromClient = req.body.refreshToken;
  // debug("tokenList: ", tokenList);
  
  // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
  if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
    try {
      // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
      const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
      // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
      // có thể mở comment dòng debug bên dưới để xem là rõ nhé.
      // debug("decoded: ", decoded);
      const userFakeData = decoded.data;
      
      const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
      // gửi token mới về cho người dùng
      return res.status(200).json({accessToken});
    } catch (error) {
      // Lưu ý trong dự án thực tế hãy bỏ dòng debug bên dưới, mình để đây để debug lỗi cho các bạn xem thôi
      debug(error);
      res.status(403).json({
        message: 'Invalid refresh token.',
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
};
module.exports = {
  login: login,
  refreshToken: refreshToken,
}