import {clauseRegexes, filterCommandTypeRegexes} from "./memory-nodes.lib";

describe('filterCommandTypeRegexes', function() {

  it('should get next < operator with spaces', function () {
    const originalString = ' count < 57 absdsdasd '
    const match = filterCommandTypeRegexes['<'].exec(originalString);
    expect(match).toBeTruthy();
    expect(match).not.toBeNull();
    if (match) {
      expect(match[0]).toBe(originalString);
      expect(match[1]).toBe(' count < 57 ');
      expect(match[2]).toBe('count');
      expect(match[3]).toBe('57');
      expect(match[4]).toBe('absdsdasd ');
    }
  });

  it('should get next < operator without spaces', function () {
    const originalString = 'count<57 absdsdasd'
    const match = filterCommandTypeRegexes['<'].exec(originalString);
    expect(match).toBeTruthy();
    expect(match).not.toBeNull();
    if (match) {
      expect(match[0]).toBe(originalString);
      expect(match[1]).toBe('count<57 ');
      expect(match[2]).toBe('count');
      expect(match[3]).toBe('57');
      expect(match[4]).toBe('absdsdasd');
    }
  });

  it('should get next > operator with spaces', function () {
    const originalString = ' count > 57 absdsdasd '
    const match = filterCommandTypeRegexes['>'].exec(originalString);
    expect(match).toBeTruthy();
    expect(match).not.toBeNull();
    if (match) {
      expect(match[0]).toBe(originalString);
      expect(match[1]).toBe(' count > 57 ');
      expect(match[2]).toBe('count');
      expect(match[3]).toBe('57');
      expect(match[4]).toBe('absdsdasd ');
    }
  });

  it('should get next >= operator with spaces', function () {
    const originalString = ' count >= 57 absdsdasd '
    const match = filterCommandTypeRegexes['>='].exec(originalString);
    expect(match).toBeTruthy();
    expect(match).not.toBeNull();
    if (match) {
      expect(match[0]).toBe(originalString);
      expect(match[1]).toBe(' count >= 57 ');
      expect(match[2]).toBe('count');
      expect(match[3]).toBe('57');
      expect(match[4]).toBe('absdsdasd ');
    }
  });

  it('should get next == operator with spaces', function () {
    const originalString = ' count == 57 absdsdasd '
    const match = filterCommandTypeRegexes['=='].exec(originalString);
    expect(match).toBeTruthy();
    expect(match).not.toBeNull();
    if (match) {
      expect(match[0]).toBe(originalString);
      expect(match[1]).toBe(' count == 57 ');
      expect(match[2]).toBe('count');
      expect(match[3]).toBe('57');
      expect(match[4]).toBe('absdsdasd ');
    }
  });

  it('should get next === operator with spaces', function () {
    const originalString = ' count === 57 absdsdasd '
    const match = filterCommandTypeRegexes['==='].exec(originalString);
    expect(match).toBeTruthy();
    expect(match).not.toBeNull();
    if (match) {
      expect(match[0]).toBe(originalString);
      expect(match[1]).toBe(' count === 57 ');
      expect(match[2]).toBe('count');
      expect(match[3]).toBe('57');
      expect(match[4]).toBe('absdsdasd ');
    }
  });

  it('should get next in operator with spaces [a; b]', function () {
    const originalString = ' count in [57; 59] asd2 '
    const match = filterCommandTypeRegexes['in'].exec(originalString);
    expect(match).toBeTruthy();
    expect(match).not.toBeNull();
    if (match) {
      expect(match[0]).toBe(originalString);
      expect(match[1]).toBe(' count in [57; 59] ');
      expect(match[2]).toBe('count');
      expect(match[3]).toBe('[');
      expect(match[4]).toBe('57');
      expect(match[5]).toBe('59');
      expect(match[6]).toBe(']');
      expect(match[7]).toBe('asd2 ');
    }
  });

  it('should get next in operator with spaces [a; b)', function () {
    const originalString = ' count in [57; 59) asd2 '
    const match = filterCommandTypeRegexes['in'].exec(originalString);
    expect(match).toBeTruthy();
    expect(match).not.toBeNull();
    if (match) {
      expect(match[0]).toBe(originalString);
      expect(match[1]).toBe(' count in [57; 59) ');
      expect(match[2]).toBe('count');
      expect(match[3]).toBe('[');
      expect(match[4]).toBe('57');
      expect(match[5]).toBe('59');
      expect(match[6]).toBe(')');
      expect(match[7]).toBe('asd2 ');
    }
  });

  // should parse 2 filter conditions
});

describe('clause regextes', () => {
  it('should be true for simple limit expression', () => {
    const originalString = 'limit 25'
    const match = clauseRegexes['limit'].exec(originalString);
    expect(match).toBeTruthy();
  });

  it('should correctly extract expression parts', () => {
    const restString = ' rest string';
    const exp = 'limit 25' + restString;
    const match = clauseRegexes['limit'].exec(exp);
    expect(match).toBeTruthy();
    if (match) {
      expect(match[0]).toBe(exp);
      expect(match[1]).toBe('25');
      expect(match[2]).toBe(restString);
    }
  });
})
