export type AnalysisStatus = "queued" | "running" | "done" | "error";

export interface HeadingCounts {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
}

export interface BrokenLink {
  url: string;
  status_code: number;
}

export interface URLAnalysis {
  id: number;
  url: string;
  status: AnalysisStatus;
  html_version: string;
  page_title: string;
  heading_counts: HeadingCounts;
  internal_links: number;
  external_links: number;
  inaccessible_links: BrokenLink[]; 
  has_login_form: boolean;
  created_at: string; 
  updated_at: string; 
}