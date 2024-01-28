import { CollectionConfig } from 'payload/types'
import { InstrumentFields } from './Instruments.fields'
import { Access, allowAnonymous, allowUserWithRole, filtered, requireOne } from 'payload-rbac'
import { Instrument } from 'payload/generated-types'
import { instrumentsController } from './Instrument.controller'

const readAccess: Access = requireOne(
  allowAnonymous(),
  filtered<Instrument>({
    //@ts-ignore
    or: [
      { owner: { exists: false } },
      { owner: { equals: ({ req }) => req.user?.id } }
    ]
  })
)

const updateAccess: Access = requireOne(
  allowUserWithRole('admin'),
  filtered<Instrument>({
    //@ts-ignore
    or: [
      { owner: { equals: ({ req }) => req.user?.id } }
    ]
  })
)

const Instruments: CollectionConfig = {
  slug: 'instruments',
  admin: {
    useAsTitle: 'name'
  },
  access: {
    read: readAccess,
    create: allowAnonymous(),
    update: updateAccess,
    delete: updateAccess,
  },
  endpoints: instrumentsController,
  fields: InstrumentFields
}

export default Instruments
