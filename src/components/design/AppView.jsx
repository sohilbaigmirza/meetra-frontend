import React from 'react';
import RouteMap from '../RouteMap';
import { MeetraLogo, ScallopedBadge } from './BrandIcons';
import {
  Home as HomeIcon,
  Compass,
  MessageSquare,
  User as UserIcon,
  Sparkles,
  Users,
  ArrowRight,
  ArrowLeft,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Navigation,
  Check,
  Edit3,
  X,
  Send,
  LogOut,
  Bookmark,
  Filter,
  Tag,
  Ticket,
  Calendar,
  Search,
  MapPin,
  Edit2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AppView() {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    authLoading,
    activeFeedTag,
    setActiveFeedTag,
    activeFeedBudget,
    setActiveFeedBudget,
    bookmarkedOutingIds,
    savedWishlistOutings,
    partnerCafes,
    userBookings,
    selectedCafeForBooking,
    setSelectedCafeForBooking,
    bookingPartySize,
    setBookingPartySize,
    bookingTime,
    setBookingTime,
    bookingDate,
    setBookingDate,
    bookingLoading,
    confirmedBookingPass,
    setConfirmedBookingPass,
    isEditingProfile,
    setIsEditingProfile,
    profileForm,
    setProfileForm,
    COLLEGES,
    COURSES,
    BTECH_BRANCHES,
    YEARS,
    inspectingPeer,
    setInspectingPeer,
    friendsList,
    hours,
    setHours,
    budget,
    setBudget,
    selectedInterests,
    mode,
    setMode,
    location,
    setLocation,
    startCoords,
    setStartCoords,
    locating,
    CAMPUS_HUBS,
    loading,
    saving,
    plan,
    invitedPeers,
    collabRequests,
    activeChatCollab,
    setActiveChatCollab,
    messages,
    newMessageText,
    setNewMessageText,
    chatBottomRef,
    showReviewModal,
    setShowReviewModal,
    ratingScore,
    setRatingScore,
    selectedReviewTags,
    setSelectedReviewTags,
    reviewFeedback,
    setReviewFeedback,
    handleFileUpload,
    handleLogout,
    handleSendFriendRequest,
    handleRespondFriend,
    handleToggleBookmark,
    toggleInterest,
    handleSaveProfile,
    handleDetectGPS,
    handleGeneratePlan,
    handleConfirmAndSave,
    handleSendInvite,
    handleRespondCollab,
    handleSendMessage,
    handleSubmitReview,
    handleCreateBooking,
    handleGoogleSignIn,
  } = useApp();

  // ---------------- DESIGNER-THEMED LOGIN SCREEN ---------------- //
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#F6F9FD] text-[#0F172A] flex flex-col justify-between px-6 py-12 max-w-md mx-auto relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E2EDFB] rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-10 left-0 w-64 h-64 bg-[#FDEEE9] rounded-full blur-3xl pointer-events-none -ml-16" />

        <div className="relative z-10 flex flex-col items-center text-center mt-6 space-y-3">
          <div className="w-24 h-24 bg-white rounded-3xl p-3 shadow-[0_12px_32px_rgba(34,66,125,0.08)] flex items-center justify-center">
            <MeetraLogo className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-black text-[#22427D] tracking-tight">MeetRa</h1>
          <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
            Find travelers whose plans already overlap with yours.
          </p>
        </div>

        <div className="relative z-10 bg-white rounded-[32px] p-6 shadow-[0_16px_40px_rgba(34,66,125,0.06)] border border-slate-100/80 space-y-4 my-auto text-left">
          <div>
            <h2 className="text-xl font-black text-slate-900">Welcome aboard</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Connect your verified college account to discover overlapping outings.
            </p>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            className="w-full py-3.5 bg-[#22427D] hover:bg-[#1A3360] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-[0_6px_16px_rgba(34,66,125,0.2)] transition active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
            </svg>
            <span>{authLoading ? "Opening Google..." : "Continue with Google"}</span>
          </button>

          <p className="text-[10px] text-slate-400 text-center font-medium">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>

        <div className="text-center text-xs text-slate-400 font-bold">
          MeetRa • Campus Outings & Overlap Match
        </div>
      </div>
    );
  }

  // ---------------- MAIN LOGGED-IN VIEW (MATCHING MOCKUP 4) ---------------- //
  return (
    <div className="min-h-screen bg-[#F6F9FD] text-[#0F172A] flex flex-col justify-between max-w-md mx-auto relative overflow-x-hidden shadow-2xl">
      
      {/* Top Search & Profile Bar */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-30 px-5 pt-3 pb-2.5 flex justify-between items-center border-b border-slate-100 shadow-[0_2px_12px_rgba(34,66,125,0.03)]">
        <div className="flex-1 pr-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search destinations or campus spots"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#EEF4FD] rounded-full text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#22427D]/30 transition"
            />
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('profile')}
          className="w-9 h-9 rounded-2xl bg-[#D4E4FC] flex items-center justify-center font-black text-xs text-[#22427D] shadow-sm shrink-0"
        >
          {userProfile.name?.slice(0, 2).toUpperCase() || 'ST'}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-4 overflow-y-auto pb-24 space-y-4">
        
        {/* ==================== HOME TAB ==================== */}
        {activeTab === 'home' && (
          <div className="space-y-4">

            {/* Plan a Trip Hero Card */}
            <div className="bg-[#EEF4FD] rounded-[32px] p-5 shadow-[0_8px_24px_rgba(34,66,125,0.06)] border border-blue-50/70 space-y-4 text-left">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Plan a trip</h3>
                  <p className="text-[11px] font-bold text-slate-400">We'll match you at 60%+ overlap</p>
                </div>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  className="px-2.5 py-1.5 bg-white rounded-xl text-[#22427D] shadow-sm text-[10px] font-black flex items-center gap-1 active:scale-95 transition"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{locating ? "GPS..." : "Detect"}</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-[#22427D] rounded-xl"><MapPin className="w-4 h-4" /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Destination</p>
                      <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)}
                        className="text-xs font-black text-slate-900 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                  <Edit3 className="w-3.5 h-3.5 text-slate-300" />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {CAMPUS_HUBS.map((hub) => (
                    <button
                      key={hub.name}
                      type="button"
                      onClick={() => {
                        setLocation(hub.name);
                        setStartCoords(hub.coords);
                      }}
                      className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition ${
                        location === hub.name ? 'bg-[#22427D] text-white shadow-sm' : 'bg-white text-slate-600'
                      }`}
                    >
                      {hub.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Depart</p>
                      <p className="text-xs font-black text-slate-900">Today</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Time</p>
                      <p className="text-xs font-black text-slate-900">{hours} Hours</p>
                    </div>
                    <input 
                      type="range" min="1" max="8" value={hours} onChange={(e) => setHours(e.target.value)} 
                      className="w-14 accent-[#22427D]" 
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-black text-slate-800">
                    <span className="text-slate-400 font-bold">Pocket Budget</span>
                    <span className="text-sm font-black text-[#22427D]">₹{budget}</span>
                  </div>
                  <input 
                    type="range" min="100" max="1500" step="50" value={budget} 
                    onChange={(e) => setBudget(Number(e.target.value))} 
                    className="w-full accent-[#22427D]" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button" onClick={() => setMode('solo')}
                    className={`py-2 text-[11px] font-black rounded-xl transition ${
                      mode === 'solo' ? 'bg-[#22427D] text-white shadow-sm' : 'bg-white text-slate-600'
                    }`}
                  >
                    Go Solo
                  </button>
                  <button
                    type="button" onClick={() => setMode('match')}
                    className={`py-2 text-[11px] font-black rounded-xl transition ${
                      mode === 'match' ? 'bg-[#22427D] text-white shadow-sm' : 'bg-white text-slate-600'
                    }`}
                  >
                    1-on-1 Match
                  </button>
                  <button
                    type="button" onClick={() => setMode('group')}
                    className={`py-2 text-[11px] font-black rounded-xl transition ${
                      mode === 'group' ? 'bg-[#22427D] text-white shadow-sm' : 'bg-white text-slate-600'
                    }`}
                  >
                    Group (3-4)
                  </button>
                </div>
              </div>

              <button
                disabled={loading} onClick={handleGeneratePlan}
                className="w-full py-3.5 bg-[#22427D] hover:bg-[#1A3360] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-[0_6px_16px_rgba(34,66,125,0.2)] transition active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>{loading ? "Matching Overlaps..." : "Find My Match"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Suggested Matches Section */}
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center px-1">
                <h4 className="text-sm font-black text-slate-900">Suggested matches</h4>
                <span className="text-xs font-bold text-[#22427D] cursor-pointer hover:underline">See all</span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {(friendsList.length > 0 ? friendsList : [
                  { id: 1, name: "Maya R.", college: "ITM University", match_percentage: 78 },
                  { id: 2, name: "Jonas K.", college: "MITS Gwalior", match_percentage: 71 },
                  { id: 3, name: "Alex T.", college: "City Center", match_percentage: 65 }
                ]).map((peer, idx) => (
                  <div 
                    key={peer.id || idx}
                    onClick={() => setInspectingPeer(peer)}
                    className="min-w-[155px] bg-white rounded-3xl p-4 shadow-[0_6px_20px_rgba(34,66,125,0.05)] border border-slate-100 flex flex-col justify-between cursor-pointer hover:border-blue-200 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs ${idx % 2 === 0 ? 'bg-[#FDEEE9] text-[#E8615A]' : 'bg-[#E3EFFD] text-[#22427D]'}`}>
                        {peer.name?.slice(0, 1) || 'M'}
                      </div>
                      <ScallopedBadge className="w-9 h-9">
                        {peer.match_percentage || 78}%
                      </ScallopedBadge>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-xs font-black text-slate-900">{peer.name}</h5>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{peer.college || 'Campus Peer'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Cafes Carousel */}
            {partnerCafes.length > 0 && (
              <div className="bg-white rounded-[26px] p-4 shadow-[0_6px_20px_rgba(34,66,125,0.05)] border border-slate-100/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#E8615A]" /> Partner Discounts & Cafes
                  </span>
                  <span className="text-[9px] font-black px-2 py-0.5 bg-blue-50 text-[#22427D] rounded-full">
                    Verified
                  </span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-1.5 pt-0.5">
                  {partnerCafes.map((cafe) => (
                    <div 
                      key={cafe.id} 
                      className="min-w-[210px] bg-[#EEF4FD] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div className="h-24 bg-slate-200 relative overflow-hidden">
                        {cafe.cover_image && (
                          <img src={cafe.cover_image} alt={cafe.name} className="w-full h-full object-cover" />
                        )}
                        <span className="absolute top-2 left-2 bg-[#E8615A] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                          {cafe.discount_text}
                        </span>
                      </div>
                      <div className="p-2.5 space-y-1 text-left">
                        <h4 className="text-xs font-black text-slate-900 truncate">{cafe.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold">{cafe.landmark} • {cafe.category}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-black text-[#22427D]">Min ~₹{cafe.min_spend}</span>
                          <button
                            onClick={() => setSelectedCafeForBooking(cafe)}
                            className="px-2.5 py-1 text-[10px] font-black bg-[#22427D] text-white rounded-lg transition"
                          >
                            Reserve 🎟
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outings Feed */}
            <div className="bg-white rounded-[26px] p-4 shadow-[0_6px_20px_rgba(34,66,125,0.05)] border border-slate-100/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Community Feed ({savedOutings.length})
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 bg-blue-50 text-[#22427D] rounded-full">Active</span>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-50">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {['All', 'Food', 'Cafes', 'Heritage', 'Budget'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveFeedTag(tag)}
                      className={`px-3 py-1 rounded-full font-bold text-[11px] whitespace-nowrap transition ${
                        activeFeedTag === tag ? 'bg-[#22427D] text-white shadow-sm' : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {tag === 'All' ? 'All Tags' : `#${tag}`}
                    </button>
                  ))}
                </div>
              </div>

              {savedOutings.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic py-2 text-center">No community outings match the selected filters.</p>
              ) : (
                <div className="space-y-2">
                  {savedOutings.map((item) => {
                    const isSaved = bookmarkedOutingIds.includes(item.id);
                    return (
                      <div key={item.id} className="p-3 bg-slate-50/80 rounded-2xl flex justify-between items-center text-left">
                        <div className="flex-1 pr-2">
                          <p className="text-xs font-black text-slate-900">{item.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{item.category} • Host: {item.created_by}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#22427D] bg-white px-2.5 py-1 rounded-full shadow-sm">
                            ₹{item.total_expense}
                          </span>
                          <button
                            onClick={() => handleToggleBookmark(item.id)}
                            className="p-1.5 rounded-xl bg-white shadow-sm"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================== OUTING TAB ==================== */}
        {activeTab === 'outing' && (
          <div className="space-y-4">
            {plan ? (
              <div className="bg-white rounded-[26px] p-5 shadow-[0_6px_20px_rgba(34,66,125,0.05)] border border-slate-100/80 space-y-4 text-left">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-blue-50 text-[#22427D] rounded-full">
                      {mode === 'solo' ? 'Solo Itinerary' : mode === 'group' ? 'Group Squad (3-4)' : 'Matched Itinerary'}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">{plan.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Estimated</p>
                    <p className="text-base font-black text-[#22427D]">₹{plan.total_cost}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.timeline.map((stop, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#22427D] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <div className="bg-[#EEF4FD] rounded-2xl p-3 flex-1 text-left">
                        <div className="flex justify-between text-[11px] font-bold text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {stop.time}</span>
                          <span className="text-[#22427D] font-black">~₹{stop.est_cost}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 mt-0.5">{stop.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{stop.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-[#22427D]" /> Live Route & Transit Split
                    </span>
                    <span className="text-[9px] font-bold px-2.5 py-0.5 bg-blue-50 text-[#22427D] rounded-full">
                      OSM Real Roads
                    </span>
                  </div>

                  <RouteMap 
                    startCoords={startCoords} 
                    destCoords={[26.2045, 78.1945]} 
                    destTitle={plan.timeline?.[0]?.title || "Campus Spot"}
                  />

                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded-2xl">
                      <p className="text-[9px] font-bold text-slate-400">E-Rickshaw</p>
                      <p className="font-black text-slate-900">₹15 <span className="text-[9px] font-medium text-slate-400">/head</span></p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-2xl">
                      <p className="text-[9px] font-bold text-slate-400">Auto Split</p>
                      <p className="font-black text-[#22427D]">₹35 <span className="text-[9px] font-medium text-slate-400">/head</span></p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-2xl">
                      <p className="text-[9px] font-bold text-slate-400">Rapido Pool</p>
                      <p className="font-black text-slate-900">₹45 <span className="text-[9px] font-medium text-slate-400">/head</span></p>
                    </div>
                  </div>
                </div>

                <button
                  disabled={saving} onClick={handleConfirmAndSave}
                  className="w-full py-3.5 bg-[#22427D] hover:bg-[#1A3360] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-[0_6px_16px_rgba(34,66,125,0.2)] transition active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {saving ? "Saving to Database..." : "Lock & Confirm Outing"}
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-[26px] p-8 shadow-[0_6px_20px_rgba(34,66,125,0.05)] border border-slate-100/80 text-center py-16 space-y-3">
                <Navigation className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-black text-slate-900">No Active Plan</h4>
                <button onClick={() => setActiveTab('home')} className="px-4 py-2 bg-[#EEF4FD] hover:bg-blue-100 text-[#22427D] font-bold text-xs rounded-full transition active:scale-95">
                  Build Outing on Home
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== CHAT TAB ==================== */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            {activeChatCollab ? (
              <div className="flex flex-col h-[70vh] bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-3 bg-[#EEF4FD] border-b border-blue-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setActiveChatCollab(null)}
                      className="p-1.5 bg-white rounded-full text-slate-700 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="text-left">
                      <h4 className="text-xs font-black text-slate-900">
                        {activeChatCollab.isGroup ? activeChatCollab.groupName : (
                          activeChatCollab.sender_id === userProfile.id ? activeChatCollab.receiver_name : activeChatCollab.sender_name
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold">Coordination Chat</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="text-[10px] font-black bg-[#22427D] text-white px-3 py-1 rounded-full shadow-sm"
                  >
                    Finish & Rate ✓
                  </button>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#F6F9FD]">
                  {messages.map((m) => {
                    const isMe = m.sender_id === userProfile.id;
                    return (
                      <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[9px] font-bold text-slate-400 mb-0.5">{m.sender_name}</span>
                        <div className={`p-2.5 rounded-2xl max-w-[75%] text-xs font-semibold shadow-sm ${
                          isMe ? 'bg-[#22427D] text-white' : 'bg-white text-slate-800'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-slate-100 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type meetup details..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 px-4 py-2 text-xs bg-slate-50 rounded-full focus:outline-none focus:ring-1 focus:ring-[#22427D]/30"
                  />
                  <button 
                    type="submit"
                    className="p-2.5 bg-[#22427D] text-white rounded-full shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-[26px] p-5 shadow-[0_6px_20px_rgba(34,66,125,0.05)] border border-slate-100/80 space-y-4 text-left">
                <h3 className="text-sm font-black uppercase text-slate-900">Active Conversations</h3>
                <div className="space-y-2">
                  {collabRequests.filter(c => c.status === 'accepted').map((convo) => (
                    <div 
                      key={convo.id}
                      onClick={() => setActiveChatCollab(convo)}
                      className="p-3 bg-slate-50 hover:bg-blue-50/80 rounded-2xl flex items-center justify-between cursor-pointer transition"
                    >
                      <div>
                        <h4 className="text-xs font-black text-slate-900">
                          {convo.sender_id === userProfile.id ? convo.receiver_name : convo.sender_name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold">Collab #{convo.id}</p>
                      </div>
                      <span className="text-xs font-black text-[#22427D]">Open Chat →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PROFILE TAB ==================== */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-[26px] p-5 shadow-[0_6px_20px_rgba(34,66,125,0.05)] border border-slate-100/80 space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF4FD] overflow-hidden flex items-center justify-center font-black text-sm text-[#22427D] shadow-sm">
                  {userProfile.avatar_url ? (
                    <img src={userProfile.avatar_url} alt="DP" className="w-full h-full object-cover" />
                  ) : (
                    <span>{userProfile.name?.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{userProfile.name}</h3>
                  <p className="text-xs font-bold text-slate-400">{userProfile.college} • {userProfile.branch}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setProfileForm({
                    name: userProfile.name || '',
                    age: userProfile.age || 19,
                    college: userProfile.college || 'ITM University',
                    course: 'B.Tech',
                    branchName: 'CSE',
                    year: '1st Year',
                    bio: userProfile.bio || '',
                    avatar_url: userProfile.avatar_url || null,
                    interests: userProfile.interests || ['Food', 'Cafes']
                  });
                  setIsEditingProfile(true);
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-[#22427D]"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* My Cafe Passes */}
            <div className="pt-1 space-y-2">
              <span className="text-xs font-black uppercase text-slate-800">My Cafe Passes</span>
              {userBookings.map((b) => (
                <div key={b.id} onClick={() => setConfirmedBookingPass(b)} className="p-3 bg-blue-50/70 rounded-2xl flex justify-between items-center cursor-pointer">
                  <div>
                    <h5 className="text-xs font-black text-slate-900">{b.cafe_name}</h5>
                    <p className="text-[10px] text-slate-400 font-bold">{b.booking_date} at {b.booking_time}</p>
                  </div>
                  <span className="text-xs font-black text-[#22427D]">{b.pass_code}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-2xl transition"
            >
              Logout Account
            </button>
          </div>
        )}

      </main>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-0 max-w-md w-full bg-white/95 backdrop-blur-md border-t border-slate-100 py-2.5 px-6 z-40 flex justify-between items-center shadow-[0_-8px_24px_rgba(34,66,125,0.06)]">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'home' ? 'text-[#22427D]' : 'text-slate-400'}`}>
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button onClick={() => setActiveTab('outing')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'outing' ? 'text-[#22427D]' : 'text-slate-400'}`}>
          <Compass className="w-5 h-5" />
          <span>Outing</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'chat' ? 'text-[#22427D]' : 'text-slate-400'}`}>
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'profile' ? 'text-[#22427D]' : 'text-slate-400'}`}>
          <UserIcon className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>

      {/* Profile Customize Modal with Preserved Handlers */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-4 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase">Customize Profile</h3>
              <button onClick={() => setIsEditingProfile(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Profile Photo</label>
                <div className="flex items-center gap-3 p-2 bg-[#EEF4FD] rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    {profileForm.avatar_url ? (
                      <img src={profileForm.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-black text-slate-500">DP</span>
                    )}
                  </div>
                  <label className="px-3 py-1 bg-white text-slate-800 rounded-lg text-xs font-black cursor-pointer shadow-sm">
                    Upload
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                  <input 
                    type="text" required value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Age</label>
                  <input 
                    type="number" min="16" max="35" required value={profileForm.age || 19}
                    onChange={(e) => setProfileForm({...profileForm, age: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">College</label>
                <select
                  value={profileForm.college}
                  onChange={(e) => setProfileForm({...profileForm, college: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl"
                >
                  {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Course</label>
                  <select
                    value={profileForm.course}
                    onChange={(e) => setProfileForm({...profileForm, course: e.target.value})}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 rounded-xl"
                  >
                    {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Year</label>
                  <select
                    value={profileForm.year}
                    onChange={(e) => setProfileForm({...profileForm, year: e.target.value})}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 rounded-xl"
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {profileForm.course === 'B.Tech' && (
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Branch</label>
                  <select
                    value={profileForm.branchName}
                    onChange={(e) => setProfileForm({...profileForm, branchName: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl"
                  >
                    {BTECH_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Bio</label>
                <textarea 
                  rows={2}
                  value={profileForm.bio || ""}
                  onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl resize-none"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-[#22427D] hover:bg-[#1A3360] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-md">
                Save Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Inspecting Peer Modal */}
      {inspectingPeer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-4 text-left shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#22427D] px-2.5 py-0.5 rounded-full">
                Verified Peer
              </span>
              <button onClick={() => setInspectingPeer(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF4FD] overflow-hidden flex items-center justify-center text-lg font-black text-[#22427D] shrink-0">
                {inspectingPeer.avatar_url ? (
                  <img src={inspectingPeer.avatar_url} alt={inspectingPeer.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{inspectingPeer.name?.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">{inspectingPeer.name}</h3>
                <p className="text-xs text-slate-400">{inspectingPeer.college || "Campus Member"}</p>
                <div className="flex items-center gap-1 text-[11px] font-black text-amber-500 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{inspectingPeer.rating || 5.0} Compatibility</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#EEF4FD] rounded-2xl text-xs text-slate-600 italic">
              "{inspectingPeer.bio || 'Up for campus food walks and discovering budget cafes!'}"
            </div>

            {inspectingPeer.id !== userProfile.id && (
              <button
                onClick={() => handleSendFriendRequest(inspectingPeer)}
                className="w-full py-2.5 bg-[#22427D] hover:bg-[#1A3360] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition"
              >
                + Connect as Campus Friend
              </button>
            )}

            <button
              onClick={() => setInspectingPeer(null)}
              className="w-full py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-2xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-4 text-left shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase">Rate Collab Peer</h3>
              <button onClick={() => setShowReviewModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Score Outing (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingScore(star)}
                      className={`p-2 rounded-xl transition ${
                        ratingScore >= star ? 'bg-amber-100 text-amber-500' : 'bg-slate-50 text-slate-300'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${ratingScore >= star ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Peer Behaviour</label>
                <div className="flex flex-wrap gap-1.5">
                  {["Punctual", "Friendly", "Cooperative", "Split Fairly"].map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setSelectedReviewTags(prev => 
                        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                      )}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition ${
                        selectedReviewTags.includes(tag) ? 'bg-[#22427D] text-white' : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-0.5">Note</label>
                <input 
                  type="text" 
                  placeholder="e.g. Arrived on time, great chat!" 
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#22427D] hover:bg-[#1A3360] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-md"
              >
                Submit Review & Complete
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}