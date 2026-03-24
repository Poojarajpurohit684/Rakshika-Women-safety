export const getHealth = (_req, res) => {
  res.json({
    service: 'Rashika Safety SOS API',
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}
