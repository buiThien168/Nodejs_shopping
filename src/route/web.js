import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
let route =  express.Router();
let initWebRoutes = (app)=>{
    route.get('/',homeController.getHomePage);
    route.get('/about',homeController.getAboutPage);
    route.get('/crud',homeController.getCRUD);
    route.post('/post-crud',homeController.postCRUD);
    route.get('/get-crud',homeController.displayGetCRUD);//hiện thị lên view
    route.get('/edit-crud',homeController.getEditCRUD);
    route.post('/put-crud',homeController.putCRUD);
    route.get('/delete-crud',homeController.deleteCRUD);
    route.post('/api/login',userController.handleLogin);
    return app.use("/",route);
}
module.exports = initWebRoutes; 