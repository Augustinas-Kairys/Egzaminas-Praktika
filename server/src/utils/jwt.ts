import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || '61zt9hSR0FQoZcM1EN1zJFV7dRCHR61EqJbycyv9lkg2x8-XQhv6aqRbsOi93S9W';

interface TokenPayload {
  userId: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, SECRET_KEY) as TokenPayload;
};
