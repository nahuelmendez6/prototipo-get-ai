import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { mockSubmissionService } from '../../services/mockSubmissionService';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';
import { AIProcessingOverlay } from '../../components/ui/LoadingSpinner';
import { CEFRBadge } from '../../components/ui/Badge';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  FileText,
  User,
  Eye
} from 'lucide-react';

export const HandwrittenSubmissionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedAsgId = searchParams.get('asgId') || '';
  const navigate = useNavigate();
  const { role, currentUser } = useAuth();
  const { assignments, users, reloadAll } = useData();
  const { showToast } = useToast();

  const [assignmentId, setAssignmentId] = useState(preselectedAsgId || (assignments[0]?.id || ''));
  const [studentId, setStudentId] = useState(role === 'student' ? (currentUser?.id || '') : (users.find(u => u.role === 'student')?.id || ''));
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedSampleText, setExtractedSampleText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdSubmissionId, setCreatedSubmissionId] = useState<string | null>(null);

  const selectedAssignment = assignments.find(a => a.id === assignmentId);
  const students = users.filter(u => u.role === 'student');

  // Pre-prepared realistic handwritten notebook sample images
  const sampleSheets = [
    {
      id: 'sheet-1',
      title: 'Redacción FCE B2 Manuscrita (Carlos Gómez)',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900" viewBox="0 0 700 900" style="background:%23fdfaf3;font-family:'Segoe Script', cursive, sans-serif;"><defs><pattern id="l1" width="100" height="28" patternUnits="userSpaceOnUse"><line x1="0" y1="27" x2="100" y2="27" stroke="%23cbd5e1" stroke-width="1.2" /></pattern></defs><rect width="100%" height="100%" fill="%23fdfaf3" /><rect x="40" y="30" width="620" height="840" fill="url(%23l1)" /><line x1="100" y1="30" x2="100" y2="870" stroke="%23f87171" stroke-width="1.5" /><text x="120" y="55" font-size="18" font-weight="bold" fill="%231e3a8a">English Writing Task - B2 First</text><text x="120" y="112" font-size="16" fill="%230f172a">Nowadays, remote working is becoming more popular everyday.</text><text x="120" y="140" font-size="16" fill="%230f172a">In my opinion, working from home have many positive aspects,</text><text x="120" y="168" font-size="16" fill="%230f172a">although it also brings some serious disadvantages for workers.</text><text x="120" y="196" font-size="16" fill="%230f172a">Firstly, people save a lot of time because they don't must commute.</text><text x="120" y="224" font-size="16" fill="%230f172a">This allow them to spend more time with their families.</text></svg>`,
      text: `Nowadays, remote working is becoming more popular everyday. In my opinion, working from home have many positive aspects, although it also brings some serious disadvantages for workers.

Firstly, people save a lot of time because they don't must commute to the office in crowded trains. This allow them to spend more time with their families and avoid unnecessary stress.

On the other hand, workers can feel isolated from their colleagues. Communication is often slow, and it is more difficult to create a strong teamwork culture when people don't see each other face to face.

To conclude, despite the lack of social interaction, I truly believe that flexible hybrid models are the best solution for modern society.`
    },
    {
      id: 'sheet-2',
      title: 'Redacción Breve Manuscrita (Sofía Rossi)',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900" viewBox="0 0 700 900" style="background:%23faf8f5;font-family:'Segoe Script', cursive, sans-serif;"><defs><pattern id="l2" width="100" height="28" patternUnits="userSpaceOnUse"><line x1="0" y1="27" x2="100" y2="27" stroke="%23e2e8f0" stroke-width="1.2" /></pattern></defs><rect width="100%" height="100%" fill="%23faf8f5" /><rect x="40" y="30" width="620" height="840" fill="url(%23l2)" /><line x1="100" y1="30" x2="100" y2="870" stroke="%23f43f5e" stroke-width="1.5" /><text x="120" y="55" font-size="18" font-weight="bold" fill="%231e3a8a">Classroom Essay - Sofia Rossi</text><text x="120" y="112" font-size="16" fill="%230f172a">Working from home is a topic that divide opinions across the world.</text><text x="120" y="140" font-size="16" fill="%230f172a">There are several benefits, like flexible schedules and no traffic.</text><text x="120" y="168" font-size="16" fill="%230f172a">However, many employees complaints about working extra hours.</text><text x="120" y="196" font-size="16" fill="%230f172a">In conclusion, I think companies should find a good balance.</text></svg>`,
      text: `Working from home is a topic that divide opinions across the world. There are several benefits, like flexible schedules and no traffic. However, many employees complaints about working extra hours. In conclusion, I think companies should find a good balance.`
    }
  ];

  // Set default sample preview on load
  useEffect(() => {
    if (!imagePreview) {
      setImagePreview(sampleSheets[0].url);
      setExtractedSampleText(sampleSheets[0].text);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setExtractedSampleText(`Yesterday I go to the park with my friends. We was playing football. The weather was very nice and we have a fantastic afternoon together. In my opinion, practicing outdoor sports is essential for healthy lifestyles.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      showToast('error', 'Falta Imagen', 'Por favor selecciona o sube una fotografía del texto manuscrito.');
      return;
    }

    const studentUser = users.find(u => u.id === studentId);

    // Create the submission
    const newSub = mockSubmissionService.submitWriting({
      assignmentId,
      studentId,
      submissionType: 'handwritten',
      imageUrl: imagePreview,
      text: extractedSampleText || 'Handwritten writing text extracted via OCR.',
    });

    setCreatedSubmissionId(newSub.id);
    setIsProcessing(true);
  };

  const handleProcessingComplete = async () => {
    if (createdSubmissionId) {
      await mockSubmissionService.processWithAI(createdSubmissionId);
      reloadAll();
      setIsProcessing(false);
      showToast('success', 'Manuscrito Procesado por IA', 'El texto fue transcripto y corregido preliminarmente por el motor de IA.');
      navigate(`/corrections/${createdSubmissionId}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {role === 'teacher' ? 'Carga de Fotografía Manuscrita (Por Alumno)' : 'Subir Redacción Manuscrita'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Digitalización óptica (OCR) y análisis asistido por Inteligencia Artificial
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          Toma una fotografía clara de la hoja del cuaderno o examen del alumno. El sistema extraerá automáticamente el texto caligráfico y preparará la propuesta de corrección gramatical y pedagógica para el docente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Form Settings & Selection */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Datos de la Entrega</span>
          </h3>

          {/* Select Assignment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Consigna de Redacción
            </label>
            <select
              value={assignmentId}
              onChange={e => setAssignmentId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            >
              {assignments.map(a => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.writingType} - {a.cefrLevel})
                </option>
              ))}
            </select>
          </div>

          {/* If Teacher: Select Student */}
          {role !== 'student' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alumno Autor del Escrito
              </label>
              <select
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (DNI: {s.dni})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Assignment preview reminder */}
          {selectedAssignment && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">{selectedAssignment.courseName}</span>
                <CEFRBadge level={selectedAssignment.cefrLevel} />
              </div>
              <p className="text-slate-500 text-[11px] line-clamp-2">{selectedAssignment.instructions}</p>
              <span className="text-[10px] text-teal-700 font-semibold block">
                Exigencia: {selectedAssignment.minWords} - {selectedAssignment.maxWords} palabras
              </span>
            </div>
          )}

          {/* Quick Demo Previews */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Fotografías de Muestra para Demostración:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sampleSheets.map(sheet => (
                <button
                  type="button"
                  key={sheet.id}
                  onClick={() => {
                    setImagePreview(sheet.url);
                    setExtractedSampleText(sheet.text);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs ${
                    imagePreview === sheet.url
                      ? 'border-teal-500 bg-teal-50/50 text-teal-900 font-semibold ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="line-clamp-1">{sheet.title}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Clic para cargar muestra</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload your own image */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              O subir imagen desde tu dispositivo:
            </label>
            <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/20 transition-all cursor-pointer">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Seleccionar archivo JPG o PNG</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Soporta fotos de cámara de móvil o escaneo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full py-2.5 font-bold shadow-md bg-teal-600 hover:bg-teal-700"
              icon={<Sparkles className="w-4 h-4 text-amber-300" />}
            >
              Procesar con IA y Generar Corrección
            </Button>
          </div>
        </div>

        {/* Right Column: Interactive Image Preview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>Vista Previa de la Fotografía</span>
              </div>
              {imagePreview && (
                <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                  Imagen Lista
                </span>
              )}
            </h3>

            <div className="mt-4 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 aspect-[4/5] flex items-center justify-center relative shadow-inner">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Hoja de redacción manuscrita"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-center p-6 text-slate-400 text-xs">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <span>Sube una fotografía o selecciona una muestra para previsualizar</span>
                </div>
              )}
            </div>
          </div>

          {/* OCR simulated transcription peek */}
          {extractedSampleText && (
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Transcripción Preliminar OCR:
              </span>
              <p className="text-slate-700 line-clamp-3 italic font-mono text-[11px]">
                "{extractedSampleText}"
              </p>
            </div>
          )}
        </div>

      </form>

      {/* Animated AI processing screen modal */}
      <AIProcessingOverlay
        isOpen={isProcessing}
        onComplete={handleProcessingComplete}
      />
    </div>
  );
};
