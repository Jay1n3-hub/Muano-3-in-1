import { BarChart3, Clock3 } from "lucide-react";

export function AdminAnalyticsPage() {
  return (
    <>
      <div className="admin-page-heading"><div><p className="admin-eyebrow">REPORTING</p><h1>Analytics</h1><p>Website reporting module.</p></div></div>
      <section className="admin-analytics-placeholder">
        <span><BarChart3 aria-hidden="true" size={28} /></span>
        <p className="admin-eyebrow">COMING SOON</p>
        <h2>Analytics Module Under Construction</h2>
        <p>We're preparing website traffic, visitor behaviour and performance reporting.</p>
        <div><Clock3 size={15} /> No analytics data is being displayed yet.</div>
      </section>
    </>
  );
}
