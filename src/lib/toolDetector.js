/* ── Tool-detection heuristics ── */
export const TOOLS = [
  {
    id: 'postgres',
    name: 'PostgreSQL',
    subtitle: 'Sales & Analytics DB',
    icon: '▤',
    color: '#336791',
    glowColor: 'rgba(51,103,145,0.5)',
    keywords: ['sales', 'revenue', 'data', 'query', 'database', 'metrics', 'numbers', 'figure', 'report', 'pipeline', 'quarter', 'monthly', 'annual', 'record'],
  },
  {
    id: 'crm',
    name: 'CRM',
    subtitle: 'Leads & Customer Data',
    icon: '◎',
    color: '#00a1e0',
    glowColor: 'rgba(0,161,224,0.45)',
    keywords: ['customer', 'lead', 'crm', 'contact', 'account', 'deal', 'opportunity', 'pipeline', 'prospect', 'churn', 'retention', 'client'],
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    subtitle: 'Report Export',
    icon: '⊞',
    color: '#0f9d58',
    glowColor: 'rgba(15,157,88,0.4)',
    keywords: ['sheet', 'export', 'report', 'spreadsheet', 'chart', 'graph', 'visualize', 'table', 'excel', 'csv'],
  },
  {
    id: 'slack',
    name: 'Slack',
    subtitle: 'Team Notifications',
    icon: '▶',
    color: '#4a154b',
    glowColor: 'rgba(74,21,75,0.5)',
    keywords: ['notify', 'notification', 'slack', 'alert', 'message', 'team', 'channel', 'post', 'send', 'announce', 'broadcast'],
  },
  {
    id: 'email',
    name: 'Email / Calendar',
    subtitle: 'Scheduling & Comms',
    icon: '✉',
    color: '#ea4335',
    glowColor: 'rgba(234,67,53,0.4)',
    keywords: ['email', 'calendar', 'schedule', 'meeting', 'appointment', 'invite', 'reminder', 'send email', 'follow up'],
  },
  {
    id: 'github',
    name: 'GitHub',
    subtitle: 'Code & Deployments',
    icon: '▲',
    color: '#6e40c9',
    glowColor: 'rgba(110,64,201,0.4)',
    keywords: ['deploy', 'deployment', 'commit', 'pr', 'pull request', 'github', 'code', 'release', 'version', 'branch'],
  },
];

/**
 * Returns the list of tool IDs that are relevant to a given query.
 * @param {string} query
 * @returns {string[]} array of tool IDs
 */
export function detectTools(query) {
  const q = query.toLowerCase();
  const matched = TOOLS.filter(tool =>
    tool.keywords.some(kw => q.includes(kw))
  ).map(t => t.id);
  // Always include at least 2 tools for demo purposes
  if (matched.length === 0) return ['postgres', 'crm'];
  if (matched.length === 1) {
    // add a sensible companion
    const companion = matched[0] === 'slack' ? 'crm' : 'slack';
    return [...matched, companion];
  }
  return matched;
}
