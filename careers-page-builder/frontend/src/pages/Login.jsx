import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/common/UI';
import { Briefcase, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await login(email, password);
      const slug = data.company_slug || 'acme';
      navigate(`/${slug}/edit`);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
          <Briefcase className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Careers Miner</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to your recruiter portal to customize your brand and manage open jobs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Work Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recruiter@acme.com"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full mt-2 py-2.5"
            >
              Sign In to Builder <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Seed demo quick-fill */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              One-Click Demo Credentials:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('recruiter@acme.com')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800">Acme Corporation</span>
                  <span className="text-slate-500 block">recruiter@acme.com</span>
                </div>
                <span className="text-blue-600 font-medium">Select</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('recruiter@novalabs.ai')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800">NovaLabs AI</span>
                  <span className="text-slate-500 block">recruiter@novalabs.ai</span>
                </div>
                <span className="text-purple-600 font-medium">Select</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('recruiter@vertexhealth.com')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800">Vertex Health</span>
                  <span className="text-slate-500 block">recruiter@vertexhealth.com</span>
                </div>
                <span className="text-emerald-600 font-medium">Select</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              Default password for all demo accounts: <code className="font-mono text-slate-600">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
