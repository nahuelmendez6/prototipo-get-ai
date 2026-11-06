import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Award, 
  FileCheck2, 
  ArrowRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

export const StudentProgressOverview: React.FC = () => {
  const { role, currentUser } = useAuth();
  const { users, courses, submissions } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const students = users.filter(u => u.role === 'student');

  let visibleStudents = students;
  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    visibleStudents = visibleStudents.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.dni.includes(q)
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Student Progress & Performance
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Longitudinal tracking of Cambridge writing scores, error patterns, and language proficiency.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by student name, email, or ID (DNI)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">
          {visibleStudents.length} registered students
        </span>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleStudents.map(student => {
          const studentCourses = courses.filter(c => c.studentIds.includes(student.id));
          const studentSubmissions = submissions.filter(s => s.studentId === student.id);
          const published = studentSubmissions.filter(s => s.status === 'PUBLISHED' && s.evaluation?.scores?.overallGrade);
          const avg = published.length > 0
            ? (published.reduce((acc, curr) => acc + (curr.evaluation?.scores?.overallGrade || 0), 0) / published.length).toFixed(1)
            : '8.5';

          return (
            <div
              key={student.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{student.name}</h3>
                      <p className="text-[11px] text-slate-400">{student.email}</p>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        ID: {student.dni}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-teal-50 text-teal-800 text-center border border-teal-100">
                    <span className="text-[10px] font-bold block uppercase tracking-wider text-teal-600">Average</span>
                    <span className="text-sm font-black font-mono">{avg}</span>
                  </div>
                </div>

                {/* Courses */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Enrolled Courses:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {studentCourses.map(c => (
                        <span key={c.id} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {c.code}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                    <span>Submitted writings:</span>
                    <span className="font-bold text-slate-800">{studentSubmissions.length} essays</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/student-progress/${student.id}`)}
                  className="w-full text-xs py-1.5 justify-center"
                >
                  <span>View Student Profile & Stats</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
