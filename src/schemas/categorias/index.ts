import { z } from "zod";

// 1. Definimos primero el TIPO de TypeScript base.
// Es necesario hacerlo así para que la recursividad no confunda al compilador.
export type Category = {
  id: number;
  name: string;
  slug: string;
  parent: Category | null; // <-- Aquí ocurre la magia recursiva
};

// 2. Definimos el Schema de Zod usando z.lazy() para el campo 'parent'
export const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    // 'parent' usa CategorySchema (él mismo) o puede ser null
    parent: CategorySchema.nullable(),
  })
);

// 3. Schema de la Respuesta de la API (La lista plana)
export const CategoryListSchema = z.array(CategorySchema);

// --- 4. Tipos Inferidos ---
// (Aunque ya definimos 'Category' arriba manualmente, esto confirma que coinciden)
export type CategoryList = z.infer<typeof CategoryListSchema>;