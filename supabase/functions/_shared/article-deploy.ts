import type { SupabaseClient } from 'npm:@supabase/supabase-js@2.116.0';
import { dispatchPublicSite } from './site-dispatch.ts';
export async function requestArticleDeploy(admin:SupabaseClient,article:{id:string;workspace_id:string},userId:string,action:'publish'|'archive'|'retry'){
  const hook=Deno.env.get('PUBLIC_SITE_DEPLOY_HOOK_URL');const requestedAt=new Date().toISOString();await admin.from('articles').update({deployment_status:'pending',deployment_error:null,deployment_requested_at:requestedAt}).eq('id',article.id).eq('workspace_id',article.workspace_id);let status=0;let requestId:string|null=null;
  if(Deno.env.get('PUBLIC_SITE_DEPLOY_MODE')==='manual'){
    const event=await admin.from('article_publication_events').insert({workspace_id:article.workspace_id,article_id:article.id,action,requested_by:userId,hook_status:'pending'});
    if(event.error)throw event.error;
    return{deployment_status:'pending',deployment_mode:'manual'};
  }
  try{const result=await dispatchPublicSite({source:'article',record_id:article.id,action});status=result.status;requestId=result.requestId;await admin.from('articles').update({deployment_status:'requested',deployment_error:null}).eq('id',article.id);await admin.from('article_publication_events').insert({workspace_id:article.workspace_id,article_id:article.id,action,requested_by:userId,hook_status:'requested',provider_request_id:requestId,response_status:status});return{deployment_status:'requested',provider_request_id:requestId};}
  catch(error){const message=error instanceof Error?error.message:'deploy_failed';await admin.from('articles').update({deployment_status:'failed',deployment_error:message}).eq('id',article.id);await admin.from('article_publication_events').insert({workspace_id:article.workspace_id,article_id:article.id,action,requested_by:userId,hook_status:'failed',provider_request_id:requestId,response_status:status||null,error_message:message});throw new Error(message);}
}
