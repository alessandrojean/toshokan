module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' }, modules: 'auto' }]
  ],
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
