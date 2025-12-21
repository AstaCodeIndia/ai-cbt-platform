import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { QuestionStatus, QUESTION_STATUS_COLORS } from '@/utils/constants';

interface QuestionPaletteProps {
  questions: Array<{
    id: string;
    number: number;
    status: QuestionStatus;
  }>;
  currentQuestion: number;
  onQuestionSelect: (questionNumber: number) => void;
}

const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentQuestion,
  onQuestionSelect,
}) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4">Question Palette</h3>
      
      {/* Legend */}
      <div className="space-y-2 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded question-status-not-visited" />
          <span className="text-muted-foreground">Not Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded question-status-visited" />
          <span className="text-muted-foreground">Not Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded question-status-answered" />
          <span className="text-muted-foreground">Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded question-status-marked" />
          <span className="text-muted-foreground">Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded question-status-answered-marked" />
          <span className="text-muted-foreground">Answered & Marked</span>
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q) => (
          <motion.button
            key={q.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuestionSelect(q.number)}
            className={cn(
              'question-status relative',
              QUESTION_STATUS_COLORS[q.status],
              currentQuestion === q.number && 'ring-2 ring-primary ring-offset-2'
            )}
          >
            {q.number}
            {(q.status === QuestionStatus.MARKED || q.status === QuestionStatus.ANSWERED_MARKED) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Answered:</span>
            <span className="font-semibold text-success">
              {questions.filter(q => 
                q.status === QuestionStatus.ANSWERED || 
                q.status === QuestionStatus.ANSWERED_MARKED
              ).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Not Answered:</span>
            <span className="font-semibold text-destructive">
              {questions.filter(q => 
                q.status === QuestionStatus.VISITED
              ).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Marked:</span>
            <span className="font-semibold text-status-marked">
              {questions.filter(q => 
                q.status === QuestionStatus.MARKED ||
                q.status === QuestionStatus.ANSWERED_MARKED
              ).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Not Visited:</span>
            <span className="font-semibold text-muted-foreground">
              {questions.filter(q => q.status === QuestionStatus.NOT_VISITED).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;
