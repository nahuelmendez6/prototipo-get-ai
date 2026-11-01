import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, CheckCircle2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  }[size];

  return (
    <div
      className={`inline-block animate-spin rounded-full border-teal-600 border-t-transparent ${sizeMap} ${className}`}
      role="status"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export const AIProcessingOverlay: React.FC<{
  isOpen: boolean;
  onComplete?: () => void;
}> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Digitalizando y reconociendo caligrafía / texto (OCR)...',
    'Analizando concordancia gramatical y tiempos verbales...',
    'Evaluando riqueza de vocabulario según estándares CEFR...',
    'Calculando puntuación preliminar y recomendaciones docentes...',
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 600);
          }
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 animate-bounce">
          <Brain className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <span>Procesando Redacción</span>
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          El motor de IA está analizando los errores y generando la propuesta de corrección.
        </p>

        {/* Steps visualizer */}
        <div className="mt-6 space-y-3 text-left">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all text-xs flex items-center gap-3 ${
                  isCurrent
                    ? 'bg-teal-50/70 border-teal-200 text-teal-900 font-medium scale-[1.02]'
                    : isDone
                    ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : isCurrent ? (
                  <LoadingSpinner size="sm" className="text-teal-600 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
