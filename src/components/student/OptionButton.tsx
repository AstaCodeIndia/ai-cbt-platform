import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OPTION_LABELS } from '@/utils/constants';
import { createMathHtml } from '@/utils/mathRenderer';

interface OptionButtonProps {
  optionIndex: number;
  text: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  optionIndex,
  text,
  isSelected,
  onClick,
  disabled = false,
}) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'option-btn',
        isSelected ? 'option-btn-selected' : 'option-btn-default',
        disabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      {/* Option Label */}
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0 transition-colors',
        isSelected 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground'
      )}>
        {isSelected ? (
          <Check className="w-5 h-5" />
        ) : (
          OPTION_LABELS[optionIndex]
        )}
      </div>

      {/* Option Text */}
      <div 
        className="flex-1 text-left"
        dangerouslySetInnerHTML={createMathHtml(text)}
      />
    </motion.button>
  );
};

export default OptionButton;
