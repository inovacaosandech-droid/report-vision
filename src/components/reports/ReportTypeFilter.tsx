import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type FilterType = 'all' | 'monthly' | 'periodic';

interface ReportTypeFilterProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
  counts: {
    all: number;
    monthly: number;
    periodic: number;
  };
}

export function ReportTypeFilter({ value, onChange, counts }: ReportTypeFilterProps) {
  return (
    <Tabs 
      value={value} 
      onValueChange={(v) => onChange(v as FilterType)}
      className="w-full sm:w-auto"
    >
      <TabsList className="grid w-full grid-cols-3 sm:w-auto">
        <TabsTrigger value="all" className="gap-1.5">
          Todos
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">
            {counts.all}
          </span>
        </TabsTrigger>
        <TabsTrigger value="monthly" className="gap-1.5">
          Mensais
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">
            {counts.monthly}
          </span>
        </TabsTrigger>
        <TabsTrigger value="periodic" className="gap-1.5">
          Periódicos
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">
            {counts.periodic}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
