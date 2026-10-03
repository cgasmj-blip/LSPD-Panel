import { createClient } from '@supabase/supabase-js'
export const supabase=createClient('https://tzfkpveneldwzngjybqw.supabase.co','sb_publishable_vFmdIZ7qi-ufGL94FJGUWQ_I8PaYJwH')
export type Staff={id:string;display_name:string;badge_number:string|null;rank:string;app_role:'officer'|'supervisor'|'admin'|'developer';divisions:string[];doa_role?:string|null;k9_role?:string|null;active:boolean}
export async function signInDiscord(){return supabase.auth.signInWithOAuth({provider:'discord',options:{redirectTo:'https://cgasmj-blip.github.io/LSPD-Panel/',scopes:'identify email guilds.members.read'}})}
export async function signOut(){const r=await supabase.auth.signOut({scope:'local'});if(!r.error)window.location.replace('/LSPD-Panel/');return r}

export async function chooseBadge(badge:string){return supabase.rpc('choose_my_badge_number',{p_badge:badge})}
export async function startService(type:'lincoln'|'adam'|'division',division:string|null=null){return supabase.rpc('start_service',{p_type:type,p_division:division})}
export async function joinService(unitId:string){return supabase.rpc('join_service_unit',{p_unit:unitId})}
export async function leaveService(){return supabase.rpc('leave_service')}
export async function getServiceUnits(){const {data,error}=await supabase.from('service_units').select('id,name,service_type,division,created_at,service_unit_members(staff_id,staff:staff_id(id,display_name,badge_number,rank))').eq('active',true).order('created_at');if(error)throw error;return data??[]}
export function subscribeService(refresh:()=>void){const ch=supabase.channel('duty-live').on('postgres_changes',{event:'*',schema:'public',table:'service_units'},refresh).on('postgres_changes',{event:'*',schema:'public',table:'service_unit_members'},refresh).subscribe();return()=>{void supabase.removeChannel(ch)}}
