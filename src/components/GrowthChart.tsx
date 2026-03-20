import { WHO_STANDARDS, getAgeInMonths, PercentileData } from '@/lib/whoStandards';

const PERCENTILE_LINES: (keyof PercentileData)[] = ['p3', 'p15', 'p50', 'p85', 'p97'];
const PERCENTILE_LABELS: Record<string, string> = { p3: '3%', p15: '15%', p50: '50%', p85: '85%', p97: '97%' };

interface Measurement {
  measured_at: string;
  weight: string;
  height: string;
}

interface GrowthChartProps {
  history?: Measurement[];
  gender?: 'boy' | 'girl';
  chartType?: 'weight' | 'height';
  birthdate: string;
  color?: string;
}

export default function GrowthChart({ history = [], gender = 'girl', chartType = 'weight', birthdate, color = '#F43F5E' }: GrowthChartProps) {
  const standards = WHO_STANDARDS[gender][chartType];
  
  const allVals = history
    .map(h => chartType === 'weight' ? parseFloat(h.weight) : parseFloat(h.height))
    .filter(v => !isNaN(v));

  const maxHistoryAge = history.length > 0 ? Math.max(...history.map(m => getAgeInMonths(birthdate, m.measured_at))) : 0;
  const maxAge = Math.max(12, Math.min(60, maxHistoryAge + 4));
  const filteredStandards = standards.filter(s => s.age <= maxAge);
  const allStdVals = filteredStandards.flatMap(s => [s.p3 as number, s.p97 as number]);

  const minV = Math.min(...allVals, ...allStdVals) * 0.9;
  const maxV = Math.max(...allVals, ...allStdVals) * 1.1;
  const rangeY = maxV - minV || 1;

  const W = 400, H = 240;
  const PAD_LEFT = 40, PAD_RIGHT = 10, PAD_TOP = 10, PAD_BOTTOM = 30;
  const CHART_W = W - PAD_LEFT - PAD_RIGHT;
  const CHART_H = H - PAD_TOP - PAD_BOTTOM;

  const getX = (age: number) => PAD_LEFT + (age / maxAge) * CHART_W;
  const getY = (val: number) => PAD_TOP + CHART_H - ((val - minV) / rangeY) * CHART_H;

  const points = history.map(m => {
    const age = getAgeInMonths(birthdate, m.measured_at);
    const v = chartType === 'weight' ? parseFloat(m.weight) : parseFloat(m.height);
    if (isNaN(v)) return null;
    return { x: getX(age), y: getY(v), val: v, age };
  }).filter(Boolean) as { x: number; y: number; val: number; age: number }[];

  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount }, (_, i) => {
    const val = minV + (rangeY / (yTickCount - 1)) * i;
    return { val, y: getY(val) };
  });

  const xTickStep = maxAge <= 12 ? 3 : maxAge <= 24 ? 6 : 12;
  const xTicks: { age: number; x: number }[] = [];
  for (let a = 0; a <= maxAge; a += xTickStep) xTicks.push({ age: a, x: getX(a) });

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`growthGrad_${chartType}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {yTicks.map((t, i) => (
          <g key={`yt_${i}`}>
            <line x1={PAD_LEFT} y1={t.y} x2={W - PAD_RIGHT} y2={t.y} stroke="#E5E5EA" strokeWidth="0.5" />
            <text x={PAD_LEFT - 6} y={t.y + 3} textAnchor="end" fontSize="8" fill="#86868B" fontWeight="600">
              {Math.round(t.val * 10) / 10}
            </text>
          </g>
        ))}
        {xTicks.map((t, i) => (
          <g key={`xt_${i}`}>
            <line x1={t.x} y1={PAD_TOP} x2={t.x} y2={H - PAD_BOTTOM} stroke="#E5E5EA" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x={t.x} y={H - PAD_BOTTOM + 14} textAnchor="middle" fontSize="8" fill="#86868B" fontWeight="600">
              {t.age} мес
            </text>
          </g>
        ))}

        {/* WHO zones */}
        <path
          d={[
            `M ${filteredStandards.map(s => `${getX(s.age)},${getY(s.p97 as number)}`).join(' L ')}`,
            `L ${[...filteredStandards].reverse().map(s => `${getX(s.age)},${getY(s.p3 as number)}`).join(' L ')}`,
            'Z'
          ].join(' ')}
          fill="#34C759" opacity="0.06"
        />
        <path
          d={[
            `M ${filteredStandards.map(s => `${getX(s.age)},${getY(s.p85 as number)}`).join(' L ')}`,
            `L ${[...filteredStandards].reverse().map(s => `${getX(s.age)},${getY(s.p15 as number)}`).join(' L ')}`,
            'Z'
          ].join(' ')}
          fill="#34C759" opacity="0.08"
        />

        {/* Percentile lines */}
        {PERCENTILE_LINES.map(p => (
          <polyline
            key={p}
            fill="none"
            stroke="#34C759"
            strokeWidth={p === 'p50' ? '1.5' : '0.8'}
            strokeDasharray={p === 'p50' ? undefined : '4,4'}
            opacity={p === 'p50' ? 0.6 : 0.3}
            points={filteredStandards.map(s => `${getX(s.age)},${getY(s[p] as number)}`).join(' ')}
          />
        ))}

        {/* Percentile labels */}
        {PERCENTILE_LINES.map(p => {
          const lastStd = filteredStandards[filteredStandards.length - 1];
          return (
            <text key={`label_${p}`} x={getX(lastStd.age) + 3} y={getY(lastStd[p] as number)} fontSize="7" fill="#34C759" fontWeight="700" opacity="0.6">
              {PERCENTILE_LABELS[p]}
            </text>
          );
        })}

        {/* Data area */}
        {points.length > 1 && (
          <path
            d={`M ${points[0].x} ${H - PAD_BOTTOM} L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L ${points[points.length - 1].x} ${H - PAD_BOTTOM} Z`}
            fill={`url(#growthGrad_${chartType})`}
          />
        )}

        {/* Data line */}
        {points.length > 1 && (
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            className="drop-shadow-sm"
          />
        )}

        {/* Data points */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="6" fill="white" stroke={color} strokeWidth="1.5" />
            <circle cx={p.x} cy={p.y} r="3" fill={color} />
          </g>
        ))}

        {/* Axes labels */}
        <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="9" fill="#86868B" fontWeight="700">
          Возраст (мес.)
        </text>
        <text x={8} y={H / 2} textAnchor="middle" fontSize="9" fill="#86868B" fontWeight="700" transform={`rotate(-90, 8, ${H / 2})`}>
          {chartType === 'weight' ? 'Вес (кг)' : 'Рост (см)'}
        </text>
      </svg>
    </div>
  );
}
