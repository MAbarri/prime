import { TokenDecimalsPipe } from './token-decimals.pipe';

describe('TokenDecimalsPipe', () => {
  it('create an instance', () => {
    const pipe = new TokenDecimalsPipe();
    expect(pipe).toBeTruthy();
  });
});
