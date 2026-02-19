# Figma Wireframe Prompts — Voyager AI Travel Agent

Each section below is a self-contained prompt you can feed into Figma to generate wireframes. The app is a rich, visual personal travel agent (Airbnb / Google Travel style), fully responsive (desktop + mobile), with user accounts, saved trips, and sharing/collaboration.

---

## Prompt 1: Landing Page / Home

Design a landing page for "Voyager AI" — a personal AI travel agent web app. Rich, visual style similar to Airbnb or Google Travel.

**Hero section:**
- Full-bleed hero image (rotating destination photography — Santorini, Tokyo, Patagonia)
- Headline: "Your AI Travel Agent" with subtext "Plan your perfect trip in minutes with AI-powered research"
- A prominent chat-style input field centered over the hero: placeholder text "Where do you want to go?" with a send button. This is the primary CTA — it kicks off the trip planning conversation
- Below the input, 3-4 quick-start chips/pills: "Weekend in Paris", "Family trip to Orlando", "2 weeks in Japan", "Budget backpacking SE Asia"

**Below the fold:**
- "How it works" section: 3 steps with icons — (1) "Tell us about your dream trip" (chat bubble icon), (2) "AI agents research flights, hotels & activities" (search/globe icon), (3) "Get a complete day-by-day itinerary" (calendar/map icon)
- "Popular destinations" grid: 6-8 destination cards with hero photos, destination name, and "from $X" pricing. Cards are clickable and pre-fill the trip planner
- "Recent trips by our community" section: 3-4 cards showing shared public itineraries with destination photo, trip title, duration, and traveler avatar
- If logged in: "Your trips" section showing the user's saved trips as cards with status badges (Draft, Planning, Complete)

**Navigation bar (sticky top):**
- Logo left
- Nav links: "Plan a Trip", "My Trips", "Explore"
- Right side: "Sign In" / "Sign Up" buttons (or avatar dropdown if logged in)

**Footer:** Standard links — About, Privacy, Terms, Contact, social icons

**Mobile:** Hero collapses to smaller image, input field is full-width, destination grid becomes horizontal scroll, nav becomes hamburger menu with bottom tab bar

---

## Prompt 2: Trip Planning Conversation Screen

Design the main trip planning conversation interface. This is where users chat with the AI to define their trip before the AI researches and builds the itinerary.

**Layout — Desktop:**
- Left panel (60% width): Chat conversation area
- Right panel (40% width): Live "Trip Summary" card that updates as details are collected

**Chat area:**
- Message bubbles: user messages right-aligned (colored), AI messages left-aligned (white/light) with an AI avatar
- AI messages can contain rich content: not just text but also inline suggestion chips the user can tap (e.g., when AI asks "Rome, Florence, or Amalfi Coast?", show 3 tappable chips)
- Typing indicator (animated dots) when AI is thinking
- Input bar at bottom: text field with send button, optional attachment icon (for uploading booking confirmations), and a microphone icon for voice input
- Above the input: subtle hint text that changes contextually, e.g., "Tell me your dates, budget, and interests..."

**Trip Summary card (right panel):**
- Displays collected details in real-time as the conversation progresses
- Fields with checkmarks when confirmed, dimmed/placeholder when not yet collected:
  - Destination (with small flag icon)
  - Dates (calendar icon, departure → return)
  - Travelers (person icon, count)
  - Origin (plane icon)
  - Budget (dollar icon, total + allocation bars for flights/hotels/activities/food)
  - Interests (tag pills: "History", "Food", "Art", etc.)
  - Trip type (round trip / one-way / multi-city)
  - Pre-booked items (if any — flight/hotel badges)
- At the bottom: a prominent "Start Planning" button that appears once the AI has enough info. Disabled/hidden until ready
- For multi-city trips: visual city route showing city names connected by arrows with dates under each

**Mobile:**
- Full-screen chat, no side panel
- Trip summary accessible via a floating "summary" pill/button at the top that slides up a bottom sheet when tapped
- "Start Planning" becomes a sticky bottom bar button when ready

---

## Prompt 3: Trip Research / Loading Screen

Design an animated loading/progress screen shown while the 5 AI agents are researching the trip in parallel. This screen should feel exciting and build anticipation.

**Layout:**
- Destination hero image as background (blurred/dimmed)
- Center card with trip title: "Planning your 5 days in Rome..."
- Below: 5 research agent rows, each with:
  - Icon (plane, bed, compass, cloud, globe)
  - Label: "Searching flights...", "Finding hotels...", "Discovering activities...", "Checking weather...", "Researching destination..."
  - Status: animated spinner while running → green checkmark when done → shows brief result preview (e.g., "Found 5 flights from $926/person")
  - Each row animates independently since agents complete at different times
- Subtle progress bar at top showing overall completion (0-100%)
- Below the agents: fun travel facts or tips that rotate every few seconds ("Did you know? Rome has more than 2,000 fountains!")
- Estimated time remaining: "Almost there..." or "Assembling your itinerary..."

**Final assembly phase:**
- Once all 5 agents complete, the agent rows collapse and a new status appears: "Our AI writer is crafting your perfect itinerary..." with a different animation (typewriter effect or document being written)
- When done: smooth transition/animation into the itinerary view

**Mobile:** Same layout, vertically stacked, full-screen

---

## Prompt 4: Itinerary View — Main Screen (The Core Experience)

Design the full itinerary view — this is the main output screen and the most important page in the app. Rich, visual, magazine-quality layout. Think Airbnb Experiences meets Google Travel.

**Top hero section:**
- Full-width destination hero image with overlay gradient
- Trip title: "5 Days in Rome"
- Date range: "June 16-20, 2026"
- Traveler count: "2 travelers"
- Action buttons row: "Share", "Export PDF", "Export Markdown", "Edit Trip", "Save"
- For multi-city trips: horizontal city route visualization (Rome → Florence → Venice with dates)

**Sticky sub-navigation tabs (scrolls into view):**
- "Overview" | "Day by Day" | "Flights" | "Hotels" | "Budget" | "Tips"
- Tapping scrolls to that section. Active tab highlights as user scrolls

**Overview section:**
- Destination summary: 2-3 paragraph rich text description of the destination with inline photos
- Quick info cards row: Currency (€ EUR), Language (Italian), Timezone (CET), Visa info, Emergency number
- Weather forecast strip: horizontal row of day cards (date, weather icon, high/low temps) — only shown if real forecast data exists. If no forecast data, show a subtle note: "Weather forecast available closer to your trip date"

**Day-by-Day section:**
- Each day is a large visual card:
  - Day header: "Day 1: Arrival & Ancient Rome" with date, city name, and small weather badge (if available)
  - Three time blocks (Morning / Afternoon / Evening), each with:
    - Time label with clock icon
    - Activity description (rich text, 2-3 sentences)
    - Optional: small thumbnail image of the activity/landmark
    - Optional: cost badge ("~$45")
  - Expandable "Rain plan" accordion at the bottom of each day card:
    - Toggle label: "If it rains:" with umbrella icon
    - When expanded: shows alternative morning, afternoon, and evening indoor/covered activities
  - Day total estimated cost in bottom-right corner
  - Each activity block has a subtle "swap" icon button that opens the suggestion/alternatives flow

**Flights section:**
- Card-based layout (not a dense table)
- Each flight option is a card showing:
  - Outbound: origin → destination with airline logo, departure/arrival times, duration, stops
  - Return: destination → origin same format
  - Price prominently displayed (per person + total)
  - "Select" button on each card
  - Recommended/best-value badge on the mid-range option
- If flights are pre-booked: single card with "Confirmed" badge, no alternatives

**Hotels section:**
- For single-city: card grid (2-3 columns desktop, 1 column mobile)
- For multi-city: grouped by city with city header and dates
- Each hotel card:
  - Hotel name, star rating, review score
  - Price per night + total stay cost
  - Amenity icons (wifi, breakfast, pool, etc.)
  - "Select" button
  - Recommended badge on mid-range option
- If hotel is pre-booked: single card with "Confirmed" badge

**Budget section:**
- Visual budget breakdown:
  - Horizontal stacked bar chart showing category proportions (flights, hotels, activities, food, transport, misc)
  - Each segment is a different color with label and dollar amount
  - Below: itemized list with category, amount, and percentage of total
  - Total budget vs. planned spending comparison with remaining/over indicator
- Budget ring/donut chart as an alternative visualization

**Practical Tips section:**
- Card grid of tips, each with an icon and tip text
- Categories: Transport, Cultural, Money, Safety, Food, Packing

**Mobile:**
- Hero section collapses, action buttons become icon-only row
- Sub-nav becomes horizontal scroll tabs
- Day cards are full-width, vertically stacked
- Flight/hotel cards are full-width single column
- Budget chart becomes vertical stacked bars

---

## Prompt 5: Itinerary Refinement / Chat Overlay

Design the refinement experience — an overlay or side panel where users can chat with the AI to modify their itinerary after it's been generated.

**Desktop layout:**
- The itinerary view remains visible (dimmed or shifted left)
- A chat panel slides in from the right (40% width) — similar to the planning conversation but contextual to the existing itinerary
- Chat shows AI greeting: "Your itinerary is ready! Want to make any changes? You can ask me to swap activities, adjust the budget, change hotels, or anything else."
- User can type natural language requests: "Move the Vatican to day 3", "Find a cheaper hotel", "Add a cooking class"
- AI responds with confirmation of changes and the itinerary view live-updates in the background

**Suggestion flow (when AI detects user wants alternatives):**
- AI presents 3 alternative cards inline in the chat:
  - Each card: name, description, estimated cost
  - Numbered 1-3 with "Choose" buttons
  - "Show more" button for additional alternatives
  - "Skip" to cancel
- When user picks one, AI confirms and itinerary updates

**Quick-edit shortcuts:**
- On the itinerary itself, each activity time block has a "swap" icon
- Clicking it opens a small popover: "What would you prefer?" with a text input and "Get suggestions" button
- This pre-fills the refinement chat with context about which day/time slot to replace

**Mobile:**
- Refinement chat is a full-screen overlay (slide up from bottom)
- Itinerary is not visible during refinement — user switches back and forth
- Bottom sheet style with handle to drag down/dismiss

---

## Prompt 6: Activity Swap / Alternatives Modal

Design a modal or bottom sheet for swapping a specific activity with AI-suggested alternatives. Triggered by clicking the "swap" button on any activity in the day-by-day itinerary.

**Modal content:**
- Header: "Alternatives for: [current activity name]" with the day number and time slot (e.g., "Day 2, Afternoon")
- Current activity shown at top (dimmed) for reference
- 3 suggested alternatives as rich cards:
  - Activity name (bold)
  - 2-3 sentence description
  - Estimated cost badge
  - Category tag (museum, food, outdoor, etc.)
  - "Choose this" button
- Bottom actions: "Show more alternatives" and "Cancel"
- After choosing: success animation, modal closes, itinerary updates with the new activity highlighted briefly

**Mobile:** Full bottom sheet, cards are full-width stacked vertically

---

## Prompt 7: User Account — Sign Up / Sign In

Design authentication screens for the travel agent app. Modern, visual style.

**Sign Up screen:**
- Split layout (desktop): left side has a beautiful travel photo collage, right side has the form
- Fields: Full name, Email, Password
- Social sign-in buttons: "Continue with Google", "Continue with Apple"
- Divider: "or sign up with email"
- Terms checkbox
- "Create Account" button
- Link: "Already have an account? Sign in"

**Sign In screen:**
- Same split layout
- Fields: Email, Password
- "Forgot password?" link
- Social sign-in buttons
- "Sign In" button
- Link: "New here? Create an account"

**Mobile:** Photo becomes a small hero banner at top, form takes full width below

---

## Prompt 8: User Profile & Preferences

Design a user profile/preferences page that stores travel preferences to personalize future trip planning.

**Profile section:**
- Avatar (uploadable), display name, email
- Home airport / city (used as default origin)
- Passport country (for visa info)

**Travel preferences section (used to pre-fill trip planning):**
- Preferred airlines (multi-select chips: United, Delta, AA, etc.)
- Preferred hotel brands (multi-select chips: Marriott, Hilton, IHG, etc.)
- Lodging style preference (Hotel / Airbnb / Hostel / Resort)
- Transit preferences (toggle chips: "Open to rail travel", "Prefer direct flights", "Budget carrier OK")
- Travel interests (selectable tag grid): History, Food & Wine, Art & Museums, Adventure/Outdoors, Beach & Relaxation, Nightlife, Shopping, Photography, Family-friendly, Off the beaten path
- Budget default (dropdown: Budget / Moderate / Luxury)
- Dietary restrictions (free text, e.g., "vegetarian, gluten-free") — used for food recommendations
- Accessibility needs (free text)

**Notification preferences:**
- Email notifications for shared trips
- Price alerts for saved trips (future feature placeholder)

**Account section:**
- Change password
- Delete account
- Connected accounts (Google, Apple)

---

## Prompt 9: My Trips Dashboard

Design the "My Trips" dashboard — a gallery of the user's saved, in-progress, and past trips.

**Layout:**
- Page title: "My Trips"
- Filter tabs: "All" | "Upcoming" | "Past" | "Drafts" | "Shared with me"
- Search bar to filter trips
- "Plan a new trip" prominent CTA button (top-right)

**Trip cards (grid layout — 3 columns desktop, 1 mobile):**
- Destination hero image as card background
- Trip title overlay: "5 Days in Rome"
- Date range: "Jun 16-20, 2026"
- Status badge: "Complete" (green), "Draft" (yellow), "Planning..." (blue animated)
- Traveler avatars (if shared trip, show collaborator faces)
- Bottom row: budget total, number of days
- Card actions on hover: "View", "Edit", "Duplicate", "Delete", "Share"

**Empty state (no trips yet):**
- Illustration of a suitcase/globe
- "No trips yet! Start planning your first adventure"
- "Plan a Trip" button

**Mobile:** Single column card layout, swipe actions on cards (share, delete)

---

## Prompt 10: Trip Sharing & Collaboration

Design the sharing and collaboration experience for trips.

**Share modal (triggered from itinerary action bar):**
- "Share this trip" header
- Toggle: "Anyone with the link can view" (generates public share link)
- Copy link button with confirmation toast
- "Invite collaborators" section:
  - Email input field with "Invite" button
  - Permission dropdown per invitee: "Can view" / "Can edit" / "Can suggest"
  - List of current collaborators with avatars, names, permission levels, and "Remove" button
- Social share row: icons for email, WhatsApp, iMessage, Twitter/X, copy link
- "Export" section: "Download PDF", "Download Markdown" buttons
- Print-friendly option

**Shared trip view (for non-owners):**
- Same itinerary layout but with a banner: "Shared by [Owner Name]"
- If "Can view": read-only, no edit controls
- If "Can edit": full refinement access
- If "Can suggest": can leave comments/suggestions on activities (comment bubbles on day cards) but not directly edit
- "Save a copy to My Trips" button for viewers

**Comment/suggestion system (for "Can suggest" collaborators):**
- Each day card has a comment icon with count badge
- Clicking opens a comment thread popover
- Comments show avatar, name, timestamp, and text
- Trip owner sees notification badges and can accept/dismiss suggestions

---

## Prompt 11: Public Explore / Inspiration Page

Design a public "Explore" page where users can browse community-shared itineraries and get travel inspiration.

**Layout:**
- Page title: "Explore Destinations"
- Search bar: "Search destinations, trips, or interests..."
- Filter chips: "Popular", "Budget-friendly", "Luxury", "Family", "Solo", "Adventure", "Culture", "Beach"
- Region tabs or map: Europe, Asia, Americas, Africa, Oceania, Middle East

**Content grid:**
- Destination cards (large, visual):
  - Hero destination photo
  - Destination name + country
  - "X shared itineraries" count
  - Average trip cost range
  - Best months to visit
  - Click → destination detail page with all shared itineraries for that destination
- Featured/curated trip cards (smaller, in a carousel):
  - "Staff pick" or "Most popular" badge
  - Trip title, duration, creator avatar
  - Click → shared itinerary view

**Mobile:** Vertical scroll with full-width cards, filter chips are horizontally scrollable

---

## Prompt 12: Responsive Navigation & Global Elements

Design the responsive navigation and global UI elements that persist across all screens.

**Desktop navigation (sticky top bar):**
- Left: Logo/wordmark "Voyager AI"
- Center: "Plan a Trip" (primary CTA button style), "My Trips", "Explore"
- Right: Notification bell (with count badge), User avatar dropdown
  - Dropdown: "My Profile", "Preferences", "My Trips", divider, "Sign Out"

**Mobile navigation:**
- Top bar: hamburger menu (left), logo (center), avatar (right)
- Bottom tab bar (persistent): Home (house icon), Plan (plus/chat icon), My Trips (suitcase icon), Explore (compass icon), Profile (person icon)
- Active tab highlighted with accent color

**Global elements:**
- Toast notifications (bottom-right desktop, top mobile): success, error, info styles
- Loading skeletons for cards and content areas
- Empty states with illustrations for all list views
- 404 page with travel-themed illustration
- Offline indicator banner

**Color palette suggestion:**
- Primary: deep navy (#1a365d)
- Accent: warm coral/orange (#e76f51) for CTAs
- Success: emerald green
- Background: warm off-white (#faf9f6)
- Cards: white with subtle shadow
- Text: dark charcoal

---

## Prompt 13: PDF & Export Preview

Design a print/export preview screen shown before downloading the PDF or markdown.

**Layout:**
- Preview pane (center, 70% width): shows a rendered preview of the PDF output
  - Styled like the actual PDF: cover page with destination photo, trip title, dates
  - Scrollable through all pages: flights table, hotels, day-by-day, budget chart, tips
- Right sidebar controls:
  - Format selector: "PDF" (default) / "Markdown" / "Print"
  - Include/exclude toggles:
    - Flights section
    - Hotels section
    - Weather forecast
    - Budget breakdown
    - Practical tips
    - Rain contingency plans
  - "Download" primary button
  - "Send to email" option
  - "Share link to PDF" option

**Mobile:** Full-screen preview with bottom action bar (download, share, email)

---

## Screen Summary

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Landing / Home | Entry point, hero CTA, popular destinations |
| 2 | Trip Planning Conversation | Chat UI to collect trip details with live summary |
| 3 | Research Loading | Animated progress while 5 agents work in parallel |
| 4 | Itinerary View | Core output — day-by-day, flights, hotels, budget, tips |
| 5 | Refinement Chat | Side panel to modify itinerary via conversation |
| 6 | Activity Swap Modal | Quick alternative suggestions for any activity |
| 7 | Sign Up / Sign In | Authentication screens |
| 8 | User Profile & Preferences | Travel preferences that personalize planning |
| 9 | My Trips Dashboard | Gallery of saved/past/shared trips |
| 10 | Sharing & Collaboration | Share links, invite editors, comments |
| 11 | Explore Page | Browse community trips and destination inspiration |
| 12 | Navigation & Global Elements | Responsive nav, toasts, loading states, color system |
| 13 | Export Preview | PDF/markdown preview with section toggles |
