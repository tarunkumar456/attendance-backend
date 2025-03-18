const sendToken = (user, statusCode, res) => {
    const token = user.getJWTtoken(); // ✅ Fix: Ensure method exists
  
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
  };
  
  module.exports = sendToken;
  