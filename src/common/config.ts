export const kakaoOAuthConfig = {
  SCOPE: process.env.KAKAO_OAUTH_SCOPE || 'profile account_email',
  AUTHORIZATION_URI:
    process.env.KAKAO_AUTHORIZATION_URI ||
    'https://kauth.kakao.com/oauth/authorize',
  TOKEN_URI:
    process.env.KAKAO_TOKEN_URI || 'https://kauth.kakao.com/oauth/token',
  USER_INFO_URI:
    process.env.KAKAO_USERINFO_URI || 'https://kapi.kakao.com/v2/user/me',
};

export const clientConfig = {
  clientURL: process.env.CLIENT_URL || 'http://localhost:8080',
};

export const JwtConfig = {
  tokenSecret: process.env.JWT_SECRET || 'token-scret',
  tokenExpiresIn: Number(process.env.JWT_EXPIRATION) || 86400,
};

export const AccessTokenConfig = {
  cookieExpiresIn: Number(process.env.ACCESSTOKEN_EXPIRATION) || 86400,
};
