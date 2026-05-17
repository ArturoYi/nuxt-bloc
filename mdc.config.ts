import { defineConfig } from "@nuxtjs/mdc/config";
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationErrorLevel,
} from "@shikijs/transformers";

export default defineConfig({
  shiki: {
    transformers: [
      transformerNotationFocus(),
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationErrorLevel(),
    ],
  },
});
