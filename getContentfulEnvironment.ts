import dotenv from 'dotenv';
import contentfulManagement from "contentful-management"
import { strict as assert } from "assert"

dotenv.config({ path: '.env.local' })
const { CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN, CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT } = process.env


assert(CONTENTFUL_SPACE_ID)
assert(CONTENTFUL_ENVIRONMENT)
assert(CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN)


const getContentfulEnvironment = () => {
  const contentfulClient = contentfulManagement.createClient({
    accessToken: CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN,
  })

  return contentfulClient
    .getSpace(CONTENTFUL_SPACE_ID)
    .then(space => space.getEnvironment(CONTENTFUL_ENVIRONMENT))
}

export default getContentfulEnvironment;
