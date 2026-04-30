
import React, { useState } from 'react';
import type { Course, User } from '../types';
import { HOME_PAGE_ID, ICON_MAP } from '../constants';
import { IconHome, IconMenu, IconClose, IconChevronLeft, IconChevronRight, IconLogout, IconPencil, IconSettings, IconBook } from './icons';
import { EditProfileModal } from './EditProfileModal';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  courses: Course[];
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    user, 
    onLogout, 
    onUpdateUser, 
    courses, 
    selectedCourseId, 
    setSelectedCourseId, 
    isExpanded, 
    setIsExpanded, 
    onOpenSettings
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const navContent = (
    <>
      {/* Brand Header */}
      <div className={`pt-6 pb-4 px-4 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} border-b border-transparent`}>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-w-xs opacity-100 flex items-center gap-3' : 'max-w-0 opacity-0 hidden'}`}>
            <img src="https://i.top4top.io/p_3759frad11.png" alt="Fintech" className="w-10 h-10 object-contain drop-shadow-lg filter dark:brightness-110" />
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white whitespace-nowrap leading-tight tracking-wide">فينتك</h1>
              <p className="text-[11px] text-gray-500 dark:text-[#64748b] whitespace-nowrap font-bold uppercase tracking-wider">كلية التجارة</p>
            </div>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-[#1a233a] text-gray-500 dark:text-[#64748b] transition-all border border-gray-200 dark:border-[#2d3748] shadow-sm">
            {isExpanded ? <IconChevronRight className="h-4 w-4" /> : <IconChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-[#2d3748]">
        <div className="mb-6">
          <h2 className={`px-2 mb-3 text-[10px] font-bold text-gray-400 dark:text-[#475569] tracking-widest uppercase transition-all duration-300 ${!isExpanded ? 'hidden' : 'block'}`}>
            الرئيسية
          </h2>
          <NavItem
            label="الرئيسية"
            icon={<IconHome className="h-5 w-5" />}
            isSelected={selectedCourseId === HOME_PAGE_ID}
            onClick={() => {
              setSelectedCourseId(HOME_PAGE_ID);
              setIsMobileMenuOpen(false);
            }}
            isExpanded={isExpanded}
          />
        </div>
        
        <div>
          <h2 className={`px-2 mb-3 text-[10px] font-bold text-gray-400 dark:text-[#475569] tracking-widest uppercase transition-all duration-300 ${!isExpanded ? 'hidden' : 'block'}`}>
            المواد الدراسية
          </h2>
          <div className={`space-y-1.5 ${!isExpanded ? 'flex flex-col items-center' : ''}`}>
            {courses.map((course) => {
              return (
                <NavItem
                  key={course.id}
                  label={course.titleAr}
                  isSelected={selectedCourseId === course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setIsMobileMenuOpen(false);
                  }}
                  isExpanded={isExpanded}
                />
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Footer Actions */}
      <div className={`p-4 transition-all duration-300 ${!isExpanded ? 'p-3 flex flex-col items-center' : ''}`}>
        <div className={`flex flex-col ${isExpanded ? 'space-y-3 bg-white dark:bg-[#131b2f] p-3 rounded-2xl border border-gray-200 dark:border-[#1e293b] shadow-sm' : 'space-y-4 items-center bg-transparent border-none p-0 shadow-none'}`}>
            {/* User Info */}
            <div className={`flex items-center ${isExpanded ? 'space-x-3 w-full' : 'justify-center border-b border-gray-200 dark:border-[#1e293b] pb-4 mb-2'}`}>
              <img src={user.picture} alt={user.name} className={`rounded-xl object-cover border border-gray-200 dark:border-[#2d3748] shadow-sm ml-2 ${isExpanded ? 'w-10 h-10' : 'w-12 h-12 rounded-full'}`} />
              {isExpanded && (
                  <div className="flex-grow min-w-0 pr-2">
                    <div className="flex flex-col">
                      <p className="font-bold text-gray-900 dark:text-white truncate text-sm">{user.name}</p>
                      <button onClick={() => setIsEditModalOpen(true)} className="text-[11px] text-gray-500 dark:text-[#64748b] hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-right flex items-center gap-1 mt-0.5">
                          تعديل الحساب
                          <IconPencil className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
              )}
            </div>

            {/* Quick Actions (Settings / Logout) */}
            <div className={`flex ${isExpanded ? 'gap-2 w-full pt-3 border-t border-gray-100 dark:border-[#1e293b]' : 'flex-col gap-3 w-full'}`}>
              <button 
                  onClick={onOpenSettings}
                  className={`group relative flex items-center justify-center bg-gray-50 dark:bg-[#0b1021] hover:bg-gray-100 dark:hover:bg-[#1a233a] border border-gray-200 dark:border-[#1e293b] text-gray-600 dark:text-[#a0aec0] hover:text-gray-900 dark:hover:text-white rounded-xl transition-all shadow-sm ${isExpanded ? 'flex-1 py-2' : 'p-3 w-full'}`}
              >
                  <IconSettings className="h-[18px] w-[18px]" />
                  
                  {!isExpanded && (
                    <div className="absolute right-full mr-3 px-2 py-1.5 bg-gray-900 dark:bg-[#1a233a] border border-gray-800 dark:border-[#2d3748] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg font-medium">
                      الإعدادات
                      <div className="absolute top-1/2 -right-1 -mt-1 w-2 h-2 border-t border-r border-gray-800 dark:border-[#2d3748] bg-gray-900 dark:bg-[#1a233a] rotate-45"></div>
                    </div>
                  )}
              </button>

              <button 
                  onClick={onLogout} 
                  className={`group relative flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl transition-all shadow-sm ${isExpanded ? 'flex-1 py-2' : 'p-3 w-full'}`}
              >
                  <IconLogout className="h-[18px] w-[18px]" />
                  
                  {!isExpanded && (
                    <div className="absolute right-full mr-3 px-2 py-1.5 bg-gray-900 dark:bg-[#1a233a] border border-gray-800 dark:border-[#2d3748] text-rose-400 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg font-medium">
                      تسجيل الخروج
                      <div className="absolute top-1/2 -right-1 -mt-1 w-2 h-2 border-t border-r border-gray-800 dark:border-[#2d3748] bg-gray-900 dark:bg-[#1a233a] rotate-45"></div>
                    </div>
                  )}
              </button>
            </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        className="md:hidden fixed top-4 right-4 z-40 p-2.5 rounded-xl bg-white dark:bg-[#131b2f] border border-gray-200 dark:border-[#1e293b] text-gray-900 dark:text-white shadow-xl transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 z-30 bg-[#0b1021]/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      
      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 z-40 w-[280px] bg-white dark:bg-[#0b1021] border-l border-gray-200 dark:border-[#1a233a] shadow-2xl transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
         <div className="flex flex-col h-full bg-white dark:bg-transparent">{navContent}</div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] border-l border-gray-200 dark:border-[#1a233a]">
        <div className={`flex flex-col bg-white/80 dark:bg-[#0b1021]/80 backdrop-blur-xl transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isExpanded ? 'w-[280px]' : 'w-[88px]'}`}>
          {navContent}
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedUser) => {
            onUpdateUser(updatedUser);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </>
  );
};

interface NavItemProps {
  label: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  isExpanded: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isSelected, onClick, isExpanded }) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`group relative flex items-center py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
        isExpanded ? 'px-3' : 'justify-center mx-1 w-12 h-12'
      } ${
        isSelected
          ? 'bg-primary-600 shadow-md text-white border border-primary-500/50'
          : 'text-gray-500 dark:text-[#64748b] hover:bg-gray-100 dark:hover:bg-[#1a233a] hover:text-gray-900 dark:hover:text-white border border-transparent'
      }`}
    >
      {isExpanded && (
          <span className={`whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-right ${icon ? 'me-3' : ''}`}>
              {label}
          </span>
      )}
      
      {icon ? (
        <div className={`flex-shrink-0 transition-all duration-300 ${isSelected ? 'text-white' : 'text-gray-400 dark:text-[#475569] group-hover:text-primary-500 dark:group-hover:text-primary-400'}`}>
          {icon}
        </div>
      ) : !isExpanded ? (
        <div className={`flex-shrink-0 font-black text-lg transition-all duration-300 ${isSelected ? 'text-white' : 'text-gray-400 dark:text-[#475569] group-hover:text-primary-500 dark:group-hover:text-primary-400'}`}>
          {label.charAt(0)}
        </div>
      ) : null}

      {!isExpanded && (
        <div className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 dark:bg-[#1a233a] border border-gray-800 dark:border-[#2d3748] text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
            {label}
            <div className="absolute top-1/2 -right-1.5 -mt-1.5 w-3 h-3 border-t border-r border-gray-800 dark:border-[#2d3748] bg-gray-900 dark:bg-[#1a233a] rotate-45"></div>
        </div>
      )}
    </a>
  );
};
