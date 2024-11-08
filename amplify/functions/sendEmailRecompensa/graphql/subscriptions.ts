/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateCategoria = /* GraphQL */ `subscription OnCreateCategoria($filter: ModelSubscriptionCategoriaFilterInput) {
  onCreateCategoria(filter: $filter) {
    createdAt
    id
    nombre
    preferencias {
      nextToken
      __typename
    }
    preferenciasDeclaradas {
      nextToken
      __typename
    }
    recompensas {
      nextToken
      __typename
    }
    recompensasAsignadas {
      nextToken
      __typename
    }
    transacciones {
      nextToken
      __typename
    }
    transaccionesAnalizadas {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCategoriaSubscriptionVariables,
  APITypes.OnCreateCategoriaSubscription
>;
export const onCreatePreferencia = /* GraphQL */ `subscription OnCreatePreferencia(
  $filter: ModelSubscriptionPreferenciaFilterInput
) {
  onCreatePreferencia(filter: $filter) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    nombre
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePreferenciaSubscriptionVariables,
  APITypes.OnCreatePreferenciaSubscription
>;
export const onCreatePreferenciaDeclarada = /* GraphQL */ `subscription OnCreatePreferenciaDeclarada(
  $filter: ModelSubscriptionPreferenciaDeclaradaFilterInput
  $owner: String
) {
  onCreatePreferenciaDeclarada(filter: $filter, owner: $owner) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    nombre
    owner
    preferenciaId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePreferenciaDeclaradaSubscriptionVariables,
  APITypes.OnCreatePreferenciaDeclaradaSubscription
>;
export const onCreateRecompensa = /* GraphQL */ `subscription OnCreateRecompensa(
  $filter: ModelSubscriptionRecompensaFilterInput
) {
  onCreateRecompensa(filter: $filter) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    location {
      lat
      long
      __typename
    }
    nombre
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateRecompensaSubscriptionVariables,
  APITypes.OnCreateRecompensaSubscription
>;
export const onCreateRecompensaAsignada = /* GraphQL */ `subscription OnCreateRecompensaAsignada(
  $filter: ModelSubscriptionRecompensaAsignadaFilterInput
  $owner: String
) {
  onCreateRecompensaAsignada(filter: $filter, owner: $owner) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    location {
      lat
      long
      __typename
    }
    nombre
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateRecompensaAsignadaSubscriptionVariables,
  APITypes.OnCreateRecompensaAsignadaSubscription
>;
export const onCreateTransaccion = /* GraphQL */ `subscription OnCreateTransaccion(
  $filter: ModelSubscriptionTransaccionFilterInput
  $owner: String
) {
  onCreateTransaccion(filter: $filter, owner: $owner) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    concepto
    createdAt
    id
    location {
      lat
      long
      __typename
    }
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTransaccionSubscriptionVariables,
  APITypes.OnCreateTransaccionSubscription
>;
export const onCreateTransaccionesAnalizadas = /* GraphQL */ `subscription OnCreateTransaccionesAnalizadas(
  $filter: ModelSubscriptionTransaccionesAnalizadasFilterInput
) {
  onCreateTransaccionesAnalizadas(filter: $filter) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    concepto
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTransaccionesAnalizadasSubscriptionVariables,
  APITypes.OnCreateTransaccionesAnalizadasSubscription
>;
export const onDeleteCategoria = /* GraphQL */ `subscription OnDeleteCategoria($filter: ModelSubscriptionCategoriaFilterInput) {
  onDeleteCategoria(filter: $filter) {
    createdAt
    id
    nombre
    preferencias {
      nextToken
      __typename
    }
    preferenciasDeclaradas {
      nextToken
      __typename
    }
    recompensas {
      nextToken
      __typename
    }
    recompensasAsignadas {
      nextToken
      __typename
    }
    transacciones {
      nextToken
      __typename
    }
    transaccionesAnalizadas {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCategoriaSubscriptionVariables,
  APITypes.OnDeleteCategoriaSubscription
>;
export const onDeletePreferencia = /* GraphQL */ `subscription OnDeletePreferencia(
  $filter: ModelSubscriptionPreferenciaFilterInput
) {
  onDeletePreferencia(filter: $filter) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    nombre
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePreferenciaSubscriptionVariables,
  APITypes.OnDeletePreferenciaSubscription
>;
export const onDeletePreferenciaDeclarada = /* GraphQL */ `subscription OnDeletePreferenciaDeclarada(
  $filter: ModelSubscriptionPreferenciaDeclaradaFilterInput
  $owner: String
) {
  onDeletePreferenciaDeclarada(filter: $filter, owner: $owner) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    nombre
    owner
    preferenciaId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePreferenciaDeclaradaSubscriptionVariables,
  APITypes.OnDeletePreferenciaDeclaradaSubscription
>;
export const onDeleteRecompensa = /* GraphQL */ `subscription OnDeleteRecompensa(
  $filter: ModelSubscriptionRecompensaFilterInput
) {
  onDeleteRecompensa(filter: $filter) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    location {
      lat
      long
      __typename
    }
    nombre
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteRecompensaSubscriptionVariables,
  APITypes.OnDeleteRecompensaSubscription
>;
export const onDeleteRecompensaAsignada = /* GraphQL */ `subscription OnDeleteRecompensaAsignada(
  $filter: ModelSubscriptionRecompensaAsignadaFilterInput
  $owner: String
) {
  onDeleteRecompensaAsignada(filter: $filter, owner: $owner) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    location {
      lat
      long
      __typename
    }
    nombre
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteRecompensaAsignadaSubscriptionVariables,
  APITypes.OnDeleteRecompensaAsignadaSubscription
>;
export const onDeleteTransaccion = /* GraphQL */ `subscription OnDeleteTransaccion(
  $filter: ModelSubscriptionTransaccionFilterInput
  $owner: String
) {
  onDeleteTransaccion(filter: $filter, owner: $owner) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    concepto
    createdAt
    id
    location {
      lat
      long
      __typename
    }
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTransaccionSubscriptionVariables,
  APITypes.OnDeleteTransaccionSubscription
>;
export const onDeleteTransaccionesAnalizadas = /* GraphQL */ `subscription OnDeleteTransaccionesAnalizadas(
  $filter: ModelSubscriptionTransaccionesAnalizadasFilterInput
) {
  onDeleteTransaccionesAnalizadas(filter: $filter) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    concepto
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTransaccionesAnalizadasSubscriptionVariables,
  APITypes.OnDeleteTransaccionesAnalizadasSubscription
>;
export const onOrderStatusChange = /* GraphQL */ `subscription OnOrderStatusChange {
  onOrderStatusChange {
    message
    orderId
    status
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnOrderStatusChangeSubscriptionVariables,
  APITypes.OnOrderStatusChangeSubscription
>;
export const onUpdateCategoria = /* GraphQL */ `subscription OnUpdateCategoria($filter: ModelSubscriptionCategoriaFilterInput) {
  onUpdateCategoria(filter: $filter) {
    createdAt
    id
    nombre
    preferencias {
      nextToken
      __typename
    }
    preferenciasDeclaradas {
      nextToken
      __typename
    }
    recompensas {
      nextToken
      __typename
    }
    recompensasAsignadas {
      nextToken
      __typename
    }
    transacciones {
      nextToken
      __typename
    }
    transaccionesAnalizadas {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCategoriaSubscriptionVariables,
  APITypes.OnUpdateCategoriaSubscription
>;
export const onUpdatePreferencia = /* GraphQL */ `subscription OnUpdatePreferencia(
  $filter: ModelSubscriptionPreferenciaFilterInput
) {
  onUpdatePreferencia(filter: $filter) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    nombre
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePreferenciaSubscriptionVariables,
  APITypes.OnUpdatePreferenciaSubscription
>;
export const onUpdatePreferenciaDeclarada = /* GraphQL */ `subscription OnUpdatePreferenciaDeclarada(
  $filter: ModelSubscriptionPreferenciaDeclaradaFilterInput
  $owner: String
) {
  onUpdatePreferenciaDeclarada(filter: $filter, owner: $owner) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    nombre
    owner
    preferenciaId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePreferenciaDeclaradaSubscriptionVariables,
  APITypes.OnUpdatePreferenciaDeclaradaSubscription
>;
export const onUpdateRecompensa = /* GraphQL */ `subscription OnUpdateRecompensa(
  $filter: ModelSubscriptionRecompensaFilterInput
) {
  onUpdateRecompensa(filter: $filter) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    location {
      lat
      long
      __typename
    }
    nombre
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateRecompensaSubscriptionVariables,
  APITypes.OnUpdateRecompensaSubscription
>;
export const onUpdateRecompensaAsignada = /* GraphQL */ `subscription OnUpdateRecompensaAsignada(
  $filter: ModelSubscriptionRecompensaAsignadaFilterInput
  $owner: String
) {
  onUpdateRecompensaAsignada(filter: $filter, owner: $owner) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    createdAt
    id
    location {
      lat
      long
      __typename
    }
    nombre
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateRecompensaAsignadaSubscriptionVariables,
  APITypes.OnUpdateRecompensaAsignadaSubscription
>;
export const onUpdateTransaccion = /* GraphQL */ `subscription OnUpdateTransaccion(
  $filter: ModelSubscriptionTransaccionFilterInput
  $owner: String
) {
  onUpdateTransaccion(filter: $filter, owner: $owner) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    concepto
    createdAt
    id
    location {
      lat
      long
      __typename
    }
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTransaccionSubscriptionVariables,
  APITypes.OnUpdateTransaccionSubscription
>;
export const onUpdateTransaccionesAnalizadas = /* GraphQL */ `subscription OnUpdateTransaccionesAnalizadas(
  $filter: ModelSubscriptionTransaccionesAnalizadasFilterInput
) {
  onUpdateTransaccionesAnalizadas(filter: $filter) {
    categoria {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    categoriaId
    concepto
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTransaccionesAnalizadasSubscriptionVariables,
  APITypes.OnUpdateTransaccionesAnalizadasSubscription
>;
