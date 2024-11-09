import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { Preferencia } from "./preferencias";

const client = generateClient<Schema>();

export type PreferenciaDeclarada = { id: string, nombre: string, preferencia: Preferencia };

const getAll = async (): Promise<PreferenciaDeclarada[]> => {
    const data = await client.models.PreferenciaDeclarada.list({
        selectionSet: ["nombre", "id", "preferencia.id", "preferencia.nombre", "preferencia.categoria.id", "preferencia.categoria.nombre"],
    }) as { data: PreferenciaDeclarada[] };
    return data.data;
};

const get = async (id: string): Promise<PreferenciaDeclarada> => {
    try {
        const { data } = await client.models.PreferenciaDeclarada.get({ id });
        if (!data) {
            throw new Error("PreferenciaDeclarada not found");
        }
        const preferencia = data.preferencia();
        const categoria = (await preferencia).data?.categoria();

        return {
            id: data.id,
            nombre: data.nombre,
            preferencia: {
                id: (await preferencia).data?.id ?? "",
                nombre: (await preferencia).data?.nombre ?? "",
                categoria: {
                    id: (await categoria)?.data?.id ?? "",
                    nombre: (await categoria)?.data?.nombre ?? ""
                }
            }
        };
    } catch (error) {
        console.error("Error al obtener la preferencia declarada", error);
        throw error;
    }
};

const post = async (preferenciaDeclarada: Schema["PreferenciaDeclarada"]["type"]): Promise<PreferenciaDeclarada> => {
    const { errors, data: newPreferenciaDeclarada } = await client.models.PreferenciaDeclarada.create({
        nombre: preferenciaDeclarada.nombre,
        preferenciaId: preferenciaDeclarada.preferenciaId
    });
    if (errors) {
        console.error("Error al crear la preferencia declarada", errors);
        throw new Error("Error al crear la preferencia declarada");
    }
    if (!newPreferenciaDeclarada) {
        throw new Error("Error al crear la preferencia declarada");
    }
    const preferencia = newPreferenciaDeclarada.preferencia();
    const categoria = (await preferencia).data?.categoria();

    return {
        id: newPreferenciaDeclarada.id,
        nombre: newPreferenciaDeclarada.nombre,
        preferencia: {
            id: (await preferencia).data?.id ?? "",
            nombre: (await preferencia).data?.nombre ?? "",
            categoria: {
                id: (await categoria)?.data?.id ?? "",
                nombre: (await categoria)?.data?.nombre ?? ""
            }
        }
    };
};

const put = async (preferenciaDeclarada: Schema["PreferenciaDeclarada"]["type"]) => {
    const { data: updatedPreferenciaDeclarada, errors } = await client.models.PreferenciaDeclarada.update(preferenciaDeclarada);
    if (errors) {
        console.error("Error al actualizar la preferencia declarada", errors);
        throw new Error("Error al actualizar la preferencia declarada");
    }
    return updatedPreferenciaDeclarada;
};

const del = async (id: string) => {
    const { data: deletedPreferenciaDeclarada, errors } = await client.models.PreferenciaDeclarada.delete({ id });
    if (errors) {
        console.error("Error al eliminar la preferencia declarada", errors);
        throw new Error("Error al eliminar la preferencia declarada");
    }
    return deletedPreferenciaDeclarada;
};

export default {
    getAll,
    get,
    post,
    put,
    del
};
