/**
 * Non-sensitive demo preferences only (filters, sort, chosen cover, waitlist demo
 * entries). Never photo bytes, never anything private — photos stay in memory as
 * temporary object URLs and are revoked on unmount.
 */

const KEY = "ppal.prefs.v1";

export interface DemoPrefs {
  firstName: string;
  lastFilter: string;
  lastSort: string;
  chosenCoverId: string;
  hasOpenedSampleAlbum: boolean;
  privacyAcknowledged: boolean;
}

export const DEFAULT_PREFS: DemoPrefs = {
  firstName: "Ellie",
  lastFilter: "All",
  lastSort: "Recently updated",
  chosenCoverId: "burgundy-gold-frame",
  hasOpenedSampleAlbum: false,
  privacyAcknowledged: false,
};

export function readPrefs(): DemoPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<DemoPrefs>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function writePrefs(patch: Partial<DemoPrefs>) {
  if (typeof window === "undefined") return;
  try {
    const next = { ...readPrefs(), ...patch };
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — demo continues in memory */
  }
}

/**
 * Waitlist demo storage. Fields mirror the FUTURE subscription model but no
 * billing is integrated: trial_started_at / trial_ends_at / subscription_status /
 * plan_name / stripe_customer_id are placeholders only.
 */
export interface WaitlistEntry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  device: string;
  library_size: string;
  organize_focus: string[];
  note: string;
  agreed_updates: boolean;
  acknowledged_not_available: boolean;
  created_at: string;
  // Future model — intentionally inert in this MVP.
  trial_started_at: string | null;
  trial_ends_at: string | null;
  subscription_status: "waitlisted";
  plan_name: null;
  stripe_customer_id: null;
}

const WAITLIST_KEY = "ppal.waitlist.v1";

export function saveWaitlistEntry(entry: WaitlistEntry) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(WAITLIST_KEY);
    const list: WaitlistEntry[] = raw ? JSON.parse(raw) : [];
    list.push(entry);
    window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function readWaitlist(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WAITLIST_KEY);
    return raw ? (JSON.parse(raw) as WaitlistEntry[]) : [];
  } catch {
    return [];
  }
}
