module.exports = function (api) {
    api.cache(false);
    return {
      presets: [
        ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        "nativewind/babel",
      ],
  
      plugins: [
        [
          "module-resolver",
          {
            root: ["./"],
  
            alias: {
              "@": "./",
              "tailwind.config": "./tailwind.config.js",
            },
          },
        ],
        "react-native-reanimated/plugin"
      ],
    };
  };
  