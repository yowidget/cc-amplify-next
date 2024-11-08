import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function Setup() {

    async function executeSeeders() {

        const data = [
            { id: "alimentacion_y_bebidas", nombre: "Alimentación y Bebidas" },
            { id: "delivery_de_comida", nombre: "Delivery de Comida" },
            { id: "ropa_y_accesorios", nombre: "Ropa y Accesorios" },
            { id: "electronica_y_tecnologia", nombre: "Electrónica y Tecnología" },
            { id: "hogar_y_jardin", nombre: "Hogar y Jardín" },
            { id: "salud_y_belleza", nombre: "Salud y Belleza" },
            { id: "transporte", nombre: "Transporte" },
            { id: "entretenimiento_y_ocio", nombre: "Entretenimiento y Ocio" },
            { id: "vuelos", nombre: "Vuelos" },
            { id: "hoteleria", nombre: "Hoteleria" },
            { id: "servicios_financieros", nombre: "Servicios Financieros" },
            { id: "seguros", nombre: "Seguros" },
            { id: "educacion", nombre: "Educación" },
            { id: "suscripciones", nombre: "Suscripciones" },
            { id: "donaciones_y_caridad", nombre: "Donaciones y Caridad" },
            { id: "impuestos_y_tarifas", nombre: "Impuestos y Tarifas" },
            { id: "inversiones", nombre: "Inversiones" },
            { id: "servicios_publicos", nombre: "Servicios Públicos" },
            { id: "cuotas_membresias", nombre: "Cuotas o Membresías" },
            { id: "transacciones_no_relevantes", nombre: "Transacciones No Relevantes" }
        ];
        

        data.map((item) => {
            client.models.Categoria.create({id: item.id, nombre: item.nombre}).then(({data, errors}) => {
                if (errors) console.log("Error creando categoria: ", errors);
                console.log("Categoria creada: ", data);
            });
        })
        console.log("Seeders ejecutados");
        
    }

    return (
        <div>
            <h1>Setup config</h1>

            <h2>Ejecutar seeders</h2>
            <button onClick={() => executeSeeders()}>Ejecutar ahora</button>
        </div>
    )

}
