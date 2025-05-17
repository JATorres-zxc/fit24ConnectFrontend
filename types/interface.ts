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

// Interface needed for Admin Reports Screen
export interface Report {
  id: string;
  reportType: keyof typeof typeLabels;
  startDate: string;
  endDate: string;
  generatedDate: string;
}

// Report type labels
export const typeLabels = {
  facility: 'Facility',
  user: 'User',
  trainer: 'Trainer',
  general: 'General',
  membership: 'Membership',
  access_logs: 'Access Logs',
};

// Interface needed for History Screen
export interface AccessLog {
  id: string;
  facility_name: string;
  status: string;
  timestamp: string;
}

// Interface needed for Profile View Screens
export interface MemberProfileDetails {
  image: any,
  username: string,
  membershipType: string,
  membershipStatus: string,
  fullName: string,
  email: string,
  age: string,
  height: string,
  weight: string,
  address: string,
  phoneNo: string,
}

export interface TrainerProfileDetails {
  image: any,
  username: string,
  membershipType: string,
  membershipStatus: string,
  fullName: string,
  email: string,
  experience: string,
  address: string,
  contact_number: string,
}

// Interface needed for Edit Profile Screens
export interface ProfileBase {
  image: any;
  membershipType: string;
  membershipStatus: string;
}

export interface EditableMemberProfile {
  username: string;
  fullName: string;
  email: string;
  age: string;
  height: string;
  weight: string;
  complete_address: string;
  contact_number: string;
}

export interface EditableTrainerProfile {
  username: string;
  fullName: string;
  email: string;
  experience: string;
  address: string;
  phoneNo: string;
}