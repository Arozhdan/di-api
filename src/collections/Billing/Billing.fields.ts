import { Field, Tab } from "payload/types";



export const BillingFields: Field[] = [
  {
    type: 'row',
    fields: [{
      type: 'text',
      name: 'invoiceNumber',
      label: 'Invoice Number',
      required: true,
    },
    {
      type: 'text',
      name: 'orderID',
      label: 'Order ID',
      required: true,
    },]
  },
  {
    type: 'row',
    fields: [
      {
        type: 'text',
        name: 'paymentType',
        label: 'Payment Type',
        required: true,
      },
      {
        type: 'date',
        name: 'paymentDate',
        label: 'Payment Date',
        required: true,
      }
    ]
  },

  {
    type: 'checkbox',
    name: 'paid',
    label: 'Paid',
    required: true,
    admin: {
      position: 'sidebar',
    }
  },
  {
    type: 'relationship',
    name: 'subscription',
    relationTo: 'subscriptions',
    hasMany: false,
    admin: {
      position: 'sidebar',
    }
  },
  {
    type: 'relationship',
    name: 'owner',
    label: 'Customer',
    relationTo: 'users',
    hasMany: false,
    admin: {
      position: 'sidebar',
    }
  },
  {
    type: 'json',
    name: 'data',
    label: 'Raw Data',
    defaultValue: [],
  }
]