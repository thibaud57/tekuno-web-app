import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { personsRoute } from './persons/persons-routes'
import { usersRoute } from './users/users-routes'

admin.initializeApp()

const app = express()
app.use(bodyParser.json())
app.use(cors({ origin: true }))

usersRoute(app)
personsRoute(app)

functions.setGlobalOptions({ region: 'europe-west1' })

export const api = functions.https.onRequest(app)
