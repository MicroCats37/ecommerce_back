import { type ZodType} from "zod";

import api from "../lib/api/axios";
import { handleApiError } from "../lib/api/error";



/**
 * Función genérica para realizar peticiones GET usando Axios.
 * @param endpoint - La ruta del recurso (ej: '/categories')
 * @param schema - (Opcional) Schema de Zod para validar la respuesta automáticamente.
 */
export async function apiQuery<T>(endpoint: string, schema?: ZodType<T>): Promise<T> {
  try {
    const response = await api.get(endpoint);
    const data = response.data;
    // Si pasamos un schema, validamos los datos aquí mismo
    if (schema) {
      return schema.parse(data);
    }
    return data as T;
  } catch (error) {
    // Delegamos el error al manejador centralizado
    return handleApiError(error);
  }
}
