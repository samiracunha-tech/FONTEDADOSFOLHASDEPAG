'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import FileUploader from '@/components/FileUploader';
import DataTable from '@/components/DataTable';
import { extractPayrollData } from '@/lib/gemini';
import { FileSpreadsheet, AlertCircle } from 'lucide-react';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    setExtractedData([]); // Clear previous data to show only the new extraction

    try {
      const allResults: any[] = [];
      
      for (const file of files) {
        const base64 = await fileToBase64(file);
        const results = await extractPayrollData(base64, file.type);
        allResults.push(...results);
      }
      
      setExtractedData(allResults);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao processar os arquivos.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-100 p-3 rounded-2xl mb-6"
            >
              <FileSpreadsheet className="w-10 h-10 text-emerald-600" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4"
            >
              Extrator Mensal Folha
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl text-lg text-slate-600"
            >
              Extraia dados estruturados de holerites em PDF com precisão total. 
              Cálculos automáticos de INSS Patronal e identificação de verbas rescisórias.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <FileUploader onFilesSelected={handleFilesSelected} isProcessing={isProcessing} />

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {extractedData.length > 0 && <DataTable data={extractedData} />}
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200 pt-12">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tecnologia</h4>
            <p className="text-sm text-slate-600">Processamento avançado com Gemini 3 Flash para máxima precisão contábil.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Regras</h4>
            <p className="text-sm text-slate-600">Cálculo automático de 20% INSS Patronal e separação de verbas rescisórias.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Segurança</h4>
            <p className="text-sm text-slate-600">Seus dados são processados em tempo real e não são armazenados permanentemente.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
