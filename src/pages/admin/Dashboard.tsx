import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import TestCard from '@/components/admin/TestCard';
import { TestStatus } from '@/utils/constants';

// Demo data - would come from API
const stats = [
  { label: 'Total Tests', value: '24', icon: FileText, trend: '+3 this week', color: 'bg-primary/10 text-primary' },
  { label: 'Total Students', value: '156', icon: Users, trend: '+12 this month', color: 'bg-success/10 text-success' },
  { label: 'Tests Completed', value: '18', icon: CheckCircle2, trend: '75% completion', color: 'bg-info/10 text-info' },
  { label: 'Avg. Duration', value: '45m', icon: Clock, trend: '±5 min', color: 'bg-warning/10 text-warning' },
];

const recentTests = [
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
    name: 'Mathematics - Calculus',
    subject: 'Mathematics',
    totalQuestions: 25,
    status: TestStatus.DRAFT,
    createdAt: '2024-01-18',
  },
];

const recentActivity = [
  { text: 'Physics Mock Test published', time: '2 hours ago', type: 'success' },
  { text: '12 new students registered', time: '5 hours ago', type: 'info' },
  { text: 'Chemistry Quiz completed by 38 students', time: '1 day ago', type: 'success' },
  { text: 'New PDF uploaded for extraction', time: '2 days ago', type: 'default' },
];

const AdminDashboard: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>
        <Link to="/admin/create-test">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Test
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="stats-card card-hover"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tests */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Tests</h2>
            <Link to="/admin/manage-tests" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid gap-4">
            {recentTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            {recentActivity.map((activity, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-success' :
                  activity.type === 'info' ? 'bg-info' : 'bg-muted-foreground'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/admin/create-test">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Test
                </Button>
              </Link>
              <Link to="/admin/create-test">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  Upload PDF
                </Button>
              </Link>
              <Link to="/admin/manage-tests">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Test
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
