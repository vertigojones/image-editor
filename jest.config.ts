module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/config/jest.setup.tsx"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
}
