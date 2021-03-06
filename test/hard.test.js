const stylelint = require('stylelint')
const path = require('path')
const slash = require('slash')

const processor = path.join(__dirname, '../src/index.js')
const rules = {
  'block-no-empty': true,
  indentation: 2,
  'property-no-unknown': true
}

describe('hard', () => {
  let fixture
  let data

  // NOTE beforeEach() runs _after_ the beforeAll() hooks of the describe() blocks, so `fixture`
  // will have the right path
  beforeEach(done => {
    stylelint
      .lint({
        files: [fixture],
        syntax: 'scss',
        config: {
          processors: [processor],
          rules
        }
      })
      .then(result => {
        data = result
        done()
      })
      .catch(err => {
        data = err
        done()
      })
  })

  describe('extra indentation', () => {
    describe('valid', () => {
      beforeAll(() => {
        fixture = slash(path.join(__dirname, './fixtures/hard/indentation.js'))
      })

      it('should have one result', () => {
        expect(data.results.length).toEqual(1)
      })

      it('should use the right file', () => {
        expect(slash(data.results[0].source)).toEqual(fixture)
      })

      it('should not have errored', () => {
        expect(data.errored).toEqual(false)
      })

      it('should not have any warnings', () => {
        expect(data.results[0].warnings).toEqual([])
      })
    })

    describe('invalid', () => {
      beforeAll(() => {
        fixture = slash(path.join(__dirname, './fixtures/hard/invalid-indentation.js'))
      })

      it('should have one result', () => {
        expect(data.results.length).toEqual(1)
      })

      it('should use the right file', () => {
        expect(slash(data.results[0].source)).toEqual(fixture)
      })

      it('should have errored', () => {
        expect(data.errored).toEqual(true)
      })

      it('should have 13 warnings', () => {
        expect(data.results[0].warnings.length).toEqual(13)
      })

      it('should all be indentation warnings', () => {
        data.results[0].warnings.forEach(warning => {
          expect(warning.rule).toEqual('indentation')
        })
      })
    })
  })

  describe('source maps', () => {
    beforeAll(() => {
      fixture = slash(path.join(__dirname, './fixtures/hard/source-maps.js'))
    })

    it('should have one result', () => {
      expect(data.results.length).toEqual(1)
    })

    it('should use the right file', () => {
      expect(slash(data.results[0].source)).toEqual(fixture)
    })

    it('should have errored', () => {
      expect(data.errored).toEqual(true)
    })

    it('should have six warnings', () => {
      expect(data.results[0].warnings.length).toEqual(6)
    })

    it('should have five warnings about indentation', () => {
      expect(data.results[0].warnings[0].rule).toEqual('property-no-unknown')
      expect(data.results[0].warnings[1].rule).toEqual('indentation')
      expect(data.results[0].warnings[2].rule).toEqual('indentation')
      expect(data.results[0].warnings[3].rule).toEqual('indentation')
      expect(data.results[0].warnings[4].rule).toEqual('indentation')
      expect(data.results[0].warnings[5].rule).toEqual('indentation')
    })

    it('should have a warning in line 5', () => {
      expect(data.results[0].warnings[1].line).toEqual(5)
    })

    it('should have a warning in line 15', () => {
      expect(data.results[0].warnings[2].line).toEqual(15)
    })

    it('should have a warning in line 22', () => {
      expect(data.results[0].warnings[3].line).toEqual(22)
    })

    it('should have a warning in line 28', () => {
      expect(data.results[0].warnings[4].line).toEqual(28)
    })

    it('should have a warning in line 35', () => {
      expect(data.results[0].warnings[5].line).toEqual(35)
    })

    it('should have a warning in line 42, column 31', () => {
      expect(data.results[0].warnings[0].line).toEqual(42)
      expect(data.results[0].warnings[0].column).toEqual(31)
    })
  })

  describe('js style comments', () => {
    describe('valid', () => {
      beforeAll(() => {
        fixture = slash(path.join(__dirname, './fixtures/hard/valid-js-comments.js'))
      })

      it('should have one result', () => {
        expect(data.results.length).toEqual(1)
      })

      it('should use the right file', () => {
        expect(slash(data.results[0].source)).toEqual(fixture)
      })

      it('should not have errored', () => {
        expect(data.errored).toEqual(false)
      })

      it('should not have any warnings', () => {
        expect(data.results[0].warnings).toEqual([])
      })
    })
  })
})
