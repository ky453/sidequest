# SideQuest: Product Requirements Document

## 1. Problem Space & Opportunity

College students are surrounded by things to do (campus events, restaurants, cafés, local businesses, workshops, outdoor activities, and social gatherings) but discovering experiences that actually fit their needs is surprisingly difficult.

Information is fragmented across Instagram accounts, university websites, group chats, posters, Google Maps, event platforms, and word of mouth. Even when students find something interesting, they still have to evaluate whether it fits their available time, budget, mood, location, and social situation.

As a result, students often default to familiar activities or miss experiences they would have enjoyed.

A second problem also happens after the experience. Photos may go into a camera roll, expenses into a banking app, ratings onto Google Maps, and memories may not be recorded anywhere at all. These pieces of an experience remain disconnected.

Most existing products address only one part of this journey:

- Event platforms help users discover events.

- Map and review platforms help users find places.

- Journaling apps help users record memories.

- Budgeting apps help users understand spending.

Few products connect what someone discovers, what they actually experience, and how they remember that experience afterward.

This creates an opportunity for a product built around the full experience lifecycle:

**Discover → Experience → Record**

## 2. Target Users

### Primary: College Students

Students looking for activities, events, restaurants, cafés, stores, and other experiences around campus.

They often have highly contextual needs:

- Limited free time between classes

- Specific budgets

- Different moods

- Different group sizes

- Limited transportation

- A desire to explore beyond their usual routines

### Secondary: Young Adults in New Cities

Young professionals, interns, travelers, and recent graduates who want to explore their surroundings while keeping track of memorable places and experiences.

This expands the long-term opportunity while allowing the MVP to remain focused on a dense college community where events and local recommendations are highly relevant.

## 3. Personas

### Maya — The Spontaneous Explorer

Maya often wants to do something with friends but doesn't know what.

Her typical question is:

“What can we do tonight that's fun, nearby, and under $20?”

She currently switches between Instagram, Google Maps, group chats, and TikTok recommendations. The amount of searching sometimes makes choosing an activity harder than actually doing it.

### Alex — The Routine Regular

Alex tends to return to the same restaurants, cafés, and activities because finding new places requires effort.

He wants to explore more but needs recommendations that feel relevant to his preferences rather than generic lists of popular places.

### Sophie — The Memory Keeper

Sophie takes photos everywhere she goes and enjoys remembering past experiences, but her memories are spread across her camera roll, Instagram, Notes, and other apps.

She wants a lightweight way to remember where she went, who she went with, what she thought about it, and how much she spent.

### The Key Insight

Discovery and memory are usually treated as separate problems.

For users, however, they are part of the same experience:

**What should I do? → Did I enjoy it? → Would I do it again? → What do I want to remember?**

## 4. Product Concept

SideQuest is a local discovery and memory app that helps users find experiences that fit their current needs and record the experiences they care about afterward.

Rather than asking users to search separately for events, restaurants, stores, and activities, SideQuest organizes discovery around context.

Users can find recommendations based on factors such as:

- Mood

- Budget

- Available time

- Category

- Location

- Who they are with

After completing an experience, users can turn it into a memory by adding a rating, journal entry, photos, and spending information.

Over time, SideQuest becomes both a guide for what to do next and a personal archive of what the user has already experienced.

## 5. Solution Overview

### Contextual Discovery

Users browse nearby events, restaurants, stores, cafés, activities, and other experiences.

Instead of relying only on traditional categories, Sidequest recommends experiences based on the user's current context, including:

- Mood

- Budget and spending constraints

- Available time

- Category

- Location

- Who they are with

- Personal interests

Users can set a specific budget or choose ranges such as Free, Under $10, Under $25, or Under $50. Sidequest prioritizes experiences that fit within those constraints so users are not shown appealing recommendations that are unrealistic for their current budget.

For example, a user might ask:

**“I have two hours, I'm with one friend, I want something relaxing, and I don't want to spend more than $20.”**

Sidequest would recommend activities that satisfy those conditions rather than simply showing the most popular nearby options.

Over time, the product could also use the user's previous experience and spending history to provide more relevant suggestions, such as recommending free or lower-cost activities when the user wants to limit recreational spending.

The goal is to reduce the effort between wanting to do something and finding something that genuinely fits the user's time, mood, and financial constraints.

### Experience Detail Page

Each event or place has a dedicated page containing relevant information such as:

- Description

- Location

- Date and time

- Estimated cost

- Category

- Mood tags

- Ratings

- Photos

Users can save an experience for later or mark that they have visited it.

### Saved Experiences

Users can create a lightweight collection of experiences they want to try.

This provides a bridge between discovery and actually completing an activity. Instead of repeatedly searching for ideas, users gradually build a personalized list of things they are interested in doing.

### Community Proposals

Users can suggest events or places that are not currently listed.

For example, a student organization could submit:

“MCSA Movie Night — Friday at 7 PM”

or a user could recommend a local café they believe others should discover.

Submissions can eventually support community-driven discovery without requiring Sidequest to manually source every experience.

### Memory Journal

After an experience, users can create a memory entry containing:

- Rating

- Short journal entry

- Photos

- Date

- People they were with

- Amount spent

The journal is intentionally lightweight. Users should be able to capture a memory in less than a minute if they want, while still having the option to write more.

### Ratings and Personal Reviews

Users can rate places and experiences after visiting them.

Ratings help future discovery while also creating a personal record.

For example:

Gimme Coffee
★★★★☆
“Great place to work for an hour, but it gets crowded after 2 PM.”

The initial MVP should emphasize personal ratings rather than building a large public-review ecosystem.

### Experience Spending

Users can optionally record how much they spent during an experience.

For example:

Dinner: $24
Transportation: $8
Activity: $12

**Total experience cost: $44**

Sidequest then summarizes experience-related spending over time.

The purpose is not to replace a financial management app. Instead, spending adds useful context to memories and allows users to make future discovery decisions based on realistic financial constraints.

### Monthly Recap

At the end of each month, users can see a visual overview of their experiences.

For example:

**Your September**

12 experiences
8 new places
$184 spent
Average rating: 4.4
Favorite experience: Apple Fest
Most explored category: Food

This transforms individual memories into a broader reflection on how the user spent both their time and money.

## 6. User Flow

### Discovery

The user opens Sidequest and enters or selects their current preferences.

For example:

Mood: Relaxed
Budget: Under $20
Available Time: 2 hours
With: One friend

Sidequest displays relevant experiences.

### Evaluation

The user opens an experience detail page to view its location, price, description, rating, and other relevant information.

The user can:

- Save it

- Choose another recommendation

- Mark it as something they plan to visit

### Experience

The user attends the event or visits the location.

Sidequest does not require active interaction during the experience.

### Recording

Afterward, the user can mark the experience as completed.

They are prompted to optionally add:

- Rating

- Photos

- Journal entry

- Amount spent

### Reflection

The experience appears in the user's Memories page.

The user's spending totals and monthly experience statistics automatically update.

This completes the core loop:

**Discover → Experience → Record → Discover Again**

## 7. MVP Scope

### Included in MVP

- Discover page

- Sample database of local events, restaurants, cafés, stores, and activities

- Search

- Filters for:

  - Mood

  - Budget

  - Available time

  - Category

- Experience detail page

- Save experience

- Mark experience as completed

- Personal rating

- Short memory/journal entry

- Expense entry

- Memories page

- Basic monthly experience and spending summary

- Simple event/place submission

### Not Included in MVP

- AI-generated recommendations

- Real-time bank account integration

- Automatic transaction tracking

- Social feed

- Following other users

- Direct messaging

- Group planning

- Restaurant reservations

- Ticket purchasing

- Automatic scraping of university events

- Advanced public review system

- Personalized machine-learning recommendations

- Full Google Maps-style navigation

- Complex gamification

These features may become valuable later, but they are not necessary to validate the product's central behavior.

The MVP should first answer:

**Will users repeatedly use the same product to discover experiences and record them afterward?**

## 8. North Star Metric

### Weekly Completed Experience Loops per Active User

An experience loop is completed when a user interacts with an experience through Sidequest and later records that experience as completed.

This metric reflects the product's core value better than simply measuring page views, searches, or journal entries.

The goal is not just to make users browse.

The goal is to help them do something in the real world and create a meaningful record of it afterward.

### Supporting Metrics

- Discover-to-detail click-through rate

- Percentage of viewed experiences that are saved

- Save-to-completion conversion rate

- Percentage of completed experiences with a memory entry

- Percentage of memories containing a rating

- Percentage of memories containing spending information

- Number of experiences completed per user per month

- Weekly active users

- Four-week retention

- Number of user-submitted experiences

## 9. Assumptions and Risks

### Assumptions

- Users want recommendations based on context rather than popularity alone.

- Students experience enough difficulty discovering relevant local activities for Sidequest to become a repeat-use product.

- Users are willing to manually record experiences after completing them.

- Memory creation provides enough personal value to encourage users to return even when they are not actively looking for something to do.

- Users find lightweight spending information useful when connected to experiences.

### Risks

Cold-start discovery problem:
The product needs enough events and places to make discovery feel useful from the first session.

Manual journaling friction:
Users may enjoy looking back at memories but may not consistently take the time to create them.

Feature overload:
Discovery, journaling, reviews, event submission, and spending could make the product feel unfocused if they are presented as separate products rather than parts of the same experience loop.

Data freshness:
Events change frequently, meaning outdated information could quickly reduce user trust.

Competition:
Users already have established behaviors involving Google Maps, Instagram, TikTok, Yelp, event platforms, Notes, and financial apps.

Sidequest therefore needs to provide value through the connection between these activities, rather than attempting to outperform each specialized product individually.

Financial feature creep:
Expense tracking could easily expand into budgeting, banking, and financial management. The MVP should deliberately keep financial functionality tied specifically to experiences.

## 10. Go-to-Market Strategy

### Initial Wedge: College Campuses

Sidequest should initially focus on a single geographically dense university community.

College campuses are especially suitable because:

- Students frequently look for things to do.

- Events happen constantly.

- Local businesses actively target students.

- Student organizations generate large amounts of event content.

- Word of mouth spreads quickly.

- Users share similar geographic constraints.

A campus such as Cornell and the surrounding Ithaca community could serve as an initial test environment.

### Supply Strategy

The initial database can be manually curated with a limited set of high-quality experiences across categories such as:

- Campus events

- Food

- Cafés

- Shopping

- Arts and culture

- Outdoor activities

- Nightlife

- Workshops

- Student organization events

User submissions can gradually expand the database.

### Distribution Channels

- Student organizations

- Campus ambassadors

- Student group chats

- Instagram and TikTok

- QR codes at local businesses and campus locations

- Partnerships with student organizations hosting events

- Peer-to-peer recommendations

### Positioning

Sidequest is not another event calendar.

It helps users answer:

**“What should I do with my time?”**

and later:

**“What did I actually do with it?”**

Potential positioning:

**Find something to do. Make it a memory.**

## 11. Lessons from Existing Products

Existing discovery products demonstrate that having more options does not necessarily make choosing easier.

Search-based platforms work well when users already know what they want, but users often begin with something more ambiguous:

“I want to do something fun tonight.”

Sidequest therefore emphasizes contextual discovery rather than requiring users to formulate a precise search.

Event platforms also tend to focus on what happens before an experience, while journaling and photo products focus on what happens after it.

Sidequest connects those moments.

Review platforms demonstrate the value of ratings and recommendations, butSidequest's initial focus should remain on personal reflection rather than building another public review marketplace.

Budgeting products provide detailed financial analysis, but Sidequest should avoid competing in this category. Spending is useful primarily because it adds context to an experience.

The product's differentiation therefore comes from connecting four behaviors that normally happen separately:

**Discovery → Participation → Reflection → Spending Awareness**

The long-term opportunity is for Sidequest to learn from this history.

If a user consistently enjoys inexpensive outdoor activities, local cafés, art events, and small-group experiences, Sidequest can eventually use those signals to make future discovery increasingly personal.

The product therefore becomes more valuable with use:

**The more experiences users record, the better Sidequest can understand what experiences they may enjoy next.**
