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

## Thoughts on exercise:

1. Really appreciate how straight forward it was, enjoyed it
2. I've kept the git commits concise, so that you can check it out at different stages and see the progress.

## Getting Started

1. Copy over the `.env.example` file to `.env` and fill in the values
2. Run a migration on your supabase instance (for reference: https://supabase.com/docs/guides/deployment/database-migrations)
3. You can then run the app with `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can also view the app at [https://throxy.vercel.app](https://throxy.vercel.app)

## Considerations for further iterations

1. For the purposes of the test I haven't restricted update access via Row Level Security. In real system, I would want to understand the use case further - For example, maybe it's on the website and so it should allow anonymous access - but in general, I would implement authentication and authorisation around this functionality.
2. In a real system I would use something like Prisma as an ORM around building a service directly connected via Supabase.
3. In a real system, there are lots of ways we could improve and enrich this data further. For example, as we have the domain we could easily add "descriptions" generated with OpenAI, or do more complex flows, like using Exa.ai to find the about pages of companies, find the current team members, and add them with any contact information on the about page.
4. I ended up implementing swr to handle data fetching/caching because of the requirement for a data fetching API. However, as this is a Next app, we could simply the logic by removing that API and just fetching the data directly from the page as it would be done securely on the server.
5. I didn't implement pagination for simplicity, but in a real system I would.
6. With more time, I would have added a better loading state for suspense, so each component has it's own loading and can be handled separately.
7. In a real system, I would set up a table to track countries, so that the filter isn't hardcoded options, but instead is a dropdown of all countries currently in the database, or use a library to fetch all the countries in the world.
8. The speed is quite slow because I'm doing it in one big chunk. Depending on the use case, we could batch the rows into small chunks so the user can see the data being uploaded in a real time rather than waiting for the whole thing to finish. Failing that, I would probably split out the enrichment to some kind of background job.
9. The upload API got quite large and complex, in a real system I would split that functionality into more reusable functions depending on other user cases we might have. For example, the openai completion as JSON could be it's own function, as could the system prompt etc.
10. I would make the country and city inputs rather than select, so you could type in san francisco rather than just select it from a dropdown.
