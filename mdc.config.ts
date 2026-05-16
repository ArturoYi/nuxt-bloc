import { defineMdcConfig } from '@nuxtjs/mdc/config'
import { 
  transformerNotationDiff, 
  transformerNotationFocus, 
  transformerNotationHighlight, 
  transformerNotationErrorLevel 
} from '@shikijs/transformers'

export default defineMdcConfig({
  shiki: {
    transformers: [
      transformerNotationFocus(),
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationErrorLevel(),
    ]
  }
})
