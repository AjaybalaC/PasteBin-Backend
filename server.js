import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';

import healthRoutes from './routes/health.routes.js';
import pasteRoutes from './routes/paste.routes.js';
import {viewPasteHTML}  from './controllers/paste.controller.js';

dotenv.config();

const app = express();


app.use(express.json());

//DB Connection

connectDB();

//Routes
app.use('/api/healthz', healthRoutes);
app.use('/api/pastes', pasteRoutes);

// ✅ HTML route 
app.get("/p/:id", viewPasteHTML)

app.use((req,res) =>{
  res.status(404).json({error: "API endpoint not found"});
})      


const allowedOrigins = [
  "https://pastebin-frontend-gn7h.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});