const { models, sequelize } = require('../services/database-service')

async function createPackingList (packingList) {
    await sequelize.transaction(async (transaction) => {
        await models.packingList.create(packingList, { 
            include: [item],
            transaction
        })
        console.info(`saved packing list: ${packingList.packingListId}`)
    })
}

async function getByPackingListId (packingListId) {
    const packingList = await models.packingList.findAll({
        where: {packingListId},
        include: [models.item]
    })
    return packingList
}

module.exports = {
    createPackingList, getByPackingListId
}