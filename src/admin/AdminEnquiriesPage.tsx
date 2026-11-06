import { Mail, MessageSquare, Phone, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Enquiry, EnquiryStatus, EnquiryType } from "../lib/cms";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type TypeFilter = "all" | EnquiryType;
const statuses: { value: EnquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "responded", label: "Responded" },
  { value: "closed", label: "Closed" },
];

export function AdminEnquiriesPage() {
  const [searchParams] = useSearchParams();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [type, setType] = useState<TypeFilter>("all");
  const [status, setStatus] = useState<EnquiryStatus | "all">("all");
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [selectedId, setSelectedId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    if (!supabase) { setLoading(false); return; }
    const { data, error: loadError } = await supabase.from("enquiries").select("*").order("submitted_at", { ascending: false }).limit(300);
    if (loadError) setError(loadError.message);
    else {
      const rows = (data ?? []) as Enquiry[];
      setEnquiries(rows);
      if (selectedId) {
        const selected = rows.find((item) => item.id === selectedId);
        if (selected) setNotes(selected.internal_notes);
      }
    }
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => enquiries.filter((item) => {
    const text = `${item.reference_number} ${item.full_name} ${item.email} ${item.service_required}`.toLowerCase();
    return (type === "all" || item.enquiry_type === type)
      && (status === "all" || item.status === status)
      && text.includes(query.toLowerCase());
  }), [enquiries, query, status, type]);

  const selected = enquiries.find((item) => item.id === selectedId);

  async function updateStatus(item: Enquiry, next: EnquiryStatus) {
    if (!supabase) return;
    setError(""); setNotice("");
    const { error: updateError } = await supabase.from("enquiries").update({ status: next, updated_at: new Date().toISOString() }).eq("id", item.id);
    if (updateError) setError(updateError.message);
    else {
      setEnquiries((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: next } : entry));
      setNotice(`Enquiry ${item.reference_number} updated.`);
    }
  }

  async function saveNotes() {
    if (!supabase || !selected) return;
    setError(""); setNotice("");
    const { error: updateError } = await supabase.from("enquiries").update({ internal_notes: notes, updated_at: new Date().toISOString() }).eq("id", selected.id);
    if (updateError) setError(updateError.message);
    else {
      setEnquiries((current) => current.map((entry) => entry.id === selected.id ? { ...entry, internal_notes: notes } : entry));
      setNotice("Internal notes saved.");
    }
  }

  return (
    <>
      <div className="admin-page-heading"><div><p className="admin-eyebrow">CUSTOMER MESSAGES</p><h1>Enquiries</h1><p>Review quote requests and site-visit requests.</p></div></div>
      {!isSupabaseConfigured && <div className="admin-notice admin-notice--warning">Supabase is not configured. Enquiries cannot be loaded until the backend is connected.</div>}
      {error && <div className="admin-notice admin-notice--error" role="alert">{error}</div>}
      {notice && <div className="admin-notice admin-notice--success">{notice}</div>}
      <div className="admin-card">
        <div aria-label="Enquiry type" className="admin-tabs" role="tablist">
          {([["all", "All"], ["quote", "Quote requests"], ["site_visit", "Site visits"]] as const).map(([value, label]) => <button aria-selected={type === value} key={value} onClick={() => setType(value)} role="tab" type="button">{label}</button>)}
        </div>
        <div className="admin-toolbar" style={{ marginTop: 14 }}>
          <label className="admin-search"><Search aria-hidden="true" size={15} /><input onChange={(event) => setQuery(event.target.value)} placeholder="Search reference, name or service" value={query} /></label>
          <select aria-label="Filter by status" onChange={(event) => setStatus(event.target.value as EnquiryStatus | "all")} value={status}><option value="all">All statuses</option>{statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
          <span className="admin-count">{filtered.length} enquiries</span>
        </div>
        {loading ? <div className="admin-loading">Loading enquiries…</div> : !filtered.length ? <div className="admin-empty">No enquiries match these filters.</div> : (
          <div className="admin-table-wrap"><table className="admin-table">
            <thead><tr><th>Reference</th><th>Customer</th><th>Type</th><th>Service</th><th>Received</th><th>Status</th></tr></thead>
            <tbody>{filtered.map((item) => <tr key={item.id}>
              <td><button className="admin-text-button" onClick={() => { setSelectedId(selectedId === item.id ? "" : item.id); setNotes(item.internal_notes); }} type="button">{item.reference_number}</button></td>
              <td>{item.full_name}</td><td>{item.enquiry_type === "quote" ? "Quote" : "Site Visit"}</td><td>{item.service_required || "—"}</td><td>{new Date(item.submitted_at).toLocaleDateString()}</td>
              <td><select aria-label={`Status for ${item.reference_number}`} onChange={(event) => void updateStatus(item, event.target.value as EnquiryStatus)} value={item.status}>{statuses.map((itemStatus) => <option key={itemStatus.value} value={itemStatus.value}>{itemStatus.label}</option>)}</select></td>
            </tr>)}</tbody>
          </table></div>
        )}
      </div>

      {selected && (
        <section aria-label={`Enquiry ${selected.reference_number}`} className="admin-card" style={{ marginTop: 15 }}>
          <div className="admin-card__heading"><div><p className="admin-eyebrow">{selected.enquiry_type === "quote" ? "QUOTE REQUEST" : "SITE VISIT REQUEST"}</p><h2>{selected.reference_number} · {selected.full_name}</h2></div><button className="admin-button" onClick={() => setSelectedId("")} type="button">Close</button></div>
          <div className="admin-enquiry-detail">
            <p><strong>Email</strong><a href={`mailto:${selected.email}`}><Mail size={14} /> {selected.email}</a></p>
            <p><strong>Phone</strong><a href={`tel:${selected.phone}`}><Phone size={14} /> {selected.phone}</a></p>
            <p><strong>Property type</strong>{selected.property_type || "Not specified"}</p>
            <p><strong>Service required</strong>{selected.service_required || "Not specified"}</p>
            {selected.enquiry_type === "site_visit" && <p><strong>Preferred visit</strong>{selected.preferred_date ?? "Not specified"} {selected.preferred_time ?? ""}</p>}
            <p><strong>Submitted</strong>{new Date(selected.submitted_at).toLocaleString()}</p>
            <p className="admin-enquiry-detail__message"><strong>Message</strong>{selected.message}</p>
          </div>
          <div className="admin-notes">
            <label className="admin-field"><span><MessageSquare size={14} /> Internal notes (administrator-only)</span><textarea onChange={(event) => setNotes(event.target.value)} rows={4} value={notes} /></label>
            <button className="admin-button admin-button--primary" onClick={() => void saveNotes()} type="button">Save Notes</button>
            <div className="admin-editor-actions"><a className="admin-button" href={`mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent(`Muanotronics enquiry ${selected.reference_number}`)}`}><Mail size={14} /> Reply by email</a><a className="admin-button" href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} rel="noreferrer" target="_blank"><Phone size={14} /> WhatsApp</a></div>
          </div>
        </section>
      )}
    </>
  );
}
