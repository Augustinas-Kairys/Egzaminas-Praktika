import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

// AUTH ROUTES
import authRoutes from './routes/userRoute';
import userRoutes from './routes/adminRoute';
import postRoutes from './routes/postRoute';
import categoryRoutes from './routes/categoriesrouter';
import likesRoute from './routes/likesRoute';

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(cors());

app.use('/uploads', express.static('uploads'));

// AUTH ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/likes', likesRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
