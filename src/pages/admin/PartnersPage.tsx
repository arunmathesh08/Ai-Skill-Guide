import React, { useState } from 'react';
import {
  Building2,
  Plus,
  ShieldCheck,
  Award,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const PartnersPage: React.FC = () => {
  const { partners, addPartner, showToast } = useApp();
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [domain, setDomain] = useState('Enterprise Cloud & Web Systems');
  const [location, setLocation] = useState('Bengaluru / Hybrid');
  const [tier, setTier] = useState('Gold Tier Partner');

  const handleCreateMoU = () => {
    if (!companyName.trim()) {
      showToast('warning', 'Please provide a company name.');
      return;
    }

    const words = companyName.trim().split(/\s+/);
    const initials = words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : companyName.slice(0, 2).toUpperCase();

    const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-purple-600', 'bg-sky-600', 'bg-rose-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    addPartner({
      name: companyName.trim(),
      initials,
      color: randomColor,
      location: location || 'India / Hybrid',
      mouTitle: `Strategic MoU in ${domain}`,
      mouStatus: 'Active (2026-2029)',
      tier
    });

    setIsAddPartnerOpen(false);
    setCompanyName('');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Relations & Industry MoUs</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Industry Partners & MoUs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage institutional Memorandums of Understanding (MoUs), corporate hiring quotas, and joint Centers of Excellence.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddPartnerOpen(true)}
        >
          Register New Industry Partner
        </Button>
      </div>

      {/* Partners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {partners.map(p => (
          <Card key={p.id} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl ${p.color || 'bg-brand-600'} text-white font-black text-base flex items-center justify-center shadow-xs shrink-0`}
                >
                  {p.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                    <Badge variant="brand" size="xs">
                      {p.tier}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {p.location}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {p.mouStatus}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border text-xs space-y-1">
              <span className="font-bold text-slate-800 block text-[11px] uppercase text-slate-400">
                MoU Objective:
              </span>
              <p className="text-slate-700 font-semibold">{p.mouTitle}</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
              <span>Active Postings: <strong className="text-slate-900">{p.activePostings || 1}</strong></span>
              <span>Total Hired: <strong className="text-emerald-700 font-bold">{p.studentsHired || 0} Graduates</strong></span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Partner Modal */}
      {isAddPartnerOpen && (
        <Modal
          isOpen={isAddPartnerOpen}
          onClose={() => setIsAddPartnerOpen(false)}
          title="Register New Industry Partner & MoU"
          subtitle="Apex Technical University System Industry Integration"
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsAddPartnerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateMoU}>
                Register & Issue Credentials
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name *</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Global Systems, Rolex Tech"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Domain Focus / Center of Excellence</label>
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="e.g. Enterprise Cloud & Web Systems, Precision AI"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location / Campus Base</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Karnataka (Hybrid)"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">MoU Partnership Tier</label>
              <select
                value={tier}
                onChange={e => setTier(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="Platinum Tier Partner">Platinum Tier Partner</option>
                <option value="Gold Tier Partner">Gold Tier Partner</option>
                <option value="Silver Tier Partner">Silver Tier Partner</option>
                <option value="Academic Affiliate">Academic Affiliate</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
