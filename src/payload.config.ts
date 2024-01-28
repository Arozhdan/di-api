import path from 'path'
import rbac from 'payload-rbac';
import { relationshipsAsObjectID } from '@payloadcms/plugin-relationship-object-ids'
import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'
import { selectPlugin } from 'payload-query';
import { swagger } from 'payload-swagger';

import Settings from './globals/Settings'

import Users from './collections/Users/Users'
import Instruments from './collections/Instruments/Instruments'
import History from './collections/History/History'
import Chats from './collections/Chats/Chats'
import Subscriptions from './collections/Subscriptions/Subscriptions'
import Billing from './collections/Billing/Billing'
import Tiers from './collections/Tiers/Tiers'

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  globals: [Settings],
  collections: [Users, Instruments, History, Chats, Subscriptions, Billing, Tiers],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: [
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  csrf: [
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  plugins: [
    payloadCloud(),
    relationshipsAsObjectID(),
    swagger(),
    selectPlugin(),
    rbac({
      collections: ['users'],
      roles: ['admin', 'reader', 'customer']
    }),
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
