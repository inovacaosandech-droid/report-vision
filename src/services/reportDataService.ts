import { ReportData, ReportRecord } from '@/types/reportData';

// Helper function to generate summary from records
export function generateSummary(records: ReportRecord[]) {
  const userMap = new Map<string, { home: number; presencial: number }>();
  
  records.forEach(record => {
    const current = userMap.get(record.username) || { home: 0, presencial: 0 };
    if (record.workMode === 'home') {
      current.home++;
    } else {
      current.presencial++;
    }
    userMap.set(record.username, current);
  });
  
  return Array.from(userMap.entries()).map(([username, counts]) => ({
    username,
    homeCount: counts.home,
    presencialCount: counts.presencial,
    total: counts.home + counts.presencial,
  })).sort((a, b) => b.total - a.total);
}

// Transform data for charts
export function getWorkModeDistribution(data: ReportData) {
  const home = data.records.filter(r => r.workMode === 'home').length;
  const presencial = data.records.filter(r => r.workMode === 'presencial').length;
  
  return [
    { name: 'Home Office', value: home, fill: 'hsl(var(--primary))' },
    { name: 'Presencial', value: presencial, fill: 'hsl(var(--highlight))' },
  ];
}

export function getDailyAccessTrend(data: ReportData) {
  const dailyMap = new Map<string, { home: number; presencial: number }>();
  
  data.records.forEach(record => {
    const date = new Date(record.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
    const current = dailyMap.get(date) || { home: 0, presencial: 0 };
    if (record.workMode === 'home') {
      current.home++;
    } else {
      current.presencial++;
    }
    dailyMap.set(date, current);
  });
  
  return Array.from(dailyMap.entries())
    .map(([date, counts]) => ({
      date,
      acessos: counts.home + counts.presencial,
      home: counts.home,
      presencial: counts.presencial,
    }))
    .slice(-14); // Last 14 days
}

export function getUserAccessRanking(data: ReportData) {
  return data.summary.slice(0, 8).map(s => ({
    username: s.username.split('.')[0], // First name only for display
    total: s.total,
    home: s.homeCount,
    presencial: s.presencialCount,
  }));
}

export function getValidationStatusDistribution(data: ReportData) {
  const ok = data.records.filter(r => r.validationStatus === 'ok').length;
  const mismatch = data.records.filter(r => r.validationStatus === 'mismatch').length;
  
  return [
    { name: 'Válido', value: ok, fill: 'hsl(142 76% 36%)' },
    { name: 'Divergente', value: mismatch, fill: 'hsl(var(--destructive))' },
  ];
}

export function getNetworkClassificationDistribution(data: ReportData) {
  const internal = data.records.filter(r => r.networkClassification === 'internal').length;
  const external = data.records.filter(r => r.networkClassification === 'external').length;
  const vpn = data.records.filter(r => r.networkClassification === 'vpn').length;
  
  return [
    { name: 'Interna', value: internal, fill: 'hsl(var(--primary))' },
    { name: 'Externa', value: external, fill: 'hsl(var(--highlight))' },
    { name: 'VPN', value: vpn, fill: 'hsl(221 83% 53%)' },
  ];
}
