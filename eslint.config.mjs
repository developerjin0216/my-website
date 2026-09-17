import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 배틀·오목 서버는 자체 package.json을 가진 독립 Node(CommonJS) 프로세스라
    // Next.js 프론트엔드용 규칙(require 금지 등)이 적용될 대상이 아닙니다.
    "server/**",
  ]),
]);

export default eslintConfig;
