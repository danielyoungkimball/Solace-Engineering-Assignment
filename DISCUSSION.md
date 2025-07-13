# DISCUSSION.md

This was fun project, thank you so much for this chance to join Solace! Super excited about the mission... Worked on the PR's between some episodes on netflix to have a chill Saturday lol

## My Thoughts
- My thought process is laid out pretty well in the PR's! Recommend getting more detailed thoughts there like tradeoffs and specific bug fixes and testing
overall thoughts/tradeoffs
- first thing i did was squish all the react bugs, pretty easy with eslint
- TBH this was my first time using drizzle and I kindaaaa like it - its good for type safety and you can leverage built in functionality but I think I just went with raw sql for easier at the end. I got it working for the first 4 string columns but yeah- if I had to do this again I'd go with drizzle built in functions
- Went with an explicit search instead of debouncing as it felt clunky if I heistated while typing
- Polishing the UX is always fun, went with sorting and a clean table design with pagination. Good for searching, I built a movie catalog project in the past and was able to reference some code there

Could totally deploy this if you wanted a live site, would just use vercel to deploy the next.js app and then render.com or railway for the DB


## What I'd Do With More Time
- **Filters**: Add dropdowns for specialties instead of just text search (since its predefined in `advocates.ts`)
- **Tests**: Unit tests for API endpoints and edge cases
- **Performance**: Add DB indexes... maybe caching layer
- **Accessibility**: Better keyboard nav, maybe add arrow for table navigation
- **Mobile**: More responsive table design (it gets squished on mobile)

## Thank you!!

Thanks for the opportunity! Would be an absolute pleasure to join Solace!

– Danny