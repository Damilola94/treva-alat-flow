const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''

const services = {
  usermanagement: '/usermanagement',
  accountManagement: '/account-management/api',
  customerManagement: '/customer-management/api',
  onboarding: '/onboarding',
  auth: '/auth',
  professions: '/professions',
  clientManagement: '/clients',
  project: '/projects'
}

const config = {
  baseUrl,
  namespace: process.env.NEXT_PUBLIC_ASSET_PREFIX_NAMESPACE,
  pagination: { PageNumber: '1', PageSize: '10' },
  services,
  tokenKey: 'str-weer-tkey',
  tourKey: 'str-tour-poiu'
}

export default config
