const { models, sequelize } = require('../app/services/database-service')

async function truncate () {
  await models.packingList.destroy({ truncate: true })
}

async function createPackingListRecords (schedules) {
  await models.packingList.bulkCreate(schedules)
}

async function close () {
  await sequelize.close()
}

module.exports = {
  close,
  createPackingListRecords,
  truncate
}
