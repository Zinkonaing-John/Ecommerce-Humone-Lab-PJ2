const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" }); // Ensure .env.local is loaded

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // This should be your service role key

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your environment variables."
  );
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const userIdToUpdate = "abf49abe-437d-41ab-9816-88cf0d474243"; // Replace with the actual user ID you want to make admin

async function updateAdminStatus() {
  console.log(`Attempting to update user ${userIdToUpdate} to admin...`);
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userIdToUpdate,
    {
      app_metadata: { is_admin: true },
    }
  );

  if (error) {
    console.error("Error updating user:", error.message);
  } else {
    console.log("User updated successfully:", data.user.id);
    console.log("New app_metadata:", data.user.app_metadata);
  }
}

updateAdminStatus();
