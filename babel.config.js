module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
  env: {
    test: {
      plugins: [
        () => ({
          visitor: {
            MetaProperty(path) {
              path.replaceWithSourceString('process')
            }
          }
        })
      ]
    }
  }
}
