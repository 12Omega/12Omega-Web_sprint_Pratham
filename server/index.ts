import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';


dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10); // ✅ Only declare this ONCE

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});





