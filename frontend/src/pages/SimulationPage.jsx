import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Calculator } from 'lucide-react';

const SimulationPage = () => {
  const [propertyValue, setPropertyValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [months, setMonths] = useState('360');
  const [result, setResult] = useState(null);

  const calculateSimulation = () => {
    const value = parseFloat(propertyValue);
    const down = parseFloat(downPayment);
    const period = parseInt(months);

    if (value && down >= 0 && period) {
      const financed = value - down;
      const interestRate = 0.009; // 0.9% ao mês
      const monthlyPayment = financed * (interestRate * Math.pow(1 + interestRate, period)) / (Math.pow(1 + interestRate, period) - 1);
      
      setResult({
        financed: financed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        monthly: monthlyPayment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        total: (monthlyPayment * period).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f8f8' }}>
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
              <div>
                <Label htmlFor="propertyValue" className="text-gray-700 font-medium mb-2 block">
                  Valor do Imóvel
                </Label>
                <Input
                  id="propertyValue"
                  type="number"
                  placeholder="R$ 300.000"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="downPayment" className="text-gray-700 font-medium mb-2 block">
                  Entrada (R$)
                </Label>
                <Input
                  id="downPayment"
                  type="number"
                  placeholder="R$ 60.000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="months" className="text-gray-700 font-medium mb-2 block">
                  Prazo (meses)
                </Label>
                <Input
                  id="months"
                  type="number"
                  placeholder="360"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className="text-lg"
                />
              </div>

              <Button
                onClick={calculateSimulation}
                className="w-full py-6 text-white font-medium text-lg rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#00537C' }}
              >
                Calcular
              </Button>

              {result && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg space-y-4">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#00537C' }}>
                    Resultado da Simulação
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Valor Financiado:</span>
                      <span className="font-bold" style={{ color: '#00537C' }}>{result.financed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Parcela Mensal:</span>
                      <span className="font-bold text-2xl" style={{ color: '#00537C' }}>{result.monthly}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total a Pagar:</span>
                      <span className="font-bold" style={{ color: '#00537C' }}>{result.total}</span>
                    </div>
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
