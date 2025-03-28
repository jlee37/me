import { createClient } from 'contentful';

// Ensure environment variables are correctly read by Next.js
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT, 
});

export default client;