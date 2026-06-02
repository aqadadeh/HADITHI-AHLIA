export interface PaymentData {
  customerName: string;
  amount: string;
  currency: string;
  paymentType: 'inward' | 'outward';
  referenceNo: string;
  notes: string;
  date: string;
  signature: string;
}
