import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, Check, X, Trash2, LogOut, ChevronLeft, ChevronRight, Ban } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, datesRes] = await Promise.all([
        axios.get(`${API}/admin/appointments`),
        axios.get(`${API}/admin/unavailable-dates`)
      ]);
      setAppointments(appointmentsRes.data);
      setUnavailableDates(datesRes.data.map(d => d.date));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const formatPhoneForWhatsApp = (phone) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    // Add Brazil country code if not present
    if (cleaned.startsWith('55')) {
      return cleaned;
    }
    return '55' + cleaned;
  };

  const sendWhatsAppMessage = (phone, clientName, date, time) => {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    const message = encodeURIComponent(
      `Olá ${clientName}! 👋\n\n` +
      `Sua reunião foi *CONFIRMADA* ✅\n\n` +
      `📅 Data: ${date}\n` +
      `🕐 Horário: ${time}\n\n` +
      `Aguardamos você!\n` +
      `- JM Engenharia`
    );
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const updateAppointmentStatus = async (id, status, appointment = null) => {
    try {
      await axios.put(`${API}/admin/appointments/${id}/status`, { status });
      
      // If confirming, open WhatsApp with message
      if (status === 'confirmed' && appointment) {
        sendWhatsAppMessage(appointment.phone, appointment.name, appointment.date, appointment.time);
      }
      
      fetchData();
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  const deleteAppointment = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await axios.delete(`${API}/admin/appointments/${id}`);
        fetchData();
      } catch (error) {
        alert('Erro ao excluir agendamento');
      }
    }
  };

  const toggleUnavailableDate = async (dateStr) => {
    try {
      if (unavailableDates.includes(dateStr)) {
        await axios.delete(`${API}/admin/unavailable-dates/${dateStr}`);
      } else {
        await axios.post(`${API}/admin/unavailable-dates`, { date: dateStr });
      }
      fetchData();
    } catch (error) {
      alert('Erro ao atualizar data');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  // Calendar logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatDateForComparison = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0e0e0' }}>
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="JM Engenharia" className="h-10 w-auto object-contain" />
            <h1 className="text-2xl font-bold" style={{ color: '#00537C' }}>Gerenciar Agendamentos</h1>
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/admin/dashboard')} variant="outline">
              Voltar ao Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut size={18} />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <Card className="p-6 bg-white">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#00537C' }}>
              <Ban className="inline mr-2" size={20} />
              Bloquear Datas
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Clique nas datas para marcar como indisponível. Datas bloqueadas aparecerão em vermelho para os clientes.
            </p>
            
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded">
                <ChevronLeft size={20} />
              </button>
              <span className="font-bold" style={{ color: '#00537C' }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentMonth).map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="p-2"></div>;
                }
                
                const dateStr = formatDateForComparison(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                );
                const isUnavailable = unavailableDates.includes(dateStr);
                const today = new Date();
                const isPast = new Date(dateStr) < new Date(today.toDateString());
                
                return (
                  <button
                    key={day}
                    onClick={() => !isPast && toggleUnavailableDate(dateStr)}
                    disabled={isPast}
                    className={`p-2 text-sm rounded transition-all ${
                      isPast 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : isUnavailable 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'hover:bg-gray-100'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Data indisponível</span>
              </div>
            </div>
          </Card>

          {/* Appointments List */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#00537C' }}>
                  <Calendar className="inline mr-2" size={20} />
                  Agendamentos
                </h2>
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">Todos</option>
                    <option value="pending">Pendentes</option>
                    <option value="confirmed">Confirmados</option>
                    <option value="cancelled">Cancelados</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Carregando...</div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum agendamento encontrado
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User size={16} className="text-gray-500" />
                            <span className="font-bold">{apt.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {apt.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {apt.time}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(apt.status)}`}>
                          {getStatusLabel(apt.status)}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-2 text-sm mb-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} />
                          {apt.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} />
                          {apt.phone}
                        </div>
                      </div>

                      {apt.message && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                          <MessageSquare size={14} className="mt-0.5" />
                          <span>{apt.message}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-3 border-t">
                        {apt.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed', apt)}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              <Check size={14} />
                              Confirmar
                            </Button>
                            <Button
                              onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                              variant="outline"
                              className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                              size="sm"
                            >
                              <X size={14} />
                              Cancelar
                            </Button>
                          </>
                        )}
                        {apt.status === 'cancelled' && (
                          <Button
                            onClick={() => updateAppointmentStatus(apt.id, 'pending')}
                            variant="outline"
                            className="flex items-center gap-1"
                            size="sm"
                          >
                            Reabrir
                          </Button>
                        )}
                        {apt.status === 'confirmed' && (
                          <Button
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                            variant="outline"
                            className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                            size="sm"
                          >
                            <X size={14} />
                            Cancelar
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteAppointment(apt.id)}
                          variant="outline"
                          className="flex items-center gap-1 text-red-600 hover:bg-red-50 ml-auto"
                          size="sm"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
