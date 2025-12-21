import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../common/Button';

interface PDFUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  extractionResult?: {
    questions: number;
    diagrams: number;
    answerKeys: number;
  } | null;
  onReview?: () => void;
}

const PDFUpload: React.FC<PDFUploadProps> = ({
  onUpload,
  isUploading = false,
  uploadProgress = 0,
  extractionResult,
  onReview,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        onUpload(file);
      } else {
        setError('Please upload a PDF file');
      }
    }
  }, [onUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        onUpload(file);
      } else {
        setError('Please upload a PDF file');
      }
    }
  }, [onUpload]);

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 bg-muted/30',
          isUploading && 'pointer-events-none opacity-70'
        )}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <motion.div
          animate={{ scale: isDragging ? 1.05 : 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            isDragging ? 'bg-primary/20' : 'bg-primary/10'
          )}>
            <Upload className={cn(
              'w-8 h-8',
              isDragging ? 'text-primary' : 'text-primary/70'
            )} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Upload Test PDF
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your PDF here, or{' '}
              <span className="text-primary font-medium">browse</span>
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Supports PDF files up to 50MB
          </p>
        </motion.div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-card/90 rounded-xl flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <div className="text-center">
              <p className="font-medium text-foreground">Uploading & Extracting...</p>
              <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
            </div>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {/* Selected File */}
      {selectedFile && !isUploading && !extractionResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={clearFile}>
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* Extraction Result */}
      {extractionResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-success/5 border border-success/20 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-success" />
            <h3 className="font-semibold text-foreground">AI Extraction Complete</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-card rounded-lg">
              <p className="text-3xl font-bold text-primary">{extractionResult.questions}</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <p className="text-3xl font-bold text-primary">{extractionResult.diagrams}</p>
              <p className="text-sm text-muted-foreground">Diagrams</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <p className="text-3xl font-bold text-primary">{extractionResult.answerKeys}</p>
              <p className="text-sm text-muted-foreground">Answer Keys</p>
            </div>
          </div>

          <Button onClick={onReview} className="w-full" size="lg">
            Review Extracted Test
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default PDFUpload;
