"use client";
import { Nullable } from "@aws-amplify/data-schema";
import { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { uploadData, getUrl } from "aws-amplify/storage";

const client = generateClient<Schema>();


interface InputAreaProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: () => void;
    disabled: boolean;
}


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

export default function Recompensas() {

    const [recompensas, setRecompensas] = useState<
        {
            id: string;
            nombre: Nullable<string>;
            detalles: Nullable<string>;
            categoria: {
                nombre: string; id: string; createdAt: string; updatedAt: string;

            }
            img?: string;
        }[]
    >([]);
    const [recompensaInput, setRecompensaInput] = useState<string>("");
    const [categorias, setCategorias] = useState<
        Array<Schema["Categoria"]["type"]>
    >([]);

    //Files
    const [file, setFile] = useState<File>();
    const [uploading, setUploading] = useState(false);

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

    async function createRecompensaFromInput() {
        if (!file) return alert("Debes seleccionar una imagen");
        const recompensasArray = recompensaInput
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        try {
            recompensasArray.map((recompensa) => {
                client.models.Recompensa.create({
                    nombre: recompensa,
                }).then(async ({ data: recompensa }) => {
                    if (recompensa) {
                        console.log(`Recompensa ${recompensa} creada`);

                        const result = await uploadData({
                            path: `images/${recompensa.id}-${file.name}`,
                            data: file,
                            options: {
                                contentType: "image/png"
                            }
                        }).result

                        client.models.Recompensa.update({
                            id: recompensa.id,
                            img: result?.path,
                        }).then((recompensaConImagen) => {
                            console.log("Recompensa con imagen", recompensaConImagen);
                        });


                    }


                }).catch((e) => {
                    console.error(`Error al crear la recompensa ${recompensa}`, e);
                });
            });
            setRecompensaInput("");
            loadRecompensas();
        } catch (e) {
            console.error("Error al crear las recompensas", e);
        }
    }

    function loadRecompensas() {
        client.models.Recompensa.list(
            { selectionSet: ['id', 'nombre', 'detalles', 'categoria.*', 'img'] }
        ).then(({ data, errors }) => {
            if (errors) throw console.error("Error al obtener las recompensas", errors);
        
            setRecompensas(data);
        });
    }

    function handleRecompensaCategoriaChange(id: string, categoriaId: string) {
        console.log(`Actualizando recompensa ${id} con la categoría ${categoriaId}`);

        client.models.Recompensa.update({
            id,
            categoriaId,
        })
            .then(() => {
                console.log(
                    `Recompensa ${id} actualizada con la categoría ${categoriaId}`
                );
            })
            .catch((e) => {
                console.error(`Error al actualizar la recompensa ${id}`, e);
            });
    }

    function handleElminiarRecompensa(id: string) {
        client.models.Recompensa.delete({ id: id }).then(() => loadRecompensas());
    }

    useEffect(() => {
        loadRecompensas();
        listCategorias();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    interface RecompensaItemProps {
        id: string;
        nombre: Nullable<string>;
        detalles: Nullable<string>;
        categoria: {
            nombre: string; id: string; createdAt: string; updatedAt: string;

        }
        img: string;
    }

    const RecompensaItem = ({ recompensa }: { recompensa: RecompensaItemProps }) => {
        const [url, setURL] = useState<string>('');

        getUrl({ path: recompensa.img }).then((url) => {
            setURL(url.url.href)
        });

        return (
            <div style={{display: 'flex'}}>
                <div style={{ width: '100%' }}>
                    <h2>{recompensa.nombre}</h2>
                    <img width={"100px"} src={url} alt="Imagen almacenada" />
                    <button onClick={() => handleElminiarRecompensa(recompensa.id)}>Eliminar</button>
                </div>
            </div>
        )
    }


    const recompensasList = () => {

        return (
            <div>

            </div>
        )
    }

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
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                    <InputArea
                        label="Agregar Recompensas"
                        placeholder="Ingresa las recompensas separadas por coma"
                        value={recompensaInput}
                        onChange={(e) => setRecompensaInput(e.target.value)}
                        onSubmit={createRecompensaFromInput}
                        disabled={!recompensaInput.trim()}
                    />
                </div>
                <div style={{ width: '50%' }}>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
            </div>
            <InputArea
                label="Agregar Recompensas"
                placeholder="Ingresa las recompensas separadas por coma"
                value={recompensaInput}
                onChange={(e) => setRecompensaInput(e.target.value)}
                onSubmit={createRecompensaFromInput}
                disabled={!recompensaInput.trim()}
            />
            <h3>Recompensas existentes:</h3>
            <ul>
                {recompensas.map((recompensa) => (
                    <RecompensaItem key={recompensa.id} recompensa={recompensa} />
                ))}
            </ul>
        </section>
    )
}