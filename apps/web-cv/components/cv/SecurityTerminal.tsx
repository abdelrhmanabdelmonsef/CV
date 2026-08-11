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
      <div key={index} className="t-out">
        <span className="t-prompt">guest@aegis:~$</span>{' '}
        <span className="t-green">{line.content}</span>
      </div>
    );
  }
  if (line.html) {
    return <div key={index} className="t-out" dangerouslySetInnerHTML={{ __html: line.content }} />;
  }
  const cls = line.type === 'system' ? 't-out t-muted' : 't-out';
  return <div key={index} className={cls}>{line.content}</div>;
}

export default function SecurityTerminal({ terminal }: { terminal: TerminalOutputs }) {
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_LINES);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleMatrix } = useMatrix();

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
        appendOutput(
          `Available Security Commands:\n  help       - Display this assistance manual.\n  whoami     - View profile metadata & clearance.\n  skills     - Perform interactive confidence mapping.\n  certs      - List encrypted academic credentials.\n  socials    - Display telemetry connection coordinates.\n  nmap       - Perform active local credential scan.\n  exploit    - Launch simulated binary penetration matrix.\n  matrix     - Toggle low-overhead matrix rain background.\n  clear      - Flush terminal logs.`
        );
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
      case 'clear':
        setLines([]);
        break;
      case 'matrix':
        toggleMatrix();
        appendOutput('[+] System Backdrop Altered: Canvas matrix digital rain toggled.');
        break;
      case 'nmap': {
        appendOutput('[+] Initiating local system credential scans...');
        let dots = 0;
        const timer = setInterval(() => {
          appendOutput(`  Scanning port ${80 + dots * 100} ... SECURE`);
          dots++;
          if (dots >= 4) {
            clearInterval(timer);
            appendOutput('[+] SCAN COMPLETE: 4 services verified. No active leaks detected. All academic certificates ready to view.');
          }
        }, 300);
        break;
      }
      case 'exploit': {
        appendOutput('[!] ALERT: UNAUTHORIZED PRIVILEGE ESCALATION ATTEMPT DETECTED!');
        appendOutput('[+] Launching local Aegis bypass kernel exploit...');
        let tick = 0;
        const timer = setInterval(() => {
          const hex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
          appendOutput(`  [DEBUG_0x${hex}] Overflowing memory heap buffer... OK`);
          tick++;
          if (tick >= 6) {
            clearInterval(timer);
            appendOutput('[+] EXPLOIT SUCCESSFUL: PRIVILEGE ESCALATION TO ROOT\n[+] Abdel-Rahman is highly proficient. Hiring him is advised.');
          }
        }, 250);
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
    <div className="terminal-panel">
      <div className="terminal-header">
        <div className="terminal-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'pulse-dot 2s infinite' }}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          AEGIS SECURE LOGSHELL v2.4.9 — guest@aegis
        </div>
        <div className="terminal-dots">
          <div className="t-dot red" />
          <div className="t-dot yellow" />
          <div className="t-dot green" />
        </div>
      </div>
      <div
        className="terminal-body"
        ref={bodyRef}
        onClick={() => inputRef.current?.focus()}
        role="presentation"
      >
        {lines.map(renderLine)}
        <div className="t-input-container">
          <span className="t-prompt">guest@aegis:~$</span>
          <input
            ref={inputRef}
            type="text"
            className="t-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
