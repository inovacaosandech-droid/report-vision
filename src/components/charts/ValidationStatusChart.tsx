import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ValidationStatusChartProps {
  data: Array<{ name: string; value: number; fill: string }>;
}

export function ValidationStatusChart({ data }: ValidationStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const mismatchCount = data.find(d => d.name === 'Divergente')?.value || 0;
  const mismatchPercent = total > 0 ? ((mismatchCount / total) * 100).toFixed(1) : 0;
  
  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Status de Validação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} registros`, '']}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-1 text-center text-sm">
          <span className={Number(mismatchPercent) > 20 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
            {mismatchPercent}% de divergências
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
