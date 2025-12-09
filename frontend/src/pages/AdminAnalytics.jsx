import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, LogOut, TrendingUp, Users, Eye, Calendar } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [period, setPeriod] = useState('day');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      const [summaryRes, visitsRes] = await Promise.all([
        axios.get(`${API}/admin/analytics/summary`),
        axios.get(`${API}/admin/analytics/visits?period=${period}`)
      ]);
      setSummary(summaryRes.data);
      setDailyVisits(visitsRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0e0e0' }}>
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: '#00537C' }}>
              Análise de Acessos
            </h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut size={18} />
            Sair
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        {summary && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00537C20' }}>
                  <Eye size={24} style={{ color: '#00537C' }} />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1" style={{ color: '#00537C' }}>
                {summary.today}
              </h3>
              <p className="text-gray-600">Acessos Hoje</p>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                  <Calendar size={24} className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-blue-600 mb-1">
                {summary.this_week}
              </h3>
              <p className="text-gray-600">Esta Semana</p>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-green-600 mb-1">
                {summary.this_month}
              </h3>
              <p className="text-gray-600">Este Mês</p>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100">
                  <Users size={24} className="text-purple-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-purple-600 mb-1">
                {summary.unique_today}
              </h3>
              <p className="text-gray-600">Visitantes Únicos</p>
            </Card>
          </div>
        )}

        {/* Period Selector */}
        <Card className="p-6 bg-white mb-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#00537C' }}>
            Gráfico de Acessos
          </h3>
          <div className="flex gap-2 mb-6">
            <Button
              variant={period === 'day' ? 'default' : 'outline'}
              onClick={() => setPeriod('day')}
              style={period === 'day' ? { backgroundColor: '#00537C', color: 'white' } : {}}
            >
              Diário
            </Button>
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              onClick={() => setPeriod('week')}
              style={period === 'week' ? { backgroundColor: '#00537C', color: 'white' } : {}}
            >
              Semanal
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
              onClick={() => setPeriod('month')}
              style={period === 'month' ? { backgroundColor: '#00537C', color: 'white' } : {}}
            >
              Mensal
            </Button>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {dailyVisits.slice(0, 15).map((visit, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{visit.date}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center px-3"
                    style={{
                      width: `${Math.min((visit.total_visits / Math.max(...dailyVisits.map(v => v.total_visits))) * 100, 100)}%`,
                      backgroundColor: '#00537C'
                    }}
                  >
                    <span className="text-white text-sm font-semibold">{visit.total_visits}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {visit.unique_visitors} únicos
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
