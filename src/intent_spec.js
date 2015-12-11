require('core-js');
const expect = require('chai').expect;

const Intent = require('./intent');

describe('Intent:', () => {
  it('defines an subscribable, which yields payloads', () => {
    var crushedEnemies = [];

    const Crush = Intent((enemy) => {
      return enemy;
    });

    Crush.subscribe((enemy) => {
      crushedEnemies.push(enemy);
    });

    Crush('jeff');
    Crush('Giga-Fear');
    Crush('soda pop');

    expect(crushedEnemies).to.include('jeff');
    expect(crushedEnemies).to.include('Giga-Fear');
    expect(crushedEnemies).to.include('soda pop');
  });

  it('yields undefined payloads by default', (done) => {
    const FinishTest = Intent();
    FinishTest.subscribe((payload) => {
      expect(payload).to.be.undefined;
      done();
    });
    FinishTest();
  });
});
