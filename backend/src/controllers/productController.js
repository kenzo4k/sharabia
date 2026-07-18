import Product from '../models/Product.js';

// Simple slugify helper that supports Arabic characters
const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\u0621-\u064A\u0621-\u064A0-9-]+/g, '') // Keep alphanumeric and Arabic chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

/**
 * @desc    Get all products with filters, sorting, search & pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, sort, search, page = 1, limit = 12 } = req.query;

    const query = {};

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Search query (case-insensitive regex match on name or description)
    if (search) {
      const searchRegex = String(search).trim();
      query.$or = [
        { name: { $regex: searchRegex, $options: 'i' } },
        { description: { $regex: searchRegex, $options: 'i' } }
      ];
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skipNum = (pageNum - 1) * limitNum;

    // Fetch total matching documents for count metadata
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);

    // Build Mongoose Query
    let productQuery = Product.find(query);

    // Sorting
    if (sort === 'price_asc') {
      productQuery = productQuery.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      productQuery = productQuery.sort({ price: -1 });
    } else {
      // Default to newest
      productQuery = productQuery.sort({ createdAt: -1 });
    }

    // Apply pagination
    productQuery = productQuery.skip(skipNum).limit(limitNum);

    const products = await productQuery;

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: pageNum,
        limit: limitNum
      },
      products
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single product by Slug
 * @route   GET /api/products/slug/:slug
 * @access  Public
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private (Admin Only)
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, images, sizes, colors, stock, isFeatured } = req.body;

    if (!name || !price || !category) {
      res.status(400);
      throw new Error('Please fill in required fields: Name, Price, Category');
    }

    // Validate category is one of the permitted ones
    if (!['بلدي', 'اطقم', 'رفايع'].includes(category)) {
      res.status(400);
      throw new Error("Category must be one of: 'بلدي', 'اطقم', 'رفايع'");
    }

    const slug = slugify(name);

    // Verify slug uniqueness (or append random hash if collision occurs)
    let slugExists;
    if (global.isMockDB) {
      slugExists = false; // Simple bypass for mock mode to prevent crash
    } else {
      slugExists = await Product.findOne({ slug });
    }
    
    const uniqueSlug = slugExists ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const product = await Product.create({
      name,
      slug: uniqueSlug,
      description: description || '',
      price: Number(price),
      category,
      images: images || [],
      sizes: sizes || ['عادي'],
      colors: colors || [],
      stock: stock !== undefined ? Number(stock) : 10,
      isFeatured: !!isFeatured
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private (Admin Only)
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, images, sizes, colors, stock, isFeatured } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Validate category if updating it
    if (category && !['بلدي', 'اطقم', 'رفايع'].includes(category)) {
      res.status(400);
      throw new Error("Category must be one of: 'بلدي', 'اطقم', 'رفايع'");
    }

    const updates = {};
    if (name !== undefined) {
      updates.name = name;
      updates.slug = slugify(name);
    }
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = Number(price);
    if (category !== undefined) updates.category = category;
    if (images !== undefined) updates.images = images;
    if (sizes !== undefined) updates.sizes = sizes;
    if (colors !== undefined) updates.colors = colors;
    if (stock !== undefined) updates.stock = Number(stock);
    if (isFeatured !== undefined) updates.isFeatured = !!isFeatured;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin Only)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
