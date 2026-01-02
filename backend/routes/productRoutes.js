/**
 * Product Routes (Express Router)
 *
 * Demonstrates RESTful routing in Express.
 * - Uses Express Router to keep route definitions modular and maintainable.
 * - Routes map HTTP verbs and paths to controller functions.
 * - Bulk endpoints are defined before dynamic routes to avoid path conflicts.
 * - CommonJS modules are used for imports/exports (require/module.exports).
 */
const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
  bulkDeleteProducts
} = require('../controllers/productController');

const router = express.Router();

// Bulk operations (should come before individual routes to prevent ':id' from matching 'bulk')
router.post('/bulk', bulkCreateProducts);
router.delete('/bulk', bulkDeleteProducts);

// Individual product routes with chained route definitions
router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;