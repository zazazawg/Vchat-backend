import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies?.token; // safer with optional chaining
    if (!token) {
      return res.status(401).json({ message: "Unauthorized tokn vnai" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.id = decoded.userId;
    if (!req.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;
