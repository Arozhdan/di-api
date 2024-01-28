import { CollectionConfig } from 'payload/types'
import { TiersFields } from './Tiers.fields'
import { allowAnonymous, allowUserWithRole } from 'payload-rbac'

const Tiers: CollectionConfig = {
  slug: 'tiers',
  access: {
    read: allowAnonymous(),
    create: allowUserWithRole('admin'),
    update: allowUserWithRole('admin'),
    delete: allowUserWithRole('admin'),
  },
  admin: {
    useAsTitle: 'main.name',
    defaultColumns: ['main.name', 'main.allowance'],
  },
  defaultSort: '-createdAt',
  fields: TiersFields,
}

export default Tiers
