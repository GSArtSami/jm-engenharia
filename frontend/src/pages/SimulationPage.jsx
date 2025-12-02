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
    },
    '350000': {
      '1500': {
        rendaInsuficiente: true
      },
      '2160': {
        juros: '8,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 287.842,70',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 62.157,30',
        sacPrimeira: 'R$ 647,99',
        sacUltima: 'R$ 174,01',
        pricePrimeira: 'R$ 526,05',
        priceUltima: 'R$ 473,72'
      },
      '2850': {
        juros: '8,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 265.495,61',
        subsidio: 'R$ 2.028,00',
        liberado: 'R$ 84.504,39',
        sacPrimeira: 'R$ 855,00',
        sacUltima: 'R$ 222,58',
        pricePrimeira: 'R$ 689,22',
        priceUltima: 'R$ 635,05'
      },
      '3500': {
        juros: '8,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 244.444,00',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 105.556,00',
        sacPrimeira: 'R$ 1.049,99',
        sacUltima: 'R$ 278,03',
        pricePrimeira: 'R$ 842,91',
        priceUltima: 'R$ 787,02'
      },
      '4000': {
        juros: '8,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 228.250,45',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 121.749,55',
        sacPrimeira: 'R$ 1.200,00',
        sacUltima: 'R$ 316,85',
        pricePrimeira: 'R$ 961,14',
        priceUltima: 'R$ 903,92'
      },
      '4700': {
        juros: '8,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 205.579,49',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 144.420,51',
        sacPrimeira: 'R$ 1.410,00',
        sacUltima: 'R$ 371,20',
        pricePrimeira: 'R$ 1.126,67',
        priceUltima: 'R$ 1.067,59'
      },
      '5500': {
        juros: '8,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 179.669,82',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 170.330,18',
        sacPrimeira: 'R$ 1.649,99',
        sacUltima: 'R$ 433,31',
        pricePrimeira: 'R$ 1.315,83',
        priceUltima: 'R$ 1.254,63'
      },
      '8600': {
        juros: '8,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 79.269,84',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 270.730,16',
        sacPrimeira: 'R$ 2.580,00',
        sacUltima: 'R$ 673,98',
        pricePrimeira: 'R$ 2.048,87',
        priceUltima: 'R$ 1.979,43'
      },
      '12000': {
        juros: '10,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 70.000,00',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 280.000,00',
        sacPrimeira: 'R$ 3.095,19',
        sacUltima: 'R$ 697,22',
        pricePrimeira: 'R$ 2.502,28',
        priceUltima: 'R$ 2.432,08'
      }
    },
    '500000': {
      '1500': {
        rendaInsuficiente: true
      },
      '2160': {
        rendaInsuficiente: true
      },
      '2850': {
        rendaInsuficiente: true
      },
      '3500': {
        juros: '10,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 389.670,37',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 110.329,93',
        sacInsuficiente: true,
        pricePrimeira: 'R$ 1.050,00',
        priceUltima: 'R$ 973,47'
      },
      '4000': {
        juros: '10,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 397.416,52',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 102.583,48',
        sacPrimeira: 'R$ 1.200,00',
        sacUltima: 'R$ 271,28',
        pricePrimeira: 'R$ 982,77',
        priceUltima: 'R$ 906,88'
      },
      '4700': {
        juros: '10,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 348.189,60',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 151.810,40',
        sacPrimeira: 'R$ 1.410,00',
        sacUltima: 'R$ 317,98',
        pricePrimeira: 'R$ 1.151,59',
        priceUltima: 'R$ 1.074,10'
      },
      '5500': {
        juros: '10,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 320.535,75',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 179.464,25',
        sacPrimeira: 'R$ 1.650,00',
        sacUltima: 'R$ 371,35',
        pricePrimeira: 'R$ 1.650,00',
        priceUltima: 'R$ 1.567,80'
      },
      '8600': {
        juros: '10,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 269.594,72',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 230.405,28',
        sacPrimeira: 'R$ 2.580,00',
        sacUltima: 'R$ 578,15',
        pricePrimeira: 'R$ 2.580,00',
        priceUltima: 'R$ 2.489,02'
      },
      '12000': {
        juros: '10,47% a.a',
        cotaMaxima: '80%',
        entrada: 'R$ 100.000,00',
        subsidio: 'R$ 0,00',
        liberado: 'R$ 400.000,00',
        sacPrimeira: 'R$ 3.600,00',
        sacUltima: 'R$ 804,98',
        pricePrimeira: 'R$ 3.563,97',
        priceUltima: 'R$ 3.463,69'
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
        incomeLabel: incomeOptions.find(i => i.value === income)?.label,
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
                <div className="mt-8 p-6 bg-gray-50 rounded-lg space-y-6">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#00537C' }}>
                    Resultado da Simulação
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Olá <span className="font-semibold">{result.name}</span>, veja a simulação do seu financiamento para imóvel de <span className="font-semibold">{result.propertyValue}</span>:
                  </p>
                  
                  {result.rendaInsuficiente ? (
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
                      <div className="text-6xl mb-4">⚠️</div>
                      <h4 className="text-2xl font-bold text-red-600 mb-3">
                        Renda Insuficiente
                      </h4>
                      <p className="text-gray-700 text-lg mb-4">
                        Infelizmente, a renda de <span className="font-semibold">{result.incomeLabel}</span> não é suficiente para financiar um imóvel de <span className="font-semibold">{result.propertyValue}</span>.
                      </p>
                      <p className="text-gray-600">
                        Sugerimos que você:
                      </p>
                      <ul className="text-left mt-3 space-y-2 text-gray-700 max-w-md mx-auto">
                        <li>• Escolha um imóvel de menor valor</li>
                        <li>• Aumente o valor da entrada</li>
                        <li>• Considere adicionar um co-devedor ao financiamento</li>
                      </ul>
                    </div>
                  ) : (
                    <>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-bold text-lg mb-3" style={{ color: '#00537C' }}>
                        Informações Gerais
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Taxa de Juros:</span>
                          <span className="font-bold">{result.juros}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Cota Máxima:</span>
                          <span className="font-bold">{result.cotaMaxima}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Prazo:</span>
                          <span className="font-bold">420 meses</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Valor de Entrada:</span>
                          <span className="font-bold text-lg" style={{ color: '#00537C' }}>{result.entrada}</span>
                        </div>
                        {result.subsidio !== 'R$ 0,00' && (
                          <div className="flex justify-between bg-green-50 p-2 rounded">
                            <span className="text-gray-700">Subsídio MCMV:</span>
                            <span className="font-bold text-green-600">{result.subsidio}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-700">Valor Liberado:</span>
                          <span className="font-bold text-xl" style={{ color: '#00537C' }}>{result.liberado}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-lg mb-3" style={{ color: '#00537C' }}>
                        Parcelas
                      </h4>
                      
                      {result.sacInsuficiente ? (
                        <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-400">
                          <p className="font-bold mb-2 text-yellow-700">Sistema SAC/TR</p>
                          <p className="text-sm text-gray-700">
                            Renda insuficiente para esse tipo de parcela
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-lg border-2" style={{ borderColor: '#00537C' }}>
                          <p className="font-bold mb-2" style={{ color: '#00537C' }}>Sistema SAC/TR</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-700">1ª Parcela:</span>
                              <span className="font-bold">{result.sacPrimeira}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Última Parcela:</span>
                              <span className="font-bold">{result.sacUltima}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                        <p className="font-bold mb-2 text-gray-700">Sistema PRICE/TR</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">1ª Parcela:</span>
                            <span className="font-bold">{result.pricePrimeira}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Última Parcela:</span>
                            <span className="font-bold">{result.priceUltima}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-600">
                      * Esta é uma simulação. Os valores podem variar de acordo com a análise de crédito e condições do financiamento.
                    </p>
                    <p className="text-sm text-gray-600">
                      * SAC (Sistema de Amortização Constante): parcelas decrescentes ao longo do tempo.
                    </p>
                    <p className="text-sm text-gray-600">
                      * PRICE: parcelas fixas durante todo o período.
                    </p>
                  </div>
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
