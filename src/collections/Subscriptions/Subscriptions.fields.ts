import { Field } from "payload/types";


export const SubscriptionsFields: Field[] = [
  {
    type: 'text',
    name: 'name',
    label: 'Title',
    required: true,
    admin: {
      hidden: true,
    },
    hooks: {
      beforeChange: [
        async ({ data, req }) => {
          try {
            const owner = await req.payload.db.collections.users.findOne({ _id: data.owner })
            const ownerEmail = owner.email
            return ownerEmail
          } catch (err) {
            console.log(err)
            return 'Untitled'
          }
        }
      ]
    }

  },
  {
    type: 'relationship',
    name: 'owner',
    label: 'User',
    relationTo: 'users',
    hasMany: false,
    required: true,
    admin: {
      position: 'sidebar',
    }
  },
  {
    type: 'checkbox',
    name: 'active',
    label: 'Active',
    defaultValue: true,
    admin: {
      position: 'sidebar',
    }
  },
  {
    type: 'date',
    name: 'startDate',
    label: 'Start Date',
    required: true,
  },
  {
    type: 'date',
    name: 'endDate',
    label: 'End Date',
    required: true,
  },
  {
    type: 'date',
    name: 'nextPaymentDate',
    label: 'Next Payment Date',
    required: true,
  },
  {
    type: 'date',
    name: 'lastPaymentDate',
    label: 'Last Payment Date',
    required: true,
  },
  {
    type: 'relationship',
    name: 'tier',
    label: 'Subscription Tier',
    relationTo: 'tiers',
    admin: {
      position: 'sidebar',
    }
  }
]