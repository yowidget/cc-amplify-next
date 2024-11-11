import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default async function getRecompensasSugeridas() {
    const preferencias = (await client.models.PreferenciaDeclarada.list({
        selectionSet: ["categoria.nombre", "nombre", "categoriaId", "id"],
    })) as {
        data: Array<{
            id: string;
            categoriaId: string;
            nombre: string;
            categoria: {
                nombre: string;
            };
        }>;
    };

    if (preferencias.data.length > 0) {
        const categoriasIds = preferencias.data
            .map((preferencia) => preferencia.categoriaId)
            .filter((id): id is string => id !== null);

        const recompensasIds = (await Promise.all(
            categoriasIds.map(async (id) => {
                const { data, errors } = await client.models.RecompensaCategoria.list({ filter: { categoriaId: { eq: id } } });
                if (errors) throw console.error("Error al obtener RecompensaCategoria", errors);
                const recompensasIds = data.map((recompensaCategoria) => {
                    return recompensaCategoria.recompensaId
                });
                return recompensasIds;
            })
        )).flat();

        // Usamos un Map para eliminar duplicados
        const recompensasIdsUnicos = Array.from(new Map(recompensasIds.map(id => [id, true])).keys());
        // console.log("Recompensas id unicos: ", recompensasIdsUnicos);

        const recompensas = await Promise.all(recompensasIdsUnicos.map(async (recompensaId) => {
            const { data } = await client.models.Recompensa.get({ id: recompensaId || "" });
            return { id: data?.id || '', nombre: data?.nombre || '', img: data?.img || '' }
        }))

        return recompensas
    }
};