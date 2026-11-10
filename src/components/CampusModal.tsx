import React from 'react';
import { X, Check, School, Building2, MapPin, Sparkles } from 'lucide-react';
import { University } from '../types';
import { UNIVERSITIES } from '../data/iuCatalog';

interface CampusModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUniversity: University;
  onSelectUniversity: (uni: University) => void;
}

export const CampusModal: React.FC<CampusModalProps> = ({
  isOpen,
  onClose,
  activeUniversity,
  onSelectUniversity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <School className="w-5 h-5 text-[#990000]" />
            <div>
              <h3 className="text-base font-bold text-stone-900">Select Academic Institution</h3>
              <p className="text-xs text-stone-500">CourseCompass is designed to support college degree catalogs across the country.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 space-y-3">
          {UNIVERSITIES.map((uni) => {
            const isActive = uni.id === activeUniversity.id;
            const isLive = uni.status === 'active';

            return (
              <div
                key={uni.id}
                onClick={() => {
                  if (isLive) {
                    onSelectUniversity(uni);
                    onClose();
                  }
                }}
                className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'border-[#990000] bg-stone-50/80 shadow-xs'
                    : isLive
                    ? 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 cursor-pointer'
                    : 'border-stone-200/60 bg-stone-50/40 opacity-75 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0 shadow-xs"
                    style={{ backgroundColor: uni.primaryColor }}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-stone-900">{uni.name}</h4>
                      {uni.flagship && (
                        <span className="text-[11px] font-semibold text-[#990000] bg-[#990000]/10 px-2 py-0.5 rounded">
                          Flagship Launch
                        </span>
                      )}
                      {!isLive && (
                        <span className="text-[11px] font-medium text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {uni.campus}
                      </span>
                      {isLive && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-600 font-medium">Luddy · Kelley · Arts & Sciences</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-[#990000] text-white flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  ) : isLive ? (
                    <span className="text-xs font-semibold text-stone-600 hover:text-stone-900">
                      Select
                    </span>
                  ) : (
                    <span className="text-xs text-stone-400">Expanding</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
          <Sparkles className="w-4 h-4 text-[#990000] shrink-0" />
          <span>
            Indiana University Bloomington features 35+ verified courses with degree audits for Luddy CS, Informatics, Kelley, and Psychology.
          </span>
        </div>
      </div>
    </div>
  );
};
