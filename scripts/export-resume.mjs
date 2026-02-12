/**
 * JSON Resume 테마로 HTML export
 * - PUBLIC_RESUME_THEME env로 테마 선택
 * - .env, .env.development, .env.local 로드 (기존 값 우선)
 */
import { execSync } from "child_process";
import {
    readFileSync,
    writeFileSync,
    existsSync,
    copyFileSync,
    unlinkSync,
    mkdirSync,
} from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// .env 파일 로드 (Node 스크립트는 자동 로드 안 함)
for (const name of [".env", ".env.development", ".env.local"]) {
    const p = join(root, name);
    if (existsSync(p)) {
        const content = readFileSync(p, "utf-8");
        for (const line of content.split("\n")) {
            const m = line.match(/^([^#=]+)=(.*)$/);
            if (m) {
                const k = m[1].trim();
                const v = m[2].trim().replace(/^["']|["']$/g, "");
                process.env[k] = v;
            }
        }
    }
}

const theme = process.env.PUBLIC_RESUME_THEME || "flat";
const resumePath = join(root, "src/data/resume.json");
const outputPath = join(root, "dist/resume-output-temp.html");
const destPath = join(root, "src/data/resume-rendered.json");
const standalonePath = join(root, "public/resume-standalone.html");

if (!existsSync(resumePath)) {
    console.error("resume.json not found at", resumePath);
    process.exit(1);
}

// resume-cli expects resume.json in cwd
copyFileSync(resumePath, join(root, "resume.json"));

// dist 폴더가 없을 수 있음
try {
    mkdirSync(join(root, "dist"), { recursive: true });
} catch {
    /* ignore */
}

execSync(`pnpm exec resume export --theme ${theme} "${outputPath}"`, {
    cwd: root,
    stdio: "inherit",
});

const html = readFileSync(outputPath, "utf-8");

// 전체 HTML을 public/resume-standalone.html로 저장 (iframe용 - 완전 격리)
try {
    mkdirSync(join(root, "public"), { recursive: true });
} catch {
    /* ignore */
}
writeFileSync(standalonePath, html, "utf-8");

// Extract <head> styles (style tags + link stylesheets)
const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
const headContent = headMatch ? headMatch[1] : "";

// Extract styles: <style>...</style> and <link rel="stylesheet" ...>
const styleTags = headContent.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
const linkTags =
    headContent.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || [];
const styles = [...linkTags, ...styleTags].join("\n");

// Extract body content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyContent = bodyMatch ? bodyMatch[1].trim() : "";

// 테마 스타일을 .resume-theme-scope 내부로만 적용되도록 스코핑
const SCOPE = ".resume-theme-scope";
const scopedStyles = scopeCss(styles, SCOPE);
bodyContent = `<div class="resume-theme-scope">${bodyContent}</div>`;

function scopeCss(css, scope) {
    const linkTags = css.match(/<link[^>]*>/g) || [];
    const styleContent = css
        .replace(/<link[^>]*>/g, "")
        .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, inner) => inner)
        .replace(/@import[^;]+;/g, ""); // @import 제거 (스코핑 어려움)
    const scoped = scopeRules(styleContent.trim(), scope);
    return (
        linkTags.join("\n") +
        '\n<style type="text/css">\n' +
        scoped +
        "\n</style>"
    );
}

function scopeRules(css, scope) {
    let result = "";
    let i = 0;
    const len = css.length;

    while (i < len) {
        const trimmed = css.slice(i).replace(/^\s+/, "");
        i += css.slice(i).length - trimmed.length;
        if (i >= len) break;

        // @media, @supports, @keyframes 등 at-rule 처리
        if (
            /^@(media|supports|document)/.test(trimmed) ||
            /^@(-webkit-)?keyframes\s/.test(trimmed)
        ) {
            const atStart = i;
            const openBrace = css.indexOf("{", i);
            if (openBrace === -1) break;
            let braceCount = 1;
            i = openBrace + 1;
            while (i < len && braceCount > 0) {
                const c = css[i];
                if (c === "{") braceCount++;
                else if (c === "}") braceCount--;
                i++;
            }
            const block = css.slice(atStart, i);
            if (/^@(-webkit-)?keyframes\s/.test(block)) {
                result += block;
            } else {
                const innerContent = block.slice(block.indexOf("{") + 1, -1);
                result +=
                    block.slice(0, block.indexOf("{") + 1) +
                    scopeRules(innerContent, scope) +
                    "}";
            }
            continue;
        }
        const openBrace = css.indexOf("{", i);
        if (openBrace === -1) break;
        const selectors = css.slice(i, openBrace).trim();
        if (!selectors || selectors.startsWith("@")) {
            let bc = 1;
            let k = openBrace + 1;
            while (k < len && bc > 0) {
                if (css[k] === "{") bc++;
                else if (css[k] === "}") bc--;
                k++;
            }
            i = k;
            continue;
        }
        let braceCount = 1;
        let j = openBrace + 1;
        while (j < len && braceCount > 0) {
            const c = css[j];
            if (c === "{") braceCount++;
            else if (c === "}") braceCount--;
            j++;
        }
        const content = css.slice(openBrace + 1, j - 1);
        const scopedSelectors = selectors
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((sel) => {
                const t = sel.replace(/^\s+|\s+$/g, "");
                if (/^(html|body)\s*$/.test(t)) return scope;
                return scope + " " + t;
            })
            .join(", ");
        result += scopedSelectors + " {" + content + "}";
        i = j;
    }
    return result;
}

// Write JSON for Astro to import
const rendered = {
    theme,
    styles: scopedStyles,
    body: bodyContent,
};
writeFileSync(destPath, JSON.stringify(rendered, null, 0), "utf-8");

// Cleanup temp
try {
    unlinkSync(outputPath);
} catch {
    /* ignore */
}

console.log(`Resume exported with theme: ${theme}`);
