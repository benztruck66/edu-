/**
 * University Types
 * Их сургуулиудын мэдээллийн type definitions
 */

export interface University {
  id: string;
  name: string;
  city: string;
  qsRank: number;
  programs: string[];
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  tuitionMntPerYear?: number;
  acceptanceRatePct?: number;
  logo?: string;
  images: string[];
  scholarships?: Scholarship[];
  payments?: Payment[];
  admins?: UniversityAdmin[];
  address?: string;
  established?: number;
  studentCount?: number;
  internationalStudentsPct?: number;
  facultyCount?: number;
  campusSize?: string;
  accreditation?: string[];
  rankings?: UniversityRanking[];
}

export interface UniversityRanking {
  source: string;
  rank: number;
  year: number;
  category?: string;
}

export type ScholarshipType = 
  | "MERIT" 
  | "NEED_BASED" 
  | "ATHLETIC" 
  | "INTERNATIONAL" 
  | "RESEARCH"
  | "FULL"
  | "PARTIAL";

export interface Scholarship {
  id: string;
  name: string;
  type: ScholarshipType;
  description: string;
  amountMnt?: number;
  coveragePercentage?: number;
  requirements?: string[];
  deadline?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  eligibility?: {
    minGPA?: number;
    minTestScore?: number;
    nationality?: string[];
    fieldOfStudy?: string[];
  };
}

export interface Payment {
  id: string;
  program: string;
  period: string;
  tuitionMnt: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  additionalFees?: {
    registration?: number;
    library?: number;
    lab?: number;
    other?: number;
  };
}

export interface UniversityAdmin {
  id: string;
  userId: string;
  universityId: string;
  isActive: boolean;
  permissions?: string[];
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export type UniversitySortBy = 
  | "rank" 
  | "name" 
  | "tuition" 
  | "acceptance"
  | "studentCount"
  | "established";

export interface UniversityFilters {
  city?: string;
  program?: string;
  search?: string;
  sortBy?: UniversitySortBy;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  minTuition?: number;
  maxTuition?: number;
  minAcceptance?: number;
  maxAcceptance?: number;
  hasScholarships?: boolean;
  minRank?: number;
  maxRank?: number;
}

// Program Types
export interface Program {
  id: string;
  name: string;
  description?: string;
  degree: ProgramDegree;
  duration: number; // in years
  credits?: number;
  language: "mn" | "en" | "both";
  tuitionMnt?: number;
  isActive: boolean;
}

export type ProgramDegree = 
  | "BACHELOR"
  | "MASTER"
  | "DOCTORATE"
  | "DIPLOMA"
  | "CERTIFICATE";

// Review Types
export interface UniversityReview {
  id: string;
  universityId: string;
  userId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  category: ReviewCategory;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt?: Date;
  user?: {
    name: string;
    avatar?: string;
  };
}

export type ReviewCategory = 
  | "EDUCATION_QUALITY"
  | "FACILITIES"
  | "CAMPUS_LIFE"
  | "CAREER_SERVICES"
  | "VALUE_FOR_MONEY"
  | "OVERALL";

// Statistics Types
export interface UniversityStats {
  totalStudents: number;
  internationalStudents: number;
  graduationRate: number;
  employmentRate: number;
  averageSalaryMnt?: number;
  studentToFacultyRatio?: number;
}


