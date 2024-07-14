import express from 'express'

import { addToy, getToyById, getToys, removeToy, updateToy, initDB} from './toy.controller.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', getToys)
toyRoutes.get('/initDB', initDB)
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/',  addToy)
toyRoutes.put('/:id',  updateToy)
toyRoutes.delete('/:id',  removeToy)

