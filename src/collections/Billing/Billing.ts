import { CollectionConfig } from 'payload/types'
import { BillingFields } from './Billing.fields'
import { Access, allowUserWithRole, filtered, requireOne } from 'payload-rbac'
import { Billing } from 'payload/generated-types'

const readAccess: Access = requireOne(
  allowUserWithRole('admin'),
  filtered<Billing>({
    owner: { equals: ({ req }) => req.user?.id }
  })
)

const Billing: CollectionConfig = {
  slug: 'billing',
  labels: {
    singular: 'Billing',
    plural: 'Billing',
  },
  access: {
    create: allowUserWithRole('admin'),
    read: readAccess,
    update: allowUserWithRole('admin'),
    delete: allowUserWithRole('admin'),
  },
  admin: {
    useAsTitle: 'orderID'
  },
  defaultSort: '-createdAt',
  fields: BillingFields,
}

export default Billing
