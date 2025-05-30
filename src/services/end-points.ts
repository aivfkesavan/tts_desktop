export const root = {
  localBackendUrl: 'http://localhost:40901',
  liveBackendUrl: 'https://v3backend.nidum.ai/api',
} as const

export const endPoints = {
  // live
  register: '/user/v2/register',
  resendOtp: '/user/resend-otp',
  verifyOtp: '/user/v2/verify-otp',
  updatePass: '/user/update-pass',
  forgetPass: '/user/forget-pass',
  resetPass: '/user/reset-pass',
  login: '/user/login',
  logout: '/user/logout',
  deleteOtp: '/user/delete-otp',
  deleteAccount: '/user/v2/account', // :otp

} as const
