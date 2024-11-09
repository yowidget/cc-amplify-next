import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export type Categoria = { id: string, nombre: string };

const getAll = async (): Promise<Categoria[]> => {
    const data = await client.models.Categoria.list({
        selectionSet: ["nombre", "id"],
    }) as { data: Categoria[] };
    return data.data;
}

const get = async (id: string): Promise<Categoria> => {
    try {
        const { data } = await client.models.Categoria.get({ id });
        if (!data) {
            throw new Error("Categoria not found");
        }
        return { id: data.id, nombre: data.nombre };
    } catch (error) {
        console.error("Error al obtener la categoria", error);
        throw error;
    }
}

const post = async (categoria: Categoria): Promise<Categoria> => {
    const { errors, data: newTodo } = await client.models.Categoria.create(categoria)
    if (errors) {
        console.error("Error al crear la categoria", errors);
        throw new Error("Error al crear la categoria");
    }
    if (!newTodo) {
        throw new Error("Error al crear la categoria");
    }
    return { id: newTodo.id, nombre: newTodo.nombre };
}   

const put = async (categoria:Categoria ) => {
    const { data: updatedTodo, errors } = await client.models.Categoria.update(categoria);
    if (errors) {
        console.error("Error al actualizar la categoria", errors);
        throw new Error("Error al actualizar la categoria");
    }
    return updatedTodo;
}

const del = async (id: string) => {
    const { data: deletedTodo, errors } = await client.models.Categoria.delete({id});
    if (errors) {
        console.error("Error al eliminar la categoria", errors);
        throw new Error("Error al eliminar la categoria");
    }
    return deletedTodo;
}

export default {
    getAll,
    get,
    post,
    put,
    del
}
