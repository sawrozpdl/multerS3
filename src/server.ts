import * as express from 'express';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
const app = express();

import apiRoute from './routes/api.route';

dotenv.config();

app.use(cors());
app.use('/api', apiRoute);


app.listen(process.env.PORT, () => {console.log(`Server started at ${process.env.PORT}`)});

export default app;