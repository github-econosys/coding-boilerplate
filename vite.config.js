import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import sassGlobImports from 'vite-plugin-sass-glob-import';

// HTMLインポート用カスタムプラグイン
const htmlIncludes = (command) => {
    return {
        name: 'html-includes',
        transformIndexHtml: {
            order: 'pre',
            handler(html, ctx) {
                const processIncludes = (content, filePath) => {
                    return content.replace(/<include\s+src=["']([^"']+)["']\s*(?:>\s*<\/include>|\/?>)/g, (match, src) => {
                        // Handle SCSS/CSS - NO OP (Handled by main style.scss entry)
                        if (/\.(scss|css)(\?.*)?$/.test(src)) {
                            if (command === 'serve') {
                                return `<link rel="stylesheet" href="${src}">`;
                            }
                            return '<link rel="stylesheet" href="/assets/css/style.css">';
                        }

                        // Handle JS/TS
                        if (/\.(js|ts)(\?.*)?$/.test(src)) {
                            // Dev: keep as is
                            if (command === 'serve') {
                                return `<script type="module" src="${src}"></script>`;
                            }
                            return '';
                        }

                        // Handle HTML
                        let rawIncludePath;
                        if (src.startsWith('/')) {
                            rawIncludePath = path.resolve(__dirname, 'src', src.slice(1));
                        } else {
                            rawIncludePath = path.resolve(path.dirname(filePath), src);
                        }

                        if (command === 'serve') {
                            try {
                                if (fs.existsSync(rawIncludePath)) {
                                    const includeContent = fs.readFileSync(rawIncludePath, 'utf-8');
                                    return processIncludes(includeContent, rawIncludePath);
                                } else {
                                    return `<!-- Include file not found: ${src} -->`;
                                }
                            } catch (e) {
                                console.error(`Error processing include: ${src}`, e);
                                return `<!-- Error including file: ${src} -->`;
                            }
                        }
                        else {
                            const phpSrc = src.replace(/\.html$/, '.php');
                            if (phpSrc.startsWith('/')) {
                                return `<?php include($_SERVER['DOCUMENT_ROOT'] . '${phpSrc}'); ?>`;
                            } else {
                                return `<?php include('${phpSrc}'); ?>`;
                            }
                        }
                    });
                };
                return processIncludes(html, ctx.filename);
            }
        },
        handleHotUpdate({ file, server }) {
            if (file.endsWith('.html')) {
                server.ws.send({ type: 'full-reload', path: '*' });
            }
        }
    };
};

// ビルド後にHTMLをPHPにリネームするプラグイン
const phpRenamePlugin = () => {
    return {
        name: 'php-rename',
        closeBundle: async () => {
            const outDir = path.resolve(__dirname, 'public');
            const htmlFiles = await glob('**/*.html', { cwd: outDir, absolute: true });

            htmlFiles.forEach(file => {
                const phpFile = file.replace(/\.html$/, '.php');
                fs.renameSync(file, phpFile);
                console.log(`Renamed: ${path.relative(outDir, file)} -> ${path.relative(outDir, phpFile)}`);
            });

            // JSのソースマップ削除 (CSSのソースマップは残す)
            const jsMapFiles = await glob('**/*.js.map', { cwd: outDir, absolute: true });
            jsMapFiles.forEach(file => {
                fs.unlinkSync(file);
                console.log(`Deleted: ${path.relative(outDir, file)}`);
            });
        }
    };
};

// HTML/PHPパス書き換えプラグイン (ビルド時のみ)
const pathRewriter = (command) => {
    return {
        name: 'html-path-rewriter',
        transformIndexHtml: {
            order: 'post', // htmlIncludesの後に実行したいので post (あるいは pre で配列順序を後ろにする)
            handler(html, ctx) {
                if (command === 'serve') return html; // 開発時は書き換えない

                // href, src, action 属性を置換
                return html.replace(/(href|src|action)=["']([^"']+)["']/g, (match, attr, value) => {
                    // スキップ対象: 外部URL, アンカー, mailto, tel, 既にPHP出力構文を含んでいる場合など
                    if (value.match(/^(https?:|\/\/|#|mailto:|tel:|<\?php)/)) {
                        return match;
                    }

                    // 1. ルート相対パス(=絶対パス)への変換
                    let rootRelativePath = value;
                    if (!value.startsWith('/')) {
                        const root = path.resolve(__dirname, 'src');
                        // ctx.filename は絶対パス
                        const currentDir = path.dirname(ctx.filename);
                        const absoluteTarget = path.resolve(currentDir, value);

                        // srcディレクトリからの相対パスを取得して "/" を頭につける
                        rootRelativePath = '/' + path.relative(root, absoluteTarget).replace(/\\/g, '/');
                    }

                    // 2. 拡張子 .html -> .php 置換
                    if (rootRelativePath.endsWith('.html')) {
                        rootRelativePath = rootRelativePath.replace(/\.html$/, '.php');
                    }

                    return `${attr}="${rootRelativePath}"`;
                });
            }
        }
    };
};

// Vite設定
export default defineConfig(({ command }) => ({
    root: 'src',
    publicDir: '../static',
    build: {
        outDir: '../public',
        emptyOutDir: true,
        minify: false, // 圧縮無効化
        sourcemap: true, // ソースマップ有効化
        rollupOptions: {
            input: {
                // 明示的なエントリーポイント（JS/CSS）
                script: path.resolve(__dirname, 'src/assets/js/main.js'),
                style: path.resolve(__dirname, 'src/assets/scss/style.scss'),

                // PHP構造用ダミーHTMLエントリー
                ...Object.fromEntries(
                    glob.sync('src/**/*.html').map(file => [
                        path.relative('src', file).slice(0, -5),
                        path.resolve(__dirname, file)
                    ])
                )
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === 'script') {
                        return 'assets/js/script.js';
                    }
                    return 'assets/js/[name].js';
                },
                // アセットファイル名のフラット化（固定名）
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') {
                        return 'assets/css/style.css';
                    }
                    if (/\.(css|scss)$/.test(assetInfo.name)) {
                        return 'assets/css/[name].[ext]';
                    }
                    return 'assets/[ext]/[name].[ext]';
                }
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
            },
        },
    },
    plugins: [
        sassGlobImports(),
        htmlIncludes(command),
        pathRewriter(command), // パス書き換えプラグイン追加
        phpRenamePlugin(),
        ViteImageOptimizer({
            png: { quality: 80 },
            jpeg: { quality: 80 },
            jpg: { quality: 80 },
            webp: { lossless: true },
            svg: { xmlDeclaration: false, stripStyles: false }
        })
    ],
    server: {
        host: true,
        open: true
    }
}));
