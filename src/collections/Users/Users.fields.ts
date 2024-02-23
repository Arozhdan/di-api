import { Field, Tab } from "payload/types";


const tabs: Tab[] = [
  {
    label: 'Profile',
    fields: [
      {
        type: 'row',
        fields: [
          {
            type: 'text',
            label: 'First Name',
            name: 'firstName',
          },
          {
            type: 'text',
            label: 'Last Name',
            name: 'lastName',
          },
          {
            type: 'text',
            label: 'Username',
            name: 'username',
            index: true,
            unique: true,
          }
        ]
      },
      {
        type: 'text',
        name: 'phone',
        label: 'Phone Number',
      },
      {
        type: 'textarea',
        name: 'address',
        label: 'Address',
      }
    ]
  },
  {
    label: 'Preferences',
    fields: [
      {
        type: 'checkbox',
        name: 'prefersDarkMode',
        label: 'Prefers dark mode?',
        defaultValue: false,
      },
      {
        type: 'group',
        name: 'notifications',
        label: 'Notifications',
        fields: [
          {
            type: 'checkbox',
            name: 'communicationEmails',
            label: 'Receive communication emails?',
            defaultValue: true,
          },
          {
            type: 'checkbox',
            name: 'marketingEmails',
            label: 'Receive marketing emails?',
            defaultValue: true,
          },
          {
            type: 'checkbox',
            name: 'securityEmails',
            label: 'Receive security emails?',
            defaultValue: true,
          },
          {
            type: 'checkbox',
            name: 'pushNotifications',
            label: 'Receive push notifications?',
            defaultValue: true,
          },
        ]
      },
    ]
  },
  {
    label: 'Related',
    fields: [
      {
        type: 'row',
        fields: [
          {
            type: 'number',
            name: 'totalUsage',
            label: 'Total Usage',
            admin: {
              readOnly: true,
            },
          },
          {
            type: 'number',
            name: 'monthlyUsage',
            label: 'Monthly Usage',
            admin: {
              readOnly: true,
            },
          },
        ]
      },
      {
        type: 'relationship',
        name: 'favoriteInstruments',
        label: 'Favorite Instruments',
        relationTo: 'instruments',
        saveToJWT: true,
        hasMany: true,
        admin: {
          description: 'The instruments this user has favorited'
        }
      },
      {
        type: 'json',
        name: 'logs',
        label: 'Instrument Logs',
        admin: {
          description: 'Keep track of the instruments this user has used'
        },
      }
    ]
  }
]

export const UserFields: Field[] = [
  {
    type: 'tabs',
    tabs
  }
]