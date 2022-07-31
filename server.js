import express from 'express';

import { connectDB } from './config/db.js';
import { auth, users, posts, profile } from './routes/api/index.js';

const app = express();

// Connecting to data base
connectDB();

// Parsing req.body
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API running'));

// Define routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// If local run on 5000, in heroku there will be process.env.PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
