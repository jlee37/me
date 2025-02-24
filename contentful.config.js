module.exports = {
  spaceId: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: 'master', // Change if using a different environment
  output: 'types/contentful.ts', // Where the generated types will be saved
};