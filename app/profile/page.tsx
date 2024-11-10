"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

interface InputAreaProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: () => void;
    disabled: boolean;
}

function InputArea({ label, placeholder, value, onChange, onSubmit, disabled }: InputAreaProps) {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">{label}</h2>
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring focus:ring-blue-200 mb-2"
            />
            <button
                onClick={onSubmit}
                disabled={disabled}
                className={`w-full py-2 px-4 rounded-lg text-white transition duration-200 ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
            >
                Crear
            </button>
        </div>
    );
}


export default function Configuracion() {
    const { user, signOut } = useAuthenticator();
    const [categorias, setCategorias] = useState<
        Array<Schema["Categoria"]["type"]>
    >([]);
    const [categoriaInput, setCategoriaInput] = useState<string>("");
    const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(
        null
    );

    const [preferencias, setPreferencias] = useState<
        Array<Schema["Preferencia"]["type"]>
    >([]);
    const [preferenciaInput, setPreferenciaInput] = useState<string>("");
    const [selectedPreferencia, setSelectedPreferencia] = useState<
        Schema["Preferencia"]["type"] | null
    >(null);

    const [preferenciasDeclaradas, setPreferenciasDeclaradas] = useState<
        Array<Schema["PreferenciaDeclarada"]["type"]>
    >([]);


    function listPreferencias(categoriaSelect: HTMLSelectElement) {
        setSelectedCategoriaId(categoriaSelect.value);
        client.models.Preferencia.list({
            filter: {
                categoriaId: { eq: categoriaSelect.value },
            },
        }).then((data) => {
            console.log([...data.data]);
            setPreferencias([...data.data]);
        });
    }

    function listPreferenciasDeclaradas() {
        client.models.PreferenciaDeclarada.list().then((data) => {
            setPreferenciasDeclaradas([...data.data]);
        });
    }

    async function createCategoriasFromInput() {
        const categoriasArray = categoriaInput
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        try {
            await Promise.all(
                categoriasArray.map((nombre) =>
                    client.models.Categoria.create({ nombre })
                )
            );
            setCategoriaInput("");
        } catch (e) {
            console.error("Error al crear las categorías", e);
        }
    }

    async function createPreferenciasFromInput() {
        if (!selectedCategoriaId) {
            alert(
                "Por favor selecciona una categoría antes de agregar preferencias."
            );
            return;
        }

        const preferenciasArray = preferenciaInput
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        try {
            await Promise.all(
                preferenciasArray.map((nombre) =>
                    client.models.Preferencia.create({
                        nombre,
                        categoriaId: selectedCategoriaId,
                    })
                )
            );
            setPreferenciaInput("");
        } catch (e) {
            console.error("Error al crear las preferencias", e);
        }
    }

    function listCategorias() {
        try {
            const subscription = client.models.Categoria.observeQuery().subscribe({
                next: (data) => {

                    console.log("Categorias", [...data.items]);
                    setCategorias([...data.items])
                },
            });
            return subscription;
        } catch (e) {
            console.error("Error al listar las categorías", e);
        }
    }

    useEffect(() => {
        listCategorias();
        listPreferenciasDeclaradas();
    }, []);

    function handlePreferenciaClick(preferencia: Schema["Preferencia"]["type"]) {
        client.models.PreferenciaDeclarada.create({
            nombre: preferencia.nombre,
            preferenciaId: preferencia.id,
            categoriaId: preferencia.categoriaId,
        }).then(() => {
            console.log("Preferencia declarada asignada");
        }).catch((e) => {
            console.error("Error al declarar la preferencia", e);
        }).finally(() => {
            setSelectedPreferencia(preferencia);
            listPreferenciasDeclaradas();
        });
    }

    function handleEliminarPreferenciaDeclarada(id: string) {
        client.models.PreferenciaDeclarada.delete({ id }).then(() => {
            console.log("Preferencia declarada eliminada");

            listPreferenciasDeclaradas();
        }).catch((e) => {
            console.error("Error al eliminar la preferencia declarada", e);
        }
        );
    }

    return (
        <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{user?.signInDetails?.loginId}'s Data Management</h1>

            {/* Preferencias Declaradas Section */}
            <section className="border border-gray-300 p-5 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Preferencias Declaradas</h2>
                <ul className="space-y-2">
                    {preferenciasDeclaradas.map((preferenciaDeclarada) => (
                        <li
                            key={preferenciaDeclarada.id}
                            className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                        >
                            <span className="text-gray-700">{preferenciaDeclarada.nombre}</span>
                            <button
                                onClick={() => handleEliminarPreferenciaDeclarada(preferenciaDeclarada.id)}
                                className="text-red-600 hover:text-red-800 font-semibold"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Agregar Preferencias Section */}
            <section className="flex flex-col md:flex-row gap-6 border border-gray-300 p-5 rounded-lg shadow-sm">
                {/* Selección de Categoría */}
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">Seleccionar Categoría</h2>
                    <select
                        value={selectedCategoriaId ?? ""}
                        onChange={(e) => listPreferencias(e.target)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
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

                {/* Opciones de Preferencias */}
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">Seleccionar Preferencias</h2>
                    <div className="flex flex-wrap gap-2">
                        {preferencias.map((preferencia) => (
                            <button
                                key={preferencia.id}
                                className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-1 px-3 rounded-full focus:outline-none"
                                onClick={() => handlePreferenciaClick(preferencia)}
                            >
                                {preferencia.nombre}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
