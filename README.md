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
[ ] Build the API routes
[ ] Build the upload route
[ ] Link with OpenAI to clean the data
[ ] Link with Exa to enrich the data

## Getting Started

1. Copy over the `.env.example` file to `.env` and fill in the values
2. Run a migration on your supabase instance (for reference: https://supabase.com/docs/guides/deployment/database-migrations)
3. You can then run the app with `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can also view the app at [https://alex-throxy.vercel.app](https://alex-throxy.vercel.app)

## Important Notes

1. For the purposes of the test I haven't restricted update access via Row Level Security, but would add authentication and better protections in a real world system.
2. In a real system I would use something like Prisma as an ORM around directly manipulating the table schema.
3. There are other things I would do to enrich the data, for example, we could use firecrawl to actually go through the websites of the company. We could collect data on the team page,
