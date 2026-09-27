export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'E-Commerce API',
    version: '1.0.0',
    description: 'API REST del proyecto evolutivo E-Commerce'
  },
  servers: [
    {
      url: 'http://localhost:4050/api/v1'
    }
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          200: {
            description: 'API disponible'
          }
        }
      }
    },
    '/products': {
      get: {
        summary: 'Listar productos',
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              default: 20
            }
          },
          {
            name: 'active',
            in: 'query',
            schema: {
              type: 'boolean'
            }
          }
        ],
        responses: {
          200: {
            description: 'Listado de productos'
          }
        }
      },
      post: {
        summary: 'Crear producto',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductInput'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Producto creado'
          }
        }
      }
    },
    '/auth/register': {
      post: {
        summary: 'Registrar usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterInput'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuario creado'
          }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginInput'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login correcto'
          }
        }
      }
    },
    '/cart': {
      get: {
        summary: 'Consultar carrito',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Carrito'
          }
        }
      }
    },
    '/orders': {
      get: {
        summary: 'Consultar órdenes',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Órdenes'
          }
        }
      },
      post: {
        summary: 'Crear orden',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          201: {
            description: 'Orden creada'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            example: 'Ana Lopez'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'ana@example.com'
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123'
          }
        }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'ana@example.com'
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123'
          }
        }
      },
      ProductInput: {
        type: 'object',
        required: ['sku', 'name', 'price', 'categoryId'],
        properties: {
          sku: {
            type: 'string',
            example: 'LAP-001'
          },
          name: {
            type: 'string',
            example: 'Laptop'
          },
          description: {
            type: 'string',
            example: 'Laptop para trabajo'
          },
          price: {
            type: 'number',
            example: 1000
          },
          stock: {
            type: 'integer',
            default: 0,
            example: 5
          },
          active: {
            type: 'boolean',
            default: true
          },
          categoryId: {
            type: 'string',
            example: 'computers'
          }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}
