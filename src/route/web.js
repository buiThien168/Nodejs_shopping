import express from "express";
import homeController from "../controllers/homeController";
let route =  express.Router();
let initWebRoutes = (app)=>{
    route.get('/',homeController.getHomePage);
    route.get('/about',homeController.getAboutPage);
    route.get('/crud',homeController.getCRUD);
    route.post('/post-crud',homeController.postCRUD);
    route.get('/get-crud',homeController.displayGetCRUD);//hiện thị lên view
    return app.use("/",route);
}
module.exports = initWebRoutes; 