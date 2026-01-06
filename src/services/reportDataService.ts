import { ReportData, ReportRecord } from '@/types/reportData';

// Generate realistic mock data based on the Excel structure
const USERNAMES = [
  'igor.batista',
  'jonathan.barbosa',
  'maria.silva',
  'pedro.santos',
  'ana.oliveira',
  'carlos.ferreira',
  'julia.costa',
  'lucas.almeida',
];

const MACHINES = [
  'SANDECH-320-NT',
  'SANDECH-255-NT',
  'SANDECH-180-NT',
  'WORKSTATION-01',
  'WORKSTATION-02',
  'NOTEBOOK-DEV',
  'NOTEBOOK-ADM',
];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateMockRecords(count: number, startDate: Date, endDate: Date): ReportRecord[] {
  const records: ReportRecord[] = [];
  
  for (let i = 0; i < count; i++) {
    const username = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
    const workMode = Math.random() > 0.4 ? 'presencial' : 'home';
    const networkClassification = workMode === 'home' 
      ? (Math.random() > 0.3 ? 'external' : 'vpn')
      : (Math.random() > 0.5 ? 'internal' : 'external');
    const validationStatus = 
      (workMode === 'presencial' && networkClassification === 'external') ||
      (workMode === 'home' && networkClassification === 'internal')
        ? 'mismatch' 
        : 'ok';
    
    records.push({
      username,
      workMode,
      networkClassification,
      validationStatus,
      sourceIP: `::ffff:192.168.0.${Math.floor(Math.random() * 255)}`,
      machineName: MACHINES[Math.floor(Math.random() * MACHINES.length)],
      createdAt: randomDate(startDate, endDate).toISOString(),
    });
  }
  
  // Sort by date
  return records.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

function generateSummary(records: ReportRecord[]) {
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

export function getReportData(fileName: string): ReportData {
  // Determine date range based on filename
  const isPeriodic = fileName.includes('21_');
  const now = new Date();
  
  let startDate: Date;
  let endDate: Date;
  let recordCount: number;
  
  if (isPeriodic) {
    // Periodic report: 21st of previous month to 20th of current month
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 21);
    endDate = new Date(now.getFullYear(), now.getMonth(), 20);
    recordCount = Math.floor(Math.random() * 100) + 80; // 80-180 records
  } else {
    // Monthly report: full month
    const monthMatch = fileName.match(/(\w+)_(\d{4})/);
    if (monthMatch) {
      const year = parseInt(monthMatch[2]);
      startDate = new Date(year, now.getMonth() - 1, 1);
      endDate = new Date(year, now.getMonth(), 0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    }
    recordCount = Math.floor(Math.random() * 50) + 30; // 30-80 records
  }
  
  const records = generateMockRecords(recordCount, startDate, endDate);
  const summary = generateSummary(records);
  
  return {
    records,
    summary,
    totalRecords: records.length,
  };
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
