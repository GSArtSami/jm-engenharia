import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calculator } from 'lucide-react';

const SimulationPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [income, setIncome] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const incomeOptions = [
    { value: '1500', label: 'R$ 1.500' },
    { value: '2160', label: 'R$ 2.160' },
    { value: '2850', label: 'R$ 2.850' },
    { value: '3500', label: 'R$ 3.500' },
    { value: '4000', label: 'R$ 4.000' },
    { value: '4700', label: 'R$ 4.700' },
    { value: '5500', label: 'R$ 5.500' },
    { value: '8600', label: 'R$ 8.600' },
    { value: '12000', label: 'R$ 12.000' }
  ];

  const propertyOptions = [
    { value: '210000', label: 'R$ 210.000' },
    { value: '350000', label: 'R$ 350.000' },
    { value: '500000', label: 'R$ 500.000' }
  ];

  // Dados reais de simulação para imóvel de R$ 210.000
  const simulationData = {
    '210000': {
      '1500': {
        juros: '4,85% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 131.243,97',
        subsidio: 'R$ 13.090,00',
        liberado: 'R$ 65.666,03',
        sacPrimeira: 'R$ 450,00',
        sacUltima: 'R$ 156,97',
        pricePrimeira: 'R$ 354,74',
        priceUltima: 'R$ 321,01'
      },
      '2160': {
        juros: '4,85% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 107.186,00',
        subsidio: 'R$ 6.313,00',
        liberado: 'R$ 96.501,00',
        sacPrimeira: 'R$ 647,99',
        sacUltima: 'R$ 230,67',
        pricePrimeira: 'R$ 508,00',
        priceUltima: 'R$ 471,75'
      },
      '2850': {
        juros: '5,12% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 83.279,90',
        subsidio: 'R$ 2.028,00',
        liberado: 'R$ 124.692,10',
        sacPrimeira: 'R$ 855,00',
        sacUltima: 'R$ 298,12',
        pricePrimeira: 'R$ 667,88',
        priceUltima: 'R$ 629,31'
      },
      '3500': {
        juros: '5,64% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 68.555,16',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 141.444,84',
        sacPrimeira: 'R$ 1.050,00',
        sacUltima: 'R$ 363,32',
        pricePrimeira: 'R$ 824,52',
        priceUltima: 'R$ 784,58'
      },
      '4000': {
        juros: '6,17% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 56.352,99',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 153.647,01',
        sacPrimeira: 'R$ 1.200,00',
        sacUltima: 'R$ 392,66',
        pricePrimeira: 'R$ 942,02',
        priceUltima: 'R$ 901,08'
      },
      '4700': {
        juros: '7,23% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 46.473,70',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 163.526,30',
        sacPrimeira: 'R$ 1.410,00',
        sacUltima: 'R$ 416,62',
        pricePrimeira: 'R$ 1.111,45',
        priceUltima: 'R$ 1.069,70'
      },
      '5500': {
        juros: '8,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 42.000,00',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 168.000,00',
        sacPrimeira: 'R$ 1.609,51',
        sacUltima: 'R$ 427,71',
        pricePrimeira: 'R$ 1.279,93',
        priceUltima: 'R$ 1.237,81'
      },
      '8600': {
        juros: '8,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 42.000,00',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 168.000,00',
        sacPrimeira: 'R$ 1.609,51',
        sacUltima: 'R$ 427,71',
        pricePrimeira: 'R$ 1.279,93',
        priceUltima: 'R$ 1.237,81'
      },
      '12000': {
        juros: '10,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 42.000,00',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 168.000,00',
        sacPrimeira: 'R$ 1.867,11',
        sacUltima: 'R$ 428,32',
        pricePrimeira: 'R$ 1.511,37',
        priceUltima: 'R$ 1.469,25'
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Celular é obrigatório';
    } else if (!/^\d{10,11}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Celular inválido';
    }
    
    if (!income) {
      newErrors.income = 'Selecione a renda familiar';
    }
    
    if (!propertyValue) {
      newErrors.propertyValue = 'Selecione o valor do imóvel';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSimulation = () => {
    if (!validateForm()) {
      return;
    }

    // Buscar dados da simulação
    const simData = simulationData[propertyValue]?.[income];
    
    if (simData) {
      setResult({
        name: name,
        propertyValue: propertyOptions.find(p => p.value === propertyValue)?.label,
        ...simData
      });
    }
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
      <Header />

      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#00537C' }}
            >
              <Calculator size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#00537C' }}>
              Simulação de Financiamento
            </h1>
            <p className="text-gray-700 text-lg">
              Calcule as parcelas do seu futuro imóvel
            </p>
          </div>

          <Card className="p-8 bg-white">
            <div className="space-y-6">
              {/* Nome */}
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium mb-2 block">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`text-lg ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Celular */}
              <div>
                <Label htmlFor="phone" className="text-gray-700 font-medium mb-2 block">
                  Celular <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={15}
                  className={`text-lg ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Renda Familiar Média */}
              <div>
                <Label htmlFor="income" className="text-gray-700 font-medium mb-2 block">
                  Renda Familiar Média <span className="text-red-500">*</span>
                </Label>
                <Select value={income} onValueChange={setIncome}>
                  <SelectTrigger className={`w-full text-lg ${errors.income ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Selecione a renda familiar" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.income && (
                  <p className="text-red-500 text-sm mt-1">{errors.income}</p>
                )}
              </div>

              {/* Valor do Imóvel */}
              <div>
                <Label htmlFor="propertyValue" className="text-gray-700 font-medium mb-2 block">
                  Valor do Imóvel <span className="text-red-500">*</span>
                </Label>
                <Select value={propertyValue} onValueChange={setPropertyValue}>
                  <SelectTrigger className={`w-full text-lg ${errors.propertyValue ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Selecione o valor do imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyValue && (
                  <p className="text-red-500 text-sm mt-1">{errors.propertyValue}</p>
                )}
              </div>

              <Button
                onClick={calculateSimulation}
                className="w-full py-6 text-white font-medium text-lg rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#00537C' }}
              >
                Calcular Simulação
              </Button>

              {result && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg space-y-4">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#00537C' }}>
                    Resultado da Simulação
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Olá <span className="font-semibold">{result.name}</span>, veja a simulação do seu financiamento:
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Entrada Sugerida (20%):</span>
                      <span className="font-bold" style={{ color: '#00537C' }}>{result.downPayment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Valor Financiado:</span>
                      <span className="font-bold" style={{ color: '#00537C' }}>{result.financed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Parcela Mensal (30 anos):</span>
                      <span className="font-bold text-2xl" style={{ color: '#00537C' }}>{result.monthly}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total a Pagar:</span>
                      <span className="font-bold" style={{ color: '#00537C' }}>{result.total}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    * Esta é uma simulação. Os valores podem variar de acordo com a análise de crédito.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SimulationPage;
