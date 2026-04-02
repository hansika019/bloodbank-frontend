import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/donors";
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #dc2626;
    --red-dim: rgba(220,38,38,0.08);
    --red-border: rgba(220,38,38,0.2);
    --bg: #f5f5f7;
    --surface: #ffffff;
    --surface2: #f9f9fb;
    --surface3: #f0f0f4;
    --border: rgba(0,0,0,0.08);
    --text: #0f0f12;
    --muted: #7c7c8a;
    --dim: #c4c4cc;
    --green: #16a34a;
    --blue: #3b82f6;
    --amber: #d97706;
    --teal: #0d9488;
    --font-display: 'Syne', sans-serif;
    --font-body: 'Outfit', sans-serif;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.07);
    --shadow-md: 0 4px 24px rgba(0,0,0,0.08);
  }

  body { background: var(--bg); font-family: var(--font-body); color: var(--text); }

  .bbms-root {
    display: flex; min-height: 100vh;
    font-family: var(--font-body);
    background: var(--bg); color: var(--text);
  }

  /* SIDEBAR */
  .sidebar {
    width: 72px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    align-items: center;
    padding: 24px 0; gap: 8px;
    position: sticky; top: 0;
    height: 100vh; z-index: 50; flex-shrink: 0;
    box-shadow: var(--shadow-sm);
  }

  .sidebar-logo {
    width: 40px; height: 40px;
    background: var(--red);
    border-radius: 12px;
    display: grid; place-items: center;
    font-size: 20px; margin-bottom: 24px;
    box-shadow: 0 4px 14px rgba(220,38,38,0.35);
  }

  .nav-btn {
    width: 44px; height: 44px;
    border-radius: 12px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    display: grid; place-items: center;
    font-size: 18px; transition: all .2s;
    position: relative;
  }
  .nav-btn:hover { background: var(--surface3); color: var(--text); }
  .nav-btn.active { background: var(--red-dim); color: var(--red); border-color: var(--red-border); }

  .nav-tooltip {
    position: absolute; left: 56px;
    background: var(--text); color: #fff;
    font-size: 12px; font-weight: 500;
    padding: 5px 10px; border-radius: 7px;
    white-space: nowrap; opacity: 0;
    pointer-events: none; transition: opacity .15s;
  }
  .nav-btn:hover .nav-tooltip { opacity: 1; }

  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; overflow-x: hidden; }

  .topbar {
    position: sticky; top: 0; z-index: 40;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 0 36px; height: 64px;
    display: flex; align-items: center;
    justify-content: space-between;
    box-shadow: var(--shadow-sm);
  }

  .topbar-title {
    font-family: var(--font-display);
    font-size: 20px; font-weight: 800;
    letter-spacing: -0.01em; color: var(--text);
  }
  .topbar-title span { color: var(--red); }

  .topbar-right { display: flex; align-items: center; gap: 12px; }

  .status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px rgba(22,163,74,0.5);
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.4} }
  .status-text { font-size: 13px; color: var(--muted); }

  .logout-btn {
    padding: 8px 16px;
    background: var(--red-dim);
    border: 1px solid var(--red-border);
    border-radius: 9px;
    color: var(--red);
    font-family: var(--font-body);
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all .18s;
  }
  .logout-btn:hover { background: var(--red); color: #fff; }

  .content { padding: 32px 36px; display: flex; flex-direction: column; gap: 28px; }

  /* STATS */
  .stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px; padding: 20px 22px;
    display: flex; align-items: center; gap: 16px;
    transition: border-color .2s, transform .2s, box-shadow .2s;
    box-shadow: var(--shadow-sm);
    animation: fadeUp .5s ease both;
  }
  .stat-card:hover { border-color: var(--red-border); transform: translateY(-2px); box-shadow: var(--shadow-md); }

  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

  .stat-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: grid; place-items: center; font-size: 20px; flex-shrink: 0;
  }
  .stat-icon.red   { background: rgba(220,38,38,0.1); }
  .stat-icon.green { background: rgba(22,163,74,0.1); }
  .stat-icon.blue  { background: rgba(59,130,246,0.1); }
  .stat-icon.amber { background: rgba(217,119,6,0.1); }

  .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing:.08em; margin-bottom:4px; }
  .stat-value { font-family: var(--font-display); font-size: 30px; font-weight: 700; line-height:1; color: var(--text); }

  /* TOOLBAR */
  .toolbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .search-wrap { position: relative; flex: 1; min-width: 200px; }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 15px; color: var(--muted); }

  input, select {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px; padding: 11px 16px;
    font-family: var(--font-body); font-size: 14px;
    color: var(--text); outline: none; width: 100%;
    transition: border-color .2s, box-shadow .2s;
    box-shadow: var(--shadow-sm);
  }
  input::placeholder { color: var(--dim); }
  input:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(220,38,38,0.1); }
  .search-wrap input { padding-left: 40px; }

  .bg-filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .bg-chip {
    padding: 7px 14px; border-radius: 20px;
    font-size: 12px; font-weight: 600;
    border: 1.5px solid var(--border);
    background: var(--surface); color: var(--muted);
    cursor: pointer; transition: all .18s;
    font-family: var(--font-body);
  }
  .bg-chip:hover { border-color: var(--red-border); color: var(--text); }
  .bg-chip.active { background: var(--red); color: #fff; border-color: var(--red); }

  .section-header { display: flex; align-items: center; justify-content: space-between; }
  .section-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text); }
  .section-count { font-size: 13px; color: var(--muted); }

  /* DONOR GRID */
  .donor-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap: 16px; }

  .donor-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 18px; padding: 22px;
    display: flex; flex-direction: column; gap: 16px;
    transition: border-color .2s, transform .22s, box-shadow .22s;
    box-shadow: var(--shadow-sm);
    animation: fadeUp .4s ease both;
    position: relative; overflow: hidden;
  }
  .donor-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--red), transparent);
    opacity: 0; transition: opacity .2s;
  }
  .donor-card:hover { border-color: var(--red-border); transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
  .donor-card:hover::before { opacity: 1; }
  .donor-card.is-fav { border-color: rgba(217,119,6,0.3); }
  .donor-card.is-fav::before { background: linear-gradient(90deg,transparent,var(--amber),transparent); opacity:1; }

  .card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }

  .donor-avatar {
    width: 46px; height: 46px; border-radius: 13px;
    background: linear-gradient(135deg, #7b0012, var(--red));
    display: grid; place-items: center;
    font-family: var(--font-display); font-size: 18px; font-weight: 700;
    color: #fff; flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(220,38,38,0.25);
  }

  .donor-info { flex: 1; }
  .donor-name { font-size: 15px; font-weight: 600; margin-bottom: 3px; color: var(--text); }
  .donor-sub  { font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 5px; }

  .blood-badge {
    font-family: var(--font-display); font-size: 18px; font-weight: 800;
    color: var(--red); background: var(--red-dim);
    border: 1.5px solid var(--red-border);
    border-radius: 10px; padding: 6px 12px; line-height: 1;
  }

  .card-meta { border-top: 1px solid var(--border); padding-top: 14px; display: flex; flex-direction: column; gap: 6px; }
  .meta-row { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--muted); }
  .meta-icon { width: 18px; text-align: center; font-size: 14px; }
  .meta-val  { color: var(--text); font-weight: 400; }

  .card-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px; }

  .act {
    padding: 9px 6px; border-radius: 9px;
    border: 1.5px solid transparent;
    font-family: var(--font-body); font-size: 12px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: 5px; transition: all .18s;
  }
  .act:hover { filter: brightness(0.95); transform: translateY(-1px); }

  .act-edit  { background:rgba(59,130,246,.08);  color:#2563eb; border-color:rgba(59,130,246,.2); }
  .act-del   { background:rgba(220,38,38,.08);   color:#dc2626; border-color:rgba(220,38,38,.2); }
  .act-fav   { background:rgba(217,119,6,.08);   color:var(--amber); border-color:rgba(217,119,6,.2); }
  .act-fav.on{ background:rgba(217,119,6,.18); }
  .act-wa    { background:rgba(22,163,74,.08);   color:#16a34a; border-color:rgba(22,163,74,.2); }
  .act-email { background:rgba(168,85,247,.08);  color:#9333ea; border-color:rgba(168,85,247,.2); }
  .act-call  { background:rgba(13,148,136,.08);  color:var(--teal); border-color:rgba(13,148,136,.2); }

  /* DRAWER */
  .drawer-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(4px);
    z-index: 100; display: flex;
    justify-content: flex-end;
    animation: overlayIn .2s ease;
  }
  @keyframes overlayIn { from{opacity:0} to{opacity:1} }

  .drawer {
    width: 420px; height: 100vh;
    background: var(--surface);
    border-left: 1.5px solid var(--border);
    padding: 32px 28px;
    display: flex; flex-direction: column; gap: 20px;
    overflow-y: auto;
    animation: drawerIn .25s ease;
    box-shadow: -8px 0 32px rgba(0,0,0,0.1);
  }
  @keyframes drawerIn { from{transform:translateX(60px);opacity:0} to{transform:none;opacity:1} }

  .drawer-title { font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--text); }
  .drawer-title span { color: var(--red); }

  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing:.08em; font-weight:500; }

  .bg-select-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
  .bg-opt {
    padding: 10px 4px; border-radius: 9px;
    border: 1.5px solid var(--border);
    background: var(--surface2); color: var(--muted);
    font-family: var(--font-display); font-size: 14px; font-weight: 700;
    cursor: pointer; text-align: center; transition: all .18s;
  }
  .bg-opt:hover  { border-color: var(--red-border); color: var(--text); }
  .bg-opt.active { background: var(--red-dim); border-color: var(--red); color: var(--red); }

  .drawer-actions { display: flex; gap: 10px; margin-top: auto; }

  .btn-primary {
    flex: 1; padding: 14px; background: var(--red); border: none;
    border-radius: 11px; font-family: var(--font-body);
    font-size: 15px; font-weight: 600; color: #fff;
    cursor: pointer; transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 16px rgba(220,38,38,0.3);
  }
  .btn-primary:hover { background: #b91c1c; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(220,38,38,0.4); }

  .btn-secondary {
    padding: 14px 20px; background: var(--surface3);
    border: 1.5px solid var(--border); border-radius: 11px;
    font-family: var(--font-body); font-size: 15px; font-weight: 600;
    color: var(--muted); cursor: pointer; transition: all .2s;
  }
  .btn-secondary:hover { border-color: var(--red-border); color: var(--text); }

  .fab {
    position: fixed; bottom: 32px; right: 32px;
    width: 56px; height: 56px; border-radius: 16px;
    background: var(--red); border: none; color: #fff;
    font-size: 26px; cursor: pointer;
    display: grid; place-items: center;
    box-shadow: 0 8px 28px rgba(220,38,38,0.4);
    z-index: 80; transition: transform .18s, box-shadow .18s;
  }
  .fab:hover { transform: scale(1.08) translateY(-2px); box-shadow: 0 12px 36px rgba(220,38,38,0.55); }

  .empty { grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--muted); }
  .empty-icon { font-size:48px; margin-bottom:14px; opacity:.3; }
  .empty-text { font-size:15px; }

  .toast {
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
    background: var(--text); color: #fff;
    font-size: 13px; font-weight: 500;
    padding: 12px 22px; border-radius: 12px;
    z-index: 200; box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    animation: toastIn .25s ease, toastOut .25s ease 2.5s both;
  }
  @keyframes toastIn  { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  @keyframes toastOut { to{opacity:0;transform:translateX(-50%) translateY(10px)} }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--dim); border-radius: 99px; }

  @media (max-width: 900px) {
    .stats-row { grid-template-columns: 1fr 1fr; }
    .content { padding: 20px 16px; }
    .topbar  { padding: 0 16px; }
    .drawer  { width: 100vw; }
  }
`;

function Toast({ msg }) {
  return msg ? <div className="toast">{msg}</div> : null;
}

function StatCard({ icon, label, value, cls, delay }) {
  return (
    <div className="stat-card" style={{ animationDelay: delay }}>
      <div className={`stat-icon ${cls}`}>{icon}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

function DonorCard({ d, onEdit, onDelete, onFav, onWhatsApp, onEmail, onCall }) {
  const initials = d.name ? d.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() : "?";
  return (
    <div className={`donor-card${d.favorite ? " is-fav" : ""}`}>
      <div className="card-top">
        <div className="donor-avatar">{initials}</div>
        <div className="donor-info">
          <div className="donor-name">{d.name}</div>
          <div className="donor-sub"><span>📍</span><span>{d.location || "—"}</span></div>
        </div>
        <div className="blood-badge">{d.bloodGroup || "—"}</div>
      </div>
      <div className="card-meta">
        <div className="meta-row"><span className="meta-icon">📞</span><span className="meta-val">{d.phone || "Not provided"}</span></div>
        <div className="meta-row"><span className="meta-icon">✉️</span><span className="meta-val">{d.email || "Not provided"}</span></div>
      </div>
      <div className="card-actions">
        <button className="act act-edit"  onClick={() => onEdit(d)}>✏️ Edit</button>
        <button className="act act-del"   onClick={() => onDelete(d.id)}>🗑 Delete</button>
        <button className={`act act-fav${d.favorite?" on":""}`} onClick={() => onFav(d)}>{d.favorite?"★ Saved":"☆ Save"}</button>
        <button className="act act-wa"    onClick={() => onWhatsApp(d.phone)}>💬 WhatsApp</button>
        <button className="act act-email" onClick={() => onEmail(d.email)}>📧 Email</button>
        <button className="act act-call"  onClick={() => onCall(d.phone)}>📲 Call</button>
      </div>
    </div>
  );
}

function Drawer({ form, setForm, editId, onSubmit, onClose }) {
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const selectBG = bg => setForm(f => ({ ...f, bloodGroup: bg }));
  return (
    <div className="drawer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="drawer">
        <div className="drawer-title">{editId ? <><span>Edit</span> Donor</> : <>Add <span>Donor</span></>}</div>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input name="name" placeholder="e.g. Ravi Kumar" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Blood Group</label>
          <div className="bg-select-grid">
            {BLOOD_GROUPS.map(bg => (
              <div key={bg} className={`bg-opt${form.bloodGroup===bg?" active":""}`} onClick={() => selectBG(bg)}>{bg}</div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input name="location" placeholder="e.g. Hyderabad" value={form.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input name="phone" placeholder="e.g. 9876543210" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input name="email" placeholder="e.g. ravi@email.com" value={form.email} onChange={handleChange} />
        </div>
        <div className="drawer-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSubmit}>{editId ? "Update Donor" : "Add Donor"}</button>
        </div>
      </div>
    </div>
  );
}

export default function MainPage({ onLogout }) {
  const [donors, setDonors]         = useState([]);
  const [search, setSearch]         = useState("");
  const [bgFilter, setBgFilter]     = useState("");
  const [editId, setEditId]         = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast]           = useState("");
  const [activeNav, setActiveNav]   = useState("donors");
  const [form, setForm]             = useState({ name:"", bloodGroup:"", location:"", phone:"", email:"" });

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => { fetchDonors(); }, []);
  const fetchDonors = () => axios.get(API).then(r => setDonors(r.data));

  const openAdd  = () => { setForm({ name:"", bloodGroup:"", location:"", phone:"", email:"" }); setEditId(null); setDrawerOpen(true); };
  const openEdit = d  => { setForm(d); setEditId(d.id); setDrawerOpen(true); };

  const handleSubmit = () => {
    if (editId) {
      axios.put(`${API}/${editId}`, form).then(() => { fetchDonors(); setDrawerOpen(false); showToast("✅ Donor updated!"); });
    } else {
      axios.post(API, { ...form, favorite: false }).then(() => { fetchDonors(); setDrawerOpen(false); showToast("✅ Donor added!"); });
    }
  };

  const deleteDonor    = id => { if (window.confirm("Remove this donor?")) axios.delete(`${API}/${id}`).then(() => { fetchDonors(); showToast("🗑 Donor removed"); }); };
  const toggleFavorite = d  => { axios.put(`${API}/${d.id}`, { ...d, favorite: !d.favorite }).then(() => { fetchDonors(); showToast(d.favorite ? "Removed from favorites" : "⭐ Saved!"); }); };

  const filtered = donors.filter(d => {
    const s = search.toLowerCase();
    return (d.name?.toLowerCase().includes(s) || d.bloodGroup?.toLowerCase().includes(s) || d.location?.toLowerCase().includes(s))
      && (bgFilter ? d.bloodGroup === bgFilter : true);
  });

  const displayDonors = activeNav === "favorites" ? filtered.filter(d => d.favorite) : filtered;
  const favCount  = donors.filter(d => d.favorite).length;
  const bgGroups  = [...new Set(donors.map(d => d.bloodGroup).filter(Boolean))];

  return (
    <>
      <style>{styles}</style>
      <div className="bbms-root">
        <aside className="sidebar">
          <div className="sidebar-logo">🩸</div>
          {[{id:"donors",icon:"🩸",label:"Donors"},{id:"favorites",icon:"★",label:"Favorites"}].map(n => (
            <button key={n.id} className={`nav-btn${activeNav===n.id?" active":""}`} onClick={() => setActiveNav(n.id)}>
              {n.icon}<span className="nav-tooltip">{n.label}</span>
            </button>
          ))}
        </aside>

        <div className="main">
          <div className="topbar">
            <div className="topbar-title">Blood<span>Bank</span> MS</div>
            <div className="topbar-right">
              <div className="status-dot" />
              <span className="status-text">API Connected</span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          </div>

          <div className="content">
            <div className="stats-row">
              <StatCard icon="🩸" label="Total Donors"  value={donors.length}        cls="red"   delay=".05s" />
              <StatCard icon="★"  label="Favorites"     value={favCount}              cls="amber" delay=".1s"  />
              <StatCard icon="🧬" label="Blood Groups"  value={bgGroups.length}       cls="blue"  delay=".15s" />
              <StatCard icon="🔍" label="Filtered"      value={displayDonors.length}  cls="green" delay=".2s"  />
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              <div className="toolbar">
                <div className="search-wrap">
                  <span className="search-icon">🔍</span>
                  <input placeholder="Search by name, blood group or location…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button className="btn-primary" style={{width:"auto",padding:"11px 22px"}} onClick={openAdd}>+ Add Donor</button>
              </div>
              <div className="bg-filter-row">
                <div className={`bg-chip${bgFilter===""?" active":""}`} onClick={() => setBgFilter("")}>All</div>
                {BLOOD_GROUPS.map(bg => (
                  <div key={bg} className={`bg-chip${bgFilter===bg?" active":""}`} onClick={() => setBgFilter(bg===bgFilter?"":bg)}>{bg}</div>
                ))}
              </div>
            </div>

            <div className="section-header">
              <div className="section-title">{activeNav==="favorites"?"Favorite Donors":"All Donors"}</div>
              <div className="section-count">{displayDonors.length} result{displayDonors.length!==1?"s":""}</div>
            </div>

            <div className="donor-grid">
              {displayDonors.length === 0 ? (
                <div className="empty"><div className="empty-icon">🩸</div><div className="empty-text">No donors found. Add one to get started.</div></div>
              ) : displayDonors.map(d => (
                <DonorCard key={d.id} d={d} onEdit={openEdit} onDelete={deleteDonor} onFav={toggleFavorite}
                  onWhatsApp={p => window.open(`https://wa.me/${p}`,"_blank")}
                  onEmail={e => window.open(`mailto:${e}`)}
                  onCall={p => window.open(`tel:${p}`)} />
              ))}
            </div>
          </div>
        </div>

        {drawerOpen && <Drawer form={form} setForm={setForm} editId={editId} onSubmit={handleSubmit} onClose={() => setDrawerOpen(false)} />}
        <button className="fab" onClick={openAdd}>＋</button>
        <Toast msg={toast} />
      </div>
    </>
  );
}