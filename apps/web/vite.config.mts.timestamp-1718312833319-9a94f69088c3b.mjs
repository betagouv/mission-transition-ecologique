// apps/web/vite.config.mts
import { ohVueIconAutoimportPreset, vueDsfrAutoimportPreset, vueDsfrComponentResolver } from "file:///home/yohann/www/BetaGouv/ADEME/TEE/TEE%20-%20nx/tee/node_modules/@gouvminint/vue-dsfr/dist/vue-dsfr.js";
import { defineConfig } from "file:///home/yohann/www/BetaGouv/ADEME/TEE/TEE%20-%20nx/tee/node_modules/vite/dist/node/index.js";
import vue from "file:///home/yohann/www/BetaGouv/ADEME/TEE/TEE%20-%20nx/tee/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///home/yohann/www/BetaGouv/ADEME/TEE/TEE%20-%20nx/tee/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///home/yohann/www/BetaGouv/ADEME/TEE/TEE%20-%20nx/tee/node_modules/unplugin-vue-components/dist/vite.js";
import { nxViteTsPaths } from "file:///home/yohann/www/BetaGouv/ADEME/TEE/TEE%20-%20nx/tee/node_modules/@nx/vite/plugins/nx-tsconfig-paths.plugin.js";
import { fileURLToPath } from "url";
import { resolve as resolve3 } from "path";

// apps/web/plugin/SEO/robotsTxt.ts
import dotenv from "file:///home/yohann/www/BetaGouv/ADEME/TEE/TEE%20-%20nx/tee/node_modules/dotenv/lib/main.js";
import { readFileSync } from "fs";
import { resolve } from "path";
function generateRobots() {
  dotenv.config();
  const VITE_DEPLOY_URL = process.env.VITE_DEPLOY_URL;
  console.log(process.cwd());
  console.log(resolve(process.cwd()));
  console.log(resolve(process.cwd(), "public"));
  const inFilePath = resolve(process.cwd(), "public", "robots.txt");
  const fileContent = readFileSync(inFilePath, "utf8");
  const newContent = fileContent.replace(/__VITE_DEPLOY_URL__/g, VITE_DEPLOY_URL);
}

// apps/web/plugin/SEO/sitemap.ts
import dotenv2 from "file:///home/yohann/www/BetaGouv/ADEME/TEE/TEE%20-%20nx/tee/node_modules/dotenv/lib/main.js";
import { readFileSync as readFileSync2, writeFileSync as writeFileSync2 } from "fs";
import { resolve as resolve2 } from "path";
var specificPathSettings = [
  { path: "/", changeFreq: "weekly" /* Weekly */, priority: "1.0" /* Highest */ },
  { path: "/questionnaire", changeFreq: "monthly" /* Monthly */, priority: "0.0" /* Null */ },
  { path: "/ajouter-une-aide-entreprises", changeFreq: "monthly" /* Monthly */, priority: "0.0" /* Null */ },
  { path: "/accessibilite", changeFreq: "monthly" /* Monthly */, priority: "0.2" /* Low */ },
  { path: "/mentions-legales", changeFreq: "monthly" /* Monthly */, priority: "0.2" /* Low */ },
  { path: "/donnees-personnelles", changeFreq: "monthly" /* Monthly */, priority: "0.2" /* Low */ }
];
var exclusionPaths = ["/:pathMatch(.*)*"];
function invalidPath(path) {
  if (exclusionPaths.includes(path))
    return true;
  if (path[0] != "/")
    return true;
  return false;
}
function generateOnePathXML(path, changeFreq, priority) {
  const lastModified = (/* @__PURE__ */ new Date()).toISOString();
  dotenv2.config();
  const VITE_DEPLOY_URL = process.env.VITE_DEPLOY_URL;
  return `  <url>
    <loc>${encodeURI(VITE_DEPLOY_URL + path)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}
function generateStaticSitemap() {
  const staticRoutesFilePath = resolve2(process.cwd(), "src", "router", "routes.ts");
  const staticRoutesContent = readFileSync2(staticRoutesFilePath, "utf8");
  const regexMatches = staticRoutesContent.match(/path: '(.*)'/g);
  const staticPaths = regexMatches?.map((match) => match.slice(7, -1));
  const urlElements = staticPaths?.map((path) => {
    if (invalidPath(path)) {
      return null;
    } else {
      const specificPathSetting = specificPathSettings.find((specificPath) => specificPath.path === path);
      if (specificPathSetting) {
        return generateOnePathXML(path, specificPathSetting.changeFreq, specificPathSetting.priority);
      } else {
        return generateOnePathXML(path, "monthly" /* Monthly */, "0.5" /* Mid */);
      }
    }
  }).filter((element) => element !== null).join("\n");
  return urlElements;
}
async function generateProgramSitemap() {
  const backend = await import("@tee/backend-ddd");
  backend.ProgramService.init();
  const service = new backend.ProgramService();
  console.log(service.getAll());
  console.log("program service");
  const allProgramsIds = service.getAll().map((program) => program.id);
  const activeProgramsResult = service.getFilteredPrograms({});
  if (activeProgramsResult.isErr) {
    throw activeProgramsResult.error;
  }
  const activeProgramsIds = activeProgramsResult.value.map((p) => p.id);
  return allProgramsIds.map((id) => {
    if (activeProgramsIds.includes(id)) {
      return generateOnePathXML("/aides-entreprise/" + id, "monthly" /* Monthly */, "0.6" /* MidHigh */);
    } else {
      return generateOnePathXML("/aides-entreprise/" + id, "monthly" /* Monthly */, "0.0" /* Null */);
    }
  }).join("\n");
}
function generateSitemapXML() {
  const staticElements = generateStaticSitemap();
  const programElements = generateProgramSitemap();
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticElements + "\n" + programElements}
</urlset>`;
}
function generateSitemap() {
  const sitemapXML = generateSitemapXML();
  const inFilePath = resolve2(process.cwd(), "public", "sitemap.xml");
  const fileContent = readFileSync2(inFilePath, "utf8");
  const newContent = fileContent.replace(/__SITEMAP_PLACEHOLDER__generation_in_plugin_SEO__/g, sitemapXML);
  const outFilePath = resolve2(process.cwd(), "dist", "sitemap.xml");
  writeFileSync2(outFilePath, newContent, "utf8");
}

// apps/web/plugin/SEO/index.ts
function SEOPlugin() {
  return [
    {
      name: "vite-plugin-SEO",
      closeBundle() {
        try {
          generateRobots();
          generateSitemap();
        } catch (error) {
          console.error("Error in the SEO plugin:", error);
        }
      }
    }
  ];
}
var SEO_default = SEOPlugin;

// apps/web/vite.config.mts
import { dsnFromString } from "file:///home/yohann/www/BetaGouv/ADEME/TEE/TEE%20-%20nx/tee/node_modules/@sentry/utils/cjs/index.js";
var __vite_injected_original_dirname = "/home/yohann/www/BetaGouv/ADEME/TEE/TEE - nx/tee/apps/web";
var __vite_injected_original_import_meta_url = "file:///home/yohann/www/BetaGouv/ADEME/TEE/TEE%20-%20nx/tee/apps/web/vite.config.mts";
var mode = process.env.NODE_ENV ?? "development";
var isProd = mode === "production";
var LIB = process.env.LIB ?? "main";
var libBuildConfig = {
  main: {
    outDir: "../../dist/apps/web",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  widget: {
    emptyOutDir: false,
    rollupOptions: {
      input: resolve3(__vite_injected_original_dirname, "widget.html")
    },
    lib: {
      name: "gov-aid-tree-app",
      entry: "widget/widget.ce.ts",
      fileName: "widget"
    }
  }
};
var plugins = async () => {
  const basePlugins = [
    vue(),
    SEO_default(),
    nxViteTsPaths(),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: ["vue", "vue-router", vueDsfrAutoimportPreset, ohVueIconAutoimportPreset],
      vueTemplate: true,
      dts: "./src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true
      }
    }),
    Components({
      extensions: ["vue"],
      dirs: ["src/components"],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: "./src/components.d.ts",
      resolvers: [vueDsfrComponentResolver]
    })
  ];
  if (isProd) {
    return basePlugins;
  } else {
    return [
      ...basePlugins
      // eslintPlugin.default()
    ];
  }
};
var currentBuildConfig = libBuildConfig[LIB];
var viteServer = {
  host: "0.0.0.0",
  port: 4242,
  proxy: {
    "/api": {
      target: "http://localhost:3000",
      secure: false
    }
  },
  headers: buildHeaders()
};
var vite_config_default = defineConfig({
  root: __vite_injected_original_dirname,
  cacheDir: "../../node_modules/.vite/apps/web",
  server: viteServer,
  preview: {
    port: 4242,
    host: "localhost"
  },
  plugins: [plugins()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: currentBuildConfig,
  define: {
    "process.env": process.env
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      // "@tee/backend-ddd": fileURLToPath(new URL("../../libs/backend-ddd/src/index.ts", import.meta.url))
    }
  },
  test: {
    watch: false,
    globals: true,
    cache: {
      dir: "../../node_modules/.vitest/apps/web"
    },
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../coverage/apps/web",
      provider: "v8"
    }
  }
});
function getSentryData() {
  const dsnComponents = dsnFromString(process.env.VITE_SENTRY_DSN ?? "");
  if (dsnComponents === void 0) {
    return void 0;
  }
  const { host, path, projectId } = dsnComponents;
  return {
    domain: `https://${host}${path}`,
    url: `https://${host}${path}/api/${projectId}/security/?sentry_key=${dsnComponents.publicKey}`
  };
}
function buildHeaders() {
  const sentryData = getSentryData();
  const headers = {
    "Content-Security-Policy": `default-src 'none';base-uri 'self';form-action 'self';script-src 'self' ;script-src-elem 'self' 'unsafe-inline' https://stats.beta.gouv.fr  https://embed.typeform.com;style-src 'self' 'unsafe-inline' https://embed.typeform.com;font-src 'self';img-src 'self' data:;object-src 'self';connect-src 'self' https://conseillers-entreprises.service-public.fr https://stats.beta.gouv.fr ${sentryData?.domain ? sentryData.domain : ""} https://embed.typeform.com https://api.typeform.com;worker-src 'self' blob:;frame-src 'self' https://conseillers-entreprises.service-public.fr https://form.typeform.com;frame-ancestors 'self' https://conseillers-entreprises.service-public.fr;`,
    "X-Frame-Options": "ALLOW-FROM https://conseillers-entreprises.service-public.fr",
    "X-Content-Type-Options": "nosniff"
  };
  if (sentryData) {
    headers["Expect-CT"] = `default-src 'self' ${sentryData.domain};report-uri ${sentryData.url};`;
  }
  return headers;
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBwcy93ZWIvdml0ZS5jb25maWcubXRzIiwgImFwcHMvd2ViL3BsdWdpbi9TRU8vcm9ib3RzVHh0LnRzIiwgImFwcHMvd2ViL3BsdWdpbi9TRU8vc2l0ZW1hcC50cyIsICJhcHBzL3dlYi9wbHVnaW4vU0VPL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUveW9oYW5uL3d3dy9CZXRhR291di9BREVNRS9URUUvVEVFIC0gbngvdGVlL2FwcHMvd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS95b2hhbm4vd3d3L0JldGFHb3V2L0FERU1FL1RFRS9URUUgLSBueC90ZWUvYXBwcy93ZWIvdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3lvaGFubi93d3cvQmV0YUdvdXYvQURFTUUvVEVFL1RFRSUyMC0lMjBueC90ZWUvYXBwcy93ZWIvdml0ZS5jb25maWcubXRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9J3ZpdGVzdCcgLz5cbmltcG9ydCB7IG9oVnVlSWNvbkF1dG9pbXBvcnRQcmVzZXQsIHZ1ZURzZnJBdXRvaW1wb3J0UHJlc2V0LCB2dWVEc2ZyQ29tcG9uZW50UmVzb2x2ZXIgfSBmcm9tICdAZ291dm1pbmludC92dWUtZHNmcidcbmltcG9ydCB7IEJ1aWxkT3B0aW9ucywgZGVmaW5lQ29uZmlnLCBQbHVnaW4sIFNlcnZlck9wdGlvbnMgfSBmcm9tICd2aXRlJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHsgbnhWaXRlVHNQYXRocyB9IGZyb20gJ0BueC92aXRlL3BsdWdpbnMvbngtdHNjb25maWctcGF0aHMucGx1Z2luJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IFNFT1BsdWdpbiBmcm9tICcuL3BsdWdpbi9TRU8nO1xuaW1wb3J0IHsgZHNuRnJvbVN0cmluZyB9IGZyb20gJ0BzZW50cnkvdXRpbHMnXG5cbmNvbnN0IG1vZGUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA/PyAnZGV2ZWxvcG1lbnQnXG5jb25zdCBpc1Byb2QgPSBtb2RlID09PSAncHJvZHVjdGlvbidcblxudHlwZSBMaWJUeXBlID0gJ21haW4nIHwgJ3dpZGdldCdcbmNvbnN0IExJQjogTGliVHlwZSA9IChwcm9jZXNzLmVudi5MSUIgYXMgTGliVHlwZSkgPz8gJ21haW4nXG5jb25zdCBsaWJCdWlsZENvbmZpZzogUmVjb3JkPExpYlR5cGUsIEJ1aWxkT3B0aW9ucz4gPSB7XG4gIG1haW46IHtcbiAgICBvdXREaXI6ICcuLi8uLi9kaXN0L2FwcHMvd2ViJyxcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogdHJ1ZSxcbiAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIHdpZGdldDoge1xuICAgIGVtcHR5T3V0RGlyOiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDogcmVzb2x2ZShfX2Rpcm5hbWUsICd3aWRnZXQuaHRtbCcpXG4gICAgfSxcbiAgICBsaWI6IHtcbiAgICAgIG5hbWU6ICdnb3YtYWlkLXRyZWUtYXBwJyxcbiAgICAgIGVudHJ5OiAnd2lkZ2V0L3dpZGdldC5jZS50cycsXG4gICAgICBmaWxlTmFtZTogJ3dpZGdldCdcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgcGx1Z2lucyA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgYmFzZVBsdWdpbnMgPSBbXG4gICAgdnVlKCksXG4gICAgU0VPUGx1Z2luKCksXG4gICAgbnhWaXRlVHNQYXRocygpLFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW5jbHVkZTogWy9cXC5bdGpdc3g/JC8sIC9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS9dLFxuICAgICAgaW1wb3J0czogWyd2dWUnLCAndnVlLXJvdXRlcicsIHZ1ZURzZnJBdXRvaW1wb3J0UHJlc2V0LCBvaFZ1ZUljb25BdXRvaW1wb3J0UHJlc2V0XSxcbiAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxuICAgICAgZHRzOiAnLi9zcmMvYXV0by1pbXBvcnRzLmQudHMnLFxuICAgICAgZXNsaW50cmM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZmlsZXBhdGg6ICcuLy5lc2xpbnRyYy1hdXRvLWltcG9ydC5qc29uJyxcbiAgICAgICAgZ2xvYmFsc1Byb3BWYWx1ZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pIGFzIFBsdWdpbixcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGV4dGVuc2lvbnM6IFsndnVlJ10sXG4gICAgICBkaXJzOiBbJ3NyYy9jb21wb25lbnRzJ10sXG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlL10sXG4gICAgICBkdHM6ICcuL3NyYy9jb21wb25lbnRzLmQudHMnLFxuICAgICAgcmVzb2x2ZXJzOiBbdnVlRHNmckNvbXBvbmVudFJlc29sdmVyXVxuICAgIH0pIGFzIFBsdWdpblxuICBdXG4gIGlmIChpc1Byb2QpIHtcbiAgICByZXR1cm4gYmFzZVBsdWdpbnNcbiAgfSBlbHNlIHtcbiAgICAvLyBjb25zdCBlc2xpbnRQbHVnaW4gPSBhd2FpdCBpbXBvcnQoJ3ZpdGUtcGx1Z2luLWVzbGludCcpXG4gICAgcmV0dXJuIFtcbiAgICAgIC4uLmJhc2VQbHVnaW5zLFxuICAgICAgLy8gZXNsaW50UGx1Z2luLmRlZmF1bHQoKVxuICAgIF0gYXMgUGx1Z2luW11cbiAgfVxufVxuXG5jb25zdCBjdXJyZW50QnVpbGRDb25maWcgPSBsaWJCdWlsZENvbmZpZ1tMSUJdXG5cbmNvbnN0IHZpdGVTZXJ2ZXI6IFNlcnZlck9wdGlvbnMgPSB7XG4gIGhvc3Q6ICcwLjAuMC4wJyxcbiAgcG9ydDogNDI0MixcbiAgcHJveHk6IHtcbiAgICAnL2FwaSc6IHtcbiAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICBzZWN1cmU6IGZhbHNlXG4gICAgfVxuICB9LFxuICBoZWFkZXJzOiBidWlsZEhlYWRlcnMoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByb290OiBfX2Rpcm5hbWUsXG4gIGNhY2hlRGlyOiAnLi4vLi4vbm9kZV9tb2R1bGVzLy52aXRlL2FwcHMvd2ViJyxcblxuICBzZXJ2ZXI6IHZpdGVTZXJ2ZXIsXG5cbiAgcHJldmlldzoge1xuICAgIHBvcnQ6IDQyNDIsXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gIH0sXG5cbiAgcGx1Z2luczogW3BsdWdpbnMoKV0sXG5cbiAgLy8gVW5jb21tZW50IHRoaXMgaWYgeW91IGFyZSB1c2luZyB3b3JrZXJzLlxuICAvLyB3b3JrZXI6IHtcbiAgLy8gIHBsdWdpbnM6IFsgbnhWaXRlVHNQYXRocygpIF0sXG4gIC8vIH0sXG5cbiAgYnVpbGQ6IGN1cnJlbnRCdWlsZENvbmZpZyxcblxuICBkZWZpbmU6IHtcbiAgICAncHJvY2Vzcy5lbnYnOiBwcm9jZXNzLmVudlxuICB9LFxuXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgLy8gXCJAdGVlL2JhY2tlbmQtZGRkXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4uLy4uL2xpYnMvYmFja2VuZC1kZGQvc3JjL2luZGV4LnRzXCIsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfVxuICB9LFxuXG4gIHRlc3Q6IHtcbiAgICB3YXRjaDogZmFsc2UsXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBjYWNoZToge1xuICAgICAgZGlyOiAnLi4vLi4vbm9kZV9tb2R1bGVzLy52aXRlc3QvYXBwcy93ZWInLFxuICAgIH0sXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgaW5jbHVkZTogWydzcmMvKiovKi57dGVzdCxzcGVjfS57anMsbWpzLGNqcyx0cyxtdHMsY3RzLGpzeCx0c3h9J10sXG5cbiAgICByZXBvcnRlcnM6IFsnZGVmYXVsdCddLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICByZXBvcnRzRGlyZWN0b3J5OiAnLi4vLi4vY292ZXJhZ2UvYXBwcy93ZWInLFxuICAgICAgcHJvdmlkZXI6ICd2OCcsXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5mdW5jdGlvbiBnZXRTZW50cnlEYXRhKCk6IHsgZG9tYWluOiBzdHJpbmc7IHVybDogc3RyaW5nIH0gfCB1bmRlZmluZWQge1xuICBjb25zdCBkc25Db21wb25lbnRzID0gZHNuRnJvbVN0cmluZyhwcm9jZXNzLmVudi5WSVRFX1NFTlRSWV9EU04gPz8gJycpXG4gIGlmIChkc25Db21wb25lbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICBjb25zdCB7IGhvc3QsIHBhdGgsIHByb2plY3RJZCB9ID0gZHNuQ29tcG9uZW50c1xuICByZXR1cm4ge1xuICAgIGRvbWFpbjogYGh0dHBzOi8vJHtob3N0fSR7cGF0aH1gLFxuICAgIHVybDogYGh0dHBzOi8vJHtob3N0fSR7cGF0aH0vYXBpLyR7cHJvamVjdElkfS9zZWN1cml0eS8/c2VudHJ5X2tleT0ke2RzbkNvbXBvbmVudHMucHVibGljS2V5fWBcbiAgfVxufVxuXG5mdW5jdGlvbiBidWlsZEhlYWRlcnMoKSB7XG4gIGNvbnN0IHNlbnRyeURhdGEgPSBnZXRTZW50cnlEYXRhKClcbiAgY29uc3QgaGVhZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAnQ29udGVudC1TZWN1cml0eS1Qb2xpY3knOlxuICAgICAgXCJkZWZhdWx0LXNyYyAnbm9uZSc7XCIgK1xuICAgICAgXCJiYXNlLXVyaSAnc2VsZic7XCIgK1xuICAgICAgXCJmb3JtLWFjdGlvbiAnc2VsZic7XCIgK1xuICAgICAgXCJzY3JpcHQtc3JjICdzZWxmJyA7XCIgK1xuICAgICAgXCJzY3JpcHQtc3JjLWVsZW0gJ3NlbGYnICd1bnNhZmUtaW5saW5lJyBodHRwczovL3N0YXRzLmJldGEuZ291di5mciAgaHR0cHM6Ly9lbWJlZC50eXBlZm9ybS5jb207XCIgK1xuICAgICAgXCJzdHlsZS1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJyBodHRwczovL2VtYmVkLnR5cGVmb3JtLmNvbTtcIiArXG4gICAgICBcImZvbnQtc3JjICdzZWxmJztcIiArXG4gICAgICBcImltZy1zcmMgJ3NlbGYnIGRhdGE6O1wiICtcbiAgICAgIFwib2JqZWN0LXNyYyAnc2VsZic7XCIgK1xuICAgICAgYGNvbm5lY3Qtc3JjICdzZWxmJyBodHRwczovL2NvbnNlaWxsZXJzLWVudHJlcHJpc2VzLnNlcnZpY2UtcHVibGljLmZyIGh0dHBzOi8vc3RhdHMuYmV0YS5nb3V2LmZyICR7c2VudHJ5RGF0YT8uZG9tYWluID8gc2VudHJ5RGF0YS5kb21haW4gOiAnJ30gaHR0cHM6Ly9lbWJlZC50eXBlZm9ybS5jb20gaHR0cHM6Ly9hcGkudHlwZWZvcm0uY29tO2AgK1xuICAgICAgXCJ3b3JrZXItc3JjICdzZWxmJyBibG9iOjtcIiArXG4gICAgICBcImZyYW1lLXNyYyAnc2VsZicgaHR0cHM6Ly9jb25zZWlsbGVycy1lbnRyZXByaXNlcy5zZXJ2aWNlLXB1YmxpYy5mciBodHRwczovL2Zvcm0udHlwZWZvcm0uY29tO1wiICtcbiAgICAgIFwiZnJhbWUtYW5jZXN0b3JzICdzZWxmJyBodHRwczovL2NvbnNlaWxsZXJzLWVudHJlcHJpc2VzLnNlcnZpY2UtcHVibGljLmZyO1wiLFxuICAgICdYLUZyYW1lLU9wdGlvbnMnOiAnQUxMT1ctRlJPTSBodHRwczovL2NvbnNlaWxsZXJzLWVudHJlcHJpc2VzLnNlcnZpY2UtcHVibGljLmZyJyxcbiAgICAnWC1Db250ZW50LVR5cGUtT3B0aW9ucyc6ICdub3NuaWZmJ1xuICB9XG5cbiAgaWYgKHNlbnRyeURhdGEpIHtcbiAgICAvLyBEaXNhYmxlZCBiZWNhdXNlIG9mIHNlbnQgdG9vIG11Y2ggcmVwb3J0IGVycm9yIGRhdGEgdG8gc2VudHJ5LiBOZWVkIHRvIGhhdmUgcmF0ZSBsaW1pdGVyIHRvIGhhdmUgc2FtcGxlLlxuICAgIC8vIENoZWNrIGh0dHBzOi8vc2VudHJ5LmluY3ViYXRldXIubmV0L3NldHRpbmdzL2JldGFnb3V2L3Byb2plY3RzL3RlZS1mcm9udGVuZC12dWUvc2VjdXJpdHktaGVhZGVycy9cbiAgICAvLyBoZWFkZXJzWydDb250ZW50LVNlY3VyaXR5LVBvbGljeSddICs9IGByZXBvcnQtdXJpICR7c2VudHJ5RGF0YS51cmx9O2BcbiAgICAvLyBoZWFkZXJzWydQdWJsaWMtS2V5LVBpbnMnXSA9IGBkZWZhdWx0LXNyYyAnc2VsZicgJHtzZW50cnlEYXRhLmRvbWFpbn07YCArIGByZXBvcnQtdXJpICR7c2VudHJ5RGF0YS51cmx9O2BcbiAgICBoZWFkZXJzWydFeHBlY3QtQ1QnXSA9IGBkZWZhdWx0LXNyYyAnc2VsZicgJHtzZW50cnlEYXRhLmRvbWFpbn07YCArIGByZXBvcnQtdXJpICR7c2VudHJ5RGF0YS51cmx9O2BcbiAgfVxuXG4gIHJldHVybiBoZWFkZXJzXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3lvaGFubi93d3cvQmV0YUdvdXYvQURFTUUvVEVFL1RFRSAtIG54L3RlZS9hcHBzL3dlYi9wbHVnaW4vU0VPXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS95b2hhbm4vd3d3L0JldGFHb3V2L0FERU1FL1RFRS9URUUgLSBueC90ZWUvYXBwcy93ZWIvcGx1Z2luL1NFTy9yb2JvdHNUeHQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUveW9oYW5uL3d3dy9CZXRhR291di9BREVNRS9URUUvVEVFJTIwLSUyMG54L3RlZS9hcHBzL3dlYi9wbHVnaW4vU0VPL3JvYm90c1R4dC50c1wiO2ltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52J1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jLCB3cml0ZUZpbGVTeW5jIH0gZnJvbSAnZnMnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2VuZXJhdGVSb2JvdHMoKSB7XG4gIGRvdGVudi5jb25maWcoKVxuICBjb25zdCBWSVRFX0RFUExPWV9VUkwgPSBwcm9jZXNzLmVudi5WSVRFX0RFUExPWV9VUkxcbiAgY29uc29sZS5sb2cocHJvY2Vzcy5jd2QoKSk7XG4gIGNvbnNvbGUubG9nKHJlc29sdmUocHJvY2Vzcy5jd2QoKSkpO1xuICBjb25zb2xlLmxvZyhyZXNvbHZlKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKSk7XG4gIGNvbnN0IGluRmlsZVBhdGggPSByZXNvbHZlKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnLCAncm9ib3RzLnR4dCcpXG4gIGNvbnN0IGZpbGVDb250ZW50ID0gcmVhZEZpbGVTeW5jKGluRmlsZVBhdGgsICd1dGY4JylcbiAgY29uc3QgbmV3Q29udGVudCA9IGZpbGVDb250ZW50LnJlcGxhY2UoL19fVklURV9ERVBMT1lfVVJMX18vZywgVklURV9ERVBMT1lfVVJMIGFzIHN0cmluZylcbiAgLy8gY29uc3Qgb3V0RmlsZVBhdGggPSByZXNvbHZlKHByb2Nlc3MuY3dkKCksICcuLi8uLi8uLi8nLCAnZGlzdC9hcHBzL3dlYicsICdyb2JvdHMudHh0JylcbiAgLy8gd3JpdGVGaWxlU3luYyhvdXRGaWxlUGF0aCwgbmV3Q29udGVudCwgJ3V0ZjgnKVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS95b2hhbm4vd3d3L0JldGFHb3V2L0FERU1FL1RFRS9URUUgLSBueC90ZWUvYXBwcy93ZWIvcGx1Z2luL1NFT1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUveW9oYW5uL3d3dy9CZXRhR291di9BREVNRS9URUUvVEVFIC0gbngvdGVlL2FwcHMvd2ViL3BsdWdpbi9TRU8vc2l0ZW1hcC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS95b2hhbm4vd3d3L0JldGFHb3V2L0FERU1FL1RFRS9URUUlMjAtJTIwbngvdGVlL2FwcHMvd2ViL3BsdWdpbi9TRU8vc2l0ZW1hcC50c1wiO2ltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcbmltcG9ydCB7IHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IENoYW5nZUZyZXEsIHR5cGUgUGF0aFNldHRpbmdzLCBQcmlvcml0eSB9IGZyb20gJy4vdHlwZSc7XG5pbXBvcnQgeyBQcm9ncmFtIH0gZnJvbSAnQHRlZS9kYXRhJztcblxuY29uc3Qgc3BlY2lmaWNQYXRoU2V0dGluZ3M6IFBhdGhTZXR0aW5nc1tdID0gW1xuICB7IHBhdGg6ICcvJywgY2hhbmdlRnJlcTogQ2hhbmdlRnJlcS5XZWVrbHksIHByaW9yaXR5OiBQcmlvcml0eS5IaWdoZXN0IH0sXG4gIHsgcGF0aDogJy9xdWVzdGlvbm5haXJlJywgY2hhbmdlRnJlcTogQ2hhbmdlRnJlcS5Nb250aGx5LCBwcmlvcml0eTogUHJpb3JpdHkuTnVsbCB9LFxuICB7IHBhdGg6ICcvYWpvdXRlci11bmUtYWlkZS1lbnRyZXByaXNlcycsIGNoYW5nZUZyZXE6IENoYW5nZUZyZXEuTW9udGhseSwgcHJpb3JpdHk6IFByaW9yaXR5Lk51bGwgfSxcbiAgeyBwYXRoOiAnL2FjY2Vzc2liaWxpdGUnLCBjaGFuZ2VGcmVxOiBDaGFuZ2VGcmVxLk1vbnRobHksIHByaW9yaXR5OiBQcmlvcml0eS5Mb3cgfSxcbiAgeyBwYXRoOiAnL21lbnRpb25zLWxlZ2FsZXMnLCBjaGFuZ2VGcmVxOiBDaGFuZ2VGcmVxLk1vbnRobHksIHByaW9yaXR5OiBQcmlvcml0eS5Mb3cgfSxcbiAgeyBwYXRoOiAnL2Rvbm5lZXMtcGVyc29ubmVsbGVzJywgY2hhbmdlRnJlcTogQ2hhbmdlRnJlcS5Nb250aGx5LCBwcmlvcml0eTogUHJpb3JpdHkuTG93IH1cbl1cbmNvbnN0IGV4Y2x1c2lvblBhdGhzID0gWycvOnBhdGhNYXRjaCguKikqJ11cblxuZnVuY3Rpb24gaW52YWxpZFBhdGgocGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmIChleGNsdXNpb25QYXRocy5pbmNsdWRlcyhwYXRoKSkgcmV0dXJuIHRydWVcbiAgaWYgKHBhdGhbMF0gIT0gJy8nKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gZmFsc2Vcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVPbmVQYXRoWE1MKHBhdGg6IHN0cmluZywgY2hhbmdlRnJlcTogQ2hhbmdlRnJlcSwgcHJpb3JpdHk6IFByaW9yaXR5KTogc3RyaW5nIHtcbiAgY29uc3QgbGFzdE1vZGlmaWVkID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gIGRvdGVudi5jb25maWcoKVxuICBjb25zdCBWSVRFX0RFUExPWV9VUkwgPSBwcm9jZXNzLmVudi5WSVRFX0RFUExPWV9VUkxcblxuICByZXR1cm4gYCAgPHVybD5cbiAgICA8bG9jPiR7ZW5jb2RlVVJJKFZJVEVfREVQTE9ZX1VSTCArIHBhdGgpfTwvbG9jPlxuICAgIDxsYXN0bW9kPiR7bGFzdE1vZGlmaWVkfTwvbGFzdG1vZD5cbiAgICA8Y2hhbmdlZnJlcT4ke2NoYW5nZUZyZXF9PC9jaGFuZ2VmcmVxPlxuICAgIDxwcmlvcml0eT4ke3ByaW9yaXR5fTwvcHJpb3JpdHk+XG4gIDwvdXJsPmBcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVTdGF0aWNTaXRlbWFwKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHN0YXRpY1JvdXRlc0ZpbGVQYXRoID0gcmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjJywgJ3JvdXRlcicsICdyb3V0ZXMudHMnKVxuICBjb25zdCBzdGF0aWNSb3V0ZXNDb250ZW50ID0gcmVhZEZpbGVTeW5jKHN0YXRpY1JvdXRlc0ZpbGVQYXRoLCAndXRmOCcpXG4gIGNvbnN0IHJlZ2V4TWF0Y2hlczogUmVnRXhwTWF0Y2hBcnJheSB8IG51bGwgPSBzdGF0aWNSb3V0ZXNDb250ZW50Lm1hdGNoKC9wYXRoOiAnKC4qKScvZylcbiAgY29uc3Qgc3RhdGljUGF0aHMgPSByZWdleE1hdGNoZXM/Lm1hcCgobWF0Y2gpID0+IG1hdGNoLnNsaWNlKDcsIC0xKSlcblxuICBjb25zdCB1cmxFbGVtZW50cyA9IHN0YXRpY1BhdGhzXG4gICAgPy5tYXAoKHBhdGgpID0+IHtcbiAgICAgIGlmIChpbnZhbGlkUGF0aChwYXRoKSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3BlY2lmaWNQYXRoU2V0dGluZyA9IHNwZWNpZmljUGF0aFNldHRpbmdzLmZpbmQoKHNwZWNpZmljUGF0aCkgPT4gc3BlY2lmaWNQYXRoLnBhdGggPT09IHBhdGgpXG4gICAgICAgIGlmIChzcGVjaWZpY1BhdGhTZXR0aW5nKSB7XG4gICAgICAgICAgcmV0dXJuIGdlbmVyYXRlT25lUGF0aFhNTChwYXRoLCBzcGVjaWZpY1BhdGhTZXR0aW5nLmNoYW5nZUZyZXEsIHNwZWNpZmljUGF0aFNldHRpbmcucHJpb3JpdHkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGdlbmVyYXRlT25lUGF0aFhNTChwYXRoLCBDaGFuZ2VGcmVxLk1vbnRobHksIFByaW9yaXR5Lk1pZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLmZpbHRlcigoZWxlbWVudCkgPT4gZWxlbWVudCAhPT0gbnVsbClcbiAgICAuam9pbignXFxuJylcbiAgcmV0dXJuIHVybEVsZW1lbnRzXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlUHJvZ3JhbVNpdGVtYXAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgYmFja2VuZCA9IGF3YWl0IGltcG9ydCAoJ0B0ZWUvYmFja2VuZC1kZGQnKVxuICBiYWNrZW5kLlByb2dyYW1TZXJ2aWNlLmluaXQoKVxuICBjb25zdCBzZXJ2aWNlID0gbmV3IGJhY2tlbmQuUHJvZ3JhbVNlcnZpY2UoKVxuICBjb25zb2xlLmxvZyhzZXJ2aWNlLmdldEFsbCgpKTtcbiAgY29uc29sZS5sb2coXCJwcm9ncmFtIHNlcnZpY2VcIik7XG4gIGNvbnN0IGFsbFByb2dyYW1zSWRzID0gc2VydmljZS5nZXRBbGwoKS5tYXAoKHByb2dyYW06IFByb2dyYW0pID0+IHByb2dyYW0uaWQpXG4gIGNvbnN0IGFjdGl2ZVByb2dyYW1zUmVzdWx0ID0gc2VydmljZS5nZXRGaWx0ZXJlZFByb2dyYW1zKHt9KVxuICBpZiAoYWN0aXZlUHJvZ3JhbXNSZXN1bHQuaXNFcnIpIHtcbiAgICB0aHJvdyBhY3RpdmVQcm9ncmFtc1Jlc3VsdC5lcnJvclxuICB9XG4gIGNvbnN0IGFjdGl2ZVByb2dyYW1zSWRzID0gYWN0aXZlUHJvZ3JhbXNSZXN1bHQudmFsdWUubWFwKChwOiBQcm9ncmFtKSA9PiBwLmlkKVxuXG4gIHJldHVybiBhbGxQcm9ncmFtc0lkc1xuICAgIC5tYXAoKGlkOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmIChhY3RpdmVQcm9ncmFtc0lkcy5pbmNsdWRlcyhpZCkpIHtcbiAgICAgICAgcmV0dXJuIGdlbmVyYXRlT25lUGF0aFhNTCgnL2FpZGVzLWVudHJlcHJpc2UvJyArIGlkLCBDaGFuZ2VGcmVxLk1vbnRobHksIFByaW9yaXR5Lk1pZEhpZ2gpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZ2VuZXJhdGVPbmVQYXRoWE1MKCcvYWlkZXMtZW50cmVwcmlzZS8nICsgaWQsIENoYW5nZUZyZXEuTW9udGhseSwgUHJpb3JpdHkuTnVsbClcbiAgICAgIH1cbiAgICB9KVxuICAgIC5qb2luKCdcXG4nKVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVNpdGVtYXBYTUwoKTogc3RyaW5nIHtcbiAgY29uc3Qgc3RhdGljRWxlbWVudHMgPSBnZW5lcmF0ZVN0YXRpY1NpdGVtYXAoKVxuICBjb25zdCBwcm9ncmFtRWxlbWVudHMgPSBnZW5lcmF0ZVByb2dyYW1TaXRlbWFwKClcblxuICByZXR1cm4gYDx1cmxzZXQgeG1sbnM9XCJodHRwOi8vd3d3LnNpdGVtYXBzLm9yZy9zY2hlbWFzL3NpdGVtYXAvMC45XCI+XG4gICR7c3RhdGljRWxlbWVudHMgKyAnXFxuJyArIHByb2dyYW1FbGVtZW50c31cbjwvdXJsc2V0PmBcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2VuZXJhdGVTaXRlbWFwKCkge1xuICBjb25zdCBzaXRlbWFwWE1MOiBzdHJpbmcgPSBnZW5lcmF0ZVNpdGVtYXBYTUwoKVxuICBjb25zdCBpbkZpbGVQYXRoID0gcmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAncHVibGljJywgJ3NpdGVtYXAueG1sJylcbiAgY29uc3QgZmlsZUNvbnRlbnQgPSByZWFkRmlsZVN5bmMoaW5GaWxlUGF0aCwgJ3V0ZjgnKVxuICBjb25zdCBuZXdDb250ZW50ID0gZmlsZUNvbnRlbnQucmVwbGFjZSgvX19TSVRFTUFQX1BMQUNFSE9MREVSX19nZW5lcmF0aW9uX2luX3BsdWdpbl9TRU9fXy9nLCBzaXRlbWFwWE1MKVxuICBjb25zdCBvdXRGaWxlUGF0aCA9IHJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ2Rpc3QnLCAnc2l0ZW1hcC54bWwnKVxuICB3cml0ZUZpbGVTeW5jKG91dEZpbGVQYXRoLCBuZXdDb250ZW50LCAndXRmOCcpXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3lvaGFubi93d3cvQmV0YUdvdXYvQURFTUUvVEVFL1RFRSAtIG54L3RlZS9hcHBzL3dlYi9wbHVnaW4vU0VPXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS95b2hhbm4vd3d3L0JldGFHb3V2L0FERU1FL1RFRS9URUUgLSBueC90ZWUvYXBwcy93ZWIvcGx1Z2luL1NFTy9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS95b2hhbm4vd3d3L0JldGFHb3V2L0FERU1FL1RFRS9URUUlMjAtJTIwbngvdGVlL2FwcHMvd2ViL3BsdWdpbi9TRU8vaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZ2VuZXJhdGVSb2JvdHMgZnJvbSAnLi9yb2JvdHNUeHQnXG5pbXBvcnQgZ2VuZXJhdGVTaXRlbWFwIGZyb20gJy4vc2l0ZW1hcCdcblxuZnVuY3Rpb24gU0VPUGx1Z2luKCk6IFBsdWdpbltdIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBuYW1lOiAndml0ZS1wbHVnaW4tU0VPJyxcbiAgICAgIGNsb3NlQnVuZGxlKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGdlbmVyYXRlUm9ib3RzKClcbiAgICAgICAgICBnZW5lcmF0ZVNpdGVtYXAoKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIHRoZSBTRU8gcGx1Z2luOicsIGVycm9yKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBdXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNFT1BsdWdpblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsMkJBQTJCLHlCQUF5QixnQ0FBZ0M7QUFDN0YsU0FB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QUFDLHNEQUFzRDtBQUFBLElBRWhFLFdBQVcsQ0FBQyxTQUFTO0FBQUEsSUFDckIsVUFBVTtBQUFBLE1BQ1Isa0JBQWtCO0FBQUEsTUFDbEIsVUFBVTtBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQ0YsQ0FBQztBQUVELFNBQVMsZ0JBQTZEO0FBQ3BFLFFBQU0sZ0JBQWdCLGNBQWMsUUFBUSxJQUFJLG1CQUFtQixFQUFFO0FBQ3JFLE1BQUksa0JBQWtCLFFBQVc7QUFDL0IsV0FBTztBQUFBLEVBQ1Q7QUFFQSxRQUFNLEVBQUUsTUFBTSxNQUFNLFVBQVUsSUFBSTtBQUNsQyxTQUFPO0FBQUEsSUFDTCxRQUFRLFdBQVcsSUFBSSxHQUFHLElBQUk7QUFBQSxJQUM5QixLQUFLLFdBQVcsSUFBSSxHQUFHLElBQUksUUFBUSxTQUFTLHlCQUF5QixjQUFjLFNBQVM7QUFBQSxFQUM5RjtBQUNGO0FBRUEsU0FBUyxlQUFlO0FBQ3RCLFFBQU0sYUFBYSxjQUFjO0FBQ2pDLFFBQU0sVUFBa0M7QUFBQSxJQUN0QywyQkFDRSw2WEFTbUcsWUFBWSxTQUFTLFdBQVcsU0FBUyxFQUFFO0FBQUEsSUFJaEosbUJBQW1CO0FBQUEsSUFDbkIsMEJBQTBCO0FBQUEsRUFDNUI7QUFFQSxNQUFJLFlBQVk7QUFLZCxZQUFRLFdBQVcsSUFBSSxzQkFBc0IsV0FBVyxNQUFNLGVBQW9CLFdBQVcsR0FBRztBQUFBLEVBQ2xHO0FBRUEsU0FBTztBQUNUOyIsCiAgIm5hbWVzIjogWyJyZXNvbHZlIiwgImRvdGVudiIsICJyZWFkRmlsZVN5bmMiLCAid3JpdGVGaWxlU3luYyIsICJyZXNvbHZlIiwgImRvdGVudiIsICJyZXNvbHZlIiwgInJlYWRGaWxlU3luYyIsICJ3cml0ZUZpbGVTeW5jIiwgInJlc29sdmUiXQp9Cg==
