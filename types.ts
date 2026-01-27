
export type Year = 'third' | 'fourth';

export interface Department {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  nationalId: string;
  year: Year;
  departmentId: string;
  instituteId: string;
}

export interface Institute {
  id: string;
  name: string;
  location: string;
  maxCapacity: number;
  currentCount: number;
  departmentId: string;
  year: Year;
}

export interface User {
  username: string;
  role: 'admin' | 'student';
}
