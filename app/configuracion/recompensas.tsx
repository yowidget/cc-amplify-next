"use client";

import { Nullable } from "@aws-amplify/data-schema";
import { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { uploadData, getUrl } from "aws-amplify/storage";

const client = generateClient<Schema>();



// Tipos para la recompensa y categoría
interface Recompensa {
    id: string;
    nombre: Nullable<string>;
    detalles: Nullable<string>;
    categoria: {
        nombre: string;
        id: string;
        createdAt: string;
        updatedAt: string;
    };
    img?: string;
}

export default function Recompensas() {
    const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
    // const [recompensaInput, setRecompensaInput] = useState<string>("");
    const [categorias, setCategorias] = useState<Array<Schema["Categoria"]["type"]>>([]);

    //File constants
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);


    // Función para listar categorías
    function listCategorias() {
        try {
            const subscription = client.models.Categoria.observeQuery().subscribe({
                next: (data) => setCategorias([...data.items]),
            });
            console.log("Categorías listadas", categorias);
            return subscription;
        } catch (e) {
            console.error("Error al listar las categorías", e);
        }
    }



    // Función para cargar recompensas
    function loadRecompensas() {
        client.models.Recompensa.list({
            selectionSet: ["id", "nombre", "detalles", "categoria.*", "img"],
        }).then(({ data, errors }) => {
            if (errors) throw console.error("Error al obtener las recompensas", errors);
            setRecompensas(data as Recompensa[]);
        });
    }

    // Función para cambiar la categoría de una recompensa
    function handleRecompensaCategoriaChange(id: string, categoriaId: string) {
        client.models.Recompensa.update({ id, categoriaId })
            .then(() => {
                console.log(`Recompensa ${id} actualizada con la categoría ${categoriaId}`);
            })
            .catch((e) => console.error(`Error al actualizar la recompensa ${id}`, e));
    }

    // Función para eliminar recompensa
    function handleEliminarRecompensa(id: string) {
        client.models.Recompensa.delete({ id }).then(() => loadRecompensas());
    }


    function CreateRecompensa() {

        const [recompensaName, setRecompensaName] = useState<string>("");
        const [recompensaDetails, setRecompensaDetails] = useState<string>("");

        // Función para crear recompensa desde el input
        function createRecompensaFromInput() {
            if (!file) return alert("Debes seleccionar una imagen");

            client.models.Recompensa.create({ nombre: recompensaName, detalles: recompensaDetails })
                .then(async ({ data: recompensa }) => {
                    if (recompensa) {
                        console.log(`Recompensa ${recompensa.nombre} creada`);

                        const result = await uploadData({
                            path: `images/${recompensa.id}-${file.name}`,
                            data: file,
                            options: { contentType: "image/png" },
                        }).result;

                        await client.models.Recompensa.update({
                            id: recompensa.id,
                            img: result?.path,
                        });
                    }
                })
                .catch((e) => {
                    console.error(`Error al crear la recompensa ${recompensaName}`, e);
                }).finally(() => {
                    loadRecompensas();
                    setRecompensaName("");
                    setRecompensaDetails("");
                });

        }

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files ? event.target.files[0] : null;
            if (selectedFile) setFile(selectedFile);
        };

        return (
            <div>
                <h2>Agregar recompensas</h2>
                <input
                    type="text"
                    value={recompensaName}
                    onChange={(e) => setRecompensaName(e.target.value)}
                />
                <textarea
                    placeholder={"Ingresa los detalles de la recompensa"}
                    value={recompensaDetails}
                    onChange={(e) => setRecompensaDetails(e.target.value)}
                    style={{ width: "100%", height: "100px", marginBottom: "10px" }}
                />
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button onClick={() => createRecompensaFromInput()} disabled={!recompensaDetails.trim()}>
                    Crear
                </button>
            </div>
        );
    }

    useEffect(() => {
        loadRecompensas();
        listCategorias();
    }, []);



    // Propiedades de cada recompensa
    interface RecompensaItemProps {
        recompensa: Recompensa;
    }

    // Componente de elemento de recompensa
    const RecompensaItem = ({ recompensa }: RecompensaItemProps) => {
        const [url, setURL] = useState<string>("");

        useEffect(() => {
            getUrl({ path: recompensa.img || "" }).then((result) => {
                setURL(result?.url?.href || "");
            });
        }, [recompensa.img]);


        return (
            <div className="flex items-center p-4 bg-white rounded-lg shadow-md mb-4">
                <div className="w-full">
                    <h2 className="text-xl font-bold text-gray-800">{recompensa.nombre}</h2>
                    <p className="text-gray-600 mb-2">{recompensa.detalles}</p>
                    <img className="w-24 h-24 object-cover rounded-md mb-2" src={url} alt="Imagen almacenada" />
                    <button
                        onClick={() => handleEliminarRecompensa(recompensa.id)}
                        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors duration-200"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        );
    };

    return (
        <section
            style={{
                flex: 1,
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "8px",
                marginTop: "20px",
            }}
        >
            <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}>
                    <CreateRecompensa />
                </div>
            </div>
            <h3>Recompensas existentes:</h3>
            <ul style={{ backgroundColor: 'white' }}>
                {recompensas.map((recompensa) => (
                    <RecompensaItem key={recompensa.id} recompensa={recompensa} />
                ))}
            </ul>
        </section>
    );
}
