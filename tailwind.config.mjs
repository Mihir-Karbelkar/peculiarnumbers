export default {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'], serif: ['Lora', 'Georgia', 'serif'] },
      colors: { background: 'hsl(222 47% 5%)', foreground: 'hsl(210 40% 96%)', border: 'hsl(217 33% 17%)' }
    }
  }
};
