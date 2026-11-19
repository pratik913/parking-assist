import{describe,expect,it}from'vitest';import{calculateParkingEstimate}from'./booking-pricing';
describe('calculateParkingEstimate',()=>{
 it('calculates the displayed estimate for whole-hour parking',()=>expect(calculateParkingEstimate(30,3)).toBe(90));
 it('supports a zero-rate listing without inventing a fee',()=>expect(calculateParkingEstimate(0,2)).toBe(0));
 it('rejects negative rates',()=>expect(()=>calculateParkingEstimate(-1,2)).toThrow(RangeError));
 it('rejects fractional or out-of-range durations',()=>{expect(()=>calculateParkingEstimate(20,1.5)).toThrow(RangeError);expect(()=>calculateParkingEstimate(20,25)).toThrow(RangeError)});
 it('rejects non-finite rates',()=>expect(()=>calculateParkingEstimate(Number.NaN,1)).toThrow(RangeError));
});