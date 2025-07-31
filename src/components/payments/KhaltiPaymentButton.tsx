import React, { useState } from 'react';
import { initiateKhaltiPayment } from '../../services/khaltiService';
import toast from 'react-hot-toast';

interface KhaltiPaymentButtonProps {
  bookingId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  onSuccess?: () => void;
  className?: string;
}

const KhaltiPaymentButton: React.FC<KhaltiPaymentButtonProps> = ({
  bookingId,
  amount,
  customerName,
  customerEmail,
  onSuccess,
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    try {
      setIsProcessing(true);
      initiateKhaltiPayment(bookingId, amount, customerName, customerEmail, () => {
        setIsProcessing(false);
        if (onSuccess) onSuccess();
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className={`flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {isProcessing ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          <img 
            src="https://raw.githubusercontent.com/khalti/khalti-sdk-web/master/assets/khalti-logo.png" 
            alt="Khalti" 
            className="h-5 mr-2" 
            onError={(e) => {
              // If image fails to load, replace with a fallback
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTIxIDEyYTkgOSAwIDExLTE4IDAgOSA5IDAgMDExOCAweiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTE2IDEySDgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTEyIDE2VjgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+';
            }}
          />
          Pay with Khalti
        </>
      )}
    </button>
  );
};

export default KhaltiPaymentButton;