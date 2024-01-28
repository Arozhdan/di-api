import { CollectionConfig } from 'payload/types'
import { HistoryFields } from './History.fields'
import { Access, allowUserWithRole, filtered, requireOne } from 'payload-rbac'
import { History } from 'payload/generated-types'
import { historyController } from './History.controller'

const readAccess: Access = requireOne(
  allowUserWithRole('admin'),
  filtered<History>(
    { owner: { equals: ({ req }) => req.user?.id } }
  )
)

const createAccess: Access = requireOne(
  allowUserWithRole('admin'),
  allowUserWithRole('customer')
)

const History: CollectionConfig = {
  slug: 'history',
  labels: {
    singular: 'History',
    plural: 'History',
  },
  access: {
    read: readAccess,
    update: readAccess,
    create: createAccess,
    delete: readAccess,
  },
  admin: {
    useAsTitle: 'input',
    defaultColumns: ['input', 'output', 'owner'],
  },
  endpoints: historyController,
  defaultSort: '-createdAt',
  fields: HistoryFields,
}

export default History
