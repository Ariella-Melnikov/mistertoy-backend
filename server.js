import path from 'path';
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { toyService } from './services/toy.service.js';
import { loggerService } from './services/logger.service.js'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    credentials: true
}
app.use(cors(corsOptions))


// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// REST API for Cars

// Toy LIST
app.get('/api/toy', (req, res) => {
    console.log('get list')
    const filterBy = {
        txt: req.query.txt || '',
        maxPrice: +req.query.maxPrice || 0,
        inStock: req.query.inStock || 'all',
        labels: req.query.labels ? req.query.labels.split(',') : [],
        sortBy: req.query.sortBy || 'name'
    }
    toyService.query(filterBy)
        .then((toys) => {
            res.send(toys)
        })
        .catch((err) => {
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
        })
})

// Toy READ
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId)
        .then((toy) => {
            res.send(toy)
        })
        .catch((err) => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

// Toy CREATE
app.post('/api/toy', (req, res) => {
    const toy = {
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels || [],
        inStock: req.body.inStock
    }
    toyService.save(toy)
        .then((savedtoy) => {
            res.send(savedtoy)
        })
        .catch((err) => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })

})

// Toy UPDATE
app.put('/api/toy', (req, res) => {
    const toy = {
        _id: req.body._id,
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels || [],
        inStock: req.body.inStock
    }
    toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch((err) => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })

})

// Toy DELETE
app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.remove(toyId)
        .then(() => {
            loggerService.info(`toy ${toyId} removed`)
            res.send('Removed!')
        })
        .catch((err) => {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })

})


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const PORT = 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
