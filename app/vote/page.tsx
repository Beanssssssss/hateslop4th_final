import { getTopics, getUsers } from "@/lib/queries";
import { VoteShell } from "./vote-shell";

export default async function VotePage() {
  const [topics, users] = await Promise.all([getTopics(), getUsers()]);

  return <VoteShell topics={topics} users={users} />;
}
