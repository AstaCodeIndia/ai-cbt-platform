import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, FileText, MoreVertical, Edit, Trash2, Copy, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../common/Button';
import { formatDate } from '@/utils/formatTime';
import { TestStatus } from '@/utils/constants';

interface Test {
  id: string;
  name: string;
  subject?: string;
  totalQuestions: number;
  studentsAttempted?: number;
  status: TestStatus;
  conductDate?: string;
  createdAt: string;
}

interface TestCardProps {
  test: Test;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onView?: (id: string) => void;
}

const statusStyles: Record<TestStatus, { bg: string; text: string; label: string }> = {
  [TestStatus.DRAFT]: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Draft' },
  [TestStatus.SCHEDULED]: { bg: 'bg-warning/10', text: 'text-warning', label: 'Scheduled' },
  [TestStatus.PUBLISHED]: { bg: 'bg-success/10', text: 'text-success', label: 'Published' },
  [TestStatus.COMPLETED]: { bg: 'bg-info/10', text: 'text-info', label: 'Completed' },
};

const TestCard: React.FC<TestCardProps> = ({ 
  test, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onView 
}) => {
  const [showActions, setShowActions] = React.useState(false);
  const status = statusStyles[test.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate mb-1">
              {test.name}
            </h3>
            {test.subject && (
              <p className="text-sm text-muted-foreground">{test.subject}</p>
            )}
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowActions(!showActions)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            
            {/* Dropdown Actions */}
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-1 bg-card rounded-lg shadow-lg border border-border py-1 z-10 min-w-[140px]"
              >
                <button
                  onClick={() => { onView?.(test.id); setShowActions(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <button
                  onClick={() => { onEdit?.(test.id); setShowActions(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => { onDuplicate?.(test.id); setShowActions(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
                <button
                  onClick={() => { onDelete?.(test.id); setShowActions(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          status.bg, status.text
        )}>
          {status.label}
        </span>
      </div>

      {/* Stats */}
      <div className="px-5 pb-5 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          <span>{test.totalQuestions} Questions</span>
        </div>
        {test.studentsAttempted !== undefined && (
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{test.studentsAttempted} Attempts</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-muted/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Created {formatDate(test.createdAt)}</span>
        </div>
        {test.conductDate && (
          <span>Conduct: {formatDate(test.conductDate)}</span>
        )}
      </div>
    </motion.div>
  );
};

export default TestCard;
