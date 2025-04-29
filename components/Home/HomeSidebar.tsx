import React from "react";
import { Input } from "../ui/input";
import {
  Calendar,
  ChevronRight,
  Search,
  TrendingUp,
  Clock,
  Filter,
  Bell,
  CheckCircle,
  ArrowUpRight,
  HelpCircle,
  FileText,
  Book,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { borderStyle, inputStyle } from "@/app/Styles";
import { cn } from "@/lib/utils";

const HomeSidebar = () => {
  const popularCategories = [
    { name: "Construction", count: 24 },
    { name: "IT Services", count: 18 },
    { name: "Energy", count: 15 },
    { name: "Healthcare", count: 12 },
    { name: "Education", count: 9 },
  ];

  // Upcoming events
  const upcomingEvents = [
    {
      title: "Vendor Registration Workshop",
      date: "June 15, 2023",
      type: "Workshop",
    },
    {
      title: "Tender Process Webinar",
      date: "June 22, 2023",
      type: "Webinar",
    },
  ];

  // FAQ questions
  const faqs = [
    { question: "How do I register as a vendor?", id: "registration" },
    { question: "What documents are required for bidding?", id: "documents" },
    { question: "How to track my tender application?", id: "tracking" },
  ];

  return (
    <div className='w-full md:w-80 space-y-6 order-first md:order-last'>
      <div className={cn("rounded-2xl border overflow-hidden", borderStyle)}>
        <div className=' px-5 py-5 text-gray-800'>
          <h3 className='font-semibold text-base mb-1'>Find Tenders</h3>
          <p className='text-gray-600 text-xs'>
            Search or browse available opportunities
          </p>
        </div>

        <div className='p-4'>
          <div className='relative w-full mb-4'>
            <Input
              type='text'
              placeholder='Search tenders...'
              className={inputStyle}
              style={{
                paddingLeft: "2rem",
              }}
            />
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
          </div>

          <div className='flex flex-col'>
            <div className='flex items-center justify-between pb-2 border-b border-gray-100 mb-3'>
              <div className='flex items-center text-sm text-gray-700 font-medium'>
                <Filter className='h-3.5 w-3.5 mr-2 text-gray-600' />
                Popular Categories
              </div>
              <Link
                href='/categories'
                className='text-xs text-accent flex items-center hover:underline'>
                View all
                <ArrowUpRight className='h-3 w-3 ml-0.5' />
              </Link>
            </div>

            <div className='grid grid-cols-2 gap-2 mb-1'>
              {popularCategories.slice(0, 4).map((category, idx) => (
                <Link
                  key={idx}
                  href={`/categories/${category.name.toLowerCase()}`}
                  className='flex items-center justify-between bg-gray-50 hover:bg-blue-50 p-2 rounded-lg group transition-colors border border-gray-100 hover:border-blue-100'>
                  <span className='text-xs text-gray-700 group-hover:text-primary font-medium'>
                    {category.name}
                  </span>
                  <Badge className='bg-white text-accent text-[10px] px-1.5 font-medium border border-blue-100 shadow-sm'>
                    {category.count}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className={cn("rounded-2xl border overflow-hidden", borderStyle)}>
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
          <div className='flex items-center'>
            <div className='bg-primary/5 p-1.5 rounded-md mr-2.5'>
              <Calendar className='h-4 w-4 text-gray-600' />
            </div>
            <h3 className='font-semibold text-gray-800 text-sm'>
              Upcoming Events
            </h3>
          </div>
          <Link
            href='/events'
            className='text-xs text-accent hover:underline flex items-center'>
            View all
            <ChevronRight className='h-3 w-3 ml-0.5' />
          </Link>
        </div>

        <div className='px-5 py-4 space-y-4'>
          {upcomingEvents.map((event, idx) => (
            <div
              key={idx}
              className='flex  pl-3 hover:bg-blue-50/30 p-2 -ml-2 rounded-r-lg transition-colors cursor-pointer'>
              <div className='w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 mr-3'>
                <Calendar className='h-5 w-5 text-accent' />
              </div>
              <div>
                <h4 className='text-sm font-medium text-gray-800'>
                  {event.title}
                </h4>
                <div className='flex items-center justify-between mt-1'>
                  <span className='text-xs text-gray-500'>{event.date}</span>
                  {/* <Badge className='bg-blue-50 text-blue-700 text-xs ml-2 border border-blue-200/70'>
                    {event.type}
                  </Badge> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Resources */}
      <div className={cn("rounded-2xl border overflow-hidden", borderStyle)}>
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
          <div className='flex items-center'>
            <div className='bg-primary/5 p-1.5 rounded-md mr-2.5'>
              <Book className='h-4 w-4 text-gray-600' />
            </div>
            <h3 className='font-semibold text-gray-800 text-sm'>
              Quick Resources
            </h3>
          </div>
        </div>

        <div className='p-4 grid grid-cols-2 gap-3'>
          <Link
            href='/guides/tender-process'
            className='flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors border border-blue-100/60 group'>
            <FileText className='h-6 w-6 text-gray-600 mb-1.5' />
            <span className='text-xs font-medium text-gray-700 text-center'>
              Tender Guide
            </span>
          </Link>

          <Link
            href='/guides/documents'
            className='flex flex-col items-center p-3 bg-blue-50/60 rounded-lg hover:bg-blue-50 transition-colors border border-blue-100/60 group'>
            <FileText className='h-6 w-6 text-gray-600 mb-1.5' />
            <span className='text-xs font-medium text-gray-700 text-center'>
              Documents
            </span>
          </Link>

          <Link
            href='/guides/videos'
            className='flex flex-col items-center p-3 bg-blue-50/60 rounded-lg hover:bg-blue-50 transition-colors border border-blue-100/60 group'>
            <FileText className='h-6 w-6 text-gray-600 mb-1.5' />
            <span className='text-xs font-medium text-gray-700 text-center'>
              Video Guides
            </span>
          </Link>

          <Link
            href='/guides/tips'
            className='flex flex-col items-center p-3 bg-blue-50/60 rounded-lg hover:bg-blue-50 transition-colors border border-blue-100/60 group'>
            <FileText className='h-6 w-6 text-gray-600 mb-1.5' />
            <span className='text-xs font-medium text-gray-700 text-center'>
              Tips & Tricks
            </span>
          </Link>
        </div>
      </div>
      {/* Trending Tenders */}
      <div className={cn("rounded-2xl border overflow-hidden", borderStyle)}>
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
          <div className='flex items-center'>
            <div className='bg-primary/5 p-1.5 rounded-md mr-2.5'>
              <TrendingUp className='h-4 w-4 text-gray-600' />
            </div>
            <h3 className='font-semibold text-gray-800 text-sm'>
              Trending Tenders
            </h3>
          </div>
          <Badge className='bg-blue-50 text-blue-700 text-xs px-2 py-0.5'>
            New
          </Badge>
        </div>

        <div className='divide-y divide-gray-100'>
          {[
            {
              title: "Green Energy Solutions for Municipal Buildings",
              days: 5,
              category: "Energy",
              color: "blue",
            },
            {
              title: "Medical Equipment Supply for City Hospitals",
              days: 8,
              category: "Healthcare",
              color: "blue",
            },
            {
              title: "IT Infrastructure Services for Government Offices",
              days: 12,
              category: "IT Services",
              color: "blue",
            },
          ].map((tender, idx) => (
            <div
              key={idx}
              className='px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors group'>
              <h4 className='text-sm font-medium text-gray-800 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2'>
                {tender.title}
              </h4>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-gray-500 flex items-center'>
                  <Clock className='h-3 w-3 mr-1.5 text-gray-400' />
                  Closes in {tender.days} days
                </span>
                <Badge
                  className={`bg-${tender.color.toLowerCase()}-50 text-${tender.color.toLowerCase()}-700 text-xs border border-${tender.color.toLowerCase()}-100`}>
                  {tender.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className='px-5 py-3 bg-gray-50 border-t border-gray-100'>
          <Link
            href='/trending'
            className='flex items-center justify-center text-sm text-accent hover:text-blue-700 font-medium'>
            View all tenders
            <ChevronRight className='h-4 w-4 ml-1' />
          </Link>
        </div>
      </div>

      {/* FAQ Card */}
      <div className={cn("rounded-2xl border overflow-hidden", borderStyle)}>
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
          <div className='flex items-center'>
            <div className='bg-primary/5 p-1.5 rounded-md mr-2.5'>
              <HelpCircle className='h-4 w-4 text-accent' />
            </div>
            <h3 className='font-semibold text-gray-800 text-sm'>
              Frequently Asked Questions
            </h3>
          </div>
        </div>

        <div className='divide-y divide-gray-100'>
          {faqs.map((faq, idx) => (
            <Link
              key={idx}
              href={`/faq#${faq.id}`}
              className='flex items-center px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors group'>
              <div className='w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mr-3 text-xs font-semibold text-blue-700'>
                {idx + 1}
              </div>
              <p className='text-sm text-gray-700 group-hover:text-blue-700 transition-colors'>
                {faq.question}
              </p>
              <ChevronRight className='h-3.5 w-3.5 ml-auto text-gray-400' />
            </Link>
          ))}
        </div>

        <div className='px-5 py-3 bg-gray-50 border-t border-gray-100'>
          <Link
            href='/faq'
            className='flex items-center justify-center text-sm text-accent hover:text-blue-700 font-medium'>
            View all FAQs
            <ChevronRight className='h-4 w-4 ml-1' />
          </Link>
        </div>
      </div>

      {/* Support/Help Card */}
      <div className={cn("rounded-2xl border overflow-hidden", borderStyle)}>
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
          <div className='flex items-center'>
            <div className='bg-primary/5 p-1.5 rounded-md mr-2.5'>
              <MessageSquare className='h-4 w-4 text-accent' />
            </div>
            <h3 className='font-semibold text-gray-800 text-sm'>Need Help?</h3>
          </div>
        </div>

        <div className='p-4 space-y-3'>
          <p className='text-sm text-gray-600'>
            Our support team is available to assist you with any questions.
          </p>

          <div className='flex items-center py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100'>
            <Phone className='h-4 w-4 text-blue-500 mr-3' />
            <div>
              <div className='text-xs text-gray-500'>Call Support</div>
              <div className='text-sm font-medium text-gray-700'>
                +1 (800) 555-1234
              </div>
            </div>
          </div>

          <div className='flex items-center py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100'>
            <Mail className='h-4 w-4 text-blue-500 mr-3' />
            <div>
              <div className='text-xs text-gray-500'>Email Support</div>
              <div className='text-sm font-medium text-gray-700'>
                support@tendersystem.com
              </div>
            </div>
          </div>

          <Button className='w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium'>
            Live Chat Support
          </Button>
        </div>
      </div>

      {/* Newsletter Box */}
      <div
        className={cn(
          "bg-gradient-to-br from-accent to-accent/90 rounded-2xl overflow-hidden p-5 text-white"
        )}>
        <div className='flex items-start mb-3'>
          <div className='w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mr-3 flex-shrink-0'>
            <Bell className='h-5 w-5 text-white' />
          </div>
          <div>
            <h3 className='font-semibold text-white text-base'>Stay Updated</h3>
            <p className='text-blue-100 text-xs mt-0.5'>
              Get notifications about new tenders in your industry
            </p>
          </div>
        </div>

        <div className='relative mb-2 mt-4'>
          <Input
            type='email'
            placeholder='Your email address'
            className='w-full rounded-lg border-0 px-4 py-3 text-sm bg-white/10 text-white placeholder:text-blue-100 focus:ring-2 focus:ring-white/30 focus:bg-white/20'
          />
        </div>

        <Button className='w-full bg-white hover:bg-blue-50 text-blue-700 font-medium rounded-lg py-2 mt-2 transition-colors border-0'>
          Subscribe
        </Button>

        <div className='mt-3 text-xs text-blue-100 flex items-center'>
          <CheckCircle className='h-3 w-3 mr-1.5' />
          We respect your privacy. Unsubscribe anytime.
        </div>
      </div>
    </div>
  );
};

export default HomeSidebar;
