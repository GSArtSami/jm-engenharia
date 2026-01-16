import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Lock } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = 'https://jm-engenharia-api.onrender.com';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, {
        password
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao fazer login. Verifique sua senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#e0e0e0' }}>
      <Card className="w-full max-w-md p-8 bg-white">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#00537C' }}
          >
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#00537C' }}>
            Área Administrativa
          </h1>
          <p className="text-gray-600 mt-2">JM Engenharia</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium mb-2 block">
              Senha Administrativa
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-lg"
              autoFocus
            />
            <p className="text-sm text-gray-500 mt-2">
              Digite a senha administrativa para acessar o painel
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-white font-medium text-lg rounded-lg transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#00537C' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
