import { defineConfig } from 'tsup';

export default defineConfig({
    esbuildOptions:(options) => {
        options.treeShaking = false;
    }
});