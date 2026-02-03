
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
  // تشعيب التربية الخاصة
  { id: 'special_visual', name: 'تربية خاصة (إعاقة بصرية)' },
  { id: 'special_intellectual', name: 'تربية خاصة (إعاقة فكرية)' },
  { id: 'special_gifted', name: 'تربية خاصة (موهبة وتفوق)' },
  { id: 'special_hearing', name: 'تربية خاصة (إعاقة سمعية)' },
  { id: 'special_learning', name: 'تربية خاصة (صعوبات تعلم)' },
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
        // تخصيص أسماء المعاهد لتناسب التربية الخاصة في حال كانت تخصصاً نوعياً
        let instituteName = `معهد ${loc} الأزهري (${index + 1})`;
        
        // إذا كان القسم يتبع التربية الخاصة، يمكننا إضافة لمسة توضيحية لاسم المعهد
        if (dept.id.startsWith('special_')) {
          instituteName = `معهد ${loc} - دمج (${dept.name.split('(')[1].replace(')', '')})`;
        }

        institutes.push({
          id: `${year}-${dept.id}-${index}`,
          name: instituteName,
          location: loc,
          maxCapacity: 6,
          currentCount: Math.floor(Math.random() * 3), // Initial random fill for demo
          departmentId: dept.id,
          year: year as any,
        });
      });
    });
  });
  
  return institutes;
};

export const INITIAL_INSTITUTES = generateInstitutes();
