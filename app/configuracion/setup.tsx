import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import preferencias from "@/public/seeders/preferencias";
import categorias from "@/public/seeders/categorias";
import recompensas from "@/public/seeders/recompensas";
import recompensasPreferencias from "@/public/seeders/recompensasPreferencias";
import { uploadData } from "aws-amplify/storage";

const client = generateClient<Schema>();

export default function Setup() {

    async function executeSeeders() {

        console.log("Ejecutando seeders...");

        const categoriasIds: { [key: string]: string } = {}
        Promise.all(
            categorias.map((item) => {
                client.models.Categoria.create({ nombre: item.nombre }).then(({ data, errors }) => {
                    if (errors) console.log("Error creando categoria: ", errors);
                    console.log("Categoria creada: ", data);
                    categoriasIds[item.nombre] = data?.id || "";
                });
            })
        )

        const preferenciasIds: { [key: string]: string } = {}

        Promise.all(
            preferencias.map((item) => {

                const categoriaId = categoriasIds[item.categoriaId] || "";

                client.models.Preferencia.create({ nombre: item.nombre, categoriaId: categoriaId }).then(({ data, errors }) => {
                    if (errors) console.log("Error creando preferencia: ", errors);
                    console.log("Preferencia creada: ", data);
                    preferenciasIds[item.nombre] = data?.id || "";
                });
            })
        )

        Promise.all(
            recompensas.map((item) => {

                client.models.Recompensa.create({ nombre: item.nombre }).then(async ({ data, errors }) => {
                    if (errors) console.log("Error creando recompensa: ", errors);

                    const response = await fetch("@/public/img/recompensas/" + item.img);
                    const blob = await response.blob();
                    const file = new File([blob], item.img, { type: "image/png" });
                    const result = await uploadData({
                        path: `images/${data?.id || ""}-${file.name}`,
                        data: file,
                        options: {
                            contentType: "image/png",
                        },
                    }).result;

                    const updateResponse = await client.models.Recompensa.update({
                        id: data?.id || "",
                        img: result?.path,
                    });

                    console.log("Recompensa creada: ", updateResponse);

                });
            })
        )

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
            // Paso 1: Eliminar todas las relaciones en RecompensaPreferencia
            // const { data: recompensaPreferencias } = await client.models.RecompensaPreferencia.list();
            // for (const recompensaPreferencia of recompensaPreferencias) {
            //     await client.models.RecompensaPreferencia.delete({ id: recompensaPreferencia.id });
            // }

            // Paso 2: Eliminar registros dependientes
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

            // Paso 3: Eliminar el modelo principal (Categoria)
            const { data: categorias } = await client.models.Categoria.list();
            for (const categoria of categorias) {
                await client.models.Categoria.delete({ id: categoria.id });
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