// supabase-client.js
const SUPABASE_URL = "https://nwwpvrmaqbaffiqsmqnl.supabase.co";
const SUPABASE_KEY = "sb_publishable_w_Z4XAj6HLrBTL4aWIpsfQ_OVcw12k1";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);