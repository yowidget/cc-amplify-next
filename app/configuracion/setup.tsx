import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import preferencias from "@/public/seeders/preferencias";
import categorias from "@/public/seeders/categorias";
import recompensas from "@/public/seeders/recompensas";
import recompensasCategorias from "@/public/seeders/recompensasCategorias";
import { uploadData, remove } from "aws-amplify/storage";

const client = generateClient<Schema>();

export default function Setup() {

    async function executeSeeders() {

        console.log("Ejecutando seeders...");

        // Objeto para almacenar los IDs de categorías creadas
        const categoriasIds: { [key: string]: string } = {}

        // Creación de categorías
        await Promise.all(
            categorias.map(async (item) => {
                try {
                    const { data, errors } = await client.models.Categoria.create({ nombre: item.nombre });
                    if (errors) {
                        console.log("Error creando categoria: ", errors);
                    } else {
                        console.log("Categoria creada: ", data);
                        categoriasIds[item.nombre] = data?.id || "";
                    }
                } catch (error) {
                    console.error("Error en la creación de categoria: ", error);
                }
            })
        );

        console.log("categoriasIds: ", categoriasIds);

        // Objeto para almacenar los IDs de preferencias creadas
        const preferenciasIds: { [key: string]: string } = {}

        // Creación de preferencias
        await Promise.all(
            preferencias.map(async (item) => {
                const categoriaId = categoriasIds[item.categoriaId] || "";
                if (!categoriaId) {
                    console.log(`Categoría no encontrada para la preferencia: ${item.nombre}`);
                    return;
                }
                try {
                    const { data, errors } = await client.models.Preferencia.create({ nombre: item.nombre, categoriaId: categoriaId });
                    if (errors) {
                        console.log("Error creando preferencia: ", errors);
                    } else {
                        console.log("Preferencia creada: ", data);
                        preferenciasIds[item.nombre] = data?.id || "";
                    }
                } catch (error) {
                    console.error("Error en la creación de preferencia: ", error);
                }
            })
        );

        console.log("Preferencias creadas: ", preferenciasIds);

        const recompensasIds: { [key: string]: string } = {}

        await Promise.all(
            recompensas.map(async (item) => {
                try {
                    // Creación de recompensa
                    const { data, errors } = await client.models.Recompensa.create({ nombre: item.nombre });
                    if (errors) {
                        console.log("Error creando recompensa: ", errors);
                        return;
                    }

                    console.log("Recompensa creada: ", data);
                    recompensasIds[item.nombre] = data?.id || "";

                    // Obtener la imagen desde la ruta
                    const response = await fetch("img/recompensas/" + item.img);
                    if (!response.ok) {
                        console.log("Error al obtener la imagen: ", response.statusText);
                        return;
                    }

                    console.log("src: ", response);
                    const blob = await response.blob();
                    const file = new File([blob], item.img, { type: "image/png" });

                    // Subir la imagen
                    const uploadResponse = await uploadData({
                        path: `images/${data?.id || ""}-${file.name}`,
                        data: file,
                        options: {
                            contentType: "image/png",
                        },
                    }).result;

                    if (!uploadResponse) {
                        console.log("Error subiendo la imagen: ", file.name);
                        return;
                    }

                    // Actualizar el registro de la recompensa con la ruta de la imagen
                    const updateResponse = await client.models.Recompensa.update({
                        id: data?.id || "",
                        img: uploadResponse.path,
                    });

                    console.log("Recompensa actualizada con imagen: ", updateResponse);

                } catch (error) {
                    console.error("Error en la creación o actualización de recompensa: ", error);
                }
            })
        );

        // Creación de RecompensasCategorias
        await Promise.all(
            recompensasCategorias.map(async (item) => {
                const categoriaId = categoriasIds[item.categoriaId] || "";
                if (!categoriaId) {
                    console.log(`Categoría no encontrada: ${item.categoriaId}`);
                    return;
                }
                const recompensaId = recompensasIds[item.recompensaId] || "";
                if (!recompensaId) {
                    console.log(`Recompensa no encontrada: ${item.recompensaId}`);
                    return;
                }
                try {
                    const { data, errors } = await client.models.RecompensaCategoria.create({ recompensaId: recompensaId, categoriaId: categoriaId });
                    if (errors) {
                        console.log("Error creando relacion RecompensasCategorias: ", errors);
                    } else {
                        console.log("Relacion RecompensasCategorias creada: ", data);
                    }
                } catch (error) {
                    console.error("Error en la creación de la relacion RecompensasCategorias: ", error);
                }
            })
        );


        //preuba de imagenes 

        // const response = await fetch(`img/recompensas/2x1_alimentos_bebidas.png`);

        // // Verificar que el tipo de contenido sea imagen
        // if (!response.ok || !response.headers.get('content-type')?.includes('image')) {
        //     console.error("Error al obtener la imagen o el archivo no es una imagen.");
        //     return;
        // }

        // const blob = await response.blob();
        // console.log("Blob: ", response);

        console.log("Seeders ejecutados");
        // onFinalize();

    }



    async function clearDatabase() {
        try {
            console.log("Eliminando datos...");
            // Paso 1: Eliminar todas las relaciones en RecompensaPreferencia
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
                if (recompensa?.img) {
                    await remove({ path: recompensa.img });
                }
                await client.models.Recompensa.delete({ id: recompensa.id });
            }

            const { data: categorias } = await client.models.Categoria.list();
            for (const categoria of categorias) {
                await client.models.Categoria.delete({ id: categoria.id });
            }

            const { data: recompensaCategorias } = await client.models.RecompensaCategoria.list();
            for (const recompensaCategoria of recompensaCategorias) {
                await client.models.RecompensaCategoria.delete({ id: recompensaCategoria.id });
            }

            const { data: recompensaPreferencias } = await client.models.RecompensaPreferencia.list();
            for (const recompensaPreferencia of recompensaPreferencias) {
                await client.models.RecompensaPreferencia.delete({ id: recompensaPreferencia.id });
            }

            console.log("Datos eliminados exitosamente.");
            // onFinalize();
        } catch (error) {
            console.error("Error al eliminar datos:", error);
        }
    }

    return (
        <div className={"p-5"}>

            <h1 className="text-2xl font-bold mb-4">Setup Config</h1>

            <button
                onClick={() => clearDatabase()}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Eliminar todo
            </button>
            <button
                onClick={() => executeSeeders()}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
            >
                Ejecutar seeders
            </button>
        </div>
    )




}