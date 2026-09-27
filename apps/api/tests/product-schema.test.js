import {
  describe,
  expect,
  it
} from 'vitest'

import {
  createProductSchema
} from '../src/modules/products/product.schema.js'

import dotenv from 'dotenv'
dotenv.config()


describe(
  'createProductSchema',
  () => {
    it(
      'accepts valid product',
      () => {
        const result =
          createProductSchema
            .parse({
              body: {
                sku:
                  'lap-001',

                name:
                  'Laptop',

                description:
                  'Demo',

                categoryId:
                  'computers',

                price:
                  1000,

                stock:
                  5,

                active:
                  true
              },

              params:
                {},

              query:
                {}
            })

        expect(
          result.body.sku
        ).toBe(
          'LAP-001'
        )
      }
    )

    it(
      'rejects negative price',
      () => {
        expect(
          () =>
            createProductSchema
              .parse({
                body: {
                  sku:
                    'lap-002',

                  name:
                    'Laptop',

                  categoryId:
                    'computers',

                  price:
                    -1,

                  stock:
                    1,

                  active:
                    true
                },

                params:
                  {},

                query:
                  {}
              })
        ).toThrow()
      }
    )
  }
)
