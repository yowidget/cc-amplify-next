"use client";

import { Nullable } from "@aws-amplify/data-schema";
import { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { uploadData, getUrl } from "aws-amplify/storage";

const client = generateClient<Schema>();

interface Recompensa {
  id: string;
  nombre: Nullable<string>;
  detalles: Nullable<string>;
  categorias?: {
    nombre: string;
    id: string;
    preferencias?: { id: string; nombre: string }[];
  }[];
  img?: string;
}

export default function Recompensas() {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [categorias, setCategorias] = useState<
    Array<Schema["Categoria"]["type"]>
  >([]);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  function listCategorias() {
    try {
      const subscription = client.models.Categoria.observeQuery().subscribe({
        next: (data) => setCategorias([...data.items]),
      });
      // console.log("Categorías listadas", categorias);
      return subscription;
    } catch (e) {
      console.error("Error al listar las categorías", e);
    }
  }

  function loadRecompensas() {
    // client.models.Recompensa.list({
    //   selectionSet: ["id", "nombre", "detalles", "img"],
    // }).then(({ data, errors }) => {
    //   if (errors)
    //     throw console.error("Error al obtener las recompensas", errors);
    //   setRecompensas(data as Recompensa[]);
    // });

    async function getRecompensas(): Promise<Recompensa[]> {
      const { data, errors } = await client.models.Recompensa.list({
        selectionSet: ["id", "nombre", "detalles", "img"],
      });

      if (errors) {
        console.error("Error al obtener las recompensas", errors);
      }
      const recompensas = await Promise.all(data.map(async (recompensa) => {
        const { data: categoriasData, errors: categoriasErrors } = await client.models.RecompensaCategoria.list({
          filter: { recompensaId: { eq: recompensa.id } },
          selectionSet: ["categoriaId"],
        });
        if (categoriasErrors) {
          console.error("Error al obtener las categorías de la recompensa", categoriasErrors);
        }
        const categorias = await Promise.all(categoriasData.map(async (categoria) => {
          const { data: categoriaData, errors: categoriaErrors } = await client.models.Categoria.list({
            filter: { id: { eq: categoria?.categoriaId || "" } },
            selectionSet: ["id", "nombre"],
          });
          if (categoriaErrors) {
            console.error("Error al obtener la categoría de la recompensa", categoriaErrors);
          }

          const { data, errors: preferenciasErrors } = await client.models.RecompensaPreferencia.list({
            filter: { recompensaId: { eq: recompensa?.id || "" } },
            selectionSet: ["preferenciaId"],
          });
          if (preferenciasErrors) {
            console.error("Error al obtener las preferencias de la categoría", preferenciasErrors);
          }
          const preferencias = await Promise.all(data.map(async (preferencia) => {
            const { data: preferenciaData, errors: preferenciaErrors } = await client.models.Preferencia.list({
              filter: { id: { eq: preferencia?.preferenciaId || "" } },
              selectionSet: ["id", "nombre"],
            });
            if (preferenciaErrors) {
              console.error("Error al obtener la preferencia de la categoría", preferenciaErrors);
            }
            return preferenciaData[0];
          }))
          return { ...categoriaData[0], preferencias: preferencias };

        }));
        return { ...{ id: recompensa.id, nombre: recompensa.nombre, detalles: recompensa.detalles, img: recompensa.img || "" }, categorias };
      }));
      return recompensas;
    }
    getRecompensas().then(async (recompensas) => {
      const resolvedRecompensas = await Promise.all(recompensas);
      setRecompensas(resolvedRecompensas);
    });
  }

  function handleEliminarRecompensa(id: string) {
    client.models.Recompensa.get({ id })
      .then(({ data }) => {
        if (!data) return console.error("Recompensa no encontrada");
        const { img } = data;
        if (img) {
          client.models.Recompensa.update({ id, img: null }).then(() => {
            console.log(`Imagen de la recompensa ${id} eliminada`);
          });
        }
      })
      .catch((e) => {
        console.error(`Error al obtener la recompensa ${id}`, e);
      })
      .finally(() => {
        client.models.Recompensa.delete({ id }).then(() => loadRecompensas());
        console.log(`Recompensa ${id} eliminada`);
      });
  }

  const CreateRecompensa: React.FC = () => {
    const [recompensaName, setRecompensaName] = useState("");
    const [recompensaDetails, setRecompensaDetails] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categories, setCategories] = useState<{ id: string; nombre: string }[]>([]);
    const [preferences, setPreferences] = useState<{ id: string; nombre: string; categoriaId: string }[]>([]);
    const [selectedPreferences, setSelectedPreferences] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
      const fetchCategories = async () => {
        const response = await client.models.Categoria.list();
        setCategories(response.data);
      };

      const fetchPreferences = async () => {
        const response = await client.models.Preferencia.list();
        setPreferences(response.data);
      };

      fetchCategories();
      fetchPreferences();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files ? event.target.files[0] : null;
      if (selectedFile) {
        setFile(selectedFile);
        setImagePreview(URL.createObjectURL(selectedFile));
      }
    };

    const handleCategorySelect = (categoryId: string) => {
      if (!selectedCategories.includes(categoryId)) {
        setSelectedCategories([...selectedCategories, categoryId]);
        setSelectedPreferences({ ...selectedPreferences, [categoryId]: [] });
      }
    };

    const handleCategoryRemove = (categoryId: string) => {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
      const updatedPreferences = { ...selectedPreferences };
      delete updatedPreferences[categoryId];
      setSelectedPreferences(updatedPreferences);
    };

    const handlePreferenceSelect = (categoryId: string, preferenceId: string) => {
      setSelectedPreferences((prev) => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), preferenceId]
      }));
    };

    const handlePreferenceRemove = (categoryId: string, preferenceId: string) => {
      setSelectedPreferences((prev) => ({
        ...prev,
        [categoryId]: prev[categoryId].filter((id) => id !== preferenceId)
      }));
    };

    async function createRecompensaFromInput() {
      if (!file) return alert("Debes seleccionar una imagen");

      try {
        const { data: recompensa } = await client.models.Recompensa.create({
          nombre: recompensaName,
          detalles: recompensaDetails,
        });

        if (recompensa) {
          const result = await uploadData({
            path: `images/${recompensa.id}-${file.name}`,
            data: file,
            options: { contentType: file.type },
          }).result;

          await client.models.Recompensa.update({
            id: recompensa.id,
            img: result?.path,
          });

          selectedCategories.forEach((categoryId) => {
            client.models.RecompensaCategoria.create({
              recompensaId: recompensa.id,
              categoriaId: categoryId,
            });

            selectedPreferences[categoryId].forEach((preferenceId) => {
              client.models.RecompensaPreferencia.create({
                recompensaId: recompensa.id,
                preferenciaId: preferenceId,
              });
            });
          });
        }
      } catch (error) {
        console.error(`Error al crear la recompensa ${recompensaName}`, error);
      } finally {
        console.log("Recompensa creada exitosamente");
        setRecompensaName("");
        setRecompensaDetails("");
        setFile(null);
        setImagePreview("");
        setSelectedCategories([]);
        setSelectedPreferences({});
        loadRecompensas();
      }
    }

    async function handleIAAnalizer(text: string) {
      const { data: categorias, errors } = await client.models.Categoria.list({
        selectionSet: ["id", "nombre"],
      });
      if (errors) {
        console.error("Error al obtener las categorías", errors);
      }
      const { data: preferencias, errors: preferenciasErrors } = await client.models.Preferencia.list({
        selectionSet: ["id", "nombre", "categoriaId"],
      });
      if (preferenciasErrors) {
        console.error("Error al obtener las preferencias", preferenciasErrors);
      }
      const prompt = `categorias:${JSON.stringify(categorias)},preferencias:${JSON.stringify(preferencias)},texto:"${text}"`;
      // console.log("Prompt", prompt);
      const { data, errors: analizeErrors } = await client.queries.recompensaAnalizer({
        prompt,
      });
      if (analizeErrors) {
        console.error("Error al analizar la recompensa", analizeErrors);
      }
      // console.log("Resultado del modelo", data);
      if (data && typeof data === "string") {
        const jsonData = JSON.parse(JSON.parse(data).content[0].text);
        console.log("Resultado del modelo", jsonData);
        const { categorias, preferencias }: { categorias: string[], preferencias: { preferenciaId: string, categoriaId: string }[] } = jsonData;
        if (errors) {
          console.error("Error al crear la categoría", errors);
        }

        setSelectedCategories([]);
        setSelectedPreferences({});

        categorias.map((categoriaId: string) => {
          handleCategorySelect(categoriaId)
        })
        preferencias.map(({ preferenciaId, categoriaId }) => {
          handlePreferenceSelect(categoriaId, preferenciaId)
        })



        // const recompensaId = createRecompensaResponse?.id;
        // categorias.map((categoriaId: string) => {
        //   client.models.RecompensaCategoria.create({ recompensaId: recompensaId, categoriaId: categoriaId })
        // })
        // preferencias.map((preferenciaId: string) => {
        //   client.models.RecompensaPreferencia.create({ recompensaId: recompensaId, preferenciaId: preferenciaId })
        // })
      } else {
        console.log("Error al analizar la recompensa, no se obtuvo un resultado valido del modelo");
      }

    }

    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Agregar Recompensas</h2>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={recompensaName}
            onChange={(e) => setRecompensaName(e.target.value)}
            placeholder="Nombre de la recompensa"
            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleIAAnalizer(recompensaName)} // Define la función handleIAAnalizer para manejar el botón
            className="py-2 px-4 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            IA Analyser
          </button>
        </div>

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

        <div className="mb-4">
          <h3 className="font-bold text-gray-800">Seleccionar Categorías</h3>
          <select
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">Seleccionar Categoría</option>
            {categories
              .filter((categoria) => !selectedCategories.includes(categoria.id)) // Filtra categorías ya seleccionadas
              .map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
          </select>
        </div>

        {selectedCategories.map((categoryId) => {
          const category = categories.find((c) => c.id === categoryId);
          return (
            category && (
              <div key={categoryId} className="mb-4 border-b pb-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-800">{category.nombre}</h4>
                  <button
                    onClick={() => handleCategoryRemove(categoryId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar Categoría
                  </button>
                </div>
                <select
                  onChange={(e) => handlePreferenceSelect(categoryId, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mt-2"
                >
                  <option value="">Seleccionar Preferencia</option>
                  {preferences
                    .filter(
                      (preference) =>
                        preference.categoriaId === categoryId &&
                        !selectedPreferences[categoryId]?.includes(preference.id) // Filtra preferencias ya seleccionadas
                    )
                    .map((preference) => (
                      <option key={preference.id} value={preference.id}>
                        {preference.nombre}
                      </option>
                    ))}
                </select>

                <ul className="space-y-2 mt-2">
                  {selectedPreferences[categoryId]?.map((preferenceId) => {
                    const preference = preferences.find((p) => p.id === preferenceId);
                    return (
                      preference && (
                        <li key={preferenceId} className="flex justify-between items-center">
                          <span>{preference.nombre}</span>
                          <button
                            onClick={() => handlePreferenceRemove(categoryId, preferenceId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Eliminar Preferencia
                          </button>
                        </li>
                      )
                    );
                  })}
                </ul>
              </div>
            )
          );
        })}

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

  interface RecompensaItemProps {
    recompensa: Recompensa;
  }

  const RecompensaItem = ({ recompensa }: RecompensaItemProps) => {
    const [url, setURL] = useState<string>("");

    useEffect(() => {
      if (!recompensa.img) return;
      getUrl({ path: recompensa.img || "" })
        .then((result) => {
          setURL(result?.url?.href || "");
        })
        .catch((error) => {
          console.error("Error al obtener la URL de la imagen", error);
        });
    }, [recompensa.img]);

    return (
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        {/* Imagen */}
        <img
          className="w-full h-48 object-cover"
          src={url}
          alt="Imagen almacenada"
        />

        {/* Contenido de la tarjeta */}
        <div className="p-4">
          {/* Título */}
          <h2 className="text-2xl font-semibold text-gray-800">{recompensa.nombre}</h2>

          {/* Descripción */}
          <p className="text-gray-600 mt-2 mb-4">{recompensa.detalles}</p>

          {/* Categorías */}
          {recompensa.categorias?.map((categoria) => (
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Categoría:</h3>
              <p className="text-gray-600">{categoria.nombre}</p>

              {/* Preferencias dentro de la categoría */}
              {categoria.preferencias && categoria.preferencias.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-semibold text-gray-800">Preferencias:</h4>
                  <ul className="list-disc pl-5">
                    {categoria.preferencias.map((preferencia) => (
                      <li key={preferencia.id} className="text-gray-600">
                        {preferencia.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))

          }

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

  const RecompensasList: React.FC = () => {
    // Aquí debes manejar la lógica de las recompensas y pasarlas como prop



    useEffect(() => {

    }, []);

    // getRecompensas().then(async (recompensas) => {
    //   const resolvedRecompensas = await Promise.all(recompensas);
    //   setRecompensas(resolvedRecompensas as Recompensa[]);
    // });


    // const recompensas: Recompensa[] = [
    //   {
    //     id: "1",
    //     nombre: "Recompensa 1",
    //     detalles: "Detalles de recompensa 1",
    //     categoriaId: "cat1",
    //     categorias: [{
    //       nombre: "Categoría 1",
    //       id: "cat1",
    //       createdAt: "2024-01-01",
    //       updatedAt: "2024-01-01",
    //       preferencias: [
    //         { id: "pref1", nombre: "Preferencia A" },
    //         { id: "pref2", nombre: "Preferencia B" },
    //       ],
    //     }],
    //     img: "path/to/image.jpg",
    //   },
    //   // Más recompensas...
    // ];

    return (
      <section className="flex-1 border border-gray-300 p-6 rounded-lg mt-8 bg-gray-50">
        <div className="mb-8">
          <div className="w-full lg:w-1/2">
            <CreateRecompensa />
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Recompensas existentes:</h3>
          <div className="overflow-y-auto max-h-[400px]">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recompensas.map((recompensa) => (
                <li key={recompensa.id}>
                  <RecompensaItem recompensa={recompensa} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  };

  return (
    <RecompensasList />
  );
}
