/**
 * ==============================================================================
 * KINDORA - NON-PROFIT & CHARITY LANDING PAGE DATA SOURCE
 * ==============================================================================
 * Single Source of Truth for all text, numbers, programs, and testimonials.
 * Easily customize any brand, cause, or counter in one place.
 */

const KINDORA_DATA = {
  // 1. BRAND & THEME CONFIGURATION
  brand: {
    name: "Kindora",
    tagline: "The Smarter Path to Creating Lasting Change",
    foundedYear: "2020",
    hqLocation: "USA",
    primaryPhone: "+1 (800) 456-7890",
    primaryEmail: "contact@kindora.org",
    headquarters: "120 Wall Street, 24th Floor, New York, NY 10005",
    currency: "$",
  },

  // 2. TOP BAR
  topBar: {
    address: "120 Wall Street, New York, NY",
    phone: "+1 (800) 456-7890",
    email: "contact@kindora.org",
    socials: [
      { name: "Facebook", icon: "facebook", url: "https://facebook.com" },
      { name: "Twitter", icon: "twitter", url: "https://twitter.com" },
      { name: "Instagram", icon: "instagram", url: "https://instagram.com" },
      { name: "LinkedIn", icon: "linkedin", url: "https://linkedin.com" }
    ]
  },

  // 3. NAVIGATION MENU
  navLinks: [
    { label: "Home", href: "#hero" },
    { label: "About Us", href: "#about" },
    { label: "Programs", href: "#causes" },
    { label: "Events", href: "#events" },
    { label: "Stories", href: "#news" },
    { label: "Contact", href: "#contact" }
  ],

  // 4. HERO SECTION
  hero: {
    headlineLead: "FIND THE POPULAR CAUSE",
    headlineAccent: "AND DONATE THEM",
    badge: "We're Since 2020 – Based in USA",
    description: "Empowering children and vulnerable communities worldwide through radical transparency, nutritious food security, education, and immediate healthcare intervention.",
    ctaPrimary: "Donate Now",
    ctaSecondary: "Explore Causes",
    photoUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
    photoAlt: "African child smiling warmly in natural golden sunlight",
    watermarkText: "KINDORA",
  },

  // 5. ABOUT SECTION
  about: {
    subtitle: "ABOUT KINDORA",
    titleMain: "Turning Compassion into",
    titleEmphasized: "Meaningful Impact",
    paragraph1: "At Kindora, we believe true charity begins with transparent accountability. Since 2020, we have bridged compassionate donors directly to grassroots relief operations across 18 countries.",
    paragraph2: "Every contribution delivers measurable, verifiable outcomes—transforming urgent emergency response into lifelong community resilience.",
    points: [
      {
        title: "Fundraising Integrity",
        description: "100% of public donations flow directly into field logistics and emergency food kits.",
        icon: "shield-check"
      },
      {
        title: "Donation Marketing",
        description: "Amplifying localized community voices through ethical storytelling without exploitation.",
        icon: "megaphone"
      }
    ],
    ctaButton: "More About Us",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800&auto=format&fit=crop",
        alt: "Young children studying with school supplies"
      },
      {
        url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop",
        alt: "Mother holding her child safely in rural clinic"
      },
      {
        url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop",
        alt: "Volunteers packing dry food rations into cartons"
      }
    ]
  },

  // 6. CORE VALUES
  coreValues: [
    {
      id: "sustainable-impact",
      title: "Sustainable Impact",
      badgeColor: "bg-amber-100 text-amber-800",
      iconBg: "bg-amber-500",
      description: "We invest in long-term infrastructure, clean water wells, and regenerative community farming rather than temporary stopgaps.",
      linkText: "Learn More"
    },
    {
      id: "transparent-giving",
      title: "Transparent Giving",
      badgeColor: "bg-emerald-100 text-emerald-800",
      iconBg: "bg-emerald-600",
      description: "Real-time ledger tracking for every dollar donated. Receive automated delivery receipts and verified field photo proof.",
      linkText: "Learn More"
    },
    {
      id: "strength-in-unity",
      title: "Strength in Unity",
      badgeColor: "bg-teal-100 text-teal-800",
      iconBg: "bg-teal-600",
      description: "Collaborating side-by-side with localized grassroots elders, certified nurses, and trusted youth volunteer corps.",
      linkText: "Learn More"
    }
  ],

  // 7. DONATION CAUSES (4 Cards)
  causes: [
    {
      id: "education",
      category: "EDUCATION",
      badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
      title: "Education for Rural Children",
      description: "Providing modern textbooks, solar-powered learning tablets, and certified teacher stipends across remote villages.",
      photoUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
      photoAlt: "Children in classroom raising hands enthusiastically",
      raised: 32450,
      goal: 45000,
      supporters: 342,
      progressPercent: 72
    },
    {
      id: "food",
      category: "NUTRITIOUS FOOD",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
      title: "Nutritious Food Packages",
      description: "Delivering protein-rich fortified grain hampers, fresh milk rations, and emergency infant porridge to famine-prone regions.",
      photoUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop",
      photoAlt: "Community volunteer distributing fresh meals",
      raised: 28900,
      goal: 35000,
      supporters: 298,
      progressPercent: 82
    },
    {
      id: "medical",
      category: "HEALTHCARE",
      badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
      title: "Medical & Health Mobile Clinics",
      description: "Supplying life-saving antibiotics, childhood immunizations, clean delivery kits, and telemedicine pop-up centers.",
      photoUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop",
      photoAlt: "Doctor examining young patient with stethoscope",
      raised: 54120,
      goal: 60000,
      supporters: 512,
      progressPercent: 90
    },
    {
      id: "water",
      category: "CLEAN WATER",
      badgeClass: "bg-cyan-100 text-cyan-900 border-cyan-300",
      title: "Clean Water Deep Well Drilling",
      description: "Constructing solar-pumped deep boreholes and micro-filtration kiosks to prevent waterborne dysentery epidemics.",
      photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=800&auto=format&fit=crop",
      photoAlt: "Fresh clean drinking water pouring from newly installed village tap",
      raised: 19800,
      goal: 25000,
      supporters: 189,
      progressPercent: 79
    }
  ],

  // 8. MISSION & VISION SECTION
  missionVision: {
    headline: "HOPE, CARE, AND OPPORTUNITY FOR",
    headlineAccent: "EVERY CHILD",
    missionText: "Our mission is to dismantle systemic hunger, educational deprivation, and preventable diseases by establishing self-sustaining community hubs governed by local leadership.",
    visionText: "We envision a world where geography does not dictate human destiny—where every child has clean water to drink, nutritious meals to grow, and safe schools to realize their full potential.",
    badgeStat: "100% Non-profit & Transparent Audits",
    photoUrl: "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?q=80&w=1000&auto=format&fit=crop",
    photoAlt: "Group of happy children looking up at the sky together",
    highlights: [
      "Zero administrative deductions on direct field donations",
      "Bi-annual public financial reports audited independently",
      "Direct digital receipts sent within 48 hours of distribution"
    ]
  },

  // 9. TRANSFORMING LIVES (CAROUSEL / SLIDER)
  programsSlider: [
    {
      title: "Safe Haven Afterschool Centers",
      category: "YOUTH CARE",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
      location: "East Africa Hub"
    },
    {
      title: "Mobile Emergency Surgical Unit",
      category: "MEDICAL AID",
      image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=800&auto=format&fit=crop",
      location: "South Asia Border"
    },
    {
      title: "Community Greenhouse Cultivation",
      category: "FOOD SECURITY",
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?q=80&w=800&auto=format&fit=crop",
      location: "Central America"
    },
    {
      title: "Rainwater Harvesting Cisterns",
      category: "WATER SANITATION",
      image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800&auto=format&fit=crop",
      location: "Sub-Saharan Outposts"
    },
    {
      title: "Vocational Mother Tailoring Guild",
      category: "WOMEN EMPOWERMENT",
      image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop",
      location: "Southeast Asia"
    }
  ],

  // 10. VOLUNTEERS IMPACT
  volunteers: {
    headline: "VOLUNTEERS MAKING A DIFFERENCE LIVES",
    highlightNumber: "45,000+",
    highlightSuffix: "Volunteers Joined",
    description: "Across deserts, mountain villages, and bustling peri-urban shelters, our volunteer brigade serves as the beating heart of Kindora's daily humanitarian lifeline.",
    ctaButton: "Join Our Community Now",
    videoPoster: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1200&auto=format&fit=crop",
    videoAlt: "Diverse volunteers smiling while organizing humanitarian aid boxes",
    stats: [
      { count: 52, suffix: "+", label: "Communities Reached" },
      { count: 5000, suffix: "+", label: "Meals Served Daily" },
      { count: 2200, suffix: "+", label: "Children Educated" },
      { count: 100, suffix: "%", label: "Non-profit Dedication" }
    ]
  },

  // 11. UPCOMING EVENTS (3 Cards)
  events: [
    {
      id: "event-1",
      title: "Solar Deep Well Drilling & Sanitation Workshop",
      dateDay: "15",
      dateMonth: "DEC",
      year: "2026",
      location: "Kajiado Outpost, Rift Valley",
      photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=800&auto=format&fit=crop",
      photoAlt: "Community well drilling site"
    },
    {
      id: "event-2",
      title: "High-Calorie Nutritious Ration Distribution",
      dateDay: "22",
      dateMonth: "JAN",
      year: "2027",
      location: "Chittagong Relief Center",
      photoUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop",
      photoAlt: "Food distribution center volunteers"
    },
    {
      id: "event-3",
      title: "Pediatric Immunization & Vision Screening Day",
      dateDay: "05",
      dateMonth: "FEB",
      year: "2027",
      location: "San Salvador Community Clinic",
      photoUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop",
      photoAlt: "Pediatric screening with mother and child"
    }
  ],

  // 12. CONTINUOUS MARQUEE / TICKER
  tickerItems: [
    "DONATE LIVES",
    "SAFE AND SHELTER",
    "NUTRITIOUS FOODS",
    "MEDICAL AND HEALTH",
    "CHILD EDUCATION",
    "100% TRANSPARENT GIVING",
    "CLEAN WATER ACCESS",
    "HOPE FOR EVERY FAMILY"
  ],

  // 13. TESTIMONIALS
  testimonials: [
    {
      quote: "Kindora's level of financial transparency is revolutionary. Seeing exact photographic proof of the solar water pump we funded gave our family complete peace of mind.",
      author: "Sarah Jenkins",
      country: "United States",
      title: "Monthly Benefactor",
      rating: 5.0,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
    },
    {
      quote: "Volunteering with the mobile clinic team in Guatemala showed me how diligently Kindora treats every donated dollar. No waste, no bureaucracy, just pure love.",
      author: "Dr. Marcus Vance",
      country: "Canada",
      title: "Field Surgeon Volunteer",
      rating: 5.0,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
    },
    {
      quote: "Our school district partnered with Kindora to sponsor educational kits for 400 pupils. The regular updates and letters from students melted our entire community's heart.",
      author: "Elena Rostova",
      country: "Germany",
      title: "Educational Coordinator",
      rating: 5.0,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
    },
    {
      quote: "Kindora was the first humanitarian convoy to reach our flood shelter with fresh infant formula and clean blankets. They saved lives when roads were cut off.",
      author: "Tariq Al-Mansoor",
      country: "Jordan",
      title: "Disaster Relief Officer",
      rating: 5.0,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    }
  ],

  // 14. IMPACT BANNER STATS
  impactBanner: {
    headlineLead: "Every Gift Creates a",
    headlineAccent: "Brighter Tomorrow",
    subheadline: "Because hope is not a passive wish—it is a collective decision to act.",
    photoUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
    stats: [
      { value: "19K+", label: "Lives Touched" },
      { value: "10K+", label: "Donors Worldwide" },
      { value: "19K+", label: "Emergency Kits" },
      { value: "15K+", label: "Volunteers Mobilized" }
    ]
  },

  // 15. FAQ ACCORDION (1st item open by default)
  faqs: [
    {
      question: "How are my donations used and accounted for?",
      answer: "100% of public donations are allocated directly to program delivery (food rations, medical supplies, educational materials, and well drilling). All administrative, marketing, and legal costs are independently covered by our private founding endowment board.",
      isOpen: true
    },
    {
      question: "Can I choose which specific cause or region to support?",
      answer: "Yes! When donating, you can select whether your funds support Child Education, Nutritious Food Hampers, Medical Clinics, Clean Water Boreholes, or our Emergency Disaster Response Fund.",
      isOpen: false
    },
    {
      question: "Is my recurring donation tax-deductible?",
      answer: "Kindora is a certified 501(c)(3) tax-exempt humanitarian organization in the United States, as well as an accredited registered charity in Canada and the UK. All gifts are fully tax-deductible to the extent allowed by law.",
      isOpen: false
    },
    {
      question: "How will I know when my contribution is deployed in the field?",
      answer: "Within 48 hours of field distribution, our system sends you an encrypted digital report with GPS verification, receipt summary, and photographic evidence of the community impact.",
      isOpen: false
    }
  ],

  // 16. LATEST NEWS & STORIES
  news: {
    featured: {
      category: "CRISIS AID",
      date: "18 NOV 2026",
      readTime: "4 min read",
      title: "How One Act of Kindness Can Transform an Entire Generation",
      excerpt: "Inside the remote village of Samburu, where an integrated solar water borehole brought 600 young girls back into primary classrooms.",
      photoUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop",
      photoAlt: "Community gathered around new water station",
      slug: "#news-featured"
    },
    recent: [
      {
        category: "EDUCATION",
        date: "12 NOV 2026",
        title: "Digital Tablets Open Global Libraries for 1,200 Children in Nepal",
        photoUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop",
        slug: "#news-1"
      },
      {
        category: "NUTRITION",
        date: "04 NOV 2026",
        title: "Expanding Emergency Porridge Distribution Across 14 Border Camps",
        photoUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=400&auto=format&fit=crop",
        slug: "#news-2"
      },
      {
        category: "HEALTHCARE",
        date: "28 OCT 2026",
        title: "Zero Cholera Outbreaks Recorded Following Monsoonal Sanitation Push",
        photoUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=400&auto=format&fit=crop",
        slug: "#news-3"
      }
    ]
  },

  // 17. CTA SECTION (Dark Forest Green)
  cta: {
    headline: "Looking to make a real difference today?",
    subheadline: "Join over 45,000 changemakers proving that compassionate action can end hunger and empower children worldwide.",
    phone: "+1 (800) 456-7890",
    phoneNotice: "Direct Hotline – Dedicated Donors & Field Assistance (24/7)",
    primaryButton: "Start Donating Today"
  },

  // 18. FOOTER
  footer: {
    missionShort: "Kindora is a certified non-profit humanitarian platform committed to unconditional transparency, emergency nutritional security, and dignified education for every vulnerable child.",
    stats: {
      supporters: "35M",
      supportersLabel: "Number of Supporters",
      fundsRaised: "$65,000+",
      fundsLabel: "Verified Relief Deployed"
    },
    columns: [
      {
        title: "Company",
        links: [
          { label: "About Us", href: "#about" },
          { label: "Our Team", href: "#about" },
          { label: "Careers", href: "#volunteers" },
          { label: "Annual Audits", href: "#mission" },
          { label: "Press & Media", href: "#news" }
        ]
      },
      {
        title: "Programs",
        links: [
          { label: "Child Education", href: "#causes" },
          { label: "Nutritious Food", href: "#causes" },
          { label: "Clean Water Deep Wells", href: "#causes" },
          { label: "Mobile Clinics", href: "#causes" },
          { label: "Emergency Relief", href: "#events" }
        ]
      },
      {
        title: "Contact Us",
        items: [
          { label: "120 Wall Street, 24th Fl, New York, NY 10005" },
          { label: "+1 (800) 456-7890" },
          { label: "contact@kindora.org" },
          { label: "Mon - Fri: 8:00 AM - 6:00 PM EST" }
        ]
      }
    ],
    copyright: "© 2026 Kindora Non-Profit Organization. All rights reserved.",
    legalLinks: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Financial Transparency", href: "#transparency" }
    ]
  }
};

// Export to window object for standalone browser execution
if (typeof window !== "undefined") {
  window.KINDORA_DATA = KINDORA_DATA;
}
