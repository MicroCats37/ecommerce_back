// src/pages/api/all-products.json.ts

import { getProducstDetail } from "../../services/catalog";


export async function GET() {
  // 1. Obtenemos TODOS los productos de tu "Base de Datos" / API
  const allProducts = await getProducstDetail();

  // 2. Limpiamos la data (Minificación)
  // IMPORTANTE: Solo guarda lo necesario para buscar/mostrar miniaturas.
  // No guardes la descripción larga ni todas las fotos para que el archivo pese poco.
  const catalogoLigero = allProducts.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    category: item.product.category.slug,
    price: item.visual_groups[0].sellables[0].price,
    image: item.visual_groups[0].images.main,
    tags: item.product.tags.map(t => t.slug) // Para filtrar por tags
  }));

  // 3. Devolvemos el JSON
  return new Response(
    JSON.stringify(catalogoLigero), 
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}