import { createSignal, createMemo, createEffect, For, Show } from "solid-js";
import { cn } from "../../../lib/utils";
// Asegúrate de tener el icono importado
import type { CategoryType, ProductType, SellableSku, VisualGroup } from "../../../schemas/productos";








interface Props {
  product: ProductType;
  currentVariantVisual: VisualGroup;
}

// --- 2. Componente ---

export default function ProductDetails(props: Props) {
  const [selectedSellable, setSelectedSellable] = createSignal<SellableSku>();

  createEffect(() => {
    const visual = props.currentVariantVisual;
    if (visual) {
      const firstActive = visual.sellables.find((s) => s.is_active);
      setSelectedSellable(firstActive);
    }
  });

  const variantOptions = createMemo(() => {
    const visual = props.currentVariantVisual;
    if (!visual) return [];

    return visual.sellables.map((item) => {
      const attr = item.attributes[0]; 
      return {
        id: item.id,
        sku: item.sku,
        isActive: item.is_active,
        label: attr?.label || "Opción",
        display: attr?.display || item.sku,
        itemRef: item,
      };
    });
  });

  const prices = createMemo(() => {
    const selected = selectedSellable();
    if (!selected) return { price: 0, offer: null };

    return {
      price: Number(selected.price),
      offer: selected.offer_price ? Number(selected.offer_price) : null,
    };
  });

  return (
    <Show when={props.currentVariantVisual}>
      {(visual) => (
        <div class="flex flex-col gap-6">
          
          {/* --- A. INFO VISUAL (Color) --- */}
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium opacity-70">
              {visual().group.label}:
            </span>
            <span class="text-sm font-bold">
              {visual().group.display}
            </span>
            
            {/* Círculo de color */}
            <Show when={visual().group.metadata?.hex}>
              <span
                class="w-5 h-5 rounded-full ring-2 ring-base-200 ml-2 shadow-sm"
                style={{ "background-color": visual().group.metadata.hex }}
              />
            </Show>
          </div>

          {/* --- B. SELECTOR DE ATRIBUTOS (Tallas) --- */}
          <div>
            <div class="mb-3">
              <span class="text-sm font-medium">
                Seleccionar {variantOptions()[0]?.label || "Opción"}
              </span>
            </div>

            <div class="flex flex-wrap gap-2">
              <For each={variantOptions()}>
                {(opt) => {
                  const isSelected = () => selectedSellable()?.id === opt.id;
                  
                  return (
                    <button
                      onClick={() => opt.isActive && setSelectedSellable(opt.itemRef)}
                      disabled={!opt.isActive}
                      class={cn(
                        // Clase base daisyUI: botón mediano
                        "btn btn-md min-w-14", 
                        
                        // Estado: Si está seleccionado usamos 'btn-neutral' (negro/blanco minimalista)
                        // Si no, usamos 'btn-outline' para que sea sutil
                        isSelected() 
                          ? "btn-neutral shadow-md" 
                          : "btn-outline border-base-300 hover:border-base-content",

                        // Deshabilitado: daisyUI se encarga, pero podemos forzar opacidad extra si queremos
                        !opt.isActive && "btn-disabled opacity-40"
                      )}
                    >
                      {opt.display}
                    </button>
                  );
                }}
              </For>
            </div>
          </div>

          {/* --- C. PRECIO Y ACCIÓN --- */}
          <div class="divider"></div> {/* Divisor nativo de daisyUI */}

          <div class="flex flex-col gap-4">
            
            {/* Bloque de Precio */}
            <div class="flex items-baseline gap-3">
              <Show
                when={prices().offer}
                fallback={
                  <span class="text-3xl font-bold">
                    {selectedSellable() ? `S/ ${prices().price.toFixed(2)}` : "--.--"}
                  </span>
                }
              >
                {/* Precio Oferta: Usamos 'text-primary' o 'text-accent' del tema */}
                <span class="text-3xl font-bold text-primary">
                  S/ {prices().offer!.toFixed(2)}
                </span>
                {/* Precio Original: Opacidad baja y tachado */}
                <span class="text-lg opacity-50 line-through decoration-2">
                  S/ {prices().price.toFixed(2)}
                </span>
              </Show>
            </div>

            {/* Botón Comprar */}
            <button
              class={cn(
                // Botón grande, ancho completo, color primario del tema
                "btn btn-primary btn-block btn-lg text-lg",
                "shadow-lg"
              )}
              disabled={!selectedSellable() || !selectedSellable()?.is_active}
            >
              
              {selectedSellable()?.is_active 
                ? "Agregar al Carrito" 
                : "Agotado"}
            </button>
            
            <Show when={selectedSellable()}>
               <p class="text-xs text-center font-mono opacity-50 uppercase tracking-widest">
                  SKU: {selectedSellable()?.sku}
               </p>
            </Show>

          </div>
        </div>
      )}
    </Show>
  );
}