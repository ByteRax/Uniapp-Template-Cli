export default {
  parserPreset: {
    parserOpts: {
      headerPattern: /^\[(\w+)\](?:\(([^)]+)\))?:\s(.+)$/,
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  },
  rules: {
    'type-enum': [2, 'always', ['FEAT', 'FIX', 'DOCS', 'STYLE', 'REFACTOR', 'PERF', 'TEST', 'BUILD', 'CI', 'CHORE', 'REVERT']],
    'type-case': [2, 'always', 'upper-case'],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 100]
  }
}
