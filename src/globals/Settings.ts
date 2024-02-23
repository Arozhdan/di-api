import { allowAnyUser, allowUserWithRole } from "payload-rbac";
import { GlobalConfig } from "payload/types";

const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: allowAnyUser(),
    update: allowUserWithRole('admin'),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          name: 'privacyPolicyUrl',
          label: 'Privacy Policy URL',
          required: true,
        },
        {
          type: 'text',
          name: 'termsOfUseUrl',
          label: 'Terms of Use URL',
          required: true,
        }
      ]
    },
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          name: 'email',
          label: 'Hotline Email',
          required: true,
        },
        {
          type: 'text',
          name: 'telegram',
          label: 'Telegram',
          required: true,
        }
      ]
    },
    {
      type: 'row',
      fields: [
        {
          type: 'number',
          name: 'timePerQuery',
          label: 'Time Per Query',
          required: true,
          admin: {
            description: 'Used for "Time saved" calculation'
          }
        },
        {
          type: 'number',
          name: 'costPerQuery',
          label: 'Cost Per Query',
          required: true,
          admin: {
            description: 'Used for "Savings" calculation'
          }
        }
      ]
    },
    {
      type: 'richText',
      name: 'releaseNotes',
      required: true,
      localized: true,
    },
    {
      type: 'array',
      name: 'subscriptionsLinks',
      admin: {
        components: {
          RowLabel: ({ data }) => {
            console.log(data);

            const isFeatured = data.isFeatured ? '- (Featured)' : ''
            const tierName = data.tier?.name || data.price || ''
            return `${tierName} ${isFeatured}`
          }
        }
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              type: 'relationship',
              name: 'tier',
              relationTo: 'tiers',
            },
            {
              type: 'text',
              name: 'url',
              label: 'URL',
              required: true,
            },
          ]
        },
        {
          type: 'row',
          fields: [
            {
              type: 'number',
              name: 'price',
              label: 'Price',
              required: true,
            },
            {
              type: 'text',
              name: 'currency',
              label: 'Currency',
              required: true,
            },
            {
              type: 'checkbox',
              name: 'isFeatured',
              label: 'Featured',
              defaultValue: false,
              admin: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: '2rem',
                }
              }
            }
          ]
        },
        {
          type: 'richText',
          name: 'description',
          label: 'Description',
          required: true,
          localized: true,
        }
      ]
    },
    {
      type: 'array',
      name: 'subscriptionIds',
      label: 'Subscription IDs',
      admin: {
        description: 'Map of subscription IDs to their tiers',
        components: {
          RowLabel: ({ data }) => {
            return data.externalSubscriptionId || 'New Subscription'
          }
        }
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              type: 'text',
              name: 'externalSubscriptionId',
              label: 'External Subscription ID',
              required: true,
            },
            {
              type: 'relationship',
              name: 'tier',
              relationTo: 'tiers',
              required: true,
            },
          ]
        }
      ]
    }
  ]
}


export default Settings