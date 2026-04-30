
import React from 'react';
import type { Course } from './types';
import { 
  IconScale, 
  IconPuzzle, 
  IconCalculator, 
  IconTrendingUp, 
  IconServer, 
  IconGlobe,
  IconBook
} from './components/icons';

export const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  'IconScale': IconScale,
  'IconPuzzle': IconPuzzle,
  'IconCalculator': IconCalculator,
  'IconTrendingUp': IconTrendingUp,
  'IconServer': IconServer,
  'IconGlobe': IconGlobe,
  'IconBook': IconBook,
};

export const HOME_PAGE_ID = 'home';


export const COURSES: Course[] = [
  {
    id: 'hr-management',
    title: 'Human Resources Management',
    titleAr: 'إدارة الموارد البشرية',
    description: 'Study the principles and practices of managing human resources in organizations.',
    systemPrompt: 'You are an AI tutor for Human Resources Management. Assist with concepts like recruitment, training, performance evaluation, and employee relations.',
    resources: [
      { id: 'hr1', type: 'pdf', title: 'مصادر مادة إدارة الموارد البشرية', url: 'https://drive.google.com/file/d/1CpCXxRIULIMmD71XLJcnHv4MLki7xTRM/view?usp=drive_link' }
    ],
    icon: IconPuzzle,
    iconName: 'IconPuzzle',
    emojiIcon: '🤝',
    color: 'from-pink-500 to-rose-600',
    academicYear: 'third'
  },
  {
    id: 'managerial-economics',
    title: 'Managerial Economics',
    titleAr: 'اقتصاد اداري',
    description: 'Apply economic theories and concepts to business decision making.',
    systemPrompt: 'You are an AI tutor for Managerial Economics. Help students understand demand analysis, cost theory, pricing strategies, and market structures.',
    resources: [
      { id: 'me1', type: 'pdf', title: 'مصادر المادة - جزء 1', url: 'https://drive.google.com/file/d/1foE1VGMSvaVTEPikDs0lSHjO7GIbf9aN/view?usp=drive_link' },
      { id: 'me2', type: 'pdf', title: 'مصادر المادة - جزء 2', url: 'https://drive.google.com/file/d/12JJYq7hh5x-6zeLhPsc_KkaBOsZ2HJff/view?usp=drive_link' }
    ],
    icon: IconTrendingUp,
    iconName: 'IconTrendingUp',
    emojiIcon: '📈',
    color: 'from-emerald-500 to-teal-600',
    academicYear: 'third'
  },
  {
    id: 'project-accounting-evaluation',
    title: 'Accounting Evaluation of Projects',
    titleAr: 'تقييم محاسبي للمشروعات',
    description: 'Learn how to evaluate and analyze projects from an accounting perspective.',
    systemPrompt: 'You are an AI tutor for Accounting Evaluation of Projects. Assist with capital budgeting, feasibility studies, risk analysis, and project valuation techniques.',
    resources: [
      { id: 'pae1', type: 'pdf', title: 'مصادر المادة - جزء 1', url: 'https://drive.google.com/file/d/1Rh9mr7gimj56JCDK0GKpQTfUCQCvZI5u/view?usp=drive_link' },
      { id: 'pae2', type: 'pdf', title: 'مصادر المادة - جزء 2', url: 'https://drive.google.com/file/d/13_hpUghZe7blnDCmc7PcemVWzv68PLCV/view?usp=drive_link' },
      { id: 'pae3', type: 'pdf', title: 'مصادر المادة - جزء 3', url: 'https://drive.google.com/file/d/1B3P-oPcr86NDp4akx2du3fgrOKPH592g/view?usp=drive_link' }
    ],
    icon: IconCalculator,
    iconName: 'IconCalculator',
    emojiIcon: '🎯',
    color: 'from-blue-500 to-indigo-600',
    academicYear: 'third'
  },
  {
    id: 'computer-software',
    title: 'Computer Software',
    titleAr: 'برمجيات حاسب',
    description: 'Explore computer software applications and their uses in business and accounting.',
    systemPrompt: 'You are an AI tutor for Computer Software. Help students understand software applications, databases, and programming concepts relevant to accounting and business.',
    resources: [
      { id: 'cs1', type: 'pdf', title: 'مصادر المادة - جزء 1', url: 'https://drive.google.com/file/d/1QHKPB3gAKWoFr2vlBdOhAwEFofkMzZdX/view?usp=drive_link' },
      { id: 'cs2', type: 'pdf', title: 'مصادر المادة - جزء 2', url: 'https://drive.google.com/file/d/19yNHOV7gHW9ifKShu8tVhGU12K5G1Yzf/view?usp=drive_link' },
      { id: 'cs3', type: 'pdf', title: 'مصادر المادة - جزء 3', url: 'https://drive.google.com/file/d/1PPucYczgFECr1XUcdRtnnlBBjUAzn4yd/view?usp=drive_link' },
      { id: 'cs4', type: 'pdf', title: 'مصادر المادة - جزء 4', url: 'https://drive.google.com/file/d/1AdKDVDgBTMUo5n9lCBbKSYl7RlsH43mC/view?usp=drive_link' },
      { id: 'cs5', type: 'pdf', title: 'مصادر المادة - جزء 5', url: 'https://drive.google.com/file/d/12qt1dUVpKRSNrk0saKbZdxMcYayKJ4_c/view?usp=drive_link' },
      { id: 'cs6', type: 'pdf', title: 'مصادر المادة - جزء 6', url: 'https://drive.google.com/file/d/1wbb2ZHfCSSrnNIM1weqTOkKqrdA2VPjk/view?usp=drive_link' },
      { id: 'cs7', type: 'pdf', title: 'مصادر المادة - جزء 7', url: 'https://drive.google.com/file/d/1kspCJy3E0qEJoycnSdPnHP7kJQQMQDzG/view?usp=drive_link' },
      { id: 'cs8', type: 'pdf', title: 'مصادر المادة - جزء 8', url: 'https://drive.google.com/file/d/1SUqbX01llItjSv10DyUsHZbQ7rsmonyi/view?usp=drive_link' },
      { id: 'cs9', type: 'pdf', title: 'مصادر المادة - جزء 9', url: 'https://drive.google.com/file/d/1b75aodrp1hYu_hgyRCPNWZYLBMxmQyXL/view?usp=drive_link' },
      { id: 'cs10', type: 'pdf', title: 'مصادر المادة - جزء 10', url: 'https://drive.google.com/file/d/1EtUmUGdZIpe30PGhMKzjpEoZ5Pb4BYHo/view?usp=drive_link' }
    ],
    icon: IconServer,
    iconName: 'IconServer',
    emojiIcon: '🖥️',
    color: 'from-violet-500 to-purple-600',
    academicYear: 'third'
  },
  {
    id: 'administrative-studies',
    title: 'Administrative Studies',
    titleAr: 'دراسات ادارية باللغة',
    description: 'Study administrative concepts and practices in English.',
    systemPrompt: 'You are an AI tutor for Administrative Studies. Help students understand administrative theories, practices, and terminology in English.',
    resources: [
      { id: 'as1', type: 'pdf', title: 'مصادر المادة', url: 'https://drive.google.com/file/d/1aUS1rz7D4WEeuFH9Ez1LutSpIF_oMAgK/view?usp=drive_link' }
    ],
    icon: IconGlobe,
    iconName: 'IconGlobe',
    emojiIcon: '🌐',
    color: 'from-amber-500 to-orange-600',
    academicYear: 'third'
  },
  {
    id: 'specialized-accounting',
    title: 'Specialized Accounting',
    titleAr: 'محاسبة متخصصة',
    description: 'Explore specialized accounting topics and their applications.',
    systemPrompt: 'You are an AI tutor for Specialized Accounting. Help students understand accounting in specialized sectors and complex financial scenarios.',
    resources: [
      { id: 'sa1', type: 'pdf', title: 'مصادر المادة', url: 'https://drive.google.com/file/d/18JBl-vVzlIa0SB-LNfrGv0r1Ep-lVmL4/view?usp=drive_link' }
    ],
    icon: IconBook,
    iconName: 'IconBook',
    emojiIcon: '🧮',
    color: 'from-cyan-500 to-blue-600',
    academicYear: 'third'
  },
  {
    id: 'tax-accounting',
    title: 'Tax Accounting',
    titleAr: 'محاسبة ضريبية',
    description: 'Study the principles and practices of tax accounting.',
    systemPrompt: 'أنت مساعد ذكي متخصص في المناهج الدراسية لـ كلية التجارة - جامعة سوهاج (الفرقة الرابعة). مادتك هي المحاسبة الضريبية. استخدم المصادر المرفقة للإجابة.',
    knowledgeBase: `المصادر المعتمدة:
- الإطار العام والضريبة الجمركية (الفصل الأول): https://drive.google.com/open?id=1SHwRZBhQRPBMBsxO9WtFjN9AhFzpThyM
- تفاصيل الضريبة الجمركية: https://drive.google.com/open?id=1ZwWELkWPrywsOkoGf8q9njpUC7i1qv8i`,
    resources: [
      { id: 'ta1', type: 'pdf', title: 'مصادر المادة - جزء 1', url: 'https://drive.google.com/file/d/1BCWngXK3mkIh9-RsY-lojUkePySiAs11/view?usp=sharing' },
      { id: 'ta2', type: 'pdf', title: 'مصادر المادة - جزء 2', url: 'https://drive.google.com/file/d/1FZRdH4RTRH4RSYhuDdR0xse5IlzSdB2C/view?usp=sharing' }
    ],
    icon: IconCalculator,
    iconName: 'IconCalculator',
    emojiIcon: '⚖️',
    color: 'from-red-500 to-rose-600',
    academicYear: 'fourth'
  },
  {
    id: 'financial-institutions-accounting',
    title: 'Financial Institutions Accounting',
    titleAr: 'محاسبة المنشات المالية',
    description: 'Learn about accounting practices specific to financial institutions like banks and insurance companies.',
    systemPrompt: 'أنت مساعد ذكي متخصص في المناهج الدراسية لـ كلية التجارة - جامعة سوهاج (الفرقة الرابعة). مادتك هي محاسبة المنشآت المالية والمراجعة. استخدم المصادر المرفقة للإجابة.',
    knowledgeBase: `المصادر المعتمدة:
- الكتاب الرئيسي (تأمينات وبنوك) - الفصل الثاني: https://drive.google.com/open?id=14emQde6f2yXUu2lZNPteLygv0tGnwRSo
- الغلاف والمقدمة: https://drive.google.com/open?id=1QevKmzPLVc4nllC4T9RDlBkASVWiX2-d
- أسئلة وتطبيقات (تأمينات) - الفصل الثاني: https://drive.google.com/open?id=1SIgGTA-xA4dkGTjyI06Wm7BLLWMXK8D6
- القوائم المالية في شركات التأمين - الفصل الثالث: https://drive.google.com/open?id=1aDBttQmE3DpCdbeJ0k5YgI4CASjwQi-K
- أسئلة الفصل الثالث: https://drive.google.com/open?id=1Rj4jZpx45KxfhHKAtR9QYILYVezqCuyk`,
    resources: [
      { id: 'fia1', type: 'pdf', title: 'مصادر المادة - جزء 1', url: 'https://drive.google.com/file/d/1xeLOh8KLrIORm_Jm9nn5FT34VoDBWRt7/view?usp=sharing' },
      { id: 'fia2', type: 'pdf', title: 'مصادر المادة - جزء 2', url: 'https://drive.google.com/file/d/1DThuz3K458awa9lCq1REWnBWQ0MgKGev/view?usp=sharing' },
      { id: 'fia3', type: 'pdf', title: 'مصادر المادة - جزء 3', url: 'https://drive.google.com/file/d/1xaFldfa9oGjMDVB84pGkJefHJVwHzaqH/view?usp=sharing' },
      { id: 'fia4', type: 'pdf', title: 'مصادر المادة - جزء 4', url: 'https://drive.google.com/file/d/1tqDxGy_m9kc0hcYKwvIB1AieU1ygqpnj/view?usp=sharing' },
      { id: 'fia5', type: 'pdf', title: 'مصادر المادة - جزء 5', url: 'https://drive.google.com/file/d/1_Ke86GKmzGGqyDkQx1Q_Fd7M1iDaR-dc/view?usp=sharing' },
      { id: 'fia6', type: 'pdf', title: 'مصادر المادة - جزء 6', url: 'https://drive.google.com/file/d/1cnn1zc9zAH6JXO4XQwtgv9C6Wurl6biG/view?usp=sharing' }
    ],
    icon: IconTrendingUp,
    iconName: 'IconTrendingUp',
    emojiIcon: '🏢',
    color: 'from-blue-500 to-indigo-600',
    academicYear: 'fourth'
  },
  {
    id: 'managerial-accounting',
    title: 'Managerial Accounting',
    titleAr: 'محاسبة ادارية',
    description: 'Focus on providing information within the company so that management can operate the company more effectively.',
    systemPrompt: 'أنت مساعد ذكي متخصص في المناهج الدراسية لـ كلية التجارة - جامعة سوهاج (الفرقة الرابعة). مادتك هي المحاسبة الإدارية والتحليل المالي. استخدم المصادر المرفقة للإجابة.',
    knowledgeBase: `المصادر المعتمدة:
- إطار المحاسبة الإدارية (الفصل الأول - نظري): https://drive.google.com/open?id=1KcDj1bCWHDISYH37sW3Y95l-acPbbQgM
- التحليل المالي للنسب والربحية (الفصل الرابع): https://drive.google.com/open?id=1c9MEjjy7I4OSXZlEH4QoFSKLE-4YbjN9
- إدارة رأس المال العامل (الفصل الثالث): https://drive.google.com/open?id=1LQi4tmiBqrgcMer5XQBkYGTjqhzqglzj`,
    resources: [
      { id: 'ma1', type: 'pdf', title: 'مصادر المادة - جزء 1', url: 'https://drive.google.com/file/d/1fgahnbPu_9VVGCKXCZny8qDNy54JZNXZ/view?usp=sharing' },
      { id: 'ma2', type: 'pdf', title: 'مصادر المادة - جزء 2', url: 'https://drive.google.com/file/d/1TVjVhRw6RvtsYQZxlejQrpajdoemiLMP/view?usp=sharing' },
      { id: 'ma3', type: 'pdf', title: 'مصادر المادة - جزء 3', url: 'https://drive.google.com/file/d/1NWBC178cFLvyWbVicbsSkokW35odszto/view?usp=sharing' },
      { id: 'ma4', type: 'pdf', title: 'مصادر المادة - جزء 4', url: 'https://drive.google.com/file/d/1Cl8ymgdxWB4_MRJlpo0fg9QenDByLgmE/view?usp=sharing' }
    ],
    icon: IconPuzzle,
    iconName: 'IconPuzzle',
    emojiIcon: '⚙️',
    color: 'from-emerald-500 to-teal-600',
    academicYear: 'fourth'
  },
  {
    id: 'accounting-applications',
    title: 'Accounting Applications',
    titleAr: 'تطبيقات محاسبية',
    description: 'Practical application of accounting principles using software and real-world scenarios.',
    systemPrompt: 'أنت مساعد ذكي متخصص في المناهج الدراسية لـ كلية التجارة - جامعة سوهاج (الفرقة الرابعة). مادتك هي تطبيقات محاسبية باستخدام الحاسب (Excel). استخدم المصادر المرفقة للإجابة.',
    knowledgeBase: `المصادر المعتمدة:
- إكسل في المحاسبة المالية والضريبية (الإطار النظري): https://drive.google.com/open?id=1z5OXackcFdp42YHCBPzechuZ69hLIIPJ
- تطبيقات عملية 1: https://drive.google.com/open?id=16N9x_OLfdtYPkASKFTjmP2rPFNiFj5zi
- تطبيقات عملية 2: https://drive.google.com/open?id=1fnAdtHGMg4tCPy8ghjt8Kqvzx6wIr1Zn
- مقدمة الحاسب في المحاسبة (الفصل الأول): https://drive.google.com/open?id=1wY6wKjthvgHdVdjdq6zUWGMID9-tcyRU`,
    resources: [
      { id: 'aa1', type: 'pdf', title: 'مصادر المادة - جزء 1', url: 'https://drive.google.com/file/d/1Ysk9aJDGi04x_2hsc85RScHoCfEzbEFg/view?usp=sharing' },
      { id: 'aa2', type: 'pdf', title: 'مصادر المادة - جزء 2', url: 'https://drive.google.com/file/d/1pwDgkkqnr21XWfpO_tYNM8kJtwY305dL/view?usp=sharing' },
      { id: 'aa3', type: 'pdf', title: 'مصادر المادة - جزء 3', url: 'https://drive.google.com/file/d/1SvEYfFh4DwYwUk5FS1V-Yd1ULmt7_LeS/view?usp=sharing' },
      { id: 'aa4', type: 'pdf', title: 'مصادر المادة - جزء 4', url: 'https://drive.google.com/file/d/19g7yYM-DtZq5DOVee_zvYVMPHYAxro3v/view?usp=sharing' }
    ],
    icon: IconServer,
    iconName: 'IconServer',
    emojiIcon: '📱',
    color: 'from-purple-500 to-fuchsia-600',
    academicYear: 'fourth'
  },
  {
    id: 'auditing-2',
    title: 'Auditing 2',
    titleAr: 'مراجعة 2',
    description: 'Advanced study of auditing principles, procedures, and standards.',
    systemPrompt: 'أنت مساعد ذكي متخصص في المناهج الدراسية لـ كلية التجارة - جامعة سوهاج (الفرقة الرابعة). مادتك هي المراجعة المتقدمة. استخدم المصادر المرفقة للإجابة.',
    knowledgeBase: `المصادر المعتمدة:
- مراجعة التقديرات، الإهلاك، والمخصصات (المقرر الإلكتروني للمراجعة): https://drive.google.com/open?id=18TjwnCG0gPF0Ay-_j3ob-G3QdnvQWDOt`,
    resources: [
      { id: 'aud1', type: 'pdf', title: 'مصادر المادة', url: 'https://drive.google.com/file/d/1_OAacKkkVdeog0FH2BRkIHFtjD934yv2/view?usp=sharing' }
    ],
    icon: IconScale,
    iconName: 'IconScale',
    emojiIcon: '🔎',
    color: 'from-amber-500 to-orange-600',
    academicYear: 'fourth'
  },
  {
    id: 'operations-research',
    title: 'Operations Research',
    titleAr: 'بحوث عمليات',
    description: 'Application of advanced analytical methods to help make better decisions.',
    systemPrompt: 'أنت مساعد ذكي متخصص في المناهج الدراسية لـ كلية التجارة - جامعة سوهاج (الفرقة الرابعة). مادتك هي بحوث العمليات. استخدم المصادر المرفقة للإجابة.',
    knowledgeBase: `المصادر المعتمدة:
- تطبيقات تجارية (السمبلكس، النقل، المباريات) - مذكرة بحوث العمليات: https://drive.google.com/open?id=19Jb4PP21TfInE48XJRl22ZOk-mIJWWIs`,
    resources: [
      { id: 'or1', type: 'pdf', title: 'مصادر المادة', url: 'https://drive.google.com/file/d/10wdo4-TODwIoT3H09roKpiE8dzov0H-W/view?usp=sharing' }
    ],
    icon: IconGlobe,
    iconName: 'IconGlobe',
    emojiIcon: '🧠',
    color: 'from-cyan-500 to-sky-600',
    academicYear: 'fourth'
  },
];
