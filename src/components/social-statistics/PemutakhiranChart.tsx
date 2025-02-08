import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PemutakhiranChartProps } from "./types";

export function PemutakhiranChart({ data, surveyType }: PemutakhiranChartProps) {
  // Count updates by status
  const completedCount = data.filter(item => item.status === 'sudah').length;
  const inProgressCount = data.filter(item => item.status === 'belum').length;
  const notStartedCount = data.filter(item => !item.status).length;
  const total = completedCount + inProgressCount + notStartedCount;

  const chartData = [
    { 
      name: 'Sudah Selesai', 
      value: completedCount,
      percentage: ((completedCount / total) * 100).toFixed(2)
    },
    { 
      name: 'Belum Selesai', 
      value: inProgressCount,
      percentage: ((inProgressCount / total) * 100).toFixed(2)
    },
    { 
      name: 'Belum Input', 
      value: notStartedCount,
      percentage: ((notStartedCount / total) * 100).toFixed(2)
    }
  ];

  const COLORS = ['#4ade80', '#fbbf24', '#94a3b8'];
  const HOVER_COLOR = '#e5e7eb';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].payload.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-[80%] aspect-square max-w-md mx-auto mb-4">
      <h3 className="text-xl font-semibold text-secondary mx-3 text-center">Pemutakhiran</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            dataKey="value"
            className={`${surveyType}-pemutakhiran-chart`}
            onMouseEnter={(data, index) => {
              const paths = document.querySelectorAll(`.${surveyType}-pemutakhiran-chart path.recharts-sector`);
              paths.forEach((path, i) => {
                if (i !== index) {
                  (path as SVGPathElement).style.fill = HOVER_COLOR;
                }
              });
            }}
            onMouseLeave={() => {
              const paths = document.querySelectorAll(`.${surveyType}-pemutakhiran-chart path.recharts-sector`);
              paths.forEach((path, i) => {
                (path as SVGPathElement).style.fill = COLORS[i];
              });
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => {
              const { payload } = entry as any;
              return `${value} ${payload.value}`;
            }}
            wrapperStyle={{
              fontSize: window.innerWidth < 768 ? '11px' : '14px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}