'use client';

import { useEffect, useState } from 'react';
import {
  clearSessionApiKey,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENAI_MODEL,
  detectKeyProvider,
  getSessionApiKey,
  getSessionModel,
  getSessionProvider,
  maskApiKey,
  setSessionApiKey,
  setSessionModel,
  setSessionProvider
} from '../../lib/session-storage-key';

interface KeyConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (armed: boolean) => void;
}

const AVAILABLE_GEMINI_MODELS = [
  { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash', tag: 'RECOMMENDED' },
  { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', tag: 'LATEST' },
  { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', tag: 'STABLE' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', tag: 'LEGACY' }
];

const AVAILABLE_OPENAI_MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o (Web Search)', tag: 'RECOMMENDED' },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini', tag: 'FAST' },
  { id: 'gpt-4.1', label: 'GPT-4.1', tag: 'ADVANCED' },
  { id: 'o3-mini', label: 'o3-mini', tag: 'REASONING' }
];

export default function KeyConfigDrawer({
  isOpen,
  onClose,
  onKeySaved
}: KeyConfigDrawerProps) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [currentArmedKey, setCurrentArmedKey] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  const [selectedModel, setSelectedModel] = useState(DEFAULT_GEMINI_MODEL);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const activeKey = getSessionApiKey();
      const activeProvider = getSessionProvider();
      setCurrentArmedKey(activeKey);
      setProvider(activeProvider);
      setSelectedModel(getSessionModel(activeProvider));
      setApiKeyInput(activeKey);
      setNotification(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (newProvider: 'gemini' | 'openai') => {
    setProvider(newProvider);
    setSelectedModel(getSessionModel(newProvider));
    setNotification(null);
  };

  const handleKeyInputChange = (val: string) => {
    setApiKeyInput(val);
    const detected = detectKeyProvider(val);
    if (detected && detected !== provider) {
      setProvider(detected);
      setSelectedModel(getSessionModel(detected));
      setNotification(`Detected ${detected === 'openai' ? 'OpenAI' : 'Google Gemini'} key format. Switched provider.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKeyInput.trim();
    if (!cleanKey) {
      setNotification('Please enter a valid API key.');
      return;
    }

    setSessionApiKey(cleanKey);
    setSessionProvider(provider);
    setSessionModel(selectedModel, provider);
    setCurrentArmedKey(cleanKey);
    setNotification(`${provider === 'openai' ? 'OpenAI' : 'Gemini'} key & model armed in session storage.`);
    onKeySaved(true);

    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handlePurge = () => {
    clearSessionApiKey();
    setCurrentArmedKey('');
    setApiKeyInput('');
    setNotification('Key completely purged from memory & session storage.');
    onKeySaved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06090e]/80 backdrop-blur-md font-mono animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0a0f19] border border-[#00e5ff]/50 rounded-xl p-6 shadow-[0_0_40px_rgba(0,229,255,0.2)] overflow-hidden">
        {/* Top Scanline Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00ff88] via-[#00e5ff] to-[#00ff88]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#162438]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-ping" />
            <h3 className="text-sm md:text-base font-bold text-[#f1f5f9] tracking-wider uppercase">
              CREDENTIAL CONFIGURATION
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#64748b] hover:text-[#f1f5f9] transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Active Key Status Banner */}
        {currentArmedKey && (
          <div className="mb-5 p-3 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-[#00ff88] font-bold block mb-0.5">
                ARMED IN BROWSER SESSION ({provider.toUpperCase()}):
              </span>
              <span className="text-[#94a3b8] font-mono">{maskApiKey(currentArmedKey)}</span>
            </div>
            <button
              type="button"
              onClick={handlePurge}
              className="text-[11px] font-bold text-[#ff3b30] hover:text-[#ff3b30]/80 underline cursor-pointer"
            >
              PURGE KEY
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#94a3b8] block mb-1.5">
              Target AI Provider:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleProviderChange('gemini')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                  provider === 'gemini'
                    ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                    : 'bg-[#162438]/50 text-[#64748b] border-[#24354d]'
                }`}
              >
                Google Gemini (Search Tool)
              </button>
              <button
                type="button"
                onClick={() => handleProviderChange('openai')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                  provider === 'openai'
                    ? 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.2)]'
                    : 'bg-[#162438]/50 text-[#64748b] border-[#24354d]'
                }`}
              >
                OpenAI (Web Search)
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#94a3b8] block mb-1.5">
              {provider === 'gemini' ? 'Gemini Model:' : 'OpenAI Model:'}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(provider === 'gemini' ? AVAILABLE_GEMINI_MODELS : AVAILABLE_OPENAI_MODELS).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModel(m.id)}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-mono border transition-all cursor-pointer text-left flex items-center justify-between ${
                    selectedModel === m.id
                      ? provider === 'gemini'
                        ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                        : 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.2)]'
                      : 'bg-[#162438]/40 text-[#94a3b8] hover:text-[#f1f5f9] border-[#24354d]/50'
                  }`}
                >
                  <span className="truncate">{m.label}</span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-[#06090e] text-[#cbd5e1] border border-[#24354d]">
                    {m.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Key Input */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#94a3b8] block mb-1.5">
              {provider === 'gemini' ? 'Gemini API Key:' : 'OpenAI API Key:'}
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => handleKeyInputChange(e.target.value)}
                placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                className="w-full bg-[#06090e] border border-[#162438] focus:border-[#00e5ff] rounded-lg py-2.5 pl-3 pr-10 text-xs text-[#f1f5f9] outline-none transition-colors"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f1f5f9] p-1 cursor-pointer"
              >
                {showKey ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Feedback Notification */}
          {notification && (
            <p className="text-xs text-[#00ff88] animate-fade-in">
              {notification}
            </p>
          )}

          {/* Security Notice */}
          <div className="p-3 rounded-lg bg-[#06090e] border border-[#162438] text-[11px] text-[#64748b] leading-relaxed">
            <span className="text-[#cbd5e1] font-bold block mb-1">DEFENSIVE SECURITY GUARANTEE:</span>
            Your API key is saved exclusively in your browser's <code className="text-[#00e5ff]">sessionStorage</code> and is sent directly to the model provider's API. It is never logged, saved in a database, or accessible after the tab is closed.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs tracking-wider uppercase text-[#94a3b8] hover:text-[#f1f5f9] border border-transparent hover:border-[#162438] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase bg-[#00e5ff]/20 hover:bg-[#00e5ff]/30 text-[#00e5ff] border border-[#00e5ff]/50 hover:border-[#00e5ff] transition-all shadow-[0_0_10px_rgba(0,229,255,0.2)] cursor-pointer"
            >
              Arm Key For Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
