import { createClient } from '@supabase/supabase-js'
export const supabase = createClient('https://tzfkpveneldwzngjybqw.supabase.co','sb_publishable_vFmdIZ7qi-ufGL94FJGUWQ_I8PaYJwH')
export type Staff={id:string;display_name:string;badge_number:string|null;rank:string;app_role:'officer'|'supervisor'|'admin'|'developer';unit:string|null;duty_status:'on_duty'|'break'|'off_duty'}
export async function signInDiscord(){return supabase.auth.signInWithOAuth({provider:'discord',options:{redirectTo:window.location.origin+'/LSPD-Panel/'}})}
export async function signOut(){return supabase.auth.signOut()}
