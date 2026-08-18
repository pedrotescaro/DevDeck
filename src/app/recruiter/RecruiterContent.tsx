'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Briefcase,
  PlusCircle,
  Users,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';

export function RecruiterContent({ user }: { user: any }) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [creatingCompany, setCreatingCompany] = useState(false);

  // Job creation state
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobLevel, setJobLevel] = useState('JUNIOR');
  const [jobModality, setJobModality] = useState('REMOTE');
  const [jobTechnologies, setJobTechnologies] = useState('React, TypeScript, Node.js');
  const [jobSalaryMin, setJobSalaryMin] = useState(4000);
  const [jobSalaryMax, setJobSalaryMax] = useState(7000);
  const [jobRequirements, setJobRequirements] = useState('Conhecimento em React, Git, REST APIs');
  const [jobBenefits, setJobBenefits] = useState(
    'Vale Refeição, Convênio Médico, Horário Flexível'
  );
  const [creatingJob, setCreatingJob] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const res = await fetch('/api/companies');
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
        if (data.length > 0) setSelectedCompanyId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCompany(true);
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName,
          website: companyWebsite,
          location: companyLocation,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Empresa cadastrada com sucesso!');
        loadCompanies();
        setCompanyName('');
        setCompanyWebsite('');
        setCompanyLocation('');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingCompany(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyId) return;

    setCreatingJob(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: selectedCompanyId,
          title: jobTitle,
          description: jobDescription,
          level: jobLevel,
          modality: jobModality,
          technologies: jobTechnologies
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          salary_min: Number(jobSalaryMin),
          salary_max: Number(jobSalaryMax),
          requirements: jobRequirements
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean),
          benefits: jobBenefits
            .split(',')
            .map((b) => b.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        setSuccessMsg('Vaga publicada com sucesso e vinculada às etapas de testes do Stacklyst!');
        setJobTitle('');
        setJobDescription('');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingJob(false);
    }
  };

  return (
    <div className="dd-platform-shell">
      <Sidebar user={user} />

      <main className="flex-1 min-w-0 max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div className="border-b border-dd-border pb-5">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
              Painel Corporativo
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-dd-text mt-2">
            Recrutamento Técnico Stacklyst
          </h1>
          <p className="text-sm text-dd-muted font-medium mt-1">
            Cadastre sua empresa, publique vagas e utilize os desafios práticos e duelos da
            plataforma como filtro seletivo real.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Register Company */}
          <form
            onSubmit={handleCreateCompany}
            className="p-6 rounded-3xl bg-dd-surface border border-dd-border space-y-4"
          >
            <h2 className="text-base font-black text-dd-text flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              1. Cadastrar Perfil da Empresa
            </h2>

            <div>
              <label className="block text-xs font-bold text-dd-text mb-1">Nome da Empresa</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: TechCorp Brasil"
                className="w-full bg-dd-bg border border-dd-border rounded-xl p-2.5 text-xs font-bold text-dd-text outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dd-text mb-1">Website</label>
              <input
                type="url"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://techcorp.com.br"
                className="w-full bg-dd-bg border border-dd-border rounded-xl p-2.5 text-xs font-bold text-dd-text outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dd-text mb-1">Localização</label>
              <input
                type="text"
                value={companyLocation}
                onChange={(e) => setCompanyLocation(e.target.value)}
                placeholder="São Paulo, SP - Remoto"
                className="w-full bg-dd-bg border border-dd-border rounded-xl p-2.5 text-xs font-bold text-dd-text outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={creatingCompany}
              className="w-full py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {creatingCompany ? 'Salvando...' : 'Cadastrar Empresa'}
            </button>
          </form>

          {/* Publish Job */}
          <form
            onSubmit={handleCreateJob}
            className="p-6 rounded-3xl bg-dd-surface border border-dd-border space-y-4"
          >
            <h2 className="text-base font-black text-dd-text flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              2. Publicar Oportunidade Técnica
            </h2>

            <div>
              <label className="block text-xs font-bold text-dd-text mb-1">Empresa</label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full bg-dd-bg border border-dd-border rounded-xl p-2.5 text-xs font-bold text-dd-text outline-none cursor-pointer"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dd-text mb-1">Título da Vaga</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Ex: Desenvolvedor Front-end React Júnior"
                className="w-full bg-dd-bg border border-dd-border rounded-xl p-2.5 text-xs font-bold text-dd-text outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-dd-text mb-1">Nível</label>
                <select
                  value={jobLevel}
                  onChange={(e) => setJobLevel(e.target.value)}
                  className="w-full bg-dd-bg border border-dd-border rounded-xl p-2 text-xs font-bold text-dd-text outline-none"
                >
                  <option value="ESTAGIO">Estágio</option>
                  <option value="JUNIOR">Júnior</option>
                  <option value="PLENO">Pleno</option>
                  <option value="SENIOR">Sênior</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-dd-text mb-1">Modalidade</label>
                <select
                  value={jobModality}
                  onChange={(e) => setJobModality(e.target.value)}
                  className="w-full bg-dd-bg border border-dd-border rounded-xl p-2 text-xs font-bold text-dd-text outline-none"
                >
                  <option value="REMOTE">Remoto</option>
                  <option value="HYBRID">Híbrido</option>
                  <option value="ONSITE">Presencial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dd-text mb-1">Tecnologias</label>
              <input
                type="text"
                value={jobTechnologies}
                onChange={(e) => setJobTechnologies(e.target.value)}
                placeholder="React, TypeScript, CSS, Git"
                className="w-full bg-dd-bg border border-dd-border rounded-xl p-2.5 text-xs font-bold text-dd-text outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dd-text mb-1">Descrição</label>
              <textarea
                rows={3}
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Detalhes sobre a posição, dia a dia e responsabilidades..."
                className="w-full bg-dd-bg border border-dd-border rounded-xl p-2.5 text-xs font-medium text-dd-text outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={creatingJob || !selectedCompanyId}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {creatingJob ? 'Publicando...' : 'Publicar Vaga com Etapas Técnicas'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
