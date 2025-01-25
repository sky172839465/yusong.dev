import aspectRatio from '@tailwindcss/aspect-ratio'
import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx}'],
  corePlugins: {
    aspectRatio: false
  },
  theme: {
    extend: {
      height: {
        'screen-fill': '-webkit-fill-available'
      }
    }
  },
  plugins: [daisyui, typography, aspectRatio],
  daisyui: {
    styled: true,
    themes: ['light'],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: ''
  }
}

