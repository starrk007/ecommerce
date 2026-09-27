import {
  describe,
  expect,
  it
} from 'vitest'

import dotenv from 'dotenv'
dotenv.config()


process.env.FIRESTORE_EMULATOR_HOST =
  '127.0.0.1:8080'

process.env.FIREBASE_PROJECT_ID =
  'demo-ecommerce'

process.env.JWT_ACCESS_SECRET =
  'test-access-secret'

process.env.JWT_REFRESH_SECRET =
  'test-refresh-secret'

const {
  default: request
} =
  await import(
    'supertest'
  )

const {
  app
} =
  await import(
    '../src/app.js'
  )

describe(
  '404 middleware',
  () => {
    it(
      'returns standard error',
      async () => {
        const response =
          await request(app)
            .get(
              '/api/v1/does-not-exist'
            )

        expect(
          response.status
        ).toBe(404)

        expect(
          response.body.error.code
        ).toBe(
          'ROUTE_NOT_FOUND'
        )
      }
    )
  }
)
