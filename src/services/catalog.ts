

// Importamos los Schemas y Tipos que ya definiste
import { CategoryListSchema, type CategoryList } from "../schemas/categorias";
import { ProductDetailResponseSchema, ProductsDetailResponseSchema, type ProductsDetailResponse } from "../schemas/productos";
import { ProductCardListSchema, type ProductCardList } from "../schemas/productos/cards";
import { apiQuery } from "./api";

/**
 * Obtiene todas las categorías.
 * Valida la respuesta con Zod para asegurar que cumple con CategoryListSchema.
 */
export const getCategories = async (): Promise<CategoryList> => {
  // Pasamos el schema como segundo argumento para que apiQuery valide y maneje errores
  return apiQuery("/categories", CategoryListSchema);
};

export const getProducstDetail = async (): Promise<ProductsDetailResponse> => { 
  return apiQuery(`/products`, ProductsDetailResponseSchema);
}

export const getProductsCards = async (): Promise<ProductCardList> => {
  return apiQuery("/products/cards", ProductCardListSchema);
};

export const getProductDetailPage = async (slug: string) => { 
  return apiQuery(`/products/${slug}/page`, ProductDetailResponseSchema);
}

