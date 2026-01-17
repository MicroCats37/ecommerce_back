// src/stores/productStore.ts
import { atom } from 'nanostores';
import type { VisualGroup } from '../schemas/productos'; // Importa el tipo aquí también

export const selectedColorSlug = atom<string | null>(null);

// Ahora el átomo sabe que guarda un VisualGroup o null
export const currentVisualGroup = atom<VisualGroup | null>(null);