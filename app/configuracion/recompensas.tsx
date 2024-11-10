"use client";

import { Nullable } from "@aws-amplify/data-schema";
import { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { uploadData, getUrl } from "aws-amplify/storage";

const client = generateClient<Schema>();

// Propiedades del área de entrada
interface InputAreaProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: () => void;
    disabled: boolean;
}

// Componente de área de entrada
function InputArea({
    label,
    placeholder,
    value,
    onChange,
    onSubmit,
    disabled,
}: InputAreaProps) {
    return (
        <div>
            <h2>{label}</h2>
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={{ width: "100%", height: "100px", marginBottom: "10px" }}
            />
            <button onClick={onSubmit} disabled={disabled}>
                Crear
            </button>
        </div>
    );
}

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
    const [recompensaInput, setRecompensaInput] = useState<string>("");
    const [categorias, setCategorias] = useState<Array<Schema["Categoria"]["type"]>>([]);
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

    // Función para crear recompensa desde el input
    async function createRecompensaFromInput() {
        if (!file) return alert("Debes seleccionar una imagen");
        const recompensasArray = recompensaInput
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        try {
            recompensasArray.forEach((recompensa) => {
                client.models.Recompensa.create({ nombre: recompensa })
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
                            console.log("Recompensa con imagen actualizada");
                        }
                    })
                    .catch((e) => {
                        console.error(`Error al crear la recompensa ${recompensa}`, e);
                    });
            });
            setRecompensaInput("");
            loadRecompensas();
        } catch (e) {
            console.error("Error al crear las recompensas", e);
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

    useEffect(() => {
        loadRecompensas();
        listCategorias();
    }, []);

    // Función para manejar el cambio de archivo
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) setFile(selectedFile);
    };

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
            <div style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ width: "100%" }}>
                    <h2>{recompensa.nombre}</h2>
                    <img width={"100px"} src={url} alt="Imagen almacenada" />
                    <button onClick={() => handleEliminarRecompensa(recompensa.id)}>
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
                    <InputArea
                        label="Agregar Recompensas"
                        placeholder="Ingresa las recompensas separadas por coma"
                        value={recompensaInput}
                        onChange={(e) => setRecompensaInput(e.target.value)}
                        onSubmit={createRecompensaFromInput}
                        disabled={!recompensaInput.trim()}
                    />
                </div>
                <div style={{ width: "50%" }}>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
            </div>
            <h3>Recompensas existentes:</h3>
            <ul>
                {recompensas.map((recompensa) => (
                    <RecompensaItem key={recompensa.id} recompensa={recompensa} />
                ))}
            </ul>
        </section>
    );
}
