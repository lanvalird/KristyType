export interface IConfigFile {
  author: {
    name: string;
    username: string;
    discordId: string;
  };
  bot: {
    clientId: string;
    version: string;
    status: string;
    guild: {
      id: string;
      link: string;
    };
    website: string;
  };
  api: {
    url: string;
  };
}

// For Zod
export const ConfigSchema = {
  author: {
    name: 'string',
    username: 'string',
    discordId: 'string'
  },
  bot: {
    clientId: 'string',
    version: 'string',
    status: 'string',
    guild: {
      id: 'string',
      link: 'string'
    },
    website: 'string'
  },
  api: {
    url: 'string'
  }
} as const;