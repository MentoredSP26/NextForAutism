import { createClient } from "./createClient";

const supabase = createClient();

export async function testQuery() {
  const { data, error } = await supabase
    .from("demo")
    .select("*")
    .limit(5);

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  console.log("Supabase data:", data);
}