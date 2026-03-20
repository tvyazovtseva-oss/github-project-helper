export interface PercentileData {
  age: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}

export const WHO_STANDARDS: Record<string, Record<string, PercentileData[]>> = {
  boy: {
    weight: [
      { age: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.4 },
      { age: 1, p3: 3.4, p15: 3.9, p50: 4.5, p85: 5.1, p97: 5.8 },
      { age: 2, p3: 4.3, p15: 4.9, p50: 5.6, p85: 6.3, p97: 7.1 },
      { age: 3, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.2, p97: 8.0 },
      { age: 4, p3: 5.6, p15: 6.2, p50: 7.0, p85: 7.8, p97: 8.7 },
      { age: 5, p3: 6.0, p15: 6.7, p50: 7.5, p85: 8.4, p97: 9.3 },
      { age: 6, p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.8 },
      { age: 9, p3: 7.1, p15: 7.9, p50: 8.9, p85: 9.9, p97: 11.0 },
      { age: 12, p3: 7.7, p15: 8.6, p50: 9.6, p85: 10.8, p97: 12.0 },
      { age: 18, p3: 8.6, p15: 9.7, p50: 10.9, p85: 12.2, p97: 13.7 },
      { age: 24, p3: 9.7, p15: 10.8, p50: 12.2, p85: 13.6, p97: 15.3 },
      { age: 36, p3: 11.3, p15: 12.7, p50: 14.3, p85: 16.2, p97: 18.3 },
      { age: 48, p3: 12.7, p15: 14.4, p50: 16.3, p85: 18.6, p97: 21.2 },
      { age: 60, p3: 14.1, p15: 16.0, p50: 18.3, p85: 21.0, p97: 24.2 },
    ],
    height: [
      { age: 0, p3: 46.1, p15: 48.0, p50: 49.9, p85: 51.8, p97: 53.7 },
      { age: 1, p3: 50.8, p15: 52.8, p50: 54.7, p85: 56.7, p97: 58.6 },
      { age: 2, p3: 54.4, p15: 56.4, p50: 58.4, p85: 60.4, p97: 62.4 },
      { age: 3, p3: 57.3, p15: 59.4, p50: 61.4, p85: 63.5, p97: 65.5 },
      { age: 4, p3: 59.7, p15: 61.8, p50: 63.9, p85: 66.0, p97: 68.0 },
      { age: 5, p3: 61.7, p15: 63.8, p50: 65.9, p85: 68.0, p97: 70.1 },
      { age: 6, p3: 63.3, p15: 65.5, p50: 67.6, p85: 69.8, p97: 71.9 },
      { age: 9, p3: 67.5, p15: 69.7, p50: 72.0, p85: 74.2, p97: 76.5 },
      { age: 12, p3: 71.0, p15: 73.4, p50: 75.7, p85: 78.1, p97: 80.5 },
      { age: 18, p3: 76.9, p15: 79.6, p50: 82.3, p85: 85.0, p97: 87.7 },
      { age: 24, p3: 81.0, p15: 84.1, p50: 87.1, p85: 90.2, p97: 93.2 },
      { age: 36, p3: 88.7, p15: 91.9, p50: 96.1, p85: 99.3, p97: 102.5 },
      { age: 48, p3: 94.9, p15: 99.1, p50: 103.3, p85: 107.5, p97: 111.7 },
      { age: 60, p3: 100.7, p15: 105.3, p50: 110.0, p85: 114.6, p97: 119.2 },
    ],
  },
  girl: {
    weight: [
      { age: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2 },
      { age: 1, p3: 3.2, p15: 3.6, p50: 4.2, p85: 4.8, p97: 5.5 },
      { age: 2, p3: 3.9, p15: 4.5, p50: 5.1, p85: 5.8, p97: 6.6 },
      { age: 3, p3: 4.5, p15: 5.2, p50: 5.8, p85: 6.6, p97: 7.5 },
      { age: 4, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.3, p97: 8.2 },
      { age: 5, p3: 5.4, p15: 6.1, p50: 6.9, p85: 7.8, p97: 8.8 },
      { age: 6, p3: 5.8, p15: 6.5, p50: 7.3, p85: 8.2, p97: 9.2 },
      { age: 9, p3: 6.5, p15: 7.3, p50: 8.2, p85: 9.3, p97: 10.4 },
      { age: 12, p3: 7.0, p15: 7.9, p50: 8.9, p85: 10.1, p97: 11.5 },
      { age: 18, p3: 8.0, p15: 9.1, p50: 10.2, p85: 11.6, p97: 13.2 },
      { age: 24, p3: 9.0, p15: 10.2, p50: 11.5, p85: 13.0, p97: 14.8 },
      { age: 36, p3: 10.8, p15: 12.4, p50: 14.0, p85: 16.0, p97: 18.4 },
      { age: 48, p3: 12.3, p15: 14.0, p50: 16.1, p85: 18.5, p97: 21.5 },
      { age: 60, p3: 13.7, p15: 15.8, p50: 18.2, p85: 21.2, p97: 24.9 },
    ],
    height: [
      { age: 0, p3: 45.4, p15: 47.3, p50: 49.1, p85: 51.0, p97: 52.9 },
      { age: 1, p3: 49.8, p15: 51.7, p50: 53.7, p85: 55.6, p97: 57.6 },
      { age: 2, p3: 53.0, p15: 55.0, p50: 57.1, p85: 59.1, p97: 61.1 },
      { age: 3, p3: 55.6, p15: 57.7, p50: 59.8, p85: 61.9, p97: 64.0 },
      { age: 4, p3: 57.8, p15: 59.9, p50: 62.1, p85: 64.3, p97: 66.4 },
      { age: 5, p3: 59.6, p15: 61.8, p50: 64.0, p85: 66.2, p97: 68.5 },
      { age: 6, p3: 61.2, p15: 63.5, p50: 65.7, p85: 68.0, p97: 70.3 },
      { age: 9, p3: 65.3, p15: 67.7, p50: 70.1, p85: 72.6, p97: 75.0 },
      { age: 12, p3: 68.9, p15: 71.4, p50: 74.0, p85: 76.6, p97: 79.2 },
      { age: 18, p3: 74.9, p15: 77.8, p50: 80.7, p85: 83.6, p97: 86.5 },
      { age: 24, p3: 80.0, p15: 83.2, p50: 86.4, p85: 89.6, p97: 92.9 },
      { age: 36, p3: 87.4, p15: 91.0, p50: 95.1, p85: 98.1, p97: 101.7 },
      { age: 48, p3: 94.1, p15: 98.4, p50: 102.7, p85: 107.0, p97: 111.3 },
      { age: 60, p3: 99.9, p15: 104.7, p50: 109.4, p85: 114.2, p97: 118.9 },
    ],
  },
};

export function getAgeInMonths(birthdate: string, measureDate: string): number {
  const birth = new Date(birthdate);
  const measure = new Date(measureDate);
  const months = (measure.getFullYear() - birth.getFullYear()) * 12 + (measure.getMonth() - birth.getMonth());
  return Math.max(0, months);
}

export function interpolateStandard(standards: PercentileData[], age: number, percentile: keyof PercentileData): number {
  if (age <= standards[0].age) return standards[0][percentile] as number;
  if (age >= standards[standards.length - 1].age) return standards[standards.length - 1][percentile] as number;
  
  for (let i = 0; i < standards.length - 1; i++) {
    if (age >= standards[i].age && age <= standards[i + 1].age) {
      const ratio = (age - standards[i].age) / (standards[i + 1].age - standards[i].age);
      return (standards[i][percentile] as number) + ratio * ((standards[i + 1][percentile] as number) - (standards[i][percentile] as number));
    }
  }
  return standards[standards.length - 1][percentile] as number;
}
