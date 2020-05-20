const {
  Router
} = require('express');
const SearchController = require('./src/app/controllers/searchController')
const bussinesController = require('./src/app/controllers/bussinesController');
const RejectController = require('./src/app/controllers/RejectionController');
const ApprovalController = require('./src/app/controllers/EntrevistController');
const PremiunController = require('./src/app/controllers/PremiunControllers');
const LikeController = require('./src/app/controllers/likeController')
const addLikeController = require('./src/app/controllers/addLikeController')
const postbLikeController = require('./src/app/controllers/postbLikeController')
const followersController = require('./src/app/controllers/followController')
const followersbController = require('./src/app/controllers/followbController')


const routes = Router();

routes.get('/searchusers/:name', SearchController.index);
routes.get('/searchvacancies', SearchController.store);
routes.get('/searchbussines', SearchController.buss);
routes.get('/bussinesregister', bussinesController.index);
routes.post('/bussinesregister', bussinesController.store);
routes.post('/bookings/:booking_id/approvals', ApprovalController.store);
routes.post('/bookings/:booking_id/rejectins', RejectController.store);
routes.post('/premiun/:id/approvals', PremiunController.store);
routes.post('/likes/:id', LikeController.toggle)
routes.post('/likes/:id', addLikeController.toggle)
routes.post('/likes/:id', postbLikeController.toggle)
routes.post('/follow/:id', followersController.create)
routes.delete('/unfollow/:id', followersController.destroy)
routes.post('/follow/:id', followersbController.create)
routes.delete('/unfollow/:id', followersbController.destroy)


module.exports = routes;
