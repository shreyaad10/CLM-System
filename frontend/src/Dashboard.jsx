// =============================================
// Dashboard.jsx - Main Admin Dashboard
// =============================================
import { useState, useEffect } from 'react';
import { fetchLeads, createLead, updateLead, deleteLead } from './api';

// ── Status badge colors ────────────────────
const STATUS_STYLES = {
  New:       'badge-new',
  Contacted: 'badge-contacted',
  Converted: 'badge-converted',
};

// ── Blank lead template ────────────────────
const EMPTY_LEAD = { name: '', email: '', source: 'Website', status: 'New', notes: '' };

function Dashboard({ onLogout }) {
  const [leads, setLeads]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  // Modal state
  const [showModal, setShowModal]     = useState(false);
  const [editingId, setEditingId]     = useState(null); // null = adding new
  const [form, setForm]               = useState(EMPTY_LEAD);
  const [formError, setFormError]     = useState('');
  const [saving, setSaving]           = useState(false);

  // Search / filter
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Notes / Follow-up modal
  const [notesModal, setNotesModal]   = useState(null); // lead object or null

  // ── Load leads on mount ──────────────────
  useEffect(() => { loadLeads(); }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await fetchLeads();
      setLeads(data);
    } catch (err) {
      setError('Could not load leads. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  // ── Summary counts ───────────────────────
  const total     = leads.length;
  const newCount  = leads.filter(l => l.status === 'New').length;
  const contacted = leads.filter(l => l.status === 'Contacted').length;
  const converted = leads.filter(l => l.status === 'Converted').length;

  // ── Filtered + searched leads ────────────
  const visibleLeads = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Open modal for add / edit ────────────
  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_LEAD);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (lead) => {
    setEditingId(lead._id);
    setForm({
      name: lead.name,
      email: lead.email,
      source: lead.source,
      status: lead.status,
      notes: lead.notes || '',
    });
    setFormError('');
    setShowModal(true);
  };

  // ── Save (add or update) lead ────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and Email are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateLead(editingId, form);
        setSuccess('Lead updated successfully!');
      } else {
        await createLead(form);
        setSuccess('New lead added!');
      }
      setShowModal(false);
      loadLeads();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete lead ──────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete lead "${name}"? This cannot be undone.`)) return;
    try {
      await deleteLead(id);
      setSuccess(`Lead "${name}" deleted.`);
      loadLeads();
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Quick status change ──────────────────
  const handleStatusChange = async (lead, newStatus) => {
    try {
      await updateLead(lead._id, { ...lead, status: newStatus });
      setSuccess(`Status updated to "${newStatus}"`);
      loadLeads();
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Render ───────────────────────────────
  return (
    <div className="dashboard">

      {/* ── Top Navbar ─────────────────── */}
      <header className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo">⚡</span>
          <span className="navbar-title">LeadFlow <span className="navbar-sub">CRM</span></span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-main">

        {/* ── Alerts ──────────────────── */}
        {error   && <div className="alert alert-error"   onClick={() => setError('')}>{error} <span className="alert-close">✕</span></div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* ── Summary Cards ───────────── */}
        <section className="summary-grid">
          <div className="summary-card card-total">
            <div className="summary-icon">👥</div>
            <div>
              <div className="summary-num">{total}</div>
              <div className="summary-label">Total Leads</div>
            </div>
          </div>
          <div className="summary-card card-new">
            <div className="summary-icon">🆕</div>
            <div>
              <div className="summary-num">{newCount}</div>
              <div className="summary-label">New Leads</div>
            </div>
          </div>
          <div className="summary-card card-contacted">
            <div className="summary-icon">📞</div>
            <div>
              <div className="summary-num">{contacted}</div>
              <div className="summary-label">Contacted</div>
            </div>
          </div>
          <div className="summary-card card-converted">
            <div className="summary-icon">✅</div>
            <div>
              <div className="summary-num">{converted}</div>
              <div className="summary-label">Converted</div>
            </div>
          </div>
        </section>

        {/* ── Lead Management Header ────── */}
        <section className="leads-section">
          <div className="leads-header">
            <h2 className="section-title">All Leads</h2>
            <button className="btn btn-primary" onClick={openAddModal}>
              + Add Lead
            </button>
          </div>

          {/* ── Search & Filter Bar ─────── */}
          <div className="filter-bar">
            <input
              className="form-input search-input"
              type="text"
              placeholder="🔍  Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filter-tabs">
              {['All', 'New', 'Contacted', 'Converted'].map(s => (
                <button
                  key={s}
                  className={`filter-tab ${filterStatus === s ? 'active' : ''}`}
                  onClick={() => setFilterStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ── Leads Table ─────────────── */}
          {loading ? (
            <div className="loading-state">Loading leads...</div>
          ) : visibleLeads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>{leads.length === 0 ? 'No leads yet. Add your first lead!' : 'No leads match your filter.'}</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleLeads.map((lead, i) => (
                    <tr key={lead._id}>
                      <td className="row-num">{i + 1}</td>
                      <td className="lead-name">{lead.name}</td>
                      <td className="lead-email">{lead.email}</td>
                      <td>{lead.source}</td>
                      <td>
                        {/* Clickable status badge cycles through statuses */}
                        <select
                          className={`status-select badge ${STATUS_STYLES[lead.status]}`}
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead, e.target.value)}
                        >
                          <option>New</option>
                          <option>Contacted</option>
                          <option>Converted</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="notes-btn"
                          title={lead.notes || 'No notes'}
                          onClick={() => setNotesModal(lead)}
                        >
                          {lead.notes ? '📝 View' : '+ Add'}
                        </button>
                      </td>
                      <td className="date-cell">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => openEditModal(lead)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDelete(lead._id, lead.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* ── Add/Edit Lead Modal ──────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Lead' : 'Add New Lead'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Source</label>
                  <select
                    className="form-input"
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                  >
                    {['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Call', 'Other'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Converted</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes / Follow-up</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Add any notes or follow-up reminders..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Lead' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Notes View Modal ─────────────── */}
      {notesModal && (
        <div className="modal-overlay" onClick={() => setNotesModal(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Notes — {notesModal.name}</h3>
              <button className="modal-close" onClick={() => setNotesModal(null)}>✕</button>
            </div>
            <div className="notes-content">
              {notesModal.notes
                ? <p>{notesModal.notes}</p>
                : <p className="no-notes">No notes added yet. Click Edit to add notes.</p>
              }
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => { setNotesModal(null); openEditModal(notesModal); }}>
                Edit Notes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
