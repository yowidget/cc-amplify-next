

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { Categoria } from "./categorias";

const client = generateClient<Schema>();

export type Preferencia = { id: string, nombre: string, categoria: Categoria};

const getAll = async (): Promise<Preferencia[]> => {
    const data = await client.models.Preferencia.list({
        selectionSet: ["nombre", "id", "categoria.id", "categoria.nombre"],
    }) as { data: Preferencia[] };
    return data.data;
};

const get = async (id: string): Promise<Preferencia> => {
    try {
        const { data } = await client.models.Preferencia.get({ id });
        if (!data) {
            throw new Error("Preferencia not found");
        }
        const categoria = data.categoria()
        return {
            id: data.id,
            nombre: data.nombre,
            categoria: {
                id: (await categoria).data?.id ?? "",
                nombre: (await categoria).data?.nombre ?? ""
            }
        };
    } catch (error) {
        console.error("Error al obtener la preferencia", error);
        throw error;
    }
};

const post = async (preferencia: {"Schema["Preferencia"]["type"]"}): Promise<Preferencia> => {
    const { errors, data: newPreferencia } = await client.models.Preferencia.create({
        id: preferencia.id,
        nombre: preferencia.nombre,
        categoriaId: preferencia.categoriaId
    });
    if (errors) {
        console.error("Error al crear la preferencia", errors);
        throw new Error("Error al crear la preferencia");
    }
    if (!newPreferencia) {
        throw new Error("Error al crear la preferencia");
    }
    return {
        id: newPreferencia.id,
        nombre: newPreferencia.nombre,
        categoria: {
            id: (await newPreferencia.categoria()).data?.id ?? "",
            nombre: (await newPreferencia.categoria()).data?.nombre ?? ""
        }
    };
};
 
const put = async (preferencia: Schema["Preferencia"]["type"]) => {
    const { data: updatedPreferencia, errors } = await client.models.Preferencia.update(preferencia);
    if (errors) {
        console.error("Error al actualizar la preferencia", errors);
        throw new Error("Error al actualizar la preferencia");
    }
    return updatedPreferencia;
};

const del = async (id: string) => {
    const { data: deletedPreferencia, errors } = await client.models.Preferencia.delete({ id });
    if (errors) {
        console.error("Error al eliminar la preferencia", errors);
        throw new Error("Error al eliminar la preferencia");
    }
    return deletedPreferencia;
};

export default {
    getAll,
    get,
    post,
    put,
    del
};
