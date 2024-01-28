import OpenAI from 'openai';
import { CollectionConfig } from "payload/types";



export const instrumentsController: CollectionConfig['endpoints'] = [
  {
    path: '/:id/like',
    method: 'get',
    handler: async (req, res) => {
      try {
        const userId = req.user?.id
        if (!userId) {
          return res.sendStatus(401)
        }

        const instrumentId = req.params.id
        await req.payload.db.collections['users'].updateOne(
          { _id: userId },
          {
            $addToSet: { favoriteInstruments: instrumentId }
          }
        )

        return res.sendStatus(200)
      } catch (err) {
        console.log(err)
        return res.sendStatus(500)
      }
    }
  },
  {
    path: '/:id/unlike',
    method: 'get',
    handler: async (req, res) => {
      try {
        const userId = req.user?.id
        if (!userId) {
          return res.sendStatus(401)
        }

        const currentInstruments = await req.payload.db.collections['users'].findOne(
          { _id: userId },
          {
            favoriteInstruments: 1
          }
        )
        //favoriteInstruments: [
        //   new ObjectId("65ab31da429666feeadeb72a"),
        //   new ObjectId("65ab3108429666feeadeb6ed"),
        //   new ObjectId("65ab316b429666feeadeb705"),
        //   new ObjectId("65ab3097429666feeadeb6c9"),
        //   new ObjectId("65ab3187429666feeadeb712"),
        //   new ObjectId("65ab314a429666feeadeb6fd"),
        //   new ObjectId("65ab3108429666feeadeb6ed")
        // ]
        const instrumentId = req.params.id


        console.log('instrumentId', instrumentId);


        await req.payload.db.collections['users'].updateOne(
          { _id: userId },
          {
            $pull: { favoriteInstruments: instrumentId }
          },
          {
            multi: false,
            upsert: false
          }
        )

        return res.sendStatus(200)
      } catch (err) {
        console.log(err)
        return res.sendStatus(500)
      }
    }
  },
]