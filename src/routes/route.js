const express = require("express");
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const leadController = require('../controllers/leadController');
const voucherController = require('../controllers/voucherController');
let router=express.Router();
let initWebRoutes = (app) => {

    router.get('/',productController.renderHome);
    router.get('/voucher',voucherController.renderVoucher)

    // Api
    router.get('/api/v1/get-all-products',productController.getAllProductFromWoo);
    router.get('/api/v1/get-product-detail-by-id',productController.getProductDetail);
    router.post('/api/v1/create-new-product',productController.createNewProductFromWoo);
    router.put('/api/v1/update-product',productController.updateProduct);
    router.delete('/api/v1/delete-product',productController.deleteProduct);
    // Webhook
    router.post('/api/v1/webhook-product-create',productController.webhookProductCreate);


    router.post('/api/v1/webhook-order',orderController.webhookOrderCreate);
    
    router.post('/api/v1/larksuite',orderController.testLark);
    router.post('/api/v1/change-status-order',orderController.changeStatusOrder);

//  Leads
    router.post('/api/v1/leads-to-larksuite',leadController.handleCF7ToLarkSuite);
// Voucher
    router.get('/api/v1/get-detail-voucher-by-id',voucherController.getVoucherDetailById);
    router.post('/api/v1/create-voucher',voucherController.createVoucher);
    router.put('/api/v1/update-voucher',voucherController.updateVoucher);
    router.delete('/api/v1/delete-voucher',voucherController.deleteVoucher);
    return app.use("/",router)
}


module.exports=  initWebRoutes;