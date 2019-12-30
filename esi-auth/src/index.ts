/* eslint-disable @typescript-eslint/camelcase */
import { create, Token, OAuthClient } from "simple-oauth2";
/**
 * Interface for JWT
 */
export interface TokenValues {
  token: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    expires_at: string;
  };
  character: {
    CharacterID: number;
    CharacterName: string;
    ExpiresOn: string;
    Scopes: string;
    TokenType: string;
    CharacterOwnerHash: string;
    IntellectualProperty: string;
  };
  iat: number;
  exp: number;
}

export interface OauthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  expires_at?: string;
}

interface ESIAuthParams {
  scopes: string[];
  redirectUrl: string;
  clientId: string;
  clientSecret: string;
}

export default class ESIAuth {
  scopes: string;
  redirectUrl: ESIAuthParams['redirectUrl'];
  clientId: ESIAuthParams['clientId'];
  clientSecret: ESIAuthParams['clientSecret'];
  oauth: OAuthClient;

  constructor({ clientId, clientSecret, redirectUrl, scopes }: ESIAuthParams) {
    this.scopes = scopes.join(' ');
    this.redirectUrl = redirectUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.oauth = create({
      client: {
        id: clientId,
        secret: clientSecret
      },
      auth: {
        tokenHost: "https://login.eveonline.com/"
      }
    })
  }

  async checkAccessToken(
    token: OauthToken | Token
  ): Promise<OauthToken> {
    let accessToken = this.oauth.accessToken.create(token);
    if (accessToken.expired()) {
      try {
        accessToken = await accessToken.refresh();
      } catch (error) {
        console.log(error);
        console.log("Error refreshing access token: ", error.message);
      }
    }
    return (accessToken.token) as OauthToken;
  }
  async getRefreshToken(
    code: string,
  ): Promise<Token> {
    const tokenConfig = {
      code,
      scope: this.scopes,
      redirect_uri: this.redirectUrl
    };
    const result = await this.oauth.authorizationCode.getToken(tokenConfig);
    return this.oauth.accessToken.create(result);
  }

  async getToken(code: string): Promise<OauthToken> {
    const tokenConfig = {
      code,
      scope: "publicData",
      redirect_uri: this.redirectUrl
    };
    const result = await this.oauth.authorizationCode.getToken(tokenConfig);
    const accessToken = this.oauth.accessToken.create(result);
    return accessToken.token as OauthToken;
  };

  getLoginUrl = () => this.oauth.authorizationCode.authorizeURL({
    redirect_uri: this.redirectUrl,
    scope: "publicData"
  });

  getAuthorizationUrl = () => this.oauth.authorizationCode.authorizeURL({
    redirect_uri: this.redirectUrl,
    scope: this.scopes
  });

}
