const packingListService = require('../../../../app/packing-list')
const dbHelper = require('../../../db-helper')

describe('PackingList service test', () => {
  beforeEach(async () => {
    await dbHelper.truncate()
  })

  afterAll(async () => {
    await dbHelper.close()
  })

  test('create creates packing list', async () => {
    console.log('help')
    const packingListJson = {
      registration_approval_number: 'remos',
      items: [],
      business_checks:
        {
          all_required_fields_present: true
        }
    }
    console.log(packingListJson)
    await packingListService.createPackingList(packingListJson, '123')
  })
})
