-- ============================================================================
-- Journal / Blog vertical
-- enums / is_admin() / is_public_visibility() / set_updated_at() are defined in
-- 0001_init.sql. A journal post is a self-contained article (HTML body) rendered
-- on the front Journal index, the home "The Journal" strip, and at /journal/[slug].
-- `related` holds sibling post slugs surfaced in the "More from the Journal" row.
-- ============================================================================

create table if not exists journal_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                  -- routes at /journal/[slug]
  title text not null,
  category text,                              -- category name (the card "tag")
  category_color text,                        -- optional category chip colour
  date_label text,                            -- human label shown on cards ("May 2026")
  published_at date,                          -- structured publish date (admin date picker)
  read_time text,                             -- e.g. "8 min read"
  author text,
  emoji text,                                 -- card + hero icon emoji
  card_gradient text,                         -- card + hero gradient
  hero_bg text,                               -- hero gradient (falls back to card_gradient)
  featured_image_path text,
  excerpt text,                               -- summary shown in listings/previews
  body text,                                  -- rich-text HTML body
  related jsonb not null default '[]',        -- related post slugs (string[])
  featured boolean not null default false,    -- drives the Journal index hero article
  -- SEO
  seo_title text,
  meta_description text,
  focus_keyword text,
  canonical_url text,
  og_image_url text,
  noindex boolean not null default false,
  nofollow boolean not null default false,
  visibility visibility_status not null default 'draft',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_journal_posts_updated before update on journal_posts
  for each row execute function set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table journal_posts enable row level security;

drop policy if exists "journal_public_read" on journal_posts;
create policy "journal_public_read" on journal_posts for select
  using (is_public_visibility(visibility) or is_admin());
drop policy if exists "journal_admin_all" on journal_posts;
create policy "journal_admin_all" on journal_posts for all
  using (is_admin()) with check (is_admin());

-- ── Seed (mirrors the front.js BLOG_POSTS journal articles + grid metadata) ──
insert into journal_posts (slug, title, category, date_label, read_time, author, emoji, card_gradient, hero_bg, excerpt, body, related, featured, display_order, visibility)
values
  ($txt$japan-ski$txt$, $txt$4 months in a Japanese ski resort — the honest version$txt$, $txt$Seasonal Jobs$txt$, $txt$March 2026$txt$, $txt$8 min read$txt$, $txt$Tom W.$txt$, $txt$🏔️$txt$, $txt$linear-gradient(135deg,#1B3A5A,#2E7AA8,#5BA3D9)$txt$, $txt$linear-gradient(135deg,#1B3A5A,#2E7AA8,#5BA3D9)$txt$, $txt$Powder days, staff dorms, and the best decision I made at 26.$txt$, $txt$<p>I'm writing this from a coffee shop in Sapporo, two days before I fly home. My ski pants are hanging on a chair next to me. I have exactly ¥4,200 in my wallet, a deep tan line from my goggles, and approximately zero regrets.</p>
      <p>Four months ago, I left a product management job in Manchester with no plan beyond "get to Hokkaido before the snow melts." Here's what actually happened.</p>

      <h2>How I got the job</h2>
      <p>The honest answer: I applied on a Tuesday afternoon in October, heard back on Thursday, and was on a flight six weeks later. The resort — Niseko United — runs an annual hiring cycle for English-speaking staff. They want people for ski rental, ski school, hospitality, and lift operations. I got ski rental.</p>
      <p>The pay is modest (¥1,050/hour), but the deal includes subsidised staff housing, a season pass, and two free meals a day from the staff canteen. When I actually ran the numbers, I spent about $420 a month on anything beyond food and accommodation. In Manchester, that was three nights out.</p>

      <blockquote>"The mountain opens at 8:30. By 9am you're on a chairlift watching fresh powder catch the light. Nobody has their phone out."</blockquote>

      <h2>The staff dorm reality</h2>
      <p>I won't romanticise the dorm. You're in a room with three other people, the showers are shared, and the walls are thin enough that you know exactly what your Australian neighbour watches on his laptop at midnight.</p>
      <p>But here's the thing: it doesn't matter. You're not in your room. You're on the mountain until 5pm, then you're in someone's kitchen eating instant ramen and planning which run to hit first the next morning. The people become the point. By week three, I had closer friendships than ones I'd had in Manchester for years.</p>

      <div class="blog-highlight">
        <strong>The numbers, honestly:</strong><br>
        Salary: ~¥105,000/month (before tax)<br>
        Housing: ¥15,000/month (subsidised)<br>
        Food: ¥0 (staff canteen, 2 meals/day)<br>
        Actual spend: ~$400/month on everything else<br>
        Season pass value: ¥120,000 — included free
      </div>

      <h2>What nobody warns you about</h2>
      <p><strong>The first two weeks are hard.</strong> You're jet-lagged, your Japanese is zero, you can't read any signs, and the work is physically tiring in a way office jobs aren't. Three people I arrived with left in the first fortnight. I almost did too.</p>
      <p><strong>The language barrier is real but manageable.</strong> Most guests speak English. Most colleagues are international. The locals at the convenience store are patient and kind. A translation app handles 90% of situations. By month two I had enough Japanese to order confidently at any restaurant in town.</p>
      <p><strong>Your skiing will transform.</strong> I came in as an intermediate. I left as someone who genuinely hucks double black diamonds for fun. Six days a week on the mountain does that. It's not subtle.</p>

      <h2>Would I do it again?</h2>
      <p>Without hesitation. The harder question is whether I'd go back to the job I left. I'm sitting here thinking about Japan — about Hokkaido specifically, about the powder mornings and the staff dinners and the weird quiet of a mountain town at 11pm — and I genuinely don't know how to explain to people what it does to you.</p>
      <p>You show up thinking it's a gap year thing. You leave knowing it's a life evidence thing. Evidence that you can go somewhere unfamiliar, build something from nothing, and be fine. Better than fine.</p>
      <p>If you're on the fence: go. Sort the visa first. The rest figures itself out.</p>$txt$, $json$["bali-honest","lisbon-2k","budget-nomad"]$json$::jsonb, true, 1, $txt$published$txt$),
  ($txt$ai-website$txt$, $txt$How to plan your first OutQuest from scratch$txt$, $txt$Quest Planning$txt$, $txt$April 2026$txt$, $txt$6 min read$txt$, $txt$OutQuest$txt$, $txt$🌐$txt$, $txt$linear-gradient(135deg,#1A2A4A,#2A5A8A,#4A8AC0)$txt$, $txt$linear-gradient(135deg,#1A2A4A,#2A5A8A,#4A8AC0)$txt$, $txt$$txt$, $txt$<p>Most people who want to do something like this spend six months researching and never leave. Here's the shortest path from "I want to do something different" to actually being somewhere different.</p>

      <h2>Step 1: Pick one thing</h2>
      <p>The biggest trap is researching everywhere at once. Bangkok vs Lisbon vs Bali vs Mexico City. Ski season vs surf teaching vs freelance vs gap year. If you're researching more than two options at once, you're in avoidance mode.</p>
      <p>Pick one. The one that gives you the lowest-grade anxiety when you imagine telling someone you're doing it. That's the one. Research that, and only that, until you've either booked it or definitively ruled it out.</p>

      <h2>Step 2: Identify the one blocker</h2>
      <p>There's always one real blocker and several imaginary ones. The imaginary ones are: "I don't have enough money," "I don't know anyone there," "I need to sort my career first." These dissolve the moment you're on the other side.</p>
      <p>The real blockers are usually: visa eligibility, job or income situation, a genuine commitment you can't move. Identify the real one. Solve only that. Everything else follows.</p>

      <blockquote>"The most common reason people don't go is not money. It's the lack of a specific date on a calendar."</blockquote>

      <h2>Step 3: Set a date</h2>
      <p>This is the most important step. Not a vague "in the next few months." A specific date. The date changes everything — it converts the abstract desire into a logistics problem, and humans are good at solving logistics problems once they've committed to the goal.</p>

      <h2>Step 4: Tell one person</h2>
      <p>Tell one person you trust. Not for permission — for accountability. Something shifts when you've said it out loud to another human being. Internally it's easy to quietly un-decide. Externally it's much harder.</p>

      <h2>Step 5: Do one concrete thing today</h2>
      <p>Check your passport expiry. Look up the visa requirements. Find out how much a flight costs right now. One concrete action today is worth a hundred more hours of research. The momentum is the point.</p>$txt$, $json$["japan-ski","best-countries","budget-nomad"]$json$::jsonb, false, 2, $txt$published$txt$),
  ($txt$domain-nomad$txt$, $txt$What is a digital nomad visa and why it matters$txt$, $txt$Move Abroad$txt$, $txt$March 2026$txt$, $txt$5 min read$txt$, $txt$OutQuest$txt$, $txt$🌍$txt$, $txt$linear-gradient(135deg,#3A1A5A,#7A3A9A,#B060D0)$txt$, $txt$linear-gradient(135deg,#3A1A5A,#7A3A9A,#B060D0)$txt$, $txt$$txt$, $txt$<p>A digital nomad visa is a legal status that lets you live in a foreign country while working remotely for clients or employers outside that country. It's not a work permit — you can't use it to work for local companies. It's specifically for location-independent workers.</p>

      <h2>Why they exist</h2>
      <p>Countries started creating these visas around 2020–2022, partly as post-pandemic economic recovery tools, partly because the number of remote workers had made the legal grey area impossible to ignore. Before nomad visas, most remote workers lived abroad on tourist visas — technically legal for short periods but precarious for longer stays.</p>

      <h2>How they work</h2>
      <p>Most digital nomad visas require: proof of remote employment or freelance income above a threshold (usually $2,000–$3,500/month), health insurance valid in that country, and a clean criminal record. They're typically valid for 1–2 years and renewable.</p>

      <blockquote>"The visa is not the goal. It's the infrastructure that lets you pursue the goal safely and legally."</blockquote>

      <h2>Which countries have the best ones in 2026</h2>
      <p>Thailand's LTR Visa (10 years, tax benefits), Bali's Digital Nomad Visa (5 years, tax-free), Portugal's D8 (2 years, EU access), Colombia's Nomad Visa (2 years), Georgia (1 year, 1% tax), and Estonia (1 year, EU Schengen access) are currently considered the strongest options.</p>

      <h2>Do you need one?</h2>
      <p>Not always. Many countries allow 90–180 days visa-free for most Western passports. For stays under 3 months, you often don't need a nomad visa at all. They become important when you want to stay longer, have legal clarity, or access local banking and services.</p>$txt$, $json$["best-countries","lisbon-2k","budget-nomad"]$json$::jsonb, false, 3, $txt$published$txt$),
  ($txt$bali-honest$txt$, $txt$What it's actually like to teach surf in Bali$txt$, $txt$Seasonal Jobs$txt$, $txt$April 2026$txt$, $txt$6 min read$txt$, $txt$Erin M.$txt$, $txt$🏄$txt$, $txt$linear-gradient(135deg,#0A2A1A,#1A7A3A,#50C070)$txt$, $txt$linear-gradient(135deg,#0A2A1A,#1A7A3A,#50C070)$txt$, $txt$$txt$, $txt$<p>People imagine teaching surf in Bali as a permanent holiday. It's not. It's a job — a good one, with a remarkable setting, but a job. Here's the unfiltered version.</p>

      <h2>The daily reality</h2>
      <p>6am wake-up. You're at the beach by 6:30 to set up boards and read the conditions. First lesson starts at 7. You teach until noon — sometimes 5 hours straight if the school is busy. Then you're free. That's the deal.</p>
      <p>Physically, it's demanding. You're in the water for four to five hours carrying boards, supporting students, and paddling constantly. The equatorial sun is relentless. By week two you've either built the stamina for it or you've quit. Most people build the stamina.</p>

      <blockquote>"By 8am he's standing up. You've done something real. Then you're free. You eat a $2 nasi goreng and rent a scooter for $5/day."</blockquote>

      <h2>The certification question</h2>
      <p>You need one. An ISA Level 1 Surf Instructor certificate is the minimum for any licensed school in Bali. The unlicensed operations on Kuta beach are being systematically shut down by Indonesian authorities. Don't build a plan around those.</p>
      <p>The ISA cert takes 2 weeks and costs around $900. It covers pedagogy, ocean safety, and first aid. Most good Canggu surf schools will hire you directly after certification — some run their own in-house training programs.</p>

      <div class="blog-highlight">
        <strong>Teaching surf income and costs (Canggu):</strong><br>
        Lesson income: $10–$20/lesson (3–6 lessons/day)<br>
        Monthly income: $900–$2,400 depending on season<br>
        Villa rent: $300–$500/month (private, with pool)<br>
        Food: $150–$250/month<br>
        Scooter: $5/day or $60/month rental<br>
        Net after costs: $300–$1,500/month
      </div>

      <h2>What makes it worth it</h2>
      <p>It's not the money. The money is enough to live on extremely well in Bali but it's not life-changing income. What makes it worth it is the combination of daily physical achievement, beautiful environment, and the kind of community you can't manufacture.</p>
      <p>Surf schools in Canggu attract people who are curious, adventurous, and not particularly interested in the conventional path. Two months in, those people become your closest friends. The Bali experience is really a people experience dressed in sunshine.</p>$txt$, $json$["japan-ski","budget-nomad","best-countries"]$json$::jsonb, false, 4, $txt$published$txt$),
  ($txt$freelance-6mo$txt$, $txt$How I went from £28k salary to freelancing in 6 months$txt$, $txt$Upgrade Your Life$txt$, $txt$January 2026$txt$, $txt$9 min read$txt$, $txt$James K.$txt$, $txt$💻$txt$, $txt$linear-gradient(135deg,#3A1A42,#8A3A8A,#C060C0)$txt$, $txt$linear-gradient(135deg,#3A1A42,#8A3A8A,#C060C0)$txt$, $txt$The skill I learned. The clients I found. The exact path.$txt$, $txt$<p>Six months ago I was earning £28,000 a year as a junior UX designer, commuting 90 minutes each way, and Googling "how to go freelance" at 11pm on Sunday nights. Today I'm earning more than double that, working from wherever I want, and the commute is 8 steps to my desk.</p>
      <p>Here's the exact path — not the highlights reel, the actual steps.</p>

      <h2>Month 1–2: build proof, not a portfolio</h2>
      <p>Most advice says "build a portfolio." My advice: build proof. There's a difference. A portfolio is a PDF of your past work. Proof is evidence that you can solve a specific problem for a specific type of client.</p>
      <p>I picked a niche (SaaS onboarding UX) and did three speculative redesigns of real products — unpaid, just to build case studies. Each one documented the problem, my process, and the outcome I expected. By month two I had three strong case studies for a niche with real budget.</p>

      <blockquote>"The best freelancers don't have broader portfolios. They have sharper positioning. Pick a lane and own it completely."</blockquote>

      <h2>Month 3: the first client</h2>
      <p>First client came from LinkedIn. I'd been posting about onboarding UX — not "look at my work" posts, but genuine observations about products I was using. One post about Notion's onboarding got 4,000 views. A founder of a B2B SaaS tool DMed me asking if I did consulting.</p>
      <p>I said yes. I quoted £800 for a 2-week audit. They accepted immediately, which in retrospect meant I underpriced. I delivered, they gave me a testimonial, and I raised my rates.</p>

      <div class="blog-highlight">
        <strong>Income progression (honest version):</strong><br>
        Month 1: £0 (building)<br>
        Month 2: £0 (still building)<br>
        Month 3: £800 (first client)<br>
        Month 4: £2,200 (two clients, one retainer)<br>
        Month 5: £3,800 (three clients)<br>
        Month 6: £5,100 (four clients, raised rates)<br>
        Month 6 annualised: £61,200
      </div>

      <h2>What actually made the difference</h2>
      <p><strong>Niche first, expand later.</strong> "UX designer" is a commodity. "Onboarding UX for SaaS" is a specialist. The niche made my LinkedIn content shareable to the exact people who would hire me.</p>
      <p><strong>Outreach that doesn't feel like outreach.</strong> I spent 20 minutes a day commenting genuinely on posts from founders in my niche. Not "great post!" — actual observations, additions, disagreements. Three of my five clients came from this before they ever saw my portfolio.</p>
      <p><strong>A retainer from month four.</strong> One client asked if I could be on call for £1,500/month for 10 hours. I said yes. That became my floor — the money that covered rent regardless of what else happened. Once you have a floor, the anxiety drops by 80%.</p>

      <h2>What I'd do differently</h2>
      <p>Raise rates faster. I spent months 3 and 4 at rates that were fair but not premium. The clients who pushed back hardest on price were the most difficult to work with. The ones who paid without negotiating were almost always the best projects. Price filters for quality.</p>
      <p>If you're in a job thinking about this: you have more runway than you think. Build the proof. Post about the niche. Get one client before you quit. Then quit.</p>$txt$, $json$["web-design-life","budget-nomad","lisbon-2k"]$json$::jsonb, false, 5, $txt$published$txt$),
  ($txt$lisbon-2k$txt$, $txt$I moved to Lisbon with €2,000. Here's what happened.$txt$, $txt$Move Abroad$txt$, $txt$February 2026$txt$, $txt$7 min read$txt$, $txt$Maya R.$txt$, $txt$🌿$txt$, $txt$linear-gradient(135deg,#1A3A0A,#3A8A1A,#70C040)$txt$, $txt$linear-gradient(135deg,#1A3A0A,#3A8A1A,#70C040)$txt$, $txt$Spoiler: I'm still here. The visa was easier than I thought.$txt$, $txt$<p>People kept telling me I needed at least €5,000 to move abroad properly. I had €2,000 and a job interview scheduled for two weeks after landing. I booked the flight anyway.</p>
      <p>That was seven months ago. I'm still here. I have a flat in Mouraria, a group of friends who are actually interesting, and a salary in euros that covers everything with room to spare. Here's what the €2,000 actually got me, and what I'd do differently.</p>

      <h2>Month one: the scramble</h2>
      <p>First week: hostel (€18/night, not the worst). Second week: Airbnb in someone's spare room while I hunted for a flat. Third week: found a room in a shared apartment in Arroios for €550/month including bills. That's when things stabilised.</p>
      <p>The job interview went well. I started three weeks after arriving. The Portuguese bureaucracy for the NHR visa took longer than expected — about 6 weeks for the tax number, another 4 for the residence permit. But nothing stopped me from working remotely during that period.</p>

      <blockquote>"Lisbon is a city that rewards patience. The first month tests you. By month three, you wonder how you ever lived anywhere else."</blockquote>

      <h2>The visa reality</h2>
      <p>Portugal's D8 digital nomad visa is genuinely good if you earn over €3,040/month (4x minimum wage). Below that, you're on a tourist visa until you qualify — which for most people means getting a remote job or freelance income first, then applying.</p>
      <p>I went in on a tourist visa, got the job, hit the income threshold, and applied for the D8 from inside Portugal. This works. Lisbon's immigration office is backed up by months, but the process itself is straightforward if your documents are clean.</p>

      <div class="blog-highlight">
        <strong>My actual monthly costs in Lisbon (Arroios, shared flat):</strong><br>
        Rent (room): €550 incl. bills<br>
        Food: €200 (cooking mostly, eating out ~3x/week)<br>
        Transport: €40 (metro pass)<br>
        Coffee shops / coworking: €60<br>
        Social / going out: €120<br>
        <strong>Total: ~€970/month</strong>
      </div>

      <h2>What I got wrong</h2>
      <p><strong>I underestimated the language barrier.</strong> Not for daily life — English is everywhere in Lisbon — but for bureaucracy. Every official form is in Portuguese. Every email from immigration is in Portuguese. Google Translate handles 80% of it but the 20% it gets wrong is always the important part.</p>
      <p><strong>I expected to be lonely.</strong> I wasn't. Lisbon has a huge expat and nomad community. Meetup.com, Facebook groups, and the coworking spaces are genuinely good for meeting people. I had a proper social life within six weeks.</p>

      <h2>Seven months in</h2>
      <p>I renewed my stay. I got a pay rise. I found a better flat. The €2,000 was enough to get started — it wasn't comfortable, but it was enough. If I were doing it again I'd have €3,000, mostly because the bureaucracy period where you're waiting on visa paperwork is the moment you most want a buffer.</p>
      <p>But the honest answer is: you don't need as much as people tell you. You need to go first and figure it out second. Lisbon rewards that.</p>$txt$, $json$["best-countries","budget-nomad","japan-ski"]$json$::jsonb, false, 6, $txt$published$txt$),
  ($txt$budget-nomad$txt$, $txt$Living on $1,000 a month abroad: the real numbers$txt$, $txt$Budget & Money$txt$, $txt$March 2026$txt$, $txt$7 min read$txt$, $txt$Priya S.$txt$, $txt$💰$txt$, $txt$linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)$txt$, $txt$linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)$txt$, $txt$$txt$, $txt$<p>Every "living abroad cheap" article I read before I left was either aspirational nonsense or 10 years out of date. Here are the actual numbers from 12 months across Bangkok, Chiang Mai, and Medellín.</p>

      <h2>Bangkok: $1,050/month</h2>
      <p>This is a comfortable life. Not a budget life — comfortable. Air-conditioned studio apartment near BTS Skytrain, gym membership, eating out twice a day (street food and one restaurant meal), gym, occasional Grab taxi, phone plan, and co-working 3 days a week.</p>
      <div class="blog-highlight">
        Rent: $550 (Sukhumvit studio, all-in)<br>
        Food: $200 (street food + occasional restaurant)<br>
        Transport: $60 (Grab + BTS top-up)<br>
        Gym: $30/month<br>
        Co-working 3x/week: $80<br>
        Misc: $130<br>
        <strong>Total: $1,050</strong>
      </div>

      <h2>Chiang Mai: $780/month</h2>
      <p>Cheaper, quieter, better coffee, worse nightlife. For focused work months, Chiang Mai is elite. The co-working scene (CAMP, MANA) is excellent. The cost of living drops significantly outside of tourist accommodation.</p>

      <h2>Medellín: $900/month</h2>
      <p>Colombia surprised me. El Poblado is walkable, the food is incredible, and a private apartment with a pool ran me $480. The nightlife is genuinely good if that matters to you. The city has improved enormously in safety in the last decade — the tourist warnings are 15 years out of date.</p>

      <h2>What the $1,000 myth misses</h2>
      <p>You can live on $1,000 a month in Southeast Asia. But your setup costs are separate: flights, first month deposit, SIM card, any gear you need. Budget $2,500–$3,000 total to get started comfortably. The $1,000/month figure only applies once you're settled.</p>$txt$, $json$["lisbon-2k","best-countries","japan-ski"]$json$::jsonb, false, 7, $txt$published$txt$),
  ($txt$web-design-life$txt$, $txt$Learning web design changed my life — and took 3 months$txt$, $txt$Upgrade Your Life$txt$, $txt$February 2026$txt$, $txt$6 min read$txt$, $txt$Chloe T.$txt$, $txt$⚡$txt$, $txt$linear-gradient(135deg,#0A1A3A,#1A4A8A,#4080D0)$txt$, $txt$linear-gradient(135deg,#0A1A3A,#1A4A8A,#4080D0)$txt$, $txt$$txt$, $txt$<p>I want to be precise about the timeline because people always round up: it was 11 weeks from opening my first Figma file to invoicing my first client. Not 6 months. Not a year. Eleven weeks.</p>

      <h2>Why web design specifically</h2>
      <p>Low barrier to entry (free tools), high demand (every business needs a website), remote-friendly by default, and you can see the output of your work immediately. It's one of the fastest skills to go from zero to paid work.</p>
      <p>I chose it because I could learn it on evenings and weekends without quitting my job first. I wanted to prove to myself it was viable before making any financial decisions.</p>

      <blockquote>"Week 11. Client brief landed in my inbox. £650 for a 4-page site. I said yes before I finished reading the email."</blockquote>

      <h2>The actual learning path</h2>
      <p><strong>Weeks 1–3: Figma fundamentals.</strong> YouTube tutorials, copying existing websites I liked, learning the vocabulary (frames, auto-layout, components). Free. Took about 2 hours a day.</p>
      <p><strong>Weeks 4–6: Webflow.</strong> The platform most professional freelance designers use. Has a learning curve but once it clicks, you can build almost anything without code. Free tier is enough to learn.</p>
      <p><strong>Weeks 7–9: Build spec projects.</strong> I redesigned three websites I genuinely thought were poor — a local restaurant, a freelance photographer, a yoga studio. Documented everything. That became my portfolio.</p>
      <p><strong>Weeks 10–11: Outreach.</strong> Posted my work on LinkedIn and in local business Facebook groups. Offered a free 30-minute "website review call" to local small businesses. Six people took me up on it. Two became clients.</p>

      <h2>What I'd tell someone starting today</h2>
      <p>Don't wait until you're "ready." You'll never feel ready. The confidence comes from doing paid work, not from more tutorials. The point of the spec projects isn't to perfect your skills — it's to have something to show a client. Ship early. Charge less than you'll later think you're worth. Learn from the work.</p>$txt$, $json$["freelance-6mo","budget-nomad","ai-website"]$json$::jsonb, false, 8, $txt$published$txt$),
  ($txt$landing-page-life$txt$, $txt$How to build a life you don't need a vacation from$txt$, $txt$Lifestyle Design$txt$, $txt$January 2026$txt$, $txt$5 min read$txt$, $txt$OutQuest$txt$, $txt$🏡$txt$, $txt$linear-gradient(135deg,#2A2A0A,#7A7A0A,#C0C020)$txt$, $txt$linear-gradient(135deg,#2A2A0A,#7A7A0A,#C0C020)$txt$, $txt$$txt$, $txt$<p>The phrase "build a life you don't need a vacation from" gets thrown around a lot. But most people who say it are selling something. Here's what it actually means in practice.</p>

      <h2>The vacation problem</h2>
      <p>Vacations exist because the baseline is bad enough that you need a break from it. Two weeks in Ibiza. A long weekend somewhere nice. The break is the point. But the break ends, and you're back.</p>
      <p>The alternative isn't to never take a break — breaks are good, decompression is useful. The alternative is to reduce the gap between the break and the baseline. To make the baseline better.</p>

      <blockquote>"You don't need to love every Monday. You need to stop dreading them."</blockquote>

      <h2>What actually changes the baseline</h2>
      <p>Not location alone. Not income alone. The three things that consistently change the baseline: autonomy (control over your time), environment (where and how you live day-to-day), and community (the quality of the people around you).</p>
      <p>Most conventional careers offer limited autonomy, a default environment you didn't choose, and a community assembled by HR rather than by affinity. OutQuests are designed to change all three simultaneously — not permanently, but enough to show you what's possible.</p>

      <h2>The experiment mindset</h2>
      <p>You don't have to commit to anything permanently. A 3-month ski season doesn't mean you're becoming a ski instructor forever. It means you're running a 3-month experiment in a radically different version of your life.</p>
      <p>Most people who do these experiments don't want to go back. Some do — and that's fine too. What they all gain is the evidence that the baseline can be different. That turns the abstract desire ("I want more") into a concrete problem ("here's what I need to change").</p>$txt$, $json$["japan-ski","freelance-6mo","best-countries"]$json$::jsonb, false, 9, $txt$published$txt$),
  ($txt$best-countries$txt$, $txt$The 8 best countries for digital nomads in 2026$txt$, $txt$Move Abroad$txt$, $txt$April 2026$txt$, $txt$10 min read$txt$, $txt$OutQuest$txt$, $txt$✈️$txt$, $txt$linear-gradient(135deg,#1A0A3A,#4A1A8A,#9050E0)$txt$, $txt$linear-gradient(135deg,#1A0A3A,#4A1A8A,#9050E0)$txt$, $txt$$txt$, $txt$<p>The digital nomad visa landscape has changed dramatically since 2022. Here are the eight countries that consistently rank best for remote workers in 2026 — based on visa access, cost of living, infrastructure, and community.</p>

      <h2>1. Thailand — Best overall</h2>
      <p>The LTR (Long-Term Resident) visa is one of the world's best nomad visas: 10-year renewable, tax benefits for qualified applicants, and Bangkok is arguably the world's best city for the cost-to-quality ratio of daily life. Infrastructure is excellent. Community is enormous.</p>

      <h2>2. Portugal — Best in Europe</h2>
      <p>The D8 digital nomad visa is accessible, Lisbon and Porto are genuinely world-class cities, and the NHR tax regime (now NHR 2.0) offers tax advantages for qualifying foreign-source income. The main drawback: Lisbon has gotten expensive relative to 2020.</p>

      <h2>3. Indonesia (Bali) — Best for lifestyle</h2>
      <p>Bali's Digital Nomad Visa (E33G) is a 5-year renewable visa for remote workers earning over $2,000/month from foreign sources. Zero Indonesian income tax. The lifestyle — warm, outdoor, social — is unmatched anywhere in the world at that price point.</p>

      <h2>4. Colombia — Best value in Latin America</h2>
      <p>Medellín specifically. The Digital Nomad Visa requires proof of income of 3x the minimum wage (~$900/month). Medellín has warm weather year-round, a growing tech scene, excellent coffee, and living costs significantly below European or North American equivalents.</p>

      <h2>5. Georgia — Best tax situation</h2>
      <p>Georgia offers a "Remotely from Georgia" programme with a 1% flat income tax rate for qualifying remote workers. Tbilisi is cheap, chaotic in a good way, and has a surprisingly excellent food and wine scene. Visa-free for most nationalities for 365 days.</p>

      <div class="blog-highlight">
        <strong>Quick comparison (estimated monthly costs, comfortable lifestyle):</strong><br>
        Bangkok, Thailand: $1,000–$1,600<br>
        Lisbon, Portugal: €1,400–€2,200<br>
        Bali, Indonesia: $800–$1,400<br>
        Medellín, Colombia: $900–$1,500<br>
        Tbilisi, Georgia: $700–$1,200
      </div>

      <h2>6. Mexico (Mexico City) — Best for North Americans</h2>
      <p>No digital nomad visa needed — tourist permits allow 180 days and are renewble with a border run. CDMX has world-class food, culture, and infrastructure at 40–50% less cost than equivalent US cities. The time zone alignment with North American clients is a significant practical advantage.</p>

      <h2>7. Japan — Best for culture immersion</h2>
      <p>Japan's Working Holiday Visa covers 30+ nationalities aged 18–30, and the new Digital Nomad Visa covers earners above ¥10M/year from overseas sources. Japan costs more than Southeast Asia but delivers a quality of life and depth of cultural experience that has no equivalent.</p>

      <h2>8. Estonia — Best for EU access</h2>
      <p>Estonia's Digital Nomad Visa grants access to the EU Schengen Zone and is valid for 12 months. Tallinn is beautiful, English-speaking, and highly digital — Estonia has more startups per capita than almost any country on earth. Good if EU residency is part of the longer-term plan.</p>$txt$, $json$["lisbon-2k","budget-nomad","bali-honest"]$json$::jsonb, false, 10, $txt$published$txt$)
on conflict (slug) do nothing;
