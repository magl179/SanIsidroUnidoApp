import { JsonValidatePipe } from './json-validate.pipe';

describe('JsonValidatePipe', () => {
  it('create an instance', () => {
    const pipe = new JsonValidatePipe();
    expect(pipe).toBeTruthy();
  });
});
