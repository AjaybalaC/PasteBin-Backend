import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/', (req, res) => {
  const dbOk = mongoose.connection.readyState === 1
  res.status(200).json({ ok: dbOk })
})

export default router