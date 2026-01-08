import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading: React.FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <div className="flex justify-center items-center">
      <Loader2
        className="animate-spin text-accent"
        size={size}
      />
    </div>
  );
};