import {isEmptyString} from "./utils.lib";

describe('isEmptyString', () => {
  it('should be true for empty string', () => {
    expect(isEmptyString('')).toBeTruthy();
  })

  it('should be true for string with spaces', () => {
    expect(isEmptyString('  ')).toBeTruthy();
  });
})
