const getNow = (req) => {
  if (
    process.env.TEST_MODE === '1' &&
    req.headers['x-test-now-ms']
  ) {
    const testTime = Number(req.headers['x-test-now-ms'])
    if (!Number.isNaN(testTime)) {
      return new Date(testTime)
    }
  }

  return new Date()
}

export default getNow