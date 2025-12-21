import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';

const tests = [
  { id: '1', name: 'Physics Mock Test - Unit 3', questions: 30, subject: 'Physics' },
  { id: '2', name: 'Chemistry Chapter 5 Quiz', questions: 20, subject: 'Chemistry' },
  { id: '3', name: 'Mathematics - Calculus', questions: 25, subject: 'Mathematics' },
];

const TestList: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Available Tests</h1>
      <div className="grid gap-4">
        {tests.map((test) => (
          <div key={test.id} className="bg-card rounded-xl border border-border p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{test.name}</h3>
                <p className="text-sm text-muted-foreground">{test.questions} Questions • {test.subject}</p>
              </div>
            </div>
            <Link to={`/student/test/${test.id}`}>
              <Button className="gap-2"><Play className="w-4 h-4" /> Start Test</Button>
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TestList;
