import { useState } from 'react';
import { type Language, t } from './i18n';
import type { PaymentData } from './types';
import { PaymentForm } from './components/PaymentForm';
import { SignaturePad } from './components/SignaturePad';
import { Confirmation } from './components/Confirmation';
import logo from './assets/logo.png';

type Step = 'form' | 'signature' | 'done';

function App() {
  const [lang, setLang] = useState<Language>('en');
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState<Omit<PaymentData, 'signature'> | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleFormNext = (data: Omit<PaymentData, 'signature'>) => {
    setFormData(data);
    setStep('signature');
  };

  const handleSignatureSubmit = (signature: string) => {
    const full: PaymentData = { ...formData!, signature };
    setPaymentData(full);
    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('payments') || '[]');
    saved.push({ ...full, timestamp: new Date().toISOString() });
    localStorage.setItem('payments', JSON.stringify(saved));
    setStep('done');
  };

  const handleNewPayment = () => {
    setFormData(null);
    setPaymentData(null);
    setStep('form');
  };

  return (
    <div dir={dir} className="min-h-screen flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-blue-700 text-white sticky top-0 z-10">
        <h1 className="text-lg font-bold">{t(lang, 'appTitle')}</h1>
        <img src={logo} alt="Logo" className="h-10" />
        <button
          onClick={toggleLang}
          className="no-print text-sm bg-blue-800 px-3 py-1 rounded-md hover:bg-blue-900 transition-colors"
        >
          {t(lang, 'switchLang')}
        </button>
      </header>

      {/* Content */}
      <main className="flex-1">
        {step === 'form' && <PaymentForm lang={lang} onNext={handleFormNext} />}
        {step === 'signature' && (
          <SignaturePad
            lang={lang}
            onBack={() => setStep('form')}
            onSubmit={handleSignatureSubmit}
          />
        )}
        {step === 'done' && paymentData && (
          <Confirmation lang={lang} data={paymentData} onNewPayment={handleNewPayment} />
        )}
      </main>
    </div>
  );
}

export default App;
