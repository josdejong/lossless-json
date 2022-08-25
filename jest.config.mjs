export default {
  preset: 'ts-jest',

  // allow .js file extensions pointing to .ts files
  // https://stackoverflow.com/questions/66154478/jest-ts-jest-typescript-with-es-modules-import-cannot-find-module
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
}
