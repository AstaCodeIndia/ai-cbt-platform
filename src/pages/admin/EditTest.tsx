import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Trash2, Plus, Eye } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import QuestionEditor from '@/components/admin/QuestionEditor';
import Loader from '@/components/common/Loader';
import { useToast } from '@/hooks/use-toast';
import { Modal } from '@/components/common/Modal';

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

interface TestData {
  id: string;
  name: string;
  subject: string;
  description?: string;
  duration?: number;
  questions: Question[];
  status: string;
  createdAt: string;
}

const EditTest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testData, setTestData] = useState<TestData | null>(null);

  // Simulate fetching test data
  useEffect(() => {
    const fetchTest = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Mock data - would come from API
      setTestData({
        id: id || '1',
        name: 'Physics Mock Test - Unit 3',
        subject: 'Physics',
        description: 'This test covers mechanics, thermodynamics, and wave optics.',
        duration: 60,
        status: 'draft',
        createdAt: '2024-01-15',
        questions: [
          {
            id: 'q-1',
            text: 'What is the SI unit of force?',
            options: [
              { id: 'opt-1-a', text: 'Newton', isCorrect: true },
              { id: 'opt-1-b', text: 'Joule', isCorrect: false },
              { id: 'opt-1-c', text: 'Watt', isCorrect: false },
              { id: 'opt-1-d', text: 'Pascal', isCorrect: false },
            ],
            explanation: 'The SI unit of force is Newton (N), named after Sir Isaac Newton.',
          },
          {
            id: 'q-2',
            text: 'Calculate the value of $\\int_0^{\\pi} \\sin(x) dx$',
            options: [
              { id: 'opt-2-a', text: '$0$', isCorrect: false },
              { id: 'opt-2-b', text: '$1$', isCorrect: false },
              { id: 'opt-2-c', text: '$2$', isCorrect: true },
              { id: 'opt-2-d', text: '$\\pi$', isCorrect: false },
            ],
          },
          {
            id: 'q-3',
            text: 'Which of the following is a vector quantity?',
            options: [
              { id: 'opt-3-a', text: 'Mass', isCorrect: false },
              { id: 'opt-3-b', text: 'Temperature', isCorrect: false },
              { id: 'opt-3-c', text: 'Velocity', isCorrect: true },
              { id: 'opt-3-d', text: 'Energy', isCorrect: false },
            ],
          },
        ],
      });
      setIsLoading(false);
    };

    fetchTest();
  }, [id]);

  const handleQuestionChange = (index: number, question: Question) => {
    if (!testData) return;
    const newQuestions = [...testData.questions];
    newQuestions[index] = question;
    setTestData({ ...testData, questions: newQuestions });
  };

  const handleDeleteQuestion = (index: number) => {
    if (!testData) return;
    setTestData({
      ...testData,
      questions: testData.questions.filter((_, i) => i !== index),
    });
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (!testData) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= testData.questions.length) return;
    
    const newQuestions = [...testData.questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setTestData({ ...testData, questions: newQuestions });
  };

  const addNewQuestion = () => {
    if (!testData) return;
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
    setTestData({ ...testData, questions: [...testData.questions, newQuestion] });
  };

  const handleSave = async () => {
    if (!testData) return;
    
    if (!testData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Test name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);

    toast({
      title: 'Test Saved',
      description: 'Your changes have been saved successfully',
    });
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    toast({
      title: 'Test Deleted',
      description: 'The test has been permanently deleted',
    });
    navigate('/admin/manage-tests');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground mb-2">Test Not Found</h2>
        <p className="text-muted-foreground mb-4">The test you're looking for doesn't exist.</p>
        <Link to="/admin/manage-tests">
          <Button>Back to Tests</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/manage-tests">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Test</h1>
            <p className="text-muted-foreground mt-1">
              Modify test details and questions
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="gap-2 text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
          <Link to={`/admin/publish-test/${id}`}>
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              Publish
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Test Details */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Test Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Test Name"
            placeholder="Enter test name"
            value={testData.name}
            onChange={(e) => setTestData({ ...testData, name: e.target.value })}
          />
          <Input
            label="Subject"
            placeholder="e.g., Physics, Chemistry"
            value={testData.subject}
            onChange={(e) => setTestData({ ...testData, subject: e.target.value })}
          />
          <Input
            label="Duration (minutes)"
            type="number"
            placeholder="60"
            value={testData.duration?.toString() || ''}
            onChange={(e) => setTestData({ ...testData, duration: parseInt(e.target.value) || 0 })}
          />
          <Input
            label="Description"
            placeholder="Brief description of the test"
            value={testData.description || ''}
            onChange={(e) => setTestData({ ...testData, description: e.target.value })}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Questions ({testData.questions.length})
          </h2>
          <Button onClick={addNewQuestion} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>
        
        {testData.questions.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground mb-4">No questions yet. Add your first question.</p>
            <Button onClick={addNewQuestion} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </div>
        ) : (
          testData.questions.map((question, idx) => (
            <QuestionEditor
              key={question.id}
              question={question}
              questionNumber={idx + 1}
              onChange={(q) => handleQuestionChange(idx, q)}
              onDelete={() => handleDeleteQuestion(idx)}
              onMoveUp={() => handleMoveQuestion(idx, 'up')}
              onMoveDown={() => handleMoveQuestion(idx, 'down')}
              isFirst={idx === 0}
              isLast={idx === testData.questions.length - 1}
            />
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Test"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete "{testData.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Test
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default EditTest;
