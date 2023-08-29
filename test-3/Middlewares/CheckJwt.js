import jwt from "jsonwebtoken";

function CheckJwt(req, res, next) {
  const fullToken = req.headers.authorization;
  if (fullToken) {
    const token = fullToken.split(" ")[1];
    if (token) {
      try {
        // console.log(token, "token at middleware")
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        const expTime = decodedData?.exp;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        // console.log(expTime, currentTimestamp, "expTime at middleware");
        if (currentTimestamp > expTime) {
          return res.status(404).json({
            success: false,
            message: "Session is over, Please login again.",
          });
        }
        next();
      } catch (error) {
        // console.log(error, "after error at exp");
        return res
          .status(500)
          .json({ success: false, message: "Token is expired." });
      }
    }
    next();
  }
  next();
}

export default CheckJwt;
