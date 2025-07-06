import express from 'express'; 
 import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
 doteenv.config();
 
const app = express();
app.use("/api/auth", authRoutes);
app.get('/', (req, res) => {
    res.send("Welcome to the Chat Application API");
})
app.listen(5000, () => {
    console.log('server is running on port', 5000);

})
