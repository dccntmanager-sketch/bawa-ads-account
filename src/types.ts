export type PlatformType = 'meta' | 'google' | 'tiktok' | 'linkedin' | 'local_maps';

export type CampaignStatus = 'active' | 'paused' | 'learning' | 'budget_limited';

export type CampaignObjective = 
  | 'leads' 
  | 'sales' 
  | 'phone_calls' 
  | 'store_visits' 
  | 'brand_awareness'
  | 'retargeting';

export interface AdCreative {
  id: string;
  headline: string;
  primaryText: string;
  description: string;
  callToAction: string;
  displayUrl: string;
  destinationUrl: string;
  imageUrl?: string;
  format: 'image' | 'video' | 'search_text' | 'carousel';
}

export interface TargetingConfig {
  location: string;
  radiusMiles: number;
  ageMin: number;
  ageMax: number;
  interests: string[];
  keywords: string[];
  negativeKeywords: string[];
}

export interface CampaignMetrics {
  spend: number;
  revenue: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number; // percentage e.g. 3.4
  cpc: number;
  conversions: number;
  cpa: number; // cost per acquisition
  frequency: number;
}

export interface Campaign {
  id: string;
  name: string;
  platform: PlatformType;
  status: CampaignStatus;
  objective: CampaignObjective;
  dailyBudget: number;
  totalBudget?: number;
  startDate: string;
  endDate?: string;
  metrics: CampaignMetrics;
  targeting: TargetingConfig;
  creative: AdCreative;
  lastUpdated: string;
  aiOptimizationScore?: number; // 0-100
}

export interface AIRecommendation {
  id: string;
  type: 'budget' | 'keywords' | 'creative' | 'targeting';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedImpact: string;
  targetCampaignId?: string;
  actionType: 'INCREASE_BUDGET' | 'ADD_NEGATIVE_KEYWORDS' | 'REFRESH_CREATIVE' | 'PAUSE_UNDERPERFORMER';
  suggestedValue?: number;
  applied?: boolean;
}

export interface BusinessProfile {
  id: string;
  name: string;
  industry: string;
  website: string;
  location: string;
  currency: string;
  monthlyTargetBudget: number;
  targetRoas: number;
}

export interface DailyChartPoint {
  date: string;
  spend: number;
  revenue: number;
  conversions: number;
  roas: number;
  profit?: number;
  clicks?: number;
  impressions?: number;
  cpa?: number;
}

export interface PlatformStat {
  platform: PlatformType;
  name: string;
  spend: number;
  revenue: number;
  roas: number;
  conversions: number;
  sharePercent: number;
}
