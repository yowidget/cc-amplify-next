/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createCategoria = /* GraphQL */ `mutation CreateCategoria(
  $condition: ModelCategoriaConditionInput
  $input: CreateCategoriaInput!
) {
  createCategoria(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateCategoriaMutationVariables,
  APITypes.CreateCategoriaMutation
>;
export const createPreferencia = /* GraphQL */ `mutation CreatePreferencia(
  $condition: ModelPreferenciaConditionInput
  $input: CreatePreferenciaInput!
) {
  createPreferencia(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePreferenciaMutationVariables,
  APITypes.CreatePreferenciaMutation
>;
export const createPreferenciaDeclarada = /* GraphQL */ `mutation CreatePreferenciaDeclarada(
  $condition: ModelPreferenciaDeclaradaConditionInput
  $input: CreatePreferenciaDeclaradaInput!
) {
  createPreferenciaDeclarada(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePreferenciaDeclaradaMutationVariables,
  APITypes.CreatePreferenciaDeclaradaMutation
>;
export const createRecompensa = /* GraphQL */ `mutation CreateRecompensa(
  $condition: ModelRecompensaConditionInput
  $input: CreateRecompensaInput!
) {
  createRecompensa(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateRecompensaMutationVariables,
  APITypes.CreateRecompensaMutation
>;
export const createRecompensaAsignada = /* GraphQL */ `mutation CreateRecompensaAsignada(
  $condition: ModelRecompensaAsignadaConditionInput
  $input: CreateRecompensaAsignadaInput!
) {
  createRecompensaAsignada(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateRecompensaAsignadaMutationVariables,
  APITypes.CreateRecompensaAsignadaMutation
>;
export const createTransaccion = /* GraphQL */ `mutation CreateTransaccion(
  $condition: ModelTransaccionConditionInput
  $input: CreateTransaccionInput!
) {
  createTransaccion(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTransaccionMutationVariables,
  APITypes.CreateTransaccionMutation
>;
export const createTransaccionesAnalizadas = /* GraphQL */ `mutation CreateTransaccionesAnalizadas(
  $condition: ModelTransaccionesAnalizadasConditionInput
  $input: CreateTransaccionesAnalizadasInput!
) {
  createTransaccionesAnalizadas(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTransaccionesAnalizadasMutationVariables,
  APITypes.CreateTransaccionesAnalizadasMutation
>;
export const deleteCategoria = /* GraphQL */ `mutation DeleteCategoria(
  $condition: ModelCategoriaConditionInput
  $input: DeleteCategoriaInput!
) {
  deleteCategoria(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteCategoriaMutationVariables,
  APITypes.DeleteCategoriaMutation
>;
export const deletePreferencia = /* GraphQL */ `mutation DeletePreferencia(
  $condition: ModelPreferenciaConditionInput
  $input: DeletePreferenciaInput!
) {
  deletePreferencia(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePreferenciaMutationVariables,
  APITypes.DeletePreferenciaMutation
>;
export const deletePreferenciaDeclarada = /* GraphQL */ `mutation DeletePreferenciaDeclarada(
  $condition: ModelPreferenciaDeclaradaConditionInput
  $input: DeletePreferenciaDeclaradaInput!
) {
  deletePreferenciaDeclarada(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePreferenciaDeclaradaMutationVariables,
  APITypes.DeletePreferenciaDeclaradaMutation
>;
export const deleteRecompensa = /* GraphQL */ `mutation DeleteRecompensa(
  $condition: ModelRecompensaConditionInput
  $input: DeleteRecompensaInput!
) {
  deleteRecompensa(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteRecompensaMutationVariables,
  APITypes.DeleteRecompensaMutation
>;
export const deleteRecompensaAsignada = /* GraphQL */ `mutation DeleteRecompensaAsignada(
  $condition: ModelRecompensaAsignadaConditionInput
  $input: DeleteRecompensaAsignadaInput!
) {
  deleteRecompensaAsignada(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteRecompensaAsignadaMutationVariables,
  APITypes.DeleteRecompensaAsignadaMutation
>;
export const deleteTransaccion = /* GraphQL */ `mutation DeleteTransaccion(
  $condition: ModelTransaccionConditionInput
  $input: DeleteTransaccionInput!
) {
  deleteTransaccion(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTransaccionMutationVariables,
  APITypes.DeleteTransaccionMutation
>;
export const deleteTransaccionesAnalizadas = /* GraphQL */ `mutation DeleteTransaccionesAnalizadas(
  $condition: ModelTransaccionesAnalizadasConditionInput
  $input: DeleteTransaccionesAnalizadasInput!
) {
  deleteTransaccionesAnalizadas(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTransaccionesAnalizadasMutationVariables,
  APITypes.DeleteTransaccionesAnalizadasMutation
>;
export const publishOrderFromEventBridge = /* GraphQL */ `mutation PublishOrderFromEventBridge(
  $message: String!
  $orderId: ID!
  $status: String!
) {
  publishOrderFromEventBridge(
    message: $message
    orderId: $orderId
    status: $status
  ) {
    message
    orderId
    status
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishOrderFromEventBridgeMutationVariables,
  APITypes.PublishOrderFromEventBridgeMutation
>;
export const publishOrderToEventBridge = /* GraphQL */ `mutation PublishOrderToEventBridge(
  $message: String!
  $orderId: ID!
  $status: String!
) {
  publishOrderToEventBridge(
    message: $message
    orderId: $orderId
    status: $status
  ) {
    message
    orderId
    status
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishOrderToEventBridgeMutationVariables,
  APITypes.PublishOrderToEventBridgeMutation
>;
export const updateCategoria = /* GraphQL */ `mutation UpdateCategoria(
  $condition: ModelCategoriaConditionInput
  $input: UpdateCategoriaInput!
) {
  updateCategoria(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateCategoriaMutationVariables,
  APITypes.UpdateCategoriaMutation
>;
export const updatePreferencia = /* GraphQL */ `mutation UpdatePreferencia(
  $condition: ModelPreferenciaConditionInput
  $input: UpdatePreferenciaInput!
) {
  updatePreferencia(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePreferenciaMutationVariables,
  APITypes.UpdatePreferenciaMutation
>;
export const updatePreferenciaDeclarada = /* GraphQL */ `mutation UpdatePreferenciaDeclarada(
  $condition: ModelPreferenciaDeclaradaConditionInput
  $input: UpdatePreferenciaDeclaradaInput!
) {
  updatePreferenciaDeclarada(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePreferenciaDeclaradaMutationVariables,
  APITypes.UpdatePreferenciaDeclaradaMutation
>;
export const updateRecompensa = /* GraphQL */ `mutation UpdateRecompensa(
  $condition: ModelRecompensaConditionInput
  $input: UpdateRecompensaInput!
) {
  updateRecompensa(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateRecompensaMutationVariables,
  APITypes.UpdateRecompensaMutation
>;
export const updateRecompensaAsignada = /* GraphQL */ `mutation UpdateRecompensaAsignada(
  $condition: ModelRecompensaAsignadaConditionInput
  $input: UpdateRecompensaAsignadaInput!
) {
  updateRecompensaAsignada(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateRecompensaAsignadaMutationVariables,
  APITypes.UpdateRecompensaAsignadaMutation
>;
export const updateTransaccion = /* GraphQL */ `mutation UpdateTransaccion(
  $condition: ModelTransaccionConditionInput
  $input: UpdateTransaccionInput!
) {
  updateTransaccion(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTransaccionMutationVariables,
  APITypes.UpdateTransaccionMutation
>;
export const updateTransaccionesAnalizadas = /* GraphQL */ `mutation UpdateTransaccionesAnalizadas(
  $condition: ModelTransaccionesAnalizadasConditionInput
  $input: UpdateTransaccionesAnalizadasInput!
) {
  updateTransaccionesAnalizadas(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTransaccionesAnalizadasMutationVariables,
  APITypes.UpdateTransaccionesAnalizadasMutation
>;
