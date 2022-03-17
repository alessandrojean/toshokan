import fs from 'fs'
import path from 'path'
import YAML from 'yaml'

import mockEnUsDatetime from './i18n/datetime/en-US'
import mockEnUsNumber from './i18n/number/en-US'

const enUsFile = path.resolve(__dirname, './i18n/messages/en-US.yaml')
const mockMessages = {
  'en-US': YAML.parse(fs.readFileSync(enUsFile).toString())
}

jest.mock('@intlify/vite-plugin-vue-i18n/messages', () => mockMessages, {
  virtual: true
})

// "Mock" the import.meta.globEager.
// It's only used in the i18n files.
process.globEager = (pattern) => {
  const definitions = pattern.includes('datetime')
    ? mockEnUsDatetime
    : mockEnUsNumber

  const moduleFile = pattern.replace('*', 'en-US')

  return { [moduleFile]: { default: definitions } }
}
