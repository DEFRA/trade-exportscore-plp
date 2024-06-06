const { models, sequelize } = require('../services/database-service')

async function createPackingList (packingList) {
    await sequelize.transaction(async (transaction) => {
        await models.packingList.create(packingList, { 
            include: [item],
            transaction
        })
        console.info(`saved packing list: ${packingList.applicationId}`)
    })
}

async function getByPackingListId (applicationId) {
    const packingList = await models.packingList.findAll({
        where: {applicationId},
        include: [models.item]
    })
    return packingList
}

module.exports = {
    createPackingList, getByPackingListId
}