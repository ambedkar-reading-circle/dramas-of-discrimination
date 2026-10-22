//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: "all",
  overrides: [
    {
      files: ["**/*.tsx", "**/*.jsx"],
      options: {
        printWidth: 1000,
      },
    },
  ],
};

export default config;
