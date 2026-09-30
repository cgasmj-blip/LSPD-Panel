import { createClient } from '@supabase/supabase-js'
export const supabase=createClient('https://tzfkpveneldwzngjybqw.supabase.co','sb_publishable_vFmdIZ7qi-ufGL94FJGUWQ_I8PaYJwH')
export type Staff={id:string;display_name:string;rank:string;app_role:'officer'|'supervisor'|'admin'|'developer';divisions:string[];active:boolean}
export async function signInDiscord(){return supabase.auth.signInWithOAuth({provider:'discord',options:{redirectTo:'https://cgasmj-blip.github.io/LSPD-Panel/',scopes:'identify email guilds.members.read'}})}
export async function signOut(){const r=await supabase.auth.signOut({scope:'local'});if(!r.error)window.location.replace('/LSPD-Panel/');return r}
