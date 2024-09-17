const { models, sequelize } = require('../services/database-service')
const { v4: uuidv4 } = require('uuid')

async function createPackingList (packingListJson, applicationId) {
  try {
    await sequelize.transaction(async (transaction) => {
      const packingList = packingListMapper(packingListJson, applicationId)
      await models.packingList.create(packingList, {
        transaction
      })
      await models.item.bulkCreate(packingList.item, { transaction })
      console.info('Saved packing list in database with application id: ', packingList.applicationId)
    })
  } catch (err) {
    console.error(err)
  }
}

function packingListMapper (packingListJson, applicationId) {
  try {
    return {
      applicationId,
      registrationApprovalNumber: packingListJson.registration_approval_number,
      allRequiredFieldsPresent: packingListJson.business_checks.all_required_fields_present,
      item: packingListJson.items.map(n => itemsMapper(n, applicationId))
    }
  } catch (err) {
    console.error(err)
  }
}

function itemsMapper (o, applicationId) {
  return {
    itemId: uuidv4(),
    description: o.description,
    natureOfProducts: o.nature_of_products,
    typeOfTreatment: o.type_of_treatment,
    commodityCode: o.commodity_code,
    numberOfPackages: o.number_of_packages,
    totalWeight: o.total_net_weight_kg,
    applicationId
  }
}

module.exports = {
  createPackingList, itemsMapper, packingListMapper
}
