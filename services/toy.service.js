
import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = { name: '', inStock: 'all', labels: [], sortBy: 'name' }) {
    let toysToReturn = [...toys];

    // Filter by name
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i');
        toysToReturn = toysToReturn.filter(toy => regex.test(toy.name));
    }

    // Filter by in-stock status
    if (filterBy.inStock !== 'all') {
        const inStock = filterBy.inStock === 'true';
        toysToReturn = toysToReturn.filter(toy => toy.inStock === inStock);
    }

    // Filter by labels
    if (filterBy.labels.length) {
        toysToReturn = toysToReturn.filter(toy => 
            filterBy.labels.every(label => toy.labels.includes(label))
        );
    }

    // Sort by the specified attribute
    if (filterBy.sortBy) {
        if (filterBy.sortBy === 'name') {
            toysToReturn.sort((a, b) => a.name.localeCompare(b.name));
        } else if (filterBy.sortBy === 'price') {
            toysToReturn.sort((a, b) => a.price - b.price);
        } else if (filterBy.sortBy === 'created') {
            toysToReturn.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
    }

    return Promise.resolve(toysToReturn);
}


function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such toy')
    const toy = toys[idx]
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex((currToy) => currToy._id === toy._id);
        if (idx === -1) return Promise.reject('No such toy');
        toys[idx] = { ...toys[idx], ...toy };
      } else {
        toy._id = utilService.makeId();
        toys.push(toy);
      }
      return _saveToysToFile().then(() => toy);
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
