const startTime = Date.now();

const healthCheck = async (req, res) => {
  const uptime = (Date.now() - startTime) / 1000;
  
  const healthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor(uptime)
  };

  res.status(200).json(healthResponse);
};

module.exports = {
  healthCheck
};