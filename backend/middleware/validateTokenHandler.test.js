jest.mock('../config/firebaseAdmin', () => ({
  admin: {
    auth: () => ({
      verifyIdToken: jest.fn(),
    }),
  },
}));

const firebaseAdmin = require('../config/firebaseAdmin');
const validateToken = require('./validateTokenHandler');

describe('validateToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if no token provided', async () => {
    await validateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid/expired', async () => {
    req.headers.authorization = 'Bearer invalidtoken';
    firebaseAdmin.admin.auth().verifyIdToken.mockRejectedValue(new Error('Invalid token'));
    await validateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });
})