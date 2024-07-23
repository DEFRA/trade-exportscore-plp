const upsertIdcoms = require('../../../app/routes/upsert-idcoms')

jest.mock('../../../app/services/dynamics-service')

const { sequelize } = require('../../../app/services/database-service')
const { patchPackingListCheck } = require('../../../app/services/dynamics-service')

patchPackingListCheck.mockImplementation(() => {
    return jest.fn()
})

jest.mock('../../../app/services/database-service', () => ({
    sequelize: {
        authenticate: jest.fn()
    }
}))

describe('upsert idcoms', () => {
    afterAll(async () => {
        jest.resetAllMocks()
        await sequelize.close
    })

    test('should perform the upsert when application id is specified', async () => {
        sequelize.authenticate.mockResolvedValue()

        const mockHandler = {
            response: 'ok',
            code: 200
        }

        await upsertIdcoms.options.handler({ query: { applicationId: 123 } }, mockHandler)

        expect(patchPackingListCheck).toHaveBeenCalled()
    })
})
