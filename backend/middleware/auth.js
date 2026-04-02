export const checkAdminPassword = (req, res, next) => {
  const { password } = req.body;
  
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }
  
  next();
};