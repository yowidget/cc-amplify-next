import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";

export const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

export const categorizeFunction = defineFunction({
  entry: "./categorize.ts",
  environment: {
    MODEL_ID,
  },
});

const schema = a.schema({
  Transaccion: a
    .model({
      concepto: a.string(),
      categoriaId: a.id(),
      categoria: a.belongsTo("Categoria", "categoriaId"),
      location: a.customType({
        // fields can be required or optional
        lat: a.float().required(),
        long: a.float().required(),
      }),
    })
    .authorization((allow) => [allow.owner()]),

  Categoria: a
    .model({
      nombre: a.string().required(),
      preferencias: a.hasMany("Preferencia", "categoriaId"),
      preferenciasDeclaradas: a.hasMany("PreferenciaDeclarada", "categoriaId"),
      recompensas: a.hasMany("Recompensa", "categoriaId"),
      transacciones: a.hasMany("Transaccion", "categoriaId"),
    })
    .authorization((allow) => [allow.authenticated()]),

  Preferencia: a
    .model({
      nombre: a.string(),
      categoriaId: a.id(),
      categoria: a.belongsTo("Categoria", "categoriaId"),
    })
    .authorization((allow) => [allow.authenticated()]),

  PreferenciaDeclarada: a
    .model({
      nombre: a.string(),
      preferenciaId: a.id(),
      categoriaId: a.id(),
      categoria: a.belongsTo("Categoria", "categoriaId"),
    })
    .authorization((allow) => [allow.owner()]),

  Recompensa: a
    .model({
      nombre: a.string(),
      categoriaId: a.id(),
      categoria: a.belongsTo("Categoria", "categoriaId"),
      location: a.customType({
        // fields can be required or optional
        lat: a.float().required(),
        long: a.float().required(),
      }),
    })
    .authorization((allow) => [allow.authenticated()]),


  categorize: a
    .query()
    .arguments({ prompt: a.string().required().array().required() })
    .returns(a.json().required())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(categorizeFunction)),


});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  name: "capital-chorizo",
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
