import type { Category } from "../schemas/categorias";

// 1. INTERFAZ ACTUALIZADA
// Usamos 'Omit' para excluir explícitamente 'parent' de la base 'Category'.
// Así TypeScript sabe que CategoryTreeNode NO tiene esa propiedad.
export interface CategoryTreeNode extends Omit<Category, 'parent'> {
  subcategories: CategoryTreeNode[];
}

export const buildMenuTree = (flatCategories: Category[]): CategoryTreeNode[] => {
  const categoryMap = new Map<number, CategoryTreeNode>();
  const root: CategoryTreeNode[] = [];

  // PASO 1: Inicializar el mapa LIMPIANDO la propiedad parent
  flatCategories.forEach((cat) => {
    // TRUCO: Usamos destructuring para separar 'parent' del resto de propiedades (...)
    // 'categoryData' ahora tiene id, name, slug, etc., PERO NO tiene parent.
    const { parent, ...categoryData } = cat;

    categoryMap.set(cat.id, { 
      ...categoryData, // Esparcimos solo los datos limpios
      subcategories: [] 
    });
  });

  // PASO 2: Armar relaciones (Usamos la lista original 'flatCategories' para leer la lógica)
  flatCategories.forEach((cat) => {
    const currentNode = categoryMap.get(cat.id);
    if (!currentNode) return;

    // Aquí seguimos leyendo cat.parent de la lista original para saber dónde ponerlo
    if (cat.parent) {
      const parentNode = categoryMap.get(cat.parent.id);
      
      if (parentNode) {
        parentNode.subcategories.push(currentNode);
      } else {
        root.push(currentNode); 
      }
    } else {
      root.push(currentNode);
    }
  });

  return root;
};