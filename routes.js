const {
  Router
} = require('express');
const Profile = require('./src/app/models/profile')
const ProfileBuss = require('./src/app/models/profilebussines')
const Clarifai = require('clarifai');
const SearchController = require('./src/app/controllers/searchController')
const bussinesController = require('./src/app/controllers/bussinesController');
const multer = require("multer");
const multerConfig = require("./src/config/multer");
const RejectController = require('./src/app/controllers/RejectionController');
const ApprovalController = require('./src/app/controllers/EntrevistController');
const PremiunController = require('./src/app/controllers/PremiunControllers');


const routes = Router();

routes.get('/searchusers', SearchController.index);
routes.get('/searchvacancies', SearchController.store);
routes.get('/searchbussines', SearchController.buss);
routes.get('/bussinesregister', bussinesController.index);
routes.post('/bussinesregister', bussinesController.store);
routes.post('/bookings/:booking_id/approvals', ApprovalController.store);
routes.post('/bookings/:booking_id/rejectins', RejectController.store);
routes.post('/premiun/:id/approvals', PremiunController.store);


routes.get("/public", async (req, res) => {
  const app = new Clarifai.App({
    apiKey: '40b33af4fba54329a48bb23e75463ef7'
  });
  app.models.predict("c0c0ac362b03416da06ab3fa36fb58e3", "https://osegredo.com.br/wp-content/uploads/2018/02/as-pessoas-de-cora%C3%A7%C3%B5es-de-ouro-830x450.jpg").then(
    function (response) {
      return res.send(response)
    },
    function (err) {
      console.log(err)
    }
  )

})

routes.get("/detection", async (req, res) => {
  const app = new Clarifai.App({
    apiKey: '40b33af4fba54329a48bb23e75463ef7'
  });
  await app.models.predict("d16f390eb32cad478c7ae150069bd2c6", `${Image}`).then(
    function (response) {
      return res.send(response)
    },
    function (err) {
      console.log(err)
    }
  )
})


module.exports = routes;
