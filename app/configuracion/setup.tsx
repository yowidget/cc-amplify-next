import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import preferencias from "@/public/seeders/preferencias";
import categorias from "@/public/seeders/categorias";
import recompensas from "@/public/seeders/recompensas";
import recompensasCategorias from "@/public/seeders/recompensasCategorias";


const client = generateClient<Schema>();

export default function Setup() {

    async function executeSeeders() {

        console.log("Ejecutando seeders...");

        const categoriaIdMap: { [key: string]: string } = {};

        await Promise.all(
            categorias.map(async (item) => {
                try {
                    const { data, errors } = await client.models.Categoria.create({ nombre: item.nombre });
                    if (errors) {
                        console.log("Error creando categoria: ", errors);
                    } else {
                        console.log("Categoria creada: ", data);
                        if (data) {
                            categoriaIdMap[item.id] = data.id;
                        }
                    }
                } catch (error) {
                    console.error("Error en la creación de categorías: ", error);
                }
            })
        );

        const preferenciasIdMap: { [key: string]: string } = {};

        await Promise.all(
            preferencias.map(async (item) => {
                try {
                    const categoriaId = categoriaIdMap[item.categoriaId];
                    if (categoriaId) {
                        const { data, errors } = await client.models.Preferencia.create({
                            nombre: item.nombre,
                            categoriaId: categoriaId
                        });
                        if (errors) {
                            console.log("Error creando preferencia: ", errors);
                        } else {
                            console.log("Preferencia creada: ", data);

                            if (data) {
                                preferenciasIdMap[item.nombre] = data.id;
                            }
                        }
                    } else {
                        console.log(`No se encontró una categoría para el tag: ${item.categoriaId}`);
                    }
                } catch (error) {
                    console.error("Error en la creación de preferencias: ", error);
                }
            })
        );

        const recompensasIdMap: { [key: string]: string } = {};

        await Promise.all(
            recompensas.map(async (item) => {
                try {
                    const { data, errors } = await client.models.Recompensa.create({
                        nombre: item.nombre
                    });
                    if (errors) {
                        console.log("Error creando recompensa: ", errors);
                    } else {
                        console.log("Recompensa creada: ", data);
                        if (data) {
                            recompensasIdMap[item.nombre] = data.id;
                        }
                    }
                } catch (error) {
                    console.error("Error en la creación de recompensas: ", error);
                }
            })
        );

        console.log("recompensasIdMap", recompensasIdMap);

        await Promise.all(
            recompensasCategorias.map(async (item) => {
                try {
                    const recompensaId = recompensasIdMap[item.recompensaId];
                    const categoriaId = categoriaIdMap[item.categoriaId];
                    if (recompensaId && categoriaId) {
                        const { data, errors } = await client.models.RecompensaCategoria.create({
                            recompensaId: recompensaId,
                            categoriaId: categoriaId
                        });
                        if (errors) {
                            console.log("Error creando recompensa: ", errors);
                        } else {
                            console.log("RecompensaCategoria creada: ", data);
                        }
                    } else {
                        if (!recompensaId) {
                            console.log(`No se encontró una recompensa para el tag: ${item.recompensaId}`);
                        } else {

                            console.log(`No se encontró una categoría para el tag: ${item.categoriaId}`);


                        }
                    }
                } catch (error) {
                    console.error("Error en la creación de recompensas: ", error);
                }
            })
        );

        // recompensas.map((item) => {
        //     client.models.Recompensa.create({ id: item.id, nombre: item.nombre }).then(({ data, errors }) => {
        //         if (errors) console.log("Error creando recompensa: ", errors);
        //         console.log("Recompensa creada: ", data);
        //     });
        // })

        // recompensasPreferencias.map((item) => {
        //     client.models.RecompensaPreferencia.create({ id: item.id, preferenciaId: item.preferenciaId, recompensaId: item.recompensaId }).then(({ data, errors }) => {
        //         if (errors) console.log("Error creando recompensa-preferencia: ", errors);
        //         console.log("Recompensa-preferencia creada: ", data);
        //     });
        // })



        console.log("Seeders ejecutados");

    }



    async function clearDatabase() {
        try {
            console.log("Eliminando datos...");
            // const { data: recompensaPreferencias } = await client.models.RecompensaPreferencia.list();
            // for (const recompensaPreferencia of recompensaPreferencias) {
            //     await client.models.RecompensaPreferencia.delete({ id: recompensaPreferencia.id });
            // }

            const { data: transacciones } = await client.models.Transaccion.list();
            for (const transaccion of transacciones) {
                await client.models.Transaccion.delete({ id: transaccion.id });
            }



            const { data: preferencias } = await client.models.Preferencia.list();
            for (const preferencia of preferencias) {
                await client.models.Preferencia.delete({ id: preferencia.id });
            }

            const { data: preferenciasDeclaradas } = await client.models.PreferenciaDeclarada.list();
            for (const preferenciaDeclarada of preferenciasDeclaradas) {
                await client.models.PreferenciaDeclarada.delete({ id: preferenciaDeclarada.id });
            }

            const { data: recompensas } = await client.models.Recompensa.list();
            for (const recompensa of recompensas) {
                await client.models.Recompensa.delete({ id: recompensa.id });
            }

            const { data: categorias } = await client.models.Categoria.list();
            for (const categoria of categorias) {
                await client.models.Categoria.delete({ id: categoria.id });
            }

            const { data: recompensaCategorias } = await client.models.RecompensaCategoria.list();
            for (const recompensaCategoria of recompensaCategorias) {
                await client.models.Categoria.delete({ id: recompensaCategoria.id });
            }

            console.log("Datos eliminados exitosamente.");
        } catch (error) {
            console.error("Error al eliminar datos:", error);
        }
    }

    return (
        <div>
            <h1>Setup config</h1>

            <button onClick={() => clearDatabase()}>Eliminar todo</button>
            <button onClick={() => executeSeeders()}>Ejecutar seeders</button>
        </div>
    )




}