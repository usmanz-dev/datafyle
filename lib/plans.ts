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

// Always derive doc limits from plan, not from docsLimit column
// (so manually changing plan in DB immediately takes effect)
export const PLAN_DOCS_LIMIT: Record<string, number> = {
  free:         10,
  starter:      500,
  professional: 3000,
  business:     10000,
  enterprise:   20000,
}

export function getDocsLimit(plan: string): number {
  return PLAN_DOCS_LIMIT[plan] ?? 10
}
