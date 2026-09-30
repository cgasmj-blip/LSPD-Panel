import { supabase } from './supabase'
export type DutyStatus='on_duty'|'break'|'unavailable'|'off_duty'
export async function setDuty(_staffId:string,status:DutyStatus){return supabase.rpc('change_my_duty_status',{p_status:status})}
export async function getRoster(){const {data,error}=await supabase.from('staff').select('id,display_name,badge_number,rank,unit,duty_status').eq('active',true).order('rank');if(error)throw error;return data??[]}
export async function getDutyHistory(){const {data,error}=await supabase.from('duty_history').select('id,status,changed_at,staff:staff_id(display_name,badge_number,rank)').order('changed_at',{ascending:false}).limit(100);if(error)throw error;return data??[]}
export async function getContent(type?:string){let q=supabase.from('content_items').select('id,content_type,title,category,summary,body,external_url,updated_at').eq('published',true).order('category').order('title');if(type)q=q.eq('content_type',type);const {data,error}=await q;if(error)throw error;return data??[]}
export async function getActiveUnits(){const {data,error}=await supabase.from('units').select('id,name,status,division,service_vehicle_id,created_at,unit_members(staff_id,staff:staff_id(id,display_name,badge_number,rank,duty_status)),service_vehicle:service_vehicle_id(id,name,category)').eq('active',true).order('created_at',{ascending:false});if(error)throw error;return (data??[]).map((u:any)=>({...u,members:u.unit_members?.map((m:any)=>m.staff).filter(Boolean)??[],designation:u.division||((u.unit_members?.length??0)===1?'Lincoln':(u.unit_members?.length??0)===2?'Adam':'Unité')}))}
export async function getVehicles(){const {data,error}=await supabase.from('service_vehicles').select('*').eq('active',true).order('sort_order').order('name');if(error)throw error;return data??[]}
export async function startService(vehicleId:string|null,division:string|null=null){return supabase.rpc('start_lspd_service',{p_vehicle:vehicleId,p_division:division})}\nexport function subscribeService(refresh:()=>void){const channel=supabase.channel('lspd-service-live').on('postgres_changes',{event:'*',schema:'public',table:'units'},refresh).on('postgres_changes',{event:'*',schema:'public',table:'unit_members'},refresh).on('postgres_changes',{event:'*',schema:'public',table:'staff'},refresh).on('postgres_changes',{event:'*',schema:'public',table:'service_vehicles'},refresh).subscribe();return()=>{void supabase.removeChannel(channel)}}
export async function joinUnit(unitId:string){return supabase.rpc('join_lspd_unit',{p_unit:unitId})}
export async function leaveService(){return supabase.rpc('leave_lspd_service')}
export async function setUnitVehicle(unitId:string,vehicleId:string|null){return supabase.from('units').update({service_vehicle_id:vehicleId}).eq('id',unitId)}
export async function addVehicle(name:string,category='Patrouille'){return supabase.from('service_vehicles').insert({name,category})}
export async function disableVehicle(id:string){return supabase.from('service_vehicles').update({active:false}).eq('id',id)}

export async function chooseBadge(badge:string){return supabase.rpc('choose_my_badge_number',{p_badge:badge})}
