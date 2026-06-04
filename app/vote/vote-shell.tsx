"use client";

import { useEffect, useState } from "react";
import type { Topic, User } from "@/lib/types";
import { VoteForm } from "./vote-form";

const voteCompletedStorageKey = "team-selection:vote-completed";
const voteCompletedUserIdStorageKey = "team-selection:vote-completed-user-id";
const voteCompletedNameStorageKey = "team-selection:vote-completed-name";

type VoteShellProps = {
  topics: Topic[];
  users: User[];
};

export function VoteShell({ topics, users }: VoteShellProps) {
  const [completedName, setCompletedName] = useState<string | null>(null);

  useEffect(() => {
    if (window.localStorage.getItem(voteCompletedStorageKey) === "true") {
      const storedUserId = window.localStorage.getItem(voteCompletedUserIdStorageKey);
      const storedName = window.localStorage.getItem(voteCompletedNameStorageKey);
      const matchedUser = users.find((user) => user.id === storedUserId);

      setCompletedName(matchedUser?.name ?? storedName ?? "회원");
    }
  }, [users]);

  useEffect(() => {
    document.body.classList.toggle("completed-vote", Boolean(completedName));
    document.body.classList.toggle("home-route", !completedName);

    return () => {
      document.body.classList.remove("completed-vote");
      document.body.classList.remove("home-route");
    };
  }, [completedName]);

  if (completedName) {
    return (
      <main className="completion-page">
        <section className="complete-error-copy">
          <h1>404 Not Found</h1>
          <p>
            <span className="topic-owner">{completedName}</span> vote completed.
          </p>
          <p>메롱</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page vote-page">
      <section className="vote-panel" aria-label="투표">
        <VoteForm
          topics={topics}
          users={users}
          onCompleted={(user) => {
            window.localStorage.setItem(voteCompletedStorageKey, "true");
            window.localStorage.setItem(voteCompletedUserIdStorageKey, user.id);
            window.localStorage.setItem(voteCompletedNameStorageKey, user.name);
            setCompletedName(user.name);
          }}
        />
      </section>

      <aside className="vote-sidebar" aria-label="주제와 발표자 목록">
        <p className="eyebrow">Topic</p>
        <div className="side-topic-list">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <div className="side-topic-item topic-signature-item" key={topic.id}>
                <div>
                  <strong>{topic.title}</strong>
                </div>
                <p className="topic-owner">{topic.userName ?? "이름 없음"}</p>
              </div>
            ))
          ) : (
            <p className="empty-text">등록된 주제가 없습니다.</p>
          )}
        </div>
      </aside>
    </main>
  );
}
