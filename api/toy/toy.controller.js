import { toyService } from './toy.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export async function getToys(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt || '',
      inStock: req.query.inStock,
      labels: req.query.labels,
    }

    const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : {}
    const pageIdx = req.query.pageIdx ? +req.query.pageIdx : 0
    logger.debug(filterBy)
    const toys = await toyService.query(filterBy, sortBy, pageIdx)
    res.json(toys)
  } catch (err) {
    logger.error('Failed to get toys', err)
    res.status(500).send({ err: 'Failed to get toys' })
  }
}

export async function getToyById(req, res) {
  try {
    const toyId = req.params.id
    const toy = await toyService.getById(toyId)
    res.json(toy)
  } catch (err) {
    logger.error(`Failed to get toy with ID: ${req.params.id}`, err)
    res.status(500).send({ err: 'Failed to get toy by ID' })
  }
}

export async function addToy(req, res) {
  // const { loggedinUser } = req

  try {
    const toy = req.body
    // toy.owner = loggedinUser
    const addedToy = await toyService.add(toy)
    res.json(addedToy)
  } catch (err) {
    logger.error('Failed to add toy', err)
    res.status(500).send({ err: 'Failed to add toy' })
  }
}

export async function updateToy(req, res) {
  try {
    const toyId = req.params.id
    const toy = req.body
    logger.debug(toy)
    const updatedToy = await toyService.update(toyId, toy)
    res.json(updatedToy)
  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })
  }
}

export async function removeToy(req, res) {
  try {
    const toyId = req.params.id
    const deletedCount = await toyService.remove(toyId)
    res.send(`${deletedCount} toys removed`)
  } catch (err) {
    logger.error('Failed to remove toy', err)
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}

export async function initDB(req, res) {
  try {
    const toys = utilService.readJsonFile('data/toy.json')
    let toysToAdd = [...toys];
    var toysAdded = 0;

    await toysToAdd.map( toy => {
        try {
            delete toy._id
            toyService.add(toy)
            toysAdded+=1
        } catch (err) {
            logger.error('Failed to add toy', err)
        }
    })

    res.send(`${toysAdded} toys added to db`)
  } catch (err) {
    logger.error('Failed to init DB', err)
    res.status(500).send({ err: 'Failed to init DB' })
  }
}
