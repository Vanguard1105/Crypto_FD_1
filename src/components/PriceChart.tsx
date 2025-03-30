import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format } from 'date-fns';
import { PriceData, TimePeriod, Theme } from '../types';

interface PriceChartProps {
  data: PriceData[];
  latestPrice: number;
  previousPrice: number;
  period: TimePeriod;
  theme: Theme;
  onPeriodChange: (period: TimePeriod) => void; // Add this prop
}

const CustomTooltip = ({ active, payload, label, period, theme }: any) => {  
  if (active && payload && payload.length) {  
    const formatString = {  
      'ms': 'HH:mm:ss.SSS',  
      '5m': 'HH:mm:ss',  
      '1h': 'HH:mm',  
      '1d': 'HH:mm',  
      '7d': 'MM/dd HH:mm',  
    }[period];  

    return (  
      <div className={`px-2 py-1 rounded-md text-[10px] ${
        theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
      } shadow-lg border border-slate-200/10`}>
        <p>{format(label, formatString)}</p>
        <p className="font-medium">
          ${payload[0]?.value?.toFixed(3)}
        </p>
      </div>
    );  
  }  
  return null;  
};  

const PriceChart: React.FC<PriceChartProps> = ({ data, latestPrice, previousPrice, period, theme, onPeriodChange }) => {
  const [gradientAboveId] = useState(() => `gradient-above-${Math.random().toString(36).substr(2, 9)}`);
  const [gradientBelowId] = useState(() => `gradient-below-${Math.random().toString(36).substr(2, 9)}`);
  const timeFilters = [
    { label: '5m', value: '5m' },
    { label: '1H', value: '1h' },
    { label: '1D', value: '1d' },
    { label: '7D', value: '7d' },
  ];
  const yAxisDomain = useMemo(() => {
    if (data.length === 0) return [120, 130];
    
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const range = maxPrice - minPrice;
    const padding = range * 0.1;
    
    return [minPrice - padding, maxPrice + padding];
  }, [data]);

  const formatXAxis = (timestamp: number) => {
    const formatString = {
      'ms': 'HH:mm:ss',
      '5m': 'HH:mm:ss',
      '1h': 'HH:mm',
      '1d': 'HH:mm',
      '7d': 'MM/dd',
    }[period];
    return format(timestamp, formatString);
  };

  const currentAverage = useMemo(() => {
    if (data.length === 0) return latestPrice;
    return data.reduce((sum, point) => sum + point.price, 0) / data.length;
  }, [data, latestPrice]);

  const processedData = data.map(point => ({
    ...point,
    value: point.price,
    isAboveAverage: point.price > currentAverage
  }));

  return (
    <div className={`w-full rounded-lg overflow-hidden border ${
      theme === 'dark' ? 'border-slate-700/50' : 'border-blue-300'
    }`}>      
      <div className="h-[180px] w-full">
        <div className="flex items-center justify-end mr-4 h-5">
          <div className="flex p-1">
            {timeFilters.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => onPeriodChange(value as TimePeriod)}
                className={`flex items-center justify-center mx-[2px] px-1 rounded text-[10px] w-[25px] font-medium transition-all duration-200 border border-slate-900 ${
                  period === value
                    ? 'bg-[#5856d6] text-white shadow'
                    : 'text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={processedData}
            margin={{ top: 3, right: 5, left: 5, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientAboveId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={gradientBelowId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke={theme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)'}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke={theme === 'dark' ? '#64748B' : '#475569'}
              tick={{ fill: theme === 'dark' ? '#64748B' : '#475569', fontSize: 10 }}
              axisLine={{ stroke: theme === 'dark' ? '#334155' : '#CBD5E1' }}
              tickLine={{ stroke: theme === 'dark' ? '#334155' : '#CBD5E1' }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              domain={yAxisDomain}
              orientation="right"
              stroke={theme === 'dark' ? '#64748B' : '#475569'}
              tick={{ fill: theme === 'dark' ? '#64748B' : '#475569', fontSize: 10 }}
              axisLine={{ stroke: theme === 'dark' ? '#334155' : '#CBD5E1' }}
              tickLine={{ stroke: theme === 'dark' ? '#334155' : '#CBD5E1' }}
              tickFormatter={(value) => value.toFixed(2)}
              width={45}
            />
            <Tooltip 
              content={<CustomTooltip period={period} theme={theme} />}
              cursor={{ 
                stroke: theme === 'dark' ? '#475569' : '#64748B',
                strokeWidth: 1,
                strokeDasharray: '3 3'
              }}
            />
            <ReferenceLine
              y={currentAverage}
              stroke={theme === 'dark' ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.3)"}
              strokeDasharray="2 4"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#EF4444"
              strokeWidth={1.5}
              fill={`url(#${gradientBelowId})`}
              fillOpacity={1}
              isAnimationActive={false}
              connectNulls={true}
              baseValue={currentAverage}
              name="Price"
              hide={false}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22C55E"
              strokeWidth={1.5}
              fill={`url(#${gradientAboveId})`}
              fillOpacity={1}
              isAnimationActive={false}
              connectNulls={true}
              baseValue={currentAverage}
              name="Price"
              hide={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;