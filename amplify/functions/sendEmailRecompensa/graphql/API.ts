/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Categoria = {
  __typename: "Categoria",
  createdAt: string,
  id: string,
  nombre?: string | null,
  preferencias?: ModelPreferenciaConnection | null,
  preferenciasDeclaradas?: ModelPreferenciaDeclaradaConnection | null,
  recompensas?: ModelRecompensaConnection | null,
  recompensasAsignadas?: ModelRecompensaAsignadaConnection | null,
  transacciones?: ModelTransaccionConnection | null,
  transaccionesAnalizadas?: ModelTransaccionesAnalizadasConnection | null,
  updatedAt: string,
};

export type ModelPreferenciaConnection = {
  __typename: "ModelPreferenciaConnection",
  items:  Array<Preferencia | null >,
  nextToken?: string | null,
};

export type Preferencia = {
  __typename: "Preferencia",
  categoria?: Categoria | null,
  categoriaId?: string | null,
  createdAt: string,
  id: string,
  nombre?: string | null,
  updatedAt: string,
};

export type ModelPreferenciaDeclaradaConnection = {
  __typename: "ModelPreferenciaDeclaradaConnection",
  items:  Array<PreferenciaDeclarada | null >,
  nextToken?: string | null,
};

export type PreferenciaDeclarada = {
  __typename: "PreferenciaDeclarada",
  categoria?: Categoria | null,
  categoriaId?: string | null,
  createdAt: string,
  id: string,
  nombre?: string | null,
  owner?: string | null,
  preferenciaId?: string | null,
  updatedAt: string,
};

export type ModelRecompensaConnection = {
  __typename: "ModelRecompensaConnection",
  items:  Array<Recompensa | null >,
  nextToken?: string | null,
};

export type Recompensa = {
  __typename: "Recompensa",
  categoria?: Categoria | null,
  categoriaId?: string | null,
  createdAt: string,
  id: string,
  location?: RecompensaLocation | null,
  nombre?: string | null,
  updatedAt: string,
};

export type RecompensaLocation = {
  __typename: "RecompensaLocation",
  lat: number,
  long: number,
};

export type ModelRecompensaAsignadaConnection = {
  __typename: "ModelRecompensaAsignadaConnection",
  items:  Array<RecompensaAsignada | null >,
  nextToken?: string | null,
};

export type RecompensaAsignada = {
  __typename: "RecompensaAsignada",
  categoria?: Categoria | null,
  categoriaId?: string | null,
  createdAt: string,
  id: string,
  location?: RecompensaAsignadaLocation | null,
  nombre?: string | null,
  owner?: string | null,
  updatedAt: string,
};

export type RecompensaAsignadaLocation = {
  __typename: "RecompensaAsignadaLocation",
  lat: number,
  long: number,
};

export type ModelTransaccionConnection = {
  __typename: "ModelTransaccionConnection",
  items:  Array<Transaccion | null >,
  nextToken?: string | null,
};

export type Transaccion = {
  __typename: "Transaccion",
  categoria?: Categoria | null,
  categoriaId?: string | null,
  concepto?: string | null,
  createdAt: string,
  id: string,
  location?: TransaccionLocation | null,
  owner?: string | null,
  updatedAt: string,
};

export type TransaccionLocation = {
  __typename: "TransaccionLocation",
  lat: number,
  long: number,
};

export type ModelTransaccionesAnalizadasConnection = {
  __typename: "ModelTransaccionesAnalizadasConnection",
  items:  Array<TransaccionesAnalizadas | null >,
  nextToken?: string | null,
};

export type TransaccionesAnalizadas = {
  __typename: "TransaccionesAnalizadas",
  categoria?: Categoria | null,
  categoriaId?: string | null,
  concepto?: string | null,
  createdAt: string,
  id: string,
  updatedAt: string,
};

export type ModelCategoriaFilterInput = {
  and?: Array< ModelCategoriaFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  nombre?: ModelStringInput | null,
  not?: ModelCategoriaFilterInput | null,
  or?: Array< ModelCategoriaFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelCategoriaConnection = {
  __typename: "ModelCategoriaConnection",
  items:  Array<Categoria | null >,
  nextToken?: string | null,
};

export type ModelPreferenciaDeclaradaFilterInput = {
  and?: Array< ModelPreferenciaDeclaradaFilterInput | null > | null,
  categoriaId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  nombre?: ModelStringInput | null,
  not?: ModelPreferenciaDeclaradaFilterInput | null,
  or?: Array< ModelPreferenciaDeclaradaFilterInput | null > | null,
  owner?: ModelStringInput | null,
  preferenciaId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPreferenciaFilterInput = {
  and?: Array< ModelPreferenciaFilterInput | null > | null,
  categoriaId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  nombre?: ModelStringInput | null,
  not?: ModelPreferenciaFilterInput | null,
  or?: Array< ModelPreferenciaFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelRecompensaAsignadaFilterInput = {
  and?: Array< ModelRecompensaAsignadaFilterInput | null > | null,
  categoriaId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  nombre?: ModelStringInput | null,
  not?: ModelRecompensaAsignadaFilterInput | null,
  or?: Array< ModelRecompensaAsignadaFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelRecompensaFilterInput = {
  and?: Array< ModelRecompensaFilterInput | null > | null,
  categoriaId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  nombre?: ModelStringInput | null,
  not?: ModelRecompensaFilterInput | null,
  or?: Array< ModelRecompensaFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelTransaccionesAnalizadasFilterInput = {
  and?: Array< ModelTransaccionesAnalizadasFilterInput | null > | null,
  categoriaId?: ModelIDInput | null,
  concepto?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelTransaccionesAnalizadasFilterInput | null,
  or?: Array< ModelTransaccionesAnalizadasFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelTransaccionFilterInput = {
  and?: Array< ModelTransaccionFilterInput | null > | null,
  categoriaId?: ModelIDInput | null,
  concepto?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelTransaccionFilterInput | null,
  or?: Array< ModelTransaccionFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelCategoriaConditionInput = {
  and?: Array< ModelCategoriaConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  nombre?: ModelStringInput | null,
  not?: ModelCategoriaConditionInput | null,
  or?: Array< ModelCategoriaConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCategoriaInput = {
  id?: string | null,
  nombre?: string | null,
};

export type ModelPreferenciaConditionInput = {
  and?: Array< ModelPreferenciaConditionInput | null > | null,
  categoriaId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  nombre?: ModelStringInput | null,
  not?: ModelPreferenciaConditionInput | null,
  or?: Array< ModelPreferenciaConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePreferenciaInput = {
  categoriaId?: string | null,
  id?: string | null,
  nombre?: string | null,
};

export type ModelPreferenciaDeclaradaConditionInput = {
  and?: Array< ModelPreferenciaDeclaradaConditionInput | null > | null,
  categoriaId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  nombre?: ModelStringInput | null,
  not?: ModelPreferenciaDeclaradaConditionInput | null,
  or?: Array< ModelPreferenciaDeclaradaConditionInput | null > | null,
  owner?: ModelStringInput | null,
  preferenciaId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePreferenciaDeclaradaInput = {
  categoriaId?: string | null,
  id?: string | null,
  nombre?: string | null,
  preferenciaId?: string | null,
};

export type ModelRecompensaConditionInput = {
  and?: Array< ModelRecompensaConditionInput | null > | null,
  categoriaId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  nombre?: ModelStringInput | null,
  not?: ModelRecompensaConditionInput | null,
  or?: Array< ModelRecompensaConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateRecompensaInput = {
  categoriaId?: string | null,
  id?: string | null,
  location?: RecompensaLocationInput | null,
  nombre?: string | null,
};

export type RecompensaLocationInput = {
  lat: number,
  long: number,
};

export type ModelRecompensaAsignadaConditionInput = {
  and?: Array< ModelRecompensaAsignadaConditionInput | null > | null,
  categoriaId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  nombre?: ModelStringInput | null,
  not?: ModelRecompensaAsignadaConditionInput | null,
  or?: Array< ModelRecompensaAsignadaConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateRecompensaAsignadaInput = {
  categoriaId?: string | null,
  id?: string | null,
  location?: RecompensaAsignadaLocationInput | null,
  nombre?: string | null,
};

export type RecompensaAsignadaLocationInput = {
  lat: number,
  long: number,
};

export type ModelTransaccionConditionInput = {
  and?: Array< ModelTransaccionConditionInput | null > | null,
  categoriaId?: ModelIDInput | null,
  concepto?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelTransaccionConditionInput | null,
  or?: Array< ModelTransaccionConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTransaccionInput = {
  categoriaId?: string | null,
  concepto?: string | null,
  id?: string | null,
  location?: TransaccionLocationInput | null,
};

export type TransaccionLocationInput = {
  lat: number,
  long: number,
};

export type ModelTransaccionesAnalizadasConditionInput = {
  and?: Array< ModelTransaccionesAnalizadasConditionInput | null > | null,
  categoriaId?: ModelIDInput | null,
  concepto?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelTransaccionesAnalizadasConditionInput | null,
  or?: Array< ModelTransaccionesAnalizadasConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTransaccionesAnalizadasInput = {
  categoriaId?: string | null,
  concepto?: string | null,
  id?: string | null,
};

export type DeleteCategoriaInput = {
  id: string,
};

export type DeletePreferenciaInput = {
  id: string,
};

export type DeletePreferenciaDeclaradaInput = {
  id: string,
};

export type DeleteRecompensaInput = {
  id: string,
};

export type DeleteRecompensaAsignadaInput = {
  id: string,
};

export type DeleteTransaccionInput = {
  id: string,
};

export type DeleteTransaccionesAnalizadasInput = {
  id: string,
};

export type OrderStatusChange = {
  __typename: "OrderStatusChange",
  message: string,
  orderId: string,
  status: OrderStatus,
};

export enum OrderStatus {
  OrderDelivered = "OrderDelivered",
  OrderPending = "OrderPending",
  OrderShipped = "OrderShipped",
}


export type UpdateCategoriaInput = {
  id: string,
  nombre?: string | null,
};

export type UpdatePreferenciaInput = {
  categoriaId?: string | null,
  id: string,
  nombre?: string | null,
};

export type UpdatePreferenciaDeclaradaInput = {
  categoriaId?: string | null,
  id: string,
  nombre?: string | null,
  preferenciaId?: string | null,
};

export type UpdateRecompensaInput = {
  categoriaId?: string | null,
  id: string,
  location?: RecompensaLocationInput | null,
  nombre?: string | null,
};

export type UpdateRecompensaAsignadaInput = {
  categoriaId?: string | null,
  id: string,
  location?: RecompensaAsignadaLocationInput | null,
  nombre?: string | null,
};

export type UpdateTransaccionInput = {
  categoriaId?: string | null,
  concepto?: string | null,
  id: string,
  location?: TransaccionLocationInput | null,
};

export type UpdateTransaccionesAnalizadasInput = {
  categoriaId?: string | null,
  concepto?: string | null,
  id: string,
};

export type ModelSubscriptionCategoriaFilterInput = {
  and?: Array< ModelSubscriptionCategoriaFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  nombre?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionCategoriaFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionPreferenciaFilterInput = {
  and?: Array< ModelSubscriptionPreferenciaFilterInput | null > | null,
  categoriaId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  nombre?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPreferenciaFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPreferenciaDeclaradaFilterInput = {
  and?: Array< ModelSubscriptionPreferenciaDeclaradaFilterInput | null > | null,
  categoriaId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  nombre?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPreferenciaDeclaradaFilterInput | null > | null,
  owner?: ModelStringInput | null,
  preferenciaId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionRecompensaFilterInput = {
  and?: Array< ModelSubscriptionRecompensaFilterInput | null > | null,
  categoriaId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  nombre?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionRecompensaFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionRecompensaAsignadaFilterInput = {
  and?: Array< ModelSubscriptionRecompensaAsignadaFilterInput | null > | null,
  categoriaId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  nombre?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionRecompensaAsignadaFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionTransaccionFilterInput = {
  and?: Array< ModelSubscriptionTransaccionFilterInput | null > | null,
  categoriaId?: ModelSubscriptionIDInput | null,
  concepto?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionTransaccionFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionTransaccionesAnalizadasFilterInput = {
  and?: Array< ModelSubscriptionTransaccionesAnalizadasFilterInput | null > | null,
  categoriaId?: ModelSubscriptionIDInput | null,
  concepto?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionTransaccionesAnalizadasFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ClasificaConceptoQueryVariables = {
  concepto?: string | null,
};

export type ClasificaConceptoQuery = {
  clasificaConcepto?: string | null,
};

export type GetCategoriaQueryVariables = {
  id: string,
};

export type GetCategoriaQuery = {
  getCategoria?:  {
    __typename: "Categoria",
    createdAt: string,
    id: string,
    nombre?: string | null,
    preferencias?:  {
      __typename: "ModelPreferenciaConnection",
      nextToken?: string | null,
    } | null,
    preferenciasDeclaradas?:  {
      __typename: "ModelPreferenciaDeclaradaConnection",
      nextToken?: string | null,
    } | null,
    recompensas?:  {
      __typename: "ModelRecompensaConnection",
      nextToken?: string | null,
    } | null,
    recompensasAsignadas?:  {
      __typename: "ModelRecompensaAsignadaConnection",
      nextToken?: string | null,
    } | null,
    transacciones?:  {
      __typename: "ModelTransaccionConnection",
      nextToken?: string | null,
    } | null,
    transaccionesAnalizadas?:  {
      __typename: "ModelTransaccionesAnalizadasConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetPreferenciaQueryVariables = {
  id: string,
};

export type GetPreferenciaQuery = {
  getPreferencia?:  {
    __typename: "Preferencia",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type GetPreferenciaDeclaradaQueryVariables = {
  id: string,
};

export type GetPreferenciaDeclaradaQuery = {
  getPreferenciaDeclarada?:  {
    __typename: "PreferenciaDeclarada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    owner?: string | null,
    preferenciaId?: string | null,
    updatedAt: string,
  } | null,
};

export type GetRecompensaQueryVariables = {
  id: string,
};

export type GetRecompensaQuery = {
  getRecompensa?:  {
    __typename: "Recompensa",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type GetRecompensaAsignadaQueryVariables = {
  id: string,
};

export type GetRecompensaAsignadaQuery = {
  getRecompensaAsignada?:  {
    __typename: "RecompensaAsignada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaAsignadaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetTransaccionQueryVariables = {
  id: string,
};

export type GetTransaccionQuery = {
  getTransaccion?:  {
    __typename: "Transaccion",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "TransaccionLocation",
      lat: number,
      long: number,
    } | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetTransaccionesAnalizadasQueryVariables = {
  id: string,
};

export type GetTransaccionesAnalizadasQuery = {
  getTransaccionesAnalizadas?:  {
    __typename: "TransaccionesAnalizadas",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type ListCategoriasQueryVariables = {
  filter?: ModelCategoriaFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCategoriasQuery = {
  listCategorias?:  {
    __typename: "ModelCategoriaConnection",
    items:  Array< {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPreferenciaDeclaradasQueryVariables = {
  filter?: ModelPreferenciaDeclaradaFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPreferenciaDeclaradasQuery = {
  listPreferenciaDeclaradas?:  {
    __typename: "ModelPreferenciaDeclaradaConnection",
    items:  Array< {
      __typename: "PreferenciaDeclarada",
      categoriaId?: string | null,
      createdAt: string,
      id: string,
      nombre?: string | null,
      owner?: string | null,
      preferenciaId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPreferenciasQueryVariables = {
  filter?: ModelPreferenciaFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPreferenciasQuery = {
  listPreferencias?:  {
    __typename: "ModelPreferenciaConnection",
    items:  Array< {
      __typename: "Preferencia",
      categoriaId?: string | null,
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListRecompensaAsignadasQueryVariables = {
  filter?: ModelRecompensaAsignadaFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListRecompensaAsignadasQuery = {
  listRecompensaAsignadas?:  {
    __typename: "ModelRecompensaAsignadaConnection",
    items:  Array< {
      __typename: "RecompensaAsignada",
      categoriaId?: string | null,
      createdAt: string,
      id: string,
      nombre?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListRecompensasQueryVariables = {
  filter?: ModelRecompensaFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListRecompensasQuery = {
  listRecompensas?:  {
    __typename: "ModelRecompensaConnection",
    items:  Array< {
      __typename: "Recompensa",
      categoriaId?: string | null,
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTransaccionesAnalizadasQueryVariables = {
  filter?: ModelTransaccionesAnalizadasFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTransaccionesAnalizadasQuery = {
  listTransaccionesAnalizadas?:  {
    __typename: "ModelTransaccionesAnalizadasConnection",
    items:  Array< {
      __typename: "TransaccionesAnalizadas",
      categoriaId?: string | null,
      concepto?: string | null,
      createdAt: string,
      id: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTransaccionsQueryVariables = {
  filter?: ModelTransaccionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTransaccionsQuery = {
  listTransaccions?:  {
    __typename: "ModelTransaccionConnection",
    items:  Array< {
      __typename: "Transaccion",
      categoriaId?: string | null,
      concepto?: string | null,
      createdAt: string,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SayHelloQueryVariables = {
  name?: string | null,
};

export type SayHelloQuery = {
  sayHello?: string | null,
};

export type CreateCategoriaMutationVariables = {
  condition?: ModelCategoriaConditionInput | null,
  input: CreateCategoriaInput,
};

export type CreateCategoriaMutation = {
  createCategoria?:  {
    __typename: "Categoria",
    createdAt: string,
    id: string,
    nombre?: string | null,
    preferencias?:  {
      __typename: "ModelPreferenciaConnection",
      nextToken?: string | null,
    } | null,
    preferenciasDeclaradas?:  {
      __typename: "ModelPreferenciaDeclaradaConnection",
      nextToken?: string | null,
    } | null,
    recompensas?:  {
      __typename: "ModelRecompensaConnection",
      nextToken?: string | null,
    } | null,
    recompensasAsignadas?:  {
      __typename: "ModelRecompensaAsignadaConnection",
      nextToken?: string | null,
    } | null,
    transacciones?:  {
      __typename: "ModelTransaccionConnection",
      nextToken?: string | null,
    } | null,
    transaccionesAnalizadas?:  {
      __typename: "ModelTransaccionesAnalizadasConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreatePreferenciaMutationVariables = {
  condition?: ModelPreferenciaConditionInput | null,
  input: CreatePreferenciaInput,
};

export type CreatePreferenciaMutation = {
  createPreferencia?:  {
    __typename: "Preferencia",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type CreatePreferenciaDeclaradaMutationVariables = {
  condition?: ModelPreferenciaDeclaradaConditionInput | null,
  input: CreatePreferenciaDeclaradaInput,
};

export type CreatePreferenciaDeclaradaMutation = {
  createPreferenciaDeclarada?:  {
    __typename: "PreferenciaDeclarada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    owner?: string | null,
    preferenciaId?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateRecompensaMutationVariables = {
  condition?: ModelRecompensaConditionInput | null,
  input: CreateRecompensaInput,
};

export type CreateRecompensaMutation = {
  createRecompensa?:  {
    __typename: "Recompensa",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateRecompensaAsignadaMutationVariables = {
  condition?: ModelRecompensaAsignadaConditionInput | null,
  input: CreateRecompensaAsignadaInput,
};

export type CreateRecompensaAsignadaMutation = {
  createRecompensaAsignada?:  {
    __typename: "RecompensaAsignada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaAsignadaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateTransaccionMutationVariables = {
  condition?: ModelTransaccionConditionInput | null,
  input: CreateTransaccionInput,
};

export type CreateTransaccionMutation = {
  createTransaccion?:  {
    __typename: "Transaccion",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "TransaccionLocation",
      lat: number,
      long: number,
    } | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateTransaccionesAnalizadasMutationVariables = {
  condition?: ModelTransaccionesAnalizadasConditionInput | null,
  input: CreateTransaccionesAnalizadasInput,
};

export type CreateTransaccionesAnalizadasMutation = {
  createTransaccionesAnalizadas?:  {
    __typename: "TransaccionesAnalizadas",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type DeleteCategoriaMutationVariables = {
  condition?: ModelCategoriaConditionInput | null,
  input: DeleteCategoriaInput,
};

export type DeleteCategoriaMutation = {
  deleteCategoria?:  {
    __typename: "Categoria",
    createdAt: string,
    id: string,
    nombre?: string | null,
    preferencias?:  {
      __typename: "ModelPreferenciaConnection",
      nextToken?: string | null,
    } | null,
    preferenciasDeclaradas?:  {
      __typename: "ModelPreferenciaDeclaradaConnection",
      nextToken?: string | null,
    } | null,
    recompensas?:  {
      __typename: "ModelRecompensaConnection",
      nextToken?: string | null,
    } | null,
    recompensasAsignadas?:  {
      __typename: "ModelRecompensaAsignadaConnection",
      nextToken?: string | null,
    } | null,
    transacciones?:  {
      __typename: "ModelTransaccionConnection",
      nextToken?: string | null,
    } | null,
    transaccionesAnalizadas?:  {
      __typename: "ModelTransaccionesAnalizadasConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeletePreferenciaMutationVariables = {
  condition?: ModelPreferenciaConditionInput | null,
  input: DeletePreferenciaInput,
};

export type DeletePreferenciaMutation = {
  deletePreferencia?:  {
    __typename: "Preferencia",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type DeletePreferenciaDeclaradaMutationVariables = {
  condition?: ModelPreferenciaDeclaradaConditionInput | null,
  input: DeletePreferenciaDeclaradaInput,
};

export type DeletePreferenciaDeclaradaMutation = {
  deletePreferenciaDeclarada?:  {
    __typename: "PreferenciaDeclarada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    owner?: string | null,
    preferenciaId?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteRecompensaMutationVariables = {
  condition?: ModelRecompensaConditionInput | null,
  input: DeleteRecompensaInput,
};

export type DeleteRecompensaMutation = {
  deleteRecompensa?:  {
    __typename: "Recompensa",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteRecompensaAsignadaMutationVariables = {
  condition?: ModelRecompensaAsignadaConditionInput | null,
  input: DeleteRecompensaAsignadaInput,
};

export type DeleteRecompensaAsignadaMutation = {
  deleteRecompensaAsignada?:  {
    __typename: "RecompensaAsignada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaAsignadaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteTransaccionMutationVariables = {
  condition?: ModelTransaccionConditionInput | null,
  input: DeleteTransaccionInput,
};

export type DeleteTransaccionMutation = {
  deleteTransaccion?:  {
    __typename: "Transaccion",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "TransaccionLocation",
      lat: number,
      long: number,
    } | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteTransaccionesAnalizadasMutationVariables = {
  condition?: ModelTransaccionesAnalizadasConditionInput | null,
  input: DeleteTransaccionesAnalizadasInput,
};

export type DeleteTransaccionesAnalizadasMutation = {
  deleteTransaccionesAnalizadas?:  {
    __typename: "TransaccionesAnalizadas",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type PublishOrderFromEventBridgeMutationVariables = {
  message: string,
  orderId: string,
  status: string,
};

export type PublishOrderFromEventBridgeMutation = {
  publishOrderFromEventBridge?:  {
    __typename: "OrderStatusChange",
    message: string,
    orderId: string,
    status: OrderStatus,
  } | null,
};

export type PublishOrderToEventBridgeMutationVariables = {
  message: string,
  orderId: string,
  status: string,
};

export type PublishOrderToEventBridgeMutation = {
  publishOrderToEventBridge?:  {
    __typename: "OrderStatusChange",
    message: string,
    orderId: string,
    status: OrderStatus,
  } | null,
};

export type UpdateCategoriaMutationVariables = {
  condition?: ModelCategoriaConditionInput | null,
  input: UpdateCategoriaInput,
};

export type UpdateCategoriaMutation = {
  updateCategoria?:  {
    __typename: "Categoria",
    createdAt: string,
    id: string,
    nombre?: string | null,
    preferencias?:  {
      __typename: "ModelPreferenciaConnection",
      nextToken?: string | null,
    } | null,
    preferenciasDeclaradas?:  {
      __typename: "ModelPreferenciaDeclaradaConnection",
      nextToken?: string | null,
    } | null,
    recompensas?:  {
      __typename: "ModelRecompensaConnection",
      nextToken?: string | null,
    } | null,
    recompensasAsignadas?:  {
      __typename: "ModelRecompensaAsignadaConnection",
      nextToken?: string | null,
    } | null,
    transacciones?:  {
      __typename: "ModelTransaccionConnection",
      nextToken?: string | null,
    } | null,
    transaccionesAnalizadas?:  {
      __typename: "ModelTransaccionesAnalizadasConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdatePreferenciaMutationVariables = {
  condition?: ModelPreferenciaConditionInput | null,
  input: UpdatePreferenciaInput,
};

export type UpdatePreferenciaMutation = {
  updatePreferencia?:  {
    __typename: "Preferencia",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdatePreferenciaDeclaradaMutationVariables = {
  condition?: ModelPreferenciaDeclaradaConditionInput | null,
  input: UpdatePreferenciaDeclaradaInput,
};

export type UpdatePreferenciaDeclaradaMutation = {
  updatePreferenciaDeclarada?:  {
    __typename: "PreferenciaDeclarada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    owner?: string | null,
    preferenciaId?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateRecompensaMutationVariables = {
  condition?: ModelRecompensaConditionInput | null,
  input: UpdateRecompensaInput,
};

export type UpdateRecompensaMutation = {
  updateRecompensa?:  {
    __typename: "Recompensa",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateRecompensaAsignadaMutationVariables = {
  condition?: ModelRecompensaAsignadaConditionInput | null,
  input: UpdateRecompensaAsignadaInput,
};

export type UpdateRecompensaAsignadaMutation = {
  updateRecompensaAsignada?:  {
    __typename: "RecompensaAsignada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaAsignadaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateTransaccionMutationVariables = {
  condition?: ModelTransaccionConditionInput | null,
  input: UpdateTransaccionInput,
};

export type UpdateTransaccionMutation = {
  updateTransaccion?:  {
    __typename: "Transaccion",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "TransaccionLocation",
      lat: number,
      long: number,
    } | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateTransaccionesAnalizadasMutationVariables = {
  condition?: ModelTransaccionesAnalizadasConditionInput | null,
  input: UpdateTransaccionesAnalizadasInput,
};

export type UpdateTransaccionesAnalizadasMutation = {
  updateTransaccionesAnalizadas?:  {
    __typename: "TransaccionesAnalizadas",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCategoriaSubscriptionVariables = {
  filter?: ModelSubscriptionCategoriaFilterInput | null,
};

export type OnCreateCategoriaSubscription = {
  onCreateCategoria?:  {
    __typename: "Categoria",
    createdAt: string,
    id: string,
    nombre?: string | null,
    preferencias?:  {
      __typename: "ModelPreferenciaConnection",
      nextToken?: string | null,
    } | null,
    preferenciasDeclaradas?:  {
      __typename: "ModelPreferenciaDeclaradaConnection",
      nextToken?: string | null,
    } | null,
    recompensas?:  {
      __typename: "ModelRecompensaConnection",
      nextToken?: string | null,
    } | null,
    recompensasAsignadas?:  {
      __typename: "ModelRecompensaAsignadaConnection",
      nextToken?: string | null,
    } | null,
    transacciones?:  {
      __typename: "ModelTransaccionConnection",
      nextToken?: string | null,
    } | null,
    transaccionesAnalizadas?:  {
      __typename: "ModelTransaccionesAnalizadasConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePreferenciaSubscriptionVariables = {
  filter?: ModelSubscriptionPreferenciaFilterInput | null,
};

export type OnCreatePreferenciaSubscription = {
  onCreatePreferencia?:  {
    __typename: "Preferencia",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePreferenciaDeclaradaSubscriptionVariables = {
  filter?: ModelSubscriptionPreferenciaDeclaradaFilterInput | null,
  owner?: string | null,
};

export type OnCreatePreferenciaDeclaradaSubscription = {
  onCreatePreferenciaDeclarada?:  {
    __typename: "PreferenciaDeclarada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    owner?: string | null,
    preferenciaId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateRecompensaSubscriptionVariables = {
  filter?: ModelSubscriptionRecompensaFilterInput | null,
};

export type OnCreateRecompensaSubscription = {
  onCreateRecompensa?:  {
    __typename: "Recompensa",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateRecompensaAsignadaSubscriptionVariables = {
  filter?: ModelSubscriptionRecompensaAsignadaFilterInput | null,
  owner?: string | null,
};

export type OnCreateRecompensaAsignadaSubscription = {
  onCreateRecompensaAsignada?:  {
    __typename: "RecompensaAsignada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaAsignadaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateTransaccionSubscriptionVariables = {
  filter?: ModelSubscriptionTransaccionFilterInput | null,
  owner?: string | null,
};

export type OnCreateTransaccionSubscription = {
  onCreateTransaccion?:  {
    __typename: "Transaccion",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "TransaccionLocation",
      lat: number,
      long: number,
    } | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateTransaccionesAnalizadasSubscriptionVariables = {
  filter?: ModelSubscriptionTransaccionesAnalizadasFilterInput | null,
};

export type OnCreateTransaccionesAnalizadasSubscription = {
  onCreateTransaccionesAnalizadas?:  {
    __typename: "TransaccionesAnalizadas",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCategoriaSubscriptionVariables = {
  filter?: ModelSubscriptionCategoriaFilterInput | null,
};

export type OnDeleteCategoriaSubscription = {
  onDeleteCategoria?:  {
    __typename: "Categoria",
    createdAt: string,
    id: string,
    nombre?: string | null,
    preferencias?:  {
      __typename: "ModelPreferenciaConnection",
      nextToken?: string | null,
    } | null,
    preferenciasDeclaradas?:  {
      __typename: "ModelPreferenciaDeclaradaConnection",
      nextToken?: string | null,
    } | null,
    recompensas?:  {
      __typename: "ModelRecompensaConnection",
      nextToken?: string | null,
    } | null,
    recompensasAsignadas?:  {
      __typename: "ModelRecompensaAsignadaConnection",
      nextToken?: string | null,
    } | null,
    transacciones?:  {
      __typename: "ModelTransaccionConnection",
      nextToken?: string | null,
    } | null,
    transaccionesAnalizadas?:  {
      __typename: "ModelTransaccionesAnalizadasConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePreferenciaSubscriptionVariables = {
  filter?: ModelSubscriptionPreferenciaFilterInput | null,
};

export type OnDeletePreferenciaSubscription = {
  onDeletePreferencia?:  {
    __typename: "Preferencia",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePreferenciaDeclaradaSubscriptionVariables = {
  filter?: ModelSubscriptionPreferenciaDeclaradaFilterInput | null,
  owner?: string | null,
};

export type OnDeletePreferenciaDeclaradaSubscription = {
  onDeletePreferenciaDeclarada?:  {
    __typename: "PreferenciaDeclarada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    owner?: string | null,
    preferenciaId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteRecompensaSubscriptionVariables = {
  filter?: ModelSubscriptionRecompensaFilterInput | null,
};

export type OnDeleteRecompensaSubscription = {
  onDeleteRecompensa?:  {
    __typename: "Recompensa",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteRecompensaAsignadaSubscriptionVariables = {
  filter?: ModelSubscriptionRecompensaAsignadaFilterInput | null,
  owner?: string | null,
};

export type OnDeleteRecompensaAsignadaSubscription = {
  onDeleteRecompensaAsignada?:  {
    __typename: "RecompensaAsignada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaAsignadaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteTransaccionSubscriptionVariables = {
  filter?: ModelSubscriptionTransaccionFilterInput | null,
  owner?: string | null,
};

export type OnDeleteTransaccionSubscription = {
  onDeleteTransaccion?:  {
    __typename: "Transaccion",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "TransaccionLocation",
      lat: number,
      long: number,
    } | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteTransaccionesAnalizadasSubscriptionVariables = {
  filter?: ModelSubscriptionTransaccionesAnalizadasFilterInput | null,
};

export type OnDeleteTransaccionesAnalizadasSubscription = {
  onDeleteTransaccionesAnalizadas?:  {
    __typename: "TransaccionesAnalizadas",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnOrderStatusChangeSubscriptionVariables = {
};

export type OnOrderStatusChangeSubscription = {
  onOrderStatusChange?:  {
    __typename: "OrderStatusChange",
    message: string,
    orderId: string,
    status: OrderStatus,
  } | null,
};

export type OnUpdateCategoriaSubscriptionVariables = {
  filter?: ModelSubscriptionCategoriaFilterInput | null,
};

export type OnUpdateCategoriaSubscription = {
  onUpdateCategoria?:  {
    __typename: "Categoria",
    createdAt: string,
    id: string,
    nombre?: string | null,
    preferencias?:  {
      __typename: "ModelPreferenciaConnection",
      nextToken?: string | null,
    } | null,
    preferenciasDeclaradas?:  {
      __typename: "ModelPreferenciaDeclaradaConnection",
      nextToken?: string | null,
    } | null,
    recompensas?:  {
      __typename: "ModelRecompensaConnection",
      nextToken?: string | null,
    } | null,
    recompensasAsignadas?:  {
      __typename: "ModelRecompensaAsignadaConnection",
      nextToken?: string | null,
    } | null,
    transacciones?:  {
      __typename: "ModelTransaccionConnection",
      nextToken?: string | null,
    } | null,
    transaccionesAnalizadas?:  {
      __typename: "ModelTransaccionesAnalizadasConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePreferenciaSubscriptionVariables = {
  filter?: ModelSubscriptionPreferenciaFilterInput | null,
};

export type OnUpdatePreferenciaSubscription = {
  onUpdatePreferencia?:  {
    __typename: "Preferencia",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePreferenciaDeclaradaSubscriptionVariables = {
  filter?: ModelSubscriptionPreferenciaDeclaradaFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePreferenciaDeclaradaSubscription = {
  onUpdatePreferenciaDeclarada?:  {
    __typename: "PreferenciaDeclarada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    nombre?: string | null,
    owner?: string | null,
    preferenciaId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateRecompensaSubscriptionVariables = {
  filter?: ModelSubscriptionRecompensaFilterInput | null,
};

export type OnUpdateRecompensaSubscription = {
  onUpdateRecompensa?:  {
    __typename: "Recompensa",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateRecompensaAsignadaSubscriptionVariables = {
  filter?: ModelSubscriptionRecompensaAsignadaFilterInput | null,
  owner?: string | null,
};

export type OnUpdateRecompensaAsignadaSubscription = {
  onUpdateRecompensaAsignada?:  {
    __typename: "RecompensaAsignada",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "RecompensaAsignadaLocation",
      lat: number,
      long: number,
    } | null,
    nombre?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateTransaccionSubscriptionVariables = {
  filter?: ModelSubscriptionTransaccionFilterInput | null,
  owner?: string | null,
};

export type OnUpdateTransaccionSubscription = {
  onUpdateTransaccion?:  {
    __typename: "Transaccion",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    location?:  {
      __typename: "TransaccionLocation",
      lat: number,
      long: number,
    } | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateTransaccionesAnalizadasSubscriptionVariables = {
  filter?: ModelSubscriptionTransaccionesAnalizadasFilterInput | null,
};

export type OnUpdateTransaccionesAnalizadasSubscription = {
  onUpdateTransaccionesAnalizadas?:  {
    __typename: "TransaccionesAnalizadas",
    categoria?:  {
      __typename: "Categoria",
      createdAt: string,
      id: string,
      nombre?: string | null,
      updatedAt: string,
    } | null,
    categoriaId?: string | null,
    concepto?: string | null,
    createdAt: string,
    id: string,
    updatedAt: string,
  } | null,
};
