"use client";

import { useState } from "react";
import { createSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";
import type { Topic, User } from "@/lib/types";

const ranks = [1, 2, 3, 4, 5];
const emptyRankings = ["", "", "", "", ""];

type VoteFormProps = {
  topics: Topic[];
  users: User[];
  onCompleted: (user: User) => void;
};

export function VoteForm({ topics, users, onCompleted }: VoteFormProps) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(emptyRankings);

  async function handleVerify() {
    setErrorMessage("");
    setIsVerified(false);

    if (!selectedUserId || !code.trim()) {
      setErrorMessage("이름과 코드를 모두 입력해주세요.");
      return;
    }

    if (!hasSupabaseConfig()) {
      setErrorMessage("Supabase 환경변수가 설정되지 않았습니다.");
      return;
    }

    setIsChecking(true);

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", selectedUserId)
      .eq("code", code.trim())
      .maybeSingle();

    setIsChecking(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (!data) {
      setErrorMessage("이름과 코드가 일치하지 않습니다.");
      return;
    }

    const { data: savedVotes, error: savedVotesError } = await supabase
      .from("votes")
      .select("topic_id, rank")
      .eq("voter_id", selectedUserId)
      .order("rank", { ascending: true });

    setIsVerified(true);

    if (savedVotesError) {
      setErrorMessage(savedVotesError.message);
      return;
    }

    if (savedVotes && savedVotes.length > 0) {
      const savedRankings = [...emptyRankings];

      savedVotes.forEach((vote) => {
        const rank = Number(vote.rank);
        if (rank >= 1 && rank <= ranks.length) {
          savedRankings[rank - 1] = String(vote.topic_id ?? "");
        }
      });

      setSelectedTopicIds(savedRankings);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!isVerified) {
      setErrorMessage("코드 확인을 먼저 완료해주세요.");
      return;
    }

    if (!hasSupabaseConfig()) {
      setErrorMessage("Supabase 환경변수가 설정되지 않았습니다.");
      return;
    }

    if (selectedTopicIds.some((topicId) => !topicId)) {
      setErrorMessage("1순위부터 5순위까지 모두 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createSupabaseClient();

    const { error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("voter_id", selectedUserId);

    if (deleteError) {
      setIsSubmitting(false);
      setErrorMessage(deleteError.message);
      return;
    }

    const { error } = await supabase.from("votes").insert(
      selectedTopicIds.map((topicId, index) => ({
        voter_id: selectedUserId,
        topic_id: topicId,
        rank: index + 1,
      })),
    );

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    const { error: voteStatusError } = await supabase
      .from("users")
      .update({ vote: true })
      .eq("id", selectedUserId);

    if (voteStatusError) {
      setErrorMessage(voteStatusError.message);
      return;
    }

    const completedUser = users.find((user) => user.id === selectedUserId);

    if (!completedUser) {
      setErrorMessage("투표자 정보를 찾을 수 없습니다.");
      return;
    }

    onCompleted(completedUser);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="field">
        <span>투표자</span>
        <select
          className="voter-select"
          name="voterId"
          value={selectedUserId}
          disabled={users.length === 0 || isVerified}
          onChange={(event) => {
            setSelectedUserId(event.target.value);
            setSelectedTopicIds(emptyRankings);
          }}
        >
          <option value="" disabled>
            {users.length > 0 ? "이름 선택" : "등록된 사용자가 없습니다"}
          </option>
          {users.map((user) => (
            <option value={user.id} key={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>

      <div className="inline-fields">
        <label className="field">
          <span>개인 코드</span>
          <input
            inputMode="numeric"
            name="code"
            placeholder="4자리 코드"
            value={code}
            disabled={isVerified}
            onChange={(event) => setCode(event.target.value)}
          />
        </label>
        <button
          className="button"
          disabled={isChecking || isVerified}
          type="button"
          onClick={handleVerify}
        >
          {isVerified ? "확인 완료" : isChecking ? "확인 중" : "코드 확인"}
        </button>
      </div>

      {errorMessage ? <p className="form-message error">{errorMessage}</p> : null}

      {isVerified ? (
        <>
          <div className="rank-grid">
            {ranks.map((rank) => (
              <label className="field" key={rank}>
                <span>{rank}순위</span>
                <select
                  name={`rank-${rank}`}
                  value={selectedTopicIds[rank - 1]}
                  disabled={topics.length === 0}
                  onChange={(event) => {
                    const nextSelectedTopicIds = [...selectedTopicIds];
                    nextSelectedTopicIds[rank - 1] = event.target.value;
                    setSelectedTopicIds(nextSelectedTopicIds);
                  }}
                >
                  <option value="" disabled>
                    {topics.length > 0 ? "주제 선택" : "등록된 주제가 없습니다"}
                  </option>
                  {topics.map((topic) => (
                    <option value={topic.id} key={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <button
            className="button primary"
            disabled={topics.length === 0 || users.length === 0 || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "저장 중" : "투표 완료"}
          </button>
        </>
      ) : null}
    </form>
  );
}
