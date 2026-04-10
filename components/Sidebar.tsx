
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
      <div className={`p-4 mb-4 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0 hidden'}`}>
            <h1 className="text-2xl font-bold text-white whitespace-nowrap">منصة فينتك</h1>
            <p className="text-sm text-gray-400 whitespace-nowrap">كلية التجارة</p>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="hidden md:block p-1.5 rounded-full hover:bg-gray-700 text-gray-300 transition-colors">
            {isExpanded ? <IconChevronRight className="h-5 w-5" /> : <IconChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      <nav className="flex-1 px-2 space-y-2">
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
        <div className="pt-4">
          <h2 className={`px-2 text-xs font-semibold text-gray-400 uppercase transition-all duration-300 ${!isExpanded ? 'hidden' : 'block'}`}>
            المواد الدراسية
          </h2>
          <div className={`mt-2 space-y-1 ${!isExpanded ? 'flex flex-col items-center' : ''}`}>
            {courses.map((course) => {
              const CourseIcon = (course as any).iconName ? ICON_MAP[(course as any).iconName] || IconBook : (course.icon || IconBook);
              return (
                <NavItem
                  key={course.id}
                  label={course.titleAr}
                  icon={<CourseIcon className="h-5 w-5" />}
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
      <div className={`p-4 border-t border-gray-700 bg-gray-900/50 transition-all duration-300 ${!isExpanded ? 'p-2 flex flex-col items-center' : ''}`}>
        <div className={`flex flex-col ${isExpanded ? 'space-y-3' : 'space-y-4 items-center'}`}>
            {/* User Info */}
            <div className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'}`}>
              <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full object-cover flex-shrink-0 border-2 border-gray-700" />
              {isExpanded && (
                  <div className="flex-grow overflow-hidden">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white whitespace-nowrap text-sm">{user.name}</p>
                      <button onClick={() => setIsEditModalOpen(true)} title="تعديل الملف الشخصي" className="text-gray-400 hover:text-white transition-colors">
                          <IconPencil className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
              )}
              {isExpanded && (
                  <button onClick={onLogout} title="تسجيل الخروج" className="text-gray-400 hover:text-white transition-colors">
                    <IconLogout className="h-5 w-5" />
                  </button>
              )}
            </div>

            {/* Settings Button */}
            <button 
                onClick={onOpenSettings}
                className={`group relative flex items-center text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-all ${isExpanded ? 'w-full px-3 py-2' : 'justify-center p-2 rounded-xl'}`}
            >
                {isExpanded && <span className="me-3 whitespace-nowrap flex-1 text-right">الإعدادات</span>}
                <IconSettings className="h-5 w-5 flex-shrink-0" />
                {!isExpanded && (
                  <div className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                    الإعدادات
                    <div className="absolute top-1/2 -right-1 -mt-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
            </button>

            {!isExpanded && (
               <button onClick={onLogout} className="group relative flex items-center justify-center p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-xl transition-all">
                  <IconLogout className="h-5 w-5" />
                  <div className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                    تسجيل الخروج
                    <div className="absolute top-1/2 -right-1 -mt-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
               </button>
            )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        className="md:hidden fixed top-4 right-4 z-40 p-2 rounded-md bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 z-30 bg-gray-900/80 backdrop-blur-md transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      
      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 z-40 w-72 bg-gray-800 shadow-2xl transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
         <div className="flex flex-col h-full">{navContent}</div>
      </div>

      <div className="hidden md:flex md:flex-shrink-0">
        <div className={`flex flex-col bg-gray-800 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isExpanded ? 'w-72' : 'w-20'}`}>
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
  icon: React.ReactNode;
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
      className={`group relative flex items-center py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
        isExpanded ? 'px-3 mx-2' : 'justify-center mx-2'
      } ${
        isSelected
          ? 'bg-primary-600 text-white shadow-md'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {isExpanded && (
          <span className="me-3 whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-right">
              {label}
          </span>
      )}
      <div className={`flex-shrink-0 transition-colors duration-200 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
        {icon}
      </div>

      {!isExpanded && (
        <div className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
            {label}
            <div className="absolute top-1/2 -right-1 -mt-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </a>
  );
};
