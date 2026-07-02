// ===== script block 1 =====
const QUESTS={
  japan:{slides:['linear-gradient(160deg,#0A1830,#1A4A8A,#5BA3D9)','linear-gradient(160deg,#0D2610,#1A5E2A,#4A9C5A)','linear-gradient(160deg,#1A0A2E,#3A1A6B,#7B4AC4)','linear-gradient(160deg,#2E1200,#8A3A0A,#D4700A)'],arts:['🏔️','⛷️','🌨️','🍜'],level:'Epic Quest',budget:'$$ Mid Budget',monthlyBudget:'$1,200 – $2,200',bestTime:'Nov – Mar',duration:'3–5 Months',title:'Work a ski season in Japan',tagline:'Live at altitude, earn your keep on the slopes, and spend your days in powder. Japan\'s ski resorts are hiring — and life up here is something else.',unlocks:[{i:'🌐',t:'Location independence proof',p:'You\'ll prove you can live and thrive anywhere in the world.'},{i:'📚',t:'Lower cost of living',p:'Hokkaido resort towns offer affordable housing, cheap food, and a life cheaper than city rent.'},{i:'🤝',t:'Global network',p:'Season workers form tight-knit international communities. You\'ll leave with friends in 20 countries.'},{i:'🧠',t:'Deep cultural immersion',p:'Living in a small Japanese mountain town is different from Tokyo tourism.'},{i:'📖',t:'A story worth telling',p:'You won\'t be giving the "fine, work was busy" answer at dinner parties anymore.'},{i:'🎿',t:'World-class skiing',p:'Niseko has some of the world\'s best powder. You\'ll ski more than most in a lifetime.'}],immersive:'You wake up at 6am in a staff dorm that smells like pine and last night\'s ramen. The mountain opens at 8:30. By 9am you\'re on a chairlift watching fresh powder catch the light. You work the afternoon shift and by evening you\'re in a tiny izakaya with half a dozen people from Australia, France, and somewhere in Canada. Nobody has their phone out. You didn\'t plan to stay the whole season. But you will.',path:[{t:'Check your eligibility and visa route',p:'Japan\'s Working Holiday Visa is available to many nationalities aged 18–30. If you don\'t qualify, there are Seasonal Worker routes.'},{t:'Secure your income or savings target',p:'Most resort jobs pay ¥900–1,200/hr. Budget ¥300,000 as your arrival fund. Some jobs provide housing — filter for these first.'},{t:'Book flights and short-term housing',p:'Arrive in October or November before season begins. Book 2 weeks of short-term accommodation while you find your permanent place.'},{t:'Set up your SIM, banking, and essentials',p:'IIJmio or Mineo for SIM. Open a Japan Post Bank account. Get a Suica card. Sort these in your first week.'},{t:'Plug into the local community',p:'Niseko and Hakuba both have strong expat communities. Find the Facebook groups and attend the pre-season gatherings.'}],embark:[{t:'Sort your visa',p:'Apply for a Working Holiday visa at your nearest Japanese embassy'},{t:'Find housing',p:'Browse open resort roles on ski-japan.com or direct resort career pages'},{t:'Set up workspace',p:'Pocket WiFi + noise-cancelling headphones + power bank. Remote-ready from day one.'},{t:'Join community',p:'Connect with Niseko Noticeboard and Hakuba Valley Network before you land'}],prep:[{i:'🎿',bg:'linear-gradient(135deg,#1B3A5A,#2E6A9A)',t:'All-mountain ski jacket & shell layers',btn:'Shop Deal',dealPage:'ski-jacket'},{i:'📶',bg:'linear-gradient(135deg,#1A3A0A,#2A7A1A)',t:'Japan pocket WiFi — 6-month plan',btn:'Get Connected',dealPage:'japan-wifi'},{i:'🗺️',bg:'linear-gradient(135deg,#3A1A0A,#7A3A0A)',t:'Working Holiday visa guide — Japan',btn:'Read Guide',dealPage:'japan-visa-guide'},{i:'💻',bg:'linear-gradient(135deg,#1A1A4A,#3A3A8A)',t:'Portable power bank + travel adapter',btn:'Shop Deal',dealPage:'power-bank'},{i:'🏥',bg:'linear-gradient(135deg,#3A0A1A,#7A1A3A)',t:'Long-stay travel insurance — 6 months',btn:'Get Covered',dealPage:'worldnomads'},{i:'📖',bg:'linear-gradient(135deg,#0A2A1A,#1A6A3A)',t:'Japanese for beginners — Duolingo Plus',btn:'Start Learning',dealPage:'duolingo'},{i:'🏔️',bg:'linear-gradient(135deg,#0A1A3A,#2A4A7A)',t:'Ski boot bag & gear organiser',btn:'Shop Deal',dealPage:'ski-jacket'},{i:'🧤',bg:'linear-gradient(135deg,#2A0A0A,#6A1A1A)',t:'Waterproof gloves & base layers',btn:'Shop Deal',dealPage:'ski-jacket'},{i:'🎧',bg:'linear-gradient(135deg,#1A1A2A,#3A3A5A)',t:'Noise-cancelling headphones',btn:'Shop Deal',dealPage:'power-bank'}],faq:[{q:'Do I need to speak Japanese?',a:'Not at all. Most resorts in Niseko and Hakuba operate heavily in English. A few phrases earn respect but it\'s not required.'},{q:'How much money do I need to start?',a:'We recommend ¥300,000–¥500,000 (~$2,000–$3,500 USD) as a safety buffer. Most resort packages include housing and meals.'},{q:'What\'s the Working Holiday Visa process like?',a:'Japan offers WHV to citizens of 30+ countries aged 18–30. Most people receive approval within 1–2 weeks online.'},{q:'Can I do this if I work remotely?',a:'Yes, and many people do. Pocket WiFi in Japan is fast and reliable. You can pair a part-time resort role with existing remote work.'},{q:'When does the ski season run?',a:'Late November to late March. Hokkaido opens first. The best powder months are January and February.'}],similar:[{id:'bali',bg:'linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)',art:'🏄',badge:'Boss Quest',title:'Surf instructor in Bali',meta:'1–6 months · Bali'},{id:'france',bg:'linear-gradient(170deg,#2A0A1A,#7A1A3A,#E050A0)',art:'🍷',badge:'Epic Quest',title:'Grape harvest in France',meta:'6–8 weeks · Bordeaux'},{id:'moto',bg:'linear-gradient(170deg,#0A1A3A,#1A3A8A,#50A0FF)',art:'🏍️',badge:'Legendary',title:'Travel Europe by motorcycle',meta:'2–4 months · Europe'}],lifeDirections:['newlife'],outcomeGoals:['gain-experience','meet-people','adventure']},
  bangkok:{slides:['linear-gradient(160deg,#2A1A0A,#8A3A0A,#E88030)','linear-gradient(160deg,#0A1A2A,#1A4A6A,#40A0C0)','linear-gradient(160deg,#1A0A0A,#5A1A1A,#C04040)','linear-gradient(160deg,#0A2A0A,#1A6A2A,#40C060)'],arts:['🏙️','🛺','🌅','🍜'],level:'Starter Quest',budget:'$ Lean Budget',monthlyBudget:'$1,000 – $1,800',bestTime:'Nov – Feb',duration:'Long-term',title:'Move to Bangkok TH',tagline:'Bangkok rewards the curious and punishes the hesitant. Once you\'re in, you\'ll wonder why it took you so long.',unlocks:[{i:'🌐',t:'Location independence',p:'Prove to yourself you can live and thrive anywhere in the world.'},{i:'💰',t:'Lower cost of living',p:'World-class city life at a fraction of London or New York costs.'},{i:'🤝',t:'Global nomad network',p:'Bangkok has one of the world\'s most active digital nomad communities.'},{i:'🍜',t:'Food culture immersion',p:'The best street food on the planet. Every meal is an event.'},{i:'✈️',t:'Central hub',p:'3 hours from Bali, Chiang Mai, Vietnam, Japan. The world gets smaller.'},{i:'🏙️',t:'Big city energy',p:'Rooftop bars, world-class gyms, Michelin restaurants. This is not roughing it.'}],immersive:'You move in on a tourist visa, find a serviced apartment in Sukhumvit for $600/month, and realise within a week that everyone else has been lying to you about what life can cost. Your gym is $30/month. Your commute is a motorbike taxi. You eat Pad See Ew for breakfast and work from a co-working space that makes your old office look embarrassing. You\'ll extend your visa once. Then again.',path:[{t:'Sort your visa path',p:'Thailand offers tourist visas, LTR visas, and education visas. We\'ll match you to the right one based on your situation.'},{t:'Find housing',p:'From serviced apartments in Sukhumvit to local condos in Silom — curated options for every budget and vibe.'},{t:'Set up essentials',p:'SIM card, bank account, health insurance, and a co-working space. We have deals for all of it.'},{t:'Start living & working',p:'Join the Bangkok nomad community, explore the neighbourhood, and settle into your new life.'}],embark:[{t:'Sort your visa',p:'Apply for a TR visa or LTR visa at the Thai consulate in your country'},{t:'Find a place',p:'Browse our curated Sukhumvit and Silom apartment shortlist'},{t:'Set up workspace',p:'True Move H SIM + Bangkok Bank account + co-working day pass'},{t:'Join community',p:'Bangkok Digital Nomads Facebook group has 40,000+ members'}],prep:[{i:'💼',bg:'linear-gradient(135deg,#1A2A4A,#2A4A7A)',t:'Thailand LTR visa application pack',btn:'Get Access',dealPage:'thailand-visa'},{i:'🏠',bg:'linear-gradient(135deg,#2A1A0A,#6A3A0A)',t:'Curated Sukhumvit apartments — under $800',btn:'Browse Listings',dealPage:'bkk-apartments'},{i:'📶',bg:'linear-gradient(135deg,#0A2A1A,#1A6A2A)',t:'True Move H tourist SIM — 90 days',btn:'Shop Deal',dealPage:'truemove-sim'},{i:'💻',bg:'linear-gradient(135deg,#2A0A2A,#6A1A6A)',t:'Co-working day pass bundle — Bangkok',btn:'View Deal',dealPage:'hubba'},{i:'🏥',bg:'linear-gradient(135deg,#3A0A0A,#7A1A1A)',t:'International health insurance — Thailand',btn:'Get Covered',dealPage:'cigna-insurance'},{i:'🌏',bg:'linear-gradient(135deg,#0A1A3A,#1A3A7A)',t:'Bangkok neighbourhood guide — PDF',btn:'Download Free',dealPage:'bkk-guide'},{i:'🏦',bg:'linear-gradient(135deg,#1A2A1A,#3A5A2A)',t:'Bangkok Bank account setup guide',btn:'Read Guide',dealPage:'bkk-guide'},{i:'🛺',bg:'linear-gradient(135deg,#2A1A0A,#5A3A0A)',t:'Grab & local transport essentials',btn:'Get the Guide',dealPage:'bkk-guide'},{i:'☀️',bg:'linear-gradient(135deg,#3A2A0A,#7A5A0A)',t:'Lightweight travel daypack',btn:'Shop Deal',dealPage:'power-bank'}],faq:[{q:'Do I need a work permit?',a:'If you\'re working remotely for a foreign company, you technically don\'t need one. Thailand\'s LTR visa makes this fully legal.'},{q:'Is Bangkok safe?',a:'Very. Bangkok consistently ranks as one of the safer major Asian cities for expats.'},{q:'What\'s the cost of living really like?',a:'A comfortable life runs $1,200–$1,800/month including a nice apartment, food, gym, and transport.'},{q:'How do I get a bank account?',a:'Bangkok Bank and Kasikorn Bank are the easiest for foreigners. Takes about an hour with your passport.'},{q:'What visa should I use?',a:'Start with a tourist visa (TR) for the first 3 months. Then look at the LTR (Long-Term Resident) visa if you want to stay longer.'}],similar:[{id:'lisbon',bg:'linear-gradient(170deg,#1A0A2A,#4A1A7A,#A060E0)',art:'🏛️',badge:'Boss Quest',title:'Move to Lisbon',meta:'Long-term · Portugal'},{id:'japan',bg:'linear-gradient(170deg,#0A2A44,#1A5A8A,#4ABCD4)',art:'🏔️',badge:'Epic Quest',title:'Ski season in Japan',meta:'3–5 months · Hokkaido'},{id:'bali',bg:'linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)',art:'🏄',badge:'Boss Quest',title:'Surf instructor in Bali',meta:'1–6 months · Bali'}],lifeDirections:['abroad'],outcomeGoals:['relocate','earn-income','explore-path']},
  bali:{slides:['linear-gradient(160deg,#0A2A1A,#1A6A3A,#60C860)','linear-gradient(160deg,#1A0A0A,#5A1A0A,#E86030)','linear-gradient(160deg,#0A1A3A,#1A3A7A,#40A0E0)','linear-gradient(160deg,#2A1A0A,#6A4A0A,#D09030)'],arts:['🏄','🌺','🌊','🌴'],level:'Boss Quest',budget:'$ Lean Budget',monthlyBudget:'$800 – $1,400',bestTime:'Apr – Oct',duration:'1–6 Months',title:'Live as a surf instructor in Bali',tagline:'Teach beginners to stand up on a board by morning, explore rice terraces by afternoon. Bali\'s surf schools are always looking.',unlocks:[{i:'🏄',t:'A real skill to show for it',p:'You\'ll get your surf instructor certification. That\'s a qualification that travels the world.'},{i:'💰',t:'Ultra-low cost of living',p:'Canggu and Seminyak offer world-class lifestyle at a fraction of Western costs.'},{i:'🌏',t:'The nomad epicentre',p:'Bali has the highest concentration of digital nomads per capita on earth.'},{i:'🌺',t:'Cultural depth',p:'Hindu ceremonies, rice paddies, traditional villages — all within 30 minutes of the beach.'},{i:'🏋️',t:'Physical transformation',p:'Surfing daily will change your body. You\'ll be the fittest you\'ve ever been by month two.'},{i:'🤝',t:'International friendships',p:'Surf schools attract curious, adventurous people. These become your people.'}],immersive:'6am. You\'re already at the beach. Your first student is a nervous 40-year-old lawyer from Germany who hasn\'t done anything adventurous in 15 years. By 8am, he\'s standing up. You\'ve done something real. You teach until noon, then you\'re free. You eat a $2 nasi goreng at a warung, rent a scooter for $5/day, and ride up into the rice terraces. Your rent is $300/month for a private villa with a pool. You\'re not dreaming.',path:[{t:'Get your surf instructor certification',p:'Complete a PADI or ISA certified course (2–3 weeks). Many Bali surf schools hire you after their own training programme.'},{t:'Secure your teaching placement',p:'Apply to surf schools in Canggu, Seminyak, or Kuta. Most hire on a casual or seasonal basis.'},{t:'Sort your visa',p:'Indonesia offers a 60-day social visa extendable to 180 days, and a new Digital Nomad visa.'},{t:'Find housing in Canggu',p:'Villa rentals in Canggu run $300–$700/month. Book your first month short-term, then find a longer lease in person.'},{t:'Set up your essentials',p:'Telkomsel or XL for SIM. Keep cash (IDR) for daily life. Get a scooter rental sorted first week.'}],embark:[{t:'Sort your visa',p:'Apply for a 60-day social visa extendable at your local Indonesian consulate'},{t:'Find a place',p:'Browse Canggu villa listings on Flokq or direct Facebook groups'},{t:'Get certified',p:'Book a surf instructor course at Odysseys Surf School or Bali Learn to Surf'},{t:'Join community',p:'Canggu Community Facebook group + Bali Digital Nomads are your first stops'}],prep:[{i:'🏄',bg:'linear-gradient(135deg,#0A2A1A,#1A6A3A)',t:'Surf instructor certification — PADI/ISA',btn:'Enrol Now',dealPage:'surf-cert'},{i:'🌊',bg:'linear-gradient(135deg,#0A1A3A,#1A3A7A)',t:'Bali villa finder — Canggu under $500/mo',btn:'Browse Listings',dealPage:'bali-villas'},{i:'🌞',bg:'linear-gradient(135deg,#3A2A0A,#7A5A0A)',t:'SPF 50+ reef-safe sunscreen — bulk pack',btn:'Shop Deal',dealPage:'sunscreen'},{i:'📶',bg:'linear-gradient(135deg,#1A1A3A,#3A3A7A)',t:'Indonesia SIM + data plan — Telkomsel',btn:'Get Connected',dealPage:'indonesia-sim'},{i:'🏥',bg:'linear-gradient(135deg,#3A0A0A,#7A1A1A)',t:'Travel insurance for active sports — Bali',btn:'Get Covered',dealPage:'worldnomads-sports'},{i:'🛵',bg:'linear-gradient(135deg,#2A1A0A,#6A3A0A)',t:'Bali scooter rental guide + safety tips',btn:'Read Guide',dealPage:'bali-scooter'},{i:'🎽',bg:'linear-gradient(135deg,#0A2A2A,#1A5A5A)',t:'Rash guard & wetsuit essentials',btn:'Shop Deal',dealPage:'sunscreen'},{i:'🌴',bg:'linear-gradient(135deg,#1A3A0A,#3A7A1A)',t:'Canggu neighbourhood map & guide',btn:'Download Free',dealPage:'bali-villas'},{i:'💳',bg:'linear-gradient(135deg,#2A2A0A,#5A5A1A)',t:'Travel card with zero FX fees',btn:'Get the Card',dealPage:'power-bank'}],faq:[{q:'Do I need prior surfing experience?',a:'Some, yes. You should be comfortable in the water and able to ride unbroken waves before pursuing instructor certification.'},{q:'How much can I earn?',a:'Teaching rates vary: $10–$30/lesson. Combined with low living costs ($600–$900/month), you can live well and save.'},{q:'What\'s the best area?',a:'Canggu for the digital nomad lifestyle. Seminyak for more nightlife. Uluwatu if you\'re serious about surf quality.'},{q:'Is the Digital Nomad visa worth it?',a:'Yes, if you\'re planning 6+ months. It allows you to legally work remotely and comes with a 5-year renewable period.'},{q:'What\'s the vibe really like?',a:'Relentlessly good. The combination of culture, community, climate, and cost is unmatched.'}],similar:[{id:'japan',bg:'linear-gradient(170deg,#0A2A44,#1A5A8A,#4ABCD4)',art:'🏔️',badge:'Epic Quest',title:'Ski season in Japan',meta:'3–5 months · Hokkaido'},{id:'france',bg:'linear-gradient(170deg,#2A0A1A,#7A1A3A,#E050A0)',art:'🍷',badge:'Epic Quest',title:'Grape harvest in France',meta:'6–8 weeks · Bordeaux'},{id:'bangkok',bg:'linear-gradient(170deg,#2A1A0A,#8A3A0A,#E88030)',art:'🏙️',badge:'Starter Quest',title:'Move to Bangkok',meta:'Long-term · Thailand'}],lifeDirections:['newlife'],outcomeGoals:['learn-skill','gain-experience','wellness','adventure']},
  lisbon:{slides:['linear-gradient(160deg,#1A0A2A,#4A1A7A,#A060E0)','linear-gradient(160deg,#0A2A10,#1A6A2A,#50C070)','linear-gradient(160deg,#2A1A0A,#7A4A0A,#D08020)','linear-gradient(160deg,#0A1A3A,#2A3A7A,#5080D0)'],arts:['🏛️','🌊','🌿','☕'],level:'Boss Quest',budget:'$$ Mid Budget',monthlyBudget:'$1,400 – $2,200',bestTime:'Mar – Oct',duration:'Long-term',title:'Move to Lisbon',tagline:'Lisbon rewards patience. The first month tests you. By month three, you wonder how you ever lived anywhere else.',unlocks:[{i:'🌍',t:'EU base & visa',p:'Portugal\'s D8 digital nomad visa gives you legal long-term status in the EU.'},{i:'☀️',t:'Best weather in Europe',p:'300+ days of sun, mild winters, and the Atlantic on your doorstep.'},{i:'💰',t:'Affordable for a capital',p:'Half the cost of London, Berlin or Paris — with better food and weather.'},{i:'🤝',t:'Massive nomad community',p:'Lisbon has one of Europe\'s most active expat and remote-worker communities.'},{i:'🛺',t:'Walkable & connected',p:'Trams, metro, and Ubers. You don\'t need a car.'},{i:'🎵',t:'Culture & nightlife',p:'Fado, rooftop bars, and a food scene that punches far above its weight.'}],immersive:'You land at 7am, take the metro to your Airbnb in Mouraria, and spend the first week eating pastéis de nata and walking hills. By week two you\'ve found a room in Arroios for €550/month and joined a coworking space on Avenida. By month two you have a group of friends, a favourite coffee shop, and a commute that involves sunlight. You stop thinking about going back.',path:[{t:'Decide your visa route',p:'Tourist visa covers 90 days. D8 digital nomad visa covers 2 years and needs €3,040+/month income proof.'},{t:'Find housing before you arrive',p:'Book 2–3 weeks in a hostel or Airbnb. Then find a room in a shared flat (Arroios, Mouraria, Intendente) for €450–650/month.'},{t:'Register your NIF (tax number)',p:'You need this for almost everything — bank account, lease, phone contract. Do it at a Finanças office in week one.'},{t:'Open a bank account',p:'Millennium BCP and BPI are the easiest for foreigners. Takes 1–2 days with your NIF and passport.'},{t:'Join the nomad community',p:'Lisbon Nomads Facebook group, Workaway, and the coworking spaces on Avenida da Liberdade are your first stops.'}],embark:[{t:'Sort your visa',p:'Apply for a D8 visa at the Portuguese consulate in your home country'},{t:'Find short-term housing',p:'Book a room on Uniplaces or HousingAnywhere for your first month'},{t:'Get your NIF',p:'Register at a local Finanças office within your first week'},{t:'Join community',p:'Lisbon Nomads Facebook group has thousands of members in the same situation'}],prep:[{i:'🛂',bg:'linear-gradient(135deg,#1A0A2A,#4A1A7A)',t:'Portugal D8 visa guide — step by step',btn:'Read Guide',dealPage:'bkk-guide'},{i:'🏠',bg:'linear-gradient(135deg,#2A1A0A,#6A3A0A)',t:'Lisbon apartments — under €800/month',btn:'Browse Listings',dealPage:'bali-villas'},{i:'📶',bg:'linear-gradient(135deg,#0A2A1A,#1A6A2A)',t:'NOS or Vodafone SIM — monthly plan',btn:'Get Connected',dealPage:'indonesia-sim'},{i:'🏥',bg:'linear-gradient(135deg,#3A0A0A,#7A1A1A)',t:'International health insurance — EU',btn:'Get Covered',dealPage:'cigna-insurance'},{i:'💳',bg:'linear-gradient(135deg,#2A2A0A,#5A5A1A)',t:'Travel card with zero FX fees',btn:'Get the Card',dealPage:'power-bank'},{i:'📖',bg:'linear-gradient(135deg,#0A2A2A,#1A5A5A)',t:'Portuguese for beginners — audio course',btn:'Start Learning',dealPage:'duolingo'},{i:'🌏',bg:'linear-gradient(135deg,#0A1A3A,#1A3A7A)',t:'Lisbon neighbourhood guide — PDF',btn:'Download Free',dealPage:'bkk-guide'},{i:'🏦',bg:'linear-gradient(135deg,#1A2A1A,#3A5A2A)',t:'NIF & bank account setup guide',btn:'Read Guide',dealPage:'bkk-guide'},{i:'☀️',bg:'linear-gradient(135deg,#3A2A0A,#7A5A0A)',t:'Lightweight travel daypack',btn:'Shop Deal',dealPage:'power-bank'}],faq:[{q:'Do I need to speak Portuguese?',a:'Not for daily life — English is widely spoken, especially among younger Lisboetas. But a few phrases go a long way.'},{q:'Is the D8 visa hard to get?',a:'Not if your paperwork is in order. You need proof of remote income (€3,040+/month), health insurance, and a clean criminal record.'},{q:'What\'s the cost of living really?',a:'A comfortable life runs €1,200–€1,800/month including a private room, eating out 3x a week, and a gym membership.'},{q:'Is it safe?',a:'Yes. Lisbon consistently ranks among Europe\'s safest capitals. Petty theft exists near tourist areas — standard precautions apply.'},{q:'What\'s the vibe like?',a:'Laid-back, walkable, sunny, and genuinely welcoming. Most expats report it as the easiest European city to settle into.'}],similar:[{id:'bangkok',bg:'linear-gradient(170deg,#2A1A0A,#8A3A0A,#E88030)',art:'🏙️',badge:'Starter Quest',title:'Move to Bangkok',meta:'Long-term · Thailand'},{id:'medellin',bg:'linear-gradient(170deg,#0A2A10,#1A6A2A,#50C070)',art:'🌺',badge:'Epic Quest',title:'Move to Medellín',meta:'Long-term · Colombia'},{id:'bali',bg:'linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)',art:'🏄',badge:'Boss Quest',title:'Surf instructor in Bali',meta:'1–6 months · Bali'}],lifeDirections:['abroad'],outcomeGoals:['relocate','explore-path','meet-people']},
  france:{slides:['linear-gradient(160deg,#2A0A1A,#7A1A3A,#E050A0)','linear-gradient(160deg,#1A0A2A,#5A2A8A,#B060E0)','linear-gradient(160deg,#2A1A0A,#6A4A0A,#C09030)','linear-gradient(160deg,#0A2A0A,#1A6A2A,#50C060)'],arts:['🍷','🌿','🍇','🏰'],level:'Epic Quest',budget:'$$ Mid Budget',monthlyBudget:'€800 – €1,400',bestTime:'Sep – Nov',duration:'6–8 Weeks',title:'Grape harvest in France',tagline:'Six weeks picking grapes in Bordeaux, Burgundy, or the Rhône valley — with wine, community, and countryside included.',unlocks:[{i:'🍷',t:'Make wine from scratch',p:'You\'ll work every stage of the harvest. You\'ll understand wine at a level most sommeliers don\'t.'},{i:'🌿',t:'Countryside immersion',p:'Château life — rows of vines, stone farmhouses, communal dinners, and sunsets over the valley.'},{i:'💰',t:'Paid to be there',p:'Most harvests pay €10–€12/hour plus accommodation and meals. You leave with money, not debt.'},{i:'🤝',t:'International community',p:'Harvest workers come from everywhere. Tight bonds form fast over shared work and shared wine.'},{i:'🏰',t:'Deep French culture',p:'Working on a working château is a different France than what tourists see.'},{i:'🌍',t:'EU door-opener',p:'Agricultural work visas are available to most nationalities. This is a legitimate EU entry point.'}],immersive:'5am. You\'re in the vines before the sun is fully up, secateurs in hand. The work is physical — you\'ll feel it by lunchtime. But lunch is a château-prepared three-course meal with local wine. By evening you\'re sitting with people from Argentina, Germany, and New Zealand watching the valley turn gold. Nobody is checking their phone. Nobody is talking about work meetings.',path:[{t:'Find your harvest placement',p:'Winemaker Job Board, ANEFA (French agricultural employment), and direct château outreach via email are the main routes.'},{t:'Sort your visa',p:'EU citizens need nothing. Non-EU travellers can use a tourist visa for short harvests, or apply for an agricultural worker visa.'},{t:'Book transport and budget',p:'Train to the region (Bordeaux, Lyon, Beaune). Most châteaux provide accommodation — confirm before booking anything.'},{t:'Pack appropriately',p:'Sturdy boots, waterproofs, and clothes you don\'t mind ruining. Bring nothing fragile. Leave the laptop.'},{t:'Arrive a day early',p:'Meet your team, understand the property, and adjust to the rhythm before the first day of picking.'}],embark:[{t:'Find a placement',p:'Email 20–30 châteaux directly in July–August for September placements'},{t:'Sort your visa',p:'EU: nothing needed. Others: check tourist visa allowances for your nationality'},{t:'Book transport',p:'Train from Paris to Bordeaux or Lyon. The château will pick you up from the station.'},{t:'Join community',p:'Harvest season Facebook groups for your region connect you with other vendangeurs'}],prep:[{i:'🍷',bg:'linear-gradient(135deg,#2A0A1A,#7A1A3A)',t:'Vineyard job board — harvest placements',btn:'Find Placement',dealPage:'bkk-guide'},{i:'🥾',bg:'linear-gradient(135deg,#2A1A0A,#6A3A0A)',t:'Waterproof work boots — harvest essential',btn:'Shop Deal',dealPage:'sunscreen'},{i:'🌧️',bg:'linear-gradient(135deg,#0A1A3A,#2A3A7A)',t:'Waterproof jacket & work gloves',btn:'Shop Deal',dealPage:'sunscreen'},{i:'📶',bg:'linear-gradient(135deg,#0A2A1A,#1A6A2A)',t:'Free Roam EU SIM — data across France',btn:'Get Connected',dealPage:'indonesia-sim'},{i:'🏥',bg:'linear-gradient(135deg,#3A0A0A,#7A1A1A)',t:'Travel insurance — EU harvest workers',btn:'Get Covered',dealPage:'worldnomads-sports'},{i:'💳',bg:'linear-gradient(135deg,#2A2A0A,#5A5A1A)',t:'Wise travel card — spend in euros',btn:'Get the Card',dealPage:'power-bank'},{i:'📖',bg:'linear-gradient(135deg,#0A2A2A,#1A5A5A)',t:'French basics — wine & harvest vocab',btn:'Start Learning',dealPage:'duolingo'},{i:'🎒',bg:'linear-gradient(135deg,#1A1A3A,#3A3A6A)',t:'Packable duffel bag — 40L',btn:'Shop Deal',dealPage:'power-bank'},{i:'🍽️',bg:'linear-gradient(135deg,#1A2A1A,#3A5A2A)',t:'Harvest worker\'s guide to France',btn:'Read Free',dealPage:'bkk-guide'}],faq:[{q:'Do I need to speak French?',a:'Basic French helps but most châteaux work with international teams. You\'ll pick it up fast in the vines.'},{q:'Is harvest work physically hard?',a:'Yes. You\'re on your feet for 8–10 hours a day in all weather. Most people adapt within a week.'},{q:'Do châteaux really provide accommodation?',a:'Most do — ranging from dormitories to converted barns. Always confirm before accepting a placement.'},{q:'What\'s the pay?',a:'€10–€12/hour gross is standard. With free meals and accommodation, you can save nearly everything.'},{q:'When exactly is harvest?',a:'Bordeaux: September–October. Burgundy: September. Rhône: October. Exact dates vary each year with the weather.'}],similar:[{id:'japan',bg:'linear-gradient(170deg,#0A2A44,#1A5A8A,#4ABCD4)',art:'🏔️',badge:'Epic Quest',title:'Ski season in Japan',meta:'3–5 months · Hokkaido'},{id:'bali',bg:'linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)',art:'🏄',badge:'Boss Quest',title:'Surf instructor in Bali',meta:'1–6 months · Bali'},{id:'lisbon',bg:'linear-gradient(170deg,#1A0A2A,#4A1A7A,#A060E0)',art:'🏛️',badge:'Boss Quest',title:'Move to Lisbon',meta:'Long-term · Portugal'}],lifeDirections:['newlife'],outcomeGoals:['gain-experience','meet-people','adventure']},
  medellin:{slides:['linear-gradient(160deg,#0A2A10,#1A6A2A,#50C070)','linear-gradient(160deg,#2A1A0A,#7A4A0A,#D08020)','linear-gradient(160deg,#0A1A3A,#2A3A7A,#5080D0)','linear-gradient(160deg,#2A0A1A,#7A1A3A,#E050A0)'],arts:['🌺','🌴','🏔️','☕'],level:'Epic Quest',budget:'$ Lean Budget',monthlyBudget:'$900 – $1,500',bestTime:'Dec – Mar',duration:'Long-term',title:'Move to Medellín',tagline:'Eternal spring, low cost of living, world-class coffee, and the most transformed city of the last 20 years.',unlocks:[{i:'🌺',t:'Eternal spring climate',p:'18–22°C year-round. No winter, no summer extremes. Just perfect weather every day.'},{i:'💰',t:'Extremely affordable',p:'A high-quality life costs $900–1,200/month. You\'ll feel genuinely wealthy on a modest income.'},{i:'☕',t:'Coffee culture',p:'Colombia produces some of the world\'s best coffee. Medellín takes this seriously.'},{i:'🤝',t:'Active expat community',p:'A well-established digital nomad scene centred around El Poblado and Laureles.'},{i:'🌍',t:'Gateway to South America',p:'Central location for exploring the continent. Flights across Colombia are cheap.'},{i:'🎵',t:'Food & nightlife',p:'Vibrant food scene, salsa nights, and a social life that starts late and runs long.'}],immersive:'You land into perpetual spring. Your apartment in Laureles costs $500/month and has a rooftop terrace. Your neighbourhood café has better coffee than anywhere you\'ve ever been. The people are warm, the pace is human, and your dollar goes three times as far as it did at home. You planned to stay 3 months. You\'re extending to 6.',path:[{t:'Sort your visa',p:'Colombia allows 90-day tourist stays on arrival for most nationalities. Extend once for 180 days. Longer stays need a Migrant visa.'},{t:'Choose your neighbourhood',p:'El Poblado for expat density and nightlife. Laureles for a more local feel and better value. Envigado for quiet and affordability.'},{t:'Find housing',p:'Facebook groups (Medellín Housing, Expats in Medellín) and Airbnb for the first month. Then negotiate directly for monthly rates.'},{t:'Get set up',p:'Claro or Tigo SIM. Open a Bancolombia account (needs cedula or visa). Use Rappi for everything.'},{t:'Join the community',p:'Selina coworking, Nomad List Medellín meetups, and the Medellín Digital Nomads Facebook group.'}],embark:[{t:'Book your flight',p:'No visa required for most nationalities — just show up'},{t:'Find short-term housing',p:'Book an Airbnb in Laureles or El Poblado for your first 2 weeks'},{t:'Get a SIM card',p:'Claro or Tigo at the airport or any shopping centre'},{t:'Join community',p:'Medellín Digital Nomads Facebook group — 15,000+ members'}],prep:[{i:'✈️',bg:'linear-gradient(135deg,#0A2A10,#1A6A2A)',t:'Colombia entry guide & visa options',btn:'Read Guide',dealPage:'bkk-guide'},{i:'🏠',bg:'linear-gradient(135deg,#2A1A0A,#6A3A0A)',t:'Medellín apartments — Laureles & Poblado',btn:'Browse Listings',dealPage:'bali-villas'},{i:'📶',bg:'linear-gradient(135deg,#0A2A1A,#1A6A2A)',t:'Claro Colombia SIM — monthly data plan',btn:'Get Connected',dealPage:'indonesia-sim'},{i:'🏥',bg:'linear-gradient(135deg,#3A0A0A,#7A1A1A)',t:'Travel insurance — Colombia',btn:'Get Covered',dealPage:'worldnomads-sports'},{i:'💳',bg:'linear-gradient(135deg,#2A2A0A,#5A5A1A)',t:'Wise card — spend in Colombian pesos',btn:'Get the Card',dealPage:'power-bank'},{i:'📖',bg:'linear-gradient(135deg,#0A2A2A,#1A5A5A)',t:'Spanish for beginners — fast track',btn:'Start Learning',dealPage:'duolingo'},{i:'🌏',bg:'linear-gradient(135deg,#0A1A3A,#1A3A7A)',t:'Medellín neighbourhood guide — PDF',btn:'Download Free',dealPage:'bkk-guide'},{i:'🛵',bg:'linear-gradient(135deg,#2A1A0A,#5A3A0A)',t:'Rappi & local transport guide',btn:'Read Free',dealPage:'bkk-guide'},{i:'☀️',bg:'linear-gradient(135deg,#3A2A0A,#7A5A0A)',t:'Lightweight daypack for the tropics',btn:'Shop Deal',dealPage:'power-bank'}],faq:[{q:'Is Medellín safe now?',a:'Yes — dramatically transformed since the 1990s. El Poblado and Laureles are as safe as any European capital neighbourhood.'},{q:'Do I need to speak Spanish?',a:'English gets you by in expat areas, but Spanish opens everything up. Apps like Duolingo are enough to get started.'},{q:'What\'s the cost of living?',a:'A comfortable life runs $900–$1,500/month including a private apartment, food, gym, and regular nights out.'},{q:'What visa do I use?',a:'Most nationalities get 90 days on arrival, extendable to 180. For longer, look at the Colombia Migrant Visa.'},{q:'What\'s the weather like?',a:'Called the City of Eternal Spring for a reason — 18–22°C all year. You will not miss seasons.'}],similar:[{id:'lisbon',bg:'linear-gradient(170deg,#1A0A2A,#4A1A7A,#A060E0)',art:'🏛️',badge:'Boss Quest',title:'Move to Lisbon',meta:'Long-term · Portugal'},{id:'bangkok',bg:'linear-gradient(170deg,#2A1A0A,#8A3A0A,#E88030)',art:'🏙️',badge:'Starter Quest',title:'Move to Bangkok',meta:'Long-term · Thailand'},{id:'bali',bg:'linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)',art:'🏄',badge:'Boss Quest',title:'Surf instructor in Bali',meta:'1–6 months · Bali'}],lifeDirections:['abroad'],outcomeGoals:['relocate','explore-path','meet-people']},
  moto:{slides:['linear-gradient(160deg,#0A1A3A,#1A3A8A,#50A0FF)','linear-gradient(160deg,#1A0A2A,#4A1A7A,#A060E0)','linear-gradient(160deg,#0A2A10,#1A6A2A,#50C070)','linear-gradient(160deg,#2A1A0A,#6A4A0A,#C09030)'],arts:['🏍️','🗺️','⛽','🏔️'],level:'Legendary',budget:'$$ Mid Budget',monthlyBudget:'$1,200 – $2,000',bestTime:'May – Sep',duration:'2–4 Months',title:'Travel Europe by motorcycle',tagline:'Plan a route, pack light, ride every day. No schedule, no agenda — just roads that go where you decide.',unlocks:[{i:'🏍️',t:'Pure freedom of movement',p:'No timetables, no airports, no luggage limits. You stop when you want and go where you want.'},{i:'🌍',t:'All of Europe',p:'26 Schengen countries on one pass. Alps, coastal roads, vineyards, ancient cities — all accessible.'},{i:'🤝',t:'Motorcycle community',p:'The riding community is one of the most welcoming you\'ll find. Hostels, camps, and cafés fill with connections.'},{i:'🧠',t:'Genuine self-reliance',p:'You\'ll learn mechanical basics, navigation, weather reading, and decision-making under real conditions.'},{i:'📖',t:'A story worth telling',p:'People who\'ve done this never stop talking about it. For good reason.'},{i:'🏔️',t:'The roads themselves',p:'The Stelvio Pass. The Transfăgărășan. The Amalfi Coast. These are bucket-list rides.'}],immersive:'You leave Calais on a Tuesday morning. By Friday you\'re camped in the Dolomites with the bike parked next to a mountain stream. You\'ve covered five countries. You\'ve eaten at gas stations and Michelin-starred terraces. You\'ve pushed through rain and arrived into perfect evening light. You haven\'t checked your work email in four days. You\'ve never felt more awake.',path:[{t:'Sort your bike',p:'Bring your own (best option), rent long-term in the UK/Europe, or buy and sell on the road. 500–800cc is the sweet spot.'},{t:'Plan your route loosely',p:'Pick 3–4 must-dos and leave everything else flexible. Over-planning kills the experience. Google Maps and iOverlander are your tools.'},{t:'Gear up properly',p:'Helmet, jacket, gloves, boots, and waterproofs are non-negotiable. One-piece luggage system keeps load balanced.'},{t:'Sort insurance and documentation',p:'Green Card insurance for all EU countries. International Driving Permit if your licence isn\'t EU. Carry originals.'},{t:'Build your accommodation strategy',p:'Mix of camping (panniers and tent), motorcycle-friendly hostels (iOverlander), and occasional hotels for recovery nights.'}],embark:[{t:'Decide on your bike',p:'Rent from a UK or European company for the season, or bring your own'},{t:'Plan your core route',p:'Pick 3–4 anchor destinations — fill the rest in as you go'},{t:'Gear up',p:'Helmet, jacket, waterproofs, gloves, boots. Don\'t compromise on safety gear.'},{t:'Sort insurance',p:'Green Card + European breakdown cover is the baseline'}],prep:[{i:'🏍️',bg:'linear-gradient(135deg,#0A1A3A,#1A3A8A)',t:'Long-term motorcycle rental — Europe',btn:'Browse Options',dealPage:'bkk-guide'},{i:'🛡️',bg:'linear-gradient(135deg,#3A0A0A,#7A1A1A)',t:'European motorcycle insurance — Green Card',btn:'Get Covered',dealPage:'worldnomads-sports'},{i:'⛺',bg:'linear-gradient(135deg,#0A2A10,#1A6A2A)',t:'Ultralight 2-person tent',btn:'Shop Deal',dealPage:'sunscreen'},{i:'🎒',bg:'linear-gradient(135deg,#1A1A3A,#3A3A6A)',t:'Motorcycle panniers & top case set',btn:'Shop Deal',dealPage:'power-bank'},{i:'📶',bg:'linear-gradient(135deg,#0A2A1A,#1A6A2A)',t:'EU-wide SIM — unlimited data roaming',btn:'Get Connected',dealPage:'indonesia-sim'},{i:'🗺️',bg:'linear-gradient(135deg,#2A1A0A,#6A3A0A)',t:'Europe route planning — GPS & offline maps',btn:'Download',dealPage:'bkk-guide'},{i:'🏥',bg:'linear-gradient(135deg,#3A0A1A,#7A1A3A)',t:'Adventure travel insurance — moto cover',btn:'Get Covered',dealPage:'worldnomads-sports'},{i:'🔧',bg:'linear-gradient(135deg,#1A2A1A,#3A5A2A)',t:'Motorcycle toolkit & puncture kit',btn:'Shop Deal',dealPage:'sunscreen'},{i:'🎧',bg:'linear-gradient(135deg,#1A1A2A,#3A3A5A)',t:'Bluetooth helmet comms system',btn:'Shop Deal',dealPage:'power-bank'}],faq:[{q:'Do I need a motorcycle licence?',a:'Yes. A full motorcycle licence (A category in EU) is required. An International Driving Permit is recommended for non-EU licence holders.'},{q:'What size bike should I use?',a:'500–800cc is the sweet spot — big enough to cruise motorways, light enough to handle mountain roads.'},{q:'How much does it cost?',a:'Budget €50–€100/day including fuel, accommodation mix, and food. Two months costs roughly €3,000–€6,000 all-in.'},{q:'Is it dangerous?',a:'Motorcycle travel carries real risk. Good gear, proper training, and defensive riding reduce this significantly. No shortcuts.'},{q:'What\'s the best route?',a:'Classic: Calais → Alps → Adriatic coast → Greece or Turkey and back. But there\'s no wrong way.'}],similar:[{id:'japan',bg:'linear-gradient(170deg,#0A2A44,#1A5A8A,#4ABCD4)',art:'🏔️',badge:'Epic Quest',title:'Ski season in Japan',meta:'3–5 months · Hokkaido'},{id:'france',bg:'linear-gradient(170deg,#2A0A1A,#7A1A3A,#E050A0)',art:'🍷',badge:'Epic Quest',title:'Grape harvest in France',meta:'6–8 weeks · Bordeaux'},{id:'lisbon',bg:'linear-gradient(170deg,#1A0A2A,#4A1A7A,#A060E0)',art:'🏛️',badge:'Boss Quest',title:'Move to Lisbon',meta:'Long-term · Portugal'}],lifeDirections:['newlife'],outcomeGoals:['adventure','gain-experience']},
  housesit:{slides:['linear-gradient(160deg,#0A2A10,#1A6A2A,#60C060)','linear-gradient(160deg,#2A1A0A,#7A4A0A,#D08020)','linear-gradient(160deg,#0A1A3A,#2A3A7A,#5080D0)','linear-gradient(160deg,#2A0A1A,#6A1A3A,#C050A0)'],arts:['🏠','🐾','🌿','🗺️'],level:'Starter Quest',budget:'$ Lean Budget',monthlyBudget:'$400 – $900',bestTime:'Year-round',duration:'Ongoing',title:'Full-time house sitting',tagline:'Live rent-free in other people\'s homes around the world in exchange for looking after their property and pets.',unlocks:[{i:'🏠',t:'Zero rent',p:'Accommodation is provided in exchange for your time. Your biggest fixed cost disappears.'},{i:'🌍',t:'Live anywhere',p:'Assignments exist across 100+ countries — from London townhouses to Tuscan farmhouses to Bali villas.'},{i:'🐾',t:'Animal companionship',p:'Most sits involve pets. If you love animals, this is the job perk you didn\'t know you needed.'},{i:'💰',t:'Dramatically lower costs',p:'Without rent, most people cut their monthly spend by 40–60%.'},{i:'🗺️',t:'Complete flexibility',p:'Chain short sits together to create a continuous travel lifestyle — or find long-term sits for stability.'},{i:'🏡',t:'Live like a local',p:'You stay in real homes in real neighbourhoods, not tourist areas. A totally different experience.'}],immersive:'You\'re sitting on the terrace of a farmhouse in Provence. It\'s 8am, there\'s a coffee in your hand, and the Labrador is asleep at your feet. You pay zero for this. In three weeks you move to a flat in Edinburgh. Then a villa in Crete. You haven\'t paid rent in four months. Your savings are growing, not shrinking.',path:[{t:'Create your sitter profile',p:'Trusted Housesitters is the main platform. A good profile has reviews, a warm introduction, and clear photos of you (not your cat).'},{t:'Get your first review',p:'The hardest step. Do a short sit locally or at a reduced rate to build your first review. After 3–5 reviews, you get regular bookings.'},{t:'Build your sit calendar',p:'Chain sits together with 2–3 days buffer between assignments. Use house sit Facebook groups to fill gaps.'},{t:'Sort your remote income',p:'House sitting works best with remote income — freelance, remote job, or savings runway. It cuts costs, it doesn\'t replace income.'},{t:'Travel light and flexibly',p:'You\'re moving every few weeks. One carry-on + one personal item is the sustainable way to do this long-term.'}],embark:[{t:'Create your profile',p:'Join TrustedHousesitters and build a compelling sitter profile'},{t:'Get your first review',p:'Apply for sits in your home region or country first — easier to land'},{t:'Sort your kit',p:'Good carry-on luggage, pet first aid basics, and a portable WiFi backup'},{t:'Join community',p:'House Sitting World Facebook group — 80,000+ members sharing tips and sits'}],prep:[{i:'🏠',bg:'linear-gradient(135deg,#0A2A10,#1A6A2A)',t:'TrustedHousesitters membership',btn:'Join Now',dealPage:'bkk-guide'},{i:'🎒',bg:'linear-gradient(135deg,#1A1A3A,#3A3A6A)',t:'Carry-on suitcase — 4 wheels, 40L',btn:'Shop Deal',dealPage:'power-bank'},{i:'📶',bg:'linear-gradient(135deg,#0A2A1A,#1A6A2A)',t:'Global eSIM — data in 100+ countries',btn:'Get Connected',dealPage:'indonesia-sim'},{i:'🏥',bg:'linear-gradient(135deg,#3A0A0A,#7A1A1A)',t:'Long-term travel insurance — nomad cover',btn:'Get Covered',dealPage:'worldnomads-sports'},{i:'💳',bg:'linear-gradient(135deg,#2A2A0A,#5A5A1A)',t:'Wise travel card — no FX fees',btn:'Get the Card',dealPage:'power-bank'},{i:'🐾',bg:'linear-gradient(135deg,#1A2A1A,#3A5A2A)',t:'Pet first aid kit — portable',btn:'Shop Deal',dealPage:'sunscreen'},{i:'💻',bg:'linear-gradient(135deg,#1A1A3A,#3A3A5A)',t:'Portable power bank + laptop stand',btn:'Shop Deal',dealPage:'power-bank'},{i:'📖',bg:'linear-gradient(135deg,#0A2A2A,#1A5A5A)',t:'House sitting handbook — free guide',btn:'Download Free',dealPage:'bkk-guide'},{i:'☀️',bg:'linear-gradient(135deg,#3A2A0A,#7A5A0A)',t:'Lightweight travel daypack',btn:'Shop Deal',dealPage:'power-bank'}],faq:[{q:'Do I need experience with pets?',a:'Helpful but not essential for all sits. Be honest in your profile about which animals you\'re comfortable with.'},{q:'How do I get my first booking without reviews?',a:'Start locally. Apply for sits near home or at a lower price point. Every sitter starts at zero reviews.'},{q:'Can I do this full-time?',a:'Yes — many people chain sits continuously for years. The key is building a strong profile and starting your search 4–6 weeks ahead.'},{q:'Is it actually free accommodation?',a:'Yes. You provide a service (care and presence); they provide accommodation. No money changes hands on most platforms.'},{q:'What happens between sits?',a:'Hostels, Airbnbs, or short lets. Budget for 4–7 gap days per month. Keep a cushion.'}],similar:[{id:'bangkok',bg:'linear-gradient(170deg,#2A1A0A,#8A3A0A,#E88030)',art:'🏙️',badge:'Starter Quest',title:'Move to Bangkok',meta:'Long-term · Thailand'},{id:'lisbon',bg:'linear-gradient(170deg,#1A0A2A,#4A1A7A,#A060E0)',art:'🏛️',badge:'Boss Quest',title:'Move to Lisbon',meta:'Long-term · Portugal'},{id:'medellin',bg:'linear-gradient(170deg,#0A2A10,#1A6A2A,#50C070)',art:'🌺',badge:'Epic Quest',title:'Move to Medellín',meta:'Long-term · Colombia'}],lifeDirections:['abroad'],outcomeGoals:['relocate','explore-path']},
  freelance:{slides:['linear-gradient(160deg,#1A0A3A,#4A1A8A,#9050E0)','linear-gradient(160deg,#0A2A10,#1A6A2A,#50C070)','linear-gradient(160deg,#2A1A0A,#7A4A0A,#D08020)','linear-gradient(160deg,#0A1A3A,#2A3A7A,#5080D0)'],arts:['💻','📈','🎯','💰'],level:'Boss Quest',budget:'$$ Mid Budget',monthlyBudget:'$500 – $5,000+',bestTime:'Year-round',duration:'12 Weeks',title:'Go freelance in 90 days',tagline:'Build your first client base, set your rates, and replace your salary — all without quitting your job first.',unlocks:[{i:'💻',t:'Location independence',p:'Once you\'re freelance, you work from wherever you want. This is the skill that unlocks every other quest.'},{i:'💰',t:'Income ceiling removed',p:'Employed income is capped. Freelance income scales with clients. The ceiling disappears.'},{i:'🎯',t:'Work on your own terms',p:'You choose your clients, your hours, and your rates. Nobody manages your calendar but you.'},{i:'📈',t:'Portfolio that compounds',p:'Every project builds your portfolio. Your rates go up. Your client quality improves.'},{i:'🤝',t:'Real professional network',p:'Freelance clients refer you. Your network becomes the thing that generates income, not a job board.'},{i:'🌍',t:'The unlock for everything else',p:'This is the quest that makes every other quest possible — Bali, Bangkok, Lisbon — all easier with freelance income.'}],immersive:'Month three. A client message arrives at 11am. You reply from a coffee shop in Chiang Mai. The invoice is for £2,200. You bill it, close your laptop, and order another coffee. Six months ago you were commuting 90 minutes a day to a job that made you feel invisible. The skill was always there. You just hadn\'t packaged it yet.',path:[{t:'Define your service',p:'One specific thing for one specific type of client. "I help SaaS companies reduce onboarding drop-off with UX improvements." Not "I do design."'},{t:'Build proof',p:'3–5 spec projects or case studies. Real client work if you can get it; spec work if you can\'t. Portfolio over CV.'},{t:'Start posting',p:'LinkedIn + one other platform relevant to your niche. Post about the specific problem you solve, not about yourself.'},{t:'Land your first client',p:'20–30 targeted outreach messages. Not cold templates — personalised messages that reference their specific situation.'},{t:'Raise your rates',p:'Every new client, raise your rate slightly. The clients who push back on price are rarely the good ones anyway.'}],embark:[{t:'Define your service',p:'Write one sentence: "I help [client type] achieve [outcome] using [your skill]"'},{t:'Build 3 portfolio pieces',p:'Real work or spec work — doesn\'t matter. Make them good.'},{t:'Set up your presence',p:'LinkedIn profile + a simple portfolio page (Notion, Webflow, or Carrd)'},{t:'Start outreach',p:'20 personalised DMs or emails per week. Track responses.'}],prep:[{i:'💻',bg:'linear-gradient(135deg,#1A0A3A,#4A1A8A)',t:'Freelance rate calculator & pricing guide',btn:'Get Free',dealPage:'bkk-guide'},{i:'📄',bg:'linear-gradient(135deg,#0A2A10,#1A6A2A)',t:'Portfolio site builder — Webflow or Carrd',btn:'Start Free',dealPage:'bkk-guide'},{i:'💰',bg:'linear-gradient(135deg,#2A1A0A,#6A3A0A)',t:'Wise Business — invoice & receive globally',btn:'Get Started',dealPage:'power-bank'},{i:'📋',bg:'linear-gradient(135deg,#1A1A3A,#3A3A6A)',t:'Freelance contract template pack',btn:'Download Free',dealPage:'bkk-guide'},{i:'🎯',bg:'linear-gradient(135deg,#2A0A1A,#7A1A3A)',t:'LinkedIn profile optimisation guide',btn:'Read Guide',dealPage:'bkk-guide'},{i:'🏥',bg:'linear-gradient(135deg,#3A0A0A,#7A1A1A)',t:'Self-employed health insurance guide',btn:'Read Guide',dealPage:'cigna-insurance'},{i:'📊',bg:'linear-gradient(135deg,#0A2A2A,#1A5A5A)',t:'Freelance accounting — FreeAgent or Xero',btn:'Try Free',dealPage:'bkk-guide'},{i:'🤝',bg:'linear-gradient(135deg,#1A2A1A,#3A5A2A)',t:'Freelance community — Cold Email Wizard',btn:'Join',dealPage:'bkk-guide'},{i:'📱',bg:'linear-gradient(135deg,#1A1A2A,#3A3A5A)',t:'Productivity stack — Notion + Calendly',btn:'Get Free',dealPage:'power-bank'}],faq:[{q:'Do I need to quit my job first?',a:'No. Most successful freelancers land their first clients while employed. Quit when your freelance income matches your salary.'},{q:'How long does it realistically take?',a:'Most people land their first paid client within 6–12 weeks of consistent effort. Income that replaces a salary takes 3–6 months.'},{q:'What skills work best for freelancing?',a:'Web design, copywriting, UX, video editing, paid ads, SEO, software development, and financial modelling all translate well.'},{q:'How do I price my services?',a:'Research what 3–5 competitors charge. Start 20% below market to build reviews, then raise rates with each new client.'},{q:'What about taxes?',a:'Self-employed tax varies by country. Register for self-assessment in your home country first. Talk to an accountant in month 2.'}],similar:[{id:'bangkok',bg:'linear-gradient(170deg,#2A1A0A,#8A3A0A,#E88030)',art:'🏙️',badge:'Starter Quest',title:'Move to Bangkok',meta:'Long-term · Thailand'},{id:'lisbon',bg:'linear-gradient(170deg,#1A0A2A,#4A1A7A,#A060E0)',art:'🏛️',badge:'Boss Quest',title:'Move to Lisbon',meta:'Long-term · Portugal'},{id:'bali',bg:'linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)',art:'🏄',badge:'Boss Quest',title:'Surf instructor in Bali',meta:'1–6 months · Bali'}],lifeDirections:['upgrade'],outcomeGoals:['earn-income','build-portfolio','career-change']}

};

const FALLBACK={slides:['linear-gradient(160deg,#1A0A2A,#4A1A7A,#A060E0)','linear-gradient(160deg,#0A2A10,#1A6A2A,#50C070)','linear-gradient(160deg,#2A1A0A,#7A4A0A,#D08020)','linear-gradient(160deg,#0A1A3A,#1A3A7A,#50A0FF)'],arts:['🌍','✈️','🗺️','⚡'],level:'Boss Quest',budget:'$$ Mid Budget',duration:'Coming soon',title:'This OutQuest',tagline:'Something incredible is waiting. We\'re building the full guide — drop your email to get it first.',unlocks:[{i:'🌍',t:'Global experience',p:'Build real-world skills that follow you forever.'},{i:'💰',t:'Lower costs',p:'Most quests cost less than staying home.'},{i:'🤝',t:'New network',p:'The people you meet will change your trajectory.'}],immersive:'This quest is being built. Join the list and you\'ll be the first to get the full guide, step-by-step path, and curated gear list.',path:[{t:'Check your eligibility',p:'We\'ll walk you through every requirement step by step.'},{t:'Sort your finances',p:'Budget planning, income setup, and departure fund targets.'},{t:'Book flights + housing',p:'We\'ll point you to the best options for your situation.'},{t:'Set up essentials',p:'SIM, banking, insurance. All sorted before you land.'}],embark:[{t:'Get on the list',p:'Drop your email and we\'ll send you the full quest guide'},{t:'Book a call',p:'30-minute free call with someone who\'s done this quest'},{t:'Join the community',p:'Connect with others planning the same quest'}],prep:[{i:'🌍',bg:'linear-gradient(135deg,#1A2A4A,#2A4A7A)',t:'Get the full quest guide — free',btn:'Get Access',affiliate:false},{i:'🏥',bg:'linear-gradient(135deg,#3A0A0A,#7A1A1A)',t:'Worldwide travel insurance',btn:'Get Covered',affiliate:true,url:'https://www.worldnomads.com'},{i:'💻',bg:'linear-gradient(135deg,#1A1A3A,#3A3A7A)',t:'Remote work setup guide',btn:'Read Free',affiliate:false},{i:'📶',bg:'linear-gradient(135deg,#0A2A1A,#1A6A2A)',t:'International SIM card',btn:'Shop Deal',affiliate:true,url:'https://www.worldnomads.com'},{i:'💳',bg:'linear-gradient(135deg,#2A1A0A,#6A3A0A)',t:'Travel card with zero FX fees',btn:'Get the Card',affiliate:false},{i:'🏠',bg:'linear-gradient(135deg,#1A0A2A,#4A1A7A)',t:'Long-term rental finder',btn:'Browse Listings',affiliate:false},{i:'🎒',bg:'linear-gradient(135deg,#0A1A2A,#2A4A6A)',t:'Lightweight travel backpack',btn:'Shop Deal',affiliate:true,url:'https://www.worldnomads.com'},{i:'💊',bg:'linear-gradient(135deg,#2A0A0A,#6A1A1A)',t:'Travel health essentials kit',btn:'Shop Deal',affiliate:false},{i:'📱',bg:'linear-gradient(135deg,#1A1A2A,#3A3A5A)',t:'Offline maps & productivity apps',btn:'Get the List',affiliate:false}],faq:[{q:'When will this quest be available?',a:'We\'re building it now. Drop your email and you\'ll be the first to know.'},{q:'Can I suggest a quest?',a:'Yes! Use the contact form and tell us where you want to go.'}],similar:[{id:'japan',bg:'linear-gradient(170deg,#0A2A44,#1A5A8A,#4ABCD4)',art:'🏔️',badge:'Epic Quest',title:'Ski season in Japan',meta:'3–5 months · Hokkaido'},{id:'bali',bg:'linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)',art:'🏄',badge:'Boss Quest',title:'Surf instructor in Bali',meta:'1–6 months · Bali'},{id:'bangkok',bg:'linear-gradient(170deg,#2A1A0A,#8A3A0A,#E88030)',art:'🏙️',badge:'Starter Quest',title:'Move to Bangkok',meta:'Long-term · Thailand'}]};

let gcur=0,gTimer=null;
let _lbSlides=[],_lbArts=[],_lbCur=0;

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg=document.getElementById('page-'+id);
  if(pg)pg.classList.add('active');
  document.body.style.overflow='';
  window.scrollTo({top:0,behavior:'smooth'});
}

function showListing(id){
  window._currentListingId=id;
  const q=QUESTS[id]||FALLBACK;

  // ── NEW PHOTO GRID ──
  _lbSlides=q.slides||[];
  _lbArts=(q.arts||['🌍','✈️','🗺️','⚡']);

  // Main image
  const main=document.getElementById('gp-main');
  const mainInner=document.getElementById('gp-main-inner');
  main.style.background=_lbSlides[0]||'#1a1a1a';
  mainInner.textContent=_lbArts[0]||'🌍';

  // Thumb 1
  const t1=document.getElementById('gp-t1');
  const t1i=document.getElementById('gp-t1-inner');
  t1.style.background=_lbSlides[1]||_lbSlides[0]||'#1a1a1a';
  t1i.textContent=_lbArts[1]||_lbArts[0]||'✈️';

  // Thumb 2
  const t2=document.getElementById('gp-t2');
  const t2i=document.getElementById('gp-t2-inner');
  t2.style.background=_lbSlides[2]||_lbSlides[0]||'#1a1a1a';
  t2i.textContent=_lbArts[2]||_lbArts[0]||'🗺️';

  // Also populate legacy hidden slides so goTo/gslide still work without errors
  for(let i=0;i<4;i++){const s=document.getElementById('gs'+i);if(s){s.style.background=_lbSlides[i]||_lbSlides[0];}}

  const _dirEmoji={'abroad':'🌍','newlife':'✨','upgrade':'⚡','all':'🔄'};
  const _dirLabel={'abroad':'Move Abroad','newlife':'Try a New Life','upgrade':'Upgrade Your Life','all':'All Directions'};
  const _gbadg=document.getElementById('gbadges');if(_gbadg)_gbadg.innerHTML=(q.lifeDirections||[]).map(d=>`<span class="gbadge gb-time">${_dirEmoji[d]||''} ${_dirLabel[d]||d}</span>`).join('');
  const _gtitle=document.getElementById('g-title');if(_gtitle)_gtitle.textContent=q.title;
  const _bcListingTitle=document.getElementById('bc-listing-title');if(_bcListingTitle)_bcListingTitle.textContent=q.title;
  const _gtagline=document.getElementById('g-tagline');if(_gtagline)_gtagline.textContent=q.tagline;

  // ── SAVE BAR ──
  const _saveBar=document.getElementById('listing-save-bar');
  if(_saveBar){
    const isSaved=mqIsSaved(id);
    _saveBar.innerHTML=`
      <button class="listing-save-btn${isSaved?' saved':''}" id="listing-save-btn" onclick="mqToggleSaveFromListing('${id}')">
        ${isSaved?'✓ In My Quests':'🔖 Save to My Quests'}
      </button>
      <button class="listing-share-btn" onclick="openShareSheet()">Share this quest</button>
      <button class="listing-view-mq${isSaved?' show':''}" id="listing-view-mq" onclick="openMQDrawer()">View My Quests</button>
    `;
  }
  const _outcomeMap={'learn-skill':'📚 Learn a skill','build-portfolio':'🗂️ Build a portfolio','explore-path':'🧭 Explore a path','gain-experience':'🎯 Gain experience','meet-people':'🤝 Meet people','wellness':'🌿 Wellness','adventure':'🏕️ Adventure','earn-income':'💰 Earn income','relocate':'🏠 Relocate','career-change':'🔀 Career change'};
  const outPills=(q.outcomeGoals||[]).map(o=>`<span style="display:inline-flex;align-items:center;gap:6px;background:var(--bg);border:1px solid var(--border);border-radius:50px;padding:8px 16px;font-size:13px;font-weight:600;color:var(--text2);">${_outcomeMap[o]||o}</span>`).join('');
  const _ltags=document.getElementById('l-tags-block');if(_ltags)_ltags.innerHTML=outPills?`<div style="background:var(--white);border:1px solid var(--border);border-radius:18px;padding:22px 24px;box-shadow:0 2px 12px rgba(0,0,0,0.04);"><div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:12px;">Outcome Goal</div><div style="display:flex;flex-wrap:wrap;gap:8px;">${outPills}</div></div>`:'';
  const _lunl=document.getElementById('l-unlocks');if(_lunl)_lunl.innerHTML=q.unlocks.map(u=>`<div class="unlock-card"><div class="unlock-icon">${u.i}</div><h4>${u.t}</h4><p>${u.p}</p></div>`).join('');
  const statsBar=document.getElementById('l-stats-bar');
  const diffMap={'Starter Quest':'Beginner-friendly','Epic Quest':'Moderate','Boss Quest':'Challenging','Legendary':'Expert'};
  const statsData=[
    {icon:'⏱️',label:'Timeline',val:q.duration||'Varies'},
    {icon:'📊',label:'Difficulty',val:diffMap[q.level]||q.level||'Moderate'},
    {icon:'💰',label:'Monthly budget',val:q.monthlyBudget||q.budget||'Varies'},
    {icon:'📅',label:'Best time to go',val:q.bestTime||'Year-round'}
  ];
  statsBar.innerHTML=statsData.map(s=>`<div class="qs-item"><div class="qs-icon">${s.icon}</div><div><div class="qs-label">${s.label}</div><div class="qs-val">${s.val}</div></div></div>`).join('');
  const _limm=document.getElementById('l-immersive');if(_limm)_limm.textContent=q.immersive;
  // ── OPTION A: RESOURCE KIT (top-tier programs + essentials near top) ──
  const _lrk=document.getElementById('l-resource-kit');
  if(_lrk){
    const kitItems=(q.prepRows?q.prepRows[0]:q.prep?q.prep.slice(0,3):[]);
    const extraItems=(q.prepRows?q.prepRows[1]:q.prep?q.prep.slice(3,6):[]);
    const allKitItems=[...kitItems,...extraItems].slice(0,6);
    if(allKitItems.length){
      const typeLabels=['Program','Program','Program','Tool','Tool','Essential'];
      const kitHTML=allKitItems.map((p,i)=>{
        const typeLabel=i<(kitItems.length)?'Program':'Essential';
        let clickAttr='', btnAttr='';
        if(p.dealPage){clickAttr=`onclick="openDealPage('${p.dealPage}')"`;} 
        else if(p.affiliate){clickAttr=`onclick="openLink('${p.url}')"`;} 
        else {clickAttr=`onclick="openDealPage('fallback')"`;}
        return`<div class="rk-item" ${clickAttr}><div class="rk-icon" style="background:${p.bg};">${p.i}</div><div class="rk-body"><div class="rk-name">${p.t}</div><div class="rk-type">${typeLabel}</div></div></div>`;
      }).join('');
      _lrk.innerHTML=`<div class="resource-kit"><div class="resource-kit-eyebrow">What you'll need</div><div class="resource-kit-title">Essential kit for this quest</div><div class="resource-kit-sub" style="margin-bottom:18px;">Everything most people use to make this happen — programs, tools, and setup essentials.</div><div class="resource-kit-grid">${kitHTML}</div><div class="rk-cta"><span class="rk-cta-label">Full breakdown below</span><span class="rk-cta-link" onclick="document.getElementById('l-prep-rows').scrollIntoView({behavior:'smooth'})">See all resources</span></div></div>`;
      _lrk.style.display='block';
    } else { _lrk.style.display='none'; }
  }

  const _allPrep=q.prep||[];
  const _lpath=document.getElementById('l-path');if(_lpath)_lpath.innerHTML=q.path.map((s,i)=>`<div class="path-item"><div class="path-circle">${i+1}</div><div class="path-body"><strong>${s.t}</strong><p>${s.p}</p></div></div>`).join('');
  const _lemb=document.getElementById('l-embark');if(_lemb)_lemb.innerHTML=q.embark.map((e,i)=>`<div class="embark-item"><div class="e-num">${i+1}</div><div class="e-body"><strong>${e.t}</strong><p>${e.p}</p></div></div>`).join('');
  const _prepTiers=[
    {label:'Programs & Experiences',sub:'Structured programs, courses & placements',cls:'t1'},
    {label:'Get Set Up',sub:'Tools, services & essentials',cls:'t2'},
    {label:'Free Resources',sub:'Guides, checklists & free planning tools',cls:'t3'}
  ];
  const prepRows=q.prepRows||[q.prep.slice(0,3),q.prep.slice(3,6),q.prep.slice(6,9)];
  const _lprep=document.getElementById('l-prep-rows');if(_lprep)_lprep.innerHTML=_prepTiers.map((tier,ri)=>{
    const rowItems=prepRows[ri]||[];
    if(!rowItems.length)return'';
    const items=rowItems.map(p=>{
      let cardClick='', btn;
      if(p.dealPage){
        cardClick=`onclick="openDealPage('${p.dealPage}')" style="cursor:pointer;"`;
        btn=`<button class="btn-dark" style="background:var(--orange);" onclick="event.stopPropagation();openDealPage('${p.dealPage}')">${p.btn}</button>`;
      } else if(p.affiliate){
        cardClick=`onclick="openLink('${p.url}')" style="cursor:pointer;"`;
        btn=`<button class="btn-dark" style="background:var(--orange);" onclick="event.stopPropagation();openLink('${p.url}')">${p.btn}</button>`;
      } else {
        cardClick=`onclick="openDealPage('fallback')" style="cursor:pointer;"`;
        btn=`<button class="btn-dark" style="background:var(--orange);" onclick="event.stopPropagation();">${p.btn}</button>`;
      }
      return`<div class="reel-card" ${cardClick}><div class="reel-img" style="background:${p.bg};">${p.i}</div><div class="reel-body"><h4>${p.t}</h4>${btn}</div></div>`;
    }).join('');
    return`<div class="prep-tier ${tier.cls}"><div class="prep-tier-header"><div class="prep-tier-num">${ri+1}</div><div><div class="prep-tier-label">${tier.label}</div></div><span class="prep-tier-sub">${tier.sub}</span></div><div class="reel-grid">${items}</div></div>`;
  }).join('');
  const _lfaq=document.getElementById('l-faq');if(_lfaq)_lfaq.innerHTML=q.faq.map((f,i)=>`<div class="fq"><div class="fq-q" onclick="toggleFaq(${i})"><span>${f.q}</span><div class="fq-ico" id="fi${i}">+</div></div><div class="fq-a" id="fa${i}"><p>${f.a}</p></div></div>`).join('');

  // ── QUEST SEQUENCE ──
  const _seqMap={
    japan:    {id:'freelance',art:'💻',title:'Go freelance in 90 days',    why:"A ski season proves you can live anywhere. Freelance income means you never have to stop."},
    bali:     {id:'bangkok', art:'🏙️',title:'Move to Bangkok',             why:'After Bali, Bangkok is the natural next base — lower cost, bigger city, same freedom.'},
    bangkok:  {id:'lisbon',  art:'🏛️',title:'Move to Lisbon',              why:'Bangkok is the gateway. Lisbon is the upgrade — EU base, Atlantic lifestyle.'},
    lisbon:   {id:'freelance',art:'💻',title:'Go freelance in 90 days',    why:'Lisbon is best when income follows you. Freelance makes that permanent.'},
    france:   {id:'japan',   art:'🏔️',title:'Ski season in Japan',         why:"France in autumn, Japan in winter — the seasonal worker's natural progression."},
    moto:     {id:'france',  art:'🍷',title:'Grape harvest in France',      why:'After Europe by bike, a château harvest is the obvious follow-up adventure.'},
    housesit: {id:'bali',    art:'🏄',title:'Surf instructor in Bali',      why:'House sitting proves the lifestyle. Bali gives you the next chapter.'},
    medellin: {id:'bangkok', why:"Medell\u00edn is Latin America's gem. Bangkok is Asia's — costs even less."},
    freelance:{id:'bangkok', art:'🏙️',title:'Move to Bangkok',             why:'Once you\'re freelance, Bangkok becomes obvious — best cost-to-quality on earth.'},
    lisbon2:  {id:'earn-skill',art:'🎓',title:'Get a high-value cert',     why:'Lisbon + a new credential opens every European market simultaneously.'}
  };
  const _lseq=document.getElementById('l-quest-sequence');
  if(_lseq){
    const seq=_seqMap[id];
    if(seq){
      _lseq.innerHTML=`<div class="quest-sequence"><div class="qs-seq-art">${seq.art}</div><div class="qs-seq-left"><div class="qs-seq-eyebrow">Do this next</div><div class="qs-seq-title">${seq.title}</div><div class="qs-seq-why">${seq.why}</div></div><button class="qs-seq-btn" onclick="showListing('${seq.id}')">See quest</button></div>`;
      _lseq.style.display='block';
    } else { _lseq.style.display='none'; }
  }

  // ── LISTING WIDGET ──
  const _lwidget=document.getElementById('listing-widget');
  if(_lwidget){
    const wmap={japan:{val:'japan'},bali:{val:'bali'},bangkok:{val:'bangkok'},france:{val:'france'},moto:{val:'moto'},housesit:{val:'housesit'},lisbon:{val:'lisbon'},medellin:{val:'medellin'},freelance:{val:'freelance'}};
    const wid=wmap[id]?.val||'';
    _lwidget.innerHTML=buildWidgetHTML('listing-'+id, wid);
    initWidget('listing-'+id);
  }

  const _lsim=document.getElementById('l-similar');if(_lsim)_lsim.innerHTML=q.similar.map(s=>`<div class="qcard" onclick="showListing('${s.id}')" style="background:${s.bg};"><button class="qcard-save-btn" data-id="${s.id}" onclick="event.stopPropagation();mqToggleSave('${s.id}',this)">🔖</button><div class="qcard-art">${s.art}</div><div class="qcard-ov"></div><div class="qcard-badge">${s.badge}</div><div class="qcard-info"><h3>${s.title}</h3><div class="qcard-meta">${s.meta}</div></div></div>`).join('');
  showPage('listing');
}

// ── LIGHTBOX ──
function openLightbox(startIdx){
  _lbCur=startIdx;
  document.getElementById('lightbox-wrap').classList.add('show');
  document.body.style.overflow='hidden';
  _renderLb();
  _buildLbDots();
  document.addEventListener('keydown',_lbKey);
}
function closeLightbox(){
  document.getElementById('lightbox-wrap').classList.remove('show');
  document.body.style.overflow='';
  document.removeEventListener('keydown',_lbKey);
}
function handleLbBg(e){if(e.target===document.getElementById('lightbox-wrap'))closeLightbox();}
function lbNav(dir){_lbCur=(_lbCur+dir+_lbSlides.length)%_lbSlides.length;_renderLb();}
function _lbKey(e){if(e.key==='ArrowRight')lbNav(1);else if(e.key==='ArrowLeft')lbNav(-1);else if(e.key==='Escape')closeLightbox();}
function _renderLb(){
  document.getElementById('lb-bg').style.background=_lbSlides[_lbCur]||'#1a1a1a';
  document.getElementById('lb-emoji').textContent=_lbArts[_lbCur]||'🌍';
  document.getElementById('lb-counter').textContent=`${_lbCur+1} / ${_lbSlides.length}`;
  document.querySelectorAll('.lb-dot').forEach((d,i)=>d.classList.toggle('on',i===_lbCur));
  const names=['Main view','Top view','Interior','Atmosphere'];
  document.getElementById('lb-caption').textContent=names[_lbCur]||'';
}
function _buildLbDots(){
  const el=document.getElementById('lb-dots');
  el.innerHTML=_lbSlides.map((_,i)=>`<div class="lb-dot${i===_lbCur?' on':''}" onclick="_lbCur=${i};_renderLb();_buildLbDots()"></div>`).join('');
}

function goTo(n){gcur=n;}
function gslide(dir){gcur=(gcur+dir+4)%4;}
function toggleFaq(i){const a=document.getElementById('fa'+i),ico=document.getElementById('fi'+i),was=a.classList.contains('open');document.querySelectorAll('.fq-a').forEach(el=>el.classList.remove('open'));document.querySelectorAll('.fq-ico').forEach(el=>{el.classList.remove('open');el.textContent='+';});if(!was){a.classList.add('open');ico.classList.add('open');}}

let _currentContact=null;

function setContact(type){
  _currentContact=type;
  document.getElementById('opt-wa').classList.toggle('active',type==='wa');
  document.getElementById('opt-email').classList.toggle('active',type==='email');
  const rwa=document.getElementById('reveal-wa');
  const rem=document.getElementById('reveal-email');
  rwa.classList.toggle('open',type==='wa');
  rem.classList.toggle('open',type==='email');
}

function openQuestModal(icon,title,desc){
  document.getElementById('modal-icon').textContent=icon||'🗺️';
  document.getElementById('modal-title').textContent=title||'Start your quest';
  document.getElementById('modal-desc').textContent=desc||'Tell us a bit about yourself and we\'ll send you everything you need.';
  document.getElementById('modal-form-content').style.display='block';
  document.getElementById('modal-success').style.display='none';
  document.getElementById('m-name').value='';
  document.getElementById('m-phone').value='';
  document.getElementById('m-email').value='';
  document.getElementById('m-timeline').value='';
  document.getElementById('m-comments').value='';
  _currentContact=null;
  document.getElementById('opt-wa').classList.remove('active');
  document.getElementById('opt-email').classList.remove('active');
  document.getElementById('reveal-wa').classList.remove('open');
  document.getElementById('reveal-email').classList.remove('open');
  document.getElementById('modal-wrap').classList.add('show');
  document.body.style.overflow='hidden';
}

// Keep backward compat alias
function openModal(icon,title,desc){openQuestModal(icon,title,desc);}

function closeModal(){
  document.getElementById('modal-wrap').classList.remove('show');
  document.body.style.overflow='';
}

function handleModalBgClick(e){if(e.target===document.getElementById('modal-wrap'))closeModal();}

function submitModal(){
  const name=document.getElementById('m-name').value.trim();
  const timeline=document.getElementById('m-timeline').value;
  if(!name){document.getElementById('m-name').focus();document.getElementById('m-name').style.borderColor='var(--orange)';return;}
  if(!_currentContact){document.getElementById('opt-wa').style.borderColor='var(--orange)';document.getElementById('opt-email').style.borderColor='var(--orange)';return;}
  if(!timeline){document.getElementById('m-timeline').focus();document.getElementById('m-timeline').style.borderColor='var(--orange)';return;}
  document.getElementById('modal-form-content').style.display='none';
  document.getElementById('modal-success').style.display='block';
}

function openLink(url){window.open(url,'_blank');}

// DEAL PAGE
let _previousListingId=null;

const DEALS={
  hubba:{
    heroBg:'linear-gradient(160deg,#1A2740,#243B5E,#1E3A5F)',heroIcon:'🏢',heroLabel:'Hubba Bangkok',
    badge:'Popular',title:'Hubba Co-working 3-Month Membership',
    desc:"Bangkok\'s most vibrant co-working network. 12 locations across the city, daily hot desks, private rooms, and a community of 3,000+ founders, designers, and remote workers.",
    offerLabel:'OutQuest exclusive',offerPrice:'3 months for $189',offerSaving:'Save 30% vs. walk-in rate',offerUrl:'https://hubba.co',
    whatIs:"Hubba is Bangkok\'s largest co-working network with 12 locations spread across Sukhumvit, Silom, Ari, and Ekkamai. This 3-month membership gives you unlimited hot desk access at any location, 8 hours of private room credits per month, and free event access including weekly startup and nomad meetups.",
    whoFor:'Remote workers, freelancers, and digital nomads who want a reliable workspace and instant community. If you hate working alone in a café, this is your base.',
    requirements:['Valid passport for registration','Payment via card or bank transfer','No prior co-working experience needed'],
    checklist:['Unlimited hot desk at 12 Bangkok locations','8 hrs/month private room credits','Free weekly nomad and founder meetups','Fast WiFi (1Gbps), printing, free coffee','Locker storage and dedicated phone booths','24/7 access at select locations'],
    whyUseful:"When you first arrive in Bangkok, your workspace is one of the biggest unknowns. Café WiFi is unreliable, serviced apartments are hit-or-miss, and hunting for a desk while sorting your visa and SIM card is exhausting. A Hubba membership solves that on day one — professional setup, fast internet, a built-in community, and a home base to return to every day. Most long-term Bangkok nomads credit Hubba as where they found their footing, and their first clients.",
    endH3:'Your desk in Bangkok is waiting.',endP:'Join 3,000+ members already building in Bangkok.'
  },
  'ski-jacket':{
    heroBg:'linear-gradient(160deg,#1B3A5A,#2E6A9A,#5BA3D9)',heroIcon:'🎿',heroLabel:'REI Co-op',
    badge:'Gear Pick',title:'All-Mountain Ski Jacket & Shell Layers',
    desc:'Premium outerwear for the Japanese backcountry. Waterproof, breathable, and built for Hokkaido powder days where temps drop fast and the snow doesn\'t stop.',
    offerLabel:'OutQuest pick',offerPrice:'From $189 at REI',offerSaving:'Free shipping on orders over $50',offerUrl:'https://www.rei.com',
    whatIs:'A complete layering system for ski season workers: a waterproof hardshell outer layer, a warm mid layer, and moisture-wicking base layer. REI stocks the most reliable brands used by mountain workers worldwide — Arc\'teryx, Patagonia, and their own well-reviewed house brand.',
    whoFor:'Anyone doing a ski season in Japan or any cold-weather destination. Resort workers need gear that handles both full days on the slopes and après commutes in town.',
    requirements:['Any fitness level — no skiing experience required to purchase','Check airline baggage allowance for bulky gear','Budget $300–$600 for a full layering system'],
    checklist:['Waterproof hardshell (rated 10k+ mm)','Insulated mid layer for sub-zero days','Merino wool base layers','Ski-specific fit for full range of motion','Packable options for travel','Gear rated for -15°C and below'],
    whyUseful:"Showing up to Niseko without proper layers is the most common rookie mistake. Rental shops near the resort are expensive and have limited stock. Buying before you leave means you\'re comfortable from day one — and you\'ll have gear that lasts multiple seasons.",
    endH3:'Gear up before the season starts.',endP:'Stock sells out fast for popular sizes. Order before October.'
  },
  'japan-wifi':{
    heroBg:'linear-gradient(160deg,#1A3A0A,#2A7A1A,#50C050)',heroIcon:'📶',heroLabel:'Sakura Mobile',
    badge:'Top Pick',title:'Japan Pocket WiFi — 6-Month Plan',
    desc:'Unlimited data pocket WiFi designed for long-stay visitors in Japan. 4G LTE coverage across Hokkaido, Honshu, and Kyushu — reliable even in mountain resort towns.',
    offerLabel:'OutQuest pick',offerPrice:'From ¥3,480/month',offerSaving:'Free delivery to your Japan address',offerUrl:'https://www.sakuramobile.jp',
    whatIs:"Sakura Mobile is the most popular WiFi provider among long-stay foreign workers in Japan. Their pocket WiFi devices work on Japan\'s fast 4G network and come with unlimited data — no throttling, no caps. You can share the connection with laptop and phone.",
    whoFor:'Seasonal workers, remote workers, and digital nomads living in Japan for 2–6 months who need reliable internet beyond café WiFi.',
    requirements:['Japan address or hotel for delivery','Credit or debit card for monthly billing','Smartphone or laptop to use as WiFi receiver'],
    checklist:['Unlimited 4G LTE data','Works across all of Japan including Hokkaido','Simultaneous connection for multiple devices','Free delivery to hotel or address in Japan','Easy online English support','Month-to-month billing, cancel anytime'],
    whyUseful:"Mountain resort towns in Hokkaido often have weak or overloaded café WiFi. A pocket WiFi device means you can work from the staff dorm, from your car, or from the mountain lodge on your break. It\'s the single most important piece of kit for anyone trying to stay productive during a ski season.",
    endH3:'Stay connected on the mountain.',endP:'Order in advance — delivery takes 3–5 days after arrival in Japan.'
  },
  'japan-visa-guide':{
    heroBg:'linear-gradient(160deg,#3A1A0A,#7A3A0A,#C06020)',heroIcon:'🗺️',heroLabel:'OutQuest',
    badge:'Free Resource',title:'Working Holiday Visa Guide — Japan',
    desc:'The complete step-by-step guide to applying for a Japan Working Holiday Visa. Covers eligibility, documents, processing times, and exactly what to do once you land.',
    offerLabel:'OutQuest exclusive',offerPrice:'Free — no email required',offerSaving:'Updated April 2026',offerUrl:'#',
    whatIs:"Japan\'s Working Holiday Visa (WHV) is available to citizens of 30+ countries aged 18–30. It allows you to work legally in Japan for 12 months, including in ski resort roles. This guide walks you through the full application process.",
    whoFor:'Anyone aged 18–30 from an eligible country who wants to legally work a ski season or any job in Japan.',
    requirements:['Age 18–30 at time of application','Citizen of one of 30+ eligible countries','Valid passport with at least 6 months remaining'],
    checklist:['Check your country eligibility','Required documents checklist','How to apply at the Japanese consulate','Processing time expectations','What to do on arrival (registration, bank, SIM)','How to extend your stay beyond WHV'],
    whyUseful:"The WHV process is straightforward but poorly documented in English. Most rejection stories come from missing one document or submitting at the wrong consulate. This guide eliminates that guesswork completely.",
    endH3:'Start your Japan visa process today.',endP:'Most applications are approved within 1–2 weeks when submitted correctly.'
  },
  'power-bank':{
    heroBg:'linear-gradient(160deg,#1A1A4A,#3A3A8A,#6060C0)',heroIcon:'💻',heroLabel:'Amazon',
    badge:'Essential Gear',title:'Portable Power Bank + Universal Travel Adapter',
    desc:'A high-capacity power bank (20,000mAh+) and universal travel adapter bundle — essential for keeping your phone and laptop charged across Japan\'s mountain resorts.',
    offerLabel:'OutQuest pick',offerPrice:'From $34 on Amazon',offerSaving:'Ships internationally',offerUrl:'https://www.amazon.com',
    whatIs:"A 20,000mAh power bank gives you 3–4 full phone charges or enough to top up a laptop. Paired with a universal adapter that covers Japan\'s Type A plugs and 100V current, it covers every charging situation on a long trip.",
    whoFor:'Travellers heading to Japan, or any long-haul trip, who need to stay powered up during transit and in locations where outlets are limited.',
    requirements:['TSA carry-on rules apply — must be under 100Wh','Check airline policy on power banks over 27,000mAh','USB-C cable required (not included with all models)'],
    checklist:['20,000mAh capacity minimum','USB-C Power Delivery for laptops','Universal adapter: Type A, B, C, G, I','Japan-compatible 100V input','Lightweight enough for carry-on','TSA approved for air travel'],
    whyUseful:"Japanese resort staff dorms often have limited outlets per room. A high-capacity power bank means you\'re never hunting for a socket — and the travel adapter means you can plug in without buying converters locally at inflated prices.",
    endH3:'Stay powered up from day one.',endP:'Order before you fly — Japanese electronics are great but markedly more expensive.'
  },
  'worldnomads':{
    heroBg:'linear-gradient(160deg,#3A0A1A,#7A1A3A,#C03060)',heroIcon:'🏥',heroLabel:'World Nomads',
    badge:'Recommended',title:'Long-Stay Travel Insurance — 6 Months',
    desc:'Comprehensive travel and health insurance built for people doing ski seasons, surf stints, and long-term travel adventures. Covers medical, cancellation, and adventure sports.',
    offerLabel:'OutQuest partner',offerPrice:'From $8/day',offerSaving:'Adventure sports included at no extra cost',offerUrl:'https://www.worldnomads.com',
    whatIs:"World Nomads is the insurance provider most used by long-stay travellers and seasonal workers. Their Explorer plan covers medical evacuation, ski accidents, surf injuries, trip cancellation, and gear theft — the four things most likely to go wrong on an extended trip.",
    whoFor:'Anyone on a ski season, surf placement, or trip longer than 30 days who wants genuine peace of mind. Especially relevant if your national health cover doesn\'t extend abroad.',
    requirements:['Must purchase before leaving your home country','Age limit: under 66 for most plans','Pre-existing conditions may not be covered — check policy'],
    checklist:['Emergency medical and hospital cover','Medical evacuation cover','Ski and winter sports included','Surf and water sports included','Trip cancellation and curtailment','Gear and electronics cover up to $3,000'],
    whyUseful:"A single helicopter evacuation from a Japanese mountain costs $30,000+ without insurance. Most seasonal workers skip this until something happens — and by then it\'s too late. World Nomads is the one insurance product that actually pays out for adventure sports without hidden exclusions.",
    endH3:'Don\'t skip the insurance.',endP:'The one time you need it makes it worth every dollar.'
  },
  'duolingo':{
    heroBg:'linear-gradient(160deg,#0A2A1A,#1A6A3A,#40C070)',heroIcon:'📖',heroLabel:'Duolingo',
    badge:'Language Tool',title:'Japanese for Beginners — Duolingo Plus',
    desc:'Start building Japanese basics before you land. Even a handful of phrases earns you enormous goodwill in rural Japan — and makes daily life dramatically easier.',
    offerLabel:'OutQuest pick',offerPrice:'Free to start / $6.99/month for Plus',offerSaving:'First month free with this link',offerUrl:'https://www.duolingo.com',
    whatIs:"Duolingo\'s Japanese course covers hiragana, katakana, basic kanji, and survival phrases. The Plus tier removes ads and adds offline mode — useful in areas with patchy signal.",
    whoFor:'Anyone heading to Japan who wants to make a genuine effort at the language. You don\'t need fluency — a handful of phrases (thank you, sorry, one more beer please) goes a long way in small resort towns.',
    requirements:['Smartphone or tablet required (iOS or Android)','Free account works — Plus subscription for offline mode','15–20 minutes per day commitment recommended'],
    checklist:['Learn hiragana and katakana from scratch','Survival phrases for daily life','Ordering food, asking for directions','Numbers, prices, transport terms','Audio pronunciation practice','Offline mode for mountain areas'],
    whyUseful:"In rural Hokkaido, English is limited. Most resort towns have menus and signs in Japanese only. Even basic reading skills unlock a huge range of restaurants and experiences — and locals notice when you\'ve made the effort.",
    endH3:'Start before you land.',endP:'10 minutes a day for 3 months gets you to functional basics.'
  },
  'thailand-visa':{
    heroBg:'linear-gradient(160deg,#1A2A4A,#2A4A7A,#4070B0)',heroIcon:'💼',heroLabel:'OutQuest',
    badge:'Free Resource',title:'Thailand LTR Visa Application Pack',
    desc:'Everything you need to apply for Thailand\'s Long-Term Resident visa — document checklist, template cover letters, and a step-by-step walkthrough.',
    offerLabel:'OutQuest exclusive',offerPrice:'Free download',offerSaving:'Updated for 2026 requirements',offerUrl:'#',
    whatIs:"Thailand\'s LTR (Long-Term Resident) visa is a 10-year renewable visa for remote workers, retirees, and high-potential individuals. This pack gives you every document, template, and instruction you need to apply successfully.",
    whoFor:'Remote workers and digital nomads who want to live in Thailand legally for 1–10 years without visa runs or tourist visa limitations.',
    requirements:['Minimum $80,000/year verifiable remote income','Valid passport with 18+ months remaining','No prior visa violations in Thailand'],
    checklist:['Full document checklist','Proof of income templates','Cover letter template (editable)','Bank statement formatting guide','Application walkthrough (step-by-step)','Common rejection reasons and how to avoid them'],
    whyUseful:"The LTR visa is one of the best digital nomad visas in the world — but the application is complex and poorly documented officially. This pack has been compiled from successful applications and saves you dozens of hours of research.",
    endH3:'Get your Thailand visa sorted.',endP:'Most complete applications are approved within 20 business days.'
  },
  'bkk-apartments':{
    heroBg:'linear-gradient(160deg,#2A1A0A,#6A3A0A,#B06020)',heroIcon:'🏠',heroLabel:'Hipflat',
    badge:'Top Pick',title:'Curated Sukhumvit Apartments — Under $800',
    desc:'A hand-picked shortlist of serviced apartments, condos, and long-stay hotels in Sukhumvit and Silom that consistently rank best for nomads under $800/month.',
    offerLabel:'OutQuest curated',offerPrice:'From $400/month',offerSaving:'Most include utilities, WiFi, and gym',offerUrl:'https://www.hipflat.com',
    whatIs:'Hipflat is the leading property listing platform in Bangkok. These curated listings filter for nomad-friendly buildings — strong WiFi, month-to-month leases, close to BTS Skytrain stops, and co-working spaces nearby.',
    whoFor:'Anyone arriving in Bangkok for 1–6 months who wants a comfortable, reliable apartment without overpaying or getting stuck in a bad building.',
    requirements:['Minimum 1-month stay for most listings','Passport copy required for lease signing','Budget for first month + deposit (usually 2 months)'],
    checklist:['Month-to-month lease options','All-in pricing (utilities + WiFi + gym)','BTS Skytrain walking distance','Minimum 100Mbps WiFi verified','24/7 security and front desk','Recommended co-working space nearby'],
    whyUseful:"The first apartment you find on Airbnb in Bangkok is almost never the one you want to stay in. Bangkok has hundreds of excellent long-stay buildings — but knowing which ones are actually worth it takes months of local knowledge. This shortlist skips all that.",
    endH3:'Find your Bangkok base.',endP:'Most buildings allow same-week move-in with no long-term commitment.'
  },
  'truemove-sim':{
    heroBg:'linear-gradient(160deg,#0A2A1A,#1A6A2A,#30A040)',heroIcon:'📶',heroLabel:'True Move H',
    badge:'Recommended',title:'True Move H Tourist SIM — 90 Days',
    desc:'Thailand\'s best mobile network for nomads. 30GB/month, 4G LTE, and coverage across Bangkok and 99% of Thailand. Pick one up at Suvarnabhumi Airport the moment you land.',
    offerLabel:'OutQuest pick',offerPrice:'~$25 for 90 days',offerSaving:'Available at all 7-Elevens in Thailand',offerUrl:'https://www.amazon.com',
    whatIs:"True Move H is one of Thailand\'s two best networks (alongside AIS). Their tourist SIM offers 30GB/month at full 4G LTE speed, then unlimited at reduced speed — more than enough for daily work and calls.",
    whoFor:'Anyone arriving in Bangkok who needs data from day one. Essential for navigating via Google Maps, calling Grab taxis, and getting set up before you have a local bank account.',
    requirements:['Valid passport for SIM registration (Thai law)','Available at Suvarnabhumi and Don Mueang airports','Cash or card — from 299 THB (~$8)'],
    checklist:['30GB/month 4G LTE data','Unlimited speed after 30GB (throttled)','Works across all of Thailand','International calls and SMS add-ons available','Available at the airport on arrival','Can top up at any 7-Eleven'],
    whyUseful:"Bangkok without data is brutal. You need it for Grab (Uber equivalent), Google Maps, finding restaurants, and calling landlords. Getting your SIM at the airport arrival hall takes 10 minutes and costs less than a dinner.",
    endH3:'Get connected before you leave the airport.',endP:'Queue at the True Move H counter in the arrivals hall — takes under 10 minutes.'
  },
  'cigna-insurance':{
    heroBg:'linear-gradient(160deg,#3A0A0A,#7A1A1A,#B03030)',heroIcon:'🏥',heroLabel:'Cigna',
    badge:'Recommended',title:'International Health Insurance — Thailand',
    desc:'Full expat health cover for remote workers and long-stay visitors in Thailand. Cigna Global covers hospital stays, outpatient care, and medical evacuation with direct billing at top Bangkok hospitals.',
    offerLabel:'OutQuest partner',offerPrice:'From $60/month',offerSaving:'Direct billing at Bumrungrad and Bangkok Hospital',offerUrl:'https://www.cigna.com',
    whatIs:"Cigna Global is the most widely-used international health insurance provider among expats in Southeast Asia. Their Thailand plans offer direct billing at Bangkok\'s top private hospitals, meaning you never have to pay upfront and claim back.",
    whoFor:'Remote workers and long-stay visitors in Thailand who want peace of mind for anything from a chest infection to a hospital stay — without paying the uninsured walk-in rates at private hospitals.',
    requirements:['Age 18–74 for standard plans','Apply before departure date — no same-day cover','Pre-existing conditions subject to review'],
    checklist:['Inpatient and outpatient cover','Direct billing at major Bangkok hospitals','Medical evacuation cover','Dental add-on available','Mental health cover included','24/7 English customer support'],
    whyUseful:"Bangkok\'s private hospitals (Bumrungrad, Bangkok Hospital) are world-class — but uninsured walk-in costs are eye-watering. A basic Cigna plan costs less than two taxi rides a day and covers you for everything from a broken arm to a serious illness.",
    endH3:'Get covered before you land.',endP:'Policies take effect within 24 hours of payment.'
  },
  'bkk-guide':{
    heroBg:'linear-gradient(160deg,#0A1A3A,#1A3A7A,#3060B0)',heroIcon:'🌏',heroLabel:'OutQuest',
    badge:'Free Resource',title:'Bangkok Neighbourhood Guide — PDF',
    desc:'A nomad-focused breakdown of every Bangkok neighbourhood — where to live, where to work, where to eat, and where to avoid. Covers Sukhumvit, Silom, Ari, Ekkamai, and more.',
    offerLabel:'OutQuest exclusive',offerPrice:'Free download',offerSaving:'Updated April 2026',offerUrl:'#',
    whatIs:"A 40-page PDF guide to Bangkok\'s neighbourhoods from a nomad perspective. Covers vibe, price range, best co-working spots, best street food, BTS access, and honest notes on what the Airbnb photos don\'t show.",
    whoFor:'Anyone planning their first month in Bangkok who wants to pick the right area from the start — rather than spending the first two weeks realising you chose wrong.',
    requirements:['No requirements — free PDF, no sign-up needed','Works best alongside a confirmed arrival date','Most useful before booking your first apartment'],
    checklist:['Sukhumvit: breakdown by BTS stop','Silom: the quiet professional\'s zone','Ari: best coffee and zero tourists','Ekkamai: Bangkok\'s coolest street','Thonglor: high-end expat zone','Monthly budget estimates per area'],
    whyUseful:"Choosing the wrong neighbourhood in Bangkok is a common and expensive mistake. This guide was built from three years of living there across six different areas — and saves you the first month of figuring it out yourself.",
    endH3:'Know Bangkok before you land.',endP:'Download free — no email required.'
  },
  'surf-cert':{
    heroBg:'linear-gradient(160deg,#0A2A1A,#1A6A3A,#30A060)',heroIcon:'🏄',heroLabel:'Odysseys Surf School',
    badge:'Certification',title:'Surf Instructor Certification — ISA/PADI',
    desc:'Get your internationally recognised surf instructor certificate. ISA Level 1 is the minimum required to teach at any licensed surf school in Bali and worldwide.',
    offerLabel:'OutQuest pick',offerPrice:'From $890 (2 weeks)',offerSaving:'Most Bali surf schools hire cert holders directly',offerUrl:'https://odysseyssurfschool.com',
    whatIs:"An ISA (International Surfing Association) Level 1 Surf Instructor certificate is a 2-week intensive course covering surf pedagogy, ocean safety, board control, and first aid. It\'s the industry standard for teaching at licensed schools in Bali.",
    whoFor:'Anyone who can ride unbroken waves and wants to turn that into a legitimate income stream while living in Bali. Most successful applicants have been surfing for 1–3 years.',
    requirements:['Must be able to ride unbroken waves confidently','Basic swimming ability and ocean comfort required','Valid first aid certificate (or completed on the course)'],
    checklist:['ISA Level 1 certification (internationally recognised)','2-week intensive program','Ocean rescue and first aid included','Practical teaching assessments','Job placement assistance at partner schools','Certificate valid worldwide'],
    whyUseful:"Without certification, you can only teach at unlicensed beach operations — which are increasingly being shut down by Indonesian authorities. An ISA cert opens doors at every reputable surf school in Canggu and Seminyak and makes you hirable immediately.",
    endH3:'Get certified. Get hired. Get in the water.',endP:'Course intakes run monthly — book 4–6 weeks in advance.'
  },
  'bali-villas':{
    heroBg:'linear-gradient(160deg,#0A1A3A,#1A3A7A,#3080C0)',heroIcon:'🌊',heroLabel:'Flokq',
    badge:'Top Pick',title:'Bali Villa Finder — Canggu Under $500/month',
    desc:'A curated shortlist of private villas and co-living spaces in Canggu, Seminyak, and Uluwatu under $500/month — all verified nomad-friendly with fast WiFi and pool access.',
    offerLabel:'OutQuest curated',offerPrice:'From $300/month',offerSaving:'Most include utilities and cleaning',offerUrl:'https://www.flokq.com',
    whatIs:"Flokq specialises in nomad-friendly long-term rentals in Southeast Asia. These Bali listings are filtered for private villas with a pool, verified WiFi speed, month-to-month leases, and proximity to Canggu\'s best surf breaks.",
    whoFor:'Anyone doing a surf season in Bali who wants a private villa (not a hostel) without overpaying or getting scammed by tourist-rate Airbnb prices.',
    requirements:['Minimum 1-month stay for most listings','Passport copy required by landlord','Budget for deposit (usually 1 month upfront)'],
    checklist:['Private villa with pool access','Month-to-month lease options','Verified 50Mbps+ WiFi','5 minutes from Canggu surf breaks','Utilities and weekly cleaning included','No hidden fees'],
    whyUseful:"Canggu Airbnbs charge tourist rates — often $60–$90/night for what locals rent for $350/month. Knowing the right platforms and which areas to focus on cuts your accommodation cost by 60–70% and gets you a far better property.",
    endH3:'Find your Canggu base.',endP:'Good villas go fast in peak season (June–August). Book at least 3 weeks ahead.'
  },
  'sunscreen':{
    heroBg:'linear-gradient(160deg,#3A2A0A,#7A5A0A,#B09020)',heroIcon:'🌞',heroLabel:'Amazon',
    badge:'Daily Essential',title:'SPF 50+ Reef-Safe Sunscreen — Bulk Pack',
    desc:'Mineral reef-safe SPF 50+ sunscreen in bulk — essential for teaching surf all day in Bali. Protects you and the reef, and costs a fraction of buying locally at tourist prices.',
    offerLabel:'OutQuest pick',offerPrice:'From $28 (6-pack)',offerSaving:'Save 60%+ vs. Bali pharmacy prices',offerUrl:'https://www.amazon.com',
    whatIs:"Mineral (zinc-based) reef-safe sunscreen that meets Bali\'s increasingly enforced reef protection guidelines. Teaching surf 4–6 hours/day in equatorial sun without SPF 50+ is a fast path to sun damage. Bulk packs last a full season.",
    whoFor:'Anyone teaching surf or spending extended time outdoors in Bali. Reef-safe formulas are now required at most licensed surf schools and near protected reef areas.',
    requirements:['Pack in checked luggage — 100ml+ liquids not carry-on friendly','Order at least 2 weeks before departure','Mineral (zinc-based) formula required at licensed surf schools'],
    checklist:['SPF 50+ broad spectrum protection','Zinc oxide or titanium dioxide (reef-safe)','Water-resistant for 80 minutes','Non-nano formula (won\'t harm coral)','Bulk 6-pack lasts a full season','3x cheaper than Bali pharmacy prices'],
    whyUseful:"Sunscreen in Bali costs 3–4x more than in Western markets and the reef-safe options are limited. Bringing a bulk pack saves money and guarantees you have the right formula — not the cheap chemical stuff that damages reefs.",
    endH3:'Protect yourself and the reef.',endP:'Pack it in checked luggage — liquids over 100ml aren\'t carry-on friendly.'
  },
  'indonesia-sim':{
    heroBg:'linear-gradient(160deg,#1A1A3A,#3A3A7A,#6060B0)',heroIcon:'📶',heroLabel:'Telkomsel',
    badge:'Recommended',title:'Indonesia SIM + Data Plan — Telkomsel',
    desc:'Indonesia\'s most reliable mobile network. Telkomsel\'s tourist SIM gives you 30-day data packages across Bali and Indonesia — available at Ngurah Rai Airport and every minimart.',
    offerLabel:'OutQuest pick',offerPrice:'~$8 for 30 days (30GB)',offerSaving:'Top up at any Alfamart or Indomaret',offerUrl:'https://www.telkomsel.com',
    whatIs:"Telkomsel is Indonesia\'s largest and most reliable network. Their tourist SIM packages offer 30GB of 4G data for 30 days — renewable cheaply at any convenience store. Coverage is strong across Bali including Uluwatu and North Bali.",
    whoFor:'Anyone arriving in Bali who needs data immediately for Grab, maps, and WhatsApp. Available at the airport arrivals hall.',
    requirements:['Valid passport for SIM registration (Indonesian law)','Available at Ngurah Rai Airport arrivals hall','~IDR 120,000 (~$8) in cash or card'],
    checklist:['30GB 4G LTE data (30 days)','Coverage across all of Bali','Works in Uluwatu, Seminyak, Canggu, and Ubud','Top up at Alfamart/Indomaret nationwide','Hotspot sharing enabled','International calls add-on available'],
    whyUseful:"Bali has decent 4G coverage but it\'s not evenly distributed. Telkomsel has the strongest signal in Uluwatu (important for the surf breaks) and across North Bali. XL is cheaper but drops out more. Don\'t buy a SIM from airport touts — get it at the official counter.",
    endH3:'Get connected on arrival.',endP:'The official Telkomsel counter is in the arrivals hall — ignore the unofficial vendors.'
  },
  'worldnomads-sports':{
    heroBg:'linear-gradient(160deg,#3A0A0A,#7A1A1A,#B03030)',heroIcon:'🏥',heroLabel:'World Nomads',
    badge:'Recommended',title:'Travel Insurance for Active Sports — Bali',
    desc:'Adventure sports travel insurance covering surf accidents, motorbike incidents, and medical evacuation in Bali. World Nomads Explorer plan is the standard for active travellers.',
    offerLabel:'OutQuest partner',offerPrice:'From $8/day',offerSaving:'Surf and motorbike cover included',offerUrl:'https://www.worldnomads.com',
    whatIs:"World Nomads Explorer plan covers surf injuries, motorbike accidents (with a licence), medical evacuation from Bali (most policies exclude this), and trip cancellation. It\'s the only mass-market policy that genuinely covers the active risks of a Bali trip.",
    whoFor:'Anyone doing surf, motorbike riding, or any adventure activity in Bali. Standard travel insurance almost always excludes motorbike accidents — this doesn\'t.',
    requirements:['Must purchase before starting your trip','Valid motorcycle licence required for motorbike cover','Age 14–69 for standard Explorer plan'],
    checklist:['Surf and water sports included','Motorbike cover with valid licence','Emergency medical and hospital cover','Medical evacuation to Singapore or Australia','Trip cancellation cover','Gear cover up to $2,000'],
    whyUseful:"The Bali hospital bill for a serious surf accident or motorbike injury without insurance runs $10,000–$50,000+. The BIMC and Siloam hospitals are good but expensive. Medical evacuation to Singapore can exceed $80,000. World Nomads is not optional — it\'s the price of admission for doing this responsibly.",
    endH3:'Sort your insurance before you surf.',endP:'A motorbike accident without cover is the fastest way to end a Bali stay.'
  },
  'bali-scooter':{
    heroBg:'linear-gradient(160deg,#2A1A0A,#6A3A0A,#A06020)',heroIcon:'🛵',heroLabel:'OutQuest',
    badge:'Free Guide',title:'Bali Scooter Rental Guide + Safety Tips',
    desc:'Everything you need to know about renting and riding a scooter in Bali — which rental shops to trust, how to negotiate, and the safety basics that keep most people out of trouble.',
    offerLabel:'OutQuest exclusive',offerPrice:'Free download',offerSaving:'Updated for 2026 road rules',offerUrl:'#',
    whatIs:"A practical guide to scooter rentals in Canggu, Seminyak, and Ubud. Covers daily vs monthly rental pricing, which shops have maintained bikes, how to handle the police, and the roads most likely to catch out new riders.",
    whoFor:'Anyone in Bali planning to rent a scooter — especially first-timers. Bali\'s roads are manageable but different from Western traffic. This guide covers what rental companies and Airbnbs don\'t tell you.',
    requirements:['No requirements — free guide, no sign-up needed','A valid driving licence is required by Indonesian law to rent','Travel insurance with motorbike cover strongly recommended'],
    checklist:['Best rental shops in Canggu and Seminyak','Daily vs monthly pricing guide','How to check a bike before you ride','Most common accident spots to avoid','What to do if police stop you','Insurance requirements and workarounds'],
    whyUseful:"Around 30% of travellers in Bali have a minor scooter incident. Most are avoidable with basic prep. This guide condenses what local riders learn the hard way into a 20-minute read.",
    endH3:'Ride safe in Bali.',endP:'Download free — no email required.'
  }
};

function openDealPage(dealId){
  const deal=DEALS[dealId];
  if(!deal){return;}
  _previousListingId=window._currentListingId||null;
  // Update breadcrumb
  const _bcDeal=document.getElementById('bc-deal-title');if(_bcDeal)_bcDeal.textContent=deal.title||'Deal';
  // Build the dynamic deal page
  const page=document.getElementById('page-deal-dynamic');
  page.querySelector('.deal-back-bar').innerHTML=`<div style="max-width:560px;margin:0 auto;padding:20px 20px 0;"><button class="deal-back-btn" onclick="closeDealPage()">Back to quest</button></div>`;
  const wrap=page.querySelector('.deal-page-wrap');
  wrap.innerHTML=`
    <div class="dp-hero-img" style="background:${deal.heroBg};margin-top:20px;">
      ${deal.heroIcon}
      <div class="dp-hero-label">${deal.heroLabel}</div>
    </div>
    <div class="dp-badge">${deal.badge}</div>
    <h1 class="dp-title">${deal.title}</h1>
    <p class="dp-desc">${deal.desc}</p>
    <div class="dp-offer-box">
      <div>
        <div class="dp-offer-label">${deal.offerLabel}</div>
        <div class="dp-offer-price">${deal.offerPrice}</div>
        <div class="dp-offer-saving">${deal.offerSaving}</div>
      </div>
      <button class="dp-claim-btn" onclick="openLink('${deal.offerUrl}')">Claim offer</button>
    </div>
    <div class="dp-section"><h2>What this is</h2><p>${deal.whatIs}</p></div>
    <div class="dp-section"><h2>Who it\'s for</h2><p>${deal.whoFor}</p></div>
    ${deal.requirements ? `<div class="dp-section req-section"><h2>Requirements</h2><ul class="dp-req-list">${deal.requirements.map(r=>`<li class="dp-req-item"><span class="dp-req-dot"></span><span class="dp-req-text">${r}</span></li>`).join('')}</ul></div>` : ''}
    <div class="dp-section"><h2>What you get</h2><ul class="dp-checklist">${deal.checklist.map(c=>`<li>${c}</li>`).join('')}</ul></div>
    <div class="dp-section"><h2>Why this is useful</h2><p>${deal.whyUseful}</p></div>
    <div class="dp-end-cta"><h3>${deal.endH3}</h3><p>${deal.endP}</p><button class="dp-claim-btn" onclick="openLink('${deal.offerUrl}')">Claim offer</button></div>
  `;
  showPage('deal-dynamic');
}

function closeDealPage(){
  if(_previousListingId){
    showListing(_previousListingId);
  } else {
    showPage('listing');
  }
}

// SHARE SHEET
let _currentQuestTitle='this OutQuest';
let _currentQuestUrl='https://outquest.com/quests';

function openShareSheet(){
  const shareUrl=window.location.href;
  const title=document.getElementById('g-title')?.textContent||_currentQuestTitle;
  _currentQuestUrl=shareUrl;
  _currentQuestTitle=title;
  document.getElementById('share-url-display').textContent=shareUrl.length>50?shareUrl.slice(0,50)+'…':shareUrl;
  document.getElementById('copy-btn').textContent='Copy link';
  // Show native share if available
  if(navigator.share){document.getElementById('share-native').style.display='flex';}
  document.getElementById('share-wrap').classList.add('show');
  document.body.style.overflow='hidden';
}

function closeShareSheet(){
  document.getElementById('share-wrap').classList.remove('show');
  document.body.style.overflow='';
}

function handleShareBgClick(e){if(e.target===document.getElementById('share-wrap'))closeShareSheet();}

function shareWhatsApp(){
  const msg=encodeURIComponent(`Hey — check out this OutQuest: "${_currentQuestTitle}". Thought you might want to do this one 👀

${_currentQuestUrl}`);
  window.open(`https://wa.me/?text=${msg}`,'_blank');
  closeShareSheet();
}

function shareSMS(){
  const msg=encodeURIComponent(`Check out this OutQuest: "${_currentQuestTitle}" — ${_currentQuestUrl}`);
  window.open(`sms:?body=${msg}`,'_blank');
  closeShareSheet();
}

function shareEmail(){
  const sub=encodeURIComponent(`You need to see this OutQuest — ${_currentQuestTitle}`);
  const body=encodeURIComponent(`Hey,

I found this OutQuest and immediately thought of you:

"${_currentQuestTitle}"

${_currentQuestUrl}

Let me know if you want to do it together.`);
  window.open(`mailto:?subject=${sub}&body=${body}`);
  closeShareSheet();
}

function shareNative(){
  if(navigator.share){
    navigator.share({title:_currentQuestTitle,text:`Check out this OutQuest: "${_currentQuestTitle}"`,url:_currentQuestUrl}).catch(()=>{});
    closeShareSheet();
  }
}

function copyLink(){
  navigator.clipboard.writeText(_currentQuestUrl).then(()=>{
    const btn=document.getElementById('copy-btn');
    btn.textContent='Copied ✓';
    btn.style.background='var(--green)';
    setTimeout(()=>{btn.textContent='Copy link';btn.style.background='var(--orange)';},2200);
  }).catch(()=>{
    // fallback for older browsers
    const el=document.createElement('textarea');
    el.value=_currentQuestUrl;document.body.appendChild(el);el.select();document.execCommand('copy');document.body.removeChild(el);
    const btn=document.getElementById('copy-btn');btn.textContent='Copied ✓';
    setTimeout(()=>{btn.textContent='Copy link';},2200);
  });
}

// ── CATEGORY PAGE FILTERS (abroad / life / upgrade) ──
const _catFilters = { abroad: {}, life: {}, upgrade: {}, 'work-abroad': {}, 'relocate-abroad': {}, 'earn-skill': {}, 'side-hustle': {}, 'start-business': {}, 'level-income': {} };

function toggleCatFilter(btn) {
  const page = btn.dataset.catpage;
  const filter = btn.dataset.filter;
  const value = btn.dataset.value;
  const active = btn.classList.toggle('active');
  if (active) {
    _catFilters[page][filter] = value;
  } else {
    delete _catFilters[page][filter];
  }
  // deactivate other pills in same group+page
  document.querySelectorAll(`.qf-pill[data-catpage="${page}"][data-filter="${filter}"]`).forEach(p => {
    if (p !== btn) p.classList.remove('active');
  });
  if (active) _catFilters[page][filter] = value;
  applyCatFilters(page);
}

function clearCatFilters(page) {
  _catFilters[page] = {};
  document.querySelectorAll(`.qf-pill[data-catpage="${page}"]`).forEach(p => p.classList.remove('active'));
  applyCatFilters(page);
}

function normalizeCategoryCardDatasets(page){const grid=document.getElementById(`${page}-grid`);if(!grid)return;const pageDirection=(page==='work-abroad'||page==='relocate-abroad')?'abroad':(page==='level-income'?'upgrade':'newlife');grid.querySelectorAll('.slim-qcard').forEach(card=>{if(!card.dataset.direction)card.dataset.direction=pageDirection;if(!card.dataset.level)card.dataset.level=(page==='start-business'||page==='level-income')?'boss':'starter';if(!card.dataset.outcome)card.dataset.outcome=/surf|ski|harvest|bali|japan|france/i.test(card.textContent)?'adventure':'wellness';if(!card.dataset.difficulty)card.dataset.difficulty=card.dataset.commitment==='serious'?'hard':(card.dataset.commitment==='quick'?'easy':'moderate');if(!card.dataset.delivery)card.dataset.delivery=card.dataset.format==='online'?'online':(card.dataset.format==='inperson'?'inperson':'remotefriendly');if(!card.dataset.budgetlevel)card.dataset.budgetlevel=card.dataset.budget==='high'?'premium':(card.dataset.budget==='mid'?'comfortable':'lean');const t=(card.textContent||'').toLowerCase();if(!card.dataset.duration)card.dataset.duration=/ongoing/.test(t)?'ongoing':(/long-term|long term/.test(t)?'long':(/month|weeks|week/.test(t)?'medium':'short'));if(!card.dataset.location)card.dataset.location=/france|lisbon|portugal/.test(t)?'europe':(/medell|colombia/.test(t)?'latam':(/remote|online|worldwide/.test(t)?'remote':'asia'));});}
function applyCatFilters(page){normalizeCategoryCardDatasets(page);const filters=_catFilters[page];const grid=document.getElementById(`${page}-grid`);const empty=document.getElementById(`${page}-empty`);const countEl=document.getElementById(`${page}-count`);if(!grid)return;const cards=grid.querySelectorAll('.slim-qcard');let visible=0;cards.forEach(card=>{const match=Object.entries(filters).every(([f,v])=>card.dataset[f]===v);if(match){card.classList.remove('qf-hidden');card.style.display='';visible++;}else{card.classList.add('qf-hidden');card.style.display='none';}});const total=cards.length;if(countEl)countEl.textContent=Object.keys(filters).length===0?`Showing all ${total} quests`:`Showing ${visible} of ${total} quests`;if(empty)empty.style.display=visible===0?'block':'none';}

// ── QUEST FILTERS ──
const _activeFilters={};
const _filterLabels={
  direction:{abroad:'Move Abroad',newlife:'New Life',upgrade:'Upgrade'},
  level:{starter:'Starter',boss:'Boss',epic:'Epic',legendary:'Legendary'},
  duration:{short:'Under 2 months',medium:'2–6 months',long:'Long-term',ongoing:'Ongoing'},
  location:{asia:'Asia',europe:'Europe',latam:'Latin America',remote:'Remote / Anywhere'},
  budget:{lean:'Lean',mid:'Mid',flex:'Flex'},
  commitment:{dip:'Just a dip',seasonal:'Seasonal',fullsend:'Full send'}
};

function toggleFilter(btn){
  const filter=btn.dataset.filter;
  const value=btn.dataset.value;
  if(!_activeFilters[filter])_activeFilters[filter]=new Set();
  if(_activeFilters[filter].has(value)){
    _activeFilters[filter].delete(value);
    btn.classList.remove('active');
    if(_activeFilters[filter].size===0)delete _activeFilters[filter];
  } else {
    _activeFilters[filter].add(value);
    btn.classList.add('active');
  }
  applyFilters();
}

function applyFilters(){
  const cards=document.querySelectorAll('#quests-grid .qcard');
  let visible=0;
  cards.forEach(card=>{
    let show=true;
    for(const[filter,vals] of Object.entries(_activeFilters)){
      if(vals.size===0)continue;
      const cardVal=card.dataset[filter];
      if(!cardVal||!vals.has(cardVal)){show=false;break;}
    }
    if(show){card.classList.remove('qf-hidden');visible++;}
    else card.classList.add('qf-hidden');
  });
  // Count + empty state
  const total=cards.length;
  const countEl=document.getElementById('qf-count');
  if(Object.keys(_activeFilters).length===0){
    countEl.textContent=`Showing all ${total} quests`;
  } else {
    countEl.textContent=`${visible} quest${visible!==1?'s':''} found`;
  }
  document.getElementById('qf-empty').style.display=visible===0?'block':'none';
  // Active chips
  renderActiveChips();
}

function renderActiveChips(){
  const wrap=document.getElementById('qf-active-chips');
  const row=document.getElementById('qf-active-row');
  wrap.innerHTML='';
  let count=0;
  for(const[filter,vals] of Object.entries(_activeFilters)){
    vals.forEach(val=>{
      const label=(_filterLabels[filter]&&_filterLabels[filter][val])||val;
      const chip=document.createElement('button');
      chip.className='qf-chip';
      chip.innerHTML=`${label} <span class="qf-chip-x">✕</span>`;
      chip.onclick=()=>{
        // deactivate matching pill
        const pill=document.querySelector(`.qf-pill[data-filter="${filter}"][data-value="${val}"]`);
        if(pill)toggleFilter(pill);
      };
      wrap.appendChild(chip);
      count++;
    });
  }
  row.style.display=count>0?'block':'none';
}

function clearAllFilters(){
  for(const key of Object.keys(_activeFilters))delete _activeFilters[key];
  document.querySelectorAll('.qf-pill.active').forEach(p=>p.classList.remove('active'));
  applyFilters();
}

// ── BLOG POSTS ──
const BLOG_POSTS={
  'japan-ski':{
    tag:'Seasonal Jobs',
    title:'4 months in a Japanese ski resort — the honest version',
    date:'March 2026',readTime:'8 min read',author:'Tom W.',
    heroBg:'linear-gradient(135deg,#1B3A5A,#2E7AA8,#5BA3D9)',heroIcon:'🏔️',
    body:`
      <p>I\'m writing this from a coffee shop in Sapporo, two days before I fly home. My ski pants are hanging on a chair next to me. I have exactly ¥4,200 in my wallet, a deep tan line from my goggles, and approximately zero regrets.</p>
      <p>Four months ago, I left a product management job in Manchester with no plan beyond "get to Hokkaido before the snow melts." Here\'s what actually happened.</p>

      <h2>How I got the job</h2>
      <p>The honest answer: I applied on a Tuesday afternoon in October, heard back on Thursday, and was on a flight six weeks later. The resort — Niseko United — runs an annual hiring cycle for English-speaking staff. They want people for ski rental, ski school, hospitality, and lift operations. I got ski rental.</p>
      <p>The pay is modest (¥1,050/hour), but the deal includes subsidised staff housing, a season pass, and two free meals a day from the staff canteen. When I actually ran the numbers, I spent about $420 a month on anything beyond food and accommodation. In Manchester, that was three nights out.</p>

      <blockquote>"The mountain opens at 8:30. By 9am you\'re on a chairlift watching fresh powder catch the light. Nobody has their phone out."</blockquote>

      <h2>The staff dorm reality</h2>
      <p>I won\'t romanticise the dorm. You\'re in a room with three other people, the showers are shared, and the walls are thin enough that you know exactly what your Australian neighbour watches on his laptop at midnight.</p>
      <p>But here\'s the thing: it doesn\'t matter. You\'re not in your room. You\'re on the mountain until 5pm, then you\'re in someone\'s kitchen eating instant ramen and planning which run to hit first the next morning. The people become the point. By week three, I had closer friendships than ones I\'d had in Manchester for years.</p>

      <div class="blog-highlight">
        <strong>The numbers, honestly:</strong><br>
        Salary: ~¥105,000/month (before tax)<br>
        Housing: ¥15,000/month (subsidised)<br>
        Food: ¥0 (staff canteen, 2 meals/day)<br>
        Actual spend: ~$400/month on everything else<br>
        Season pass value: ¥120,000 — included free
      </div>

      <h2>What nobody warns you about</h2>
      <p><strong>The first two weeks are hard.</strong> You\'re jet-lagged, your Japanese is zero, you can\'t read any signs, and the work is physically tiring in a way office jobs aren\'t. Three people I arrived with left in the first fortnight. I almost did too.</p>
      <p><strong>The language barrier is real but manageable.</strong> Most guests speak English. Most colleagues are international. The locals at the convenience store are patient and kind. A translation app handles 90% of situations. By month two I had enough Japanese to order confidently at any restaurant in town.</p>
      <p><strong>Your skiing will transform.</strong> I came in as an intermediate. I left as someone who genuinely hucks double black diamonds for fun. Six days a week on the mountain does that. It\'s not subtle.</p>

      <h2>Would I do it again?</h2>
      <p>Without hesitation. The harder question is whether I\'d go back to the job I left. I\'m sitting here thinking about Japan — about Hokkaido specifically, about the powder mornings and the staff dinners and the weird quiet of a mountain town at 11pm — and I genuinely don\'t know how to explain to people what it does to you.</p>
      <p>You show up thinking it\'s a gap year thing. You leave knowing it\'s a life evidence thing. Evidence that you can go somewhere unfamiliar, build something from nothing, and be fine. Better than fine.</p>
      <p>If you\'re on the fence: go. Sort the visa first. The rest figures itself out.</p>
    `,
    related:[
      {id:'bali-honest',tag:'Seasonal Jobs',title:'What it\'s actually like to teach surf in Bali',bg:'linear-gradient(135deg,#0A2A1A,#1A7A3A,#50C070)',icon:'🏄'},
      {id:'lisbon-2k',tag:'Move Abroad',title:'I moved to Lisbon with €2,000. Here\'s what happened.',bg:'linear-gradient(135deg,#1A3A0A,#3A8A1A,#70C040)',icon:'🌿'},
      {id:'budget-nomad',tag:'Budget & Money',title:'Living on $1,000 a month abroad: the real numbers',bg:'linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)',icon:'💰'}
    ],
    questLink:{id:'japan',label:'Do this OutQuest: Ski Season in Japan'}
  },

  'lisbon-2k':{
    tag:'Move Abroad',
    title:'I moved to Lisbon with €2,000. Here\'s what happened.',
    date:'February 2026',readTime:'7 min read',author:'Maya R.',
    heroBg:'linear-gradient(135deg,#1A3A0A,#3A8A1A,#70C040)',heroIcon:'🌿',
    body:`
      <p>People kept telling me I needed at least €5,000 to move abroad properly. I had €2,000 and a job interview scheduled for two weeks after landing. I booked the flight anyway.</p>
      <p>That was seven months ago. I\'m still here. I have a flat in Mouraria, a group of friends who are actually interesting, and a salary in euros that covers everything with room to spare. Here\'s what the €2,000 actually got me, and what I\'d do differently.</p>

      <h2>Month one: the scramble</h2>
      <p>First week: hostel (€18/night, not the worst). Second week: Airbnb in someone\'s spare room while I hunted for a flat. Third week: found a room in a shared apartment in Arroios for €550/month including bills. That\'s when things stabilised.</p>
      <p>The job interview went well. I started three weeks after arriving. The Portuguese bureaucracy for the NHR visa took longer than expected — about 6 weeks for the tax number, another 4 for the residence permit. But nothing stopped me from working remotely during that period.</p>

      <blockquote>"Lisbon is a city that rewards patience. The first month tests you. By month three, you wonder how you ever lived anywhere else."</blockquote>

      <h2>The visa reality</h2>
      <p>Portugal\'s D8 digital nomad visa is genuinely good if you earn over €3,040/month (4x minimum wage). Below that, you\'re on a tourist visa until you qualify — which for most people means getting a remote job or freelance income first, then applying.</p>
      <p>I went in on a tourist visa, got the job, hit the income threshold, and applied for the D8 from inside Portugal. This works. Lisbon\'s immigration office is backed up by months, but the process itself is straightforward if your documents are clean.</p>

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
      <p><strong>I expected to be lonely.</strong> I wasn\'t. Lisbon has a huge expat and nomad community. Meetup.com, Facebook groups, and the coworking spaces are genuinely good for meeting people. I had a proper social life within six weeks.</p>

      <h2>Seven months in</h2>
      <p>I renewed my stay. I got a pay rise. I found a better flat. The €2,000 was enough to get started — it wasn\'t comfortable, but it was enough. If I were doing it again I\'d have €3,000, mostly because the bureaucracy period where you\'re waiting on visa paperwork is the moment you most want a buffer.</p>
      <p>But the honest answer is: you don\'t need as much as people tell you. You need to go first and figure it out second. Lisbon rewards that.</p>
    `,
    related:[
      {id:'best-countries',tag:'Move Abroad',title:'The 8 best countries for digital nomads in 2026',bg:'linear-gradient(135deg,#1A0A3A,#4A1A8A,#9050E0)',icon:'✈️'},
      {id:'budget-nomad',tag:'Budget & Money',title:'Living on $1,000 a month abroad: the real numbers',bg:'linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)',icon:'💰'},
      {id:'japan-ski',tag:'Seasonal Jobs',title:'4 months in a Japanese ski resort — the honest version',bg:'linear-gradient(135deg,#1B3A5A,#2E7AA8,#5BA3D9)',icon:'🏔️'}
    ],
    questLink:{id:'lisbon',label:'Do this OutQuest: Move to Lisbon'}
  },

  'freelance-6mo':{
    tag:'Upgrade Your Life',
    title:'How I went from £28k salary to freelancing in 6 months',
    date:'January 2026',readTime:'9 min read',author:'James K.',
    heroBg:'linear-gradient(135deg,#3A1A42,#8A3A8A,#C060C0)',heroIcon:'💻',
    body:`
      <p>Six months ago I was earning £28,000 a year as a junior UX designer, commuting 90 minutes each way, and Googling "how to go freelance" at 11pm on Sunday nights. Today I\'m earning more than double that, working from wherever I want, and the commute is 8 steps to my desk.</p>
      <p>Here\'s the exact path — not the highlights reel, the actual steps.</p>

      <h2>Month 1–2: build proof, not a portfolio</h2>
      <p>Most advice says "build a portfolio." My advice: build proof. There\'s a difference. A portfolio is a PDF of your past work. Proof is evidence that you can solve a specific problem for a specific type of client.</p>
      <p>I picked a niche (SaaS onboarding UX) and did three speculative redesigns of real products — unpaid, just to build case studies. Each one documented the problem, my process, and the outcome I expected. By month two I had three strong case studies for a niche with real budget.</p>

      <blockquote>"The best freelancers don\'t have broader portfolios. They have sharper positioning. Pick a lane and own it completely."</blockquote>

      <h2>Month 3: the first client</h2>
      <p>First client came from LinkedIn. I\'d been posting about onboarding UX — not "look at my work" posts, but genuine observations about products I was using. One post about Notion\'s onboarding got 4,000 views. A founder of a B2B SaaS tool DMed me asking if I did consulting.</p>
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
      <p><strong>Outreach that doesn\'t feel like outreach.</strong> I spent 20 minutes a day commenting genuinely on posts from founders in my niche. Not "great post!" — actual observations, additions, disagreements. Three of my five clients came from this before they ever saw my portfolio.</p>
      <p><strong>A retainer from month four.</strong> One client asked if I could be on call for £1,500/month for 10 hours. I said yes. That became my floor — the money that covered rent regardless of what else happened. Once you have a floor, the anxiety drops by 80%.</p>

      <h2>What I\'d do differently</h2>
      <p>Raise rates faster. I spent months 3 and 4 at rates that were fair but not premium. The clients who pushed back hardest on price were the most difficult to work with. The ones who paid without negotiating were almost always the best projects. Price filters for quality.</p>
      <p>If you\'re in a job thinking about this: you have more runway than you think. Build the proof. Post about the niche. Get one client before you quit. Then quit.</p>
    `,
    related:[
      {id:'web-design-life',tag:'Upgrade Your Life',title:'Learning web design changed my life — and took 3 months',bg:'linear-gradient(135deg,#0A1A3A,#1A4A8A,#4080D0)',icon:'⚡'},
      {id:'budget-nomad',tag:'Budget & Money',title:'Living on $1,000 a month abroad: the real numbers',bg:'linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)',icon:'💰'},
      {id:'lisbon-2k',tag:'Move Abroad',title:'I moved to Lisbon with €2,000. Here\'s what happened.',bg:'linear-gradient(135deg,#1A3A0A,#3A8A1A,#70C040)',icon:'🌿'}
    ],
    questLink:{id:'freelance',label:'Do this OutQuest: Go Freelance in 90 Days'}
  },

  'bali-honest':{
    tag:'Seasonal Jobs',
    title:'What it\'s actually like to teach surf in Bali',
    date:'April 2026',readTime:'6 min read',author:'Erin M.',
    heroBg:'linear-gradient(135deg,#0A2A1A,#1A7A3A,#50C070)',heroIcon:'🏄',
    body:`
      <p>People imagine teaching surf in Bali as a permanent holiday. It\'s not. It\'s a job — a good one, with a remarkable setting, but a job. Here\'s the unfiltered version.</p>

      <h2>The daily reality</h2>
      <p>6am wake-up. You\'re at the beach by 6:30 to set up boards and read the conditions. First lesson starts at 7. You teach until noon — sometimes 5 hours straight if the school is busy. Then you\'re free. That\'s the deal.</p>
      <p>Physically, it\'s demanding. You\'re in the water for four to five hours carrying boards, supporting students, and paddling constantly. The equatorial sun is relentless. By week two you\'ve either built the stamina for it or you\'ve quit. Most people build the stamina.</p>

      <blockquote>"By 8am he\'s standing up. You\'ve done something real. Then you\'re free. You eat a $2 nasi goreng and rent a scooter for $5/day."</blockquote>

      <h2>The certification question</h2>
      <p>You need one. An ISA Level 1 Surf Instructor certificate is the minimum for any licensed school in Bali. The unlicensed operations on Kuta beach are being systematically shut down by Indonesian authorities. Don\'t build a plan around those.</p>
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
      <p>It\'s not the money. The money is enough to live on extremely well in Bali but it\'s not life-changing income. What makes it worth it is the combination of daily physical achievement, beautiful environment, and the kind of community you can\'t manufacture.</p>
      <p>Surf schools in Canggu attract people who are curious, adventurous, and not particularly interested in the conventional path. Two months in, those people become your closest friends. The Bali experience is really a people experience dressed in sunshine.</p>
    `,
    related:[
      {id:'japan-ski',tag:'Seasonal Jobs',title:'4 months in a Japanese ski resort — the honest version',bg:'linear-gradient(135deg,#1B3A5A,#2E7AA8,#5BA3D9)',icon:'🏔️'},
      {id:'budget-nomad',tag:'Budget & Money',title:'Living on $1,000 a month abroad: the real numbers',bg:'linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)',icon:'💰'},
      {id:'best-countries',tag:'Move Abroad',title:'The 8 best countries for digital nomads in 2026',bg:'linear-gradient(135deg,#1A0A3A,#4A1A8A,#9050E0)',icon:'✈️'}
    ],
    questLink:{id:'bali',label:'Do this OutQuest: Surf Instructor in Bali'}
  },

  'budget-nomad':{
    tag:'Budget & Money',
    title:'Living on $1,000 a month abroad: the real numbers',
    date:'March 2026',readTime:'7 min read',author:'Priya S.',
    heroBg:'linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)',heroIcon:'💰',
    body:`
      <p>Every "living abroad cheap" article I read before I left was either aspirational nonsense or 10 years out of date. Here are the actual numbers from 12 months across Bangkok, Chiang Mai, and Medellín.</p>

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
      <p>You can live on $1,000 a month in Southeast Asia. But your setup costs are separate: flights, first month deposit, SIM card, any gear you need. Budget $2,500–$3,000 total to get started comfortably. The $1,000/month figure only applies once you\'re settled.</p>
    `,
    related:[
      {id:'lisbon-2k',tag:'Move Abroad',title:'I moved to Lisbon with €2,000. Here\'s what happened.',bg:'linear-gradient(135deg,#1A3A0A,#3A8A1A,#70C040)',icon:'🌿'},
      {id:'best-countries',tag:'Move Abroad',title:'The 8 best countries for digital nomads in 2026',bg:'linear-gradient(135deg,#1A0A3A,#4A1A8A,#9050E0)',icon:'✈️'},
      {id:'japan-ski',tag:'Seasonal Jobs',title:'4 months in a Japanese ski resort — the honest version',bg:'linear-gradient(135deg,#1B3A5A,#2E7AA8,#5BA3D9)',icon:'🏔️'}
    ],
    questLink:{id:'bangkok',label:'Do this OutQuest: Move to Bangkok'}
  },

  'best-countries':{
    tag:'Move Abroad',
    title:'The 8 best countries for digital nomads in 2026',
    date:'April 2026',readTime:'10 min read',author:'OutQuest',
    heroBg:'linear-gradient(135deg,#1A0A3A,#4A1A8A,#9050E0)',heroIcon:'✈️',
    body:`
      <p>The digital nomad visa landscape has changed dramatically since 2022. Here are the eight countries that consistently rank best for remote workers in 2026 — based on visa access, cost of living, infrastructure, and community.</p>

      <h2>1. Thailand — Best overall</h2>
      <p>The LTR (Long-Term Resident) visa is one of the world\'s best nomad visas: 10-year renewable, tax benefits for qualified applicants, and Bangkok is arguably the world\'s best city for the cost-to-quality ratio of daily life. Infrastructure is excellent. Community is enormous.</p>

      <h2>2. Portugal — Best in Europe</h2>
      <p>The D8 digital nomad visa is accessible, Lisbon and Porto are genuinely world-class cities, and the NHR tax regime (now NHR 2.0) offers tax advantages for qualifying foreign-source income. The main drawback: Lisbon has gotten expensive relative to 2020.</p>

      <h2>3. Indonesia (Bali) — Best for lifestyle</h2>
      <p>Bali\'s Digital Nomad Visa (E33G) is a 5-year renewable visa for remote workers earning over $2,000/month from foreign sources. Zero Indonesian income tax. The lifestyle — warm, outdoor, social — is unmatched anywhere in the world at that price point.</p>

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
      <p>Japan\'s Working Holiday Visa covers 30+ nationalities aged 18–30, and the new Digital Nomad Visa covers earners above ¥10M/year from overseas sources. Japan costs more than Southeast Asia but delivers a quality of life and depth of cultural experience that has no equivalent.</p>

      <h2>8. Estonia — Best for EU access</h2>
      <p>Estonia\'s Digital Nomad Visa grants access to the EU Schengen Zone and is valid for 12 months. Tallinn is beautiful, English-speaking, and highly digital — Estonia has more startups per capita than almost any country on earth. Good if EU residency is part of the longer-term plan.</p>
    `,
    related:[
      {id:'lisbon-2k',tag:'Move Abroad',title:'I moved to Lisbon with €2,000. Here\'s what happened.',bg:'linear-gradient(135deg,#1A3A0A,#3A8A1A,#70C040)',icon:'🌿'},
      {id:'budget-nomad',tag:'Budget & Money',title:'Living on $1,000 a month abroad: the real numbers',bg:'linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)',icon:'💰'},
      {id:'bali-honest',tag:'Seasonal Jobs',title:'What it\'s actually like to teach surf in Bali',bg:'linear-gradient(135deg,#0A2A1A,#1A7A3A,#50C070)',icon:'🏄'}
    ],
    questLink:{id:'bali',label:'Do this OutQuest: Surf Instructor in Bali'}
  },

  'ai-website':{
    tag:'Quest Planning',
    title:'How to plan your first OutQuest from scratch',
    date:'April 2026',readTime:'6 min read',author:'OutQuest',
    heroBg:'linear-gradient(135deg,#1A2A4A,#2A5A8A,#4A8AC0)',heroIcon:'🌐',
    body:`
      <p>Most people who want to do something like this spend six months researching and never leave. Here\'s the shortest path from "I want to do something different" to actually being somewhere different.</p>

      <h2>Step 1: Pick one thing</h2>
      <p>The biggest trap is researching everywhere at once. Bangkok vs Lisbon vs Bali vs Mexico City. Ski season vs surf teaching vs freelance vs gap year. If you\'re researching more than two options at once, you\'re in avoidance mode.</p>
      <p>Pick one. The one that gives you the lowest-grade anxiety when you imagine telling someone you\'re doing it. That\'s the one. Research that, and only that, until you\'ve either booked it or definitively ruled it out.</p>

      <h2>Step 2: Identify the one blocker</h2>
      <p>There\'s always one real blocker and several imaginary ones. The imaginary ones are: "I don\'t have enough money," "I don\'t know anyone there," "I need to sort my career first." These dissolve the moment you\'re on the other side.</p>
      <p>The real blockers are usually: visa eligibility, job or income situation, a genuine commitment you can\'t move. Identify the real one. Solve only that. Everything else follows.</p>

      <blockquote>"The most common reason people don\'t go is not money. It\'s the lack of a specific date on a calendar."</blockquote>

      <h2>Step 3: Set a date</h2>
      <p>This is the most important step. Not a vague "in the next few months." A specific date. The date changes everything — it converts the abstract desire into a logistics problem, and humans are good at solving logistics problems once they\'ve committed to the goal.</p>

      <h2>Step 4: Tell one person</h2>
      <p>Tell one person you trust. Not for permission — for accountability. Something shifts when you\'ve said it out loud to another human being. Internally it\'s easy to quietly un-decide. Externally it\'s much harder.</p>

      <h2>Step 5: Do one concrete thing today</h2>
      <p>Check your passport expiry. Look up the visa requirements. Find out how much a flight costs right now. One concrete action today is worth a hundred more hours of research. The momentum is the point.</p>
    `,
    related:[
      {id:'japan-ski',tag:'Seasonal Jobs',title:'4 months in a Japanese ski resort — the honest version',bg:'linear-gradient(135deg,#1B3A5A,#2E7AA8,#5BA3D9)',icon:'🏔️'},
      {id:'best-countries',tag:'Move Abroad',title:'The 8 best countries for digital nomads in 2026',bg:'linear-gradient(135deg,#1A0A3A,#4A1A8A,#9050E0)',icon:'✈️'},
      {id:'budget-nomad',tag:'Budget & Money',title:'Living on $1,000 a month abroad: the real numbers',bg:'linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)',icon:'💰'}
    ],
    questLink:{id:'bangkok',label:'Browse all OutQuests'}
  },

  'domain-nomad':{
    tag:'Move Abroad',
    title:'What is a digital nomad visa and why it matters',
    date:'March 2026',readTime:'5 min read',author:'OutQuest',
    heroBg:'linear-gradient(135deg,#3A1A5A,#7A3A9A,#B060D0)',heroIcon:'🌍',
    body:`
      <p>A digital nomad visa is a legal status that lets you live in a foreign country while working remotely for clients or employers outside that country. It\'s not a work permit — you can\'t use it to work for local companies. It\'s specifically for location-independent workers.</p>

      <h2>Why they exist</h2>
      <p>Countries started creating these visas around 2020–2022, partly as post-pandemic economic recovery tools, partly because the number of remote workers had made the legal grey area impossible to ignore. Before nomad visas, most remote workers lived abroad on tourist visas — technically legal for short periods but precarious for longer stays.</p>

      <h2>How they work</h2>
      <p>Most digital nomad visas require: proof of remote employment or freelance income above a threshold (usually $2,000–$3,500/month), health insurance valid in that country, and a clean criminal record. They\'re typically valid for 1–2 years and renewable.</p>

      <blockquote>"The visa is not the goal. It\'s the infrastructure that lets you pursue the goal safely and legally."</blockquote>

      <h2>Which countries have the best ones in 2026</h2>
      <p>Thailand\'s LTR Visa (10 years, tax benefits), Bali\'s Digital Nomad Visa (5 years, tax-free), Portugal\'s D8 (2 years, EU access), Colombia\'s Nomad Visa (2 years), Georgia (1 year, 1% tax), and Estonia (1 year, EU Schengen access) are currently considered the strongest options.</p>

      <h2>Do you need one?</h2>
      <p>Not always. Many countries allow 90–180 days visa-free for most Western passports. For stays under 3 months, you often don\'t need a nomad visa at all. They become important when you want to stay longer, have legal clarity, or access local banking and services.</p>
    `,
    related:[
      {id:'best-countries',tag:'Move Abroad',title:'The 8 best countries for digital nomads in 2026',bg:'linear-gradient(135deg,#1A0A3A,#4A1A8A,#9050E0)',icon:'✈️'},
      {id:'lisbon-2k',tag:'Move Abroad',title:'I moved to Lisbon with €2,000. Here\'s what happened.',bg:'linear-gradient(135deg,#1A3A0A,#3A8A1A,#70C040)',icon:'🌿'},
      {id:'budget-nomad',tag:'Budget & Money',title:'Living on $1,000 a month abroad: the real numbers',bg:'linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)',icon:'💰'}
    ],
    questLink:{id:'bangkok',label:'Do this OutQuest: Move to Bangkok'}
  },

  'web-design-life':{
    tag:'Upgrade Your Life',
    title:'Learning web design changed my life — and took 3 months',
    date:'February 2026',readTime:'6 min read',author:'Chloe T.',
    heroBg:'linear-gradient(135deg,#0A1A3A,#1A4A8A,#4080D0)',heroIcon:'⚡',
    body:`
      <p>I want to be precise about the timeline because people always round up: it was 11 weeks from opening my first Figma file to invoicing my first client. Not 6 months. Not a year. Eleven weeks.</p>

      <h2>Why web design specifically</h2>
      <p>Low barrier to entry (free tools), high demand (every business needs a website), remote-friendly by default, and you can see the output of your work immediately. It\'s one of the fastest skills to go from zero to paid work.</p>
      <p>I chose it because I could learn it on evenings and weekends without quitting my job first. I wanted to prove to myself it was viable before making any financial decisions.</p>

      <blockquote>"Week 11. Client brief landed in my inbox. £650 for a 4-page site. I said yes before I finished reading the email."</blockquote>

      <h2>The actual learning path</h2>
      <p><strong>Weeks 1–3: Figma fundamentals.</strong> YouTube tutorials, copying existing websites I liked, learning the vocabulary (frames, auto-layout, components). Free. Took about 2 hours a day.</p>
      <p><strong>Weeks 4–6: Webflow.</strong> The platform most professional freelance designers use. Has a learning curve but once it clicks, you can build almost anything without code. Free tier is enough to learn.</p>
      <p><strong>Weeks 7–9: Build spec projects.</strong> I redesigned three websites I genuinely thought were poor — a local restaurant, a freelance photographer, a yoga studio. Documented everything. That became my portfolio.</p>
      <p><strong>Weeks 10–11: Outreach.</strong> Posted my work on LinkedIn and in local business Facebook groups. Offered a free 30-minute "website review call" to local small businesses. Six people took me up on it. Two became clients.</p>

      <h2>What I\'d tell someone starting today</h2>
      <p>Don\'t wait until you\'re "ready." You\'ll never feel ready. The confidence comes from doing paid work, not from more tutorials. The point of the spec projects isn\'t to perfect your skills — it\'s to have something to show a client. Ship early. Charge less than you\'ll later think you\'re worth. Learn from the work.</p>
    `,
    related:[
      {id:'freelance-6mo',tag:'Upgrade Your Life',title:'How I went from £28k salary to freelancing in 6 months',bg:'linear-gradient(135deg,#3A1A42,#8A3A8A,#C060C0)',icon:'💻'},
      {id:'budget-nomad',tag:'Budget & Money',title:'Living on $1,000 a month abroad: the real numbers',bg:'linear-gradient(135deg,#2A1A0A,#7A4A0A,#C08020)',icon:'💰'},
      {id:'ai-website',tag:'Quest Planning',title:'How to plan your first OutQuest from scratch',bg:'linear-gradient(135deg,#1A2A4A,#2A5A8A,#4A8AC0)',icon:'🌐'}
    ],
    questLink:{id:'freelance',label:'Do this OutQuest: Go Freelance in 90 Days'}
  },

  'landing-page-life':{
    tag:'Lifestyle Design',
    title:'How to build a life you don\'t need a vacation from',
    date:'January 2026',readTime:'5 min read',author:'OutQuest',
    heroBg:'linear-gradient(135deg,#2A2A0A,#7A7A0A,#C0C020)',heroIcon:'🏡',
    body:`
      <p>The phrase "build a life you don\'t need a vacation from" gets thrown around a lot. But most people who say it are selling something. Here\'s what it actually means in practice.</p>

      <h2>The vacation problem</h2>
      <p>Vacations exist because the baseline is bad enough that you need a break from it. Two weeks in Ibiza. A long weekend somewhere nice. The break is the point. But the break ends, and you\'re back.</p>
      <p>The alternative isn\'t to never take a break — breaks are good, decompression is useful. The alternative is to reduce the gap between the break and the baseline. To make the baseline better.</p>

      <blockquote>"You don\'t need to love every Monday. You need to stop dreading them."</blockquote>

      <h2>What actually changes the baseline</h2>
      <p>Not location alone. Not income alone. The three things that consistently change the baseline: autonomy (control over your time), environment (where and how you live day-to-day), and community (the quality of the people around you).</p>
      <p>Most conventional careers offer limited autonomy, a default environment you didn\'t choose, and a community assembled by HR rather than by affinity. OutQuests are designed to change all three simultaneously — not permanently, but enough to show you what\'s possible.</p>

      <h2>The experiment mindset</h2>
      <p>You don\'t have to commit to anything permanently. A 3-month ski season doesn\'t mean you\'re becoming a ski instructor forever. It means you\'re running a 3-month experiment in a radically different version of your life.</p>
      <p>Most people who do these experiments don\'t want to go back. Some do — and that\'s fine too. What they all gain is the evidence that the baseline can be different. That turns the abstract desire ("I want more") into a concrete problem ("here\'s what I need to change").</p>
    `,
    related:[
      {id:'japan-ski',tag:'Seasonal Jobs',title:'4 months in a Japanese ski resort — the honest version',bg:'linear-gradient(135deg,#1B3A5A,#2E7AA8,#5BA3D9)',icon:'🏔️'},
      {id:'freelance-6mo',tag:'Upgrade Your Life',title:'How I went from £28k salary to freelancing in 6 months',bg:'linear-gradient(135deg,#3A1A42,#8A3A8A,#C060C0)',icon:'💻'},
      {id:'best-countries',tag:'Move Abroad',title:'The 8 best countries for digital nomads in 2026',bg:'linear-gradient(135deg,#1A0A3A,#4A1A8A,#9050E0)',icon:'✈️'}
    ],
    questLink:{id:'quests',label:'Browse all OutQuests'}
  }
};

let _previousJournalPage='journal';

// Live journal posts from the DB, injected as a JSON <script id="journal-data">
// by the server. Parsed once; falls back to the hardcoded BLOG_POSTS map below.
let _JOURNAL_DB=null;
function _journalDb(){
  if(_JOURNAL_DB!==null)return _JOURNAL_DB;
  try{
    const el=document.getElementById('journal-data');
    _JOURNAL_DB=el?JSON.parse(el.textContent||'{}'):{};
  }catch(e){_JOURNAL_DB={};}
  if(typeof window!=='undefined')window.__JOURNAL_POSTS__=_JOURNAL_DB;
  return _JOURNAL_DB;
}
// A post by id: DB first, then the hardcoded fallback.
function _journalPost(id){const db=_journalDb();return (db&&db[id])||BLOG_POSTS[id];}

function openBlogPost(postId){
  const post=_journalPost(postId);
  if(!post)return;
  _previousJournalPage=document.querySelector('.page.active')?.id?.replace('page-','')||'journal';
  // Update blog breadcrumb
  const _bcBlog=document.getElementById('bc-blog-title');if(_bcBlog)_bcBlog.textContent=post.title||'Article';
  const wrap=document.getElementById('blog-post-content');
  const relatedHTML=post.related.map(r=>`
    <div class="jg-card" onclick="openBlogPost('${r.id}')" style="cursor:pointer;">
      <div class="jg-img"><div class="jg-img-inner" style="background:${r.bg};">${r.icon}</div></div>
      <div class="jg-tag">${r.tag}</div>
      <div class="jg-date">${(_journalPost(r.id)&&_journalPost(r.id).date)||''}</div>
      <div class="jg-title">${r.title}</div>
    </div>
  `).join('');
  const questBtnHTML=post.questLink?`
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px 28px;margin:40px 0;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--orange);margin-bottom:6px;">Ready to do this?</div>
        <div style="font-size:15px;font-weight:600;color:var(--text);">Turn this story into your own quest.</div>
      </div>
      <button class="btn-orange" onclick="showListing('${post.questLink.id}')">${post.questLink.label}</button>
    </div>
  `:'';
  const _heroStyle=post.featuredImage?`background-image:url(${post.featuredImage});background-size:cover;background-position:center;`:`background:${post.heroBg};`;
  wrap.innerHTML=`
    <div class="blog-hero-img" style="${_heroStyle}">${post.featuredImage?'':post.heroIcon}</div>
    <div class="blog-tag">${post.tag}</div>
    <h1 class="blog-title">${post.title}</h1>
    <div class="blog-meta">
      <span>${post.author}</span>
      <div class="blog-meta-dot"></div>
      <span>${post.date}</span>
      <div class="blog-meta-dot"></div>
      <span>${post.readTime}</span>
    </div>
    <div class="blog-body">${post.body}</div>
    ${questBtnHTML}
    <div class="blog-related">
      <h3>More from the Journal</h3>
      <div class="journal-grid" style="grid-template-columns:repeat(3,1fr);">${relatedHTML}</div>
    </div>
  `;
  showPage('blog-post');
}

function closeBlogPost(){
  showPage(_previousJournalPage);
}

// ── PARTNER PAGE JS ──
function togglePartnerFaq(el){
  const item=el.closest('.faq-item');
  const isOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
  if(!isOpen)item.classList.add('open');
}
function toggleOffering(el){
  el.classList.toggle('active');
}
function submitPartnerForm(){
  const name=document.getElementById('pf-name').value.trim();
  const email=document.getElementById('pf-email').value.trim();
  if(!name||!email){alert('Please fill in your name and email.');return;}
  document.getElementById('partner-form-fields').style.display='none';
  document.getElementById('partner-success-state').style.display='block';
}

// ── NEWSLETTER HANDLER ──
function handleNewsletter(btn){
  const row=btn.closest('.email-row');
  const input=row?row.querySelector('input[type="email"]'):null;
  if(input&&input.value.trim()){
    // Success state
    row.innerHTML='<div style="display:flex;align-items:center;gap:12px;color:#fff;font-size:15px;font-weight:600;padding:8px 0;"><span style="font-size:24px;">🎉</span> You\'ve been Quested in!</div>';
  } else {
    if(input){input.style.borderColor='var(--orange)';input.placeholder='Enter your email first ↑';setTimeout(()=>{input.style.borderColor='';input.placeholder='Enter your email address';},2000);}
  }
}

// ── DESTINATION-SPECIFIC FILTER ──
function filterAndGoToQuestsSpecific(filterType, locationVal, questId){
  showPage('quests');
  setTimeout(()=>{
    clearAllFilters();
    // Filter by location region
    const pill=document.querySelector(`.qf-pill[data-filter="location"][data-value="${locationVal}"]`);
    if(pill){toggleFilter(pill);}
  },80);
}

// ── DESTINATION & GOAL FILTER SHORTCUTS ──
function filterAndGoToQuests(locationVal){
  showPage('quests');
  setTimeout(()=>{
    clearAllFilters();
    const pill=document.querySelector(`.qf-pill[data-filter="location"][data-value="${locationVal}"]`);
    if(pill){toggleFilter(pill);}
  },80);
}

function filterByDestination(locationVal){
  filterAndGoToQuests(locationVal);
}

function filterByOutcome(outcomeVal){
  showPage('quests');
  setTimeout(()=>{
    clearAllFilters();
    const pill=document.querySelector(`.qf-pill[data-filter="outcome"][data-value="${outcomeVal}"]`);
    if(pill){toggleFilter(pill);}
  },80);
}

const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}});
},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
function initReveal(){document.querySelectorAll('.why-cell,.qcard,.persona-card,.cat-card,.jcard,.hiw-card,.unlock-card,.reel-card,.dest-reel-card').forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(i%3)*0.08+'s';revealObserver.observe(el);});}
// Re-run reveal on page change
const _origShowPage=showPage;
window.showPage=function(id){
  closeAllNavDDs();
  _origShowPage(id);
  setTimeout(initReveal,50);
};

// Click-toggle for nav pill dropdowns
function closeAllNavDDs(){document.querySelectorAll('.nav-pill-dd').forEach(d=>d.classList.remove('dd-open'));}
document.querySelectorAll('.nav-pill-dd').forEach(dd=>{
  const btn=dd.querySelector('.nav-pill');
  const menu=dd.querySelector('.nav-pill-dropdown');
  if(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      const isOpen=dd.classList.contains('dd-open');
      closeAllNavDDs();
      if(!isOpen)dd.classList.add('dd-open');
    });
  }
  // Stop clicks inside the dropdown panel from bubbling to document
  if(menu){menu.addEventListener('click',function(e){e.stopPropagation();});}
});
document.addEventListener('click',closeAllNavDDs);
const _origShowListing=showListing;
window.showListing=function(id){_origShowListing(id);setTimeout(initReveal,80);};
initReveal();

// NAV SHADOW ON SCROLL (+ .nav-scrolled flag for the transparent-on-hero option)
function _navOnScroll(){
  const n=document.querySelector('nav');
  if(!n)return;
  const scrolled=window.scrollY>10;
  n.style.boxShadow=scrolled?'0 4px 24px rgba(0,0,0,0.08)':'none';
  n.classList.toggle('nav-scrolled',scrolled);
}
window.addEventListener('scroll',_navOnScroll,{ passive:true });
_navOnScroll();

// ── HAMBURGER MENU ──
function toggleMobileMenu(){
  const btn=document.getElementById('hamburger-btn');
  const menu=document.getElementById('mobile-menu');
  const overlay=document.getElementById('mobile-menu-overlay');
  const isOpen=menu.classList.contains('open');
  if(isOpen){
    menu.classList.remove('open');
    overlay.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow='';
  } else {
    menu.classList.add('open');
    overlay.classList.add('open');
    btn.classList.add('open');
    document.body.style.overflow='hidden';
  }
}
function closeMobileMenu(){
  const btn=document.getElementById('hamburger-btn');
  const menu=document.getElementById('mobile-menu');
  const overlay=document.getElementById('mobile-menu-overlay');
  menu.classList.remove('open');
  overlay.classList.remove('open');
  if(btn)btn.classList.remove('open');
  document.body.style.overflow='';
}

// ── PAGINATION ──
const ITEMS_PER_PAGE=24;
const _pageState={quests:1,abroad:1,life:1,upgrade:1};

function initPagination(){
  // Quests page uses .pq-grid#quests-grid with .qcard children
  // Cat pages use .slim-qcard-grid#{page}-grid with .slim-qcard children
  renderPaginatedPage('quests');
  renderPaginatedPage('abroad');
  renderPaginatedPage('life');
  renderPaginatedPage('upgrade');
}

function getQuestsCards(){return Array.from(document.querySelectorAll('#quests-grid .qcard'));}
function getCatCards(page){return Array.from(document.querySelectorAll(`#${page}-grid .slim-qcard`));}

function renderPaginatedPage(page){
  const isMain=(page==='quests');
  const allCards=isMain?getQuestsCards():getCatCards(page);
  // Only paginate visible (non-filtered) cards
  const cards=allCards.filter(c=>!c.classList.contains('qf-hidden'));
  const total=cards.length;
  const pg=document.getElementById(`${page}-pagination`);

  if(total<=ITEMS_PER_PAGE){
    cards.forEach(c=>c.style.display='');
    if(pg)pg.style.display='none';
    return;
  }
  const currentPage=_pageState[page]||1;
  const totalPages=Math.ceil(total/ITEMS_PER_PAGE);
  const start=(currentPage-1)*ITEMS_PER_PAGE;
  const end=start+ITEMS_PER_PAGE;

  cards.forEach((c,i)=>{
    c.style.display=(i>=start&&i<end)?'':'none';
  });

  // Render pagination controls
  let pgEl=document.getElementById(`${page}-pagination`);
  if(!pgEl){
    pgEl=document.createElement('div');
    pgEl.id=`${page}-pagination`;
    pgEl.className='pagination';
    const grid=document.getElementById(`${page}-grid`);
    if(grid)grid.parentNode.insertBefore(pgEl,grid.nextSibling);
  }
  pgEl.style.display='';
  pgEl.innerHTML=buildPaginationHTML(currentPage,totalPages,page);
}

function buildPaginationHTML(current,total,page){
  if(total<=1)return'';
  let html='';
  html+=`<button class="pg-btn" onclick="goToPage('${page}',${current-1})" ${current===1?'disabled':''}>←</button>`;
  for(let i=1;i<=total;i++){
    if(total>7&&i>2&&i<total-1&&Math.abs(i-current)>1){
      if(i===3||i===total-2)html+=`<span class="pg-ellipsis">…</span>`;
      continue;
    }
    html+=`<button class="pg-btn${i===current?' active':''}" onclick="goToPage('${page}',${i})">${i}</button>`;
  }
  html+=`<button class="pg-btn" onclick="goToPage('${page}',${current+1})" ${current===total?'disabled':''}>→</button>`;
  return html;
}

function goToPage(page,num){
  const isMain=(page==='quests');
  const cards=isMain?getQuestsCards():getCatCards(page);
  const total=cards.length;
  const totalPages=Math.ceil(total/ITEMS_PER_PAGE);
  if(num<1||num>totalPages)return;
  _pageState[page]=num;
  renderPaginatedPage(page);
  // Scroll to top of the grid section
  const grid=document.getElementById(`${page}-grid`);
  if(grid){const rect=grid.getBoundingClientRect();window.scrollTo({top:window.scrollY+rect.top-80,behavior:'smooth'});}
}

// Re-run pagination after filter changes
const _origApplyFilters=applyFilters;
applyFilters=function(){
  _origApplyFilters();
  _pageState.quests=1;
  renderPaginatedPage('quests');
};
const _origApplyCatFilters=applyCatFilters;
applyCatFilters=function(page){
  _origApplyCatFilters(page);
  _pageState[page]=1;
  renderPaginatedPage(page);
};

// Init pagination on load
setTimeout(initPagination,100);

// ══════════════════════════════════════════════
//  MY QUESTS ENGINE
// ══════════════════════════════════════════════

const MQ_META={
  japan:    {title:'Ski season in Japan',    meta:'3–5 months · Hokkaido',  art:'🏔️',bg:'linear-gradient(135deg,#0A2A44,#1A5A8A)'},
  bali:     {title:'Surf instructor in Bali',meta:'1–6 months · Bali',      art:'🏄',bg:'linear-gradient(135deg,#1A0A2E,#5A2A8A)'},
  bangkok:  {title:'Move to Bangkok',        meta:'Long-term · Thailand',    art:'🏙️',bg:'linear-gradient(135deg,#2A1A0A,#8A3A0A)'},
  lisbon:   {title:'Move to Lisbon',         meta:'Long-term · Portugal',    art:'🏛️',bg:'linear-gradient(135deg,#1A0A2A,#4A1A7A)'},
  france:   {title:'Grape harvest in France',meta:'6–8 weeks · Bordeaux',   art:'🍷',bg:'linear-gradient(135deg,#2A0A1A,#7A1A3A)'},
  moto:     {title:'Europe by motorcycle',   meta:'2–4 months · Europe',     art:'🏍️',bg:'linear-gradient(135deg,#0A1A3A,#1A3A8A)'},
  housesit: {title:'Full-time house sitting',meta:'Ongoing · Worldwide',     art:'🏠',bg:'linear-gradient(135deg,#0A2A10,#1A6A2A)'},
  medellin: {title:'Move to Medellín',       meta:'Long-term · Colombia',    art:'🌺',bg:'linear-gradient(135deg,#0A2A10,#1A6A2A)'},
  freelance:{title:'Go freelance in 90 days',meta:'12 weeks · Remote',       art:'💻',bg:'linear-gradient(135deg,#1A0A3A,#4A1A8A)'},
  'work-abroad':     {title:'Work abroad',               meta:'2–6 months',  art:'✈️',bg:'linear-gradient(135deg,#0A2A44,#1A5A8A)'},
  'relocate-abroad': {title:'Move abroad',               meta:'3–12 months', art:'🌍',bg:'linear-gradient(135deg,#1A3A0A,#3A8A1A)'},
  'earn-skill':      {title:'Get certified',             meta:'4–16 weeks',  art:'🎓',bg:'linear-gradient(135deg,#1A0A3A,#4A1A8A)'},
  'side-hustle':     {title:'Build a side hustle',       meta:'30–90 days',  art:'💸',bg:'linear-gradient(135deg,#1A3A1A,#2E7A1A)'},
  'start-business':  {title:'Start a small business',    meta:'3–6 months',  art:'🏢',bg:'linear-gradient(135deg,#3A0A1A,#7A1A3A)'},
  'level-income':    {title:'Level up your income skills',meta:'4–12 weeks', art:'📈',bg:'linear-gradient(135deg,#2A1A0A,#7A4A0A)'}
};

const MQ_NEXT_MAP={
  japan:    {id:'freelance',why:"A ski season proves you can live anywhere."},
  bali:     {id:'bangkok', why:'Bangkok is the natural next base after Bali.'},
  bangkok:  {id:'lisbon',  why:'Bangkok is the gateway. Lisbon is the upgrade.'},
  lisbon:   {id:'freelance',why:'Lisbon is best when income follows you.'},
  france:   {id:'japan',   why:'France in autumn, Japan in winter.'},
  moto:     {id:'france',  why:'After Europe by bike, the harvest is next.'},
  housesit: {id:'bali',    why:'House sitting proves the lifestyle. Bali is next.'},
  freelance:{id:'bangkok', why:'Once freelance, Bangkok becomes obvious.'}
};

function mqLoad(){try{return JSON.parse(localStorage.getItem('sq_my_quests')||'{}');}catch(e){return{};}}
function mqSave(d){try{localStorage.setItem('sq_my_quests',JSON.stringify(d));}catch(e){}}
function mqIsSaved(id){return!!mqLoad()[id];}

function mqAddQuest(id){
  const d=mqLoad();
  if(!d[id])d[id]={status:'exploring',savedAt:Date.now()};
  mqSave(d);mqUpdateNavBadge();mqSyncButtons();
}
function mqRemoveQuest(id){
  const d=mqLoad();delete d[id];mqSave(d);mqUpdateNavBadge();mqSyncButtons();
}
function mqSetStatus(id,status){
  const d=mqLoad();if(d[id])d[id].status=status;mqSave(d);mqRenderDrawer();
}

function mqUpdateNavBadge(){
  const n=Object.keys(mqLoad()).length;
  const b=document.getElementById('mq-nav-badge');
  if(b){b.textContent=n;b.classList.toggle('show',n>0);}
}

function mqSyncButtons(){
  const d=mqLoad();
  document.querySelectorAll('.qcard-save-btn[data-id]').forEach(btn=>{
    const saved=!!d[btn.dataset.id];
    btn.classList.toggle('saved',saved);
    btn.textContent=saved?'✅':'🔖';
  });
  document.querySelectorAll('.slim-save-btn[data-id]').forEach(btn=>{
    const saved=!!d[btn.dataset.id];
    btn.classList.toggle('saved',saved);
    btn.textContent=saved?'✅':'🔖';
  });
}

function mqToggleSave(id,btn){
  if(mqIsSaved(id)){
    mqRemoveQuest(id);
    if(btn){btn.classList.remove('saved');btn.textContent='🔖';}
  } else {
    mqAddQuest(id);
    if(btn){btn.classList.add('saved');btn.textContent='✅';}
    mqToast('🔖 Saved to My Quests');
  }
}

function mqToggleSaveFromListing(id){
  if(mqIsSaved(id)){mqRemoveQuest(id);}else{mqAddQuest(id);mqToast('🔖 Saved to My Quests');}
  const bar=document.getElementById('listing-save-bar');
  if(bar){
    const now=mqIsSaved(id);
    bar.innerHTML=
      '<button class="listing-save-btn'+(now?' saved':'')+'" onclick="mqToggleSaveFromListing(\''+id+'\')">'+
      (now?'✓ In My Quests':'🔖 Save to My Quests')+
      '</button>'+
      '<button class="listing-share-btn" onclick="openShareSheet()">Share this quest</button>'+
      '<button class="listing-view-mq'+(now?' show':'')+'" onclick="openMQDrawer()">View My Quests</button>';
  }
}

function mqToast(msg){
  let t=document.getElementById('mq-toast');
  if(!t)return;
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2200);
}

function openMQDrawer(){
  mqRenderDrawer();
  document.getElementById('mq-overlay').classList.add('open');
  document.getElementById('mq-drawer').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeMQDrawer(){
  document.getElementById('mq-overlay').classList.remove('open');
  document.getElementById('mq-drawer').classList.remove('open');
  document.body.style.overflow='';
}

function mqRenderDrawer(){
  const data=mqLoad();
  const ids=Object.keys(data).sort((a,b)=>(data[b].savedAt||0)-(data[a].savedAt||0));
  const list=document.getElementById('mq-list');
  const empty=document.getElementById('mq-empty');
  const shareRow=document.getElementById('mq-share-row');
  const nextSec=document.getElementById('mq-next-section');
  const sub=document.getElementById('mq-head-sub');
  if(!ids.length){
    empty.classList.add('show');list.innerHTML='';
    if(shareRow)shareRow.style.display='none';
    if(nextSec)nextSec.style.display='none';
    if(sub)sub.textContent='Your saved adventures';
    return;
  }
  empty.classList.remove('show');
  if(sub)sub.textContent=ids.length+' quest'+(ids.length===1?'':'s')+' saved';
  if(shareRow)shareRow.style.display='flex';
  const statuses=['exploring','committed','done'];
  const statusLabel={exploring:'Exploring',committed:'Committed',done:'Done ✓'};
  list.innerHTML=ids.map(function(id){
    const m=MQ_META[id]||{title:id,meta:'',art:'🌍',bg:'linear-gradient(135deg,#1A1A2A,#2A2A4A)'};
    const status=data[id].status||'exploring';
    const pills=statuses.map(function(s){return'<button class="mq-status-btn'+(status===s?' active-'+s:'')+'" onclick="mqSetStatus(\''+id+'\',\''+s+'\')">'+statusLabel[s]+'</button>';}).join('');
    return'<div class="mq-item"><div class="mq-item-art" style="background:'+m.bg+'">'+m.art+'</div><div class="mq-item-body"><div class="mq-item-title" onclick="closeMQDrawer();showListing(\''+id+'\')">'+m.title+'</div><div class="mq-item-meta">'+m.meta+'</div><div class="mq-item-row"><div class="mq-status">'+pills+'</div><button class="mq-remove" onclick="mqRemoveQuest(\''+id+'\');mqRenderDrawer()">✕</button></div></div></div>';
  }).join('');
  const next=MQ_NEXT_MAP[ids[0]];
  if(next&&!data[next.id]&&MQ_META[next.id]){
    const nm=MQ_META[next.id];
    document.getElementById('mq-next-art').textContent=nm.art;
    document.getElementById('mq-next-title').textContent=nm.title;
    document.getElementById('mq-next-why').textContent=next.why;
    nextSec.style.display='block';
    nextSec._nextId=next.id;
  } else { nextSec.style.display='none'; }
}

function mqGoNext(){
  const id=document.getElementById('mq-next-section')._nextId;
  if(id){closeMQDrawer();showListing(id);}
}

function mqShareWA(){
  const d=mqLoad();const ids=Object.keys(d);
  if(!ids.length)return;
  const lines=ids.map(function(id){const m=MQ_META[id];return m?'• '+m.title+' ('+m.meta+')':id;});
  const msg=encodeURIComponent('My OutQuest quest list \u{1F5FA}\uFE0F\n\n'+lines.join('\n')+'\n\noutquest.com');
  window.open('https://wa.me/?text='+msg,'_blank');
}
function mqCopyLink(){
  const btn=document.querySelector('.mq-share-copy');
  navigator.clipboard.writeText(window.location.href).then(function(){
    if(btn){const o=btn.textContent;btn.textContent='Copied ✓';setTimeout(function(){btn.textContent=o;},2000);}
  }).catch(function(){});
}

window._lastQuizPaths=[];
function mqSaveAllQuizPaths(){
  (window._lastQuizPaths||[]).forEach(function(id){if(!mqIsSaved(id))mqAddQuest(id);});
  const btn=document.getElementById('quiz-save-all-btn');
  if(btn){btn.classList.add('saved-all');btn.textContent='✓ Saved to My Quests';}
}

// ══════════════════════════════════════════════
//  QUEST BUDGET WIDGET
// ══════════════════════════════════════════════

const WIDGET_PRESETS={
  japan:    {monthly:1200,setup:800, name:'🏔️ Ski Season in Japan'},
  bali:     {monthly:900, setup:600, name:'🏄 Surf in Bali'},
  bangkok:  {monthly:1400,setup:1200,name:'🏙️ Move to Bangkok'},
  lisbon:   {monthly:1700,setup:2000,name:'🏛️ Move to Lisbon'},
  france:   {monthly:500, setup:400, name:'🍷 Harvest in France'},
  moto:     {monthly:1800,setup:3000,name:'🏍️ Europe by Motorcycle'},
  housesit: {monthly:400, setup:200, name:'🏠 House Sitting'},
  freelance:{monthly:0,   setup:300, name:'💻 Go Freelance'},
  medellin: {monthly:1000,setup:800, name:'🌺 Move to Medellín'}
};

function buildWidgetHTML(uid, preselect){
  const opts=Object.entries(WIDGET_PRESETS).map(function(e){
    const k=e[0],v=e[1];
    return '<option value="'+k+'"'+(preselect===k?' selected':'')+'>'+v.name+'</option>';
  }).join('');
  return '<div class="qb-widget-wrap" id="w-wrap-'+uid+'">'
    +'<div class="qb-widget-head">'
      +'<div class="qb-eyebrow">Quest Readiness</div>'
      +'<div class="qb-title">How much runway do you need?</div>'
      +'<div class="qb-sub">Enter your numbers — we\'ll do the math.</div>'
    +'</div>'
    +'<div class="qb-body">'
      +'<div class="qb-row">'
        +'<div class="qb-field"><label>Your Quest</label><select class="qb-select" id="wq-'+uid+'"><option value="">Pick a quest…</option>'+opts+'</select></div>'
        +'<div class="qb-field"><label>Duration</label><select class="qb-select" id="wd-'+uid+'"><option value="1">1 month</option><option value="2">2 months</option><option value="3" selected>3 months</option><option value="6">6 months</option><option value="12">12 months</option></select></div>'
      +'</div>'
      +'<div class="qb-row">'
        +'<div class="qb-field"><label>Monthly expenses at home</label><div class="qb-prefix"><span>$</span><input class="qb-input" type="number" id="wh-'+uid+'" value="2500" placeholder="2500"/></div></div>'
        +'<div class="qb-field"><label>Savings to date</label><div class="qb-prefix"><span>$</span><input class="qb-input" type="number" id="ws-'+uid+'" value="0" placeholder="0"/></div></div>'
      +'</div>'
      +'<button class="qb-calc-btn" onclick="runWidget(\''+uid+'\')">Calculate my runway ✦</button>'
      +'<div class="qb-result" id="wr-'+uid+'">'
        +'<div class="qb-result-hero">'
          +'<div class="qb-result-label">Total target savings</div>'
          +'<div class="qb-result-amount" id="wra-'+uid+'">—</div>'
          +'<div class="qb-result-sub" id="wrs-'+uid+'">—</div>'
        +'</div>'
        +'<div class="qb-breakdown" id="wrb-'+uid+'"></div>'
        +'<div class="qb-insight" id="wri-'+uid+'"></div>'
        +'<button class="qb-reset" onclick="resetWidget(\''+uid+'\')">↩ Recalculate</button>'
        +'<div class="qb-capture">'
          +'<p>Want a personalised deal list for this budget?</p>'
          +'<div class="qb-capture-row">'
            +'<input type="email" placeholder="your@email.com"/>'
            +'<button onclick="this.textContent=\'Sent ✓\';this.disabled=true">Send me the deals</button>'
          +'</div>'
        +'</div>'
      +'</div>'
    +'</div>'
  +'</div>';
}

function initWidget(uid){
  const sel=document.getElementById('wq-'+uid);
  if(sel&&sel.value)setTimeout(function(){runWidget(uid);},80);
}

function runWidget(uid){
  const sel=document.getElementById('wq-'+uid);
  if(!sel||!sel.value)return;
  const preset=WIDGET_PRESETS[sel.value];
  if(!preset)return;
  const dur=parseInt(document.getElementById('wd-'+uid).value)||3;
  const home=parseFloat(document.getElementById('wh-'+uid).value)||0;
  const savings=parseFloat(document.getElementById('ws-'+uid).value)||0;
  const living=preset.monthly*dur;
  const total=preset.setup+living;
  const needed=Math.max(0,total-savings);
  const monthsToSave=home>0?Math.ceil(needed/(home*.2)):0;
  document.getElementById('wra-'+uid).textContent='$'+total.toLocaleString();
  document.getElementById('wrs-'+uid).textContent='for '+dur+' month'+(dur!==1?'s':'')+' — '+preset.name;
  const rows=[
    {icon:'🏠',label:'Setup & first month buffer',val:'$'+preset.setup.toLocaleString()},
    {icon:'📅',label:'Monthly costs × '+dur,val:'$'+living.toLocaleString()},
    {icon:'💰',label:'Your current savings',val:savings>0?'-$'+savings.toLocaleString():'$0',neg:savings>0},
    {icon:'🎯',label:'Still needed',val:'$'+needed.toLocaleString(),hi:true}
  ];
  document.getElementById('wrb-'+uid).innerHTML=rows.map(function(r){
    return '<div class="qb-breakdown-row'+(r.hi?' highlight':'')+'"><div class="qb-bd-label">'+r.icon+' '+r.label+'</div><div class="qb-bd-val"'+(r.neg?' style="color:var(--green)"':'')+'>'+r.val+'</div></div>';
  }).join('');
  var insight='';
  if(needed<=0){
    insight='<strong>You\'re already there.</strong> Your savings cover this quest right now. The main thing left is to book it.';
  } else if(monthsToSave>0&&home>0){
    insight='<strong>Saving $'+Math.ceil(home*.2).toLocaleString()+'/month</strong> (20% of your current expenses) gets you there in about <strong>'+monthsToSave+' month'+(monthsToSave!==1?'s':'')+'</strong>. That\'s likely less time than you think.';
  } else {
    insight='<strong>$'+needed.toLocaleString()+' to go.</strong> Most people doing this quest say the hardest part was deciding, not saving.';
  }
  document.getElementById('wri-'+uid).innerHTML=insight;
  document.getElementById('wr-'+uid).classList.add('show');
}

function resetWidget(uid){
  document.getElementById('wr-'+uid).classList.remove('show');
}

function buildHomeWidget(){
  const el=document.getElementById('home-widget');
  if(el){el.innerHTML=buildWidgetHTML('home','');}
}

// Init MQ on load
document.addEventListener('DOMContentLoaded',function(){
  mqUpdateNavBadge();
  buildHomeWidget();
});
document.addEventListener('keydown',function(ev){
  if(ev.key==='Escape') sqCloseCompareModal();
});

// ===== script block 2 =====
// ── QUIZ STATE ──
const _quiz = { answers: {}, multi3: [] };

// ── Admin-editable quiz runtime data (gating flags + result paths), injected as
//    JSON <script id="quiz-data"> by the server; defaults to fully enabled. ──
function _readQuizData(){
  try{
    var el=document.getElementById('quiz-data');
    if(el){var d=JSON.parse(el.textContent||'{}');if(d&&typeof d==='object')return d;}
  }catch(e){}
  return {enabled:true,showOnHomepage:true,showOnQuests:true,resultsDisplay:'top',results:[]};
}
function _quizQuestionCount(){
  return document.querySelectorAll('#quiz-overlay .quiz-step[data-qstep]').length;
}
function _qEsc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function openQuiz(){
  var cfg=_readQuizData();
  if(cfg.enabled===false) return;                       // Draft: quiz off
  var active=document.querySelector('.page.active');
  var pid=active?active.id:'';
  if(cfg.showOnHomepage===false && (pid===''||pid==='page-home')) return;
  if(cfg.showOnQuests===false && pid==='page-quests') return;
  document.getElementById('quiz-overlay').classList.add('open');
  document.body.style.overflow='hidden';
  retakeQuiz();
}
function closeQuiz(){
  document.getElementById('quiz-overlay').classList.remove('open');
  document.body.style.overflow='';
}
function handleQuizOverlayClick(e){
  if(e.target===document.getElementById('quiz-overlay')) closeQuiz();
}

// Progress bar: based on the number of question steps the builder defined.
function setProgress(done){
  var n=_quizQuestionCount()||1;
  var bar=document.getElementById('quiz-progress-bar');
  if(bar) bar.style.width=Math.max(0,Math.min(100,(done/n)*100))+'%';
}

function nextStep(to){
  document.querySelectorAll('.quiz-step,.quiz-results').forEach(function(el){
    el.classList.remove('active');
  });
  var el=document.getElementById('quiz-step-'+to);
  if(el){ el.classList.add('active'); setProgress(Math.max(0,to-1)); }
  var box=document.getElementById('quiz-box'); if(box) box.scrollTop=0;
}

function selectOpt(el){
  var q=el.dataset.q;
  document.querySelectorAll('.quiz-opt[data-q="'+q+'"]').forEach(function(o){o.classList.remove('selected');});
  el.classList.add('selected');
  _quiz.answers[q]=el.dataset.path;
  var btn=document.getElementById('q'+q+'-next');
  if(btn) btn.removeAttribute('disabled');
}

// Navigate to a result path's CTA link (SPA page when one exists, else a hard nav).
function _quizGo(link){
  if(!link){ if(typeof showPage==='function') showPage('quests'); return; }
  if(/^https?:\/\//.test(link)){ window.location.href=link; return; }
  var slug=link.replace(/^\//,'').split(/[?#]/)[0];
  if(!slug){ window.scrollTo(0,0); return; }
  if(typeof showPage==='function' && document.getElementById('page-'+slug)){ showPage(slug); }
  else { window.location.href=link; }
}

function selectMulti(el){
  if(el.dataset.val==='everything'){
    document.querySelectorAll('.quiz-opt.multi[data-q="3"]').forEach(function(o){o.classList.remove('selected');});
    el.classList.add('selected');
    _quiz.multi3=['everything'];
  } else {
    var evEl=document.querySelector('.quiz-opt.multi[data-val="everything"]');
    if(evEl) evEl.classList.remove('selected');
    _quiz.multi3=_quiz.multi3.filter(function(v){return v!=='everything';});
    if(el.classList.contains('selected')){
      el.classList.remove('selected');
      _quiz.multi3=_quiz.multi3.filter(function(v){return v!==el.dataset.val;});
    } else {
      if(_quiz.multi3.length<3){
        el.classList.add('selected');
        _quiz.multi3.push(el.dataset.val);
      }
    }
  }
  var btn=document.getElementById('q3-next');
  if(btn){ if(_quiz.multi3.length>0) btn.removeAttribute('disabled'); else btn.setAttribute('disabled',''); }
}

// ── QUEST DATA for scoring ──
// Each quest: id, budget tiers it fits (lean/mid/premium), duration keys, bestMonths, interest tags, want tags
const QUEST_SCORE_DATA = [
  {id:'japan',     budgets:['mid','premium'],  durations:['medium'],          bestMonths:[11,12,1,2,3],  interests:['abroad','everything'],        wants:['experience','freedom','balance']},
  {id:'bali',      budgets:['lean','mid'],      durations:['medium'],          bestMonths:[4,5,6,7,8,9],  interests:['abroad','creative','everything'],wants:['experience','freedom','balance']},
  {id:'bangkok',   budgets:['lean','mid'],      durations:['long','ongoing'],  bestMonths:[11,12,1,2,3],  interests:['abroad','remote','everything'],  wants:['freedom','balance','experience']},
  {id:'lisbon',    budgets:['mid','premium'],   durations:['long','ongoing'],  bestMonths:[3,4,5,6,7,8,9,10],interests:['abroad','remote','everything'],wants:['freedom','balance','experience']},
  {id:'france',    budgets:['lean','mid'],      durations:['short'],           bestMonths:[9,10,11],      interests:['abroad','creative','everything'],wants:['experience','balance']},
  {id:'moto',      budgets:['mid','premium'],   durations:['medium'],          bestMonths:[4,5,6,7,8,9],  interests:['abroad','everything'],          wants:['freedom','experience']},
  {id:'housesit',  budgets:['lean'],            durations:['medium','long','ongoing'],bestMonths:[1,2,3,4,5,6,7,8,9,10,11,12],interests:['abroad','remote','everything'],wants:['freedom','balance']},
  {id:'medellin',  budgets:['lean','mid'],      durations:['long','ongoing'],  bestMonths:[1,2,3,4,5,6,7,8,9,10,11,12],interests:['abroad','remote','everything'],wants:['freedom','balance','experience']},
  {id:'freelance', budgets:['lean','mid','premium'],durations:['short','medium'],bestMonths:[1,2,3,4,5,6,7,8,9,10,11,12],interests:['freelance','remote','sidehustle','everything'],wants:['income','freedom','growth']},
  {'work-abroad':  false, id:'work-abroad',  budgets:['lean','mid'],      durations:['medium'],          bestMonths:[1,2,3,4,5,6,7,8,9,10,11,12],interests:['abroad','everything'],       wants:['experience','freedom','income']},
  {id:'relocate-abroad',budgets:['lean','mid','premium'],durations:['long','ongoing'],bestMonths:[1,2,3,4,5,6,7,8,9,10,11,12],interests:['abroad','remote','everything'],wants:['freedom','balance','experience']},
  {id:'earn-skill',budgets:['lean','mid'],      durations:['short','medium'],  bestMonths:[1,2,3,4,5,6,7,8,9,10,11,12],interests:['courses','remote','everything'],  wants:['income','growth']},
  {id:'side-hustle',budgets:['lean','mid'],     durations:['short','medium'],  bestMonths:[1,2,3,4,5,6,7,8,9,10,11,12],interests:['sidehustle','remote','freelance','creative','everything'],wants:['income','freedom','growth']},
  {id:'start-business',budgets:['mid','premium'],durations:['long','ongoing'], bestMonths:[1,2,3,4,5,6,7,8,9,10,11,12],interests:['business','everything'],          wants:['income','growth','freedom']},
  {id:'level-income',budgets:['lean','mid'],    durations:['short','medium'],  bestMonths:[1,2,3,4,5,6,7,8,9,10,11,12],interests:['courses','remote','freelance','everything'],wants:['income','growth']}
];

// Display meta for result cards
const QUEST_DISPLAY = {
  japan:           {icon:'🏔️',title:'Work a ski season in Japan',    meta:'3–5 months · Hokkaido',      bg:'linear-gradient(135deg,#0A2A44,#1A5A8A)',timing:'Nov – Mar'},
  bali:            {icon:'🏄',title:'Surf instructor in Bali',        meta:'1–6 months · Bali',           bg:'linear-gradient(135deg,#1A0A2E,#5A2A8A)',timing:'Apr – Sep'},
  bangkok:         {icon:'🏙️',title:'Move to Bangkok',               meta:'Long-term · Thailand',        bg:'linear-gradient(135deg,#2A1A0A,#8A3A0A)',timing:'Nov – Feb'},
  lisbon:          {icon:'🏛️',title:'Move to Lisbon',                meta:'Long-term · Portugal',        bg:'linear-gradient(135deg,#1A0A2A,#4A1A7A)',timing:'Mar – Oct'},
  france:          {icon:'🍷',title:'Grape harvest in France',        meta:'6–8 weeks · Bordeaux',        bg:'linear-gradient(135deg,#2A0A1A,#7A1A3A)',timing:'Sep – Nov'},
  moto:            {icon:'🏍️',title:'Travel Europe by motorcycle',   meta:'2–4 months · Europe',         bg:'linear-gradient(135deg,#0A1A3A,#1A3A8A)',timing:'Apr – Sep'},
  housesit:        {icon:'🏠',title:'Full-time house sitting',        meta:'Ongoing · Worldwide',         bg:'linear-gradient(135deg,#0A2A10,#1A6A2A)',timing:'Year-round'},
  medellin:        {icon:'🌺',title:'Move to Medellín',              meta:'Long-term · Colombia',        bg:'linear-gradient(135deg,#0A2A10,#1A6A2A)',timing:'Year-round'},
  freelance:       {icon:'💻',title:'Go freelance in 90 days',       meta:'12 weeks · Remote',           bg:'linear-gradient(135deg,#1A0A3A,#4A1A8A)',timing:'Year-round'},
  'work-abroad':   {icon:'✈️',title:'Work abroad',                   meta:'2–6 months · Various',        bg:'linear-gradient(135deg,#0A2A44,#1A5A8A)',timing:'Year-round'},
  'relocate-abroad':{icon:'🌍',title:'Move abroad',                  meta:'Long-term · Worldwide',       bg:'linear-gradient(135deg,#1A3A0A,#3A8A1A)',timing:'Year-round'},
  'earn-skill':    {icon:'🎓',title:'Get certified in something high-value',meta:'4–16 weeks · Remote', bg:'linear-gradient(135deg,#1A0A3A,#4A1A8A)',timing:'Year-round'},
  'side-hustle':   {icon:'💸',title:'Build a side hustle',           meta:'30–90 days · Remote',         bg:'linear-gradient(135deg,#1A3A1A,#2E7A1A)',timing:'Year-round'},
  'start-business':{icon:'🏢',title:'Start a small business',        meta:'3–6 months · Remote',         bg:'linear-gradient(135deg,#3A0A1A,#7A1A3A)',timing:'Year-round'},
  'level-income':  {icon:'📈',title:'Level up your income skills',   meta:'4–12 weeks · Remote',         bg:'linear-gradient(135deg,#2A1A0A,#7A4A0A)',timing:'Year-round'}
};

function getQuizMonth(){
  // Returns current month 1-12
  return new Date().getMonth()+1;
}

function getTimingLabel(answers){
  var t=answers['2'];
  if(t==='now') return 'Starting this month';
  if(t==='3mo') return 'Starting in ~3 months';
  if(t==='6mo') return 'Starting in ~6 months';
  return 'Flexible timing';
}

function scoreQuests(answers, multi3){
  var want=answers['1']||'open';
  var timing=answers['2']||'exploring';
  var duration=answers['4']||'medium';
  var budget=answers['5']||'mid';
  var interests=multi3.length>0?multi3:['everything'];
  var curMonth=getQuizMonth();

  // Work out which months are "soon" based on timing answer
  var soonMonths=[];
  if(timing==='now'){
    // just current month
    soonMonths=[curMonth];
  } else if(timing==='3mo'){
    for(var i=0;i<3;i++) soonMonths.push(((curMonth-1+i)%12)+1);
  } else if(timing==='6mo'){
    for(var i=0;i<6;i++) soonMonths.push(((curMonth-1+i)%12)+1);
  } else {
    // exploring — all months valid
    soonMonths=[1,2,3,4,5,6,7,8,9,10,11,12];
  }

  var scores={};
  QUEST_SCORE_DATA.forEach(function(q){
    var id=q.id;
    var score=0;

    // Budget match — hard filter (0 points if no match, big bonus if match)
    if(q.budgets.indexOf(budget)>=0) score+=4; else score-=2;

    // Duration match
    if(q.durations.indexOf(duration)>=0) score+=3;

    // Timing / seasonal match
    var monthOverlap=q.bestMonths.filter(function(m){return soonMonths.indexOf(m)>=0;});
    if(monthOverlap.length>0) score+=3;
    else if(timing!=='exploring') score-=1; // penalise out-of-season when user wants to start soon

    // Want match
    if(q.wants.indexOf(want)>=0) score+=3;

    // Interest match
    interests.forEach(function(int){
      if(q.interests.indexOf(int)>=0) score+=2;
    });

    scores[id]=score;
  });

  // Sort and return top 3
  var sorted=Object.entries(scores).sort(function(a,b){return b[1]-a[1];}).map(function(e){return e[0];});
  return sorted.slice(0,3);
}

function showQuizResults(){
  var cfg=_readQuizData();
  // Tally votes per result-path slug from the answers.
  var tally={};
  Object.keys(_quiz.answers).forEach(function(k){
    var p=_quiz.answers[k]; if(!p) return; tally[p]=(tally[p]||0)+1;
  });
  // Rank the (visible) result paths by votes, keeping builder order as tie-break.
  var results=(cfg.results||[]).filter(function(r){return r.show!==false;});
  var ranked=results.slice().sort(function(a,b){return (tally[b.slug]||0)-(tally[a.slug]||0);});
  var n = cfg.resultsDisplay==='all' ? ranked.length : (cfg.resultsDisplay==='top3' ? 3 : 1);
  var winners=ranked.slice(0,Math.max(1,n));
  window._lastQuizPaths=winners.map(function(r){return r.slug;});

  var badges=['Best match','Strong match','Worth exploring'];
  var container=document.getElementById('quiz-paths-container');
  if(container){
    container.innerHTML=winners.map(function(r,i){
      var cls=i===0?'primary':(i===1?'alt':'wild');
      return '<div class="qpath-card '+cls+'" data-quiz-cta="'+_qEsc(r.ctaLink)+'">'+
        '<div class="qpath-icon">'+_qEsc(r.icon||'🌟')+'</div>'+
        '<div class="qpath-body">'+
          '<div class="qpath-badge">'+badges[Math.min(i,2)]+'</div>'+
          '<div class="qpath-title">'+_qEsc(r.name)+'</div>'+
          (r.headline?'<div class="qpath-why">'+_qEsc(r.headline)+'</div>':'')+
          (r.subcopy?'<div class="qpath-meta"><span class="qpath-pill">'+_qEsc(r.subcopy)+'</span></div>':'')+
          (r.cta?'<button type="button" class="btn-orange qpath-cta-btn" style="margin-top:12px">'+_qEsc(r.cta)+' →</button>':'')+
        '</div>'+
      '</div>';
    }).join('');
    container.querySelectorAll('.qpath-card').forEach(function(card){
      var link=card.getAttribute('data-quiz-cta');
      var go=function(){ closeQuiz(); _quizGo(link); };
      var btn=card.querySelector('.qpath-cta-btn');
      if(btn) btn.onclick=function(ev){ev.stopPropagation();go();};
      card.onclick=go;
    });
  }

  // Results title = the winning path's headline (falls back to its name).
  var titleEl=document.getElementById('results-title');
  if(titleEl && winners[0]) titleEl.textContent=winners[0].headline||winners[0].name;

  document.querySelectorAll('.quiz-step').forEach(function(el){el.classList.remove('active');});
  document.getElementById('quiz-results').classList.add('active');
  setProgress(_quizQuestionCount());
  var box=document.getElementById('quiz-box'); if(box) box.scrollTop=0;
}

function retakeQuiz(){
  _quiz.answers={};
  _quiz.multi3=[];
  window._lastQuizPaths=[];
  document.querySelectorAll('.quiz-opt').forEach(function(el){el.classList.remove('selected');});
  // Disable only the answer-required Next buttons (the intro's Begin stays active).
  document.querySelectorAll('.quiz-next-btn').forEach(function(b){
    if(b.getAttribute('data-requires-answer')!=='0') b.setAttribute('disabled','');
  });
  document.querySelectorAll('.quiz-step,.quiz-results').forEach(function(el){el.classList.remove('active');});
  var first=document.getElementById('quiz-step-0')||document.getElementById('quiz-step-1');
  if(first) first.classList.add('active');
  setProgress(0);
  var box=document.getElementById('quiz-box'); if(box) box.scrollTop=0;
}

// ── COMMITTED LEAD CAPTURE MODAL ──
// Inject modal HTML once
(function(){
  var m=document.createElement('div');
  m.id='commit-modal-wrap';
  m.style.cssText='display:none;position:fixed;inset:0;background:rgba(15,12,8,.6);backdrop-filter:blur(8px);z-index:2000;align-items:center;justify-content:center;padding:20px;';
  m.innerHTML=
    '<div style="background:#fff;border-radius:24px;padding:32px 28px;max-width:400px;width:100%;box-shadow:0 24px 64px rgba(0,0,0,.18);position:relative;">'
      +'<button onclick="closeCommitModal()" style="position:absolute;top:14px;right:14px;background:var(--bg2);border:none;width:30px;height:30px;border-radius:50%;font-size:13px;cursor:pointer;color:var(--text2);">✕</button>'
      +'<div id="commit-modal-art" style="font-size:36px;margin-bottom:12px;"></div>'
      +'<div style="font-size:9px;font-weight:400;letter-spacing:.15em;text-transform:uppercase;color:var(--orange);margin-bottom:6px;">You\'re committed 🎯</div>'
      +'<h3 id="commit-modal-title" style="font-family:var(--serif);font-size:20px;font-weight:400;margin-bottom:8px;line-height:1.2;color:var(--text);"></h3>'
      +'<p style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:20px;">Drop your email and we\'ll send you the best programs, deals, and first steps for this quest — curated for people who are actually going.</p>'
      +'<div style="display:flex;flex-direction:column;gap:10px;">'
        +'<input type="email" id="commit-email" placeholder="your@email.com" style="padding:12px 16px;border:1.5px solid var(--border);border-radius:12px;font-family:inherit;font-size:14px;outline:none;transition:border-color .2s;" onfocus="this.style.borderColor=\'var(--orange)\'" onblur="this.style.borderColor=\'var(--border)\'">'
        +'<button onclick="submitCommitEmail()" style="background:var(--orange);color:#fff;border:none;border-radius:var(--pill-r);padding:13px;font-family:var(--serif);font-size:16px;font-weight:400;cursor:pointer;transition:all .2s;">Send me the deals</button>'
        +'<button onclick="closeCommitModal()" style="background:none;border:none;font-size:12px;color:var(--text3);cursor:pointer;text-decoration:underline;">Skip for now</button>'
      +'</div>'
      +'<div id="commit-success" style="display:none;text-align:center;padding:16px 0;">'
        +'<div style="font-size:32px;margin-bottom:10px;">✅</div>'
        +'<div style="font-family:var(--serif);font-size:18px;font-weight:400;margin-bottom:6px;">You\'re on the list.</div>'
        +'<div style="font-size:13px;color:var(--text2);">We\'ll be in touch with everything you need to make this happen.</div>'
      +'</div>'
    +'</div>';
  document.body.appendChild(m);
})();

var _commitQuestId='';
function openCommitModal(id){
  _commitQuestId=id;
  var m=document.getElementById('commit-modal-wrap');
  var d=QUEST_DISPLAY[id]||MQ_META[id]||{icon:'🗺️',title:id};
  document.getElementById('commit-modal-art').textContent=d.icon||d.art||'🗺️';
  document.getElementById('commit-modal-title').textContent=d.title||id;
  document.getElementById('commit-email').value='';
  document.getElementById('commit-success').style.display='none';
  m.style.display='flex';
  document.body.style.overflow='hidden';
  setTimeout(function(){document.getElementById('commit-email').focus();},200);
}
function closeCommitModal(){
  var m=document.getElementById('commit-modal-wrap');
  m.style.display='none';
  document.body.style.overflow='';
}
function submitCommitEmail(){
  var email=document.getElementById('commit-email').value.trim();
  if(!email||!email.includes('@')) return;
  // In production: POST to your leads endpoint
  document.getElementById('commit-success').style.display='block';
  document.querySelector('#commit-modal-wrap input').style.display='none';
  document.querySelector('#commit-modal-wrap button[onclick="submitCommitEmail()"]').style.display='none';
  document.querySelector('#commit-modal-wrap button[onclick="closeCommitModal()"]').style.display='none';
  setTimeout(closeCommitModal,2800);
}

// Hook mqSetStatus to open modal when status becomes 'committed'
var _origMqSetStatus=mqSetStatus;
mqSetStatus=function(id,status){
  _origMqSetStatus(id,status);
  if(status==='committed') setTimeout(function(){openCommitModal(id);},350);
};

/* ══ Interactive Compare Paths — up to 3, no static table ══ */
// Cards come from the admin (Homepage CMS), injected as JSON <script
// id="compare-paths-data">; falls back to the defaults below.
const sqComparePaths = (function(){
  try{
    const el=document.getElementById('compare-paths-data');
    if(el){const a=JSON.parse(el.textContent||'[]');if(Array.isArray(a)&&a.length)return a;}
  }catch(e){}
  return [
  {
    id:'work-abroad', icon:'🏕️', tag:'Work + Travel', name:'Work Abroad',
    mini:'Earn while exploring a new country.',
    score:'High adventure', cost:'$800–$3,000 setup', time:'1–6 months', income:'$$', risk:'Medium',
    difficulty:'Moderate', bestFor:'Adventure + income', firstStep:'Pick a country and check visa/season timing.',
    note:'Best when the goal is a real-life reset, not a desk-job substitute.'
  },
  {
    id:'bootcamp', icon:'💻', tag:'Career Reset', name:'Career Bootcamp',
    mini:'Build a marketable skill with a clearer job outcome.',
    score:'Most structured', cost:'$500–$8,000', time:'8–24 weeks', income:'$$$', risk:'Medium-low',
    difficulty:'Hard', bestFor:'Stable pivot', firstStep:'Choose one skill track and audit beginner lessons.',
    note:'Best when the priority is employability, structure, and a practical portfolio.'
  },
  {
    id:'gap-year', icon:'🌍', tag:'Life Reset', name:'Gap Year',
    mini:'Create breathing room without drifting aimlessly.',
    score:'Most spacious', cost:'$2,000–$10,000', time:'3–12 months', income:'$', risk:'Medium-high',
    difficulty:'Easy to start', bestFor:'Clarity + exploration', firstStep:'Set a runway, theme, and return date.',
    note:'Best when there is enough runway and the goal is clarity, not immediate income.'
  },
  {
    id:'business', icon:'🚀', tag:'High Upside', name:'Start a Business',
    mini:'Test a small offer before building a whole company.',
    score:'Highest upside', cost:'$100–$2,000 test', time:'30–90 day validation', income:'$$$$', risk:'High',
    difficulty:'Hard', bestFor:'Self-starters', firstStep:'Pick one painful problem and sell a tiny version.',
    note:'Best when uncertainty is tolerable and the first milestone is revenue, not branding.'
  },
  {
    id:'freelance', icon:'🧰', tag:'Independence', name:'Freelance',
    mini:'Turn one skill into paid client work.',
    score:'Fastest cash path', cost:'$50–$500', time:'2–8 weeks', income:'$$$', risk:'Medium',
    difficulty:'Moderate-hard', bestFor:'Fast income + flexibility', firstStep:'Package one service and pitch 20 leads.',
    note:'Best when there is already a sellable skill or the person can learn fast.'
  },
  {
    id:'relocate', icon:'🏠', tag:'Fresh Start', name:'Move Abroad',
    mini:'Build a new life chapter in a different city.',
    score:'Big lifestyle shift', cost:'$2,500–$12,000', time:'1–6 months planning', income:'Depends', risk:'Medium-high',
    difficulty:'Moderate', bestFor:'Lifestyle change', firstStep:'Shortlist cities by visa, cost, safety, and work setup.',
    note:'Best when the goal is environment change and the practical setup is planned first.'
  }
  ];
})();

let sqCompareSelected = [];

function sqInitCompare(){
  const grid = document.getElementById('sqCompareSelectGrid');
  if(!grid) return;
  grid.innerHTML = sqComparePaths.map(function(path){
    return `
      <div class="sq-compare-card" data-id="${path.id}" onclick="sqToggleCompare('${path.id}')">
        <div class="sq-compare-check">+</div>
        <div>
          <span class="sq-compare-icon">${path.icon}</span>
          <div class="sq-compare-tag">${path.tag}</div>
          <div class="sq-compare-name">${path.name}</div>
          <div class="sq-compare-mini">${path.mini}</div>
        </div>
      </div>
    `;
  }).join('');
  sqRenderCompare();
}

function sqToggleCompare(id){
  const exists = sqCompareSelected.includes(id);
  if(exists){
    sqCompareSelected = sqCompareSelected.filter(function(x){return x !== id;});
  }else{
    if(sqCompareSelected.length >= 3) return;
    sqCompareSelected.push(id);
  }
  sqRenderCompare();
}

function sqClearCompare(){
  sqCompareSelected = [];
  sqRenderCompare();
}

function sqRenderCompare(){
  const count = document.getElementById('sqCompareCount');
  const output = document.getElementById('sqCompareOutput');
  if(count) count.textContent = sqCompareSelected.length + ' / 3 selected';

  document.querySelectorAll('.sq-compare-card').forEach(function(card){
    const selected = sqCompareSelected.includes(card.dataset.id);
    const disabled = !selected && sqCompareSelected.length >= 3;
    card.classList.toggle('is-selected', selected);
    card.classList.toggle('is-disabled', disabled);
    const check = card.querySelector('.sq-compare-check');
    if(check) check.textContent = selected ? '✓' : '+';
  });

  if(!output) return;
  if(!sqCompareSelected.length){
    output.innerHTML = `
      <div class="sq-compare-empty">
        <div>
          <strong>No paths selected yet.</strong>
          <p>Choose one, two, or three cards above to build a side-by-side comparison.</p>
        </div>
      </div>
    `;
    return;
  }

  const selectedData = sqCompareSelected.map(function(id){return sqComparePaths.find(function(p){return p.id === id;});}).filter(Boolean);
  output.innerHTML = `
    <div class="sq-compare-columns" style="--sq-cols:${selectedData.length}">
      ${selectedData.map(function(path){
        return `
          <article class="sq-compare-result" data-id="${path.id}">
            <div class="sq-compare-result-head">
              <div class="sq-compare-score">${path.score}</div>
              <div>
                <div style="font-size:32px;margin-bottom:10px;">${path.icon}</div>
                <div class="sq-compare-result-name">${path.name}</div>
                <div class="sq-compare-result-fit">${path.mini}</div>
              </div>
            </div>
            <div class="sq-compare-metrics">
              <div class="sq-compare-row"><span class="sq-compare-label">Cost</span><span class="sq-compare-value">${path.cost}</span></div>
              <div class="sq-compare-row"><span class="sq-compare-label">Time</span><span class="sq-compare-value">${path.time}</span></div>
              <div class="sq-compare-row"><span class="sq-compare-label">Income</span><span class="sq-compare-value">${path.income}</span></div>
              <div class="sq-compare-row"><span class="sq-compare-label">Risk</span><span class="sq-compare-value">${path.risk}</span></div>
              <div class="sq-compare-row"><span class="sq-compare-label">Difficulty</span><span class="sq-compare-value">${path.difficulty}</span></div>
              <div class="sq-compare-row"><span class="sq-compare-label">Best for</span><span class="sq-compare-value">${path.bestFor}</span></div>
              <div class="sq-compare-row"><span class="sq-compare-label">First step</span><span class="sq-compare-value">${path.firstStep}</span></div>
              <div class="sq-compare-note">${path.note}</div>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', sqInitCompare);
}else{
  sqInitCompare();
}


/* ══ Compare discovery entry points: quiz CTA, per-card buttons, floating tray ══ */
function sqQuestToCompareId(id){
  const map={
    japan:'work-abroad',bali:'work-abroad',france:'work-abroad',harvest:'work-abroad',ski:'work-abroad',
    bangkok:'relocate',moto:'gap-year',housesit:'gap-year',nomad:'relocate',
    freelance:'freelance','side-hustle':'freelance','earn-skill':'bootcamp',bootcamp:'bootcamp',
    'work-abroad':'work-abroad','relocate-abroad':'relocate','start-business':'business','level-income':'bootcamp',business:'business',relocate:'relocate'
  };
  return map[id] || id;
}

function sqCompareQuizMatches(){
  const ids=(window._lastQuizPaths||[]).map(sqQuestToCompareId).filter(Boolean);
  const unique=[];
  ids.forEach(function(id){if(unique.indexOf(id)<0 && sqComparePaths.find(function(p){return p.id===id;})) unique.push(id);});
  if(unique.length<3){['bootcamp','work-abroad','business','freelance','relocate','gap-year'].forEach(function(id){if(unique.length<3 && unique.indexOf(id)<0) unique.push(id);});}
  sqCompareSelected=unique.slice(0,3);
  sqRenderCompare();
  closeQuiz();
  sqScrollToCompare();
}

function sqScrollToCompare(){
  const sec=document.getElementById('compare-paths');
  if(sec) sec.scrollIntoView({behavior:'smooth',block:'start'});
}

function sqCompareNow(){
  if(!sqCompareSelected.length) return;
  sqOpenCompareModal();
}

function sqBuildCompareMarkup(){
  const selectedData = sqCompareSelected.map(function(id){return sqComparePaths.find(function(p){return p.id === id;});}).filter(Boolean);
  if(!selectedData.length){
    return '<div class="sq-compare-empty"><div><strong>No paths selected yet.</strong><p>Add up to 3 paths first, then compare them side by side.</p></div></div>';
  }
  return '<div class="sq-compare-columns" style="--sq-cols:'+selectedData.length+'">'+selectedData.map(function(path){
    return '<article class="sq-compare-result" data-id="'+path.id+'">'+
      '<div class="sq-compare-result-head"><div class="sq-compare-score">'+path.score+'</div><div><div style="font-size:32px;margin-bottom:10px;">'+path.icon+'</div><div class="sq-compare-result-name">'+path.name+'</div><div class="sq-compare-result-fit">'+path.mini+'</div></div></div>'+
      '<div class="sq-compare-metrics">'+
      '<div class="sq-compare-row"><span class="sq-compare-label">Cost</span><span class="sq-compare-value">'+path.cost+'</span></div>'+
      '<div class="sq-compare-row"><span class="sq-compare-label">Time</span><span class="sq-compare-value">'+path.time+'</span></div>'+
      '<div class="sq-compare-row"><span class="sq-compare-label">Income</span><span class="sq-compare-value">'+path.income+'</span></div>'+
      '<div class="sq-compare-row"><span class="sq-compare-label">Risk</span><span class="sq-compare-value">'+path.risk+'</span></div>'+
      '<div class="sq-compare-row"><span class="sq-compare-label">Difficulty</span><span class="sq-compare-value">'+path.difficulty+'</span></div>'+
      '<div class="sq-compare-row"><span class="sq-compare-label">Best for</span><span class="sq-compare-value">'+path.bestFor+'</span></div>'+
      '<div class="sq-compare-row"><span class="sq-compare-label">First step</span><span class="sq-compare-value">'+path.firstStep+'</span></div>'+
      '<div class="sq-compare-note">'+path.note+'</div></div></article>';
  }).join('')+'</div>';
}

function sqEnsureCompareModal(){
  let modal=document.getElementById('sqCompareModal');
  if(modal) return modal;
  modal=document.createElement('div');
  modal.id='sqCompareModal';
  modal.className='sq-compare-modal';
  modal.innerHTML='<div class="sq-compare-modal-box" role="dialog" aria-modal="true" aria-label="Compare paths"><div class="sq-compare-modal-head"><div><h3>Compare your paths</h3><p>See cost, time, income, risk, difficulty, and first step side by side before choosing your next move.</p></div><button class="sq-compare-modal-close" type="button" onclick="sqCloseCompareModal()">×</button></div><div class="sq-compare-modal-body"><div id="sqCompareModalOutput"></div><div class="sq-compare-modal-actions"><button class="sq-modal-add-more" type="button" onclick="sqCloseCompareModal();sqScrollToCompare();">Add or change paths</button><button class="sq-modal-clear" type="button" onclick="sqClearCompare();sqCloseCompareModal();">Clear comparison</button></div></div></div>';
  modal.addEventListener('click',function(ev){if(ev.target===modal) sqCloseCompareModal();});
  document.body.appendChild(modal);
  return modal;
}

function sqOpenCompareModal(){
  const modal=sqEnsureCompareModal();
  const out=document.getElementById('sqCompareModalOutput');
  if(out) out.innerHTML=sqBuildCompareMarkup();
  modal.classList.add('show');
  document.body.style.overflow='hidden';
}

function sqCloseCompareModal(){
  const modal=document.getElementById('sqCompareModal');
  if(modal) modal.classList.remove('show');
  document.body.style.overflow='';
}

function sqButtonLabel(id){
  const added=sqCompareSelected.includes(id);
  if(added) return '✓ Added';
  if(sqCompareSelected.length>=3) return '+ Compare';
  return '+ Compare';
}

function sqSyncCompareButtons(){
  document.querySelectorAll('[data-sq-compare-id]').forEach(function(btn){
    const id=btn.getAttribute('data-sq-compare-id');
    const added=sqCompareSelected.includes(id);
    btn.classList.toggle('is-added',added);
    btn.textContent=sqButtonLabel(id);
    btn.title=added?'Remove from comparison':'Add to comparison';
  });
}

function sqInitCompareTray(){
  if(document.getElementById('sqCompareTray')) return;
  const tray=document.createElement('div');
  tray.id='sqCompareTray';
  tray.className='sq-compare-tray';
  tray.innerHTML='<div class="sq-tray-left"><div class="sq-tray-count" id="sqTrayCount">0/3</div><div class="sq-tray-copy"><div class="sq-tray-title" id="sqTrayTitle">Compare paths</div><div class="sq-tray-names" id="sqTrayNames">Choose up to 3</div></div></div><div class="sq-tray-actions"><button class="sq-tray-clear" onclick="sqClearCompare()">Clear</button><button class="sq-tray-compare" onclick="sqCompareNow()">Compare paths</button></div>';
  document.body.appendChild(tray);
}

function sqRenderCompareTray(){
  const tray=document.getElementById('sqCompareTray');
  if(!tray) return;
  const selectedData=sqCompareSelected.map(function(id){return sqComparePaths.find(function(p){return p.id===id;});}).filter(Boolean);
  tray.classList.toggle('show',selectedData.length>0);
  const count=document.getElementById('sqTrayCount');
  const title=document.getElementById('sqTrayTitle');
  const names=document.getElementById('sqTrayNames');
  if(count) count.textContent=selectedData.length+'/3';
  if(title) title.textContent=selectedData.length===1?'1 path selected':selectedData.length+' paths selected';
  if(names) names.textContent=selectedData.map(function(p){return p.name;}).join(' · ') || 'Choose up to 3';
}

function sqAddCardCompareButtons(){
  const candidates=document.querySelectorAll('.qcard,.home-path-card,.about-path-card,.persona-card,.cat-card,.slim-qcard');
  candidates.forEach(function(card){
    if(card.querySelector('.sq-card-compare-btn')) return;
    const onclick=card.getAttribute('onclick')||'';
    let raw='';
    let m=onclick.match(/showListing\(['"]([^'"]+)['"]\)/) || onclick.match(/showPage\(['"]([^'"]+)['"]\)/);
    if(m) raw=m[1];
    if(!raw) return;
    const id=sqQuestToCompareId(raw);
    if(!sqComparePaths.find(function(p){return p.id===id;})) return;
    const btn=document.createElement('button');
    btn.className='sq-card-compare-btn';
    btn.type='button';
    btn.setAttribute('data-sq-compare-id',id);
    btn.textContent=sqButtonLabel(id);
    btn.onclick=function(ev){ev.preventDefault();ev.stopPropagation();sqToggleCompare(id);};
    card.appendChild(btn);
  });
  sqSyncCompareButtons();
}

// Extend original renderer so all new entry points stay in sync.
const _sqOriginalRenderCompare = sqRenderCompare;
sqRenderCompare = function(){
  _sqOriginalRenderCompare();
  sqSyncCompareButtons();
  sqRenderCompareTray();
};

// Extend quiz result cards with an explicit compare action.
const _sqOriginalShowQuizResults = showQuizResults;
showQuizResults = function(){
  _sqOriginalShowQuizResults();
  document.querySelectorAll('#quiz-paths-container .qpath-card').forEach(function(card,idx){
    if(card.querySelector('.qpath-compare-row')) return;
    const raw=(window._lastQuizPaths||[])[idx];
    const id=sqQuestToCompareId(raw);
    if(!sqComparePaths.find(function(p){return p.id===id;})) return;
    const row=document.createElement('div');
    row.className='qpath-compare-row';
    row.innerHTML='<button class="sq-inline-compare-btn" data-sq-compare-id="'+id+'" type="button">'+sqButtonLabel(id)+'</button>';
    row.querySelector('button').onclick=function(ev){ev.preventDefault();ev.stopPropagation();sqToggleCompare(id);};
    const body=card.querySelector('.qpath-body') || card;
    body.appendChild(row);
  });
  sqSyncCompareButtons();
};

(function(){
  function bootCompareDiscovery(){
    sqInitCompareTray();
    sqAddCardCompareButtons();
    sqRenderCompare();
    setTimeout(sqAddCardCompareButtons,500);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootCompareDiscovery);
  else bootCompareDiscovery();
})();

document.addEventListener('keydown',function(ev){
  if(ev.key==='Escape') sqCloseCompareModal();
});

// ===== script block 3 =====
/* WHO USES US — expand cards into contextual paths */
const wusPersonaPaths = {
  lisa:{name:'Lisa',role:'Digital Nomad',page:'relocate-abroad',paths:[['Learn yoga in Bali','A guided way to live abroad, build a wellness skill, and test a softer pace.'],['Coworking retreats','Meet other remote workers while keeping your income running.'],['TEFL Thailand','Teach abroad, earn locally, and build a new chapter overseas.'],['Coliving experiences','Try a city before committing to a full relocation.']]},
  marcus:{name:'Marcus',role:'Career Switcher',page:'earn-skill',paths:[['UX design bootcamp','Turn messy career frustration into a concrete portfolio path.'],['Freelance in 90 days','Package one skill, land first clients, and build income options.'],['Apprenticeships','Learn by doing instead of going back to traditional school.'],['AI + no-code tools','Build practical skills that can become services or side income.']]},
  emma:{name:'Emma',role:'Fresh Graduate',page:'earn-skill',paths:[['Internships abroad','Get experience, travel, and a stronger CV in one move.'],['Work + travel programs','Earn, explore, and avoid jumping into the wrong 9-to-5 too fast.'],['Bootcamps','Build job-ready skills without another long degree.'],['Seasonal hospitality','Get paid experience in resorts, ski towns, and travel destinations.']]},
  aisha:{name:'Aisha',role:'Burnt Out Professional',page:'side-hustle',paths:[['Wellness retreats','Reset your nervous system while exploring a different environment.'],['House sitting','Cut living costs while trying new places slowly.'],['Sabbatical roadmap','Plan a break without turning it into chaos.'],['Low-pressure side quests','Test new identities before quitting everything.']]},
  daniel:{name:'Daniel',role:'Creator',page:'side-hustle',paths:[['UGC programs','Find paid content gigs without needing a massive audience.'],['Creator residencies','Travel, make work, and meet people building similar paths.'],['Brand ambassador programs','Turn niche taste and online presence into opportunities.'],['Freelance creator stack','Set up tools, pricing, portfolio, and outreach.']]}
};
function wusTogglePersona(key){
  const active = document.querySelector('.wus-polaroid[data-wus="'+key+'"]');
  if(!active) return;
  const alreadyOpen = active.classList.contains('is-open');
  document.querySelectorAll('.wus-polaroid').forEach(card=>{card.classList.remove('is-open');card.setAttribute('aria-expanded','false');});
  const panel = document.getElementById('wusPathPanel');
  if(panel){panel.classList.remove('is-open');panel.removeAttribute('data-open');panel.innerHTML='';}
  if(!alreadyOpen){active.classList.add('is-open');active.setAttribute('aria-expanded','true');}
}
function wusClosePanel(event){
  if(event) event.stopPropagation();
  const panel = document.getElementById('wusPathPanel');
  if(panel){panel.classList.remove('is-open');panel.removeAttribute('data-open');}
  document.querySelectorAll('.wus-polaroid').forEach(card=>{card.classList.remove('is-open');card.setAttribute('aria-expanded','false');});
}
function wusKeyToggle(event,key){
  if(event.key === 'Enter' || event.key === ' '){event.preventDefault();wusTogglePersona(key);}
}
