import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";
import { sendEmailRecompensa } from "../functions/sendEmailRecompensa/resource";

export const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

export const categorizeFunction = defineFunction({
  entry: "./categorize.ts",
  environment: {
    MODEL_ID,
  },
  timeoutSeconds: 60 // 1 minute timeout
});

const schema = a
  .schema({
    Transaccion: a
      .model({
        concepto: a.string(),
        categoriaId: a.id(),
        categoria: a.belongsTo("Categoria", "categoriaId"),
        location: a.customType({
          lat: a.float().required(),
          long: a.float().required(),
        }),
      })
      .authorization((allow) => [allow.owner()]),
    createTransaccionSchedule: a
      .mutation()
      .arguments({
        concepto: a.string().required(),
        categoriaId: a.id().required(),
        deliverDate: a.string().required(),
        email: a.string().required(),
        userTimeZone: a.string().required(),
      })
      .returns(a.json().required())
      .handler([
        a.handler.custom({
          entry: "./createTransaccion.js",
          dataSource: a.ref("Transaccion"),
        }),
        a.handler.custom({
          entry: "./scheduleMessage.js",
          dataSource: "ebSchedulerDS",
        }),
      ])
      .authorization((allow) => [allow.authenticated()]),

    Categoria: a
      .model({
        nombre: a.string().required(),
        preferencias: a.hasMany("Preferencia", "categoriaId"),
        preferenciasDeclaradas: a.hasMany(
          "PreferenciaDeclarada",
          "categoriaId"
        ),
        recompensas: a.hasMany("Recompensa", "categoriaId"),
        transacciones: a.hasMany("Transaccion", "categoriaId"),
        recompensaCategorias: a.hasMany("RecompensaCategoria", "categoriaId"),
      })
      .authorization((allow) => [allow.authenticated()]),

    Preferencia: a
      .model({
        nombre: a.string(),
        categoriaId: a.id(),
        categoria: a.belongsTo("Categoria", "categoriaId"),
        RecompensaPreferencias: a.hasMany(
          "RecompensaPreferencia",
          "preferenciaId"
        ),
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
        detalles: a.string(),
        categoriaId: a.id(),
        categoria: a.belongsTo("Categoria", "categoriaId"),
        img: a.string(),
        location: a.customType({
          lat: a.float().required(),
          long: a.float().required(),
        }),
        RecompensaPreferencias: a.hasMany(
          "RecompensaPreferencia",
          "recompensaId"
        ),
        RecompensaCategorias: a.hasMany("RecompensaCategoria", "recompensaId"),
      })
      .authorization((allow) => [allow.authenticated()]),

    RecompensaPreferencia: a
      .model({
        preferenciaId: a.id(),
        recompensaId: a.id(),
        preferencia: a.belongsTo("Preferencia", "preferenciaId"),
        recompensa: a.belongsTo("Recompensa", "recompensaId"),
      })
      .authorization((allow) => [allow.authenticated()]),

    RecompensaCategoria: a
      .model({
        categoriaId: a.id(),
        recompensaId: a.id(),
        categoria: a.belongsTo("Categoria", "categoriaId"),
        recompensa: a.belongsTo("Recompensa", "recompensaId"),
      })
      .authorization((allow) => [allow.authenticated()]),

    categorize: a
      .query()
      .arguments({ prompt: a.string().required().array().required() })
      .returns(a.json().required())
      .authorization((allow) => [allow.authenticated()])
      .handler(a.handler.function(categorizeFunction)),
  })
  .authorization((allow) => [
    allow.resource(sendEmailRecompensa).to(["query"]),
  ]);

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
