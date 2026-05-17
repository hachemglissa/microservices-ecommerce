const { search } = require("../../api-gateway/routes/productRoutes");

server.addService(productProto.ProductService.service, {
    GetProducts,
    GetProduct, 
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    SearchProduct

});