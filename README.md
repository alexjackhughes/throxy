# Throxy

Here are the steps I followed to build this app:

[x] Created a new Next.js app from a template
[x] Removed unused files
[x] Added a models interface based on the data provided
[x] Deploy to Vercel and connect with Github
[x] Build the UI and seperate out components
[x] Add the filters to the page route
[x] Set up Supabase
[x] Build the data fetching logic
[x] Build the API routes
[x] Build the upload route
[x] Link with OpenAI to clean the data
[x] Use OpenAI to enrich the data i.e. with industries etc
[ ] Link with Exa to enrich the data i.e. for URLs

## Getting Started

1. Copy over the `.env.example` file to `.env` and fill in the values
2. Run a migration on your supabase instance (for reference: https://supabase.com/docs/guides/deployment/database-migrations)
3. You can then run the app with `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can also view the app at [https://alex-throxy.vercel.app](https://alex-throxy.vercel.app)

## Important Notes

1. For the purposes of the test I haven't restricted update access via Row Level Security, but would add authentication and better protections in a real world system.
2. In a real system I would use something like Prisma as an ORM around directly manipulating the table schema.
3. In a real system, I would work with customers to understand what other information they would like to see to enrich the data further. For example, we could easily add "descriptions" generated with OpenAI, or more complex flows, like using a combination of Firecrawl and Exa.ai to find the about pages of companies, find the current team members, and add them with any contact information on the about page.
4. I ended up implementing swr to handle data fetching/caching because of the requirement for a data fetching API. However, as this is a Next app, we could simply the logic by removing that API and just fetching the data directly from the page as it would be done securely on the server.
5. I didn't implement pagination for simplicity, but in a real system I would.
