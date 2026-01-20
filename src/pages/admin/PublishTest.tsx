import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Eye, 
  Send, 
  CheckCircle2,
  AlertCircle,
  FileText,
  Settings2
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import { Modal } from '@/components/common/Modal';
import { useToast } from '@/hooks/use-toast';

interface TestDetails {
  id: string;
  name: string;
  subject: string;
  totalQuestions: number;
  duration: number;
  status: string;
  createdAt: string;
}

const PublishTest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testDetails, setTestDetails] = useState<TestDetails | null>(null);

  // Publish settings
  const [conductDate, setConductDate] = useState('');
  const [conductTime, setConductTime] = useState('');
  const [visibilityDate, setVisibilityDate] = useState('');
  const [allowedAttempts, setAllowedAttempts] = useState('1');
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [showResultsImmediately, setShowResultsImmediately] = useState(true);
  const [requireFullscreen, setRequireFullscreen] = useState(true);
  const [targetAudience, setTargetAudience] = useState<'all' | 'specific'>('all');

  useEffect(() => {
    const fetchTestDetails = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      setTestDetails({
        id: id || '1',
        name: 'Physics Mock Test - Unit 3',
        subject: 'Physics',
        totalQuestions: 30,
        duration: 60,
        status: 'draft',
        createdAt: '2024-01-15',
      });
      
      // Set default dates
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setConductDate(tomorrow.toISOString().split('T')[0]);
      setConductTime('10:00');
      
      const visibility = new Date();
      setVisibilityDate(visibility.toISOString().split('T')[0]);
      
      setIsLoading(false);
    };

    fetchTestDetails();
  }, [id]);

  const validateSettings = (): boolean => {
    if (!conductDate) {
      toast({
        title: 'Validation Error',
        description: 'Please select a conduct date',
        variant: 'destructive',
      });
      return false;
    }
    if (!conductTime) {
      toast({
        title: 'Validation Error',
        description: 'Please select a conduct time',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!validateSettings()) return;
    setShowConfirmModal(true);
  };

  const confirmPublish = async () => {
    setShowConfirmModal(false);
    setIsPublishing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsPublishing(false);
    toast({
      title: 'Test Published!',
      description: `"${testDetails?.name}" has been scheduled for ${conductDate} at ${conductTime}`,
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

  if (!testDetails) {
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
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/admin/edit-test/${id}`}>
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Publish Test</h1>
          <p className="text-muted-foreground mt-1">
            Configure and schedule your test for students
          </p>
        </div>
      </div>

      {/* Test Summary Card */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{testDetails.name}</h2>
            <p className="text-muted-foreground mt-1">{testDetails.subject}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <FileText className="w-4 h-4" />
                {testDetails.totalQuestions} Questions
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {testDetails.duration} Minutes
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                testDetails.status === 'draft' 
                  ? 'bg-muted text-muted-foreground' 
                  : 'bg-success/20 text-success'
              }`}>
                {testDetails.status.charAt(0).toUpperCase() + testDetails.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Settings */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Schedule</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Conduct Date"
            type="date"
            value={conductDate}
            onChange={(e) => setConductDate(e.target.value)}
          />
          <Input
            label="Conduct Time"
            type="time"
            value={conductTime}
            onChange={(e) => setConductTime(e.target.value)}
          />
          <Input
            label="Visibility Date (when students can see the test)"
            type="date"
            value={visibilityDate}
            onChange={(e) => setVisibilityDate(e.target.value)}
          />
          <Input
            label="Allowed Attempts"
            type="number"
            min="1"
            max="10"
            value={allowedAttempts}
            onChange={(e) => setAllowedAttempts(e.target.value)}
          />
        </div>
      </div>

      {/* Test Settings */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Test Settings</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
            <div>
              <span className="font-medium text-foreground">Shuffle Questions</span>
              <p className="text-sm text-muted-foreground mt-0.5">
                Randomize question order for each student
              </p>
            </div>
            <input
              type="checkbox"
              checked={shuffleQuestions}
              onChange={(e) => setShuffleQuestions(e.target.checked)}
              className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
            <div>
              <span className="font-medium text-foreground">Shuffle Options</span>
              <p className="text-sm text-muted-foreground mt-0.5">
                Randomize answer options for each question
              </p>
            </div>
            <input
              type="checkbox"
              checked={shuffleOptions}
              onChange={(e) => setShuffleOptions(e.target.checked)}
              className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
            <div>
              <span className="font-medium text-foreground">Show Results Immediately</span>
              <p className="text-sm text-muted-foreground mt-0.5">
                Display score and answers right after submission
              </p>
            </div>
            <input
              type="checkbox"
              checked={showResultsImmediately}
              onChange={(e) => setShowResultsImmediately(e.target.checked)}
              className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
            <div>
              <span className="font-medium text-foreground">Require Fullscreen Mode</span>
              <p className="text-sm text-muted-foreground mt-0.5">
                Students must stay in fullscreen during the test
              </p>
            </div>
            <input
              type="checkbox"
              checked={requireFullscreen}
              onChange={(e) => setRequireFullscreen(e.target.checked)}
              className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
            />
          </label>
        </div>
      </div>

      {/* Target Audience */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Target Audience</h2>
        </div>

        <div className="flex gap-4">
          <label className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            targetAudience === 'all' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
          }`}>
            <input
              type="radio"
              name="audience"
              value="all"
              checked={targetAudience === 'all'}
              onChange={() => setTargetAudience('all')}
              className="w-4 h-4 text-primary"
            />
            <div>
              <span className="font-medium text-foreground">All Students</span>
              <p className="text-sm text-muted-foreground">Available to everyone</p>
            </div>
          </label>
          
          <label className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            targetAudience === 'specific' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
          }`}>
            <input
              type="radio"
              name="audience"
              value="specific"
              checked={targetAudience === 'specific'}
              onChange={() => setTargetAudience('specific')}
              className="w-4 h-4 text-primary"
            />
            <div>
              <span className="font-medium text-foreground">Specific Groups</span>
              <p className="text-sm text-muted-foreground">Select student groups</p>
            </div>
          </label>
        </div>
      </div>

      {/* Pre-publish Checklist */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Pre-publish Checklist</h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-foreground">{testDetails.totalQuestions} questions added</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {conductDate ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <AlertCircle className="w-5 h-5 text-warning" />
            )}
            <span className="text-foreground">
              {conductDate ? `Scheduled for ${conductDate} at ${conductTime}` : 'Conduct date not set'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-foreground">Test duration: {testDetails.duration} minutes</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 pb-8">
        <Link to={`/admin/edit-test/${id}`}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Edit
          </Button>
        </Link>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview Test
          </Button>
          <Button 
            variant="hero" 
            onClick={handlePublish}
            disabled={isPublishing}
            className="gap-2"
          >
            {isPublishing ? (
              <>
                <Loader size="sm" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publish Test
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Publish"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            You are about to publish "{testDetails.name}" scheduled for:
          </p>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm">
              <span className="text-muted-foreground">Date:</span>{' '}
              <span className="font-medium text-foreground">{conductDate}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Time:</span>{' '}
              <span className="font-medium text-foreground">{conductTime}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Target:</span>{' '}
              <span className="font-medium text-foreground">
                {targetAudience === 'all' ? 'All Students' : 'Selected Groups'}
              </span>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Students will be able to see this test starting from the visibility date.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={confirmPublish}>
              Confirm & Publish
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default PublishTest;
