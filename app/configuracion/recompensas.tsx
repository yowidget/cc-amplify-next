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


    const CreateRecompensa: React.FC = () => {
        const [recompensaName, setRecompensaName] = useState("");
        const [recompensaDetails, setRecompensaDetails] = useState("");
        const [file, setFile] = useState<File | null>(null); // Estado para el archivo
        const [imagePreview, setImagePreview] = useState<string>("");
    
        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files ? event.target.files[0] : null;
            if (selectedFile) {
                setFile(selectedFile);
                setImagePreview(URL.createObjectURL(selectedFile));
            }
        };
    
        async function createRecompensaFromInput() {
            if (!file) return alert("Debes seleccionar una imagen");
    
            try {
                const { data: recompensa } = await client.models.Recompensa.create({
                    nombre: recompensaName,
                    detalles: recompensaDetails,
                });
    
                if (recompensa) {
                    console.log(`Recompensa ${recompensa.nombre} creada`);
    
                    const result = await uploadData({
                        path: `images/${recompensa.id}-${file.name}`,
                        data: file,
                        options: { contentType: file.type },
                    }).result;
    
                    await client.models.Recompensa.update({
                        id: recompensa.id,
                        img: result?.path,
                    });
                }
            } catch (error) {
                console.error(`Error al crear la recompensa ${recompensaName}`, error);
            } finally {
                loadRecompensas();
                setRecompensaName("");
                setRecompensaDetails("");
                setFile(null); // Resetea el archivo
                setImagePreview(""); // Borra la vista previa
            }
        }
    
        return (
            <div className="p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Agregar Recompensas</h2>
                <input
                    type="text"
                    value={recompensaName}
                    onChange={(e) => setRecompensaName(e.target.value)}
                    placeholder="Nombre de la recompensa"
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <textarea
                    placeholder="Ingresa los detalles de la recompensa"
                    value={recompensaDetails}
                    onChange={(e) => setRecompensaDetails(e.target.value)}
                    className="w-full p-2 h-24 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-4 text-sm"
                />
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Vista previa de la imagen"
                        className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                )}
                <button
                    onClick={createRecompensaFromInput}
                    disabled={!recompensaDetails.trim()}
                    className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-300"
                >
                    Crear
                </button>
            </div>
        );
    };

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
            <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                {/* Imagen */}
                <img className="w-full h-48 object-cover" src={url} alt="Imagen almacenada" />

                {/* Contenido de la tarjeta */}
                <div className="p-4">
                    {/* Título */}
                    <h2 className="text-2xl font-semibold text-gray-800">{recompensa.nombre}</h2>

                    {/* Descripción */}
                    <p className="text-gray-600 mt-2 mb-4">{recompensa.detalles}</p>

                    {/* Botón Eliminar */}
                    <button
                        onClick={() => handleEliminarRecompensa(recompensa.id)}
                        className="w-full py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors duration-200"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        );
    };

    return (
        <section className="flex-1 border border-gray-300 p-6 rounded-lg mt-8 bg-gray-50">
            <div className="mb-8">
                <div className="w-full lg:w-1/2">
                    <CreateRecompensa />
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Recompensas existentes:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recompensas.map((recompensa) => (
                        <li key={recompensa.id}>
                            <RecompensaItem recompensa={recompensa} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
