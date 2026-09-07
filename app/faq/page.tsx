import React from "react";
import { Metadata } from "next";
import { generatePageMetadata, BASE_URL } from "@/lib/seo.config";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { JsonLdScript } from "@/_components/SEO/JsonLd";
import Link from "next/link";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Frequently Asked Questions - TERI Tender Portal",
    "Find answers to common questions about TERI tenders, vendor registration, bid submission, and e-procurement process. Learn how to participate in TERI tender opportunities.",
    "/faq",
    [
      "TERI tender FAQ",
      "TERI tender questions",
      "how to apply TERI tender",
      "TERI vendor registration help",
      "TERI bid submission guide",
      "TERI procurement FAQ",
      "tender portal help",
      "e-tender questions India",
    ]
  ),
  openGraph: {
    title: "TERI Tender FAQ - Frequently Asked Questions",
    description:
      "Get answers to common questions about TERI tenders, registration, and bidding process.",
    url: `${BASE_URL}/faq`,
    type: "website",
  },
};

const faqs = [
  {
    question: "What is TERI Tenders?",
    answer:
      "TERI Tenders (etender.teri.res.in) is the official electronic tender management portal of The Energy and Resources Institute (TERI). It enables vendors to discover, bid, and manage tender opportunities from TERI for projects related to sustainable development, energy research, environmental consulting, and more.",
  },
  {
    question: "How do I register as a vendor on TERI Tenders?",
    answer:
      "To register as a vendor on TERI Tenders: 1) Click the 'Register' button on the homepage, 2) Fill in your company details including business name, classification, and contact information, 3) Upload required documents such as GST registration, PAN card, and company registration, 4) Submit for verification. Once verified, you can start bidding on available tenders.",
  },
  {
    question: "Is registration on TERI Tender portal free?",
    answer:
      "Yes, vendor registration on TERI Tenders portal is completely free. You can browse available tenders without registration. However, to submit bids and access tender documents, you need to create an account. Some specific tenders may have a tender document fee, which will be mentioned in the tender details.",
  },
  {
    question: "What types of tenders are available on TERI Tenders?",
    answer:
      "TERI Tenders hosts various procurement opportunities including: Research and consulting projects, IT services and software development, Construction and infrastructure, Equipment and material supply, Environmental and sustainability projects, Energy research initiatives, Training and capacity building, Publications and documentation, and more across multiple departments of TERI.",
  },
  {
    question: "How do I submit a bid on TERI Tender?",
    answer:
      "To submit a bid: 1) Log in to your vendor account, 2) Browse and select the tender you want to bid on, 3) Review all tender requirements and documents, 4) Purchase the tender if required, 5) Prepare your proposal documents as per specifications, 6) Upload all required documents before the deadline, 7) Submit your bid electronically. You'll receive confirmation upon successful submission.",
  },
  {
    question: "What documents are required for TERI tender registration?",
    answer:
      "Typically required documents include: Company registration certificate, GST registration certificate, PAN card, Latest audited financial statements, Bank account details, Relevant experience certificates, Technical capability documents. Specific tenders may require additional documents as mentioned in the tender notice.",
  },
  {
    question: "How do I get notifications for new TERI tenders?",
    answer:
      "After registering on TERI Tenders portal, you can opt-in for email notifications for new tender announcements. You can also set preferences for specific categories or departments. We recommend checking the portal regularly and following TERI's official social media channels for tender updates.",
  },
  {
    question: "What is the tender evaluation process at TERI?",
    answer:
      "TERI follows a transparent tender evaluation process: 1) Technical evaluation based on specified criteria, 2) Financial evaluation for technically qualified bidders, 3) Combined scoring based on weightage mentioned in tender documents, 4) Final selection and award notification. All evaluations are conducted by authorized TERI committees.",
  },
  {
    question: "Can international vendors participate in TERI tenders?",
    answer:
      "Yes, international vendors can participate in TERI tenders, subject to eligibility criteria mentioned in specific tender documents. International bidders may need to comply with additional requirements such as local representation, compliance with Indian laws, and currency specifications for bidding.",
  },
  {
    question: "How do I contact TERI for tender-related queries?",
    answer:
      "For tender-related queries, you can: Email the procurement team at the address mentioned in the tender document, Call TERI's main office at +91-11-24682100, Visit TERI's office at Darbari Seth Block, IHC Complex, Lodhi Road, New Delhi - 110003. For technical issues with the portal, use the support section on the website.",
  },
  {
    question: "What is TERI (The Energy and Resources Institute)?",
    answer:
      "TERI - The Energy and Resources Institute - is a leading independent, not-for-profit research organization focused on energy, environment, and sustainable development. Established in 1974 and headquartered in New Delhi, TERI conducts research, provides policy advice, and implements projects across India and globally. Visit www.teriin.org for more information.",
  },
  {
    question: "How secure is the TERI eTender portal?",
    answer:
      "TERI Tenders portal employs industry-standard security measures including: HTTPS encryption for all data transmission, Secure authentication system, Encrypted storage of sensitive documents, Regular security audits, Access controls and audit trails. All bid information is kept confidential until the designated opening date.",
  },
];

const FAQPage = () => {
  // Enhanced FAQ schema with all questions
  const enhancedFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "FAQ", url: `${BASE_URL}/faq` },
  ]);

  return (
    <div className='pt-16 min-h-screen bg-gray-50'>
      {/* Structured Data */}
      <JsonLdScript data={[enhancedFaqSchema, breadcrumbSchema]} />

      <div className='max-w-4xl mx-auto px-4 py-12'>
        {/* Breadcrumb */}
        <nav
          className='text-sm mb-6'
          aria-label='Breadcrumb'>
          <ol className='flex items-center space-x-2'>
            <li>
              <Link
                href='/'
                className='text-primary hover:underline'>
                Home
              </Link>
            </li>
            <li className='text-gray-400'>/</li>
            <li className='text-gray-600'>FAQ</li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className='mb-10'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            TERI Tender - Frequently Asked Questions
          </h1>
          <p className='text-lg text-gray-600'>
            Find answers to common questions about TERI tenders, vendor
            registration, bid submission, and the e-procurement process.
          </p>
        </header>

        {/* FAQ List */}
        <section
          aria-label='Frequently Asked Questions'
          className='space-y-6'>
          {faqs.map((faq, index) => (
            <details
              key={index}
              className='bg-white rounded-lg border border-gray-200 group'>
              <summary className='px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-primary list-none flex justify-between items-center'>
                <span>{faq.question}</span>
                <span className='text-gray-400 group-open:rotate-180 transition-transform'>
                  ▼
                </span>
              </summary>
              <div className='px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4'>
                {faq.answer}
              </div>
            </details>
          ))}
        </section>

        {/* Additional Help Section */}
        <section className='mt-12 bg-primary rounded-lg p-6 border border-primary'>
          <h2 className='text-xl font-semibold text-gray-800 mb-3'>
            Still have questions about TERI Tenders?
          </h2>
          <p className='text-gray-600 mb-4'>
            Can&apos;t find what you&apos;re looking for? Our support team is here to help
            you with any queries about the TERI tender process.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Link
              href='/about'
              className='inline-flex items-center px-4 py-2 bg-white border border-primary text-primary rounded-md hover:bg-primary transition-colors'>
              Learn About TERI Tenders
            </Link>
            <Link
              href='/register'
              className='inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary transition-colors'>
              Register as Vendor
            </Link>
          </div>
        </section>

        {/* Keywords for SEO (hidden but crawlable) */}
        <footer className='mt-12 text-xs text-gray-400'>
          <p>
            Keywords: TERI tender, TERI tenders, The Energy and Resources
            Institute tender, TERI eTender portal, TERI procurement, TERI bid
            submission, TERI vendor registration, government tender India,
            e-procurement India, sustainable tender, environment tender, energy
            research tender, TERI Delhi tender, TERI India tender
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FAQPage;
