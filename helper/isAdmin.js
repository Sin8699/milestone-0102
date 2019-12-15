const jwtHelper = require("./jwt.helper");
const db=require("dotenv").config();
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-milestone-0102-Sin-hello-world!!!";

const isAdmin = async (req, res, next) => {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  console.log("check");
  if (tokenFromClient) {
    // Nếu tồn tại token
    try {
      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      console.log('decoded: ', decoded);
      // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
      req.jwtDecoded = decoded;
      // Cho phép req đi tiếp sang controller.
      next();
    } catch (error) {
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
      // Lưu ý trong dự án thực tế hãy bỏ dòng debug bên dưới, mình để đây để debug lỗi cho các bạn xem thôi
      res.status(401);
      return res.send({
        message: 'Unauthorized.',
      });
    }
  } else {
    // Không tìm thấy token trong request
    res.status(403);
    return res.send({
      message: 'No token provided.',
    });
  }
}
module.exports = {
  isAdmin,
};