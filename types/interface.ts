// For interfaces with image attributes

import { ImageSourcePropType } from "react-native";

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

// Meal Plan Interfaces
export interface MealPlan {
  mealplan_id: number;
  meals: Meal[];
  member_id: string;
  trainer_id: string;
  mealplan_name: string;
  fitness_goal: string;
  calorie_intake: number;
  protein: number;
  carbs: number;
  weight_goal: number;
  allergies: string;
  instructions: string;
  visibleTo: string;
  requestee_id: string;
  requestee: string;
  status: string;
}
export interface Meal {
  id: string | null;
  mealplan: string;
  meal_name: string;
  description: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
}

export interface User{
  id: string;
  email: string;
  full_name: string;
}

// Used in Trainer Meal Plan Interface
export interface SelectedMemberData {
  requesteeID: string;
  requesteeName: string;
  height: string;
  weight: string;
  age: string;
  fitnessGoal: string;
  weightGoal: string;
  allergies: string;
  status: string;
}


// Second Trainer Interface for Meals and Workouts
export interface Trainer2{
  id: string;
  user: User;
  experience?: string;
  contact?: string;
}

export interface Feedback {
  id: string;
  feedback: string;
  rating: number;
  createdAt: Date;
}

export interface MealPlan2 {
  mealplan_id: string | null;
  meals: Meal2[];
  member_id: string;
  trainer_id: string;
  mealplan_name: string;
  fitness_goal: string;
  calorie_intake: number;
  protein: number;
  carbs: number;
  weight_goal: string;
  allergies: string;
  instructions: string;
  requestee_id: string;
  requestee: string;
  status: string;
}

export interface Meal2 {
  id: string | null;
  mealplan: string;
  meal_name: string;
  description: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
}

// Workout Interfaces

export interface Exercise {
  id: string;
  name: string;
  description: string;
  image: ImageSourcePropType | null;
}

export interface Workout {
  id: string;
  title: string;
  fitnessGoal: string;
  intensityLevel: string;
  trainer: string;
  exercises: Exercise[];
  visibleTo: string;
  feedbacks: Feedback[];
  status: string;
  requestee: string | null; // Added member_id property
}

// For Trainer Workout Interfaces
export interface Exercise2 {
  id: string | null; // ID can be null for new exercises
  name: string;
  description: string;
  image: ImageSourcePropType | null; // Image can be null if not set
}

export interface Workout2 {
  id: string | null; // ID can be null for new workouts
  title: string;
  duration: number;
  fitnessGoal: string;
  intensityLevel: string;
  trainer: string;
  exercises: Exercise2[];
  visibleTo: string;
  feedbacks: Feedback[];
  status: string;
  requestee: string | null;
}

export interface SelectedMemberData2 {
  requesteeID: string;
  requesteeName: string;
  height: string;
  weight: string;
  age: string;
  fitnessGoal: string;
  intensityLevel: string;
  status: string;
}

// Header Interface
export type HeaderPropsUserType = {
  userType: 'member' | 'trainer';
}

export type HeaderPropsName = {
  name: string;
}

export type HeaderPropsNavigation = {
  screen: string;
  prevScreen: `/${string}`;
};

// Notification Interface
export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
}