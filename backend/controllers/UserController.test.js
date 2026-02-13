jest.mock('../config/firebaseAdmin', () => ({
  admin: {
    auth: jest.fn()
  }
}));

const firebaseAdmin = require('../config/firebaseAdmin');
const { registerUser } = require('./UserController');

function createMockRes() {
  const res = {};
  res.statusCode = 200;
  res.status = jest.fn().mockImplementation(function (code) {
    this.statusCode = code;
    return this;
  });
  res.json = jest.fn().mockImplementation(function (payload) {
    this.body = payload;
    return this;
  });
  return res;
}

describe('UserController.registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should register user and return uid', async () => {
    const mockCreateUser = jest.fn().mockResolvedValue({
      uid: 'uid-123',
      email: 'kumarkaran@gmail.com'
    });
    firebaseAdmin.admin.auth.mockReturnValue({ createUser: mockCreateUser });

    const req = {
      body: {
        firstname: 'kumar',
        lastname: 'karan',
        email: 'kumarkaran@gmail.com',
        password: '123456'
      }
    };
    const res = createMockRes();

    await registerUser(req, res);

    expect(firebaseAdmin.admin.auth).toHaveBeenCalledTimes(1);
    expect(mockCreateUser).toHaveBeenCalledWith({
      email: 'kumarkaran@gmail.com',
      password: '123456',
      displayName: 'kumar karan'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User Registered Successfully',
      uid: 'uid-123',
      email: 'kumarkaran@gmail.com'
    });
  });

  test('should fail registration when firebase errors', async () => {
    const mockCreateUser = jest.fn().mockRejectedValue(new Error('EMAIL EXISTS'));
    firebaseAdmin.admin.auth.mockReturnValue({ createUser: mockCreateUser });

    const req = {
      body: {
        firstname: 'kumar',
        lastname: 'karan',
        email: 'kumarkaran@gmail.com',
        password: '123456'
      }
    };
    const res = createMockRes();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'EMAIL EXISTS' });
  });

  test('should fail registration when user is falsy', async () => {
    const mockCreateUser = jest.fn().mockResolvedValue(null);
    firebaseAdmin.admin.auth.mockReturnValue({ createUser: mockCreateUser });

    const req = {
      body: {
        firstname: '',
        lastname: '',
        email: '',
        password: '123456'
      }
    };
    const res = createMockRes();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User data is not valid' });
  });
});

