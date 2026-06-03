import Link from "next/link";
import { LightRouteView } from "../light-route-view";
import { getTopics } from "@/lib/queries";

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <>
      <LightRouteView />
      <main className="page topics-page">
        <div className="topic-list">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <article className="topic-row" key={topic.id}>
                <div className="topic-row-info">
                  <h2>{topic.title}</h2>
                  {topic.userName ? (
                    <a
                      className="pdf-link"
                      href={`/pdf/${encodeURIComponent(topic.userName)}.pdf`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      발표 자료 PDF 보기
                    </a>
                  ) : null}
                </div>
                <div className="topic-row-orange">
                  <img
                    alt=""
                    aria-hidden="true"
                    className="topic-row-bg"
                    src="/orange.png"
                  />
                  <span className="topic-owner">
                    {topic.userName ?? "이름 없음"}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <article className="topic-row">
              <div className="topic-row-info">
                <h2>등록된 주제가 없습니다</h2>
                <p>Supabase `topics` 테이블에 주제를 먼저 추가해주세요.</p>
              </div>
              <div className="topic-row-orange">
                <img
                  alt=""
                  aria-hidden="true"
                  className="topic-row-bg"
                  src="/orange.png"
                />
                <span className="topic-owner">대기</span>
              </div>
            </article>
          )}
        </div>
      </main>
    </>
  );
}
