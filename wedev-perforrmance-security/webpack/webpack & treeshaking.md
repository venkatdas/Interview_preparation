
## Webpack

- Webpack is a bundler used to combine multiple javascript files into single file , called bundle.

- This bundle is used to reduce the number of HTTP requests needed to load the JS code.
- which means browser needs to make only one http request to fetch the entire codebase


![image](https://github.com/user-attachments/assets/1257996e-873d-4ea0-a6fa-120f61ce04f3)



```js
const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  mode: "production",
  entry: "./main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply babel-loader to all .js files
        exclude: /node_modules/, // Exclude dependencies
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  optimization: {
    usedExports: true, // Mark used exports for tree shaking
  },
  plugins:[new BundleAnalyzerPlugin]
};
```
