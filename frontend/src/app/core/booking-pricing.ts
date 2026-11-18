/** Client-side display estimate only. The server remains authoritative for all payable amounts. */
export function calculateParkingEstimate(hourlyRate:number,durationHours:number):number{
 if(!Number.isFinite(hourlyRate)||hourlyRate<0)throw new RangeError('Hourly rate must be a finite non-negative amount.');
 if(!Number.isInteger(durationHours)||durationHours<1||durationHours>24)throw new RangeError('Duration must be a whole number between 1 and 24 hours.');
 return Math.round(hourlyRate*durationHours);
}