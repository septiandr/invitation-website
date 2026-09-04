export type EventConfig = {
  coupleNames: string;
  coverTitle: string;
  greetingName?: string;
  eventTimezone: string;
  eventDate: string; // ISO with offset
  events: Array<{
    title: string;
    date: string;
    startTime: string;
    endTime?: string;
    location: string;
    description?: string;
  }>;
  venue: {
    name: string;
    address: string;
    mapsUrl: string;
    embedUrl?: string;
  };
  gallery: Array<{
    src: string;
    alt: string;
    objectPosition?: string;
  }>;
  backgroundAudio?: string;
};

/**
 * Asset mapping after manual inspection:
 * background.jpg (1280x1280) -> cover hero background, warm intimate tone
 * 1.png (1024x1536 portrait) -> couple portrait editorial
 * 2.png (1024x1536 portrait) -> couple portrait closeup
 * 3.png (1024x1536 portrait) -> bridal portrait
 * 4.png (836x1881 tall portrait) -> editorial tall crop
 * 5-10.png (1537x1023 landscape) -> gallery landscape feature
 */

export const eventConfig: EventConfig = {
  coupleNames: "Ricky & Felly",
  coverTitle: "Ricky & Felly",
  greetingName: "Bapak/Ibu/Saudara/i",
  eventTimezone: "Asia/Jakarta",
  eventDate: "2026-12-20T09:00:00+07:00",
  events: [
    {
      title: "Holy Matrimony",
      date: "Saturday, 20 December 2026",
      startTime: "09:00 WIB",
      endTime: "10:30 WIB",
      location: "Gereja Katedral Jakarta",
      description: "Witness our vows in a sacred ceremony surrounded by family and close friends.",
    },
    {
      title: "Reception",
      date: "Saturday, 20 December 2026",
      startTime: "11:30 WIB",
      endTime: "14:00 WIB",
      location: "The Ritz-Carlton, Jakarta",
      description: "Celebrate with us over an intimate lunch, heartfelt toasts, and joyful moments.",
    },
  ],
  venue: {
    name: "The Ritz-Carlton Jakarta, Mega Kuningan",
    address: "Jl. DR. Ide Anak Agung Gde Agung Kav. E 1.1 No.1, Mega Kuningan, Jakarta Selatan",
    mapsUrl: "https://maps.google.com/?q=The+Ritz-Carlton+Jakarta+Mega+Kuningan",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.466439974922!2d106.827!3d-6.224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f30000000001%3A0x0!2sThe%20Ritz-Carlton%20Jakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid",
  },
  gallery: [
    { src: "/assets/1.png", alt: "Portrait of the couple in warm editorial tones", objectPosition: "50% 20%" },
    { src: "/assets/2.png", alt: "Couple portrait with soft natural light", objectPosition: "50% 30%" },
    { src: "/assets/3.png", alt: "Bridal portrait with delicate details", objectPosition: "50% 15%" },
    { src: "/assets/4.png", alt: "Editorial tall portrait of the couple", objectPosition: "50% 10%" },
    { src: "/assets/5.png", alt: "Landscape moment of the couple outdoors", objectPosition: "50% 50%" },
    { src: "/assets/6.png", alt: "Couple holding hands in editorial landscape", objectPosition: "50% 50%" },
    { src: "/assets/7.png", alt: "Warm landscape celebration scene", objectPosition: "50% 50%" },
    { src: "/assets/8.png", alt: "Intimate landscape portrait", objectPosition: "50% 50%" },
    { src: "/assets/9.png", alt: "Joyful landscape moment", objectPosition: "50% 50%" },
    { src: "/assets/10.png", alt: "Feature landscape with elegant composition", objectPosition: "50% 50%" },
  ],
  backgroundAudio: "https://invitato.net/template-rickyfelly/static/bg-sound-f26b8f4c5518b48f7ff52c53516f2b2b.mp3",
};
