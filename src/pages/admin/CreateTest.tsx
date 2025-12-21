import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import PDFUpload from '@/components/admin/PDFUpload';
import QuestionEditor from '@/components/admin/QuestionEditor';
import { useToast } from '@/hooks/use-toast';

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

const CreateTest: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'edit' | 'details'>('upload');
  const [testName, setTestName] = useState('');
  const [testSubject, setTestSubject] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractionResult, setExtractionResult] = useState<{
    questions: number;
    diagrams: number;
    answerKeys: number;
  } | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Simulate extraction result
          setExtractionResult({
            questions: 15,
            diagrams: 7,
            answerKeys: 15,
          });
          
          // Create mock questions
          const mockQuestions: Question[] = Array.from({ length: 15 }, (_, i) => ({
            id: `q-${i + 1}`,
            text: `This is sample question ${i + 1}. What is the value of $x$ when $x^2 + 2x + 1 = 0$?`,
            options: [
              { id: `opt-${i}-a`, text: '$x = -1$', isCorrect: true },
              { id: `opt-${i}-b`, text: '$x = 1$', isCorrect: false },
              { id: `opt-${i}-c`, text: '$x = 0$', isCorrect: false },
              { id: `opt-${i}-d`, text: '$x = 2$', isCorrect: false },
            ],
          }));
          setQuestions(mockQuestions);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleReviewExtraction = () => {
    setStep('edit');
  };

  const handleQuestionChange = (index: number, question: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = question;
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;
    
    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      options: [
        { id: `opt-new-a`, text: '', isCorrect: true },
        { id: `opt-new-b`, text: '', isCorrect: false },
        { id: `opt-new-c`, text: '', isCorrect: false },
        { id: `opt-new-d`, text: '', isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleSaveTest = () => {
    if (!testName.trim()) {
      toast({
        title: 'Missing Test Name',
        description: 'Please enter a name for your test',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Test Saved!',
      description: `"${testName}" has been saved as a draft`,
    });
    navigate('/admin/manage-tests');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/dashboard">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Test</h1>
          <p className="text-muted-foreground mt-1">
            {step === 'upload' && 'Upload a PDF or create questions manually'}
            {step === 'edit' && 'Review and edit extracted questions'}
            {step === 'details' && 'Add test details and publish'}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {['Upload PDF', 'Edit Questions', 'Test Details'].map((label, idx) => {
          const stepMap = ['upload', 'edit', 'details'];
          const currentIdx = stepMap.indexOf(step);
          const isActive = idx === currentIdx;
          const isComplete = idx < currentIdx;

          return (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : isComplete 
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {isComplete ? '✓' : idx + 1}
                </div>
                <span className={`hidden sm:inline text-sm font-medium ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`w-12 h-0.5 ${
                  idx < currentIdx ? 'bg-success' : 'bg-muted'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      {step === 'upload' && (
        <div className="bg-card rounded-xl border border-border p-6">
          <PDFUpload
            onUpload={handleUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            extractionResult={extractionResult}
            onReview={handleReviewExtraction}
          />
          
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-muted-foreground mb-4">
              Or create questions manually
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                addNewQuestion();
                setStep('edit');
              }}
            >
              Start with Blank Test
            </Button>
          </div>
        </div>
      )}

      {step === 'edit' && (
        <div className="space-y-6">
          {/* Test Name Input */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Test Name"
                placeholder="Enter test name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
              <Input
                label="Subject"
                placeholder="e.g., Physics, Chemistry, Math"
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Questions ({questions.length})
              </h2>
              <Button onClick={addNewQuestion} variant="outline" className="gap-2">
                Add Question
              </Button>
            </div>
            
            {questions.map((question, idx) => (
              <QuestionEditor
                key={question.id}
                question={question}
                questionNumber={idx + 1}
                onChange={(q) => handleQuestionChange(idx, q)}
                onDelete={() => handleDeleteQuestion(idx)}
                onMoveUp={() => handleMoveQuestion(idx, 'up')}
                onMoveDown={() => handleMoveQuestion(idx, 'down')}
                isFirst={idx === 0}
                isLast={idx === questions.length - 1}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" onClick={() => setStep('upload')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveTest}>
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button onClick={() => setStep('details')}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 'details' && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Test Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Test Name"
                placeholder="Enter test name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
              <Input
                label="Subject"
                placeholder="e.g., Physics"
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
              />
              <Input
                label="Conduct Date"
                type="date"
              />
              <Input
                label="Visibility Date"
                type="date"
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">Test Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Questions:</span>
                  <span className="ml-2 font-semibold">{questions.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="ml-2 font-semibold">{testSubject || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" onClick={() => setStep('edit')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveTest}>
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button variant="hero" onClick={() => {
                toast({
                  title: 'Test Published!',
                  description: `"${testName}" is now live for students`,
                });
                navigate('/admin/manage-tests');
              }}>
                Publish Test
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CreateTest;
