import {
  describe,
  expect,
  it
} from 'vitest'

import dotenv from 'dotenv'
dotenv.config()

process.env.FIRESTORE_EMULATOR_HOST =
  process.env.FIRESTORE_EMULATOR_HOST ??
  '127.0.0.1:8080'

process.env.FIREBASE_PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID ??
  'demo-ecommerce'

process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ??
  'test-access-secret'

process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ??
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
  'GET /api/v1/health',
  () => {
    it(
      'returns 200',
      async () => {
        const response =
          await request(app)
            .get(
              '/api/v1/health'
            )

        expect(
          response.status
        ).toBe(200)

        expect(
          response.body.success
        ).toBe(true)

        expect(
          response.body.data.status
        ).toBe('ok')
      }
    )
  }
)
