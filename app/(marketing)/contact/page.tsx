'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Package,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageSquare,
} from 'lucide-react';

// WhatsApp SVG Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '', // Honeypot field
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(formData.name)) {
      errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (formData.email.length > 254) {
      errors.email = 'Email must be less than 254 characters';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but has limits)
    if (formData.phone && formData.phone.length > 20) {
      errors.phone = 'Phone number must be less than 20 characters';
    }

    // Subject validation
    if (!formData.subject) {
      errors.subject = 'Please select a subject';
    } else if (formData.subject.length > 200) {
      errors.subject = 'Subject must be less than 200 characters';
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    } else if (formData.message.length > 2000) {
      errors.message = 'Message must be less than 2000 characters';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setFieldErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
          website: formData.website, // Honeypot
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        website: '',
      });

      // Reset success message after 8 seconds
      setTimeout(() => setStatus('idle'), 8000);
    } catch (error) {
      setStatus('error');
      const err = error instanceof Error ? error.message : 'Failed to send message';
      setErrorMessage(
        err.includes('rate limit')
          ? err
          : 'Failed to send message. Please try again or email us directly at support@verysimpleinventory.com'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Very Simple Inventory
              </h1>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/sign-in"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/sign-up"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help. Reach out with any questions, feedback, or support needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email Support</h4>
                    <a
                      href="mailto:support@verysimpleinventory.com"
                      className="text-blue-600 hover:text-blue-800 transition-colors font-semibold"
                    >
                      support@verysimpleinventory.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">For general inquiries and support</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Phone Support</h4>
                    <a
                      href="tel:+2348031234567"
                      className="text-blue-600 hover:text-blue-800 transition-colors block font-semibold"
                    >
                      +234 803 123 4567
                    </a>
                    <a
                      href="tel:+2348057654321"
                      className="text-blue-600 hover:text-blue-800 transition-colors block font-semibold"
                    >
                      +234 805 765 4321
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      Monday - Friday: 8:00 AM - 6:00 PM WAT
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
                    <WhatsAppIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2">WhatsApp Business</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Get instant support via WhatsApp!
                    </p>
                    <a
                      href="https://wa.me/2348031234567?text=Hello%2C%20I%20need%20help%20with%20Very%20Simple%20Inventory"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Office Location</h4>
                    <p className="text-gray-900">
                      123 Herbert Macaulay Way
                      <br />
                      Yaba, Lagos State
                      <br />
                      Nigeria
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-gray-900">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 2:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                    <p className="text-sm text-gray-600 mt-1">West Africa Time (WAT)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response Promise */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Quick Response Guarantee</h4>
                  <p className="text-gray-700">
                    We aim to respond to all inquiries within 24 hours during business days. For
                    urgent matters, please call our phone support line.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
            <p className="text-sm text-gray-600 mb-6">
              All fields marked with <span className="text-red-500 font-bold">*</span> are required.
              Character limits are enforced.
            </p>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 font-bold text-base">✅ Message sent successfully!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Your message has been delivered to our support team. We'll respond as soon as possible.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-bold text-base">❌ Failed to send message</p>
                  <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field - hidden from users, catches bots */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={100}
                  className={`w-full px-4 py-3 border-2 ${
                    fieldErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium transition-all`}
                  placeholder="John Doe"
                  disabled={status === 'loading'}
                />
                {fieldErrors.name && (
                  <p className="text-red-600 text-xs mt-1 font-semibold">⚠️ {fieldErrors.name}</p>
                )}
                <p className={`text-xs mt-1 ${formData.name.length > 90 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                  {formData.name.length}/100 characters {formData.name.length < 2 && formData.name.length > 0 && '(minimum 2)'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={254}
                  className={`w-full px-4 py-3 border-2 ${
                    fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium transition-all`}
                  placeholder="john@example.com"
                  disabled={status === 'loading'}
                />
                {fieldErrors.email && (
                  <p className="text-red-600 text-xs mt-1 font-semibold">⚠️ {fieldErrors.email}</p>
                )}
                <p className={`text-xs mt-1 ${formData.email.length > 240 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                  {formData.email.length}/254 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Phone Number <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={20}
                  className={`w-full px-4 py-3 border-2 ${
                    fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium transition-all`}
                  placeholder="+234 803 123 4567"
                  disabled={status === 'loading'}
                />
                {fieldErrors.phone && (
                  <p className="text-red-600 text-xs mt-1 font-semibold">⚠️ {fieldErrors.phone}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">{formData.phone.length}/20 characters</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 ${
                    fieldErrors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-bold transition-all`}
                  disabled={status === 'loading'}
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing Question">Billing Question</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Partnership Opportunity">Partnership Opportunity</option>
                  <option value="Other">Other</option>
                </select>
                {fieldErrors.subject && (
                  <p className="text-red-600 text-xs mt-1 font-semibold">⚠️ {fieldErrors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={2000}
                  rows={6}
                  className={`w-full px-4 py-3 border-2 ${
                    fieldErrors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium transition-all resize-none`}
                  placeholder="Tell us how we can help you..."
                  disabled={status === 'loading'}
                />
                {fieldErrors.message && (
                  <p className="text-red-600 text-xs mt-1 font-semibold">⚠️ {fieldErrors.message}</p>
                )}
                <p
                  className={`text-xs mt-1 ${
                    formData.message.length >= 2000
                      ? 'text-red-600 font-bold'
                      : formData.message.length >= 1800
                      ? 'text-orange-600 font-semibold'
                      : 'text-gray-500'
                  }`}
                >
                  {formData.message.length}/2000 characters
                  {formData.message.length < 10 && formData.message.length > 0 && ' (minimum 10)'}
                  {formData.message.length >= 1800 && formData.message.length < 2000 && ' (approaching limit)'}
                  {formData.message.length >= 2000 && ' (LIMIT REACHED)'}
                </p>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending your message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 Very Simple Inventory. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold"
              >
                Home
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
