const { addProduct } = require('./ProductController');
const httpMocks = require('node-mocks-http');

jest.mock('../../config/firebaseAdmin', () => {
  const saveMock = jest.fn();
  const getSignedUrlMock = jest.fn();
  const fileMock = jest.fn(() => ({
    save: saveMock,
    getSignedUrl: getSignedUrlMock,
  }));
  const bucketMock = { file: fileMock };
  const addMock = jest.fn();
  const collectionMock = jest.fn(() => ({ add: addMock }));
  const dbMock = { collection: collectionMock };
  return {
    db: dbMock,
    bucket: bucketMock,
    __mocks: { saveMock, getSignedUrlMock, addMock, fileMock, collectionMock }
  };
});

const { __mocks } = require('../../config/firebaseAdmin');

describe('addProduct Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add product and return 201 on success', async () => {
    // Arrange
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        title: 'Test Product',
        price: 100,
        productDesc: 'A test product'
      },
      file: {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg'
      },
      user: { user_id: 'user123' }
    });
    const res = httpMocks.createResponse();
    __mocks.saveMock.mockResolvedValue();
    __mocks.getSignedUrlMock.mockResolvedValue(['https://signed.url']);
    __mocks.addMock.mockResolvedValue({ id: 'prod1' });

    // Act
    await addProduct(req, res);

    // Assert
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({ message: "Product Added Successfullly" });
    expect(__mocks.saveMock).toHaveBeenCalled();
    expect(__mocks.getSignedUrlMock).toHaveBeenCalled();
    expect(__mocks.addMock).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Test Product',
      price: 100,
      productDesc: 'A test product',
      imageUrl: 'https://signed.url',
      user_id: 'user123'
    }));
  });

  it('should return 400 if no file uploaded', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: { title: 'Test', price: 1, productDesc: 'desc' },
      user: { user_id: 'user123' }
    });
    const res = httpMocks.createResponse();

    await addProduct(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'No file uploaded' });
  });

  it('should return 400 if file upload fails', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: { title: 'Test', price: 1, productDesc: 'desc' },
      file: {
        originalname: 'fail.jpg',
        buffer: Buffer.from('fail'),
        mimetype: 'image/jpeg'
      },
      user: { user_id: 'user123' }
    });
    const res = httpMocks.createResponse();
    __mocks.saveMock.mockRejectedValue(new Error('Upload error'));

    await addProduct(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'Upload error' });
  });

  it('should return 400 if getSignedUrl fails', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: { title: 'Test', price: 1, productDesc: 'desc' },
      file: {
        originalname: 'fail.jpg',
        buffer: Buffer.from('fail'),
        mimetype: 'image/jpeg'
      },
      user: { user_id: 'user123' }
    });
    const res = httpMocks.createResponse();
    __mocks.saveMock.mockResolvedValue();
    __mocks.getSignedUrlMock.mockRejectedValue(new Error('Signed URL error'));

    await addProduct(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'Signed URL error' });
  });

  it('should return 400 if db add fails', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: { title: 'Test', price: 1, productDesc: 'desc' },
      file: {
        originalname: 'fail.jpg',
        buffer: Buffer.from('fail'),
        mimetype: 'image/jpeg'
      },
      user: { user_id: 'user123' }
    });
    const res = httpMocks.createResponse();
    __mocks.saveMock.mockResolvedValue();
    __mocks.getSignedUrlMock.mockResolvedValue(['https://signed.url']);
    __mocks.addMock.mockRejectedValue(new Error('Product could not be added'));

    await addProduct(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'Product could not be added' });
  });

  it('should return 400 if user is missing', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: { title: 'Test', price: 1, productDesc: 'desc' },
      file: {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg'
      }
      // user missing
    });
    const res = httpMocks.createResponse();
    __mocks.saveMock.mockResolvedValue();
    __mocks.getSignedUrlMock.mockResolvedValue(['https://signed.url']);
    __mocks.addMock.mockImplementation(() => { throw new Error('Cannot read property user_id of undefined'); });

    await addProduct(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().error).toMatch(/user_id/);
  });
});