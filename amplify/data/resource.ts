import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { sayHello } from "../functions/say-hello/resource";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/

const schema = a.schema({
  sayHello: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(sayHello))
    .authorization((allow) => [allow.authenticated()]),
  clasificaConcepto: a
    .query()
    .arguments({
      concepto: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(sayHello))
    .authorization((allow) => [allow.authenticated()]),

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
  RecompensaAsignada: a
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
    .authorization((allow) => [allow.owner()]),
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
  TransaccionesAnalizadas: a
    .model({
      concepto: a.string(),
      categoriaId: a.id(),
      categoria: a.belongsTo("Categoria", "categoriaId"),
    })
    .authorization((allow) => [allow.authenticated()]),

  Categoria: a
    .model({
      nombre: a.string(),
      preferencias: a.hasMany("Preferencia", "categoriaId"),
      preferenciasDeclaradas: a.hasMany("PreferenciaDeclarada", "categoriaId"),
      recompensas: a.hasMany("Recompensa", "categoriaId"),
      recompensasAsignadas: a.hasMany("RecompensaAsignada", "categoriaId"),
      transacciones: a.hasMany("Transaccion", "categoriaId"),
      transaccionesAnalizadas: a.hasMany(
        "TransaccionesAnalizadas",
        "categoriaId"
      ),
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
    .authorization((allow) => [ allow.authenticated( )])
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
