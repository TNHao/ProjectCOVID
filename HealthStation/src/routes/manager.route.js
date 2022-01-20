const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer.middleware');
const managerController = require('../controllers/manager/manager.controller');

router.get('/', managerController.get);
router.get('/account-management', managerController.getAccount);
router.get('/account-management/:id', managerController.getAccountDetails);
router.get('/account-management/:id/edit', managerController.getAccountEdit);
router.post('/', managerController.addPatient);
router.post('/account-management/:id/edit', managerController.updatePatient);

router.get('/category-management', managerController.getCategory);
router.post('/category-management', managerController.createCategory);
router.put('/category-management', managerController.updateCategory);
router.delete('/category-management', managerController.deleteCategory);

router.get('/product-management', managerController.getProduct);
router.get('/product-management/create', managerController.getCreateProduct);
router.post(
  '/product-management/create',
  upload.array('images', 5),
  managerController.postCreateProduct
);
router.get('/product-management/:id', managerController.detailsProduct);
router.post(
  '/product-management/:id',
  upload.array('images', 5),
  managerController.updateProduct
);
router.delete('/product-management', managerController.deleteProduct);

router.get('/package-management', managerController.getPackage);
router.get('/package-management/create', managerController.getCreatePackage);
router.post(
  '/package-management/create',
  upload.array('images', 1),
  managerController.postCreatePackage
);
router.get('/package-management/:id', managerController.detailsPackage);
router.post(
  '/package-management/:id',
  upload.array('images', 1),
  managerController.updatePackage
);
router.delete('/package-management', managerController.deletePackage);

router.get('/payment-management', managerController.getPayment);
router.post('/payment-management', managerController.updatePayment);

module.exports = router;
