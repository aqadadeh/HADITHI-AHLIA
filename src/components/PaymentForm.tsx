import { useForm } from 'react-hook-form';
import { type Language, t } from '../i18n';
import type { PaymentData } from '../types';

function generateReferenceNo(): string {
  const now = new Date();
  const pad = (n: number, len = 2) => n.toString().padStart(len, '0');
  return `PAY-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${pad(now.getMilliseconds(), 3)}`;
}

interface Props {
  lang: Language;
  onNext: (data: Omit<PaymentData, 'signature'>) => void;
}

export function PaymentForm({ lang, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<PaymentData, 'signature'>>({
    defaultValues: {
      paymentType: 'inward',
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      referenceNo: generateReferenceNo(),
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 p-4">
      {/* Customer Name */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t(lang, 'customerName')}
        </label>
        <input
          {...register('customerName', { required: t(lang, 'required') })}
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          autoComplete="off"
        />
        {errors.customerName && (
          <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
        )}
      </div>

      {/* Amount + Currency */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            {t(lang, 'amount')}
          </label>
          <input
            type="number"
            step="0.01"
            {...register('amount', {
              required: t(lang, 'required'),
              validate: (v) => parseFloat(v) > 0 || t(lang, 'invalidAmount'),
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            inputMode="decimal"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>
        <div className="w-28">
          <label className="block text-sm font-medium mb-1">
            {t(lang, 'currency')}
          </label>
          <select
            {...register('currency')}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="AED">AED</option>
            <option value="SAR">SAR</option>
            <option value="JOD">JOD</option>
            <option value="ILS">ILS</option>
          </select>
        </div>
      </div>

      {/* Payment Type */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {t(lang, 'paymentType')}
        </label>
        <div className="flex gap-3">
          <label className="flex-1 cursor-pointer">
            <input
              type="radio"
              value="inward"
              {...register('paymentType')}
              className="peer hidden"
            />
            <div className="border-2 border-gray-300 rounded-lg py-3 text-center peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 font-medium transition-colors">
              {t(lang, 'inward')}
            </div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input
              type="radio"
              value="outward"
              {...register('paymentType')}
              className="peer hidden"
            />
            <div className="border-2 border-gray-300 rounded-lg py-3 text-center peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 font-medium transition-colors">
              {t(lang, 'outward')}
            </div>
          </label>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t(lang, 'date')}
        </label>
        <input
          type="date"
          {...register('date', { required: t(lang, 'required') })}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-gray-100 text-gray-700 outline-none cursor-not-allowed"
        />
      </div>

      {/* Reference No */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t(lang, 'referenceNo')}
        </label>
        <input
          {...register('referenceNo')}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-gray-100 text-gray-700 outline-none cursor-not-allowed"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t(lang, 'notes')}
        </label>
        <textarea
          {...register('notes')}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
      >
        {t(lang, 'next')}
      </button>
    </form>
  );
}
