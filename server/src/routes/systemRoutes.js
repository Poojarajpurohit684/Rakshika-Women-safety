import { Router } from 'express'
import { getHealth } from '../controllers/systemController.js'

const router = Router()

router.get('/health', getHealth)

export default router
