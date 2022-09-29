import { pathNameLocalStorage } from 'constants/common';
import { Log, UserManager, WebStorageStateStore } from 'oidc-client';

export const IDENTITY_CONFIG = {
  authority: process.env.REACT_APP_AUTH_URL, //(string): The URL of the OIDC provider.
  client_id: process.env.REACT_APP_IDENTITY_CLIENT_ID, //(string): Your client application's identifier as registered with the OIDC provider.
  redirect_uri: `${window.location.origin}/login`, //The URI of your client application to receive a response from the OIDC provider.
  automaticSilentRenew: false, //(boolean, default: false): Flag to indicate if there should be an automatic attempt to renew the access token prior to its expiration.
  loadUserInfo: true, //(boolean, default: true): Flag to control if additional identity data is loaded from the user info endpoint in order to populate the user's profile.
  // silent_redirect_uri: `${window.location.origin}/silent`, //(string): The URL for the page containing the code handling the silent renew.
  // post_logout_redirect_uri: `${window.location.origin}/log-off`, // (string): The OIDC post-logout redirect URI.
  response_type: process.env.REACT_APP_RESPONSE_TYPE, //(string, default: 'id_token'): The type of response desired from the OIDC provider.
  scope: process.env.REACT_APP_SCOPE, //(string, default: 'openid'): The scope being requested from the OIDC provider.
  client_secret: process.env.REACT_APP_IDENTITY_CLIENT_SECRET,
  grant_type: process.env.REACT_APP_GRANT_TYPE,
};

export default class AuthService {
  UserManager;
  expireCount = 0;
  constructor() {
    this.UserManager = new UserManager({
      ...IDENTITY_CONFIG,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    });
    // Logger
    Log.logger = console;
    Log.level = Log.DEBUG;
    this.UserManager.events.addUserLoaded((user) => {
      if (window.location.href.indexOf('signin-oidc') !== -1) {
        this.navigateToScreen();
      }
    });
    this.UserManager.events.addSilentRenewError((e) => {
      console.log('silent renew error', e.message);
    });

    this.UserManager.events.addAccessTokenExpired(() => {
      if (this.expireCount) return;
      console.log('token expired');
      this.expireCount++;
      // alert('Token expired');
      this.signoutRedirect();
    });
  }

  signinRedirectCallback = () => {
    const oldPathName = localStorage.getItem(pathNameLocalStorage) || '/';
    this.UserManager.signinRedirectCallback().then(() => {
      window.location.href = `${oldPathName}`;
    });
  };

  getUser = async () => {
    const user = await this.UserManager.getUser();
    if (!user) {
      return await this.UserManager.signinRedirectCallback();
    }
    return user;
  };

  parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  signinRedirect = () => {
    localStorage.setItem('redirectUri', window.location.pathname);
    this.UserManager.signinRedirect();
  };

  navigateToScreen = () => {
    window.location.replace('/');
  };

  isAuthenticated = () => {
    const oidcAuth = localStorage.getItem(
      `oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_IDENTITY_CLIENT_ID}`,
    );

    if (!oidcAuth) return false;

    const oidcStorage = JSON.parse(oidcAuth);

    return oidcStorage && oidcStorage.access_token;
  };

  signinSilent = () => {
    this.UserManager.signinSilent()
      .then((user) => {
        console.log('signed in', user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  signinSilentCallback = () => {
    this.UserManager.signinSilentCallback();
  };

  createSigninRequest = () => {
    return this.UserManager.createSigninRequest();
  };

  logout = async () => {
    this.UserManager.signoutRedirect({
      id_token_hint: localStorage.getItem('id_token'),
    });
    this.UserManager.clearStaleState();
    localStorage.clear();
  };

  signoutRedirectCallback = () => {
    this.UserManager.signoutRedirectCallback().then(() => {
      localStorage.clear();
      window.location.replace(process.env.REACT_APP_PUBLIC_URL || '');
    });
    this.UserManager.clearStaleState();
  };
  signoutRedirect = () => {
    this.UserManager.signoutRedirect().then(() => {
      this.signinRedirect();
    });
  };
}
