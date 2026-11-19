/** API origin is configured in one place; production deployment may replace it at build time. */
export const environment={production:false,apiBaseUrl:'/api/v1'} as const;