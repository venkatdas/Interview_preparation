- Removing console.log statements from code across an entire project can be done efficiently using several approaches, ranging from manual removal to automated solutions like tools, scripts, or build-time configurations. Here are the most effective methods:

**1. Use ESLint Rules**

- Install ESLint if not there,

`npm install eslint --save-dev`

- Add the no-console rule in the ESLint configuration file (.eslintrc or .eslintrc.json) or eslint.config.js(vite file)

```js
{
    "rules": {
        "no-console": "warn"
    }
}

```

---

```js
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-console": "warn", // Add this line
    },
  },
];
```

- Run ESLint to identify and optionally fix console logs:

`npx eslint .`
`npx eslint . --fix`

**2. Use a Build-Time Plugin or Configuration**

- Webpack
- If you're using Webpack, you can remove console.log statements during the build process by using the Terser Plugin.

- Install Terser

`npm install terser-webpack-plugin --save-dev`

- Configure Terser in webpack.config.js:

```js
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Removes console statements
          },
        },
      }),
    ],
  },
};
```

- Build th eproject
  `npm run build`

**Remove Logs Dynamically in Production**

- You can override console.log globally in production builds to prevent logging without removing them from the source code.

```js
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
}
```

- Place this snippet in the entry point (e.g., index.js or App.js).
