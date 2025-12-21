import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { name: 'Week 1', score: 65 },
  { name: 'Week 2', score: 72 },
  { name: 'Week 3', score: 68 },
  { name: 'Week 4', score: 78 },
  { name: 'Week 5', score: 82 },
  { name: 'Week 6', score: 85 },
];

const stats = [
  { label: 'Level', value: '45/100', icon: Award, color: 'bg-primary/10 text-primary' },
  { label: 'Accuracy', value: '72%', icon: Target, color: 'bg-success/10 text-success' },
  { label: 'Tests Taken', value: '12', icon: BookOpen, color: 'bg-info/10 text-info' },
  { label: 'Improvement', value: '+15%', icon: TrendingUp, color: 'bg-warning/10 text-warning' },
];

const StudentDashboard: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and performance</p>
        </div>
        <Link to="/student/tests">
          <Button className="gap-2">Take a Test <ArrowRight className="w-4 h-4" /></Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Performance Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
