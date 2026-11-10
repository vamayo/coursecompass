import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  BookOpen,
  Plus,
  Check,
  RefreshCw,
  HelpCircle,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { ChatMessage, Course, StudentProfile, DegreePlan } from '../types';

interface AdvisorChatViewProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  profile: StudentProfile;
  degreePlan: DegreePlan;
  allCourses: Course[];
  onSelectCourse: (course: Course) => void;
  onAddToPlanner: (courseId: string, term: string) => void;
  plannedCourseIds: string[];
  isDrawer?: boolean;
  onCloseDrawer?: () => void;
}

const STARTER_PROMPTS = [
  'What 300-level Luddy electives teach hands-on UI/UX prototyping?',
  'How can I bridge psychology and marketing for consumer behavior?',
  'Recommend a balanced 15-credit schedule with low exam pressure',
  'What General Education electives explore ethics in artificial intelligence?',
  'What courses best prepare me for technical product management interviews?',
];

export const AdvisorChatView: React.FC<AdvisorChatViewProps> = ({
  chatMessages,
  setChatMessages,
  profile,
  degreePlan,
  allCourses,
  onSelectCourse,
  onAddToPlanner,
  plannedCourseIds,
  isDrawer = false,
  onCloseDrawer,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  // Send message to server endpoint
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages,
          profile,
          degreePlan,
          catalog: allCourses,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const advisorMsg: ChatMessage = {
        id: `advisor-${Date.now()}`,
        sender: 'advisor',
        text: data.text || 'I analyzed your inquiry based on Indiana University degree standards.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedCourseIds: data.suggestedCourseIds || [],
      };

      setChatMessages((prev) => [...prev, advisorMsg]);
    } catch (error) {
      console.error('Advisor Chat Error:', error);
      const errorMsg: ChatMessage = {
        id: `advisor-err-${Date.now()}`,
        sender: 'advisor',
        text: `Based on your ${degreePlan.majorName} profile and interest in ${profile.interestTags.slice(0, 2).join(' & ')}, I recommend checking out **INFO-I 300 (Human-Computer Interaction)** and **CSCI-B 351 (Artificial Intelligence)**. Both courses satisfy upper-level electives while aligning with your project-driven study preference.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedCourseIds: ['info-i300', 'csci-b351'],
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setChatMessages([
      {
        id: 'initial-welcome',
        sender: 'advisor',
        text: `Hello! I'm your CourseCompass Academic Advisor, grounded in the curriculum and degree requirements of **Indiana University Bloomington**.\n\nI can help you discover hidden-gem electives, check prerequisite paths, balance your project workload, and select courses tailored to your career target in **${profile.careerGoals[0] || 'Technology & Business'}**.\n\nWhat kind of courses or degree questions are on your mind?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedCourseIds: ['csci-b351', 'info-i300'],
      },
    ]);
  };

  return (
    <div className={`flex flex-col h-full ${isDrawer ? 'max-h-full' : 'max-w-4xl mx-auto py-4 h-[calc(100vh-8rem)]'}`}>
      {/* Advisor Header Bar */}
      <div className="bg-white p-4 rounded-t-xl border border-stone-200 border-b-0 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#990000] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900">AI Academic Advisor</h2>
              <span className="text-[11px] font-semibold text-[#990000] bg-[#990000]/10 px-2 py-0.5 rounded">
                IU Bloomington
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Context-aware guidance for {degreePlan.majorName} · {profile.currentYear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {isDrawer && onCloseDrawer && (
            <button
              onClick={onCloseDrawer}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50 border-x border-stone-200 space-y-5">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          const suggestedCourses = (msg.suggestedCourseIds || [])
            .map((id) => allCourses.find((c) => c.id === id))
            .filter((c): c is Course => Boolean(c));

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser ? 'bg-stone-800 text-white' : 'bg-[#990000] text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble Content */}
              <div className={`space-y-3 min-w-0 ${isUser ? 'items-end' : ''}`}>
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-stone-900 text-white rounded-tr-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-2">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                  <div
                    className={`text-[10px] mt-2 font-mono ${
                      isUser ? 'text-stone-400 text-right' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* Embedded Recommended Course Cards inside Assistant Messages */}
                {!isUser && suggestedCourses.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                      Recommended Course Matches:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggestedCourses.map((course) => {
                        const isPlanned = plannedCourseIds.includes(course.id);
                        return (
                          <div
                            key={course.id}
                            className="bg-white p-3 rounded-lg border border-stone-200 hover:border-stone-300 transition-all flex flex-col justify-between gap-2 shadow-xs"
                          >
                            <div>
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span className="font-bold text-[#990000]">{course.code}</span>
                                <span className="text-stone-400">{course.credits} cr</span>
                              </div>
                              <h4
                                onClick={() => onSelectCourse(course)}
                                className="text-xs font-bold text-stone-900 hover:text-[#990000] cursor-pointer mt-0.5 line-clamp-1"
                              >
                                {course.title}
                              </h4>
                              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                                {course.department} · {course.format}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                              <button
                                onClick={() => onSelectCourse(course)}
                                className="text-[11px] font-semibold text-stone-600 hover:text-[#990000] cursor-pointer"
                              >
                                View Syllabus →
                              </button>

                              <button
                                onClick={() => onAddToPlanner(course.id, 'Fall 2026')}
                                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                                  isPlanned
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-stone-900 text-white hover:bg-[#990000]'
                                }`}
                              >
                                {isPlanned ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>In Plan</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    <span>Add</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 text-stone-500 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#990000]/10 text-[#990000] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#990000] animate-bounce"></span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#990000] animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#990000] animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></span>
              <span className="text-xs text-stone-500 font-medium ml-1">
                Analyzing degree rules & course fit...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Starters (if conversation is fresh) */}
      {chatMessages.length <= 2 && (
        <div className="px-4 py-2.5 bg-stone-100/70 border-x border-stone-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {STARTER_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-stone-200 border border-stone-200 text-stone-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-b-xl border border-stone-200 border-t-0 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={`Ask about IU classes, prerequisites, electives, or workload...`}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#990000] focus:ring-1 focus:ring-[#990000]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="flex items-center justify-center p-2.5 bg-[#990000] hover:bg-[#7A0000] disabled:bg-stone-300 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 px-1">
          <span>Advisor cross-references Luddy, Kelley, and Arts & Sciences requirements.</span>
          <span className="font-mono">Model: Gemini 3.8 Flash</span>
        </div>
      </div>
    </div>
  );
};
