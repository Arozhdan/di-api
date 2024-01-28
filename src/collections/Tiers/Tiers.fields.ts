import { Field, Tab } from "payload/types";


const tabs: Tab[] = [
  {
    label: 'Main',
    fields: [
      {
        type: 'text',
        name: 'name',
        label: 'Name',
        required: true,
      },
      {
        type: 'row',
        fields: [
          {
            type: 'number',
            name: 'allowance',
            label: 'Allowance',
            required: true,
            admin: {
              description: 'Monthly allowance of tokens usage'
            }
          }
        ]
      },
      {
        type: "richText",
        name: "description",
        label: "Description",
      }
    ]
  },
  {
    label: 'Additional',
    fields: [
      {
        type: 'checkbox',
        name: 'allowChat',
        label: 'Allow Chat',
        defaultValue: false,
        admin: {
          description: 'Give users access to use ChatGPT'
        }
      },
      {
        type: 'checkbox',
        name: 'allowTemplates',
        label: 'Allow Templates',
        defaultValue: false,
        admin: {
          description: 'Give users option to create own instruments / templates'
        }
      }
    ]
  }
]

export const TiersFields: Field[] = [
  { type: 'tabs', tabs }
]