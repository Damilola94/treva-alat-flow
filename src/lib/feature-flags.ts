const getFeatureState = (state: string | undefined) => {
  return typeof state === 'undefined' ? ['dev'].includes(process.env.NEXT_PUBLIC_ENV ?? '') : Boolean(state)
}

const MOCK_DATA_ENABLED = getFeatureState(process.env.NEXT_PUBLIC_MOCK_DATA_ENABLED) // temp flag

const featureFlags = { MOCK_DATA_ENABLED }

export default featureFlags
