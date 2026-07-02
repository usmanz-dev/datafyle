export const PLAN_FEATURES: Record<string, string[]> = {
  free:         ['upload', 'excel_export', 'confidence_score'],
  starter:      ['upload', 'excel_export', 'confidence_score', 'monthly_report', 'anomaly', 'teams'],
  professional: ['upload', 'excel_export', 'confidence_score', 'monthly_report', 'anomaly', 'teams', 'google_sheets', 'smart_memory', 'batch'],
  business:     ['all'],
  enterprise:   ['all'],
}

export function hasFeature(plan: string, feature: string): boolean {
  const features = PLAN_FEATURES[plan] ?? PLAN_FEATURES.free
  return features.includes('all') || features.includes(feature)
}

export const FEATURE_REQUIRED_PLAN: Record<string, string> = {
  monthly_report: 'starter',
  anomaly:        'starter',
  teams:          'starter',
  google_sheets:  'professional',
  smart_memory:   'professional',
  batch:          'professional',
}

export const PLAN_NAMES: Record<string, string> = {
  free:         'Free',
  starter:      'Starter',
  professional: 'Professional',
  business:     'Business',
  enterprise:   'Enterprise',
}
