import { supabase } from './supabase'
export type DutyStatus='on_duty'|'break'|'unavailable'|'off_duty'
export async function setDuty(_staffId:string,status:DutyStatus){return supabase.rpc('change_my_duty_status',{p_status:status})}
export async function getRoster(){const {data,error}=await supabase.from('staff').select('id,display_name,badge_number,rank,unit,duty_status').eq('active',true).order('rank');if(error)throw error;return data??[]}
export async function getDutyHistory(){const {data,error}=await supabase.from('duty_history').select('id,status,changed_at,staff:staff_id(display_name,badge_number,rank)').order('changed_at',{ascending:false}).limit(100);if(error)throw error;return data??[]}
export async function getContent(type:'document'|'training'){const {data,error}=await supabase.from('content_items').select('id,title,category,summary,body,external_url,updated_at').eq('content_type',type).eq('published',true).order('category').order('title');if(error)throw error;return data??[]}
export async function getActiveUnits(){
 const {data,error}=await supabase.from('units').select('id,name,status,created_at,unit_members(staff_id,staff:staff_id(id,display_name,badge_number,rank,duty_status))').eq('active',true).order('created_at',{ascending:false});if(error)throw error
 return (data??[]).map((u:any)=>({...u,members:u.unit_members?.map((m:any)=>m.staff).filter(Boolean)??[],designation:(u.unit_members?.length??0)===1?'Lincoln':(u.unit_members?.length??0)===2?'Adam':'Unité'}))
}
export async function createUnitAndJoin(name:string){return supabase.rpc('create_and_join_lspd_unit',{p_name:name})}
export async function joinUnit(unitId:string){return supabase.rpc('join_lspd_unit',{p_unit:unitId})}
export async function leaveService(){return supabase.rpc('leave_lspd_service')}
