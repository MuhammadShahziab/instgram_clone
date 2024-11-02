import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "User Not Authenticated",
    });
  }
  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    req.userId = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
export default isAuthenticated;
