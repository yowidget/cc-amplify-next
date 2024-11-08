"use client";
import { Nullable } from "@aws-amplify/data-schema";
import { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function Recompensas() {

    const [recompensas, setRecompensas] = useState<
        {
            id: string;
            nombre: Nullable<string>;
            categoria: { nombre: string; id: string; createdAt: string; updatedAt: string; }
        }[]
    >([]);
    const [recompensaInput, setRecompensaInput] = useState<string>("");
    const [categorias, setCategorias] = useState<
        Array<Schema["Categoria"]["type"]>
    >([]);

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
        const recompensasArray = recompensaInput
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        try {
            client.queries.categorize({ prompt: recompensasArray }).then(async ({ data: categorizedData, errors }) => {
                if (errors) throw console.error("Error al categorizar las transacciones", errors);

                if (typeof categorizedData === "string") {
                    const newCategorizedTransacciones = JSON.parse(categorizedData);
                    if (Array.isArray(newCategorizedTransacciones)) {
                        newCategorizedTransacciones
                            .map(({ text, category }) =>
                                client.models.Recompensa.create({ nombre: text, categoriaId: category }).then(({ data, errors }) => {
                                    if (errors) throw console.error("Error al crear la recompensa", errors);
                                    console.log("Recompensa creada", data);
                                })
                            );
                    }
                }
                // if (errors) console.log(errors);
                // console.log(data);
                // data?.map((item: any) => {
                //   const jsonItem = JSON.parse(item);
                //   console.log(item);
                //   client.models.Recompensa.create({ nombre: jsonItem.text, categoriaId: jsonItem.category });
                // });
            }).catch((e) => {
                console.error("Error al categorizar las recompensas", e);
            }).finally(() => {
                setRecompensaInput("");
                loadRecompensas();
            });
        } catch (e) {
            console.error("Error al crear las recompensas", e);
        }
    }

    function loadRecompensas() {
        client.models.Recompensa.list(
            { selectionSet: ['id', 'nombre', 'categoria.*'] }
        ).then(({ data, errors }) => {
            if (errors) throw console.error("Error al obtener las recompensas", errors);
            console.log(data);
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
                    <li key={recompensa.id}>
                        {recompensa.nombre}
                        <div>
                            <select
                                id={`categoriaSelect-${recompensa.id}`}
                                value={recompensa.categoria.id ?? ""}
                                onChange={(e) =>
                                    handleRecompensaCategoriaChange(
                                        recompensa.id,
                                        e.target.value
                                    )
                                }
                                style={{ width: "100%", marginBottom: "10px" }}
                            >
                                <option value="" disabled>
                                    -- Selecciona una categoría --
                                </option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button onClick={() => handleElminiarRecompensa(recompensa.id)}>Eliminar recompensa</button>
                    </li>
                ))}
            </ul>
        </section>
    )
}