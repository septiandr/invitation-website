export type Attendance = "HADIR" | "TIDAK_HADIR";

export type RsvpPayload = {
  guestName: string;
  attendance: Attendance;
  guestCount: number;
};

export type RsvpResponse = {
  id: string;
  guestName: string;
  attendance: Attendance;
  guestCount: number;
  createdAt: string;
};

export type Wish = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export type WishesResponse = {
  items: Wish[];
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
};
