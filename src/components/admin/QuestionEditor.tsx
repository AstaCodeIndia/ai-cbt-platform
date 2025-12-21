import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  GripVertical,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { OPTION_LABELS } from '@/utils/constants';
import { createMathHtml } from '@/utils/mathRenderer';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  explanation?: string;
  imageUrl?: string;
}

interface QuestionEditorProps {
  question: Question;
  questionNumber: number;
  onChange: (question: Question) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  questionNumber,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const updateQuestionText = (text: string) => {
    onChange({ ...question, text });
  };

  const updateOptionText = (optionId: string, text: string) => {
    onChange({
      ...question,
      options: question.options.map((opt) =>
        opt.id === optionId ? { ...opt, text } : opt
      ),
    });
  };

  const setCorrectAnswer = (optionId: string) => {
    onChange({
      ...question,
      options: question.options.map((opt) => ({
        ...opt,
        isCorrect: opt.id === optionId,
      })),
    });
  };

  const addOption = () => {
    if (question.options.length >= 4) return;
    
    const newOption: Option = {
      id: `opt-${Date.now()}`,
      text: '',
      isCorrect: false,
    };
    onChange({
      ...question,
      options: [...question.options, newOption],
    });
  };

  const removeOption = (optionId: string) => {
    if (question.options.length <= 2) return;
    
    onChange({
      ...question,
      options: question.options.filter((opt) => opt.id !== optionId),
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className={cn(
                'p-1 rounded hover:bg-muted transition-colors',
                isFirst && 'opacity-30 cursor-not-allowed'
              )}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className={cn(
                'p-1 rounded hover:bg-muted transition-colors',
                isLast && 'opacity-30 cursor-not-allowed'
              )}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
          <span className="font-semibold text-foreground">
            Question {questionNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          {showPreview ? (
            /* Preview Mode */
            <div className="space-y-4">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={createMathHtml(question.text || 'No question text')}
              />
              {question.imageUrl && (
                <img 
                  src={question.imageUrl} 
                  alt="Question diagram" 
                  className="max-w-md rounded-lg border"
                />
              )}
              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <div
                    key={option.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border',
                      option.isCorrect 
                        ? 'border-success bg-success/5' 
                        : 'border-border bg-muted/30'
                    )}
                  >
                    <span className="font-semibold text-muted-foreground">
                      ({OPTION_LABELS[idx]})
                    </span>
                    <div 
                      className="flex-1"
                      dangerouslySetInnerHTML={createMathHtml(option.text || 'Empty option')}
                    />
                    {option.isCorrect && (
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <>
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Question Text (LaTeX supported: $...$)
                </label>
                <textarea
                  value={question.text}
                  onChange={(e) => updateQuestionText(e.target.value)}
                  placeholder="Enter your question here. Use $...$ for inline math and $$...$$ for display math."
                  className="w-full min-h-[100px] rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                />
              </div>

              {/* Image Upload */}
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Add Image/Diagram
                </Button>
                {question.imageUrl && (
                  <span className="text-sm text-muted-foreground">
                    Image attached
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Options (Click to mark correct answer)
                </label>
                {question.options.map((option, idx) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <button
                      onClick={() => setCorrectAnswer(option.id)}
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center font-semibold transition-all',
                        option.isCorrect
                          ? 'bg-success text-success-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                      )}
                    >
                      {OPTION_LABELS[idx]}
                    </button>
                    <Input
                      value={option.text}
                      onChange={(e) => updateOptionText(option.id, e.target.value)}
                      placeholder={`Option ${OPTION_LABELS[idx]}`}
                      className="flex-1"
                    />
                    {question.options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeOption(option.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {question.options.length < 4 && (
                  <Button variant="outline" size="sm" onClick={addOption} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Option
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default QuestionEditor;
