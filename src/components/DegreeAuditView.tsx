import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  GraduationCap,
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DegreePlan, StudentProfile, Course } from '../types';
import { DEGREE_PLANS } from '../data/iuCatalog';

interface DegreeAuditViewProps {
  degreePlan: DegreePlan;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  allCourses: Course[];
  plannedCourseIds: string[];
  onFilterCategoryInDiscover: (categoryName: string) => void;
  onSelectCourse: (course: Course) => void;
}

export const DegreeAuditView: React.FC<DegreeAuditViewProps> = ({
  degreePlan,
  profile,
  setProfile,
  allCourses,
  plannedCourseIds,
  onFilterCategoryInDiscover,
  onSelectCourse,
}) => {
  const completedSet = new Set(profile.completedCourseIds);
  const plannedSet = new Set(plannedCourseIds);

  // Compute overall degree completion
  let totalCompletedCredits = 0;
  profile.completedCourseIds.forEach((cId) => {
    const c = allCourses.find((course) => course.id === cId);
    if (c) totalCompletedCredits += c.credits;
  });

  let totalPlannedCredits = 0;
  plannedCourseIds.forEach((cId) => {
    if (!completedSet.has(cId)) {
      const c = allCourses.find((course) => course.id === cId);
      if (c) totalPlannedCredits += c.credits;
    }
  });

  const completionPercentage = Math.min(
    100,
    Math.round(((totalCompletedCredits + totalPlannedCredits) / degreePlan.totalCredits) * 100)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Audit Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#990000] tracking-wider uppercase mb-1">
              <span>Indiana University Bloomington</span>
              <span aria-hidden="true">·</span>
              <span>Degree Progress Audit</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              {degreePlan.majorName} ({degreePlan.degreeType})
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Catalog Year: {degreePlan.catalogYear} · Standard Degree: {degreePlan.totalCredits} Total Credits
            </p>
          </div>

          {/* Switch Major Quick Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Preview Degree:</span>
            <select
              value={profile.majorId}
              onChange={(e) => {
                const newMajor = e.target.value;
                const newPlan = DEGREE_PLANS[newMajor];
                setProfile((prev) => ({
                  ...prev,
                  majorId: newMajor,
                  schoolId: newPlan?.schoolId || 'luddy',
                }));
              }}
              className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium"
            >
              <option value="cs">Luddy: Computer Science (B.S.)</option>
              <option value="info">Luddy: Informatics (B.S.)</option>
              <option value="kelley_fin">Kelley: Finance (B.S.)</option>
              <option value="kelley_mkt">Kelley: Marketing (B.S.)</option>
              <option value="psych">Arts & Sciences: Psychology (B.S.)</option>
            </select>
          </div>
        </div>

        {/* High-level Credit Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="flex justify-between items-baseline text-xs">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-stone-800">
                Completed:{' '}
                <strong className="font-mono text-stone-900">{totalCompletedCredits} cr</strong>
              </span>
              <span className="text-stone-300" aria-hidden="true">|</span>
              <span className="font-semibold text-stone-600">
                Planned:{' '}
                <strong className="font-mono text-stone-900">+{totalPlannedCredits} cr</strong>
              </span>
              <span className="text-stone-300" aria-hidden="true">|</span>
              <span className="text-stone-500 font-mono">
                Remaining:{' '}
                <strong>
                  {Math.max(0, degreePlan.totalCredits - totalCompletedCredits - totalPlannedCredits)} cr
                </strong>
              </span>
            </div>
            <span className="font-mono font-bold text-[#990000]">{completionPercentage}% On Track</span>
          </div>

          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden flex">
            {/* Completed portion */}
            <div
              className="bg-[#990000] h-full transition-all duration-500"
              style={{ width: `${(totalCompletedCredits / degreePlan.totalCredits) * 100}%` }}
              title={`Completed: ${totalCompletedCredits} credits`}
            ></div>
            {/* Planned portion */}
            <div
              className="bg-amber-600/80 h-full transition-all duration-500"
              style={{ width: `${(totalPlannedCredits / degreePlan.totalCredits) * 100}%` }}
              title={`Planned: ${totalPlannedCredits} credits`}
            ></div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#990000]"></span>
              Completed Requirements
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600/80"></span>
              Planned Next Semesters
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-200"></span>
              Unscheduled Remaining
            </span>
          </div>
        </div>
      </div>

      {/* Requirement Categories Breakdown */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#990000]" />
          <span>Curriculum Requirement Blocks</span>
        </h2>

        {degreePlan.categories.map((category) => {
          // Calculate category progress
          let completedInCat = 0;
          let plannedInCat = 0;

          const eligibleCourses = allCourses.filter((c) =>
            category.eligibleCourseIds.includes(c.id)
          );

          eligibleCourses.forEach((c) => {
            if (completedSet.has(c.id)) {
              completedInCat += c.credits;
            } else if (plannedSet.has(c.id)) {
              plannedInCat += c.credits;
            }
          });

          const isSatisfied = completedInCat >= category.requiredCredits;
          const isSatisfiedWithPlanned = completedInCat + plannedInCat >= category.requiredCredits;
          const remainingCredits = Math.max(
            0,
            category.requiredCredits - completedInCat - plannedInCat
          );

          return (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs"
            >
              {/* Category Header */}
              <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900">{category.name}</h3>
                    {isSatisfied ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Completed
                      </span>
                    ) : isSatisfiedWithPlanned ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-amber-600" />
                        In Progress
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        <AlertCircle className="w-3 h-3 text-stone-400" />
                        {remainingCredits} Credits Needed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">{category.description}</p>
                </div>

                {/* 1-click find matching courses action */}
                {!isSatisfied && (
                  <button
                    onClick={() => onFilterCategoryInDiscover(category.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#990000] bg-[#990000]/10 hover:bg-[#990000]/20 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <span>Find Electives</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Progress gauge for this category */}
              <div className="px-5 py-3 border-b border-stone-100 bg-white">
                <div className="flex justify-between text-xs text-stone-500 mb-1.5 font-medium">
                  <span>
                    Progress: <strong className="font-mono text-stone-900">{completedInCat} cr completed</strong>
                    {plannedInCat > 0 && (
                      <span className="text-amber-700 font-mono"> (+{plannedInCat} cr planned)</span>
                    )}
                  </span>
                  <span className="font-mono">{category.requiredCredits} cr required</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#990000] h-full"
                    style={{
                      width: `${Math.min(100, (completedInCat / category.requiredCredits) * 100)}%`,
                    }}
                  ></div>
                  <div
                    className="bg-amber-600/80 h-full"
                    style={{
                      width: `${Math.min(
                        100 - (completedInCat / category.requiredCredits) * 100,
                        (plannedInCat / category.requiredCredits) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Eligible courses list in this category */}
              <div className="divide-y divide-stone-100">
                {eligibleCourses.map((c) => {
                  const isCompleted = completedSet.has(c.id);
                  const isPlanned = plannedSet.has(c.id);

                  return (
                    <div
                      key={c.id}
                      className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-700'
                              : isPlanned
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : isPlanned ? (
                            <Clock className="w-3.5 h-3.5" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-stone-900">{c.code}</span>
                            <span className="text-[11px] text-stone-400 font-mono">({c.credits} cr)</span>
                            <span className="text-xs text-stone-600 truncate hidden sm:inline">
                              · {c.title}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 truncate sm:hidden">{c.title}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isCompleted ? (
                          <span className="text-xs font-medium text-emerald-700">Satisfied</span>
                        ) : isPlanned ? (
                          <span className="text-xs font-medium text-amber-700">On Term Plan</span>
                        ) : (
                          <button
                            onClick={() => onSelectCourse(c)}
                            className="text-xs font-semibold text-stone-600 hover:text-[#990000] cursor-pointer"
                          >
                            Explore Course →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rule Note Footer */}
              <div className="px-5 py-2.5 bg-stone-50 text-[11px] text-stone-500 border-t border-stone-100">
                Rule: {category.ruleDescription}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
