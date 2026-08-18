'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Search,
  Filter,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Code2,
  PlusCircle,
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';

interface JobItem {
  id: string;
  title: string;
  description: string;
  level: string;
  technologies: string[];
  modality: string;
  location: string | null;
  contract_type: string;
  salary_min: number | null;
  salary_max: number | null;
  created_at: string;
  company: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    location: string | null;
    is_verified: boolean;
  };
  stages: { id: string; title: string; type: string; order: number }[];
  _count: { applications: number };
}

export function JobsContent({ user }: { user: any }) {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedModality, setSelectedModality] = useState<string>('');

  useEffect(() => {
    loadJobs();
  }, [selectedLevel, selectedModality]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedLevel) params.append('level', selectedLevel);
      if (selectedModality) params.append('modality', selectedModality);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        setJobs(await res.json());
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.name.toLowerCase().includes(search.toLowerCase()) ||
      j.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="dd-platform-shell">
      <Sidebar user={user} />

      <main className="flex-1 min-w-0 max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dd-border pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                Carreira & Vagas
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-dd-text mt-2">
              Oportunidades com Processo Seletivo Técnico
            </h1>
            <p className="text-sm text-dd-muted font-medium mt-1">
              Conecte seu aprendizado ao mercado. Empresas contratam com base no seu portfólio
              prático de código no Stacklyst.
            </p>
          </div>

          {(user?.role === 'RECRUITER' || user?.role === 'ADMIN') && (
            <Link
              href="/recruiter"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-md active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Painel do Recrutador
            </Link>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-3 p-3 rounded-2xl bg-dd-surface border border-dd-border">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-dd-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cargo, empresa ou tecnologia (ex: React, TypeScript, Node)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dd-bg border border-dd-border rounded-xl pl-10 pr-3 py-2 text-xs font-bold text-dd-text outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-dd-bg border border-dd-border rounded-xl px-3 py-2 text-xs font-bold text-dd-text outline-none cursor-pointer"
            >
              <option value="">Todos os Níveis</option>
              <option value="ESTAGIO">Estágio</option>
              <option value="JUNIOR">Júnior</option>
              <option value="PLENO">Pleno</option>
              <option value="SENIOR">Sênior</option>
            </select>

            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="bg-dd-bg border border-dd-border rounded-xl px-3 py-2 text-xs font-bold text-dd-text outline-none cursor-pointer"
            >
              <option value="">Todas Modalidades</option>
              <option value="REMOTE">Remoto</option>
              <option value="HYBRID">Híbrido</option>
              <option value="ONSITE">Presencial</option>
            </select>
          </div>
        </div>

        {/* Jobs Feed */}
        {loading ? (
          <div className="p-12 text-center text-xs text-dd-muted font-bold">
            Carregando vagas abertas...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-dd-surface border border-dd-border space-y-3">
            <Briefcase className="w-10 h-10 text-dd-muted mx-auto" />
            <h3 className="text-base font-black text-dd-text">Nenhuma vaga encontrada</h3>
            <p className="text-xs text-dd-muted font-medium max-w-sm mx-auto">
              Tente alterar os filtros de busca ou volte mais tarde para ver novas oportunidades.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group block p-6 rounded-3xl bg-dd-surface border border-dd-border hover:border-blue-500/50 transition-all hover:shadow-lg shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-black text-dd-text group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">
                        {job.level}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-dd-muted font-medium">
                      <span className="flex items-center gap-1 text-dd-text font-bold">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        {job.company.name}
                        {job.company.is_verified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        )}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.modality === 'REMOTE'
                          ? 'Remoto'
                          : job.modality === 'HYBRID'
                            ? 'Híbrido'
                            : 'Presencial'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {job.contract_type}
                      </span>
                      {job.salary_min && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">
                            R$ {job.salary_min.toLocaleString('pt-BR')}
                            {job.salary_max
                              ? ` - R$ ${job.salary_max.toLocaleString('pt-BR')}`
                              : ''}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-dd-bg border border-dd-border/60 text-[11px] font-mono font-bold text-dd-text"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                    <span className="text-[11px] text-dd-muted font-bold">
                      {job.stages.length} etapas técnicas
                    </span>
                    <span className="flex items-center gap-1 text-xs font-black text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      Ver Processo
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
