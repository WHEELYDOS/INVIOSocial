"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-white/10 last:border-none">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
      >
        <div className="flex items-center gap-6">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-white/60 group-hover:text-white transition-colors"
          >
            <Plus className="w-6 h-6" strokeWidth={1.5} />
          </motion.div>
          <span className="text-xl md:text-2xl font-medium tracking-tight text-white/90 group-hover:text-white transition-colors">
            {question}
          </span>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-12 md:pl-12 text-lg text-white/60 leading-relaxed max-w-4xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How much does web design and development typically cost?",
      answer: "Project costs vary depending on the scope, complexity, and specific requirements of your business. We offer custom quotes after our initial consultation to ensure you only pay for what you need.",
    },
    {
      question: "How long does a project usually take?",
      answer: "A standard website redesign usually takes between 4 to 8 weeks from initial discovery to launch, depending on the number of pages, custom features, and feedback cycles.",
    },
    {
      question: "Can your creative agency accommodate tight deadlines?",
      answer: "Yes, depending on our current capacity, we can expedite projects for an additional rush fee. Let us know your timeline during the discovery call so we can align our resources.",
    },
    {
      question: "What ongoing support and maintenance do you offer post-launch?",
      answer: "We offer custom care plans that include routine maintenance, security updates, minor content edits, and ongoing SEO monitoring to ensure your site remains fast, secure, and competitive.",
    },
    {
      question: "How do you handle revisions and feedback during the design process?",
      answer: "We build revisions directly into our structured process. You'll have dedicated review periods at the wireframe and development stages to ensure the final product perfectly aligns with your vision.",
    },
    {
      question: "Are there additional costs for digital marketing services integrated into web projects?",
      answer: "We believe in 100% transparent pricing. If you request integrated digital marketing services—like advanced local SEO, ad campaign management, or ongoing content creation—those will be clearly outlined as separate line items in your proposal.",
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-primary text-white relative z-10 w-full overflow-hidden">
      <div className="container-max px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative z-10">

        {/* Title side */}
        <div className="lg:col-span-4 flex flex-col justify-start">
          <div className="sticky top-32">
            <h2 className="text-6xl md:text-8xl font-medium tracking-tighter mb-6">
              FAQ's
            </h2>
            <p className="text-xl text-white/50 font-medium">
              Everything you need to know about working with us.
            </p>
          </div>
        </div>

        {/* Accordion side */}
        <div className="lg:col-span-8 flex flex-col pt-4 lg:pt-0">
          <div className="w-full border-t border-white/10">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
