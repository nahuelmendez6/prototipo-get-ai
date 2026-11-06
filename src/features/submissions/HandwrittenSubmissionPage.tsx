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
  ArrowLeft,
  FileText,
  PenTool,
  CheckCircle2
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
      title: 'B2 Notebook Essay (Carlos Gómez)',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900" viewBox="0 0 700 900" style="background:%23fdfaf3;font-family:'Segoe Script', cursive, sans-serif;"><defs><pattern id="l1" width="100" height="28" patternUnits="userSpaceOnUse"><line x1="0" y1="27" x2="100" y2="27" stroke="%23cbd5e1" stroke-width="1.2" /></pattern></defs><rect width="100%" height="100%" fill="%23fdfaf3" /><rect x="40" y="30" width="620" height="840" fill="url(%23l1)" /><line x1="100" y1="30" x2="100" y2="870" stroke="%23f87171" stroke-width="1.5" /><text x="120" y="55" font-size="18" font-weight="bold" fill="%230d3471">English Writing Task - B2 First</text><text x="120" y="112" font-size="16" fill="%230f172a">Nowadays, remote working is becoming more popular everyday.</text><text x="120" y="140" font-size="16" fill="%230f172a">In my opinion, working from home have many positive aspects,</text><text x="120" y="168" font-size="16" fill="%230f172a">although it also brings some serious disadvantages for workers.</text><text x="120" y="196" font-size="16" fill="%230f172a">Firstly, people save a lot of time because they don't must commute.</text><text x="120" y="224" font-size="16" fill="%230f172a">This allow them to spend more time with their families.</text></svg>`,
      text: `Nowadays, remote working is becoming more popular everyday. In my opinion, working from home have many positive aspects, although it also brings some serious disadvantages for workers.

Firstly, people save a lot of time because they don't must commute to the office in crowded trains. This allow them to spend more time with their families and avoid unnecessary stress.

On the other hand, workers can feel isolated from their colleagues. Communication is often slow, and it is more difficult to create a strong teamwork culture when people don't see each other face to face.

To conclude, despite the lack of social interaction, I truly believe that flexible hybrid models are the best solution for modern society.`
    },
    {
      id: 'sheet-2',
      title: 'Handwritten Short Response (Sofía Rossi)',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900" viewBox="0 0 700 900" style="background:%23faf8f5;font-family:'Segoe Script', cursive, sans-serif;"><defs><pattern id="l2" width="100" height="28" patternUnits="userSpaceOnUse"><line x1="0" y1="27" x2="100" y2="27" stroke="%23e2e8f0" stroke-width="1.2" /></pattern></defs><rect width="100%" height="100%" fill="%23faf8f5" /><rect x="40" y="30" width="620" height="840" fill="url(%23l2)" /><line x1="100" y1="30" x2="100" y2="870" stroke="%23c81414" stroke-width="1.5" /><text x="120" y="55" font-size="18" font-weight="bold" fill="%230d3471">Classroom Essay - Sofia Rossi</text><text x="120" y="112" font-size="16" fill="%230f172a">Working from home is a topic that divide opinions across the world.</text><text x="120" y="140" font-size="16" fill="%230f172a">There are several benefits, like flexible schedules and no traffic.</text><text x="120" y="168" font-size="16" fill="%230f172a">However, many employees complaints about working extra hours.</text><text x="120" y="196" font-size="16" fill="%230f172a">In conclusion, I think companies should find a good balance.</text></svg>`,
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
        setExtractedSampleText(`Yesterday I went to the cinema to watch a compelling documentary about environmental science. The cinematography was breathtaking and the narrative effectively highlighted urgent global conservation challenges.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      showToast('error', 'Missing Image', 'Please select or upload a photo of the handwritten text.');
      return;
    }

    // Create the submission
    const newSub = mockSubmissionService.submitWriting({
      assignmentId,
      studentId,
      submissionType: 'handwritten',
      imageUrl: imagePreview,
      text: extractedSampleText || 'Handwritten text processed via optical character recognition.',
    });

    setCreatedSubmissionId(newSub.id);
    setIsProcessing(true);
  };

  const handleProcessingComplete = async () => {
    if (createdSubmissionId) {
      await mockSubmissionService.processWithAI(createdSubmissionId);
      reloadAll();
      setIsProcessing(false);
      showToast('success', 'Manuscript Processed', 'The text has been digitized and preliminary Cambridge assessment generated.');
      navigate(`/corrections/${createdSubmissionId}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Navigation header with back button and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0d3471] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to assignments</span>
        </button>

        {/* Simplified Flow: Tab switcher between online writing & handwritten upload */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => navigate(`/submit-virtual${assignmentId ? `?asgId=${assignmentId}` : ''}`)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 transition-all hover:bg-white cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5 text-slate-400" />
            <span>Online Writing Editor</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-[#0d3471] text-white shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-white" />
            <span>Handwritten Photo</span>
          </button>
        </div>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-[#0d3471]/10 border border-[#0d3471]/20 flex items-center justify-center text-[#0d3471]">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {role === 'teacher' ? 'Upload Student Handwritten Essay' : 'Submit Handwritten Essay'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Optical digitization and analytical pre-assessment based on Cambridge criteria
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          Upload a clear photo of the student's notebook or lined sheet. The assistant will extract the handwritten text and prepare a draft assessment using Cambridge criteria for teacher review.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Form Settings & Selection */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0d3471]" />
            <span>Submission Details</span>
          </h3>

          {/* Select Assignment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Task
            </label>
            <select
              value={assignmentId}
              onChange={e => setAssignmentId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d3471] bg-slate-50 focus:bg-white text-slate-800 font-medium"
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
                Student Author
              </label>
              <select
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d3471] bg-slate-50 focus:bg-white text-slate-800 font-medium"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (ID: {s.dni})
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
              <span className="text-[10px] text-[#0d3471] font-bold block">
                Required length: {selectedAssignment.minWords} - {selectedAssignment.maxWords} words
              </span>
            </div>
          )}

          {/* Quick Demo Previews */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Sample Notebook Sheets (Demo):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      ? 'border-[#0d3471] bg-[#0d3471]/5 text-[#0d3471] font-semibold ring-2 ring-[#0d3471]/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="line-clamp-1">{sheet.title}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Click to load sample</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload your own image */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Or upload image from your device:
            </label>
            <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#0d3471] hover:bg-[#0d3471]/5 transition-all cursor-pointer">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Select JPG or PNG image</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Accepts photos taken with mobile or scans</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Right Column: Image Preview & Process Button */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#0d3471]" />
                <span>Document Preview</span>
              </span>
              {imagePreview && (
                <span className="text-[10px] font-bold text-[#0d3471] bg-[#0d3471]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#0d3471]" />
                  <span>Document Ready</span>
                </span>
              )}
            </div>

            {imagePreview ? (
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2 shadow-2xs">
                <img
                  src={imagePreview}
                  alt="Writing preview"
                  className="w-full h-80 object-contain rounded-xl bg-white"
                />
              </div>
            ) : (
              <div className="h-80 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                <p className="text-xs">No image selected.</p>
                <p className="text-[11px] mt-1 text-slate-400">Select a sample or upload a file.</p>
              </div>
            )}

            {extractedSampleText && (
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Detected Text for Extraction:
                </span>
                <p className="line-clamp-3 italic font-serif">"{extractedSampleText}"</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Cambridge AI Processing
            </span>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!imagePreview}
              icon={<Sparkles className="w-4 h-4 text-[#c81414]" />}
              className="font-bold shadow-xs"
            >
              Process & Assess
            </Button>
          </div>
        </div>

      </form>

      {/* AI Processing Animation Overlay */}
      <AIProcessingOverlay
        isOpen={isProcessing}
        onComplete={handleProcessingComplete}
      />
    </div>
  );
};
