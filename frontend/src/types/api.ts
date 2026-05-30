export interface Customer {
  id: string;
  email: string;
  name: string;
  subscriptionStatus: string;
  currentPlanName: string;
  currentMrr: number;
  healthScore: number;
  healthStatus: 'healthy' | 'warning' | 'critical';
  healthTrend: 'improving' | 'stable' | 'declining';
  riskFactors: RiskFactor[];
  lastPaymentDate?: string;
  daysSinceLastPayment?: number;
  failedPayments: number;
  totalRevenue: number;
  tags: string[];
  createdAt: string;
}

export interface RiskFactor {
  factor: string;
  impact: number;
  detail: string;
  detectedAt: string;
}

export interface Alert {
  id: string;
  alertType: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  customerId: string;
  customerName: string;
  customerEmail: string;
  healthScoreAtAlert: number;
  mrrAtRisk: number;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  campaignType: string;
  status: 'draft' | 'scheduled' | 'sending' | 'active' | 'paused' | 'completed' | 'failed';
  emailSubject: string;
  totalTargeted: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalSaved: number;
  revenueSaved: number;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  templateType: string;
  subject: string;
  bodyHtml: string;
  previewText?: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface DashboardSummary {
  totalCustomers: number;
  activeCustomers: number;
  totalMrr: number;
  avgMrr: number;
  healthDistribution: {
    healthy: { count: number; mrr: number; percentage: number };
    warning: { count: number; mrr: number; percentage: number };
    critical: { count: number; mrr: number; percentage: number };
  };
  churnRate: {
    current30d: number;
    previous30d: number;
    trend: string;
  };
  atRiskSummary: {
    customersAtRisk: number;
    revenueAtRisk: number;
    criticalCount: number;
    warningCount: number;
  };
  recentChanges: {
    newCustomers30d: number;
    churned30d: number;
    upgraded30d: number;
    downgraded30d: number;
  };
}
