const { QccMTypes } = require('../models');

async function fetchQccMTypes() {
  try {
    const types = await QccMTypes.findAll({
      attributes: ['type_id', 'type_nm'],
      order: [['type_id', 'ASC']],
      limit: 10,
    });
    console.log('QccMTypes data:', types.map(t => t.toJSON()));
  } catch (error) {
    console.error('Error fetching QccMTypes:', error);
  }
}

fetchQccMTypes();
