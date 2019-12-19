import uploadRoute from './upload.route';
import * as express from 'express';
const apiRoute = express.Router();

apiRoute.use('/upload', uploadRoute)


export default apiRoute;