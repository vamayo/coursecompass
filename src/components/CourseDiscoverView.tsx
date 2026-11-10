import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  BookOpen,
  Plus,
  Check,
  ChevronRight,
  GraduationCap,
  Layers,
  Award,
} from 'lucide-react';
import { Course, RecommendationMatch, StudentProfile, DegreePlan } from '../types';

interface CourseDiscoverViewProps {
  recommendations: RecommendationMatch[];
  profile: StudentProfile;
  degreePlan: DegreePlan;
  onSelectCourse: (course: Course, match?: RecommendationMatch) => void;
  onAddToPlanner: (courseId: string, term: string) => void;
  plannedCourseIds: string[];
  initialCategoryFilter?: string | null;
  onClearInitialCategoryFilter?: () => void;
  onNavigateToStudio: () => void;
  onAskAdvisorAboutCourse: (course: Course) => void;
}

export const CourseDiscoverView: React.FC<CourseDiscoverViewProps> = ({
  recommendations,
  profile,
  degreePlan,
  onSelectCourse,
  onAddToPlanner,
  plannedCourseIds,
  initialCategoryFilter,
  onClearInitialCategoryFilter,
  onNavigateToStudio,
  onAskAdvisorAboutCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedRequirement, setSelectedRequirement] = useState<string>(
    initialCategoryFilter || 'all'
  );
  const [selectedWorkload, setSelectedWorkload] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'credits'>('match');

  // Filter and sort recommendations
  const filteredMatches = useMemo(() => {
    return recommendations
      .filter((item) => {
        const { course } = item;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = course.title.toLowerCase().includes(q);
          const matchesCode = course.code.toLowerCase().includes(q);
          const matchesDept = course.department.toLowerCase().includes(q);
          const matchesTags = course.interestTags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesCode && !matchesDept && !matchesTags) {
            return false;
          }
        }

        // School filter
        if (selectedSchool !== 'all' && course.schoolId !== selectedSchool) {
          return false;
        }

        // Requirement filter
        if (selectedRequirement !== 'all') {
          const matchesReq = course.fulfills.some(
            (f) => f.majorIds.includes(profile.majorId) && f.category === selectedRequirement
          );
          if (!matchesReq) return false;
        }

        // Workload filter
        if (selectedWorkload === 'projects' && course.workload.projects < 65) {
          return false;
        }
        if (selectedWorkload === 'low-exams' && course.workload.exams > 35) {
          return false;
        }
        if (selectedWorkload === 'coding' && course.workload.coding < 60) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.course.averageRating - a.course.averageRating;
        }
        if (sortBy === 'credits') {
          return b.course.credits - a.course.credits;
        }
        return b.matchScore - a.matchScore;
      });
  }, [
    recommendations,
    searchQuery,
    selectedSchool,
    selectedRequirement,
    selectedWorkload,
    sortBy,
    profile.majorId,
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      {/* Hero discovery banner with student profile context */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
            <span className="w-2 h-2 rounded-full bg-[#990000]"></span>
            <span>Indiana University Bloomington</span>
            <span aria-hidden="true">·</span>
            <span>{degreePlan.majorName} ({degreePlan.degreeType})</span>
            <span aria-hidden="true">·</span>
            <span>{profile.currentYear}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Personalized Course Discovery
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Courses scored and curated based on your active passions in{' '}
            <strong className="text-white">
              {profile.interestTags.slice(0, 3).join(', ')}
            </strong>{' '}
            and your ambition toward{' '}
            <strong className="text-white">
              {profile.careerGoals[0] || 'Software Engineering'}
            </strong>
            .
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToStudio}
              className="text-xs font-medium text-stone-200 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Adjust Interest Profile & Study Style →
            </button>
            <span className="text-stone-500" aria-hidden="true">·</span>
            <span className="text-xs font-mono text-stone-400">
              Showing {filteredMatches.length} recommended classes
            </span>
          </div>
        </div>

        {/* Decorative subtle backdrop element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-[#990000]/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-4 shadow-xs">
        {/* Search row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course code, title, topic (e.g. CSCI-B 351, UX Design, SQL, Ethics)..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#990000] focus:ring-1 focus:ring-[#990000]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium"
            >
              <option value="match">Match Score (Highest First)</option>
              <option value="rating">Student Rating (Highest First)</option>
              <option value="credits">Credit Hours</option>
            </select>
          </div>
        </div>

        {/* Filter Tabs / Segmented Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100 text-xs">
          {/* Schools filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-stone-400 font-medium mr-1">School:</span>
            <button
              onClick={() => setSelectedSchool('all')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedSchool === 'all'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Schools
            </button>
            <button
              onClick={() => setSelectedSchool('luddy')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedSchool === 'luddy'
                  ? 'bg-[#990000] text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Luddy Computing
            </button>
            <button
              onClick={() => setSelectedSchool('kelley')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedSchool === 'kelley'
                  ? 'bg-[#990000] text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Kelley Business
            </button>
            <button
              onClick={() => setSelectedSchool('artsci')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedSchool === 'artsci'
                  ? 'bg-[#990000] text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Arts & Sciences (Psych)
            </button>
            <button
              onClick={() => setSelectedSchool('gened')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedSchool === 'gened'
                  ? 'bg-[#990000] text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              GenEd & Math
            </button>
          </div>

          {/* Workload filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-stone-400 font-medium mr-1">Workload:</span>
            <button
              onClick={() => setSelectedWorkload('all')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedWorkload === 'all'
                  ? 'bg-stone-800 text-white font-medium'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Any Format
            </button>
            <button
              onClick={() => setSelectedWorkload('projects')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedWorkload === 'projects'
                  ? 'bg-[#990000] text-white font-medium'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Project-Heavy (≥65%)
            </button>
            <button
              onClick={() => setSelectedWorkload('low-exams')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedWorkload === 'low-exams'
                  ? 'bg-[#990000] text-white font-medium'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Low-Exam (≤35%)
            </button>
          </div>
        </div>

        {/* Active Requirement Filter Badge (if applied from Degree Audit) */}
        {selectedRequirement !== 'all' && (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#990000]/10 border border-[#990000]/20 text-xs">
            <span className="text-[#990000] font-medium">
              Filtering specifically for courses fulfilling: <strong>{selectedRequirement.toUpperCase()}</strong>
            </span>
            <button
              onClick={() => {
                setSelectedRequirement('all');
                if (onClearInitialCategoryFilter) onClearInitialCategoryFilter();
              }}
              className="text-xs text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* Course List Grid */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-900">No courses match the current filters</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try loosening your search query or switching your school and workload filters to explore other options.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSchool('all');
              setSelectedRequirement('all');
              setSelectedWorkload('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-[#990000] bg-[#990000]/10 hover:bg-[#990000]/20 rounded-lg transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((matchItem) => {
            const { course, matchScore, matchReasons, requirementImpact } = matchItem;
            const isPlanned = plannedCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top metadata strip: unboxed text with middots */}
                  <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                    <div className="flex items-center gap-1.5 flex-wrap font-medium">
                      <span className="font-mono font-bold text-stone-900">{course.code}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{course.credits} cr</span>
                      <span aria-hidden="true">·</span>
                      <span>{course.department}</span>
                      <span aria-hidden="true">·</span>
                      <span>{course.termOffered}</span>
                    </div>

                    {/* Match Score Display */}
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 font-mono text-xs font-bold text-[#990000]">
                      <span>{matchScore}%</span>
                      <span className="text-[10px] text-stone-500 font-sans font-normal">fit</span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h3
                    onClick={() => onSelectCourse(course, matchItem)}
                    className="text-base font-bold text-stone-900 group-hover:text-[#990000] transition-colors cursor-pointer leading-snug"
                  >
                    {course.title}
                  </h3>

                  {/* Course short description */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Why this matches you */}
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-100 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-stone-800 text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-[#990000]" />
                      <span>Match Rationale:</span>
                    </div>
                    <p className="text-stone-700 leading-normal">
                      {matchReasons[0] || 'Matches your interest and degree concentration.'}
                    </p>
                    <div className="text-[11px] text-[#990000] font-medium pt-0.5">
                      {requirementImpact}
                    </div>
                  </div>

                  {/* Workload metric strip */}
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 font-mono">
                    <span title="Hands-on Project Weight">
                      Projects: <strong className="text-stone-800">{course.workload.projects}%</strong>
                    </span>
                    <span>·</span>
                    <span title="Exams Weight">
                      Exams: <strong className="text-stone-800">{course.workload.exams}%</strong>
                    </span>
                    <span>·</span>
                    <span title="Student Rating">
                      Rating: <strong className="text-stone-800">{course.averageRating}</strong>/5
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-stone-100">
                  <button
                    onClick={() => onSelectCourse(course, matchItem)}
                    className="text-xs font-semibold text-stone-700 hover:text-[#990000] transition-colors cursor-pointer"
                  >
                    View Syllabus & Details →
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onAskAdvisorAboutCourse(course)}
                      title="Ask AI Advisor about this course"
                      className="p-1.5 text-stone-400 hover:text-[#990000] hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onAddToPlanner(course.id, 'Fall 2026')}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        isPlanned
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-900 text-white hover:bg-[#990000]'
                      }`}
                    >
                      {isPlanned ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Planned</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
