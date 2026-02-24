const { validateAddProduct } = require('./productValidator');
const httpMocks = require('node-mocks-http');

describe('validateAddProduct middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return error when title is missing', () => {
    req.body = {
      price: '29.99',
      productDesc: 'Valid description'
    };
    req.file = {
      mimetype: 'image/jpeg',
      size: 1024
    };

    validateAddProduct(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Validation failed',
      errors: ['Title is required']
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return error when price is missing', () => {
    req.body = {
      title: 'Valid Title',
      productDesc: 'Valid description'
    };
    req.file = {
      mimetype: 'image/jpeg',
      size: 1024
    };

    validateAddProduct(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Validation failed',
      errors: ['Price is required']
    });
    expect(next).not.toHaveBeenCalled();
  });


  it('should return error when price is negative', () => {
    req.body = {
      title: 'Valid Title',
      price: '-10',
      productDesc: 'Valid description'
    };
    req.file = {
      mimetype: 'image/jpeg',
      size: 1024
    };

    validateAddProduct(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Validation failed',
      errors: ['Price must be a positive number']
    });
    expect(next).not.toHaveBeenCalled();
  });


  it('should return error when productDesc is missing', () => {
    req.body = {
      title: 'Valid Title',
      price: '29.99'
    };
    req.file = {
      mimetype: 'image/jpeg',
      size: 1024
    };

    validateAddProduct(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Validation failed',
      errors: ['Product description is required']
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return error when file is missing', () => {
    req.body = {
      title: 'Valid Title',
      price: '29.99',
      productDesc: 'Valid description'
    };

    validateAddProduct(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Validation failed',
      errors: ['Product image is required']
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return error when file type is invalid', () => {
    req.body = {
      title: 'Valid Title',
      price: '29.99',
      productDesc: 'Valid description'
    };
    req.file = {
      mimetype: 'text/plain',
      size: 1024
    };

    validateAddProduct(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Validation failed',
      errors: ['Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed']
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return error when file size exceeds limit', () => {
    req.body = {
      title: 'Valid Title',
      price: '29.99',
      productDesc: 'Valid description'
    };
    req.file = {
      mimetype: 'image/jpeg',
      size: 6 * 1024 * 1024 // 6MB
    };

    validateAddProduct(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Validation failed',
      errors: ['File size must be less than 5MB']
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return error when title is too long', () => {
    req.body = {
      title: 'a'.repeat(101),
      price: '29.99',
      productDesc: 'Valid description'
    };
    req.file = {
      mimetype: 'image/jpeg',
      size: 1024
    };

    validateAddProduct(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Validation failed',
      errors: ['Title must be less than 100 characters']
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return error when productDesc is too long', () => {
    req.body = {
      title: 'Valid Title',
      price: '29.99',
      productDesc: 'a'.repeat(1001)
    };
    req.file = {
      mimetype: 'image/jpeg',
      size: 1024
    };

    validateAddProduct(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Validation failed',
      errors: ['Product description must be less than 1000 characters']
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return multiple errors when multiple validations fail', () => {
    req.body = {
      title: '',
      price: 'invalid',
      productDesc: ''
    };

    validateAddProduct(req, res, next);

    expect(res.statusCode).toBe(400);
    const response = res._getJSONData();
    expect(response.message).toBe('Validation failed');
    expect(response.errors).toContain('Title is required');
    expect(response.errors).toContain('Price must be a positive number');
    expect(response.errors).toContain('Product description is required');
    expect(response.errors).toContain('Product image is required');
    expect(next).not.toHaveBeenCalled();
  });

  it('should accept valid image file types', () => {
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    validMimeTypes.forEach(mimetype => {
      req.body = {
        title: 'Valid Title',
        price: '29.99',
        productDesc: 'Valid description'
      };
      req.file = {
        mimetype: mimetype,
        size: 1024
      };
      next.mockClear();

      validateAddProduct(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});