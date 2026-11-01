import React, { useState, useEffect } from 'react';
import { Course, CEFRLevel } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useData } from '../../contexts/DataContext';
import { mockCourseService } from '../../services/mockCourseService';
import { useToast } from '../../contexts/ToastContext';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: Course | null;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  courseToEdit,
}) => {
  const { users, reloadAll } = useData();
  const { showToast } = useToast();
  const teachers = users.filter(u => u.role === 'teacher');

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [level, setLevel] = useState<CEFRLevel>('B2');
  const [teacherId, setTeacherId] = useState('');
  const [schedule, setSchedule] = useState('');
  const [academicPeriod, setAcademicPeriod] = useState('Ciclo Lectivo 2026');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (courseToEdit) {
      setName(courseToEdit.name);
      setCode(courseToEdit.code);
      setLevel(courseToEdit.level);
      setTeacherId(courseToEdit.teacherId);
      setSchedule(courseToEdit.schedule);
      setAcademicPeriod(courseToEdit.academicPeriod);
      setDescription(courseToEdit.description);
    } else {
      setName('');
      setCode(`ENG-${Date.now().toString().slice(-4)}`);
      setLevel('B2');
      setTeacherId(teachers[0]?.id || '');
      setSchedule('Lunes y Miércoles 18:30 - 20:00');
      setAcademicPeriod('Ciclo 2026 - Cuatrimestre 1');
      setDescription('');
    }
  }, [courseToEdit, isOpen, teachers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTeacher = teachers.find(t => t.id === teacherId);
    const teacherName = selectedTeacher?.name || 'Profesor Asignado';

    if (courseToEdit) {
      mockCourseService.updateCourse(courseToEdit.id, {
        name,
        code,
        level,
        teacherId,
        teacherName,
        schedule,
        academicPeriod,
        description,
      });
      showToast('success', 'Curso Actualizado', `El curso "${name}" ha sido actualizado.`);
    } else {
      mockCourseService.createCourse({
        name,
        code,
        level,
        teacherId,
        teacherName,
        studentIds: [],
        schedule,
        academicPeriod,
        description,
      });
      showToast('success', 'Curso Creado', `El curso "${name}" ha sido creado con éxito.`);
    }

    reloadAll();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={courseToEdit ? 'Editar Curso' : 'Crear Nuevo Curso'}
      subtitle="Define el nivel CEFR, el docente titular y la descripción pedagógica."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Curso</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="ej. Cambridge B2 First (FCE) - Preparación"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Código del Curso</label>
            <input
              type="text"
              required
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="ej. FCE-B2-01"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nivel Marco Común Europeo (CEFR)</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value as CEFRLevel)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            >
              <option value="A1">A1 - Inicial / Breakthrough</option>
              <option value="A2">A2 - Elemental / Waystage</option>
              <option value="B1">B1 - Intermedio / Threshold</option>
              <option value="B2">B2 - Intermedio Alto / Vantage</option>
              <option value="C1">C1 - Avanzado / Effective Operational</option>
              <option value="C2">C2 - Maestría / Mastery</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Docente Asignado</label>
            <select
              value={teacherId}
              onChange={e => setTeacherId(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Horario y Días</label>
            <input
              type="text"
              required
              value={schedule}
              onChange={e => setSchedule(e.target.value)}
              placeholder="ej. Lunes y Miércoles 18:30 - 20:00"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Período Académico</label>
          <input
            type="text"
            required
            value={academicPeriod}
            onChange={e => setAcademicPeriod(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción / Objetivos</label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Objetivos pedagógicos, formato de examen Cambridge o contenido temático."
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {courseToEdit ? 'Guardar Cambios' : 'Crear Curso'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
