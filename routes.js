const {
  Router
} = require('express');
const SearchController = require('./src/app/controllers/searchController')
const bussinesController = require('./src/app/controllers/bussinesController');
const RejectController = require('./src/app/controllers/RejectionController');
const ApprovalController = require('./src/app/controllers/EntrevistController');
const PremiunController = require('./src/app/controllers/PremiunControllers');


const routes = Router();

routes.get('/searchusers/:name', SearchController.index);
routes.get('/searchvacancies/:title', SearchController.store);
routes.get('/searchbussines', SearchController.buss);
routes.get('/bussinesregister', bussinesController.index);
routes.post('/bussinesregister', bussinesController.store);
routes.post('/bookings/:booking_id/approvals', ApprovalController.store);
routes.post('/bookings/:booking_id/rejectins', RejectController.store);
routes.post('/premiun/:id/approvals', PremiunController.store);


module.exports = routes;
