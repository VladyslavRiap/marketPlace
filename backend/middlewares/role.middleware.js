module.exports = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    console.log(req);
    return res
      .status(403)
      .json({ error: `Access denied. Required roles: ${roles.join(", ")}` });
  }
  next();
};
