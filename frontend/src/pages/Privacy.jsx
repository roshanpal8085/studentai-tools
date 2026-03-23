import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Mail, AlertCircle, Eye, Database } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <Helmet><title>Privacy Policy - StudentAI Tools</title></Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 mb-4 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Your privacy is critically important to us. Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-14 prose prose-slate dark:prose-invert max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4">
          <p className="lead text-lg">
            At StudentAI Tools (accessible from studentaitools.com), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by StudentAI Tools and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>

          <h2 className="flex items-center gap-3"><Eye className="w-6 h-6 text-indigo-500" /> Log Files</h2>
          <p>
            StudentAI Tools follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>

          <h2 className="flex items-center gap-3"><Database className="w-6 h-6 text-indigo-500" /> Cookies and Web Beacons</h2>
          <p>
            Like any other website, StudentAI Tools uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2 className="flex items-center gap-3"><AlertCircle className="w-6 h-6 text-indigo-500" /> Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
          </p>

          <h2>Our Advertising Partners</h2>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense. Each of our advertising partners has their own Privacy Policy for their policies on user data.
          </p>
          <p>
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on StudentAI Tools, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p>
            Note that StudentAI Tools has no access to or control over these cookies that are used by third-party advertisers.
          </p>

          <h2>Third Party Privacy Policies</h2>
          <p>
            StudentAI Tools's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>
          <p>
            You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
          </p>

          <h2>CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
          <p>Under the CCPA, among other rights, California consumers have the right to:</p>
          <ul>
            <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
            <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
            <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
          </ul>

          <h2>GDPR Data Protection Rights</h2>
          <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
          <ul>
            <li>The right to access – You have the right to request copies of your personal data.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
          </ul>

          <h2 className="flex items-center gap-3"><Mail className="w-6 h-6 text-indigo-500" /> Contacting Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via our Contact Page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
