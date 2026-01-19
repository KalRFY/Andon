const DashboardData = require('../models/DashboardData');

const seedDashboardData = async () => {
  try {
    const count = await DashboardData.count();
    if (count === 0) {
      await DashboardData.bulkCreate([
        { name: 'Item A', value: 10 },
        { name: 'Item B', value: 20 },
        { name: 'Item C', value: 30 },
      ]);
      console.log('DashboardData seeded successfully.');
    } else {
      console.log('DashboardData already has data, skipping seeding.');
    }
  } catch (error) {
    console.error('Error seeding DashboardData:', error);
  }
};

module.exports = seedDashboardData;
