import React, { useState, useEffect, useMemo } from 'react';
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
import { PriceData, Theme } from '../types';

interface PredictChartProps {
  data: PriceData[];
  title: string | null;
  latestPrice: number;
  theme: Theme;
  isDrawing: boolean;
  startTime?: number;
  endTime?: number;
  startPrice?: number;
}

const CustomTooltip = ({ active, payload, label, theme }: any) => {
  if (active && payload && payload.length && typeof label === 'number' && !isNaN(label)) {
    const date = new Date(label);
    if (isNaN(date.getTime())) return null;
    
    return (
      <div className={`px-2 py-1 rounded-md text-[10px] ${
        theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
      } shadow-lg border border-slate-200/10`}>
        <p>{format(date, 'HH:mm:ss')}</p>
        <p className="font-medium">
          ${payload[0]?.value?.toFixed(3)}
        </p>
      </div>
    );
  }
  return null;
};

const PredictChart: React.FC<PredictChartProps> = ({
  data,
  title,
  latestPrice: initialLatestPrice,
  theme,
  isDrawing,
  startTime,
  endTime,
  startPrice,
}) => {
  const [smoothData, setSmoothData] = useState<PriceData[]>(data);
  const [gradientAboveId] = useState(() => `gradient-above-${Math.random().toString(36).substr(2, 9)}`);
  const [gradientBelowId] = useState(() => `gradient-below-${Math.random().toString(36).substr(2, 9)}`);
  const [displayPrice, setDisplayPrice] = useState(initialLatestPrice);

  // Update data points and display price more frequently for smoother animation
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const now = Date.now();
      const variation = (Math.random() - 0.5) * 0.01;
      const newPrice = initialLatestPrice + variation;
      
      setDisplayPrice(newPrice);
      setSmoothData(prev => {
        const newPoint = {
          timestamp: now,
          price: newPrice,
        };

        const windowSize = isDrawing ? 20000 : (endTime! - startTime!);
        const windowStart = isDrawing ? now - windowSize : startTime!;
        
        const filteredData = [...prev.filter(p => p.timestamp >= windowStart), newPoint];
        return filteredData;
      });
    }, 400);

    return () => clearInterval(updateInterval);
  }, [initialLatestPrice, isDrawing, startTime, endTime]);

  const yAxisDomain = useMemo(() => {
    if (smoothData.length === 0) return [displayPrice - 1, displayPrice + 1];
    
    const prices = smoothData.map(d => d.price);
    const minPrice = Math.min(...prices, startPrice || Infinity);
    const maxPrice = Math.max(...prices, startPrice || -Infinity);
    
    const range = maxPrice - minPrice;
    const padding = range * 0.1;
    
    return [minPrice - padding, maxPrice + padding];
  }, [smoothData, startPrice, displayPrice]);

  const isAboveStartPrice = displayPrice > (startPrice || 0);
  const priceDifference = startPrice ? (displayPrice - startPrice).toFixed(3) : '0.000';
  const priceChangePercent = startPrice ? ((displayPrice - startPrice) / startPrice * 100).toFixed(2) : '0.00';

  const formatTimestamp = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    return format(date, 'HH:mm:ss.SSS');
  };

  // Custom dot renderer for the end point
  const CustomDot = (props: any) => {
    const { cx, cy, payload, index } = props;
    const isLast = index === smoothData.length - 1;
    
    if (!isLast) return null;
    
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill={isAboveStartPrice ? '#22C55E' : '#EF4444'}
          stroke={theme === 'dark' ? '#1F2937' : '#FFFFFF'}
          strokeWidth={2}
        />
        <circle
          cx={cx}
          cy={cy}
          r={12}
          fill="none"
          stroke={isAboveStartPrice ? '#22C55E' : '#EF4444'}
          strokeWidth={1}
          opacity={0.3}
        />
      </g>
    );
  };

  return (
    <div className={`w-full rounded-lg overflow-hidden border ${
      theme === 'dark' ? 'border-slate-700/50' : 'border-blue-300'
    }`}>
      <div className="h-[160px] w-full">
        <div className="flex items-center justify-between ml-2 mr-[44px] h-5">
          <div className='flex flex-row gap-2 items-center'>
            <div>
              <span className='text-md text-[#007aff] font-semibold'>{title}</span>
              <span className={`text-md font-semibold ${
                theme === 'dark' ? 'border-slate-700/50' : 'text-slate-900'
              }`}> / </span>
              <span className='text-md text-[#811f1a] font-semibold'>USD</span>
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-md font-bold ${isAboveStartPrice ? 'text-green-500' : 'text-red-500'}`}>
                ${displayPrice.toFixed(3)}
              </p>
              {startPrice && (
                <span className={`text-sm ${isAboveStartPrice ? 'text-green-500' : 'text-red-500'}`}>
                  ({priceDifference} | {priceChangePercent}%)
                </span>
              )}
            </div>
          </div>
        </div>
        <div className='h-[150px] w-full'>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={smoothData}
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
                tickFormatter={formatTimestamp}
                stroke={theme === 'dark' ? '#64748B' : '#475569'}
                tick={{ fill: theme === 'dark' ? '#64748B' : '#475569', fontSize: 10 }}
                minTickGap={30}
                domain={['dataMin', 'dataMax']}
              />
              <YAxis
                domain={yAxisDomain}
                orientation="right"
                stroke={theme === 'dark' ? '#64748B' : '#475569'}
                tick={{ fill: theme === 'dark' ? '#64748B' : '#475569', fontSize: 10 }}
                width={45}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip
                content={<CustomTooltip theme={theme} />}
                cursor={{
                  stroke: theme === 'dark' ? '#475569' : '#64748B',
                  strokeWidth: 1,
                  strokeDasharray: '3 3'
                }}
              />
              {startTime && (
                <ReferenceLine
                  x={startTime}
                  stroke="#5856d6"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{
                    value: 'Start',
                    position: 'top',
                    fill: theme === 'dark' ? '#fff' : '#000'
                  }}
                />
              )}
              {endTime && (
                <ReferenceLine
                  x={endTime}
                  stroke="#5856d6"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{
                    value: 'End',
                    position: 'top',
                    fill: theme === 'dark' ? '#fff' : '#000'
                  }}
                />
              )}
              {startPrice && (
                <ReferenceLine
                  y={startPrice}
                  stroke={isAboveStartPrice ? '#22C55E' : '#EF4444'}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  label={{
                    value: `$${startPrice.toFixed(3)}`,
                    position: 'left',
                    fill: theme === 'dark' ? '#fff' : '#000'
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="price"
                stroke={isAboveStartPrice ? '#22C55E' : '#EF4444'}
                strokeWidth={1.5}
                fill={isAboveStartPrice ? `url(#${gradientAboveId})` : `url(#${gradientBelowId})`}
                fillOpacity={1}
                isAnimationActive={false}
                connectNulls={true}
                dot={<CustomDot />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PredictChart;