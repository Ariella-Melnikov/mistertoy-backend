import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { addToy, getToyById, getToys, removeToy, updateToy, initDB} from './toy.controller.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', log, getToys)
toyRoutes.get('/initDB', log, requireAuth, requireAdmin, initDB)
toyRoutes.get('/:id', log, getToyById)
toyRoutes.post('/',  log, requireAuth, requireAdmin, addToy)
toyRoutes.put('/:id', log, requireAuth, requireAdmin, updateToy)
toyRoutes.delete('/:id', log, requireAuth, requireAdmin, removeToy)

