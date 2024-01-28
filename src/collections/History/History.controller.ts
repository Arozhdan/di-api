import OpenAI from 'openai';
import { User } from 'payload/generated-types';
import { CollectionConfig } from "payload/types";


const validateUsage = async (req: any, res: any) => {
  const userId = req.user.id
  const user = await req.payload.findByID({
    collection: 'users',
    id: userId,
    depth: 1
  })

  const currentTotalUsage = user?.Related?.totalUsage || 0
  const currentMonthlyUsage = user?.Related?.monthlyUsage || 0

  const subscriptionsSearch = await req.payload.find({
    collection: 'subscriptions',
    where: {
      owner: userId
    },
  })

  if (subscriptionsSearch.totalDocs === 0) {
    return {
      currentTotalUsage: null,
      currentMonthlyUsage: null,
    }
  }

  const subscription = subscriptionsSearch.docs[0]

  const tierId = typeof subscription.tier === 'string' ? subscription.tier : subscription.tier.id
  const tier = await req.payload.findByID({
    collection: 'tiers',
    id: tierId
  })

  if (!tier) {
    return {
      currentTotalUsage: null,
      currentMonthlyUsage: null
    }
  }

  const tierAllowance = tier.allowance || 0

  if (tierAllowance !== -1 && currentTotalUsage > tierAllowance) {
    return {
      currentTotalUsage: null,
      currentMonthlyUsage: null
    }
  }

  return {
    currentTotalUsage,
    currentMonthlyUsage
  }

}

const updateUsage = async (req: any, res: any, monthlyUsage: number, totalUsage: number, userId: string) => {
  try {
    await req.payload.update({
      collection: 'users',
      id: userId,
      data: {
        totalUsage,
        monthlyUsage,
      }
    })
  } catch (err) {
    console.log(err)
  }
}

const updateUserLogs = async (req: any, instrumentId: string, instrumentName: string, userId: string) => {
  try {
    const user: User = await req.payload.findByID({
      collection: 'users',
      id: userId,
      depth: 1
    })

    const logs = (user.logs || []) as {}[]

    const index = logs.findIndex(log => log['instrumentId'] === instrumentId)

    if (index === -1) {
      logs.push({
        instrumentId,
        dateLastUsed: new Date(),
        instrumentName,
        timesUsed: 1
      })
    } else {
      logs[index]['dateLastUsed'] = new Date()
      logs[index]['timesUsed'] = logs[index]['timesUsed'] + 1
    }

    await req.payload.update({
      collection: 'users',
      id: userId,
      data: {
        logs
      }
    })

  } catch (err) {
    console.log(err)
  }
}

export const historyController: CollectionConfig['endpoints'] = [
  {
    path: '/generate',
    method: 'post',
    handler: async (req, res) => {
      try {
        const userId = req.user?.id
        if (!userId) {
          return res.sendStatus(401)
        }

        const { currentTotalUsage, currentMonthlyUsage } = await validateUsage(req, res)

        if (currentTotalUsage === null || currentMonthlyUsage === null) {
          return res.sendStatus(402)
        }


        const body = req.body
        const { input, instrumentId, language, tov } = body

        console.log('body', body);


        if (!input || !instrumentId) {
          return res.sendStatus(400)
        }

        const instrument = await req.payload.findByID({
          collection: 'instruments',
          id: instrumentId
        })

        if (!instrument) {
          return res.sendStatus(400)
        }

        let prompt = instrument.prompt

        const openai = new OpenAI({
          apiKey: process.env['OPENAI_API_KEY'] || '',
        });

        const chatOutput = await openai.chat.completions.create({
          messages: [
            { role: 'user', content: prompt },
          ],
          model: 'gpt-3.5-turbo',
        })

        const output = chatOutput.choices[0].message.content
        const usage = chatOutput.usage?.total_tokens || 0

        if (usage) await updateUsage(req, res, currentMonthlyUsage + usage, currentTotalUsage + usage, userId)

        const historyRecord = await req.payload.create({
          collection: 'history',
          data: {
            input: input.charAt(0).toUpperCase() + input.slice(1),
            output,
            instrument: instrumentId,
            owner: req.user?.id
          }
        })

        res.send({ historyRecord, usage })

        await updateUserLogs(req, instrumentId, instrument.name, userId)
      } catch (err) {
        console.log(err)
        return res.sendStatus(500)
      }
    }
  },
  {
    path: '/:id/edit',
    method: 'post',
    handler: async (req, res) => {
      try {

        const userId = req.user?.id
        if (!userId) {
          return res.sendStatus(401)
        }
        const { currentTotalUsage, currentMonthlyUsage } = await validateUsage(req, res)

        if (currentTotalUsage === null || currentMonthlyUsage === null) {
          return res.sendStatus(402)
        }

        const body = req.body
        const { input, command } = body

        const prompt = `Execute following: ${command}. Do not write introduction or conclusion text, only the body of the result. Use the following input: ${input}`

        if (!input || !command) {
          return res.sendStatus(400)
        }

        const openai = new OpenAI({
          apiKey: process.env['OPENAI_API_KEY'] || '',
        });

        const chatOutput = await openai.chat.completions.create({
          messages: [
            { role: 'user', content: prompt },
          ],
          model: 'gpt-3.5-turbo',
        })

        const output = chatOutput.choices[0].message.content
        const usage = chatOutput.usage?.total_tokens || 0

        console.log(usage);

        if (usage) await updateUsage(req, res, currentMonthlyUsage + usage, currentTotalUsage + usage, userId)


        return res.send({ output, usage })

      } catch (err) {
        console.log(err)
        return res.sendStatus(500)
      }
    }
  },
  {
    path: '/:id/pin',
    method: 'get',
    handler: async (req, res) => {
      try {
        const userId = req.user?.id
        if (!userId) {
          return res.sendStatus(401)
        }

        const historyId = req.params.id

        console.log('historyId', historyId);


        const result = await req.payload.update({
          collection: 'history',
          id: historyId,
          data: {
            isPinned: true
          }
        })

        console.log('result', result);


        return res.sendStatus(200)
      } catch (err) {
        console.log(err)
        return res.sendStatus(500)
      }
    }
  },
  {
    path: '/:id/unpin',
    method: 'get',
    handler: async (req, res) => {
      try {
        const userId = req.user?.id
        if (!userId) {
          return res.sendStatus(401)
        }

        const historyId = req.params.id

        console.log('historyId', historyId);


        const result = await req.payload.update({
          collection: 'history',
          id: historyId,
          data: {
            isPinned: false
          }
        })
        console.log('result', result);


        return res.sendStatus(200)
      } catch (err) {
        console.log(err)
        return res.sendStatus(500)
      }
    }
  },
  {
    path: '/:id/delete',
    method: 'delete',
    handler: async (req, res) => {
      try {
        const userId = req.user?.id
        if (!userId) {
          return res.sendStatus(401)
        }

        const historyId = req.params.id

        await req.payload.delete({
          collection: 'history',
          id: historyId
        })

        return res.sendStatus(200)
      } catch (err) {
        console.log(err)
        return res.sendStatus(500)

      }
    }
  }
]