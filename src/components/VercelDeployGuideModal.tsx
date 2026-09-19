import React, { useState } from 'react';
import { FileCode2, Check, Copy, ExternalLink, X, Terminal, Globe, Rocket, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const vercelJsonContent = `{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  const packageJsonScripts = `"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] text-[#1F1615] rounded-3xl max-w-3xl w-full border border-[#D4AF37]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-black text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-lg">
              ▲
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#34D399]">
                FREE HOSTING GUIDE & REPOSITORY FILES
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white">
                Vercel Free Frontend Deployment Guide
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          {/* Answer to User Query */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2">
            <h4 className="font-bold text-sm text-[#2B090F] flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[#6B1724]" />
              <span>What frontend files does Vercel support for 100% Free Hosting?</span>
            </h4>
            <p className="leading-relaxed text-stone-600">
              Vercel provides <strong>free hosting for any static frontend SPA</strong> built with React, Vite, and Three.js. The exact files that power your Vercel deployment (already pre-configured in this project) are:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                <strong>1. vercel.json:</strong> Handles Single-Page App (SPA) URL rewrites so pages and modals refresh smoothly without 404 errors.
              </div>
              <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                <strong>2. package.json:</strong> Declares dependencies (`three`, `motion`, `tailwindcss`) and the build script: <code>npm run build</code>.
              </div>
              <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                <strong>3. vite.config.ts:</strong> Configures the lightning-fast Vite bundler that outputs clean static files into the <code>dist/</code> folder.
              </div>
              <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                <strong>4. index.html & src/:</strong> Your primary HTML5 entrypoint and modern React 19 + WebGL 3D codebase.
              </div>
            </div>
          </div>

          {/* Code Snippet: vercel.json */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-stone-800 text-xs">
                Essential File: <code>vercel.json</code> (Root directory)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(vercelJsonContent, 'vercelJson')}
                className="flex items-center gap-1 text-[11px] text-[#4A1017] hover:underline font-semibold"
              >
                {copied === 'vercelJson' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy vercel.json</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-stone-900 text-[#34D399] p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto">
              {vercelJsonContent}
            </pre>
          </div>

          {/* 3 Simple Free Deployment Methods */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#2B090F]">
              How to Deploy for Free for Tonight&apos;s Client Demo:
            </h4>

            {/* Method 1 */}
            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <div className="font-bold text-[#4A1017] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#4A1017] text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Fastest: GitHub to Vercel (1-Click Free Hosting)</span>
              </div>
              <p className="mt-1.5 text-stone-600 leading-relaxed">
                Export or push your project to a GitHub repository. Visit <strong>vercel.com/new</strong>, sign in with GitHub, and select your repository. Vercel automatically detects Vite and deploys your 3D jewellery website to a live <code>.vercel.app</code> URL in under 45 seconds!
              </p>
              <div className="mt-2.5 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900">
                <strong>Fix for npm ERESOLVE error on Vercel:</strong> We have added <code>.npmrc</code> with <code>legacy-peer-deps=true</code> and aligned <code>esbuild</code> in <code>package.json</code>. If your build is already failing on Vercel, simply push the updated repository, or in your Vercel Project <em>Settings → General → Build & Development Settings</em>, set <strong>Install Command</strong> to:
                <code className="block mt-1 p-1 bg-white rounded border border-emerald-300 font-mono text-stone-800">
                  npm install --legacy-peer-deps
                </code>
              </div>
            </div>

            {/* Method 2 */}
            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <div className="font-bold text-[#4A1017] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#4A1017] text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Instant CLI Deploy:</span>
              </div>
              <div className="mt-1.5 p-2 bg-stone-900 text-stone-200 rounded-lg font-mono text-[11px]">
                npx vercel
              </div>
              <p className="mt-1 text-stone-500">
                Run this in your terminal. Follow the 3 prompts (hit Enter for defaults), and Vercel will give you a live shareable URL instantly.
              </p>
            </div>
          </div>

          {/* Vercel Link CTA */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-stone-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Zero server costs • SSL certified • Global Edge CDN</span>
            </div>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-black hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <span>Open Vercel Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
