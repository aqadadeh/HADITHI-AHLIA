import { useState } from 'react';
import { type Language, t } from '../i18n';
import type { PaymentData } from '../types';
import logoSrc from '../assets/logo.png';

interface Props {
  lang: Language;
  data: PaymentData;
  onNewPayment: () => void;
}

export function Confirmation({ lang, data, onNewPayment }: Props) {
  const isRtl = lang === 'ar';
  const [receiptImgUrl, setReceiptImgUrl] = useState<string | null>(null);

  const buildReceiptImage = (): Promise<string> => {
    return new Promise((resolve) => {
      const logoImg = new Image();
      logoImg.onload = () => {
        const canvas = document.createElement('canvas');
        const w = 600;
        canvas.width = w;
        const ctx = canvas.getContext('2d')!;
        const padding = 30;
        const lineH = 32;

        const lines: [string, string][] = [
          [t(lang, 'customerName'), data.customerName],
          [t(lang, 'amount'), `${data.amount} ${data.currency}`],
          [t(lang, 'paymentType'), t(lang, data.paymentType)],
          [t(lang, 'date'), data.date],
        ];
        if (data.referenceNo) lines.push([t(lang, 'referenceNo'), data.referenceNo]);
        if (data.notes) lines.push([t(lang, 'notes'), data.notes]);

        const logoH = 60;
        const logoGap = 15;
        const titleH = 50;
        const dividerH = 20;
        const sigLabelH = 30;
        const sigImgH = 100;
        const totalH = padding + logoH + logoGap + titleH + lines.length * lineH + dividerH + sigLabelH + sigImgH + padding + 20;
        canvas.height = totalH;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, totalH);
        ctx.direction = isRtl ? 'rtl' : 'ltr';
        ctx.textAlign = isRtl ? 'right' : 'left';

        let y = padding;

        // Draw logo centered
        const logoAspect = logoImg.width / logoImg.height;
        const logoDrawH = logoH;
        const logoDrawW = logoDrawH * logoAspect;
        const logoX = (w - logoDrawW) / 2;
        ctx.drawImage(logoImg, logoX, y, logoDrawW, logoDrawH);
        y += logoH + logoGap;

        ctx.fillStyle = '#1e40af';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.fillText(t(lang, 'appTitle'), isRtl ? w - padding : padding, y + 24);
        y += titleH;

      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
      y += dividerH;

      ctx.font = '16px Arial, sans-serif';
      for (const [label, value] of lines) {
        ctx.fillStyle = '#6b7280';
        ctx.textAlign = isRtl ? 'right' : 'left';
        ctx.fillText(label, isRtl ? w - padding : padding, y);
        ctx.fillStyle = '#111827';
        ctx.textAlign = 'right';
        ctx.fillText(value, isRtl ? w * 0.55 : w * 0.7, y);
        y += lineH;
      }

      y += 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
      y += dividerH;

      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial, sans-serif';
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.fillText(t(lang, 'signatureTitle'), isRtl ? w - padding : padding, y);
      y += sigLabelH;

      const sigImg = new Image();
      sigImg.onload = () => {
        const sigW = Math.min(200, w - padding * 2);
        const sigH = sigImgH - 10;
        const sigX = isRtl ? w - padding - sigW : padding;
        ctx.drawImage(sigImg, sigX, y, sigW, sigH);
        resolve(canvas.toDataURL('image/png'));
      };
      sigImg.src = data.signature;
      };
      logoImg.src = logoSrc;
    });
  };

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleSaveReceipt = async () => {
    const url = await buildReceiptImage();
    if (isMobile) {
      setReceiptImgUrl(url);
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${data.referenceNo || Date.now()}.png`;
      link.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Success icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-green-700 mb-1">
        {t(lang, 'confirmTitle')}
      </h2>
      <p className="text-gray-500 mb-6">{t(lang, 'confirmMessage')}</p>

      {/* Receipt details */}
      <div className="w-full bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex">
          <span className="text-gray-500 w-2/5 text-start">{t(lang, 'customerName')}</span>
          <span className="font-medium w-3/5 text-start">{data.customerName}</span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-2/5 text-start">{t(lang, 'amount')}</span>
          <span className="font-medium w-3/5 text-start">
            {data.amount} {data.currency}
          </span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-2/5 text-start">{t(lang, 'paymentType')}</span>
          <span
            className={`font-medium w-3/5 text-start ${
              data.paymentType === 'inward' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {t(lang, data.paymentType)}
          </span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-2/5 text-start">{t(lang, 'date')}</span>
          <span className="font-medium w-3/5 text-start">{data.date}</span>
        </div>
        {data.referenceNo && (
          <div className="flex">
            <span className="text-gray-500 w-2/5 text-start">{t(lang, 'referenceNo')}</span>
            <span className="font-medium w-3/5 text-start">{data.referenceNo}</span>
          </div>
        )}
        {data.notes && (
          <div className="flex">
            <span className="text-gray-500 w-2/5 text-start">{t(lang, 'notes')}</span>
            <span className="font-medium w-3/5 text-start">{data.notes}</span>
          </div>
        )}

        {/* Signature preview */}
        <div className="pt-3 border-t border-gray-100">
          <span className="text-gray-500 text-sm">{t(lang, 'signatureTitle')}</span>
          <img
            src={data.signature}
            alt="Signature"
            className="mt-2 h-24 mx-auto border border-gray-200 rounded-lg bg-white"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="no-print flex gap-3 mt-6 w-full">
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 border border-gray-300 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
        >
          {t(lang, 'print')}
        </button>
        <button
          type="button"
          onClick={handleSaveReceipt}
          className="flex-1 border border-green-500 text-green-700 py-3 rounded-lg text-base font-medium hover:bg-green-50 transition-colors"
        >
          {t(lang, 'saveReceipt')}
        </button>
        <button
          type="button"
          onClick={onNewPayment}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          {t(lang, 'newPayment')}
        </button>
      </div>

      {/* Receipt image overlay */}
      {receiptImgUrl && (
        <div className="no-print fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 max-w-md w-full">
            <p className="text-sm text-gray-500 text-center mb-3">
              {t(lang, 'saveHint')}
            </p>
            <img
              src={receiptImgUrl}
              alt="Receipt"
              className="w-full rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setReceiptImgUrl(null)}
              className="w-full mt-3 border border-gray-300 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
            >
              {t(lang, 'back')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
