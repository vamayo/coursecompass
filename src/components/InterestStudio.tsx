import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  BookOpen,
  Target,
  Brain,
  Plus,
  X,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { StudentProfile, Course } from '../types';
import { DEGREE_PLANS, POPULAR_INTEREST_TAGS, POPULAR_CAREER_GOALS } from '../data/iuCatalog';

interface InterestStudioProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  allCourses: Course[];
  onExploreRecommendations: () => void;
}

export const InterestStudio: React.FC<InterestStudioProps> = ({
  profile,
  setProfile,
  allCourses,
  onExploreRecommendations,
}) => {
  const [customTagInput, setCustomTagInput] = useState('');
  const [customGoalInput, setCustomGoalInput] = useState('');

  const currentDegreePlan = DEGREE_PLANS[profile.majorId] || DEGREE_PLANS.cs;

  // Toggle interest tag
  const handleToggleInterest = (tag: string) => {
    setProfile((prev) => {
      const exists = prev.interestTags.includes(tag);
      const updated = exists
        ? prev.interestTags.filter((t) => t !== tag)
        : [...prev.interestTags, tag];
      return { ...prev, interestTags: updated };
    });
  };

  // Add custom interest tag
  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customTagInput.trim();
    if (trimmed && !profile.interestTags.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        interestTags: [...prev.interestTags, trimmed],
      }));
      setCustomTagInput('');
    }
  };

  // Toggle career goal
  const handleToggleCareerGoal = (goal: string) => {
    setProfile((prev) => {
      const exists = prev.careerGoals.includes(goal);
      const updated = exists
        ? prev.careerGoals.filter((g) => g !== goal)
        : [...prev.careerGoals, goal];
      return { ...prev, careerGoals: updated };
    });
  };

  // Add custom career goal
  const handleAddCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customGoalInput.trim();
    if (trimmed && !profile.careerGoals.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        careerGoals: [...prev.careerGoals, trimmed],
      }));
      setCustomGoalInput('');
    }
  };

  // Toggle completed course
  const handleToggleCompletedCourse = (courseId: string) => {
    setProfile((prev) => {
      const exists = prev.completedCourseIds.includes(courseId);
      const updated = exists
        ? prev.completedCourseIds.filter((id) => id !== courseId)
        : [...prev.completedCourseIds, courseId];
      return { ...prev, completedCourseIds: updated };
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      {/* Header section */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#990000] tracking-wider uppercase">
            Personalization Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-1">
            Student Interest Profile Studio
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Calibrate your intellectual curiosities, target career roles, and study style. CourseCompass continuously adapts its course recommendation rankings and AI advice as your interests evolve.
          </p>
        </div>

        <button
          onClick={onExploreRecommendations}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#990000] hover:bg-[#7A0000] rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
        >
          <span>View Recommended Courses</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Academic Identity & Learning Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. Academic Identity */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-5">
          <div className="flex items-center gap-2 text-stone-900">
            <GraduationCap className="w-5 h-5 text-[#990000]" />
            <h2 className="text-base font-bold">Academic Program & Standing</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1.5">
                Current Indiana University Major
              </label>
              <select
                value={profile.majorId}
                onChange={(e) => {
                  const newMajorId = e.target.value;
                  const newPlan = DEGREE_PLANS[newMajorId];
                  setProfile((prev) => ({
                    ...prev,
                    majorId: newMajorId,
                    schoolId: newPlan?.schoolId || 'luddy',
                  }));
                }}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
              >
                <optgroup label="Luddy School of Informatics, Computing, & Engineering">
                  <option value="cs">Computer Science (B.S.)</option>
                  <option value="info">Informatics (B.S.)</option>
                </optgroup>
                <optgroup label="Kelley School of Business">
                  <option value="kelley_fin">Finance (B.S. in Business)</option>
                  <option value="kelley_mkt">Marketing (B.S. in Business)</option>
                </optgroup>
                <optgroup label="College of Arts and Sciences">
                  <option value="psych">Psychology (B.S.)</option>
                </optgroup>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 mb-1.5">Class Standing</label>
                <select
                  value={profile.currentYear}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      currentYear: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium"
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1.5">Target Graduation</label>
                <input
                  type="text"
                  value={profile.targetGraduation}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      targetGraduation: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium"
                  placeholder="e.g. Spring 2028"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1.5">Minor or Interdisciplinary Cognate</label>
              <input
                type="text"
                value={profile.minorId || ''}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    minorId: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium"
                placeholder="e.g. Human-Computer Interaction, Business, or Math"
              />
            </div>
          </div>
        </div>

        {/* 2. Work Style & Study Preferences */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-5">
          <div className="flex items-center gap-2 text-stone-900">
            <Sliders className="w-5 h-5 text-[#990000]" />
            <h2 className="text-base font-bold">Course Format & Work Style</h2>
          </div>

          <div className="space-y-5 text-xs">
            {/* Slider 1: Projects vs Exams */}
            <div>
              <div className="flex justify-between font-medium text-stone-700 mb-1">
                <span>Traditional Exams</span>
                <span className="font-semibold text-[#990000]">
                  {profile.workStyle.projectVsExam >= 50
                    ? `${profile.workStyle.projectVsExam}% Project-Heavy`
                    : `${100 - profile.workStyle.projectVsExam}% Exam-Oriented`}
                </span>
                <span>Hands-on Projects</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={profile.workStyle.projectVsExam}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setProfile((prev) => ({
                    ...prev,
                    workStyle: { ...prev.workStyle, projectVsExam: val },
                  }));
                }}
                className="w-full accent-[#990000] cursor-pointer"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                {profile.workStyle.projectVsExam >= 60
                  ? 'We will prioritize portfolio-building courses with milestone deliverables.'
                  : 'We will include structured lecture classes with standard exam schedules.'}
              </p>
            </div>

            {/* Slider 2: Theoretical vs Applied */}
            <div>
              <div className="flex justify-between font-medium text-stone-700 mb-1">
                <span>Theoretical & Proofs</span>
                <span className="font-semibold text-[#990000]">
                  {profile.workStyle.theoreticalVsApplied >= 50
                    ? `${profile.workStyle.theoreticalVsApplied}% Applied Practice`
                    : `${100 - profile.workStyle.theoreticalVsApplied}% Theoretical Logic`}
                </span>
                <span>Applied Real-World</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={profile.workStyle.theoreticalVsApplied}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setProfile((prev) => ({
                    ...prev,
                    workStyle: { ...prev.workStyle, theoreticalVsApplied: val },
                  }));
                }}
                className="w-full accent-[#990000] cursor-pointer"
              />
            </div>

            {/* Credit Target */}
            <div>
              <div className="flex justify-between font-medium text-stone-700 mb-1">
                <span>Semester Credit Target</span>
                <span className="font-mono font-semibold text-stone-900">
                  {profile.preferredMaxCreditsPerTerm} Credit Hours
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="18"
                step="1"
                value={profile.preferredMaxCreditsPerTerm}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setProfile((prev) => ({
                    ...prev,
                    preferredMaxCreditsPerTerm: val,
                  }));
                }}
                className="w-full accent-[#990000] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-0.5 font-mono">
                <span>12 cr (Full-Time Min)</span>
                <span>15 cr (Standard)</span>
                <span>18 cr (Max)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Career Aspirations */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-900">
            <Target className="w-5 h-5 text-[#990000]" />
            <h2 className="text-base font-bold">Target Career Vectors & Roles</h2>
          </div>
          <span className="text-xs text-stone-500">
            {profile.careerGoals.length} roles selected
          </span>
        </div>

        <p className="text-xs text-stone-600">
          Select target career pathways so recommendations highlight courses teaching the exact technical, analytical, or strategic competencies recruiters evaluate.
        </p>

        {/* Career chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {POPULAR_CAREER_GOALS.map((goal) => {
            const isSelected = profile.careerGoals.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => handleToggleCareerGoal(goal)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>

        {/* Custom career goal input */}
        <form onSubmit={handleAddCustomGoal} className="flex gap-2 pt-2 max-w-md">
          <input
            type="text"
            value={customGoalInput}
            onChange={(e) => setCustomGoalInput(e.target.value)}
            placeholder="Add specific career aspiration..."
            className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-[#990000]"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* 4. Intellectual Curiosities & Subject Tags */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-900">
            <Brain className="w-5 h-5 text-[#990000]" />
            <h2 className="text-base font-bold">Intellectual Interests & Topics</h2>
          </div>
          <span className="text-xs text-stone-500">
            {profile.interestTags.length} topics active
          </span>
        </div>

        <p className="text-xs text-stone-600">
          What topics spark your curiosity? We search across all schools (Luddy, Kelley, and Arts & Sciences) to unearth courses that match these themes.
        </p>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {POPULAR_INTEREST_TAGS.map((tag) => {
            const isSelected = profile.interestTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleToggleInterest(tag)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Custom tag input */}
        <form onSubmit={handleAddCustomTag} className="flex gap-2 pt-2 max-w-md">
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            placeholder="Add custom topic (e.g. Behavioral Game Theory, Robotics)..."
            className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-[#990000]"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Topic</span>
          </button>
        </form>
      </div>

      {/* 5. Completed Coursework Checklist */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-900">
            <CheckCircle2 className="w-5 h-5 text-[#990000]" />
            <h2 className="text-base font-bold">Completed Courses & Prerequisites</h2>
          </div>
          <span className="text-xs font-mono text-stone-600 bg-stone-100 px-2.5 py-1 rounded">
            {profile.completedCourseIds.length} Courses Completed
          </span>
        </div>

        <p className="text-xs text-stone-600">
          Check off the classes you have already completed. This ensures CourseCompass unlocks downstream prerequisites and filters out courses you have already passed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 max-h-96 overflow-y-auto pr-1">
          {allCourses.map((c) => {
            const isCompleted = profile.completedCourseIds.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleToggleCompletedCourse(c.id)}
                className={`flex items-start gap-2.5 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isCompleted
                    ? 'border-[#990000]/40 bg-[#990000]/5 text-stone-900'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted ? 'bg-[#990000] text-white' : 'border border-stone-300 bg-white'
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-900">{c.code}</span>
                    <span className="text-[11px] text-stone-400 font-mono">({c.credits}cr)</span>
                  </div>
                  <p className="text-xs text-stone-700 truncate mt-0.5">{c.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
