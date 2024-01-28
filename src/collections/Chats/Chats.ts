import { CollectionConfig } from 'payload/types'
import { ChatFields } from './Chat.fields'
import { Access, allowAnyUser, allowUserWithRole, filtered, requireOne } from 'payload-rbac'
import { Chat } from 'payload/generated-types'

const readAccess: Access = requireOne(
  allowUserWithRole('admin'),
  filtered<Chat>({
    owner: { equals: ({ req }) => req.user?.id }
  })
)

const Chats: CollectionConfig = {
  slug: 'chat',
  access: {
    create: allowAnyUser(),
    read: readAccess,
    update: readAccess,
    delete: readAccess,
  },
  admin: {
    useAsTitle: 'name',
  },
  defaultSort: '-createdAt',
  fields: ChatFields,
}

export default Chats
