import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { CourseDiscoverView } from './components/CourseDiscoverView';
import { DegreeAuditView } from './components/DegreeAuditView';
import { InterestStudio } from './components/InterestStudio';
import { PlannerWorkbench } from './components/PlannerWorkbench';
import { AdvisorChatView } from './components/AdvisorChatView';
import { CourseDetailModal } from './components/CourseDetailModal';
import { CampusModal } from './components/CampusModal';
import {
  StudentProfile,
  PlannedSemester,
  Course,
  RecommendationMatch,
  ChatMessage,
  University,
} from './types';
import {
  UNIVERSITIES,
  COURSES,
  DEGREE_PLANS,
  INITIAL_STUDENT_PROFILE,
} from './data/iuCatalog';
import { calculateCourseRecommendations } from './utils/recommender';
import { Sparkles, X, Check } from 'lucide-react';

const INITIAL_PLANNED_SEMESTERS: PlannedSemester[] = [
  {
    id: 'fall-2026',
    termName: 'Fall 2026',
    courseIds: ['csci-c343', 'csci-b351', 'info-i300', 'stat-s303'],
  },
  {
    id: 'spring-2027',
    termName: 'Spring 2027',
    courseIds: ['csci-b403', 'csci-b455', 'info-i422', 'info-i453'],
  },
  {
    id: 'fall-2027',
    termName: 'Fall 2027',
    courseIds: [],
  },
  {
    id: 'spring-2028',
    termName: 'Spring 2028',
    courseIds: [],
  },
];

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'discover' | 'audit' | 'studio' | 'planner' | 'advisor'>(
    'discover'
  );

  // Active university (Indiana University Bloomington is flagship)
  const [activeUniversity, setActiveUniversity] = useState<University>(UNIVERSITIES[0]);

  // Student profile state (with localStorage persistence)
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('coursecompass_profile_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STUDENT_PROFILE;
  });

  // Planned Semesters roadmap (with localStorage persistence)
  const [plannedSemesters, setPlannedSemesters] = useState<PlannedSemester[]>(() => {
    try {
      const saved = localStorage.getItem('coursecompass_semesters_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PLANNED_SEMESTERS;
  });

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'advisor',
      text: `Welcome to CourseCompass! I'm your contextual Academic Advisor for **Indiana University Bloomington**.\n\nI have loaded your profile for **Computer Science (B.S.)** with your career target in **AI Product Management**.\n\nFeel free to ask me to analyze specific electives, evaluate semester workload balances, or find courses meeting your graduation requirements!`,
      timestamp: '9:00 AM',
      suggestedCourseIds: ['csci-b351', 'info-i300'],
    },
  ]);

  // Modal states
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseMatch, setSelectedCourseMatch] = useState<RecommendationMatch | undefined>(
    undefined
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);
  const [isAdvisorDrawerOpen, setIsAdvisorDrawerOpen] = useState(false);
  const [initialCategoryFilter, setInitialCategoryFilter] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Persist profile and planner changes
  useEffect(() => {
    try {
      localStorage.setItem('coursecompass_profile_v1', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('coursecompass_semesters_v1', JSON.stringify(plannedSemesters));
    } catch (e) {}
  }, [plannedSemesters]);

  // Active degree plan based on student's major
  const currentDegreePlan = useMemo(() => {
    return DEGREE_PLANS[profile.majorId] || DEGREE_PLANS.cs;
  }, [profile.majorId]);

  // Dynamic recommendations calculation
  const recommendations = useMemo(() => {
    return calculateCourseRecommendations(COURSES, profile, currentDegreePlan);
  }, [profile, currentDegreePlan]);

  // Planned course IDs array
  const allPlannedCourseIds = useMemo(() => {
    return plannedSemesters.flatMap((sem) => sem.courseIds);
  }, [plannedSemesters]);

  // Total planned credits
  const totalPlannedCredits = useMemo(() => {
    return allPlannedCourseIds.reduce((sum, cId) => {
      const c = COURSES.find((course) => course.id === cId);
      return sum + (c?.credits || 0);
    }, 0);
  }, [allPlannedCourseIds]);

  // Add course to a specific planned term
  const handleAddToPlanner = (courseId: string, termName: string = 'Fall 2026') => {
    const course = COURSES.find((c) => c.id === courseId);
    setPlannedSemesters((prev) => {
      return prev.map((sem) => {
        if (sem.termName.toLowerCase() === termName.toLowerCase()) {
          if (!sem.courseIds.includes(courseId)) {
            return {
              ...sem,
              courseIds: [...sem.courseIds, courseId],
            };
          }
        }
        return sem;
      });
    });

    if (course) {
      setNotificationToast(`Added ${course.code} to ${termName}`);
      setTimeout(() => setNotificationToast(null), 3000);
    }
  };

  // Select course to open detail modal
  const handleSelectCourse = (course: Course, match?: RecommendationMatch) => {
    setSelectedCourse(course);
    const existingMatch = match || recommendations.find((m) => m.course.id === course.id);
    setSelectedCourseMatch(existingMatch);
    setIsDetailModalOpen(true);
  };

  // Jump from Degree Audit to Discover pre-filtered for a category
  const handleFilterCategoryInDiscover = (categoryId: string) => {
    setInitialCategoryFilter(categoryId);
    setActiveTab('discover');
  };

  // Ask AI advisor specifically about a course
  const handleAskAdvisorAboutCourse = (course: Course) => {
    setActiveTab('advisor');
    setIsAdvisorDrawerOpen(false);

    const promptText = `Can you evaluate ${course.code} (${course.title}) for my plan? How will its workload fit my study style, and what prerequisites or career benefits should I consider?`;

    // Append to messages and trigger send
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Send query to server
    fetch('/api/advisor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: promptText,
        history: chatMessages,
        profile,
        degreePlan: currentDegreePlan,
        catalog: COURSES,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const advisorMsg: ChatMessage = {
          id: `advisor-${Date.now()}`,
          sender: 'advisor',
          text: data.text || 'I analyzed this course for your pathway.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedCourseIds: data.suggestedCourseIds || [course.id],
        };
        setChatMessages((prev) => [...prev, advisorMsg]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1E293B] flex flex-col font-sans">
      {/* Top Bar Contract Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeUniversity={activeUniversity}
        onOpenCampusModal={() => setIsCampusModalOpen(true)}
        totalPlannedCredits={totalPlannedCredits}
        onOpenPlanner={() => setActiveTab('planner')}
        onOpenAdvisorDrawer={() => setIsAdvisorDrawerOpen(true)}
      />

      {/* Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-semibold shadow-lg border border-stone-800 transition-all animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Main View Port Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'discover' && (
          <CourseDiscoverView
            recommendations={recommendations}
            profile={profile}
            degreePlan={currentDegreePlan}
            onSelectCourse={handleSelectCourse}
            onAddToPlanner={handleAddToPlanner}
            plannedCourseIds={allPlannedCourseIds}
            initialCategoryFilter={initialCategoryFilter}
            onClearInitialCategoryFilter={() => setInitialCategoryFilter(null)}
            onNavigateToStudio={() => setActiveTab('studio')}
            onAskAdvisorAboutCourse={handleAskAdvisorAboutCourse}
          />
        )}

        {activeTab === 'audit' && (
          <DegreeAuditView
            degreePlan={currentDegreePlan}
            profile={profile}
            setProfile={setProfile}
            allCourses={COURSES}
            plannedCourseIds={allPlannedCourseIds}
            onFilterCategoryInDiscover={handleFilterCategoryInDiscover}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {activeTab === 'studio' && (
          <InterestStudio
            profile={profile}
            setProfile={setProfile}
            allCourses={COURSES}
            onExploreRecommendations={() => setActiveTab('discover')}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerWorkbench
            plannedSemesters={plannedSemesters}
            setPlannedSemesters={setPlannedSemesters}
            allCourses={COURSES}
            profile={profile}
            degreePlan={currentDegreePlan}
            onNavigateToDiscover={() => setActiveTab('discover')}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {activeTab === 'advisor' && (
          <AdvisorChatView
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            profile={profile}
            degreePlan={currentDegreePlan}
            allCourses={COURSES}
            onSelectCourse={handleSelectCourse}
            onAddToPlanner={handleAddToPlanner}
            plannedCourseIds={allPlannedCourseIds}
          />
        )}
      </main>

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourse}
        recommendationMatch={selectedCourseMatch}
        profile={profile}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onAddToPlanner={handleAddToPlanner}
        isAlreadyPlanned={selectedCourse ? allPlannedCourseIds.includes(selectedCourse.id) : false}
      />

      {/* Campus Selector Modal */}
      <CampusModal
        isOpen={isCampusModalOpen}
        onClose={() => setIsCampusModalOpen(false)}
        activeUniversity={activeUniversity}
        onSelectUniversity={(uni) => setActiveUniversity(uni)}
      />

      {/* Slide-out Persistent AI Advisor Drawer */}
      {isAdvisorDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-xl h-full bg-white shadow-2xl border-l border-stone-200 flex flex-col">
            <AdvisorChatView
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              profile={profile}
              degreePlan={currentDegreePlan}
              allCourses={COURSES}
              onSelectCourse={handleSelectCourse}
              onAddToPlanner={handleAddToPlanner}
              plannedCourseIds={allPlannedCourseIds}
              isDrawer={true}
              onCloseDrawer={() => setIsAdvisorDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Editorial Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white text-stone-500 text-xs py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">CourseCompass</span>
            <span aria-hidden="true">·</span>
            <span>Flagship Campus: Indiana University Bloomington</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Luddy School</span>
            <span aria-hidden="true">·</span>
            <span>Kelley School of Business</span>
            <span aria-hidden="true">·</span>
            <span>College of Arts & Sciences</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
