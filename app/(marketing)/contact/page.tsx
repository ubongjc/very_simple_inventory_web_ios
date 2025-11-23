'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Package,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '', // Honeypot field for spam protection
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }

    // Validate character limits only for message
    if (name === 'message' && value.length > 2000) {
      setValidationErrors({
        ...validationErrors,
        message: 'Message must be 2000 characters or less',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate character limits before submitting (only for message)
    const errors = {
      name: '',
      email: '',
      message: '',
    };

    if (formData.message.length > 2000) {
      errors.message = 'Message must be 2000 characters or less';
    }

    if (errors.message) {
      setValidationErrors(errors);
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: 'general', // Default subject for simplified form
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        message: '',
        website: '',
      });
      setValidationErrors({
        name: '',
        email: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      const err = error instanceof Error ? error.message : 'Failed to send message';
      setErrorMessage(
        err.includes('rate limit')
          ? err
          : 'Failed to send message. Please try again or contact us directly via email.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                Very Simple Inventory
              </h1>
            </Link>
            <div className="flex items-center gap-2 ml-4">
              <Link
                href="/auth/sign-in"
                className="px-2.5 py-1 md:px-4 md:py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md text-xs md:text-base whitespace-nowrap"
              >
                Log In
              </Link>
              <Link
                href="/auth/sign-up"
                className="px-2.5 py-1 md:px-4 md:py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md text-xs md:text-base whitespace-nowrap"
              >
                <span className="md:hidden">Sign Up</span>
                <span className="hidden md:inline">Sign Up Free</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contact Section */}
      <section className="max-w-2xl mx-auto px-4 py-4 md:py-8">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Get In Touch</h2>
          <p className="text-sm md:text-base text-gray-600 mb-3">
            We&apos;re here to help Nigerian businesses succeed. Reach out with any questions, feedback, or
            support needs.
          </p>
          <div className="mb-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">
              Have a question, feedback, or need help? We&apos;re here to assist you!
            </h3>
            <p className="text-blue-600 font-semibold text-sm md:text-base">support@verysimpleinventory.com</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
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
              <label className="block text-xs md:text-sm font-bold text-gray-900 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border-2 ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium transition-all text-sm`}
                placeholder="Your name"
              />
              {validationErrors.name && (
                <p className="text-red-600 text-xs mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-900 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-1">Please ensure your email is correct so we can respond</p>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border-2 ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium transition-all text-sm`}
                placeholder="your@email.com"
              />
              {validationErrors.email && (
                <p className="text-red-600 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-900 mb-1">
                Your Message <span className="text-red-500">*</span> <span className="text-gray-500 font-normal">(max 2000 characters)</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={2000}
                rows={4}
                className={`w-full px-3 py-2 border-2 ${
                  validationErrors.message ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium transition-all resize-none text-sm`}
                placeholder="Tell us how we can help you..."
              />
              {validationErrors.message && (
                <p className="text-red-600 text-xs mt-1">{validationErrors.message}</p>
              )}
            </div>

            {status === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 font-semibold text-sm">Message sent successfully!</p>
                  <p className="text-green-700 text-xs">
                    We&apos;ll get back to you as soon as possible.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-xs">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
            >
              {status === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-gray-900">Very Simple Inventory</h4>
          </div>
          <p className="text-gray-600 text-sm text-center mb-4">
            Simple rental inventory management for businesses of all sizes.
          </p>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-center gap-6 mb-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold"
              >
                Home
              </Link>
              <Link
                href="/faq"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold"
              >
                Frequently Asked Questions
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold"
              >
                Contact Us
              </Link>
            </div>
            <p className="text-gray-600 text-sm text-center">
              © 2025 Very Simple Inventory. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
