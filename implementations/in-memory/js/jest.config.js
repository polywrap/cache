module.exports = {
  collectCoverage: false,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: "tsconfig.json",
      diagnostics: false,
    }],
  }  
};
