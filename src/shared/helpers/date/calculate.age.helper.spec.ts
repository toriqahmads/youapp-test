import { calculateAge } from './calculate.age.helper';

describe('Calculate Age Helper', () => {
  it('should be return 27', () => {
    const age = calculateAge(new Date('1997-06-02'));
    expect(age).toBe(27);
  });

  it('should be return 26', () => {
    const age = calculateAge(new Date('1997-06-02'), new Date('2024-05-30'));
    expect(age).toBe(26);
  });
});
