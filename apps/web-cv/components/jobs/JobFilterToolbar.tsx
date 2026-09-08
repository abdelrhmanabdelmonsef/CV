'use client';

import type {
  AIProvider,
  LocationFilter,
  PlatformScopeFilter,
  RoleFocusFilter,
  SearchFilterState
} from '../../lib/types/job-matcher';

interface JobFilterToolbarProps {
  filters: SearchFilterState;
  onFilterChange: (newFilters: SearchFilterState) => void;
  onSearchTrigger: () => void;
  isLoading: boolean;
  provider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  serverConfig?: { hasNvidia?: boolean; hasOpenAI?: boolean; hasGemini?: boolean };
  onOpenKeyDrawer: () => void;
}

const INDEXED_SITES = [
  'Glassdoor',
  'Nafezly (نفذلي)',
  'Forasna (فرصنا)',
  'Ureed (أريد)',
  'Baeed (بعيد)',
  'Bahr (بحر)',
  'AngelList (Wellfound)',
  'Indeed',
  'Khamsat (خمسات)',
  'Bayt (بيت.كوم)',
  'Part-Time (بارتايم)',
  'Workana',
  'Freelancer.com',
  'Kafiil (كفيل)',
  'LinkedIn',
  'Wuzzuf',
  'RemoteOK',
  'WeWorkRemotely'
];

export default function JobFilterToolbar({
  filters,
  onFilterChange,
  onSearchTrigger,
  isLoading,
  provider,
  onProviderChange,
  serverConfig,
  onOpenKeyDrawer
}: JobFilterToolbarProps) {
  const locations: { id: LocationFilter; label: string }[] = [
    { id: 'all', label: 'All Regions' },
    { id: 'egypt', label: 'Egypt Only' },
    { id: 'mena', label: 'MENA & Gulf' },
    { id: 'remote', label: '100% Remote' }
  ];

  const roles: { id: RoleFocusFilter; label: string }[] = [
    { id: 'all', label: 'All Specialties' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'backend', label: 'Backend Systems' },
    { id: 'cybersecurity', label: 'Cybersecurity' }
  ];

  const platformScopes: { id: PlatformScopeFilter; label: string; tag: string }[] = [
    { id: 'all', label: 'All 18+ Sites', tag: 'GLOBAL + ARAB' },
    { id: 'mena', label: 'Egypt & MENA', tag: 'WUZZUF / FORASNA' },
    { id: 'remote', label: 'Remote Hubs', tag: 'BAEED / REMOTEOK' },
    { id: 'freelance', label: 'Freelance & Projects', tag: 'NAFEZLY / KHAMSAT' },
    { id: 'corporate', label: 'Global Tech', tag: 'GLASSDOOR / INDEED' }
  ];

  const minScores: number[] = [50, 65, 75, 85];
  const activeScope = filters.platformScope || 'all';

  return (
    <div className="bg-[#0a0f19] border border-[#162438] rounded-xl p-4 md:p-5 mb-8 shadow-xl font-mono">
      {/* Top Bar: Provider Selection & Primary Search Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#162438]">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Provider Toggle Pill */}
          <div className="inline-flex rounded-lg p-1 bg-[#06090e] border border-[#162438] flex-wrap gap-1">
            <button
              type="button"
              onClick={() => onProviderChange('nvidia')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                provider === 'nvidia'
                  ? 'bg-[#76b900]/20 text-[#76b900] border border-[#76b900]/60 shadow-[0_0_10px_rgba(118,185,0,0.3)]'
                  : 'text-[#64748b] hover:text-[#94a3b8] border border-transparent'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${provider === 'nvidia' ? 'bg-[#76b900]' : 'bg-[#64748b]'}`} />
              <span>NVIDIA (Kimi-K3)</span>
              {serverConfig?.hasNvidia && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-[#76b900]/20 text-[#76b900]">ENV</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onProviderChange('gemini')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                provider === 'gemini'
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50 shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                  : 'text-[#64748b] hover:text-[#94a3b8] border border-transparent'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${provider === 'gemini' ? 'bg-[#00e5ff]' : 'bg-[#64748b]'}`} />
              <span>Gemini</span>
              {serverConfig?.hasGemini && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-[#00ff88]/20 text-[#00ff88]">ENV</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onProviderChange('openai')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                provider === 'openai'
                  ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50 shadow-[0_0_8px_rgba(0,255,136,0.2)]'
                  : 'text-[#64748b] hover:text-[#94a3b8] border border-transparent'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${provider === 'openai' ? 'bg-[#00ff88]' : 'bg-[#64748b]'}`} />
              <span>OpenAI</span>
              {serverConfig?.hasOpenAI && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-[#00ff88]/20 text-[#00ff88]">ENV</span>
              )}
            </button>
          </div>

          {/* Model / Override Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenKeyDrawer}
            title="Model & Key Settings"
            className="p-2 rounded-lg bg-[#06090e] border border-[#162438] text-[#64748b] hover:text-[#00e5ff] hover:border-[#00e5ff]/40 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Primary Scan Button */}
        <button
          type="button"
          onClick={onSearchTrigger}
          disabled={isLoading}
          className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold tracking-wider uppercase transition-all cursor-pointer ${
            isLoading
              ? 'bg-[#162438] text-[#64748b] border border-[#24354d] cursor-not-allowed'
              : 'bg-[#00ff88]/20 hover:bg-[#00ff88]/30 text-[#00ff88] border border-[#00ff88]/50 hover:border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.25)] active:scale-95'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin text-[#00ff88]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>SCANNING 18+ PLATFORMS...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>DISCOVER & MATCH ON 18+ SITES</span>
            </>
          )}
        </button>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {/* Location Filter */}
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#94a3b8] block mb-1.5">
            Geographic Targeting:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {locations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => onFilterChange({ ...filters, locationFilter: loc.id })}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-all cursor-pointer text-left truncate ${
                  filters.locationFilter === loc.id
                    ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                    : 'bg-[#162438]/40 text-[#94a3b8] hover:text-[#f1f5f9] border-[#24354d]/50'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Role Focus Filter */}
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#94a3b8] block mb-1.5">
            Specialization Focus:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => onFilterChange({ ...filters, roleFocus: role.id })}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-all cursor-pointer text-left truncate ${
                  filters.roleFocus === role.id
                    ? 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.2)]'
                    : 'bg-[#162438]/40 text-[#94a3b8] hover:text-[#f1f5f9] border-[#24354d]/50'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Scope Filter */}
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#94a3b8] block mb-1.5">
            Target Platform Ecosystem:
          </label>
          <div className="flex flex-col gap-1">
            {platformScopes.map((scope) => (
              <button
                key={scope.id}
                type="button"
                onClick={() => onFilterChange({ ...filters, platformScope: scope.id })}
                className={`py-1 px-2 rounded-md text-[11px] font-mono border transition-all cursor-pointer flex items-center justify-between ${
                  activeScope === scope.id
                    ? 'bg-[#a855f7]/20 text-[#d8b4fe] border-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.25)]'
                    : 'bg-[#162438]/40 text-[#94a3b8] hover:text-[#f1f5f9] border-[#24354d]/50'
                }`}
              >
                <span className="font-bold">{scope.label}</span>
                <span className="text-[9px] text-[#64748b]">{scope.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Min Score Filter */}
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#94a3b8] block mb-1.5">
            Minimum Match Fit:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {minScores.map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => onFilterChange({ ...filters, minScore: score })}
                className={`py-2 px-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                  filters.minScore === score
                    ? 'bg-[#ffb300]/20 text-[#ffb300] border-[#ffb300] shadow-[0_0_8px_rgba(255,179,0,0.2)]'
                    : 'bg-[#162438]/40 text-[#94a3b8] hover:text-[#f1f5f9] border-[#24354d]/50'
                }`}
              >
                ≥{score}% Match
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Indexed Platforms Live Badge Strip */}
      <div className="mt-4 pt-3 border-t border-[#162438]/60 flex items-center gap-2 flex-wrap text-[10px]">
        <span className="text-[#64748b] uppercase tracking-wider">INDEXED PLATFORMS:</span>
        {INDEXED_SITES.map((site, i) => (
          <span
            key={i}
            className="px-1.5 py-0.5 rounded bg-[#06090e] border border-[#162438] text-[#94a3b8] hover:text-[#00e5ff] hover:border-[#00e5ff]/40 transition-colors"
          >
            {site}
          </span>
        ))}
      </div>
    </div>
  );
}
