import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import SimulationButton from '../components/SimulationButton';
import ScheduleMeetingButton from '../components/ScheduleMeetingButton';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Calendar, X, Check } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  useEffect(() => {
    fetchUnavailableDates();
  }, []);

  const fetchUnavailableDates = async () => {
    try {
      const response = await axios.get(`${API}/unavailable-dates`);
      setUnavailableDates(response.data || []);
    } catch (error) {
      console.error('Error fetching unavailable dates:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const isDateUnavailable = (day) => {
    if (!day) return false;
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return unavailableDates.includes(dateStr);
  };

  const isPastDate = (day) => {
    if (!day) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert('Por favor, selecione uma data e horário');
      return;
    }

    setLoading(true);
    try {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      
      await axios.post(`${API}/appointments`, {
        name,
        email,
        phone,
        preferred_date: dateStr,
        preferred_time: selectedTime,
        message
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      alert('Erro ao agendar reunião. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-12 bg-white text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#00537C' }}>
              Reunião Agendada!
            </h2>
            <p className="text-gray-700 mb-2">
              Seu agendamento foi realizado com sucesso.
            </p>
            <p className="text-gray-600">
              Entraremos em contato em breve para confirmar.
            </p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
      <Header />

      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#00537C' }}
            >
              <Calendar size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#00537C' }}>
              Agendar Reunião
            </h1>
            <p className="text-gray-700 text-lg">
              Escolha uma data e horário disponível
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card className="p-6 bg-white">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ←
                </button>
                <h3 className="text-xl font-bold" style={{ color: '#00537C' }}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  →
                </button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const unavailable = isDateUnavailable(day);
                  const past = isPastDate(day);
                  const disabled = !day || unavailable || past;
                  const selected = selectedDate === day;

                  return (
                    <button
                      key={index}
                      onClick={() => !disabled && setSelectedDate(day)}
                      disabled={disabled}
                      className={
                        `aspect-square flex items-center justify-center rounded-lg text-sm transition-all duration-200 relative ${
                          disabled
                            ? 'cursor-not-allowed opacity-40'
                            : 'hover:bg-blue-50 cursor-pointer'
                        } ${
                          selected
                            ? 'text-white font-bold shadow-lg'
                            : 'text-gray-700'
                        }`
                      }
                      style={selected ? { backgroundColor: '#00537C' } : {}}
                    >
                      {day}
                      {unavailable && day && (
                        <X size={12} className="absolute top-1 right-1 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center gap-2 mb-1">
                  <X size={14} className="text-red-500" />
                  Data indisponível
                </p>
              </div>
            </Card>

            {/* Form */}
            <Card className="p-6 bg-white">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">
                    Telefone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">
                    Horário <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {times.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={
                          `py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                            selectedTime === time
                              ? 'text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`
                        }
                        style={selectedTime === time ? { backgroundColor: '#00537C' } : {}}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">
                    Mensagem (opcional)
                  </Label>
                  <textarea
                    className="w-full p-3 border rounded-lg resize-none"
                    rows="3"
                    placeholder="Descreva brevemente o motivo da reunião..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {selectedDate && selectedTime && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium" style={{ color: '#00537C' }}>
                      Reunião selecionada:
                    </p>
                    <p className="text-gray-700">
                      {selectedDate} de {monthNames[currentMonth.getMonth()]} às {selectedTime}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !selectedDate || !selectedTime}
                  className="w-full py-6 text-white font-medium text-lg rounded-lg transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: '#00537C' }}
                >
                  {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default AppointmentPage;
