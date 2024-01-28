import { Field, Tab } from "payload/types";



export const HistoryFields: Field[] = [
  {
    type: 'textarea',
    name: 'input',
    label: 'User Input',
    required: true,
  },
  {
    type: 'textarea',
    name: 'output',
    label: 'AI Output',
    required: true,
  },
  {
    type: 'relationship',
    name: 'owner',
    relationTo: 'users',
    hasMany: false,
    required: true,
  },
  {
    type: 'relationship',
    name: 'instrument',
    relationTo: 'instruments',
    hasMany: false,
    required: true,
  },
  {
    type: 'checkbox',
    name: 'isPinned',
    label: 'Pin this history item?',
    defaultValue: false,
  }
]