// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxtjs/color-mode"],
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  $development: {
    devServer: {
      host: "0.0.0.0",
      port: 3000,
    },
  },
  runtimeConfig: {
    tlBotToken: "",
    openRouterToken: "",
    funnyPhotoToken: "",
  },
});
