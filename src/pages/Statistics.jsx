import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Statistics = () => {
  const [period, setPeriod] = useState('today');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Mock data for the chart with exchange information
  const data = [
    { name: 'Jan', profit: 4000, loss: 2400, exchange: 'Binance' },
    { name: 'Feb', profit: 3000, loss: 1398, exchange: 'Binance' },
    { name: 'Mar', profit: 2000, loss: 9800, exchange: 'Binance' },
    { name: 'Apr', profit: 2780, loss: 3908, exchange: 'Coinbase' },
    { name: 'May', profit: 1890, loss: 4800, exchange: 'Coinbase' },
    { name: 'Jun', profit: 2390, loss: 3800, exchange: 'Coinbase' },
  ];

  const calculateStats = (data) => {
    const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
    const totalLoss = data.reduce((sum, item) => sum + item.loss, 0);
    const netProfit = totalProfit - totalLoss;
    const profitPercentage = ((netProfit / totalLoss) * 100).toFixed(2);
    return { totalProfit, totalLoss, netProfit, profitPercentage };
  };

  const overallStats = calculateStats(data);
  const exchanges = [...new Set(data.map(item => item.exchange))];

  const StatCard = ({ title, stats }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Total Profit</p>
            <p className="text-lg font-bold text-green-500">${stats.totalProfit}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Loss</p>
            <p className="text-lg font-bold text-red-500">${stats.totalLoss}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Net Profit</p>
            <p className={`text-lg font-bold ${stats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${stats.netProfit} ({stats.profitPercentage}%)
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.filter(item => title === 'Overall Statistics' || item.exchange === title)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="profit" stroke="#8884d8" />
            <Line type="monotone" dataKey="loss" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Statistics</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Period Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {period === 'custom' && (
              <>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <StatCard title="Overall Statistics" stats={overallStats} />

      {exchanges.map(exchange => (
        <StatCard 
          key={exchange} 
          title={exchange} 
          stats={calculateStats(data.filter(item => item.exchange === exchange))} 
        />
      ))}
    </div>
  );
};

export default Statistics;
