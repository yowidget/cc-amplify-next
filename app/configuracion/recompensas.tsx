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
  categoriaId: Nullable<string>;
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
    client.models.Recompensa.list({
      selectionSet: ["id", "nombre", "detalles", "img"],
    }).then(({ data, errors }) => {
      if (errors)
        throw console.error("Error al obtener las recompensas", errors);
      setRecompensas(data as Recompensa[]);
    });
  }

  // function handleRecompensaCategoriaChange(id: string, categoriaId: string) {
  //   client.models.Recompensa.update({ id, categoriaId })
  //     .then(() => {
  //       console.log(
  //         `Recompensa ${id} actualizada con la categoría ${categoriaId}`
  //       );
  //     })
  //     .catch((e) =>
  //       console.error(`Error al actualizar la recompensa ${id}`, e)
  //     );
  // }

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

        <div className="mb-4">
          <h3 className="font-bold text-gray-800">Seleccionar Categorías</h3>
          <select
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">Seleccionar Categoría</option>
            {categories.map((categoria) => (
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
                    .filter((preference) => preference.categoriaId === categoryId)
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
          <h2 className="text-2xl font-semibold text-gray-800">
            {recompensa.nombre}
          </h2>

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
        <h3 className="text-3xl font-bold text-gray-900 mb-6">
          Recompensas existentes:
        </h3>
        <div className="overflow-y-auto max-h-[400px]">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recompensas.map((recompensa) => (
              <li key={recompensa.id}>
                {/* <div>

                  <select
                    id={`categoriaSelect-${recompensa.id}`}
                    value={recompensa.categoriaId ?? ""}
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
                </div> */}
                <RecompensaItem recompensa={recompensa} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
