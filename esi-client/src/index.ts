import got from 'got';
const cache = new Map();

export interface OauthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  expires_at?: string;
}

export interface CharacterObject {
  CharacterID: number;
  CharacterName: string;
  ExpiresOn: string;
  Scopes: string;
  TokenType: string;
  CharacterOwnerHash: string;
  IntellectualProperty: string;
}

export interface RequestOptions {
  headers: {
    Authorization: string;
  };
  cache?: Map<any, any>;
  json: boolean;
}

/**
 * Base class for making ESI Requests
 */
export default class ESIRequest {
  public token: OauthToken;
  public character?: CharacterObject;
  public affiliations?: any;
  public affiliationNames?: any;
  public constructor(token: OauthToken) {
    this.token = token;
  }

  /**
   * Helper method for calling the EVE API
   * @param path
   * @param options
   */
  public async call(
    path: string,
    options: object = {},
    useCache = false
  ): Promise<any> {
    const requestOptions: RequestOptions = {
      headers: {
        Authorization: `Bearer ${this.token.access_token}`,
      },
      json: true,
      ...options,
    };
    if (useCache) {
      requestOptions.cache = cache;
    }
    const request = await got(
      `https://esi.evetech.net/${path}`,
      requestOptions
    );
    return request.body;
  }

  /**
   * Get current logged in character, and its affiliations
   */
  public async getCharacter(): Promise<void> {
    const { body: character }: { body: CharacterObject } = await got(
      'https://login.eveonline.com/oauth/verify',
      {
        headers: {
          Authorization: `Bearer ${this.token.access_token}`,
        },
        json: true,
      }
    );
    const [affiliations] = await this.call(
      `latest/characters/affiliation`,
      {
        method: 'POST',
        body: [character.CharacterID],
      },
      true
    );
    const affiliationNames = await this.getNames(Object.values(affiliations));
    this.character = character;
    this.affiliations = affiliations;
    this.affiliationNames = affiliationNames;
  }

  public async getNames(body: number[]): Promise<any[]> {
    if (!body.length) {
      return [];
    }
    const names = await this.call('v2/universe/names', {
      method: 'POST',
      body,
    });
    return names;
  }
}
