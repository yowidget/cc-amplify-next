import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { sendEmailRecompensas } from "../functions/sendEmailRecompensas/resource";
const schema = a
  .schema({
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
    createTransaccionSchedule: a
      .mutation()
      .arguments({
        concepto: a.string().required(),
      })
      .returns(
        a.customType({
          message: a.string().required(),
        })
      )
      .handler([
        a.handler.custom({
          entry: "./createTransaccion.js",
          dataSource: a.ref("Transaccion"),
        }),
        a.handler.custom({
          entry: "./scheduleMessage.js",
          dataSource: a.ref("ebSchedulerDS"),
        }),
      ])
      .authorization((allow) => [allow.authenticated()]),
    Categoria: a
      .model({
        nombre: a.string(),
        preferencias: a.hasMany("Preferencia", "categoriaId"),
        preferenciasDeclaradas: a.hasMany(
          "PreferenciaDeclarada",
          "categoriaId"
        ),
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

    OrderStatus: a.enum(["OrderPending", "OrderShipped", "OrderDelivered"]),
    OrderStatusChange: a.customType({
      orderId: a.id().required(),
      status: a.ref("OrderStatus").required(),
      message: a.string().required(),
    }),

    publishOrderToEventBridge: a
      .mutation()
      .arguments({
        orderId: a.id().required(),
        status: a.string().required(),
        message: a.string().required(),
      })
      .returns(a.ref("OrderStatusChange"))
      .authorization((allow) => [allow.authenticated()])
      .handler(
        a.handler.custom({
          dataSource: "MyEventBridgeDataSource",
          entry: "./publishOrderToEventBridge.js",
        })
      ),
    publishOrderFromEventBridge: a
      .mutation()
      .arguments({
        orderId: a.id().required(),
        status: a.string().required(),
        message: a.string().required(),
      })
      .returns(a.ref("OrderStatusChange"))
      .authorization((allow) => [allow.authenticated()])
      .handler(
        a.handler.custom({
          entry: "./publishOrderFromEventBridge.js",
        })
      ),
    onOrderStatusChange: a
      .subscription()
      .for(a.ref("publishOrderFromEventBridge"))
      .authorization((allow) => [allow.authenticated()])
      .handler(
        a.handler.custom({
          entry: "./onOrderStatusChange.js",
        })
      ),
  })
  .authorization((allow) => [
    allow.resource(sendEmailRecompensas).to(["query"]),
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
