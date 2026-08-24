import { useState } from 'react';

export default function Contact() {
  // useState #2 — controlled form input (manages the message text)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // useState for toggling the form visibility
  const [showForm, setShowForm] = useState(false);

  // Track submission state
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section className="contact-section">
      <div className="section-header">
        <span className="section-subtitle">Get In Touch</span>
        <h2 className="section-title">Contact Me</h2>
        <div className="section-divider"></div>
      </div>

      {/* Toggle form visibility button */}
      <div className="contact-toggle-wrapper">
        <p className="contact-intro">
          Have a project in mind or just want to say hello? I'd love to hear from you.
        </p>
        <button
          className={`filter-tab ${showForm ? 'active' : ''}`}
          onClick={() => setShowForm(prev => !prev)}
        >
          {showForm ? 'Hide Contact Form' : 'Show Contact Form'}
        </button>
      </div>

      {/* Conditionally rendered contact form */}
      {showForm && (
        <div className="contact-form-container">
          {submitted ? (
            <div className="form-success">
              <div className="success-icon">✓</div>
              <h3>Message Sent!</h3>
              <p>Thank you, <strong>{formData.name || 'friend'}</strong>. I'll get back to you soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Write your message…"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* Real-time preview of user input */}
              {formData.message && (
                <div className="message-preview">
                  <span className="preview-label">Live Preview</span>
                  <p className="preview-text">{formData.message}</p>
                </div>
              )}

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
