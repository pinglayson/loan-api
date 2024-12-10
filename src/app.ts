import express from 'express';
import loanRoutes from './routes/loanRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use('/api', loanRoutes);
app.use(errorHandler);

export default app;