import { Field, Tab } from "payload/types";



export const InstrumentFields: Field[] = [
  {
    type: 'text',
    name: 'name',
    label: 'Name',
    required: true,
    localized: true,
  },
  {
    type: 'text',
    name: 'intro',
    label: 'Intro',
    required: true,
    localized: true,
  },
  {
    type: 'textarea',
    name: 'description',
    label: 'Description',
    required: true,
    localized: true,
  },
  {
    type: 'textarea',
    name: 'example',
    label: 'Example',
    required: true,
    localized: true,
  },
  {
    type: 'textarea',
    name: 'prompt',
    label: 'Prompt',
    required: true,
  },
  {
    type: 'relationship',
    name: 'owner',
    relationTo: 'users',
    hasMany: false,
  },
  {
    type: 'select',
    name: 'instrumentType',
    label: 'Instrument Type',
    options: [
      { label: 'Simple tools', value: 'simple' },
      { label: 'Social media', value: 'social' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Branding', value: 'branding' },
      { label: 'Sales', value: 'sales' },
      { label: 'Custom', value: 'custom' }
    ],
    defaultValue: 'other',
    admin: {
      position: 'sidebar',
    }
  }
]