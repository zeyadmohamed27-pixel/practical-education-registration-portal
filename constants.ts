
import { Department, Institute } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'islamic', name: 'دراسات إسلامية' },
  { id: 'arabic', name: 'لغة عربية' },
  { id: 'english', name: 'لغة إنجليزية' },
  { id: 'french', name: 'لغة فرنسية' },
  { id: 'history', name: 'تاريخ' },
  { id: 'geography', name: 'جغرافيا' },
  { id: 'tech', name: 'تكنولوجيا التعليم' },
  { id: 'psychology', name: 'علم نفس' },
  { id: 'special', name: 'تربية خاصة' },
  { id: 'social_basic', name: 'دراسات اجتماعية (تعليم أساسي)' },
  { id: 'arabic_basic', name: 'لغة عربية (تعليم أساسي)' },
];

// Generating some dummy institutes for demonstration
const generateInstitutes = (): Institute[] => {
  const institutes: Institute[] = [];
  const locations = ['تفهنا الأشراف', 'ميت غمر', 'المنصورة', 'السنبلاوين', 'دكرنس'];
  
  ['third', 'fourth'].forEach((year) => {
    DEPARTMENTS.forEach((dept) => {
      locations.forEach((loc, index) => {
        institutes.push({
          id: `${year}-${dept.id}-${index}`,
          name: `معهد ${loc} الأزهري (${index + 1})`,
          location: loc,
          maxCapacity: 6,
          currentCount: Math.floor(Math.random() * 4), // Initial random fill for demo
          departmentId: dept.id,
          year: year as any,
        });
      });
    });
  });
  
  return institutes;
};

export const INITIAL_INSTITUTES = generateInstitutes();
