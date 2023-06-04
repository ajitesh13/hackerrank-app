module.exports = {
  packagerConfig: {
    protocols: [
      {
        name: "Electron Fiddle",
        schemes: ["electron-fiddle"],
      },
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        mimeType: ["x-scheme-handler/electron-fiddle"],
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
};
