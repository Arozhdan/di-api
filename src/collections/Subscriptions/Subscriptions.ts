import { CollectionConfig } from 'payload/types'
import { SubscriptionsFields } from './Subscriptions.fields'
import { Access, allowUserWithRole, filtered, requireOne } from 'payload-rbac'
import { Subscription } from 'payload/generated-types'

const readAccess: Access = requireOne(
  allowUserWithRole('admin'),
  filtered<Subscription>({
    owner: { equals: ({ req }) => req.user?.id }
  })
)

const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  access: {
    read: readAccess,
    create: allowUserWithRole('admin'),
    update: allowUserWithRole('admin'),
    delete: allowUserWithRole('admin'),
  },
  admin: {
    useAsTitle: 'name',
  },
  defaultSort: '-createdAt',
  fields: SubscriptionsFields,
}

export default Subscriptions
