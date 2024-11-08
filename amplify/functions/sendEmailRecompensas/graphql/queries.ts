/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const clasificaConcepto = /* GraphQL */ `query ClasificaConcepto($concepto: String) {
  clasificaConcepto(concepto: $concepto)
}
` as GeneratedQuery<
  APITypes.ClasificaConceptoQueryVariables,
  APITypes.ClasificaConceptoQuery
>;
export const getCategoria = /* GraphQL */ `query GetCategoria($id: ID!) {
  getCategoria(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetCategoriaQueryVariables,
  APITypes.GetCategoriaQuery
>;
export const getPreferencia = /* GraphQL */ `query GetPreferencia($id: ID!) {
  getPreferencia(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPreferenciaQueryVariables,
  APITypes.GetPreferenciaQuery
>;
export const getPreferenciaDeclarada = /* GraphQL */ `query GetPreferenciaDeclarada($id: ID!) {
  getPreferenciaDeclarada(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPreferenciaDeclaradaQueryVariables,
  APITypes.GetPreferenciaDeclaradaQuery
>;
export const getRecompensa = /* GraphQL */ `query GetRecompensa($id: ID!) {
  getRecompensa(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetRecompensaQueryVariables,
  APITypes.GetRecompensaQuery
>;
export const getRecompensaAsignada = /* GraphQL */ `query GetRecompensaAsignada($id: ID!) {
  getRecompensaAsignada(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetRecompensaAsignadaQueryVariables,
  APITypes.GetRecompensaAsignadaQuery
>;
export const getTransaccion = /* GraphQL */ `query GetTransaccion($id: ID!) {
  getTransaccion(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetTransaccionQueryVariables,
  APITypes.GetTransaccionQuery
>;
export const getTransaccionesAnalizadas = /* GraphQL */ `query GetTransaccionesAnalizadas($id: ID!) {
  getTransaccionesAnalizadas(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetTransaccionesAnalizadasQueryVariables,
  APITypes.GetTransaccionesAnalizadasQuery
>;
export const listCategorias = /* GraphQL */ `query ListCategorias(
  $filter: ModelCategoriaFilterInput
  $limit: Int
  $nextToken: String
) {
  listCategorias(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCategoriasQueryVariables,
  APITypes.ListCategoriasQuery
>;
export const listPreferenciaDeclaradas = /* GraphQL */ `query ListPreferenciaDeclaradas(
  $filter: ModelPreferenciaDeclaradaFilterInput
  $limit: Int
  $nextToken: String
) {
  listPreferenciaDeclaradas(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      categoriaId
      createdAt
      id
      nombre
      owner
      preferenciaId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPreferenciaDeclaradasQueryVariables,
  APITypes.ListPreferenciaDeclaradasQuery
>;
export const listPreferencias = /* GraphQL */ `query ListPreferencias(
  $filter: ModelPreferenciaFilterInput
  $limit: Int
  $nextToken: String
) {
  listPreferencias(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      categoriaId
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPreferenciasQueryVariables,
  APITypes.ListPreferenciasQuery
>;
export const listRecompensaAsignadas = /* GraphQL */ `query ListRecompensaAsignadas(
  $filter: ModelRecompensaAsignadaFilterInput
  $limit: Int
  $nextToken: String
) {
  listRecompensaAsignadas(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      categoriaId
      createdAt
      id
      nombre
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRecompensaAsignadasQueryVariables,
  APITypes.ListRecompensaAsignadasQuery
>;
export const listRecompensas = /* GraphQL */ `query ListRecompensas(
  $filter: ModelRecompensaFilterInput
  $limit: Int
  $nextToken: String
) {
  listRecompensas(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      categoriaId
      createdAt
      id
      nombre
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRecompensasQueryVariables,
  APITypes.ListRecompensasQuery
>;
export const listTransaccionesAnalizadas = /* GraphQL */ `query ListTransaccionesAnalizadas(
  $filter: ModelTransaccionesAnalizadasFilterInput
  $limit: Int
  $nextToken: String
) {
  listTransaccionesAnalizadas(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      categoriaId
      concepto
      createdAt
      id
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTransaccionesAnalizadasQueryVariables,
  APITypes.ListTransaccionesAnalizadasQuery
>;
export const listTransaccions = /* GraphQL */ `query ListTransaccions(
  $filter: ModelTransaccionFilterInput
  $limit: Int
  $nextToken: String
) {
  listTransaccions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      categoriaId
      concepto
      createdAt
      id
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTransaccionsQueryVariables,
  APITypes.ListTransaccionsQuery
>;
export const sayHello = /* GraphQL */ `query SayHello($name: String) {
  sayHello(name: $name)
}
` as GeneratedQuery<APITypes.SayHelloQueryVariables, APITypes.SayHelloQuery>;
