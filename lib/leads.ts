export type LeadStatus = "pending" | "read";

export type LeadMessage = {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
};
