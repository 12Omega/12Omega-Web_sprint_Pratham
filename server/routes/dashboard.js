router.get('/history', async (req, res) => {
  try {
    // Normally, you’d aggregate real data from your DB here
    // For demo, sending sample data for 7 days:

    const userGrowth = [
      { date: '2025-06-14', count: 50 },
      { date: '2025-06-15', count: 60 },
      { date: '2025-06-16', count: 70 },
      { date: '2025-06-17', count: 80 },
      { date: '2025-06-18', count: 90 },
      { date: '2025-06-19', count: 100 },
      { date: '2025-06-20', count: 110 },
    ];

    const sessionActivity = [
      { date: '2025-06-14', activeSessions: 20 },
      { date: '2025-06-15', activeSessions: 25 },
      { date: '2025-06-16', activeSessions: 30 },
      { date: '2025-06-17', activeSessions: 28 },
      { date: '2025-06-18', activeSessions: 35 },
      { date: '2025-06-19', activeSessions: 40 },
      { date: '2025-06-20', activeSessions: 42 },
    ];

    // You can calculate totalUsers, activeSessions, recentUsers same as previous endpoint or fetch real data

    const totalUsers = 110;
    const activeSessions = 42;
    const recentUsers = 30;

    res.json({
      totalUsers,
      activeSessions,
      recentUsers,
      userGrowth,
      sessionActivity,
    });
  } catch (error) {
    console.error('Error fetching dashboard history data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

