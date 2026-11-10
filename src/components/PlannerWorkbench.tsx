import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  Download,
  Share2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { PlannedSemester, Course, StudentProfile, DegreePlan } from '../types';

interface PlannerWorkbenchProps {
  plannedSemesters: PlannedSemester[];
  setPlannedSemesters: React.Dispatch<React.SetStateAction<PlannedSemester[]>>;
  allCourses: Course[];
  profile: StudentProfile;
  degreePlan: DegreePlan;
  onNavigateToDiscover: () => void;
  onSelectCourse: (course: Course) => void;
}

export const PlannerWorkbench: React.FC<PlannerWorkbenchProps> = ({
  plannedSemesters,
  setPlannedSemesters,
  allCourses,
  profile,
  degreePlan,
  onNavigateToDiscover,
  onSelectCourse,
}) => {
  const [showExportModal, setShowExportModal] = useState(false);

  const completedSet = new Set(profile.completedCourseIds);

  // Helper to remove course from a semester
  const handleRemoveCourse = (termId: string, courseId: string) => {
    setPlannedSemesters((prev) =>
      prev.map((sem) => {
        if (sem.id === termId) {
          return {
            ...sem,
            courseIds: sem.courseIds.filter((id) => id !== courseId),
          };
        }
        return sem;
      })
    );
  };

  // Helper to move course to a different semester
  const handleMoveCourse = (sourceTermId: string, targetTermId: string, courseId: string) => {
    setPlannedSemesters((prev) => {
      return prev.map((sem) => {
        if (sem.id === sourceTermId) {
          return {
            ...sem,
            courseIds: sem.courseIds.filter((id) => id !== courseId),
          };
        }
        if (sem.id === targetTermId && !sem.courseIds.includes(courseId)) {
          return {
            ...sem,
            courseIds: [...sem.courseIds, courseId],
          };
        }
        return sem;
      });
    });
  };

  // Total planned credits across all terms
  const totalPlannedCredits = plannedSemesters.reduce((acc, sem) => {
    const semCredits = sem.courseIds.reduce((cAcc, cId) => {
      const c = allCourses.find((course) => course.id === cId);
      return cAcc + (c?.credits || 0);
    }, 0);
    return acc + semCredits;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#990000] tracking-wider uppercase mb-1">
            <span>Academic Pathway Roadmap</span>
            <span aria-hidden="true">·</span>
            <span>Workload & Prerequisite Validation</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Multi-Semester Course Workbench
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            A balanced academic journey is about sequence and sustainability, not cramming. Inspect total workload, weekly study hours, and prerequisite dependencies across upcoming terms.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Advisor Summary</span>
          </button>

          <button
            onClick={onNavigateToDiscover}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#990000] hover:bg-[#7A0000] rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Discover More Classes</span>
          </button>
        </div>
      </div>

      {/* Semesters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plannedSemesters.map((semester, semIndex) => {
          const semCourses = semester.courseIds
            .map((id) => allCourses.find((c) => c.id === id))
            .filter((c): c is Course => Boolean(c));

          const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);
          const totalHours = semCourses.reduce((sum, c) => sum + c.workload.weeklyHoursEstimated, 0);
          const avgProjects = semCourses.length > 0
            ? Math.round(semCourses.reduce((sum, c) => sum + c.workload.projects, 0) / semCourses.length)
            : 0;
          const avgExams = semCourses.length > 0
            ? Math.round(semCourses.reduce((sum, c) => sum + c.workload.exams, 0) / semCourses.length)
            : 0;

          // Prerequisite checks: courses in previous semesters or in profile.completedCourseIds
          const priorCourseIds = new Set<string>(profile.completedCourseIds);
          for (let i = 0; i < semIndex; i++) {
            plannedSemesters[i].courseIds.forEach((id) => priorCourseIds.add(id));
          }

          const isOverloaded = semCredits > 18;
          const isUnderloaded = semCredits > 0 && semCredits < 12;

          return (
            <div
              key={semester.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {/* Semester Header */}
              <div className="p-5 border-b border-stone-100 bg-stone-50/70">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#990000]" />
                    <h3 className="text-sm font-bold text-stone-900">{semester.termName}</h3>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        isOverloaded
                          ? 'bg-rose-100 text-rose-800'
                          : isUnderloaded
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {semCredits} Credits
                    </span>
                  </div>
                </div>

                {/* Overload / underload alerts */}
                {isOverloaded && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded mt-2.5 border border-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Exceeds standard 18 credit load. Requires academic advisor permission.</span>
                  </div>
                )}
                {isUnderloaded && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded mt-2.5 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Under 12 credits. Minimum 12 credits needed for full-time enrollment status.</span>
                  </div>
                )}

                {/* Workload metrics */}
                {semCourses.length > 0 && (
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono mt-3 pt-2.5 border-t border-stone-200/60">
                    <span>Est. Study: <strong className="text-stone-800">~{totalHours} hrs/wk</strong></span>
                    <span>·</span>
                    <span>Projects: <strong className="text-stone-800">{avgProjects}%</strong></span>
                    <span>·</span>
                    <span>Exams: <strong className="text-stone-800">{avgExams}%</strong></span>
                  </div>
                )}
              </div>

              {/* Course list */}
              <div className="p-4 flex-1 space-y-2.5">
                {semCourses.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-lg">
                    <p className="text-xs text-stone-400">No courses scheduled for {semester.termName}</p>
                    <button
                      onClick={onNavigateToDiscover}
                      className="mt-2 text-xs text-[#990000] font-semibold hover:underline cursor-pointer"
                    >
                      Browse recommended courses →
                    </button>
                  </div>
                ) : (
                  semCourses.map((course) => {
                    // Check prerequisite violations
                    const unmetPrereqs = course.prerequisites.filter(
                      (pId) => !priorCourseIds.has(pId)
                    );

                    return (
                      <div
                        key={course.id}
                        className="p-3.5 rounded-lg border border-stone-200 bg-white hover:border-stone-300 transition-all flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-stone-900">
                                {course.code}
                              </span>
                              <span className="text-xs text-stone-400 font-mono">
                                ({course.credits} cr)
                              </span>
                              <span className="text-[11px] text-stone-500 truncate hidden sm:inline">
                                · {course.department}
                              </span>
                            </div>
                            <h4
                              onClick={() => onSelectCourse(course)}
                              className="text-xs font-bold text-stone-800 hover:text-[#990000] transition-colors cursor-pointer truncate mt-0.5"
                            >
                              {course.title}
                            </h4>
                          </div>

                          <button
                            onClick={() => handleRemoveCourse(semester.id, course.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded transition-colors cursor-pointer shrink-0"
                            title="Remove from semester"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Prerequisite warning if scheduled before satisfied */}
                        {unmetPrereqs.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>
                              Prereq alert: Requires {course.prerequisiteCodes.join(', ')} before this term.
                            </span>
                          </div>
                        )}

                        {/* Move semester footer */}
                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1.5 border-t border-stone-100">
                          <span className="font-medium text-stone-600">Move to:</span>
                          <div className="flex items-center gap-1.5">
                            {plannedSemesters
                              .filter((s) => s.id !== semester.id)
                              .map((otherSem) => (
                                <button
                                  key={otherSem.id}
                                  onClick={() => handleMoveCourse(semester.id, otherSem.id, course.id)}
                                  className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
                                >
                                  {otherSem.termName.split(' ')[0]} '{otherSem.termName.split(' ')[1]?.slice(2)}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Semester footer */}
              <div className="p-3 bg-stone-50 border-t border-stone-100 text-center">
                <button
                  onClick={onNavigateToDiscover}
                  className="text-xs font-semibold text-[#990000] hover:underline cursor-pointer"
                >
                  + Add courses to {semester.termName}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export / Share Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Academic Advisor Meeting Summary
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>

            <div className="bg-stone-50 p-4 rounded-lg font-mono text-xs text-stone-800 space-y-2 overflow-x-auto max-h-72">
              <p className="font-bold">INDIANA UNIVERSITY BLOOMINGTON - COURSECOMPASS PLAN</p>
              <p>Student Major: {degreePlan.majorName} ({degreePlan.degreeType})</p>
              <p>Current Standing: {profile.currentYear} · Target Graduation: {profile.targetGraduation}</p>
              <p>Career Target: {profile.careerGoals.join(', ')}</p>
              <p>Total Planned Credits: {totalPlannedCredits} Credits</p>
              <hr className="border-stone-300 my-2" />
              {plannedSemesters.map((sem) => {
                const semCourses = sem.courseIds
                  .map((id) => allCourses.find((c) => c.id === id))
                  .filter(Boolean) as Course[];
                const credits = semCourses.reduce((sum, c) => sum + c.credits, 0);

                return (
                  <div key={sem.id} className="pt-1">
                    <p className="font-bold underline">
                      {sem.termName} ({credits} Credits):
                    </p>
                    {semCourses.length === 0 ? (
                      <p className="text-stone-400 italic">No courses scheduled</p>
                    ) : (
                      semCourses.map((c) => (
                        <p key={c.id}>
                          - {c.code}: {c.title} ({c.credits} cr)
                        </p>
                      ))
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `IU Bloomington CourseCompass Plan for ${degreePlan.majorName}:\n` +
                      plannedSemesters
                        .map(
                          (sem) =>
                            `${sem.termName}: ` +
                            sem.courseIds
                              .map((id) => allCourses.find((c) => c.id === id)?.code)
                              .filter(Boolean)
                              .join(', ')
                        )
                        .join('\n')
                  );
                  alert('Plan copied to clipboard!');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#990000] hover:bg-[#7A0000] rounded-lg transition-colors cursor-pointer"
              >
                Copy Text for Advisor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
