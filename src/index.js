const Genetic = require('genetic-js')

const helpers = require('./helpers')
const seed = require('./seed')
const mutate = require('./mutate')
const crossover = require('./crossover')
const fitness = require('./fitness')

exports.minCollisions = (data, config = {}, callback, partialCallback) => {
  if (!data) data = {}
  data.helpers = helpers

  const genetic = Genetic.create()
  genetic.optimize = Genetic.Optimize.Minimize
  genetic.select1 = Genetic.Select1.Fittest
  genetic.select2 = Genetic.Select2.Tournament2
  genetic.seed = seed
  genetic.mutate = mutate
  genetic.crossover = crossover
  genetic.fitness = fitness
  genetic.generation = ([{ fitness }]) => fitness !== 0
  genetic.notification = function (pop, generation, stats, isFinished) {
    const { table } = this.userData.helpers
    const { entity, fitness } = pop[0]
    const timetable = table(...entity)
    const meta = { fitness, generation, stats, pop }
    if (isFinished && callback) return callback(timetable, meta)
    if (partialCallback) return partialCallback(timetable, meta)
  }

  const defaults = {
    iterations: 1000,
    size: 250,
    crossover: 0.3,
    mutation: 0.8,
    skip: 20
  }
  genetic.evolve(Object.assign(defaults, config), data)
}