import express from 'express'

import { addToy, getToyById, getToys, removeToy, updateToy} from './toy.controller.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', getToys)
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/',  addToy)
toyRoutes.put('/:id',  updateToy)
toyRoutes.delete('/:id',  removeToy)
