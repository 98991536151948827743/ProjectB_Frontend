import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/5">
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl">
      <Loader2 className="animate-spin text-blue-500 mb-2" size={48} />
      <p className="text-gray-700 font-semibold">Loading...</p>
    </div>
  </div>
);

export default Loading;