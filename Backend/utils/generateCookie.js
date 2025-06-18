export default function generateCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // ⚠️ set to true only in production with HTTPS
    sameSite: 'lax', // ✅ more relaxed for localhost
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  })
}
