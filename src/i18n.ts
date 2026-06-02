export type Language = 'en' | 'ar';

export const translations = {
  en: {
    appTitle: 'Payment Receipt',
    switchLang: 'العربية',
    // Form
    customerName: 'Customer Name',
    amount: 'Amount',
    currency: 'Currency',
    paymentType: 'Payment Type',
    inward: 'Receipt',
    outward: 'Payment',
    referenceNo: 'Reference No.',
    notes: 'Notes',
    next: 'Next - Signature',
    // Signature
    signatureTitle: 'Customer Signature',
    signatureHint: 'Please sign below',
    clear: 'Clear',
    back: 'Back',
    submit: 'Submit',
    // Confirmation
    confirmTitle: 'Payment Confirmed',
    confirmMessage: 'Transaction saved successfully',
    newPayment: 'New Payment',
    print: 'Print',
    share: 'Share',
    saveReceipt: 'Save Receipt',
    saveHint: 'Long-press the image below to save it, then share from your gallery',
    // Validation
    required: 'This field is required',
    invalidAmount: 'Please enter a valid amount',
    signatureRequired: 'Signature is required',
    // Date
    date: 'Date',
  },
  ar: {
    appTitle: 'إيصال الدفع',
    switchLang: 'English',
    // Form
    customerName: 'اسم العميل',
    amount: 'المبلغ',
    currency: 'العملة',
    paymentType: 'نوع الدفع',
    inward: 'قبض',
    outward: 'تسديد',
    referenceNo: 'رقم المرجع',
    notes: 'ملاحظات',
    next: 'التالي - التوقيع',
    // Signature
    signatureTitle: 'توقيع العميل',
    signatureHint: 'يرجى التوقيع أدناه',
    clear: 'مسح',
    back: 'رجوع',
    submit: 'تأكيد',
    // Confirmation
    confirmTitle: 'تم تأكيد الدفع',
    confirmMessage: 'تم حفظ المعاملة بنجاح',
    newPayment: 'دفعة جديدة',
    print: 'طباعة',
    share: 'مشاركة',
    saveReceipt: 'حفظ الإيصال',
    saveHint: 'اضغط مطولاً على الصورة لحفظها، ثم شاركها من المعرض',
    // Validation
    required: 'هذا الحقل مطلوب',
    invalidAmount: 'يرجى إدخال مبلغ صحيح',
    signatureRequired: 'التوقيع مطلوب',
    // Date
    date: 'التاريخ',
  },
} as const;

export function t(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key];
}
