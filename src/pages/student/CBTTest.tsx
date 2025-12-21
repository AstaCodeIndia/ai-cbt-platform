import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flag, RotateCcw, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import Timer from '@/components/student/Timer';
import QuestionPalette from '@/components/student/QuestionPalette';
import OptionButton from '@/components/student/OptionButton';
import { QuestionStatus } from '@/utils/constants';
import { createMathHtml } from '@/utils/mathRenderer';
import { useToast } from '@/hooks/use-toast';

const mockQuestions = Array.from({ length: 15 }, (_, i) => ({
  id: `q-${i + 1}`,
  number: i + 1,
  text: `Question ${i + 1}: If $f(x) = x^2 + 2x + 1$, find the value of $f(3)$.`,
  options: ['$f(3) = 16$', '$f(3) = 12$', '$f(3) = 9$', '$f(3) = 25$'],
  status: QuestionStatus.NOT_VISITED,
  selectedOption: null as number | null,
  isMarked: false,
}));

const CBTTest: React.FC = () => {
  const [questions, setQuestions] = useState(mockQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentQuestion = questions[currentIndex];

  const updateQuestionStatus = useCallback((index: number, selectedOption: number | null, isMarked: boolean) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== index) return q;
      let status = QuestionStatus.VISITED;
      if (selectedOption !== null && isMarked) status = QuestionStatus.ANSWERED_MARKED;
      else if (selectedOption !== null) status = QuestionStatus.ANSWERED;
      else if (isMarked) status = QuestionStatus.MARKED;
      return { ...q, selectedOption, isMarked, status };
    }));
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    updateQuestionStatus(currentIndex, optionIndex, currentQuestion.isMarked);
  };

  const handleClearResponse = () => {
    updateQuestionStatus(currentIndex, null, currentQuestion.isMarked);
  };

  const handleMarkForReview = () => {
    updateQuestionStatus(currentIndex, currentQuestion.selectedOption, !currentQuestion.isMarked);
  };

  const handleSaveAndNext = () => {
    if (currentIndex < questions.length - 1) {
      if (questions[currentIndex + 1].status === QuestionStatus.NOT_VISITED) {
        setQuestions(prev => prev.map((q, i) => i === currentIndex + 1 ? { ...q, status: QuestionStatus.VISITED } : q));
      }
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = () => {
    const answered = questions.filter(q => q.selectedOption !== null).length;
    toast({ title: 'Test Submitted!', description: `You answered ${answered} of ${questions.length} questions.` });
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">Physics Mock Test</h1>
        <Timer />
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Question {currentQuestion.number} of {questions.length}</span>
              {currentQuestion.isMarked && <span className="text-xs bg-status-marked text-status-marked-foreground px-2 py-1 rounded">Marked for Review</span>}
            </div>
            <div className="text-lg text-foreground" dangerouslySetInnerHTML={createMathHtml(currentQuestion.text)} />
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => (
                <OptionButton key={idx} optionIndex={idx} text={opt} isSelected={currentQuestion.selectedOption === idx} onClick={() => handleOptionSelect(idx)} />
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button variant="outline" onClick={handleMarkForReview} className="gap-2"><Flag className="w-4 h-4" />{currentQuestion.isMarked ? 'Unmark' : 'Mark for Review'}</Button>
            <Button variant="outline" onClick={handleClearResponse} className="gap-2"><RotateCcw className="w-4 h-4" />Clear</Button>
            <div className="flex-1" />
            <Button variant="outline" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}><ChevronLeft className="w-4 h-4" /></Button>
            <Button onClick={handleSaveAndNext} className="gap-2"><Save className="w-4 h-4" />Save & Next</Button>
            <Button variant="outline" onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))} disabled={currentIndex === questions.length - 1}><ChevronRight className="w-4 h-4" /></Button>
          </div>

          <Button variant="hero" className="w-full mt-6" onClick={() => setShowSubmitModal(true)}>Submit Test</Button>
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 p-4 border-l border-border">
          <QuestionPalette questions={questions} currentQuestion={currentQuestion.number} onQuestionSelect={(n) => setCurrentIndex(n - 1)} />
        </aside>
      </div>

      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Test?">
        <p className="text-muted-foreground mb-4">Answered: {questions.filter(q => q.selectedOption !== null).length}/{questions.length}</p>
        <div className="flex gap-3"><Button variant="outline" onClick={() => setShowSubmitModal(false)}>Cancel</Button><Button onClick={handleSubmit}>Submit</Button></div>
      </Modal>
    </div>
  );
};

export default CBTTest;
