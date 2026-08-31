import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, X, Check } from 'lucide-react';

const initialReviews = [
  {
    id: 1,
    comment:
      "We started using NexBloom tissues at home and now even keep them in our office. The softness and absorbency are excellent, and the brand's eco-friendly approach makes it a better choice.",
    name: 'Amit K.',
    city: 'Bengaluru',
  },
  {
    id: 2,
    comment:
      "NexBloom products feel well-made and refined. The toilet rolls are strong yet comfortable, and the kitchen rolls are very absorbent. It's clear that a lot of thought has gone into the quality.",
    name: 'Neha R.',
    city: 'Delhi',
  },
  {
    id: 3,
    comment:
      'What I really like is that NexBloom focuses on both comfort and responsibility. The products feel premium, and the seed initiative makes the purchase feel more meaningful.',
    name: 'Pooja M.',
    city: 'Pune',
  },
  {
    id: 4,
    comment:
      'The 3-ply toilet paper is cloud soft and flushes effortlessly without any clogging issues. The free plant seeds was such an unexpected lovely surprise!',
    name: 'Vikram S.',
    city: 'Mumbai',
  },
  {
    id: 5,
    comment:
      'Super absorbency in their kitchen rolls. Absorbs oil from fried puris in one dab without tearing or sticking. Highly recommended!',
    name: 'Ananya G.',
    city: 'Hyderabad',
  },
];

export const Reviews = () => {
  const [reviewsList, setReviewsList] = useState(initialReviews);
  const [startIndex, setStartIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', city: '', comment: '', rating: 5 });
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % reviewsList.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  // Get current 3 visible reviews in carousel
  const visibleReviews = [
    reviewsList[startIndex % reviewsList.length],
    reviewsList[(startIndex + 1) % reviewsList.length],
    reviewsList[(startIndex + 2) % reviewsList.length],
  ];

  const handleAddReview = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.comment) {
      setReviewsList([
        {
          id: Date.now(),
          name: newReview.name,
          city: newReview.city || 'India',
          comment: newReview.comment,
        },
        ...reviewsList,
      ]);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsModalOpen(false);
        setNewReview({ name: '', city: '', comment: '', rating: 5 });
      }, 1500);
    }
  };

  return (
    <section id="reviews-section" className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= 1. CENTERED SECTION TITLE ================= */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4d3e] tracking-tight">
            Loved by Thousands
          </h2>
          <div className="w-16 h-0.5 bg-[#1b4d3e]/30 mx-auto mt-3" />
        </div>

        {/* ================= 2. CAROUSEL WITH LEFT/RIGHT CHEVRONS & 3 CARDS ================= */}
        <div className="relative flex items-center justify-between gap-2 sm:gap-4 mb-10">
          
          {/* Left Chevron Button */}
          <button
            onClick={handlePrev}
            className="flex-none p-2 rounded-full text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Previous Reviews"
          >
            <ChevronLeft className="w-7 h-7 stroke-[1.5]" />
          </button>

          {/* 3 Cards Grid Matching Reference Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            {visibleReviews.map((rev, index) => (
              <div
                key={rev.id || index}
                className="bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-center min-h-[220px]"
              >
                {/* Review Text */}
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  {rev.comment}
                </p>

                {/* Author & City */}
                <div className="pt-6">
                  <p className="text-xs sm:text-sm text-slate-500">
                    <strong className="font-extrabold text-slate-900">{rev.name}</strong> - {rev.city}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Chevron Button */}
          <button
            onClick={handleNext}
            className="flex-none p-2 rounded-full text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Next Reviews"
          >
            <ChevronRight className="w-7 h-7 stroke-[1.5]" />
          </button>

        </div>

        {/* ================= 3. LEAVE A REVIEW BUTTON ================= */}
        <div className="text-center pt-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 rounded-full bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            LEAVE A REVIEW
          </button>
        </div>

      </div>

      {/* ================= 4. LEAVE A REVIEW MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Share Your Experience</h3>
              <p className="text-xs text-slate-500">
                Help other families choose the best sustainable hygiene products.
              </p>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Thank You!</h4>
                <p className="text-xs text-slate-500">Your review has been successfully posted.</p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-3.5 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul S."
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full bg-slate-50 text-xs text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={newReview.city}
                    onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                    className="w-full bg-slate-50 text-xs text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Review</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Tell us about the tissue quality, softness, or seed planting experience..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-slate-50 text-xs text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
