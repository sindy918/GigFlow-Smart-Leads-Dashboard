import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const authorize = (...roles: ('Admin' | 'Sales User')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource`,
      });
      return;
    }

    next();
  };
};
