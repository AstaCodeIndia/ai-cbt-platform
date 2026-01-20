import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Grid, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import TestCard from '@/components/admin/TestCard';
import { TestStatus } from '@/utils/constants';
import { useToast } from '@/hooks/use-toast';

const allTests = [
  {
    id: '1',
    name: 'Physics Mock Test - Unit 3',
    subject: 'Physics',
    totalQuestions: 30,
    studentsAttempted: 45,
    status: TestStatus.PUBLISHED,
    createdAt: '2024-01-15',
    conductDate: '2024-01-20',
  },
  {
    id: '2',
    name: 'Chemistry Chapter 5 Quiz',
    subject: 'Chemistry',
    totalQuestions: 20,
    studentsAttempted: 38,
    status: TestStatus.COMPLETED,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Mathematics - Calculus Fundamentals',
    subject: 'Mathematics',
    totalQuestions: 25,
    status: TestStatus.DRAFT,
    createdAt: '2024-01-18',
  },
  {
    id: '4',
    name: 'Biology - Cell Division',
    subject: 'Biology',
    totalQuestions: 15,
    studentsAttempted: 52,
    status: TestStatus.COMPLETED,
    createdAt: '2024-01-08',
  },
  {
    id: '5',
    name: 'Physics - Thermodynamics',
    subject: 'Physics',
    totalQuestions: 20,
    status: TestStatus.SCHEDULED,
    createdAt: '2024-01-19',
    conductDate: '2024-01-25',
  },
  {
    id: '6',
    name: 'Chemistry - Organic Reactions',
    subject: 'Chemistry',
    totalQuestions: 30,
    status: TestStatus.DRAFT,
    createdAt: '2024-01-17',
  },
];

const ManageTests: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TestStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tests, setTests] = useState(allTests);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (id: string) => {
    navigate(`/admin/edit-test/${id}`);
  };

  const handleDelete = (id: string) => {
    setTests(tests.filter(t => t.id !== id));
    toast({
      title: 'Test Deleted',
      description: 'The test has been removed successfully',
    });
  };

  const handleDuplicate = (id: string) => {
    const testToDuplicate = tests.find(t => t.id === id);
    if (testToDuplicate) {
      const newTest = {
        ...testToDuplicate,
        id: `${id}-copy-${Date.now()}`,
        name: `${testToDuplicate.name} (Copy)`,
        status: TestStatus.DRAFT,
        studentsAttempted: undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTests([newTest, ...tests]);
      toast({
        title: 'Test Duplicated',
        description: 'A copy of the test has been created',
      });
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: TestStatus.DRAFT, label: 'Draft' },
    { value: TestStatus.SCHEDULED, label: 'Scheduled' },
    { value: TestStatus.PUBLISHED, label: 'Published' },
    { value: TestStatus.COMPLETED, label: 'Completed' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Tests</h1>
          <p className="text-muted-foreground mt-1">
            View, edit, and manage all your tests
          </p>
        </div>
        <Link to="/admin/create-test">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Test
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TestStatus | 'all')}
            className="h-11 px-4 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex border border-input rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredTests.length} of {tests.length} tests
      </p>

      {/* Tests Grid/List */}
      {filteredTests.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
          : 'space-y-4'
        }>
          {filteredTests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No tests found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Link to="/admin/create-test">
            <Button>Create New Test</Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default ManageTests;
