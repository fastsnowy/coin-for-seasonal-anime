// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(500, { error: "Missing Supabase environment variables" });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return jsonResponse(401, { error: "Missing authorization" });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  const jwt = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: getUserError,
  } = await supabaseAdmin.auth.getUser(jwt);

  if (getUserError || !user) {
    return jsonResponse(401, { error: "Invalid token" });
  }

  if (user.is_anonymous) {
    return jsonResponse(400, { error: "Anonymous users cannot be deleted" });
  }

  const { data: pseudoUser, error: pseudoUserError } = await supabaseAdmin
    .from("pseudo_users")
    .insert({})
    .select("id")
    .single();

  if (pseudoUserError || !pseudoUser) {
    console.error("delete-user:create pseudo user failed", pseudoUserError);
    return jsonResponse(500, { error: "Failed to create pseudo user" });
  }

  const { error: updateProdError } = await supabaseAdmin
    .from("coins_prod")
    .update({ pseudo_user_id: pseudoUser.id })
    .eq("user_id", user.id);
  if (updateProdError) {
    console.error("delete-user:update coins_prod failed", updateProdError);
    return jsonResponse(500, { error: "Failed to map votes (prod)" });
  }

  const { error: updateDevError } = await supabaseAdmin
    .from("coins_dev")
    .update({ pseudo_user_id: pseudoUser.id })
    .eq("user_id", user.id);
  if (updateDevError) {
    console.error("delete-user:update coins_dev failed", updateDevError);
    return jsonResponse(500, { error: "Failed to map votes (dev)" });
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    console.error("delete-user:deleteUser failed", deleteError);
    return jsonResponse(500, { error: deleteError.message });
  }

  return jsonResponse(200, { success: true });
});
