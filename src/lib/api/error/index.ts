// ----------------------------------------------------------------------

import { isAxiosError } from "axios";
import { toast } from "sonner";
import { ZodError } from "zod/v4";

/**
 * Manejador de errores reutilizable.
 * Se encarga de parsear el error (Axios, Zod, JS) y mostrar el Toast.
 */
export function handleApiError(error: unknown): never {
  let message = "Ocurrió un error inesperado";

  if (isAxiosError(error)) {
    // 1. Error de API / Red (404, 500, Sin internet)
    const status = error.response?.status;
    const serverMsg = error.response?.data?.error?.message || error.message;
    message = `Error ${status || 'Red'}: ${serverMsg}`;
  } else if (error instanceof ZodError) {
    // 2. Error de Validación (El backend envió datos con formato incorrecto)
    message = `Error de datos: El formato recibido no es válido.`;
    console.error("Detalle de validación:", error.issues);
  } else if (error instanceof Error) {
    // 3. Otros errores
    message = error.message;
  }

  // Mostramos el Toast al usuario
  toast.error(message);
  
  // Re-lanzamos el error para que el componente o función que llamó sepa que falló
  throw error;
}