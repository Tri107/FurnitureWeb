import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Bạn chưa đăng nhập hoặc thiếu Access Token' 
    });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Access Token đã hết hạn', 
          code: 'TOKEN_EXPIRED' 
        });
      }
      return res.status(403).json({ 
        message: 'Token không hợp lệ hoặc đã bị can thiệp' 
      });
    }
    req.user = decoded; 
    next(); 
  });
};


export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next(); 
    } else {
      return res.status(403).json({ 
        message: 'Truy cập bị từ chối. Chỉ Quản trị viên mới có quyền thực hiện hành động này.' 
      });
    }
  });
};