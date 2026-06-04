import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseClient, hasSupabaseConfig } from "./supabase";
import type { Topic, User, Vote } from "./types";

type TopicRow = {
  id: string;
  title: string;
  users: { id: string; name: string } | { id: string; name: string }[] | null;
};

export async function getTopics(): Promise<Topic[]> {
  noStore();

  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("topics")
    .select("id, title, users(id, name)")
    .order("title", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data as TopicRow[] | null) ?? []).map((topic) => {
    const user = Array.isArray(topic.users) ? topic.users[0] : topic.users;

    return {
      id: topic.id,
      title: topic.title,
      userId: user?.id,
      userName: user?.name,
    };
  });
}

export async function getUsers(): Promise<User[]> {
  noStore();

  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, name, vote, weight")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function areAllUsersVoted(): Promise<boolean> {
  const users = await getUsers();

  return users.length > 0 && users.every((user) => user.vote === true);
}

export async function getVotes(): Promise<Vote[]> {
  noStore();

  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("votes")
    .select("voter_id, topic_id, rank")
    .order("rank", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((vote) => ({
    voterId: String(vote.voter_id),
    topicId: String(vote.topic_id),
    rank: Number(vote.rank),
  }));
}
