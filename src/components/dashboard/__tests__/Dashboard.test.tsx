import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, expect } from 'vitest';
import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import Dashboard from '../../../pages/Dashboard';
import { dashboardAPI } from '../../../services/api';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock the API
vi.mock('../../../services/api', () => ({
  dashboardAPI: {
    getDashboardData: vi.fn()
  }
}));

// Mock the auth context
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: { name: 'Test User', email: 'test@example.com' }
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the dashboard components
vi.mock('../../../components/dashboard/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

vi.mock('../../../components/dashboard/DashboardHeader', () => ({
  default: ({ onLogout }: { onLogout: () => void }) => (
    <div data-testid="dashboard-header">
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}));

vi.mock('../../../components/dashboard/StatsCards', () => ({
  default: ({ totalUsers, activeSessionsToday, recentUsersChange }: any) => (
    <div data-testid="stats-cards">
      <div>Total Users: {totalUsers}</div>
      <div>Active Sessions: {activeSessionsToday}</div>
      <div>Recent Change: {recentUsersChange}%</div>
    </div>
  )
}));

vi.mock('../../../components/dashboard/EarningsChart', () => ({
  default: ({ earningsData }: any) => (
    <div data-testid="earnings-chart">
      Earnings Chart: {earningsData?.length || 0} items
    </div>
  )
}));

vi.mock('../../../components/dashboard/UserGrowthChart', () => ({
  default: ({ userGrowthData }: any) => (
    <div data-testid="user-growth-chart">
      User Growth Chart: {userGrowthData?.length || 0} items
    </div>
  )
}));

vi.mock('../../../components/dashboard/DailyActivityOverview', () => ({
  default: ({ sessionActivity }: any) => (
    <div data-testid="daily-activity">
      Daily Activity: {sessionActivity?.length || 0} items
    </div>
  )
}));

vi.mock('../../../components/dashboard/ParkingGrid', () => ({
  default: ({ parkingSpots }: any) => (
    <div data-testid="parking-grid">
      Parking Grid: {parkingSpots?.total || 0} spots
    </div>
  )
}));

vi.mock('../../../components/dashboard/RecentBookings', () => ({
  default: ({ recentBookings }: any) => (
    <div data-testid="recent-bookings">
      Recent Bookings: {recentBookings?.length || 0} items
    </div>
  )
}));

describe('Dashboard Page', () => {
  const mockDashboardData = {
    totalUsers: 100,
    activeSessionsToday: 25,
    recentUsersChange: 5.5,
    sessionActivity: [
      { date: '2024-07-14', count: 5 },
      { date: '2024-07-15', count: 8 }
    ],
    userGrowth: [
      { month: '2024-06', count: 80 },
      { month: '2024-07', count: 100 }
    ],
    parkingSpots: {
      available: 15,
      occupied: 10,
      maintenance: 5,
      total: 30
    },
    recentBookings: [
      {
        _id: '1',
        user: { name: 'John Doe', email: 'john@example.com' },
        parkingSpot: { name: 'Spot A1', location: 'Downtown' },
        vehicleInfo: {
          licensePlate: 'ABC123',
          make: 'Toyota',
          model: 'Camry',
          color: 'Blue'
        },
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        status: 'active',
        totalCost: 15.00
      }
    ],
    earningsData: [
      { month: 'Jun', earnings: 1200 },
      { month: 'Jul', earnings: 1500 }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    (dashboardAPI.getDashboardData as any).mockReturnValue(new Promise(() => { }));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading dashboard data/i)).toBeInTheDocument();
  });

  it('should render dashboard components with data', async () => {
    (dashboardAPI.getDashboardData as any).mockResolvedValue(mockDashboardData);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading dashboard data/i)).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('stats-cards')).toBeInTheDocument();
    expect(screen.getByTestId('earnings-chart')).toBeInTheDocument();
    expect(screen.getByTestId('user-growth-chart')).toBeInTheDocument();
    expect(screen.getByTestId('daily-activity')).toBeInTheDocument();
    expect(screen.getByTestId('parking-grid')).toBeInTheDocument();

    expect(screen.getByText(/total users: 100/i)).toBeInTheDocument();
    expect(screen.getByText(/active sessions: 25/i)).toBeInTheDocument();
    expect(screen.getByText(/recent change: 5.5%/i)).toBeInTheDocument();
    expect(screen.getByText(/earnings chart: 2 items/i)).toBeInTheDocument();
    expect(screen.getByText(/user growth chart: 2 items/i)).toBeInTheDocument();
    expect(screen.getByText(/daily activity: 2 items/i)).toBeInTheDocument();
    expect(screen.getByText(/parking grid: 30 spots/i)).toBeInTheDocument();
  });

  it('should use dummy data when API call fails', async () => {
    (dashboardAPI.getDashboardData as any).mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading dashboard data/i)).not.toBeInTheDocument();
    });

    // Should still render components with dummy data
    expect(screen.getByTestId('stats-cards')).toBeInTheDocument();
    expect(screen.getByTestId('earnings-chart')).toBeInTheDocument();
  });
});