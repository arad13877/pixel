export type Role = 'admin' | 'member';
export type LeadStatus = 'new' | 'qualified' | 'rejected' | 'archived';
export type ServiceType = 'web_design' | 'ai_agent' | 'other';
export type ActivityType = 'call' | 'meeting' | 'follow_up' | 'note';
export type ActivityStatus = 'planned' | 'completed' | 'cancelled';

export interface Membership {
  workspace_id: string;
  user_id: string;
  role: Role;
  is_active: boolean;
  profile?: { full_name: string | null; email: string | null } | null;
}

export interface LeadSubmission {
  id: string;
  workspace_id: string;
  name: string;
  phone: string;
  email: string | null;
  business_name: string | null;
  service_type: ServiceType;
  budget_range: string | null;
  brief: string;
  status: LeadStatus;
  assigned_to: string | null;
  created_at: string;
  archived_at: string | null;
}

export interface PipelineStage {
  id: string;
  workspace_id: string;
  pipeline_id: string;
  name: string;
  color: string;
  probability: number;
  position: number;
  is_terminal: boolean;
  terminal_status: 'won' | 'lost' | null;
}

export interface Opportunity {
  id: string;
  workspace_id: string;
  title: string;
  service_type: ServiceType;
  stage_id: string;
  owner_id: string;
  contact_id: string | null;
  company_id: string | null;
  estimated_value: number | null;
  final_value: number | null;
  currency_code: string;
  expected_close_date: string | null;
  status: 'open' | 'won' | 'lost';
  lost_reason: string | null;
  archived_at: string | null;
  created_at: string;
}

export interface ContactRecord {
  id: string;
  workspace_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  preferred_channel: 'phone' | 'email' | 'whatsapp' | null;
  owner_id: string;
  company_id: string | null;
  archived_at: string | null;
  created_at: string;
}

export interface CompanyRecord {
  id: string;
  workspace_id: string;
  name: string;
  website: string | null;
  description: string | null;
  owner_id: string;
  archived_at: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  workspace_id: string;
  type: ActivityType;
  subject: string;
  notes: string | null;
  due_at: string | null;
  status: ActivityStatus;
  assigned_to: string;
  opportunity_id: string | null;
  contact_id: string | null;
  company_id: string | null;
  completed_at: string | null;
  archived_at: string | null;
  created_at: string;
}

export interface TimelineEvent {
  id: number;
  entity_id: string;
  entity_type: 'lead' | 'contact' | 'company' | 'opportunity' | 'activity' | 'member';
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const serviceLabels: Record<ServiceType, string> = {
  web_design: 'طراحی سایت',
  ai_agent: 'AI Agent اختصاصی',
  other: 'سایر',
};
