export type EventItem = {
  slug: string;
  name: string;
  shortDescription: string;
  location: string;
  client: string;
  attendees: string;
  experience: string;
  clientFeedback: string;
  coverImage: string;
  gallery: string[];
};

export const events: EventItem[] = [
  {
    slug: "urban-tech-launch-dhaka",
    name: "Urban Tech Launch 2025",
    shortDescription:
      "A city-center product reveal experience combining interactive installations and live demo zones.",
    location: "ICCB, Dhaka",
    client: "UrbanTech Bangladesh",
    attendees: "2,300",
    experience:
      "We designed an open flow experience with guided product touchpoints, high-visibility stage moments, and controlled crowd movement to maintain energy and safety throughout the evening.",
    clientFeedback:
      "The execution quality was exceptional. Every stakeholder felt informed, and the audience journey matched our campaign vision.",
    coverImage: "https://picsum.photos/seed/urban-tech-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/urban-tech-1/900/600",
      "https://picsum.photos/seed/urban-tech-2/900/600",
      "https://picsum.photos/seed/urban-tech-3/900/600",
      "https://picsum.photos/seed/urban-tech-4/900/600",
      "https://picsum.photos/seed/urban-tech-5/900/600",
      "https://picsum.photos/seed/urban-tech-6/900/600",
    ],
  },
  {
    slug: "youth-festival-roadshow",
    name: "Youth Festival Roadshow",
    shortDescription:
      "Multi-city brand activation designed to increase campus-level engagement across key regions.",
    location: "Dhaka, Chattogram, Sylhet",
    client: "Vibe Mobile",
    attendees: "8,000+",
    experience:
      "The campaign used modular stage design and localized show flow so each city could feel fresh while retaining one coherent brand language.",
    clientFeedback:
      "Excellent coordination under pressure. Team communication and live adaptation were top tier.",
    coverImage: "https://picsum.photos/seed/youth-roadshow-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/youth-roadshow-1/900/600",
      "https://picsum.photos/seed/youth-roadshow-2/900/600",
      "https://picsum.photos/seed/youth-roadshow-3/900/600",
      "https://picsum.photos/seed/youth-roadshow-4/900/600",
      "https://picsum.photos/seed/youth-roadshow-5/900/600",
      "https://picsum.photos/seed/youth-roadshow-6/900/600",
    ],
  },
  {
    slug: "heritage-brand-pop-up",
    name: "Heritage Brand Pop-up Week",
    shortDescription:
      "A premium retail pop-up combining storytelling, product trial, and influencer-led walkthroughs.",
    location: "Gulshan Avenue, Dhaka",
    client: "Heritage Foods",
    attendees: "4,200",
    experience:
      "We mapped the space into sequential narrative zones that helped visitors connect brand history to modern product lines.",
    clientFeedback:
      "Client servicing and planning rhythm were flawless. The experience felt premium and organized.",
    coverImage: "https://picsum.photos/seed/heritage-pop-up-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/heritage-pop-up-1/900/600",
      "https://picsum.photos/seed/heritage-pop-up-2/900/600",
      "https://picsum.photos/seed/heritage-pop-up-3/900/600",
      "https://picsum.photos/seed/heritage-pop-up-4/900/600",
      "https://picsum.photos/seed/heritage-pop-up-5/900/600",
      "https://picsum.photos/seed/heritage-pop-up-6/900/600",
    ],
  },
  {
    slug: "campus-brand-experience-day",
    name: "Campus Experience Day",
    shortDescription:
      "Interactive activation focused on product immersion and peer-led storytelling.",
    location: "Independent University, Bangladesh",
    client: "Pulse Beverage",
    attendees: "1,700",
    experience:
      "A tactical schedule and ambassador playbook drove strong queue flow and ensured every touchpoint stayed fully staffed.",
    clientFeedback:
      "Super responsive partner. The team made complex logistics feel easy.",
    coverImage: "https://picsum.photos/seed/campus-day-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/campus-day-1/900/600",
      "https://picsum.photos/seed/campus-day-2/900/600",
      "https://picsum.photos/seed/campus-day-3/900/600",
      "https://picsum.photos/seed/campus-day-4/900/600",
      "https://picsum.photos/seed/campus-day-5/900/600",
      "https://picsum.photos/seed/campus-day-6/900/600",
    ],
  },
  {
    slug: "fintech-community-summit",
    name: "Fintech Community Summit",
    shortDescription:
      "A two-day summit blending keynote production, networking spaces, and demo sessions.",
    location: "BICC, Dhaka",
    client: "NexaPay",
    attendees: "3,100",
    experience:
      "We developed a stakeholder communication matrix and real-time operations desk to keep stage, media, and sponsor needs synchronized.",
    clientFeedback:
      "Highly dependable execution partner with strong strategic thinking.",
    coverImage: "https://picsum.photos/seed/fintech-summit-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/fintech-summit-1/900/600",
      "https://picsum.photos/seed/fintech-summit-2/900/600",
      "https://picsum.photos/seed/fintech-summit-3/900/600",
      "https://picsum.photos/seed/fintech-summit-4/900/600",
      "https://picsum.photos/seed/fintech-summit-5/900/600",
      "https://picsum.photos/seed/fintech-summit-6/900/600",
    ],
  },
  {
    slug: "retail-winter-carnival",
    name: "Retail Winter Carnival",
    shortDescription:
      "Seasonal activation with family-friendly zones, live showcases, and engagement gamification.",
    location: "Jamuna Future Park",
    client: "Metro Retail Group",
    attendees: "6,400",
    experience:
      "The activation strategy focused on high dwell-time activities and measured conversion pathways across event zones.",
    clientFeedback:
      "Strong ownership and excellent client communication throughout planning and execution.",
    coverImage: "https://picsum.photos/seed/winter-carnival-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/winter-carnival-1/900/600",
      "https://picsum.photos/seed/winter-carnival-2/900/600",
      "https://picsum.photos/seed/winter-carnival-3/900/600",
      "https://picsum.photos/seed/winter-carnival-4/900/600",
      "https://picsum.photos/seed/winter-carnival-5/900/600",
      "https://picsum.photos/seed/winter-carnival-6/900/600",
    ],
  },
  {
    slug: "energy-drink-night-run",
    name: "Night Run Activation",
    shortDescription:
      "Experience-first fitness activation with product sampling and high-energy route programming.",
    location: "Hatirjheel, Dhaka",
    client: "Charge Up",
    attendees: "2,900",
    experience:
      "A detailed pre-run warm-up journey and post-run social zone increased retention and social sharing significantly.",
    clientFeedback:
      "Great command over live operations. The participant experience felt cohesive end to end.",
    coverImage: "https://picsum.photos/seed/night-run-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/night-run-1/900/600",
      "https://picsum.photos/seed/night-run-2/900/600",
      "https://picsum.photos/seed/night-run-3/900/600",
      "https://picsum.photos/seed/night-run-4/900/600",
      "https://picsum.photos/seed/night-run-5/900/600",
      "https://picsum.photos/seed/night-run-6/900/600",
    ],
  },
  {
    slug: "beauty-brand-experience-lounge",
    name: "Beauty Experience Lounge",
    shortDescription:
      "Immersive showcase with guided beauty consultations and personalized product stations.",
    location: "Banani, Dhaka",
    client: "Luxe Skin Co.",
    attendees: "1,500",
    experience:
      "The layout was optimized for intimate consultations while still creating social-content moments for creators and media.",
    clientFeedback:
      "Fantastic understanding of premium audience expectations and brand tone.",
    coverImage: "https://picsum.photos/seed/beauty-lounge-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/beauty-lounge-1/900/600",
      "https://picsum.photos/seed/beauty-lounge-2/900/600",
      "https://picsum.photos/seed/beauty-lounge-3/900/600",
      "https://picsum.photos/seed/beauty-lounge-4/900/600",
      "https://picsum.photos/seed/beauty-lounge-5/900/600",
      "https://picsum.photos/seed/beauty-lounge-6/900/600",
    ],
  },
  {
    slug: "fmcg-brand-market-day",
    name: "Market Day Activation",
    shortDescription:
      "Ground-level FMCG experience crafted for direct consumer engagement and conversion.",
    location: "Khulna City Center",
    client: "FreshBox Foods",
    attendees: "3,700",
    experience:
      "We built neighborhood-friendly engagement formats and micro-stage programming to sustain crowd interest over long hours.",
    clientFeedback:
      "Excellent planning discipline and practical problem-solving on site.",
    coverImage: "https://picsum.photos/seed/market-day-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/market-day-1/900/600",
      "https://picsum.photos/seed/market-day-2/900/600",
      "https://picsum.photos/seed/market-day-3/900/600",
      "https://picsum.photos/seed/market-day-4/900/600",
      "https://picsum.photos/seed/market-day-5/900/600",
      "https://picsum.photos/seed/market-day-6/900/600",
    ],
  },
  {
    slug: "telecom-regional-awards",
    name: "Regional Partner Awards",
    shortDescription:
      "A recognition-led corporate event with live award production and guest experience curation.",
    location: "Radisson Blu Chattogram",
    client: "ConnectTel",
    attendees: "920",
    experience:
      "A narrative stage flow and tightly managed cueing system ensured smooth transitions and high production confidence.",
    clientFeedback:
      "The team handled every stakeholder request with professionalism and speed.",
    coverImage: "https://picsum.photos/seed/partner-awards-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/partner-awards-1/900/600",
      "https://picsum.photos/seed/partner-awards-2/900/600",
      "https://picsum.photos/seed/partner-awards-3/900/600",
      "https://picsum.photos/seed/partner-awards-4/900/600",
      "https://picsum.photos/seed/partner-awards-5/900/600",
      "https://picsum.photos/seed/partner-awards-6/900/600",
    ],
  },
  {
    slug: "sportswear-fan-zone",
    name: "Sportswear Fan Zone",
    shortDescription:
      "Fan-first activation blending match-day emotion with product experience spaces.",
    location: "Mirpur, Dhaka",
    client: "ActiveNation",
    attendees: "5,200",
    experience:
      "The experience combined competitive stations, social content booths, and rapid replenishment operations to maintain momentum.",
    clientFeedback:
      "Brilliant live coordination and excellent audience handling under heavy footfall.",
    coverImage: "https://picsum.photos/seed/fan-zone-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/fan-zone-1/900/600",
      "https://picsum.photos/seed/fan-zone-2/900/600",
      "https://picsum.photos/seed/fan-zone-3/900/600",
      "https://picsum.photos/seed/fan-zone-4/900/600",
      "https://picsum.photos/seed/fan-zone-5/900/600",
      "https://picsum.photos/seed/fan-zone-6/900/600",
    ],
  },
  {
    slug: "auto-brand-test-drive-weekend",
    name: "Test Drive Weekend",
    shortDescription:
      "Automotive activation with guided experience routes and conversion-driven sales support.",
    location: "Purbachal Experience Track",
    client: "Apex Motors",
    attendees: "1,250",
    experience:
      "We mapped guest journeys from registration to drive feedback while preserving premium hospitality and high safety standards.",
    clientFeedback:
      "Excellent planning depth and world-class client servicing throughout.",
    coverImage: "https://picsum.photos/seed/test-drive-cover/900/600",
    gallery: [
      "https://picsum.photos/seed/test-drive-1/900/600",
      "https://picsum.photos/seed/test-drive-2/900/600",
      "https://picsum.photos/seed/test-drive-3/900/600",
      "https://picsum.photos/seed/test-drive-4/900/600",
      "https://picsum.photos/seed/test-drive-5/900/600",
      "https://picsum.photos/seed/test-drive-6/900/600",
    ],
  },
];

export function getEventBySlug(slug: string): EventItem | undefined {
  return events.find((event) => event.slug === slug);
}