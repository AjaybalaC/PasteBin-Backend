import express from 'express'
import {
  createPaste,
  getPaste
} from '../controllers/paste.controller.js'

const router = express.Router()

router.post('/', createPaste)
router.get('/:id', getPaste)

export default router
