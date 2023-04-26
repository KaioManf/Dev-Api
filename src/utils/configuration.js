const fsExtra = require("fs-extra")

let serverConfiguration

module.exports = () => {
  if (serverConfiguration) {
    return serverConfiguration
  }

  const existsConfigJson = fsExtra.existsSync("../.config.json")

  if (existsConfigJson) {
    serverConfiguration = fsExtra.readJSONSync("../.config.json")

    return serverConfiguration
  }

  const existsConfigJsonSameLevel = fsExtra.existsSync(".config.json")

  if (existsConfigJsonSameLevel) {
    serverConfiguration = fsExtra.readJSONSync(".config.json")

    return serverConfiguration
  }

  throw new Error(
    'Arquivo de configuração inexistente. Crie o arquivo ".config.json" na raíz do projeto baseado no arquivo ".config.example.json"!'
  )
}
