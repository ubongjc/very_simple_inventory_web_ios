import Link from 'next/link';
import { Package, Scale, FileText, AlertTriangle, Shield, UserX, RefreshCw } from 'lucide-react';

export default function TermsOfServicePage() {
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-full mb-4">
            <Scale className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last Updated: November 14, 2025</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms of Service ("Terms") constitute a legally binding agreement between you
            ("User," "you," or "your") and Very Simple Inventory ("Company," "we," "us," or "our")
            concerning your access to and use of our rental inventory management application and
            services.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            By accessing or using our service, you agree to be bound by these Terms. If you do not
            agree with any part of these terms, you must not use our service.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> These Terms are governed by the laws of the Federal
                Republic of Nigeria. By using this service, you consent to the jurisdiction of
                Nigerian courts for any disputes arising from these Terms.
              </p>
            </div>
          </div>
        </div>

        {/* Account Registration */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Account Registration and Security</h2>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Account Creation</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>You must be at least 18 years old to create an account</li>
            <li>You must provide accurate and complete registration information</li>
            <li>
              You are responsible for maintaining the confidentiality of your account credentials
            </li>
            <li>You must notify us immediately of any unauthorized access to your account</li>
            <li>
              One person or business entity may maintain only one account unless authorized by us
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Account Security</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>You are solely responsible for all activities conducted through your account</li>
            <li>You must use a strong, unique password and change it periodically</li>
            <li>You must not share your account credentials with any third party</li>
            <li>
              We are not liable for any loss or damage arising from your failure to comply with
              security requirements
            </li>
          </ul>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">User Responsibilities and Conduct</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            When using our service, you agree to:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Use the service only for lawful purposes and in accordance with these Terms</li>
            <li>
              Ensure all data you input (inventory, customers, bookings) is accurate and lawful
            </li>
            <li>
              Not use the service to store, transmit, or distribute illegal, harmful, or offensive
              content
            </li>
            <li>Not attempt to gain unauthorized access to our systems or other user accounts</li>
            <li>
              Not use automated systems or software to extract data from the service ("scraping")
            </li>
            <li>Not interfere with or disrupt the service or servers</li>
            <li>Not impersonate any person or entity or misrepresent your affiliation</li>
            <li>
              Comply with all applicable Nigerian laws and regulations in your use of the service
            </li>
          </ul>
        </div>

        {/* Service Description */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Service Description and Modifications
          </h2>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Service Provided</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Very Simple Inventory provides a cloud-based rental inventory management application
            that enables you to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>Track rental inventory items and stock levels</li>
            <li>Manage customer information</li>
            <li>Create and manage rental bookings</li>
            <li>Process and track payments</li>
            <li>Generate reports and analytics</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Service Modifications</h3>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify, suspend, or discontinue any aspect of the service at any
            time, with or without notice. We shall not be liable to you or any third party for any
            modification, suspension, or discontinuation of the service.
          </p>
        </div>

        {/* Subscription and Payment */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Plans and Payment</h2>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Free and Paid Plans</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We offer both free and paid subscription plans:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>
              <strong>Free Plan:</strong> Limited features with no payment required
            </li>
            <li>
              <strong>Pro Plan:</strong> ₦10,900/month (approximately $29 USD) with enhanced
              features
            </li>
            <li>
              <strong>Business Plan:</strong> ₦29,800/month (approximately $79 USD) with full
              features
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Payment Terms</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Subscription fees are billed monthly in advance</li>
            <li>All payments are processed in Nigerian Naira (₦) or USD</li>
            <li>You authorize us to charge your payment method on a recurring basis</li>
            <li>Prices are subject to change with 30 days' notice</li>
            <li>All fees are non-refundable except as required by Nigerian law</li>
            <li>You are responsible for all taxes associated with your subscription</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Cancellation</h3>
          <p className="text-gray-700 leading-relaxed">
            You may cancel your paid subscription at any time. Upon cancellation, you will retain
            access to paid features until the end of your current billing period. No refunds will be
            provided for partial months.
          </p>
        </div>

        {/* Data and Intellectual Property */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Data Ownership and Intellectual Property
          </h2>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Your Data</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You retain all ownership rights to the data you input into the service (inventory
            records, customer information, booking data). We claim no ownership over your data.
            However, by using our service, you grant us a limited license to host, store, and
            process your data solely for the purpose of providing the service to you.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
            2. Our Intellectual Property
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            The service, including its software, design, text, graphics, and other content, is owned
            by Very Simple Inventory and protected by Nigerian and international copyright,
            trademark, and other intellectual property laws.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              You may not copy, modify, distribute, or reverse engineer any part of the service
            </li>
            <li>You may not use our trademarks or branding without written permission</li>
            <li>You may not create derivative works based on our service</li>
          </ul>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <UserX className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Account Termination</h2>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Termination by You</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You may terminate your account at any time through your account settings or by
            contacting us. Upon termination, your access to the service will cease, and your data
            will be deleted in accordance with our Privacy Policy.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Termination by Us</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We reserve the right to suspend or terminate your account if:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>You violate these Terms of Service</li>
            <li>You engage in fraudulent or illegal activities</li>
            <li>Your account remains inactive for an extended period</li>
            <li>Your payment method fails or you have unpaid fees</li>
            <li>We are required to do so by law or court order</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            We will attempt to notify you prior to termination where reasonably possible.
          </p>
        </div>

        {/* Limitations of Liability */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Disclaimers and Limitations of Liability
          </h2>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Service Disclaimer</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
            EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Data Accuracy</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            While we strive to maintain data integrity, we do not guarantee the accuracy,
            completeness, or reliability of any data stored in the service. You are solely
            responsible for verifying the accuracy of your data and maintaining backup copies.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Limitation of Liability</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY NIGERIAN LAW, WE SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Any indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Service interruptions, delays, or data loss</li>
            <li>Unauthorized access to or alteration of your data</li>
            <li>Actions or inactions of third parties</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Our total liability shall not exceed the amount paid by you for the service in the 12
            months preceding the claim.
          </p>
        </div>

        {/* Indemnification */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>

          <p className="text-gray-700 leading-relaxed">
            You agree to indemnify, defend, and hold harmless Very Simple Inventory, its officers,
            directors, employees, and agents from any claims, liabilities, damages, losses, and
            expenses (including legal fees) arising from:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
            <li>Your use or misuse of the service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any rights of another person or entity</li>
            <li>Any data you submit, post, or transmit through the service</li>
          </ul>
        </div>

        {/* Dispute Resolution */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Dispute Resolution and Governing Law
            </h2>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Governing Law</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the
            Federal Republic of Nigeria, without regard to its conflict of law provisions.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Jurisdiction</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You agree to submit to the exclusive jurisdiction of the courts located in Lagos State,
            Nigeria, for the resolution of any disputes arising from these Terms or your use of the
            service.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
            3. Dispute Resolution Process
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Before initiating any legal proceedings, you agree to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Contact us at legal@verysimpleinventory.com to attempt informal resolution</li>
            <li>Provide a detailed description of the dispute and your proposed resolution</li>
            <li>Engage in good faith negotiations for a period of at least 30 days</li>
          </ul>
        </div>

        {/* Miscellaneous */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Miscellaneous Provisions</h2>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Entire Agreement</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms, together with our Privacy Policy, constitute the entire agreement between
            you and Very Simple Inventory regarding the service.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Severability</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            If any provision of these Terms is found to be unenforceable, the remaining provisions
            will remain in full force and effect.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. No Waiver</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our failure to enforce any right or provision of these Terms will not be considered a
            waiver of those rights.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Changes to Terms</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We reserve the right to modify these Terms at any time. We will notify you of material
            changes by email or through the service. Your continued use of the service after such
            modifications constitutes your acceptance of the updated Terms.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About These Terms?</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions or concerns about these Terms of Service, please contact us:
          </p>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Email:</strong>{' '}
              <a
                href="mailto:legal@verysimpleinventory.com"
                className="text-blue-600 hover:text-blue-800"
              >
                legal@verysimpleinventory.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong> +234 803 123 4567
            </p>
            <p>
              <strong>Address:</strong> 123 Herbert Macaulay Way, Yaba, Lagos State, Nigeria
            </p>
          </div>
        </div>
      </div>

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
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
