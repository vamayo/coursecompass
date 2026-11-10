import React from 'react';
import { Compass, GraduationCap, Sparkles, ChevronDown, BookOpen } from 'lucide-react';
import { University } from '../types';

interface NavbarProps {
  activeTab: 'discover' | 'audit' | 'studio' | 'planner' | 'advisor';
  setActiveTab: (tab: 'discover' | 'audit' | 'studio' | 'planner' | 'advisor') => void;
  activeUniversity: University;
  onOpenCampusModal: () => void;
  totalPlannedCredits: number;
  onOpenPlanner: () => void;
  onOpenAdvisorDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeUniversity,
  onOpenCampusModal,
  totalPlannedCredits,
  onOpenPlanner,
  onOpenAdvisorDrawer,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark + subtle campus switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('discover')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#990000] text-white flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-stone-900 leading-tight">
                  CourseCompass
                </span>
              </div>
            </button>

            <span className="text-stone-300 font-light" aria-hidden="true">|</span>

            {/* Campus Selector Trigger */}
            <button
              onClick={onOpenCampusModal}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
              title="Change University Campus"
            >
              <span className="w-2 h-2 rounded-full bg-[#990000]"></span>
              <span className="font-semibold text-stone-900">{activeUniversity.shortName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>
          </div>

          {/* Zone 2: 4–5 single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('discover')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'discover'
                  ? 'text-[#990000] font-semibold border-b-2 border-[#990000] py-4'
                  : 'hover:text-stone-900 py-4'
              }`}
            >
              Discover Courses
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'audit'
                  ? 'text-[#990000] font-semibold border-b-2 border-[#990000] py-4'
                  : 'hover:text-stone-900 py-4'
              }`}
            >
              Degree Audit
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'studio'
                  ? 'text-[#990000] font-semibold border-b-2 border-[#990000] py-4'
                  : 'hover:text-stone-900 py-4'
              }`}
            >
              Interest Studio
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'planner'
                  ? 'text-[#990000] font-semibold border-b-2 border-[#990000] py-4'
                  : 'hover:text-stone-900 py-4'
              }`}
            >
              Term Planner
            </button>
            <button
              onClick={() => setActiveTab('advisor')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'advisor'
                  ? 'text-[#990000] font-semibold border-b-2 border-[#990000] py-4'
                  : 'hover:text-stone-900 py-4'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#990000]" />
              <span>AI Advisor</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenPlanner}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#990000]" />
              <span>Planned:</span>
              <span className="font-mono font-semibold text-stone-900">{totalPlannedCredits} Credits</span>
            </button>

            <button
              onClick={onOpenAdvisorDrawer}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#990000] hover:bg-[#7A0000] rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 bg-stone-50 px-2 py-2 overflow-x-auto text-xs font-medium text-stone-600">
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-2.5 py-1.5 rounded ${activeTab === 'discover' ? 'bg-white text-[#990000] font-semibold shadow-xs' : ''}`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-2.5 py-1.5 rounded ${activeTab === 'audit' ? 'bg-white text-[#990000] font-semibold shadow-xs' : ''}`}
        >
          Degree Audit
        </button>
        <button
          onClick={() => setActiveTab('studio')}
          className={`px-2.5 py-1.5 rounded ${activeTab === 'studio' ? 'bg-white text-[#990000] font-semibold shadow-xs' : ''}`}
        >
          Interests
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className={`px-2.5 py-1.5 rounded ${activeTab === 'planner' ? 'bg-white text-[#990000] font-semibold shadow-xs' : ''}`}
        >
          Planner ({totalPlannedCredits}cr)
        </button>
        <button
          onClick={() => setActiveTab('advisor')}
          className={`px-2.5 py-1.5 rounded ${activeTab === 'advisor' ? 'bg-white text-[#990000] font-semibold shadow-xs' : ''}`}
        >
          AI Advisor
        </button>
      </div>
    </header>
  );
};
