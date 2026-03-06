const { addProduct, productList } = require('../products/productController');
const httpMocks = require('node-mocks-http');
const { db } = require('../../config/firebaseAdmin');


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
const { MESSAGES } = require('../../constants');

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
    expect(res._getJSONData()).toEqual({ message: MESSAGES.SUCCESS.PRODUCT_ADDED });
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
    expect(res._getJSONData()).toEqual({ message: MESSAGES.VALIDATION.NO_FILE_UPLOADED });
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
    __mocks.saveMock.mockRejectedValue(new Error(MESSAGES.ERROR.UPLOAD_ERROR));

    await addProduct(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: MESSAGES.ERROR.UPLOAD_ERROR });
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


describe('ProductController - productList', () => {
  let req, res, mockCollection, mockQuery, mockSnapshot;

  beforeEach(() => {
    req = {
      user: {
        user_id: 'test-user-123'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Reset all mocks
    jest.clearAllMocks();

    // Setup Firestore mocks
    mockSnapshot = {
      docs: []
    };
    
    mockQuery = {
      get: jest.fn().mockResolvedValue(mockSnapshot)
    };
    
    mockCollection = {
      where: jest.fn().mockReturnValue(mockQuery)
    };
    
    db.collection.mockReturnValue(mockCollection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return products for authenticated user', async () => {
    // Arrange
    const mockProducts = [
      {
        id: 'product1',
        data: () => ({
          title: 'Test Product 1',
          price: 100,
          productDesc: 'Description 1',
          imageUrl: 'http://example.com/image1.jpg',
          user_id: 'test-user-123'
        })
      },
      {
        id: 'product2', 
        data: () => ({
          title: 'Test Product 2',
          price: 200,
          productDesc: 'Description 2',
          imageUrl: 'http://example.com/image2.jpg',
          user_id: 'test-user-123'
        })
      }
    ];

    mockSnapshot.docs = mockProducts;

    // Act
    await productList(req, res);

    // Assert
    expect(db.collection).toHaveBeenCalledWith('products');
    expect(mockCollection.where).toHaveBeenCalledWith('user_id', '==', 'test-user-123');
    expect(mockQuery.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      doc: [
        {
          id: 'product1',
          title: 'Test Product 1',
          price: 100,
          productDesc: 'Description 1',
          imageUrl: 'http://example.com/image1.jpg',
          user_id: 'test-user-123'
        },
        {
          id: 'product2',
          title: 'Test Product 2', 
          price: 200,
          productDesc: 'Description 2',
          imageUrl: 'http://example.com/image2.jpg',
          user_id: 'test-user-123'
        }
      ]
    });
  });

  it('should return empty array when no products found', async () => {
    // Arrange
    mockSnapshot.docs = [];

    // Act
    await productList(req, res);

    // Assert
    expect(db.collection).toHaveBeenCalledWith('products');
    expect(mockCollection.where).toHaveBeenCalledWith('user_id', '==', 'test-user-123');
    expect(mockQuery.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      doc: [],
      message: MESSAGES.SUCCESS.NO_PRODUCTS_FOUND
    });
  });

  describe('Error Handling Scenarios', () => {
    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockQuery.get.mockRejectedValue(dbError);

      // Act
      await productList(req, res);

      // Assert
      expect(db.collection).toHaveBeenCalledWith('products');
      expect(mockCollection.where).toHaveBeenCalledWith('user_id', '==', 'test-user-123');
      expect(mockQuery.get).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database connection failed'
      });
    });

    it('should handle Firestore timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('Request timeout');
      mockQuery.get.mockRejectedValue(timeoutError);

      // Act
      await productList(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        error: 'Request timeout'
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle documents without data method', async () => {
      // Arrange
      const mockProductsWithoutData = [
        {
          id: 'product1',
          data: () => ({
            title: 'Test Product',
            price: 100,
            productDesc: 'Description',
            user_id: 'test-user-123'
          })
        }
      ];

      mockSnapshot.docs = mockProductsWithoutData;

      // Act
      await productList(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        doc: [
          {
            id: 'product1',
            title: 'Test Product',
            price: 100,
            productDesc: 'Description',
            user_id: 'test-user-123'
          }
        ]
      });
    });

    it('should filter products by user_id correctly', async () => {
      // Arrange - This test verifies the where clause is called correctly
      const differentUserId = 'different-user-456';
      req.user.user_id = differentUserId;

      mockSnapshot.docs = [];

      // Act
      await productList(req, res);

      // Assert
      expect(mockCollection.where).toHaveBeenCalledWith('user_id', '==', differentUserId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        doc: [],
        message: MESSAGES.SUCCESS.NO_PRODUCTS_FOUND
      });
    });

    it('should handle missing user_id in request', async () => {
      // Arrange
      req.user = {}; // Missing user_id

      // Act
      await productList(req, res);

      // Assert
      expect(mockCollection.where).toHaveBeenCalledWith('user_id', '==', undefined);
    });

    it('should handle large number of products', async () => {
      // Arrange
      const manyProducts = Array.from({ length: 100 }, (_, index) => ({
        id: `product${index}`,
        data: () => ({
          title: `Product ${index}`,
          price: index * 10,
          productDesc: `Description ${index}`,
          user_id: 'test-user-123'
        })
      }));

      mockSnapshot.docs = manyProducts;

      // Act
      await productList(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        doc: expect.arrayContaining([
          expect.objectContaining({
            id: 'product0',
            title: 'Product 0'
          })
        ])
      });
      
      const responseCall = res.json.mock.calls[0][0];
      expect(responseCall.doc).toHaveLength(100);
    });
  });

  describe('Response Format Validation', () => {
    it('should return products with correct structure', async () => {
      // Arrange
      const mockProduct = {
        id: 'test-id',
        data: () => ({
          title: 'Test Product',
          price: 150,
          productDesc: 'Test Description',
          imageUrl: 'http://test.com/image.jpg',
          user_id: 'test-user-123'
        })
      };

      mockSnapshot.docs = [mockProduct];

      // Act
      await productList(req, res);

      // Assert
      const responseCall = res.json.mock.calls[0][0];
      expect(responseCall.doc[0]).toEqual({
        id: 'test-id',
        title: 'Test Product',
        price: 150,
        productDesc: 'Test Description',
        imageUrl: 'http://test.com/image.jpg',
        user_id: 'test-user-123'
      });
    });
  });
});