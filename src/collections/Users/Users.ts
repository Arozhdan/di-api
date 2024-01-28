import { CollectionConfig } from 'payload/types'
import { UserFields } from './Users.fields'

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 14, // 14 days,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: UserFields
}

export default Users
