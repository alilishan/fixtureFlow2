import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier"

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Disables ESLint rules that conflict with Prettier formatting — must be last
    prettier,
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "prisma/migrations/**"]),
])

export default eslintConfig
