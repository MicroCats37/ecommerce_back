import { z } from "zod";

// --- 1. Helpers de Validación (Reutilizado) ---
const isHexColor = (val: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val);

// --- 2. Schemas Atómicos (Piezas pequeñas) ---

// SEO
const SeoSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
});

// Marca
const BrandSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  logo_url: z.string(),
});

// Tags
const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

// Atributos (Igual que tu CardOptionSchema pero para el detalle)
const AttributeSchema = z.object({
  code: z.string(),    // ej: "talla"
  label: z.string(),   // ej: "Talla"
  value: z.string(),   // ej: "m"
  display: z.string(), // ej: "M"
  metadata: z.record(z.string(), z.any()).optional(),
});

// --- 3. Schema Recursivo: Categoría ---
// Definimos primero la base para poder hacer la recursión
const BaseCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

// Extendemos para añadir el 'parent' recursivo
export type CategoryType = z.infer<typeof BaseCategorySchema> & { parent: CategoryType | null };

const CategorySchema: z.ZodType<CategoryType> = BaseCategorySchema.extend({
  parent: z.lazy(() => CategorySchema.nullable()),
});


// --- 4. Schemas de Variantes Visuales (Visual Group) ---

// Metadata: Aplicamos la validación estricta de Hex que pediste
const GroupMetadataSchema = z.object({
  hex: z.string().refine((val) => isHexColor(val), {
    message: "El color debe ser hexadecimal válido (ej. #FF0000)",
  }),
});

// Datos del Grupo (El selector de color/variante)
const GroupInfoSchema = z.object({
  code: z.string(),
  label: z.string(),
  display: z.string(),
  value: z.string(),
  metadata: GroupMetadataSchema,
});

// Imágenes del Grupo
const GroupImagesSchema = z.object({
  main: z.string(),
  gallery: z.array(z.string()),
});

// Sellable (SKU individual: Talla S, Talla M, etc.)
const SellableSchema = z.object({
  id: z.string(),
  sku: z.string(),
  price: z.string(),
  offer_price: z.string().nullable().optional(),

  is_active: z.boolean(),
  attributes: z.array(AttributeSchema),
});

// El Grupo Visual Completo (Color Rojo + sus fotos + sus tallas)
const VisualGroupSchema = z.object({
  name: z.string(),
  slug: z.string(),
  group: GroupInfoSchema,
  images: GroupImagesSchema,
  sellables: z.array(SellableSchema),
});


// --- 5. Schema del Producto Principal (Core) ---
const ProductCoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  seo: SeoSchema,
  brand: BrandSchema,
  category: CategorySchema,
  tags: z.array(TagSchema),
});


// --- 6. Schema Raíz (La respuesta completa de la API) ---
export const ProductDetailResponseSchema = z.object({
  product: ProductCoreSchema,
  visual_groups: z.array(VisualGroupSchema),
});

export const ProductsDetailResponseSchema = z.array(
    ProductDetailResponseSchema
);


// --- 7. Tipos Inferidos (Exports) ---
// Úsalos en tus componentes de Astro/Solid/React
export type ProductType = z.infer<typeof ProductCoreSchema>;
export type ProductDetailResponse = z.infer<typeof ProductDetailResponseSchema>;
export type ProductsDetailResponse = z.infer<typeof ProductsDetailResponseSchema>;
export type ProductCore = z.infer<typeof ProductCoreSchema>;
export type VisualGroup = z.infer<typeof VisualGroupSchema>;
export type SellableSku = z.infer<typeof SellableSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type ProductAttribute = z.infer<typeof AttributeSchema>;