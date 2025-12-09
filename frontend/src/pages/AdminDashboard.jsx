import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Home, MapPin, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const adminOptions = [
    {
      id: 'properties',
      title: 'Gerenciar Imóveis',
      description: 'Adicionar, editar e remover imóveis',
      icon: Home,
      path: '/admin/properties'
    },
    {
      id: 'lands',
      title: 'Gerenciar Terrenos',
      description: 'Adicionar, editar e remover terrenos',
      icon: MapPin,
      path: '/admin/lands'
    },
    {
      id: 'analytics',
      title: 'Análise de Acessos',
      description: 'Visualizar estatísticas do site',
      icon: 'BarChart',
      path: '/admin/analytics'
    },
    {
      id: 'appointments',
      title: 'Agendamentos',
      description: 'Gerenciar agendamentos de clientes',
      icon: 'Calendar',
      path: '/admin/appointments'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0e0e0' }}>
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <img src="/logo.jpg" alt="JM Engenharia" className="h-10 w-auto object-contain" />
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Sair
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#00537C' }}>
            Painel Administrativo
          </h1>
          <p className="text-gray-600 mb-12">Gerencie imóveis e terrenos</p>

          <div className="grid md:grid-cols-2 gap-6">
            {adminOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Link key={option.id} to={option.path}>
                  <Card className="p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: '#00537C' }}
                    >
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#00537C' }}>
                      {option.title}
                    </h3>
                    <p className="text-gray-600">{option.description}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
