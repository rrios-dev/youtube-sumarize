// eslint-disable-next-line @typescript-eslint/no-require-imports
const esbuild = require("esbuild");

esbuild.build({
    entryPoints: ["src/main.ts"],
    outfile: "dist/bundle.cjs", // Usar extensión .cjs para mayor compatibilidad con CommonJS
    bundle: true,
    platform: "node",
    target: "node18",
    external: ["fs", "path"],
    format: "cjs", // Mantener CommonJS
    minify: true,
}).catch(() => process.exit(1));