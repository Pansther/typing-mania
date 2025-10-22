import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const phasermsg = () => {
    return {
        name: "phasermsg",
        buildStart() {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            process.stdout.write(`Building for production...\n`);
        },
        buildEnd() {
            const line =
                "---------------------------------------------------------";
            const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            process.stdout.write(`${line}\n${msg}\n${line}\n`);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            process.stdout.write(`✨ Done ✨\n`);
        },
    };
};

export default defineConfig({
    base: "./",
    plugins: [react(), phasermsg(), tailwindcss()],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    logLevel: "warning",
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ["phaser"],
                },
            },
        },
        minify: "terser",
        terserOptions: {
            compress: {
                passes: 2,
            },
            mangle: true,
            format: {
                comments: false,
            },
        },
    },
});
