import { RequestHandler } from 'express';
// 從環境變量中獲取 GitHub 和 JWT 的配置信息
const { GITHUB_CLIENT_ID, GITHUB_SECRET, HOST } = process.env;

// 定義 GitHub OAuth 的配置信息
const GITHUB_CONFIG = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_SECRET,
  redirectURI: `${HOST}/callback`
};
export const githubLogin: RequestHandler = (_req, res, next) => {
  try {
    const authURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CONFIG.clientID}&redirect_uri=${GITHUB_CONFIG.redirectURI}&scope=user:email`;
    res.redirect(authURL);
  } catch (error) {
    next(error);
  }
};

export const getInfo: RequestHandler = (req, res) => {
  res.send({
    status: true,
    result: req.user
  });
};


