export type SchoolId = 'luddy' | 'kelley' | 'artsci' | 'gened';

export interface University {
  id: string;
  name: string;
  shortName: string;
  campus: string;
  location: string;
  flagship: boolean;
  status: 'active' | 'coming_soon';
  primaryColor: string;
  secondaryColor: string;
  schools: {
    id: SchoolId;
    name: string;
    description: string;
  }[];
}

export type TermAvailability = 'Fall' | 'Spring' | 'Both' | 'Summer';

export interface WorkloadProfile {
  coding: number; // 0 - 100
  writing: number; // 0 - 100
  projects: number; // 0 - 100
  exams: number; // 0 - 100
  weeklyHoursEstimated: number;
}

export interface Course {
  id: string;
  code: string; // e.g. "CSCI-B 351"
  title: string;
  schoolId: SchoolId;
  department: string;
  credits: number;
  description: string;
  prerequisites: string[]; // Course IDs
  prerequisiteCodes: string[]; // human readable codes
  termOffered: TermAvailability;
  interestTags: string[];
  careerTags: string[];
  workload: WorkloadProfile;
  fulfills: {
    majorIds: string[]; // majors where this counts as core or elective
    category: 'core' | 'specialization' | 'elective' | 'gened' | 'capstone';
    genEdCategory?: 'A&H' | 'S&H' | 'N&M' | 'WL' | 'EnglishComp' | 'MathModeling';
  }[];
  syllabusHighlights: string[];
  averageRating: number; // 1.0 - 5.0
  difficultyRating: number; // 1.0 - 5.0
  professorHighlight: string;
  format: 'Lecture & Lab' | 'Interactive Seminar' | 'Studio / Project' | 'Lecture & Discussion';
}

export interface RequirementCategory {
  id: string;
  name: string;
  description: string;
  requiredCredits: number;
  eligibleCourseIds: string[];
  ruleDescription: string;
}

export interface DegreePlan {
  id: string;
  universityId: string;
  schoolId: SchoolId;
  majorName: string;
  degreeType: 'B.S.' | 'B.A.' | 'B.S. in Business';
  totalCredits: number;
  catalogYear: string;
  categories: RequirementCategory[];
}

export interface StudentProfile {
  universityId: string;
  schoolId: SchoolId;
  majorId: string;
  minorId?: string;
  currentYear: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  targetGraduation: string; // e.g. "Spring 2028"
  careerGoals: string[];
  interestTags: string[];
  workStyle: {
    projectVsExam: number; // 0: Pure Exams, 100: Pure Projects
    theoreticalVsApplied: number; // 0: Pure Theory, 100: Pure Applied
    groupVsIndividual: number; // 0: Individual, 100: Group Collaboration
  };
  preferredMaxCreditsPerTerm: number;
  completedCourseIds: string[];
}

export interface RecommendationMatch {
  course: Course;
  matchScore: number; // 0 - 100
  matchReasons: string[];
  requirementImpact: string;
  careerAlignment: string;
  workloadFitNote: string;
}

export interface PlannedSemester {
  id: string;
  termName: string; // e.g. "Fall 2026", "Spring 2027"
  courseIds: string[];
  isCurrentOrPast?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: string;
  suggestedCourseIds?: string[];
  promptTopic?: string;
}
