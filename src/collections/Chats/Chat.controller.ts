import OpenAI from "openai";
import { CollectionConfig } from "payload/types";

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

export const ChatController: CollectionConfig['endpoints'] = [
  {
    path: '/:id/send',
    method: 'patch',
    handler: async (req, res) => {
      try {
        const { id } = req.params
        const { message } = req.body
        const userId = req.user?.id

        if (!userId) return res.sendStatus(401)

        const chat = await req.payload.findByID({
          collection: 'chat',
          id,
          depth: 0
        })

        const messages = (chat.messages || []) as {
          role: 'user' | 'assistant',
          content: string
        }[]
        messages.push({
          role: 'user',
          content: message
        })

        const openai = new OpenAI({
          apiKey: process.env['OPENAI_API_KEY'] || '',
        });

        const chatOutput = await openai.chat.completions.create({
          messages: messages.slice(-4),
          model: 'gpt-3.5-turbo',
        })

        const output = chatOutput.choices[0].message.content
        const usage = chatOutput.usage?.total_tokens || 0

        console.log(usage);
        const user = await req.payload.findByID({
          collection: 'users',
          id: userId,
          depth: 1
        })

        const currentTotalUsage = user?.totalUsage || 0
        const currentMonthlyUsage = user?.monthlyUsage || 0

        if (usage) await updateUsage(req, res, currentMonthlyUsage + usage, currentTotalUsage + usage, userId)

        messages.push({
          role: 'assistant',
          content: output
        })

        await req.payload.update({
          collection: 'chat',
          id,
          data: {
            messages
          }
        })

        return res.send({
          output,
          usage
        })



      } catch (err) {
        console.log(err)
        return res.sendStatus(500)
      }
    }
  },
  {
    path: '/create',
    method: 'get',
    handler: async (req, res) => {
      try {
        const userId = req.user?.id
        if (!userId) return res.sendStatus(401)


        const chat = await req.payload.create({
          collection: 'chat',
          data: {
            name: 'New Chat',
            messages: [],
            owner: userId
          }
        })


        return res.send(chat)
      } catch (err) {
        console.log('Error creating chat', err)
        return res.sendStatus(500)
      }
    }
  },
  {
    path: '/deleteAll',
    method: 'delete',
    handler: async (req, res) => {
      try {
        const userId = req.user?.id
        if (!userId) return res.sendStatus(401)

        const chats = await req.payload.find({
          collection: 'chat',
          where: {
            owner: userId
          },
          depth: 0
        })

        for (const chat of chats.docs) {
          console.log('Deleting chat', chat.id);

          await req.payload.delete({
            collection: 'chat',
            id: chat.id
          })
        }

        return res.sendStatus(200)
      } catch (err) {
        console.log('Error deleting all chats', err)
        return res.sendStatus(500)
      }
    }
  }
]