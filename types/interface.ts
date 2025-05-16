export interface Announcement {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

// Interface needed for admin side of the app
export type Trainer = {
  id: string;
  user: {
    full_name: string;
  };
};

export type Member = {
  id: string;
  full_name: string;
  type_of_membership: string,
  membership_start_date: string,
  membership_end_date: string,
};

export interface MemberProfile {
  image: any,
  username: string,
  fullName: string,
  membershipType: string,
  startDate?: string,
  endDate?: string,
}
