import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Award,
  Sparkles,
  Plus,
  Check,
  Clock,
  User,
} from 'lucide-react';
import { Course, RecommendationMatch, StudentProfile } from '../types';

interface CourseDetailModalProps {
  course: Course | null;
  recommendationMatch?: RecommendationMatch;
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onAddToPlanner: (courseId: string, term: string) => void;
  isAlreadyPlanned?: boolean;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  recommendationMatch,
  profile,
  isOpen,
  onClose,
  onAddToPlanner,
  isAlreadyPlanned = false,
}) => {
  const [selectedTerm, setSelectedTerm] = useState('Fall 2026');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen || !course) return null;

  const completedSet = new Set(profile.completedCourseIds);
  const prereqStatus = course.prerequisites.map((prereqId, index) => {
    const code = course.prerequisiteCodes[index] || prereqId;
    const isCompleted = completedSet.has(prereqId);
    return { code, isCompleted };
  });

  const allPrereqsMet = prereqStatus.every((p) => p.isCompleted);

  const handleAdd = () => {
    onAddToPlanner(course.id, selectedTerm);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-stone-100 bg-stone-50/70">
          <div>
            <div className="flex items-center gap-3 text-xs text-stone-500 mb-1.5 font-medium">
              <span className="font-mono text-stone-900 font-bold">{course.code}</span>
              <span aria-hidden="true">·</span>
              <span>{course.credits} Credits</span>
              <span aria-hidden="true">·</span>
              <span>{course.department}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{course.termOffered} Term</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">{course.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Match Score Banner (if match available) */}
          {recommendationMatch && (
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#990000] text-white flex flex-col items-center justify-center font-mono shrink-0 shadow-xs">
                <span className="text-xs font-bold leading-none">{recommendationMatch.matchScore}%</span>
                <span className="text-[9px] uppercase tracking-wider text-stone-200">Fit</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-stone-900">Why this course matches your profile:</h4>
                <ul className="text-xs text-stone-600 space-y-0.5 list-disc list-inside">
                  {recommendationMatch.matchReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              Course Overview
            </h3>
            <p className="text-stone-700 leading-relaxed text-xs sm:text-sm">
              {course.description}
            </p>
          </div>

          {/* Syllabus & Core Modules */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              Key Syllabus Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.syllabusHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs text-stone-700"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#990000] mt-0.5 shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Workload Profile Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Workload & Evaluation Format
              </h3>
              <span className="text-xs font-mono text-stone-500">
                ~{course.workload.weeklyHoursEstimated} hrs/week
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-stone-600 mb-1">
                  <span>Hands-on Projects & Deliverables</span>
                  <span className="font-mono font-medium">{course.workload.projects}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#990000] rounded-full"
                    style={{ width: `${course.workload.projects}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-600 mb-1">
                  <span>Traditional Exams & Quizzes</span>
                  <span className="font-mono font-medium">{course.workload.exams}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-400 rounded-full"
                    style={{ width: `${course.workload.exams}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-600 mb-1">
                  <span>Programming & Technical Labs</span>
                  <span className="font-mono font-medium">{course.workload.coding}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full"
                    style={{ width: `${course.workload.coding}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-600 mb-1">
                  <span>Analytical Writing & Essays</span>
                  <span className="font-mono font-medium">{course.workload.writing}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${course.workload.writing}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Prerequisites Status */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              Prerequisites & Eligibility
            </h3>
            {prereqStatus.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>No prerequisites required. Open for enrollment.</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {prereqStatus.map((prereq, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${
                      prereq.isCompleted
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/60 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {prereq.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span className="font-mono font-semibold">{prereq.code}</span>
                    </div>
                    <span className="text-[11px] font-medium">
                      {prereq.isCompleted ? 'Completed' : 'Pending Enrollment'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Professor & Student Sentiment */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#990000]" />
                Faculty & Course Atmosphere
              </span>
              <div className="flex items-center gap-2 text-stone-500 font-mono">
                <span>Avg Rating: <strong className="text-stone-900">{course.averageRating}</strong>/5</span>
                <span>·</span>
                <span>Difficulty: <strong className="text-stone-900">{course.difficultyRating}</strong>/5</span>
              </div>
            </div>
            <p className="text-stone-600 italic">"{course.professorHighlight}"</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            <span className="text-stone-600 font-medium whitespace-nowrap">Target Term:</span>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 font-medium"
            >
              <option value="Fall 2026">Fall 2026</option>
              <option value="Spring 2027">Spring 2027</option>
              <option value="Fall 2027">Fall 2027</option>
              <option value="Spring 2028">Spring 2028</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleAdd}
              disabled={addedSuccess}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : isAlreadyPlanned
                  ? 'bg-stone-800 text-white hover:bg-stone-900'
                  : 'bg-[#990000] text-white hover:bg-[#7A0000]'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to {selectedTerm}!</span>
                </>
              ) : isAlreadyPlanned ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>In Plan · Add to Another Term</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to {selectedTerm}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
