import { useState } from 'react';

const HASH = '444d9e3a6d2576f56e66459dc75bfad18619adc4003608672a92cfb03bf4fde7';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface Props {
  onAuthenticated: () => void;
}

export function PinScreen({ onAuthenticated }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = await sha256(pin);
    if (hash === HASH) {
      sessionStorage.setItem('authenticated', '1');
      onAuthenticated();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-blue-700">
          🔒 Enter Password
        </h2>
        <input
          type="password"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          autoFocus
        />
        {error && (
          <p className="text-red-500 text-sm text-center">Incorrect password</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
