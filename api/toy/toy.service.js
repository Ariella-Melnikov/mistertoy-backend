import { ObjectId } from 'mongodb'

import { utilService } from '../../services/util.service.js'
import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const toyService = {
  query,
  getById,
  remove,
  update,
  add,
}

const PAGE_SIZE = 4
const TOYS_COLLECTION = 'toys'

async function query(filterBy = { txt: '', inStock: true, labels: '' }, sortBy = {}, pageIdx = 0) {
  try {
    const criteria = {}

    if (filterBy.txt) {
      criteria.name = { $regex: new RegExp(filterBy.txt, 'i') }
    }
    if (filterBy.inStock !== undefined) {
      criteria.inStock = JSON.parse(filterBy.inStock)
    }
    if (filterBy.labels && filterBy.labels.length) {
      criteria.labels = { $all: filterBy.labels.split(',') }
    }

    const sortOptions = {}
    if (sortBy.type) {
      const sortDirection = sortBy.desc ? -1 : 1
      sortOptions[sortBy.type] = sortDirection
    }

    logger.debug('criteria', criteria)
    logger.debug('sortOptions', sortOptions)
    logger.debug('pageIdx * PAGE_SIZE', pageIdx * PAGE_SIZE)
    
    const collection = await dbService.getCollection(TOYS_COLLECTION) 
    const toys = await collection
      .find(criteria)
      .sort(sortOptions)
      .skip(pageIdx * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray()

    return toys
  } catch (err) {
    logger.error('Failed to query toys', err)
    throw err
  }
}
async function getById(toyId) {
  try {
    const collection = await dbService.getCollection(TOYS_COLLECTION)
    const toy = await collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
    toy.createdAt = toy._id.getTimestamp()
    return toy
  } catch (err) {
    logger.error(`while finding toy ${toyId}`, err)
    throw err
  }
}

async function remove(toyId) {
  try {
    const collection = await dbService.getCollection(TOYS_COLLECTION)
    const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove toy ${toyId}`, err)
    throw err
  }
}

async function add(toy) {
  try {
    const collection = await dbService.getCollection(TOYS_COLLECTION)
    await collection.insertOne(toy)
    return toy
  } catch (err) {
    logger.error('cannot insert toy', err)
    throw err
  }
}

async function update(toyId, toy) {
  try {
    const toyToSave = {
      name: toy.name,
      price: toy.price,
      labels: toy.labels,
      inStock: toy.inStock,
    }
    const collection = await dbService.getCollection(TOYS_COLLECTION)
    await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $set: toyToSave })
    return toy
  } catch (err) {
    logger.error(`cannot update toy ${toyId}`, err)
    throw err
  }
}
