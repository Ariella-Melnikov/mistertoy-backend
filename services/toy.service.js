import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
  query,
  getById,
  remove,
  save,
}

const PAGE_SIZE = 5
const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = {}, sortBy = {}, pageIdx) {
  console.log('filterBy:', filterBy)
  console.log('sortBy:', sortBy)
  let filteredToys = toys
  if (filterBy.txt) {
    const regExp = new RegExp(filterBy.txt, 'i')
    filteredToys = filteredToys.filter((toy) => regExp.test(toy.name))
  }
  if (filterBy.inStock) {
    filteredToys = filteredToys.filter((toy) => toy.inStock === JSON.parse(filterBy.inStock))
  }
  if (filterBy.labels && filterBy.labels.length) {
    filteredToys = filteredToys.filter(
      (toy) => filterBy.labels.every((label) => toy.labels.includes(label))
      // filterBy.labels.some(label => toy.labels.includes(label))
    )
  }
  if (sortBy.type) {
    filteredToys.sort((toy1, toy2) => {
      const sortDirection = +sortBy.desc
      if (sortBy.type === 'name') {
        return toy1.name.localeCompare(toy2.name) * sortDirection
      } else if (sortBy.type === 'price' || sortBy.type === 'createdAt') {
        return (toy1[sortBy.type] - toy2[sortBy.type]) * sortDirection
      }
    })
  }
  if (pageIdx !== undefined) {
    let startIdx = pageIdx * PAGE_SIZE
    filteredToys = filteredToys.slice(startIdx, startIdx + PAGE_SIZE)
  }
  return Promise.resolve(filteredToys)
}

function getById(toyId) {
  const toy = toys.find((toy) => toy._id === toyId)
  if (!toy) return Promise.reject('Toy not found')
  return Promise.resolve(toy)
}

function remove(toyId) {
  const idx = toys.findIndex((toy) => toy._id === toyId)
  if (idx === -1) return Promise.reject('No Such toy')
  toys.splice(idx, 1)
  return _saveToysToFile()
}

function save(toy) {
  if (toy._id) {
    const idx = toys.findIndex((currToy) => currToy._id === toy._id)
    if (idx === -1) return Promise.reject('No such toy')
    toys[idx] = { ...toys[idx], ...toy }
  } else {
    toy._id = utilService.makeId()
    toy.createdAt = Date.now()
    toy.inStock = true
    toys.unshift(toy)
  }
  return _saveToysToFile().then(() => toy)
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(toys, null, 2)
    fs.writeFile('data/toy.json', data, (err) => {
      if (err) {
        loggerService.error('Cannot write to toys file', err)
        return reject(err)
      }
      resolve()
    })
  })
}
