import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export type RecompensaCategoria = { id: string, recompensaId: string, categoriaId: string };

const getAll = async (): Promise<RecompensaCategoria[]> => {
    const data = await client.models.RecompensaCategoria.list({
        selectionSet: ["recompensaId", "categoriaId", "id"],
    }) as { data: RecompensaCategoria[] };
    return data.data;
}

const get = async (id: string): Promise<RecompensaCategoria> => {
    try {
        const { data } = await client.models.RecompensaCategoria.get({ id });
        if (!data) {
            throw new Error("RecompensaCategoria not found");
        }
        return { id: data.id, recompensaId: data.recompensaId, categoriaId: data.categoriaId };
    } catch (error) {
        console.error("Error al obtener la RecompensaCategoria", error);
        throw error;
    }
}

const post = async (recompensaCategoria: RecompensaCategoria): Promise<RecompensaCategoria> => {
    const { errors, data: newRecompensaCategoria } = await client.models.RecompensaCategoria.create(recompensaCategoria);
    if (errors) {
        console.error("Error al crear la RecompensaCategoria", errors);
        throw new Error("Error al crear la RecompensaCategoria");
    }
    if (!newRecompensaCategoria) {
        throw new Error("Error al crear la RecompensaCategoria");
    }
    return { id: newRecompensaCategoria.id, recompensaId: newRecompensaCategoria.recompensaId, categoriaId: newRecompensaCategoria.categoriaId };
}

const put = async (recompensaCategoria: RecompensaCategoria) => {
    const { data: updatedRecompensaCategoria, errors } = await client.models.RecompensaCategoria.update(recompensaCategoria);
    if (errors) {
        console.error("Error al actualizar la RecompensaCategoria", errors);
        throw new Error("Error al actualizar la RecompensaCategoria");
    }
    return updatedRecompensaCategoria;
}

const del = async (id: string) => {
    const { data: deletedRecompensaCategoria, errors } = await client.models.RecompensaCategoria.delete({ id });
    if (errors) {
        console.error("Error al eliminar la RecompensaCategoria", errors);
        throw new Error("Error al eliminar la RecompensaCategoria");
    }
    return deletedRecompensaCategoria;
}

export default {
    getAll,
    get,
    post,
    put,
    del
}
