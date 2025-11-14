import Link from 'next/link';
import { Package, Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last Updated: November 14, 2025</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Very Simple Inventory ("we," "our," or "us") is committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use our rental inventory
            management application and services.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This policy complies with the Nigeria Data Protection Regulation (NDPR) 2019 and
            international data protection standards including the General Data Protection Regulation
            (GDPR) where applicable.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Account Information</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Email address (required for account creation and authentication)</li>
            <li>Name (first and last name, optional)</li>
            <li>Business name and logo (optional)</li>
            <li>Password (securely hashed and encrypted)</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Business Data</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Inventory items (names, quantities, prices, notes)</li>
            <li>Customer information (names, contact details, addresses)</li>
            <li>Booking records (rental dates, statuses, payments)</li>
            <li>Business settings (currency, timezone, tax rates)</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Usage Information</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Device information (browser type, operating system)</li>
            <li>IP address and geographic location</li>
            <li>Pages visited and features used</li>
            <li>Date and time of access</li>
          </ul>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <UserCheck className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            We use your information for the following purposes:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>To provide and maintain our inventory management service</li>
            <li>To authenticate your identity and manage your account</li>
            <li>To process and store your business data securely</li>
            <li>To send important service notifications and updates</li>
            <li>To provide customer support and respond to inquiries</li>
            <li>To improve our application and develop new features</li>
            <li>To prevent fraud and ensure platform security</li>
            <li>To comply with legal obligations and enforce our terms</li>
          </ul>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            We implement industry-standard security measures to protect your data:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              <strong>Encryption:</strong> All data transmitted between your device and our servers
              is encrypted using SSL/TLS protocols
            </li>
            <li>
              <strong>Password Security:</strong> User passwords are hashed using bcrypt with a
              computational cost factor of 12
            </li>
            <li>
              <strong>Data Isolation:</strong> Each user's business data is isolated and accessible
              only to that specific user account
            </li>
            <li>
              <strong>Secure Infrastructure:</strong> We use reputable cloud service providers with
              SOC 2 Type II compliance
            </li>
            <li>
              <strong>Regular Security Audits:</strong> We conduct periodic security assessments and
              vulnerability testing
            </li>
            <li>
              <strong>Access Controls:</strong> Strict role-based access controls limit who can view
              or modify data
            </li>
          </ul>
        </div>

        {/* Data Retention */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            We retain your personal information for as long as necessary to provide our services and
            comply with legal obligations:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              <strong>Active Accounts:</strong> Your data is retained while your account is active
            </li>
            <li>
              <strong>Account Deletion:</strong> Upon account deletion, your personal data will be
              permanently deleted within 30 days
            </li>
            <li>
              <strong>Legal Requirements:</strong> Some data may be retained longer to comply with
              legal, regulatory, or accounting requirements
            </li>
            <li>
              <strong>Backup Systems:</strong> Data in backup systems may persist for up to 90 days
              after deletion
            </li>
          </ul>
        </div>

        {/* Your Rights (NDPR) */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights Under NDPR</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            As a data subject under the Nigeria Data Protection Regulation (NDPR), you have the
            following rights:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              <strong>Right to Access:</strong> You can request a copy of the personal data we hold
              about you
            </li>
            <li>
              <strong>Right to Rectification:</strong> You can update or correct inaccurate personal
              data
            </li>
            <li>
              <strong>Right to Erasure:</strong> You can request deletion of your personal data
              (subject to legal retention requirements)
            </li>
            <li>
              <strong>Right to Object:</strong> You can object to certain types of processing of
              your data
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You can request your data in a portable
              format
            </li>
            <li>
              <strong>Right to Lodge a Complaint:</strong> You can file a complaint with the Nigeria
              Data Protection Bureau (NDPB) if you believe your rights have been violated
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-4">
            To exercise any of these rights, please contact us at{' '}
            <a
              href="mailto:privacy@verysimpleinventory.com"
              className="text-blue-600 hover:text-blue-800"
            >
              privacy@verysimpleinventory.com
            </a>
          </p>
        </div>

        {/* Third-Party Services */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            We use the following third-party services to operate our platform:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              <strong>Hosting Provider:</strong> Vercel (for application hosting)
            </li>
            <li>
              <strong>Database Provider:</strong> Neon or Supabase (for data storage)
            </li>
            <li>
              <strong>Authentication:</strong> NextAuth.js (self-hosted authentication)
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-4">
            These providers have their own privacy policies and we carefully vet them for NDPR
            compliance.
          </p>
        </div>

        {/* International Data Transfers */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>

          <p className="text-gray-700 leading-relaxed">
            Your data may be transferred to and processed in countries outside Nigeria. We ensure
            that appropriate safeguards are in place to protect your data in accordance with NDPR
            requirements, including standard contractual clauses and adequacy decisions where
            applicable.
          </p>
        </div>

        {/* Children's Privacy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>

          <p className="text-gray-700 leading-relaxed">
            Our service is not intended for individuals under the age of 18. We do not knowingly
            collect personal information from children. If you are a parent or guardian and believe
            your child has provided us with personal information, please contact us immediately.
          </p>
        </div>

        {/* Changes to This Policy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>

          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any
            significant changes by posting the new policy on this page and updating the "Last
            Updated" date. We encourage you to review this policy periodically for any changes.
          </p>
        </div>

        {/* Contact Us */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our data practices, please
            contact us:
          </p>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Email:</strong>{' '}
              <a
                href="mailto:privacy@verysimpleinventory.com"
                className="text-blue-600 hover:text-blue-800"
              >
                privacy@verysimpleinventory.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong> +234 803 123 4567
            </p>
            <p>
              <strong>Address:</strong> 123 Herbert Macaulay Way, Yaba, Lagos State, Nigeria
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-blue-200">
            <p className="text-sm text-gray-600">
              <strong>Data Protection Officer:</strong> For data protection inquiries, you can reach
              our Data Protection Officer at{' '}
              <a
                href="mailto:dpo@verysimpleinventory.com"
                className="text-blue-600 hover:text-blue-800"
              >
                dpo@verysimpleinventory.com
              </a>
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
                href="/terms"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
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
