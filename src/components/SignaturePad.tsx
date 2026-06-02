import { useRef, useState, useEffect, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { type Language, t } from '../i18n';

interface Props {
  lang: Language;
  onBack: () => void;
  onSubmit: (signature: string) => void;
}

export function SignaturePad({ lang, onBack, onSubmit }: Props) {
  const sigRef = useRef<SignatureCanvas>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');

  // Resize canvas to match container (fixes blurry/stuck drawing)
  const resizeCanvas = useCallback(() => {
    const canvas = sigRef.current?.getCanvas();
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const data = sigRef.current!.toData();
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
    sigRef.current!.fromData(data);
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Prevent page scroll/bounce while signing
    const wrapper = wrapperRef.current;
    const prevent = (e: TouchEvent) => e.preventDefault();
    wrapper?.addEventListener('touchmove', prevent, { passive: false });
    wrapper?.addEventListener('touchstart', prevent, { passive: false });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      wrapper?.removeEventListener('touchmove', prevent);
      wrapper?.removeEventListener('touchstart', prevent);
    };
  }, [resizeCanvas]);

  const handleClear = () => {
    sigRef.current?.clear();
    setError('');
  };

  const handleSubmit = () => {
    if (sigRef.current?.isEmpty()) {
      setError(t(lang, 'signatureRequired'));
      return;
    }
    const dataUrl = sigRef.current!.toDataURL('image/png');
    onSubmit(dataUrl);
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      <h2 className="text-xl font-semibold text-center mb-2">
        {t(lang, 'signatureTitle')}
      </h2>
      <p className="text-gray-500 text-center text-sm mb-4">
        {t(lang, 'signatureHint')}
      </p>

      <div
        ref={wrapperRef}
        className="flex-1 border-2 border-dashed border-gray-300 rounded-xl bg-white relative min-h-[250px]"
        style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        <SignatureCanvas
          ref={sigRef}
          canvasProps={{
            className: 'absolute inset-0 w-full h-full rounded-xl',
            style: { touchAction: 'none' },
          }}
          penColor="#1e40af"
          velocityFilterWeight={0.7}
          minWidth={1.5}
          maxWidth={3}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-gray-300 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
        >
          {t(lang, 'back')}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 border border-gray-300 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
        >
          {t(lang, 'clear')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg text-base font-medium hover:bg-green-700 active:bg-green-800 transition-colors"
        >
          {t(lang, 'submit')}
        </button>
      </div>
    </div>
  );
}
