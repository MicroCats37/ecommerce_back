import { z } from "zod";

// --- 1. Helpers de Validación ---
const isHexColor = (val: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val);

// --- 2. Schemas de Componentes (Imágenes, Opciones, Metadata) ---

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

const BaseCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});
export type CategoryType = z.infer<typeof BaseCategorySchema> & { parent: CategoryType | null };

const CategorySchema: z.ZodType<CategoryType> = BaseCategorySchema.extend({
  parent: z.lazy(() => CategorySchema.nullable()),
});
const CardImagesSchema = z.object({
  main: z.string(), // Si son URLs absolutas (http...), puedes agregar .url() aquí
  top: z.string(),
  bottom: z.string(),
});

export const CardOptionSchema = z.object({
  code: z.string(),     // ej: "talla"
  label: z.string(),    // ej: "Talla"
  value: z.string(),    // ej: "xxl"
  display: z.string(),  // ej: "XXL"
  metadata: z.record(z.string(), z.any()).optional(),
})


// Metadata: Flexible pero estricta con el color si existe
const CardMetadataSchema = z.record(z.string(), z.string()).superRefine((data, ctx) => {
  if (data.hex && !isHexColor(data.hex)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El color debe ser hexadecimal válido (ej. #FF0000)",
      path: ["hex"],
    });
  }
});

const CardGroupSchema = z.object({
  code: z.string(),
  label: z.string(),
  display: z.string(),
  value: z.string(),
  metadata: CardMetadataSchema,
});

// --- 3. Schema Principal: LA CARD (Singular) ---
export const ProductCardSchema = z.object({
  visual_id: z.string(),
  parent_slug: z.string(),
  name: z.string(),
  price: z.string(),
  // .nullable().optional() cubre: que no venga el campo o que venga como null
  offer_price: z.string().nullable().optional(), 
  is_available: z.boolean(),
  brand: BrandSchema,
  tags: z.array(TagSchema),
  category: CategorySchema,
  // Objetos anidados
  images: CardImagesSchema,
  group: CardGroupSchema,
  attributes: z.array(CardOptionSchema),
});

// --- 4. Schema de Respuesta: LA LISTA (Array) ---
// Este es el que usarás cuando recibas el array del backend
export const ProductCardListSchema = z.array(ProductCardSchema);


// --- 5. Tipos Inferidos para TypeScript ---
// Úsalos en tus componentes de SolidJS: props: { product: ProductCard }

export type ProductCard = z.infer<typeof ProductCardSchema>;
export type ProductCardList = z.infer<typeof ProductCardListSchema>;
export type CardMetadata = z.infer<typeof CardMetadataSchema>;
export type CardGroup = z.infer<typeof CardGroupSchema>;
