import '../css/embla.css'
import type { EmblaOptionsType } from 'embla-carousel'
import EmblaCarousel from 'embla-carousel'
import { addThumbBtnsClickHandlers, addToggleThumbBtnsActive } from './EmblaCarouselThumbsButton'
import { addPrevNextBtnsClickHandlers } from './EmblaCarouselArrowButtons'

// 1. LAS OPCIONES
const OPTIONS: EmblaOptionsType = {
  axis: 'x',
  breakpoints: {
    '(min-width: 748px)': { axis: 'y' }
  }
}

const OPTIONS_THUMBS: EmblaOptionsType = {
  align: 'start',
  axis: 'x',
  containScroll: 'keepSnaps',
  dragFree: true,
  breakpoints: {
    '(min-width: 748px)': { axis: 'y' }
  }
}

// 2. ENVOLVEMOS LA LÓGICA
document.addEventListener('astro:page-load', () => {

  // A. Seleccionamos el nodo PADRE principal para buscar los botones dentro de él
  const emblaNode = document.querySelector('.embla') as HTMLElement
  
  // B. Seleccionamos los viewports
  const viewportNodeMainCarousel = document.querySelector('.embla__viewport') as HTMLElement
  const viewportNodeThumbCarousel = document.querySelector('.embla-thumbs__viewport') as HTMLElement

  // C. GUARDIA DE SEGURIDAD:
  // Si falta alguno de los elementos clave, paramos para no romper la página.
  if (!emblaNode || !viewportNodeMainCarousel || !viewportNodeThumbCarousel) return

  // D. Seleccionamos los botones (usando emblaNode que ya definimos)
  const prevBtnNode = emblaNode.querySelector('.embla__button--prev') as HTMLElement
  const nextBtnNode = emblaNode.querySelector('.embla__button--next') as HTMLElement

  // E. Inicializamos Embla (UNA SOLA VEZ por carrusel)
  const emblaApiMain = EmblaCarousel(viewportNodeMainCarousel, OPTIONS)
  const emblaApiThumb = EmblaCarousel(viewportNodeThumbCarousel, OPTIONS_THUMBS)

  // F. Configuramos Thumbs (Miniaturas)
  const removeThumbBtnsClickHandlers = addThumbBtnsClickHandlers(
    emblaApiMain,
    emblaApiThumb
  )
  const removeToggleThumbBtnsActive = addToggleThumbBtnsActive(
    emblaApiMain,
    emblaApiThumb
  )

  // G. Configuramos Flechas (Prev/Next)
  // Verificamos que los botones existan antes de asignar eventos
  let removePrevNextBtnsClickHandlers: (() => void) | undefined
  if (prevBtnNode && nextBtnNode) {
    removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
      emblaApiMain, // Usamos la API del principal
      prevBtnNode,
      nextBtnNode
    )
  }

  // H. Limpieza (Cleanup) al destruir el carrusel
  // Esto es crucial en Astro con View Transitions para evitar fugas de memoria
  emblaApiMain.on('destroy', () => {
    removeThumbBtnsClickHandlers()
    removeToggleThumbBtnsActive()
    if (removePrevNextBtnsClickHandlers) removePrevNextBtnsClickHandlers()
  })
  
  // Nota: No necesitas limpiar emblaApiThumb por separado si los eventos
  // están vinculados a la interacción entre ambos, pero por seguridad:
  emblaApiThumb.on('destroy', () => {
    // Si tuvieras lógica exclusiva del thumb, la limpiarías aquí.
  })
})