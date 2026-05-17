const { search } = require("../../api-gateway/routes/orderRoutes");

server.addService(userProto.UserService.service, {
    CreateUser,
    GetUsers,
    GetUser,
    UpdateUser,
    DeleteUse
});