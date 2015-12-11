require('core-js');
const expect = require('chai').expect;

const Exposer = require('./exposer');

describe('Exposer', () => {
  it('defines attributes whose values can be inspected', () => {
    const exposer = Exposer();
    const attribute = exposer.expose('attribute');
    attribute.push('a value');
    expect(attribute.value()).to.eq('a value');
  });

  it('defines attributes whose values can be subscribed to', (done) => {
    const exposer = Exposer();
    const attribute = exposer.expose('attribute');
    attribute.push('a value');
    exposer.subscribe('attribute', (value) => {
      expect(value).to.eq('a value');
      done();
    });
  });
});
