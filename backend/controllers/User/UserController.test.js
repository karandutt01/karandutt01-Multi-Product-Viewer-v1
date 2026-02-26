jest.mock('../../config/firebaseAdmin', () => ({
  admin: {
    auth: jest.fn()
  }
}));

const firebaseAdmin = require('../../config/firebaseAdmin');
const { registerUser, loginUser } = require('./userController');

function createMockResponse() {
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
    const res = createMockResponse();

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
    const res = createMockResponse();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
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
    const res = createMockResponse();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'User data is not valid' });
  });
});

describe('UserController.loginUser', () => {
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should login successfully and return token', async () => {
    const mockJson = jest.fn().mockResolvedValue({
      idToken: 'token-abc',
      localId: 'uid-xyz'
    });
    const mockFetch = jest.fn().mockResolvedValue({
      status: 200,
      json: mockJson
    });
    global.fetch = mockFetch;

    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    const res = createMockResponse();

    await loginUser(req, res);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      token: 'token-abc',
      uid: 'uid-xyz',
      expiresIn: 60 * 20
    });
    expect(res.status).not.toHaveBeenCalledWith(401);
  });

  test('should fail login with invalid credentials', async () => {
    const mockJson = jest.fn().mockResolvedValue({
      error: { message: 'Invalid email or password' }
    });
    const mockFetch = jest.fn().mockResolvedValue({
      status: 400,
      json: mockJson
    });
    global.fetch = mockFetch;

    const req = {
      body: {
        email: 'asd@example.com',
        password: '00000'
      }
    };
    const res = createMockResponse();

    await loginUser(req, res);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
  });

  test('should handle fetch/network errors', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    const res = createMockResponse();

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Network error' });
  });

  test('should handle missing error message in response', async () => {
    const mockJson = jest.fn().mockResolvedValue({});
    const mockFetch = jest.fn().mockResolvedValue({
      status: 400,
      json: mockJson
    });
    global.fetch = mockFetch;

    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    const res = createMockResponse();

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Login failed' });
  });
});