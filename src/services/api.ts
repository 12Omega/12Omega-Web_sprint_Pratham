export interface DashboardData {
  totalUsers: number;
  activeSessions: number;
  recentUsers: number;
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
}
