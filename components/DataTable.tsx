'use client';

import React from 'react';
import { Download, Table as TableIcon } from 'lucide-react';

interface PayrollRecord {
  id: string;
  nome: string;
  salario: string;
  arredon: string;
  he_70: string;
  refl_70: string;
  he_100: string;
  refl_100: string;
  ferias_prop: string;
  terco_ferias: string;
  adicionais: string;
  outros_venc: string;
  inss_seg: string;
  contrib_negoc: string;
  faltas_injust: string;
  indeniz: string;
  adiant: string;
  vale_transp: string;
  irrf: string;
  outros_desc: string;
  depos_fgts: string;
  base_calc_inss: string;
  base_calc_fgts: string;
  base_calc_irrf: string;
  inss_patronal_20: string;
}

interface DataTableProps {
  data: PayrollRecord[];
}

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'nome', label: 'Nome' },
  { key: 'salario', label: 'SALÁRIO' },
  { key: 'arredon', label: 'ARREDON.' },
  { key: 'he_70', label: 'H.E. 70%' },
  { key: 'refl_70', label: 'REFL. 70%' },
  { key: 'he_100', label: 'H.E. 100%' },
  { key: 'refl_100', label: 'REFL. 100%' },
  { key: 'ferias_prop', label: 'FÉRIAS PROP.' },
  { key: 'terco_ferias', label: '1/3 FÉRIAS' },
  { key: 'adicionais', label: 'ADICIONAIS' },
  { key: 'outros_venc', label: 'OUTROS VENC.' },
  { key: 'inss_seg', label: 'I.N.S.S. (Seg.)' },
  { key: 'contrib_negoc', label: 'CONTRIB. NEGOC.' },
  { key: 'faltas_injust', label: 'FALTAS INJUST.' },
  { key: 'indeniz', label: 'INDENIZ.' },
  { key: 'adiant', label: 'ADIANT.' },
  { key: 'vale_transp', label: 'VALE TRANSP. (6%)' },
  { key: 'irrf', label: 'IRRF' },
  { key: 'outros_desc', label: 'OUTROS DESC.' },
  { key: 'depos_fgts', label: 'DEPÓS. FGTS' },
  { key: 'base_calc_inss', label: 'BASE CÁLC. INSS' },
  { key: 'base_calc_fgts', label: 'BASE CÁLC. FGTS' },
  { key: 'base_calc_irrf', label: 'BASE CÁLC. IRRF' },
  { key: 'inss_patronal_20', label: 'INSS PATRONAL (20%)' },
];

export default function DataTable({ data }: DataTableProps) {
  const downloadCSV = () => {
    const headers = COLUMNS.map(col => col.label).join(';');
    const rows = data.map(record => 
      COLUMNS.map(col => record[col.key as keyof PayrollRecord]).join(';')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `extracao_folha_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (data.length === 0) return null;

  return (
    <div className="w-full mt-12 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TableIcon className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-800">Dados Extraídos</h2>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white">
        <table className="w-full text-left border-collapse min-w-[2000px]">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-200">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap border-r border-slate-200 last:border-r-0"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((record, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-sm text-slate-600 border-r border-slate-200 last:border-r-0 font-mono"
                  >
                    {record[col.key as keyof PayrollRecord]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
