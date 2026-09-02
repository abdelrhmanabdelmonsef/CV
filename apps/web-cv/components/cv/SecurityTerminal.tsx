'use client';

import { useEffect, useRef, useState } from 'react';
import type { TerminalOutputs } from 'cv-data';
import { useMatrix } from '../../contexts/MatrixContext';

type TerminalLine = {
  type: 'prompt' | 'output' | 'system';
  content: string;
  html?: boolean;
};

const INITIAL_LINES: TerminalLine[] = [
  { type: 'system', content: '// Active Secure Session Established. System OK.' },
  {
    type: 'output',
    content: `===========================================================
  █████  ███████  ██████  ███████ ███████
 ██   ██ ██      ██       ██      ██
 ███████ █████   ██   ███ █████   ███████
 ██   ██ ██      ██    ██ ██           ██
 ██   ██ ███████  ██████  ███████ ███████  INTELLIGENT SHELL
===========================================================`
  },
  { type: 'output', content: 'Welcome, cybersecurity recruiter! Live console operational.' },
  { type: 'output', content: 'Type help to view available security commands.' }
];

function renderLine(line: TerminalLine, index: number) {
  if (line.type === 'prompt') {
    return (
      <div key={index} className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed">
        <span className="text-accent-cyan font-bold">guest@aegis:~$</span>{' '}
        <span className="text-accent-green">{line.content}</span>
      </div>
    );
  }
  if (line.html) {
    return (
      <div
        key={index}
        className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-text-primary"
        dangerouslySetInnerHTML={{ __html: line.content }}
      />
    );
  }
  return (
    <div
      key={index}
      className={`whitespace-pre-wrap font-mono text-[13px] leading-relaxed ${
        line.type === 'system' ? 'text-text-muted italic' : 'text-text-primary'
      }`}
    >
      {line.content}
    </div>
  );
}

export default function SecurityTerminal({ terminal }: { terminal: TerminalOutputs }) {
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_LINES);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeTimersRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set());
  const { toggleMatrix } = useMatrix();

  useEffect(() => {
    return () => {
      activeTimersRef.current.forEach(clearInterval);
      activeTimersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  const appendOutput = (content: string, html = false) => {
    setLines((prev) => [...prev, { type: 'output', content, html }]);
  };

  const handleCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setLines((prev) => [...prev, { type: 'prompt', content: raw }]);

    switch (cmd) {
      case 'help':
        appendOutput(terminal.help || `Available Security Commands:
  help       - Display this assistance manual.
  whoami     - View profile metadata & clearance.
  skills     - Perform interactive confidence mapping.
  certs      - List encrypted academic credentials.
  socials    - Display telemetry connection coordinates.
  nmap       - Perform active local credential scan.
  exploit    - Launch simulated binary penetration matrix.
  projects   - Output major software & security engineering builds.
  exp        - View professional work history timeline.
  edu        - Inspect academic degree credentials.
  matrix     - Toggle low-overhead matrix rain background.
  clear      - Flush terminal logs.`);
        break;
      case 'whoami':
        appendOutput(terminal.whoami);
        break;
      case 'skills':
        appendOutput(terminal.skills);
        break;
      case 'certs':
        appendOutput(terminal.certs);
        break;
      case 'socials':
        appendOutput(terminal.socials);
        break;
      case 'projects':
        appendOutput(terminal.projects || 'No projects output available.');
        break;
      case 'exp':
        appendOutput(terminal.exp || 'No work history dossier available.');
        break;
      case 'edu':
        appendOutput(terminal.edu || 'No academic credentials output available.');
        break;
      case 'clear':
        setLines([]);
        break;
      case 'matrix':
        toggleMatrix();
        appendOutput('[+] System Backdrop Altered: Canvas matrix digital rain toggled.');
        break;
      case 'nmap': {
        if (terminal.nmap) {
          appendOutput(terminal.nmap);
        } else {
          appendOutput('[+] Initiating local system credential scans...');
          let dots = 0;
          const timer = setInterval(() => {
            appendOutput(`  Scanning port ${80 + dots * 100} ... SECURE`);
            dots++;
            if (dots >= 4) {
              clearInterval(timer);
              activeTimersRef.current.delete(timer);
              appendOutput('[+] SCAN COMPLETE: 4 services verified. No active leaks detected. All academic certificates ready to view.');
            }
          }, 300);
          activeTimersRef.current.add(timer);
        }
        break;
      }
      case 'exploit': {
        if (terminal.exploit) {
          appendOutput(terminal.exploit);
        } else {
          appendOutput('[!] ALERT: UNAUTHORIZED PRIVILEGE ESCALATION ATTEMPT DETECTED!');
          appendOutput('[+] Launching local Aegis bypass kernel exploit...');
          let tick = 0;
          const timer = setInterval(() => {
            const hex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
            appendOutput(`  [DEBUG_0x${hex}] Overflowing memory heap buffer... OK`);
            tick++;
            if (tick >= 6) {
              clearInterval(timer);
              activeTimersRef.current.delete(timer);
              appendOutput('[+] EXPLOIT SUCCESSFUL: PRIVILEGE ESCALATION TO ROOT\n[+] Abdel-Rahman is highly proficient. Hiring him is advised.');
            }
          }, 250);
          activeTimersRef.current.add(timer);
        }
        break;
      }
      default:
        appendOutput(`[!] COMMAND NOT FOUND: '${raw}'\nType help to view supported commands.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="relative rounded-2xl border border-border-green/40 bg-bg-card/70 backdrop-blur-md overflow-hidden mb-8
      shadow-[0_0_30px_rgba(0,255,136,0.06)]">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle bg-bg-secondary/50">
        <div className="flex items-center gap-2 text-xs font-mono text-accent-green/80">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="animate-pulse-dot">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          AEGIS SECURE LOGSHELL v2.4.9 — guest@aegis
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent-red/80" />
          <div className="w-3 h-3 rounded-full bg-accent-amber/80" />
          <div className="w-3 h-3 rounded-full bg-accent-green/80" />
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={bodyRef}
        onClick={() => inputRef.current?.focus()}
        role="log"
        aria-label="Security terminal output"
        aria-live="polite"
        className="p-4 max-h-80 overflow-y-auto space-y-1 bg-bg-primary/40"
      >
        {lines.map(renderLine)}
        <div className="flex items-center gap-2 mt-2">
          <label htmlFor="terminal-input" className="text-accent-cyan font-mono text-[13px] font-bold shrink-0">
            guest@aegis:~$
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none font-mono text-[13px] text-accent-green
              caret-accent-green placeholder:text-text-muted/40"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            autoFocus
            aria-label="Terminal command input"
            placeholder="type a command..."
          />
        </div>
      </div>
    </div>
  );
}
