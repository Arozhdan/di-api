import { Field, Tab } from "payload/types";



export const ChatFields: Field[] = [
  {
    type: 'text',
    name: 'name',
    label: 'Name',
    defaultValue: 'New Chat',
  },
  {
    type: 'relationship',
    name: 'owner',
    relationTo: 'users',
    hasMany: false,
    admin: {
      position: 'sidebar',
    }
  },
  {
    type: 'json',
    name: 'messages',
    label: 'Messages',
    defaultValue: [],
  }
]