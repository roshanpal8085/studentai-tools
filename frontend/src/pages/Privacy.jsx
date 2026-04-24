import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Mail, AlertCircle, Eye, Database, Cookie, Globe, Lock, FileText, UserCheck } from 'lucide-react';

const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-10">
    <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">
      <Icon className="w-6 h-6 text-indigo-500 flex-shrink-0" />
      {title}
    </h2>
    <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">{children}</div>
  </div>
);

const Privacy = () => {
  const lastUpdated = 'April 24, 2026';
  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <Helmet>
        <title>Privacy Policy — StudentAI Tools | Data, Cookies &amp; AdSense Disclosure</title>
        <meta name="description" content="Read the full Privacy Policy of StudentAI Tools (studentaitools.in). Understand how we handle your data, our use of Google AdSense cookies, GDPR and India DPDP Act compliance, and your rights." />
        <link rel="canonical" href="https://studentaitools.in/privacy-policy" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 mb-4 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-500 dark:text-slate-400">Effective Date: <strong className="text-slate-700 dark:text-slate-300">{lastUpdated}</strong> · Applies to: studentaitools.in</p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-14">

          {/* Intro */}
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800">
            <strong className="text-indigo-700 dark:text-indigo-300">Summary:</strong> StudentAI Tools does not sell your personal data. We do not require account creation. We use Google AdSense to display relevant advertisements, which uses cookies as described below. This policy explains everything transparently.
          </p>

          <Section icon={Eye} title="1. Information We Collect">
            <p>We collect <strong className="text-slate-800 dark:text-slate-200">minimal data</strong>. Specifically:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Server Log Data:</strong> IP addresses, browser type, operating system, referring URLs, pages visited, and timestamps. This is standard for all web servers and is used purely for security monitoring and aggregate analytics.</li>
              <li><strong>Content You Submit:</strong> Text, documents, or files you upload to use our tools (e.g., PDFs for the PDF tools, essay text for the Essay Writer). This content is <strong>processed transiently in-session only</strong> and is never stored, logged, or retained on our servers after your session ends.</li>
              <li><strong>Cookie Data:</strong> Automatically collected by our server and by third-party services (see Section 3). You can manage cookie preferences in your browser settings.</li>
            </ul>
            <p>We do <strong>not</strong> collect your name, email, or any personally identifiable information unless you voluntarily contact us via our Contact page.</p>
          </Section>

          <Section icon={Database} title="2. How We Use Information">
            <p>The limited data we collect is used exclusively for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Operating, maintaining, and improving the functionality and performance of the website.</li>
              <li>Understanding aggregate traffic patterns and usage trends to prioritize new tools.</li>
              <li>Detecting and preventing abusive behaviour, security breaches, or automated scraping.</li>
              <li>Serving contextually relevant advertisements through Google AdSense (see Section 3).</li>
            </ul>
          </Section>

          <Section icon={Cookie} title="3. Cookies, Advertising &amp; Google AdSense">
            <p>This is the most important section for understanding how your data interacts with advertising on this site.</p>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2">3.1 What Are Cookies?</h3>
            <p>Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently and to provide information to website owners. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

            <h3 className="font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2">3.2 Cookie Categories We Use</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 mt-2">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Can You Opt Out?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr className="bg-white dark:bg-slate-900/50">
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Strictly Necessary</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Required for the site to function. No personal data collected.</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No (required)</td>
                  </tr>
                  <tr className="bg-white dark:bg-slate-900/50">
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Analytics</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Anonymous traffic measurement via aggregated data only.</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes (browser settings)</td>
                  </tr>
                  <tr className="bg-white dark:bg-slate-900/50">
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Advertising (Google AdSense)</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Personalized ad display based on browsing history. See 3.3 below.</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes (see 3.4)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">3.3 Google AdSense &amp; DoubleClick DART Cookie</h3>
            <p>StudentAI Tools uses <strong className="text-slate-800 dark:text-slate-200">Google AdSense</strong> to display advertisements. Google, as a third-party vendor, uses cookies (including the <strong>DART cookie</strong>) to serve ads based on your prior visits to this website and other websites on the internet.</p>
            <p className="mt-3">Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the internet. This is known as "interest-based advertising." Google does not associate personally identifiable information with the DART cookie.</p>
            <p className="mt-3">You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Google Ad Settings</a> or by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">aboutads.info</a>.</p>
            <p className="mt-3">For more information on how Google uses data collected from our site, visit: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">How Google uses data when you use our partners' sites or apps</a>.</p>

            <h3 className="font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">3.4 How to Opt Out of Advertising Cookies</h3>
            <p>You have the following options to control advertising cookies:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Google Ad Settings</a> to opt out of Google personalized ads.</li>
              <li>Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Google Analytics Opt-out Browser Add-on</a>.</li>
              <li>Use your browser's built-in cookie management or a privacy-focused browser extension.</li>
              <li>Enable "Do Not Track" in your browser settings. Note: not all sites honor this signal.</li>
            </ul>
          </Section>

          <Section icon={Globe} title="4. Third-Party Services">
            <p>Our website may integrate with the following third-party services that have their own privacy policies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google AdSense:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Google Privacy Policy</a></li>
              <li><strong>Google Analytics (if applicable):</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Google Privacy Policy</a></li>
              <li><strong>Unsplash (Image CDN):</strong> Used for blog post cover images. No user data is transmitted.</li>
            </ul>
            <p className="mt-3">StudentAI Tools has no control over the practices of these third-party services. We encourage you to review their respective privacy policies.</p>
          </Section>

          <Section icon={Lock} title="5. Data Retention &amp; Security">
            <p><strong>Content you submit to tools</strong> (essays, PDFs, notes) is processed in memory only and is not retained after your browser session ends. There is no database record of your content.</p>
            <p><strong>Server logs</strong> (IP addresses, page views) are retained for a maximum of <strong>90 days</strong> for security and fraud prevention purposes, then automatically deleted.</p>
            <p>We implement industry-standard security measures including HTTPS encryption for all data in transit. However, no internet transmission is 100% secure, and we cannot guarantee the absolute security of data transmitted over the internet.</p>
          </Section>

          <Section icon={UserCheck} title="6. Your Rights — GDPR, CCPA &amp; India DPDP Act">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">For EU/EEA Users (GDPR)</h3>
            <p>Under the General Data Protection Regulation, you have the right to: access your data, rectify inaccurate data, request erasure ("right to be forgotten"), restrict processing, data portability, and to lodge a complaint with your national supervisory authority.</p>

            <h3 className="font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2">For California Users (CCPA)</h3>
            <p>California residents have the right to know what personal information we collect, request deletion of their data, and opt out of the sale of personal information. <strong>We do not sell personal information.</strong></p>

            <h3 className="font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2">For Indian Users (DPDP Act 2023)</h3>
            <p>Under India's Digital Personal Data Protection Act 2023, you have the right to access information about your personal data being processed, the right to correction and erasure, the right to grievance redressal, and the right to nominate a nominee. As we collect minimal personal data (only server logs), exercising most of these rights will not be applicable for most users.</p>
          </Section>

          <Section icon={FileText} title="7. Children's Privacy (COPPA)">
            <p>StudentAI Tools is intended for students, including those under the age of 18. We are committed to protecting children's privacy online.</p>
            <p>We do not knowingly collect personally identifiable information from children under 13. Our tools do not require any account registration or personal data submission. If you are a parent or guardian and believe your child under 13 has submitted personal information to us, please contact us immediately via our Contact page, and we will take steps to remove that information.</p>
            <p>Content submitted to our AI tools (e.g., essay text, notes) is never stored — it is processed ephemerally and discarded. This design is intentional and protective of all users, including minors.</p>
          </Section>

          <Section icon={Mail} title="8. Contact Us">
            <p>If you have any questions about this Privacy Policy, wish to exercise your data rights, or have a privacy-related concern, please reach out to us:</p>
            <div className="mt-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-slate-800 dark:text-slate-200">StudentAI Tools</p>
              <p className="text-slate-600 dark:text-slate-400">Website: <a href="https://studentaitools.in" className="text-indigo-600 dark:text-indigo-400 underline">studentaitools.in</a></p>
              <p className="text-slate-600 dark:text-slate-400">Contact: <a href="/contact" className="text-indigo-600 dark:text-indigo-400 underline">Via our Contact Page</a></p>
              <p className="text-slate-600 dark:text-slate-400">Jurisdiction: India</p>
            </div>
            <p className="mt-4">We reserve the right to update this Privacy Policy at any time. Changes will be reflected by updating the "Effective Date" at the top of this page. We encourage you to review this policy periodically. Continued use of the site constitutes acceptance of the updated policy.</p>
          </Section>

        </div>
      </div>
    </div>
  );
};

export default Privacy;
