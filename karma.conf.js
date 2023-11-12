module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      'src/**/*.ts', // Add your source files
    ],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'], // Process TypeScript files with karma-typescript
      'test/**/*.spec.ts': ['karma-typescript'],
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['Chrome'], // You can add more browsers if needed
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
    },
  });
};
