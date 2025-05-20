// import { join } from 'path';

export default [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: "http://localhost:3000/swagger.json",
      serversPath: './src/services/UAC',
    },
    // {
    //   schemaPath: 'http://auth.swagger.io/v2/swagger.json',
    //   serversPath: './servers/auth',
    // }
]