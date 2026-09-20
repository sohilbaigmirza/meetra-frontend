import React, { useState, useEffect, useRef } from 'react';
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
  Phone,
  KeyRound,
  Bookmark,
  Filter
} from 'lucide-react';

const API_BASE = "https://meetra-backend-vjuy.onrender.com/api/v1";

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  // User Profile State (Starts as null so new users see the login page)
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('meetra_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Auth Flow States
  const [authStep, setAuthStep] = useState('phone'); // 'phone', 'otp', 'new_profile'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Feed Filter & Wishlist States
  const [activeFeedTag, setActiveFeedTag] = useState('All');
  const [activeFeedBudget, setActiveFeedBudget] = useState('all'); // 'all', '200', '400'
  const [bookmarkedOutingIds, setBookmarkedOutingIds] = useState([]);
  const [savedWishlistOutings, setSavedWishlistOutings] = useState([]);

  // Profile Edit / Setup Form
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    college: 'ITM University',
    branch: "CSE '28",
    bio: 'Up for budget cafe hangouts & street food trails!',
    avatar_url: null,
    interests: ['Food', 'Cafes'],
    preferred_outing_types: ['Budget Cafes', 'Heritage Walk'],
    budget_preference: 300
  });

  const [inspectingPeer, setInspectingPeer] = useState(null);
  const [friendsList, setFriendsList] = useState([]);

  // Generator form states
  const [hours, setHours] = useState(3);
  const [budget, setBudget] = useState(300);
  const [location, setLocation] = useState('Campus Main Gate');
  const [selectedInterests, setSelectedInterests] = useState(['Food', 'Cafes']);
  const [outingType, setOutingType] = useState('Casual Hangout');
  const [mode, setMode] = useState('match');
  
  // Operational state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState(null);
  const [invitedPeers, setInvitedPeers] = useState([]);
  const [savedOutings, setSavedOutings] = useState([]);
  const [collabRequests, setCollabRequests] = useState([]);

  // Chat State
  const [activeChatCollab, setActiveChatCollab] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const chatBottomRef = useRef(null);

  // Reviews State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [selectedReviewTags, setSelectedReviewTags] = useState(["Punctual", "Friendly"]);
  const [reviewFeedback, setReviewFeedback] = useState("");

  // Gallery File Upload & On-Device Auto Compression
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 240;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.82);
        setProfileForm((prev) => ({ ...prev, avatar_url: compressedBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ---------------- AUTHENTICATION HANDLERS ---------------- //
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.trim().length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setAuthStep('otp');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpCode !== '0000') {
      alert("Invalid OTP. Use test PIN: 0000");
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/phone-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        if (!data.is_new_user && data.user) {
          // Existing User Login
          setUserProfile(data.user);
          localStorage.setItem('meetra_user', JSON.stringify(data.user));
          setAuthStep('phone');
        } else {
          // New User -> Prompt Profile Creation
          setAuthStep('new_profile');
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      // Offline fallback: prompt profile setup
      setAuthStep('new_profile');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_or_email: phoneNumber.trim(),
          name: profileForm.name.trim(),
          college: profileForm.college.trim(),
          branch: profileForm.branch.trim(),
          bio: profileForm.bio.trim(),
          avatar_url: profileForm.avatar_url,
          interests: profileForm.interests || ["Food", "Cafes"],
          preferred_outing_types: profileForm.preferred_outing_types || ["Budget Cafes"],
          budget_preference: Number(profileForm.budget_preference || 300)
        })
      });

      if (res.ok) {
        const newUser = await res.json();
        setUserProfile(newUser);
        localStorage.setItem('meetra_user', JSON.stringify(newUser));
        setAuthStep('phone');
      }
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('meetra_user');
      setUserProfile(null);
      setAuthStep('phone');
      setPhoneNumber('');
      setOtpCode('');
      setActiveTab('home');
    }
  };

  // ---------------- DATA FETCHING ---------------- //
  const fetchFriends = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/friends/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setFriendsList(data);
      }
    } catch (err) {
      console.error("Friends fetch error:", err);
    }
  };

  const handleSendFriendRequest = async (peer) => {
    if (!userProfile?.id) return;
    try {
      const res = await fetch(`${API_BASE}/friends/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requester_id: userProfile.id,
          requester_name: userProfile.name,
          receiver_id: peer.id,
          receiver_name: peer.name
        })
      });
      if (res.ok) {
        alert(`Friend request sent to ${peer.name}!`);
        fetchFriends(userProfile.id);
      }
    } catch (err) {
      console.error("Friend request error:", err);
    }
  };

  const handleRespondFriend = async (friendshipId, status) => {
    try {
      const res = await fetch(`${API_BASE}/friends/${friendshipId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchFriends(userProfile.id);
      }
    } catch (err) {
      console.error("Friend response error:", err);
    }
  };

  // Fetch Outings with Active Filters
  const fetchOutings = async (tag = activeFeedTag, budget = activeFeedBudget) => {
    try {
      let url = `${API_BASE}/outings?`;
      if (tag && tag !== 'All') url += `tag=${encodeURIComponent(tag)}&`;
      if (budget && budget !== 'all') url += `max_budget=${budget}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSavedOutings(data);
      }
    } catch (err) {
      console.error("DB Fetch Error:", err);
    }
  };

  // Fetch Bookmarked Wishlist
  const fetchBookmarks = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/bookmarks/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSavedWishlistOutings(data);
        setBookmarkedOutingIds(data.map(o => o.id));
      }
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = async (outingId) => {
    if (!userProfile?.id) return;
    try {
      const res = await fetch(`${API_BASE}/bookmarks/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userProfile.id,
          outing_id: outingId
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.bookmarked) {
          setBookmarkedOutingIds(prev => [...prev, outingId]);
        } else {
          setBookmarkedOutingIds(prev => prev.filter(id => id !== outingId));
        }
        fetchBookmarks(userProfile.id);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

  const fetchCollabs = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/collabs/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCollabRequests(data);
      }
    } catch (err) {
      console.error("Collabs fetch error:", err);
    }
  };

  const fetchMessages = async (collabId) => {
    if (!collabId) return;
    try {
      const res = await fetch(`${API_BASE}/chat/${collabId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Chat fetch error:", err);
    }
  };

  useEffect(() => {
    fetchOutings(activeFeedTag, activeFeedBudget);
    if (userProfile?.id) {
      fetchCollabs(userProfile.id);
      fetchFriends(userProfile.id);
      fetchBookmarks(userProfile.id);
    }
  }, [userProfile?.id, activeFeedTag, activeFeedBudget]);

  useEffect(() => {
    if (activeChatCollab && activeTab === 'chat') {
      fetchMessages(activeChatCollab.id);
      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchMessages(activeChatCollab.id);
        }
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [activeChatCollab, activeTab]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleInterest = (tag) => {
    setSelectedInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userProfile.id,
          name: profileForm.name,
          college: profileForm.college,
          branch: profileForm.branch,
          bio: profileForm.bio,
          avatar_url: profileForm.avatar_url,
          interests: profileForm.interests || ["Food", "Cafes"],
          preferred_outing_types: profileForm.preferred_outing_types || ["Budget Cafes"],
          budget_preference: Number(profileForm.budget_preference || 300)
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setUserProfile(updated);
        localStorage.setItem('meetra_user', JSON.stringify(updated));
        setIsEditingProfile(false);
        fetchCollabs(updated.id);
        fetchFriends(updated.id);
        alert("Profile & photo saved to database!");
      }
    } catch (err) {
      console.error("Profile save error:", err);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/itinerary/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userProfile?.id,
          available_hours: Number(hours),
          budget: Number(budget),
          location,
          interests: selectedInterests,
          outing_type: outingType,
          is_solo: mode === 'solo'
        })
      });
      const data = await res.json();
      setPlan(data);
      setActiveTab('outing');
    } catch (err) {
      console.error("Generator error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndSave = async () => {
    if (!plan || !userProfile) return;
    setSaving(true);
    try {
      const payload = {
        title: plan.title,
        category: outingType,
        distance: `${(hours * 1.5).toFixed(1)} km`,
        travel_mode: budget < 300 ? "E-Rickshaw / Walk" : "Rapido / Cab",
        event_time: `${plan.est_duration} window`,
        total_expense: plan.total_cost,
        expense_breakdown: { transit: 30, activities_and_food: plan.total_cost - 30 },
        tags: selectedInterests,
        max_seats: 4,
        is_solo: mode === 'solo',
        created_by: userProfile.name,
        created_by_id: userProfile.id
      };

      const res = await fetch(`${API_BASE}/outings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchOutings();
        alert(`Plan locked and saved under ${userProfile.name}!`);
        setActiveTab('home');
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSendInvite = async (peer) => {
    if (!userProfile?.id) return;
    const activeOutingId = plan?.id || (savedOutings.length > 0 ? savedOutings[0].id : 1);
    try {
      const res = await fetch(`${API_BASE}/collabs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outing_id: activeOutingId,
          sender_id: userProfile.id,
          sender_name: userProfile.name,
          receiver_id: peer.id,
          receiver_name: peer.name,
          match_percentage: plan?.match_score || 92
        })
      });

      if (res.ok) {
        setInvitedPeers(prev => [...prev, peer.id]);
        await fetchCollabs(userProfile.id);
        alert(`Invite sent to ${peer.name}!`);
      }
    } catch (err) {
      console.error("Invite error:", err);
    }
  };

  const handleRespondCollab = async (collabId, status) => {
    try {
      const res = await fetch(`${API_BASE}/collabs/${collabId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        await fetchCollabs(userProfile.id);
        if (status === 'accepted') {
          setActiveChatCollab(updated);
          setActiveTab('chat');
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChatCollab || !userProfile) return;

    const optimisticMsg = {
      id: Date.now(),
      collab_id: activeChatCollab.id,
      sender_id: userProfile.id,
      sender_name: userProfile.name,
      text: newMessageText.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMsg]);
    const textToSend = newMessageText.trim();
    setNewMessageText("");

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collab_id: activeChatCollab.id,
          sender_id: userProfile.id,
          sender_name: userProfile.name,
          text: textToSend
        })
      });

      if (!res.ok) {
        fetchMessages(activeChatCollab.id);
      }
    } catch (err) {
      console.error("Message send error:", err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!activeChatCollab || !userProfile) return;

    const peerId = activeChatCollab.sender_id === userProfile.id 
      ? activeChatCollab.receiver_id 
      : activeChatCollab.sender_id;

    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collab_id: activeChatCollab.id,
          reviewer_id: userProfile.id,
          reviewer_name: userProfile.name,
          reviewee_id: peerId,
          rating: Number(ratingScore),
          tags: selectedReviewTags,
          feedback: reviewFeedback
        })
      });

      if (res.ok) {
        alert("Outing marked complete! Peer rating updated.");
        setShowReviewModal(false);
        setActiveChatCollab(null);
        fetchCollabs(userProfile.id);
        setActiveTab('home');
      }
    } catch (err) {
      console.error("Review submission error:", err);
    }
  };

  // ---------------- RENDER LANDING & LOGIN IF NOT LOGGED IN ---------------- //
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col justify-center px-6 max-w-md mx-auto border-x-2 border-slate-900 shadow-2xl relative">
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-slate-900 px-3 py-1 rounded-full shadow-[2px_2px_0px_#000]">
              <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
              <span className="text-xs font-black tracking-wider uppercase">Campus Outings</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">MeetRa</h1>
            <p className="text-xs font-bold text-slate-600">Zero awkward plans. Spontaneous college outings.</p>
          </div>

          {/* STEP 1: Phone Number Input */}
          {authStep === 'phone' && (
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#000] space-y-4">
              <div>
                <span className="text-xs font-black uppercase text-slate-800">Student Sign In</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">Enter your mobile number</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">We'll send an OTP to verify your campus identity.</p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-3">
                <div className="flex items-center gap-2 border-2 border-slate-900 rounded-xl px-3 py-2 bg-slate-50 focus-within:bg-white transition">
                  <span className="text-xs font-black text-slate-500">+91</span>
                  <input 
                    type="tel" 
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs font-bold bg-transparent focus:outline-none text-slate-900"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-[#FF6B6B] hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: OTP Verification (Test Pin 0000) */}
          {authStep === 'otp' && (
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#000] space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-black uppercase text-slate-800">Verification</span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">Enter 4-Digit OTP</h3>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">Sent to +91 {phoneNumber}</p>
                </div>
                <button 
                  onClick={() => setAuthStep('phone')} 
                  className="text-[10px] font-black underline text-slate-500 hover:text-slate-800"
                >
                  Edit Number
                </button>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="• • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center text-2xl tracking-[0.5em] font-black border-2 border-slate-900 rounded-xl py-2 bg-slate-50 focus:bg-white focus:outline-none"
                  autoFocus
                  required
                />

                <div className="p-2.5 bg-amber-50 border border-slate-900 rounded-xl text-[10px] font-bold text-amber-900 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 shrink-0" />
                  <span>Test mode active: Enter OTP <b>0000</b></span>
                </div>

                <button 
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition flex items-center justify-center gap-2"
                >
                  {authLoading ? "Verifying..." : "Verify & Continue"}
                  <Check className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: New User College Profile Setup */}
          {authStep === 'new_profile' && (
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#000] space-y-4 max-h-[85vh] overflow-y-auto">
              <div>
                <span className="text-xs font-black uppercase text-slate-800">Welcome to MeetRa!</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">Create Your Student Card</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">Peers will see this when matching for outings.</p>
              </div>

              <form onSubmit={handleCompleteRegistration} className="space-y-3">
                {/* Photo Upload */}
                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-1">Profile Photo</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border-2 border-dashed border-slate-900 rounded-xl">
                    <div className="w-12 h-12 rounded-xl border border-slate-900 bg-amber-100 overflow-hidden flex items-center justify-center shrink-0">
                      {profileForm.avatar_url ? (
                        <img src={profileForm.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-black text-slate-700">DP</span>
                      )}
                    </div>
                    <label className="px-3 py-1.5 bg-white text-slate-900 border-2 border-slate-900 rounded-lg text-xs font-black shadow-[2px_2px_0px_#000] cursor-pointer hover:bg-slate-100 transition">
                      Upload from Gallery
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-0.5">Full Name</label>
                  <input 
                    type="text" required placeholder="e.g. Sohil Mirza"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-3 py-1.5 text-xs font-semibold border-2 border-slate-900 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-0.5">College</label>
                  <input 
                    type="text" required placeholder="e.g. ITM University / MITS"
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({...profileForm, college: e.target.value})}
                    className="w-full px-3 py-1.5 text-xs font-semibold border-2 border-slate-900 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-0.5">Branch & Batch</label>
                  <input 
                    type="text" placeholder="e.g. CSE '28"
                    value={profileForm.branch}
                    onChange={(e) => setProfileForm({...profileForm, branch: e.target.value})}
                    className="w-full px-3 py-1.5 text-xs font-semibold border-2 border-slate-900 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-0.5">Short Bio</label>
                  <textarea 
                    rows={2} placeholder="What kind of outings do you like?"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    className="w-full px-3 py-1.5 text-xs font-semibold border-2 border-slate-900 rounded-xl resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-[#4D96FF] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition"
                >
                  {authLoading ? "Creating Profile..." : "Join MeetRa"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ---------------- MAIN APPLICATION (WHEN LOGGED IN) ---------------- //
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col justify-between max-w-md mx-auto border-x-2 border-slate-900 shadow-2xl relative">
      
      {/* Top Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-slate-900 z-30 px-5 py-3.5 flex justify-between items-center shadow-[0px_2px_0px_#000]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-slate-900">MeetRa</span>
            <span className="text-[10px] bg-[#FF6B6B] text-white px-2 py-0.5 rounded-full font-bold tracking-wide">GEN-Z</span>
          </div>
          <p className="text-[11px] text-slate-500 font-bold">College Outings & Compatibility</p>
        </div>

        <button 
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 px-2.5 py-1 rounded-xl text-[11px] font-black shadow-[2px_2px_0px_#000] transition"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{userProfile.name.split(' ')[0]}</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-5 overflow-y-auto pb-24 space-y-4">
        
        {/* ==================== HOME TAB ==================== */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            
            {/* Top Banner */}
            <div className="bg-[#FFE66D] border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#000]">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-white/70 px-2 py-0.5 rounded-md border border-slate-900">
                Mood & Daily Outings
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Hey, {userProfile.name.split(' ')[0]}!</h2>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                Zero awkward plans. Input your free hours and pocket cash to build a custom outing.
              </p>
            </div>

            {/* Pending Requests Alert */}
            {collabRequests.filter(r => r.status === 'pending').length > 0 && (
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#FF6B6B] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Active Collab Requests
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 border border-slate-900 rounded-md">Pending</span>
                </div>
                {collabRequests.filter(r => r.status === 'pending').map(req => (
                  <div key={req.id} className="p-3 bg-rose-50/60 border-2 border-slate-900 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-900">
                        {req.sender_id === userProfile.id ? `Invited: ${req.receiver_name}` : `From: ${req.sender_name}`}
                      </p>
                      <p className="text-[10px] font-bold text-slate-600">Match Score: {req.match_percentage}%</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleRespondCollab(req.id, 'accepted')}
                        className="px-2.5 py-1 text-xs font-black bg-emerald-500 text-white rounded-lg border border-slate-900"
                      >
                        Accept & Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Outings Feed with Discovery Filters & Wishlist */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#000] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Community Outings Feed ({savedOutings.length})
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 border border-slate-900 rounded-md">Neon DB</span>
              </div>

              {/* Filter Bar: Tags & Budget */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                {/* Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {['All', 'Food', 'Cafes', 'Heritage', 'Budget'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveFeedTag(tag)}
                      className={`px-2.5 py-1 rounded-lg border-2 border-slate-900 font-black text-[11px] whitespace-nowrap transition ${
                        activeFeedTag === tag ? 'bg-slate-900 text-white shadow-[1px_1px_0px_#FF6B6B]' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {tag === 'All' ? 'All Tags' : `#${tag}`}
                    </button>
                  ))}
                </div>

                {/* Budget Quick Toggles */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Max Budget:
                  </span>
                  <div className="flex gap-1.5">
                    {[
                        { label: 'Any', value: 'all' },
                        { label: '< ₹150', value: '150' },
                        { label: '< ₹300', value: '300' },
                        { label: '< ₹500', value: '500' }
                      ].map(b => (
                      <button
                        key={b.value}
                        onClick={() => setActiveFeedBudget(b.value)}
                        className={`px-2 py-0.5 rounded border border-slate-900 text-[10px] font-black transition ${
                          activeFeedBudget === b.value ? 'bg-[#4D96FF] text-white' : 'bg-white text-slate-700'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feed List with Bookmark Star */}
              {savedOutings.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic py-2 text-center">No community outings match the selected filters.</p>
              ) : (
                <div className="space-y-2">
                  {savedOutings.map((item) => {
                    const isSaved = bookmarkedOutingIds.includes(item.id);
                    return (
                      <div key={item.id} className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl flex justify-between items-center shadow-[2px_2px_0px_#000]">
                        <div className="flex-1 pr-2">
                          <p className="text-xs font-black text-slate-900">{item.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{item.category} • Host: {item.created_by}</p>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {item.tags.slice(0, 2).map(t => (
                                <span key={t} className="text-[9px] font-bold px-1.5 py-0.2 bg-white border border-slate-300 rounded text-slate-600">
                                  #{t.replace('#', '')}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#4D96FF] bg-white border border-slate-900 px-2 py-1 rounded-lg shrink-0">
                            ₹{item.total_expense}
                          </span>
                          <button
                            onClick={() => handleToggleBookmark(item.id)}
                            className={`p-1.5 rounded-lg border border-slate-900 transition active:translate-y-0.5 ${
                              isSaved ? 'bg-amber-300 shadow-[1px_1px_0px_#000]' : 'bg-white hover:bg-slate-100'
                            }`}
                            title={isSaved ? "Saved to Wishlist" : "Bookmark this Outing"}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 text-amber-700' : 'text-slate-600'}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Form */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#000] space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6B6B]" /> Plan Your Outing
              </h3>

              <div>
                <div className="flex justify-between items-center text-xs font-black text-slate-800 mb-1">
                  <span>How much time?</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-900 rounded-md text-[#FF6B6B]">{hours} Hours</span>
                </div>
                <input type="range" min="1" max="8" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full accent-slate-900" />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-black text-slate-800 mb-1">
                  <span>Pocket Budget</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-900 rounded-md text-[#4D96FF]">₹{budget}</span>
                </div>
                <input type="range" min="100" max="1500" step="50" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full accent-slate-900" />
              </div>

              <div>
                <label className="text-xs font-black text-slate-800 block mb-1">Start Location</label>
                <input 
                  type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border-2 border-slate-900 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-800 block mb-1.5">Where are you into today?</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Food', 'Cafes', 'Heritage', 'Adventure', 'Nature', 'Budget'].map(tag => (
                    <button
                      key={tag} type="button" onClick={() => toggleInterest(tag)}
                      className={`text-xs font-black px-3 py-1.5 rounded-xl border-2 border-slate-900 transition ${
                        selectedInterests.includes(tag) ? 'bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#000]' : 'bg-white text-slate-700'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-800 block mb-1.5">Outing Preference</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button" onClick={() => setMode('solo')}
                    className={`py-2 text-xs font-black rounded-xl border-2 border-slate-900 transition ${
                      mode === 'solo' ? 'bg-[#4D96FF] text-white shadow-[2px_2px_0px_#000]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Go Solo
                  </button>
                  <button
                    type="button" onClick={() => setMode('match')}
                    className={`py-2 text-xs font-black rounded-xl border-2 border-slate-900 transition ${
                      mode === 'match' ? 'bg-[#6BCB77] text-white shadow-[2px_2px_0px_#000]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Find a Match
                  </button>
                </div>
              </div>

              <button
                disabled={loading} onClick={handleGeneratePlan}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_#FF6B6B] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? "Calculating Custom Itinerary..." : "Create My Plan"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== OUTING TAB ==================== */}
        {activeTab === 'outing' && (
          <div className="space-y-4">
            {plan ? (
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#000]">
                <div className="flex justify-between items-start border-b-2 border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-100 border border-slate-900 rounded-md">
                      {mode === 'solo' ? 'Solo Itinerary' : 'Matched Itinerary'}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">{plan.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Estimated</p>
                    <p className="text-base font-black text-[#4D96FF]">₹{plan.total_cost}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                  {plan.timeline.map((stop, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-1">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center shrink-0 z-10">
                        {idx + 1}
                      </div>
                      <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-3 flex-1 shadow-[2px_2px_0px_#000]">
                        <div className="flex justify-between text-[11px] font-bold text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {stop.time}</span>
                          <span className="text-emerald-700">~₹{stop.est_cost}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 mt-1">{stop.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{stop.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {mode === 'match' && plan.potential_peers && (
                  <div className="mt-6 pt-5 border-t-2 border-dashed border-slate-200">
                    <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5 mb-3">
                      <Users className="w-4 h-4 text-[#FF6B6B]" /> Compatible Peers ({plan.match_score}%)
                    </span>
                    <div className="space-y-2">
                      {plan.potential_peers.map((peer) => {
                        const isInvited = invitedPeers.includes(peer.id) || collabRequests.some(c => c.receiver_id === peer.id);
                        return (
                          <div key={peer.id} className="flex items-center justify-between p-3 bg-amber-50 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#000]">
                            <div 
                              onClick={() => setInspectingPeer(peer)} 
                              className="cursor-pointer hover:opacity-80 transition flex items-center gap-2.5"
                            >
                              <div className="w-9 h-9 rounded-xl border border-slate-900 bg-amber-200 overflow-hidden flex items-center justify-center shrink-0">
                                {peer.avatar_url ? (
                                  <img src={peer.avatar_url} alt={peer.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[11px] font-black">{peer.name?.slice(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-900 underline decoration-slate-300">{peer.name}</p>
                                <p className="text-[10px] text-slate-600 font-bold">{peer.college} • {peer.collabs || 0} Collabs</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleSendInvite(peer)}
                              className={`px-3 py-1.5 text-xs font-black rounded-lg border-2 border-slate-900 transition ${
                                isInvited ? 'bg-emerald-500 text-white' : 'bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#000]'
                              }`}
                            >
                              {isInvited ? "Invited ✓" : "Invite"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t-2 border-slate-100">
                  <button
                    disabled={saving} onClick={handleConfirmAndSave}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2"
                  >
                    {saving ? "Saving to Database..." : `Confirm & Lock Plan`}
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
                <Navigation className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-black text-slate-900 uppercase">No Active Outing</h4>
                <button onClick={() => setActiveTab('home')} className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl border border-slate-900">
                  Start Plan
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== CHAT TAB ==================== */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            {activeChatCollab ? (
              <div className="flex flex-col h-[70vh] bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden">
                
                {/* Header with Back Button */}
                <div className="p-3 bg-amber-100 border-b-2 border-slate-900 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => setActiveChatCollab(null)}
                      className="p-1.5 bg-white hover:bg-slate-100 rounded-lg border border-slate-900 shadow-[1px_1px_0px_#000] transition active:translate-y-0.5"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-900" />
                    </button>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">
                        {activeChatCollab.sender_id === userProfile.id 
                          ? activeChatCollab.receiver_name 
                          : activeChatCollab.sender_name}
                      </h4>
                      <p className="text-[9px] text-slate-600 font-bold">
                        Meeting: {location.includes("Gate") ? "Campus Tapri Point" : "Midway Spot"} • Split: ₹{Math.round((plan?.total_cost || 300) / 2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="text-[10px] font-black bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded-lg border border-slate-900 shadow-[1px_1px_0px_#000] transition active:translate-y-0.5"
                    >
                      Finish & Rate ✓
                    </button>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#FDFBF7]">
                  {messages.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs font-bold">
                      Coordination chat open! Say hello and decide meetup time.
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender_id === userProfile.id;
                      return (
                        <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <span className="text-[9px] font-bold text-slate-500 mb-0.5">{m.sender_name}</span>
                          <div className={`p-2.5 rounded-xl max-w-[75%] text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#000] ${
                            isMe ? 'bg-[#4D96FF] text-white' : 'bg-white text-slate-900'
                          }`}>
                            {m.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-2 bg-white border-t-2 border-slate-900 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type meetup details..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-semibold bg-slate-50 border-2 border-slate-900 rounded-xl focus:bg-white focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="p-2.5 bg-slate-900 text-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#FF6B6B]"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            ) : (
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#000] space-y-4">
                <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#4D96FF]" /> Active Conversations
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500">Pick a peer to coordinate your outing</p>
                  </div>
                  <span className="text-xs font-black bg-blue-100 border border-slate-900 px-2 py-0.5 rounded-md">
                    {collabRequests.filter(c => c.status === 'accepted').length} Active
                  </span>
                </div>

                {collabRequests.filter(c => c.status === 'accepted').length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-500">No accepted chats yet.</p>
                    <p className="text-[11px] text-slate-400">Accept an invite on the Home tab or send an outing request to start chatting!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {collabRequests
                      .filter(c => c.status === 'accepted')
                      .map((collab) => {
                        const peerName = collab.sender_id === userProfile.id 
                          ? collab.receiver_name 
                          : collab.sender_name;
                        return (
                          <div 
                            key={collab.id}
                            onClick={() => setActiveChatCollab(collab)}
                            className="p-3 bg-slate-50 hover:bg-amber-50 border-2 border-slate-900 rounded-xl flex items-center justify-between shadow-[2px_2px_0px_#000] cursor-pointer transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl border border-slate-900 bg-amber-200 flex items-center justify-center font-black text-xs">
                                {peerName.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-slate-900">{peerName}</h4>
                                <p className="text-[10px] font-bold text-slate-500">Collab #{collab.id} • Match: {collab.match_percentage}%</p>
                              </div>
                            </div>
                            <span className="text-xs font-black bg-emerald-400 text-white px-2.5 py-1 rounded-lg border border-slate-900 shadow-[1px_1px_0px_#000]">
                              Open Chat →
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== PROFILE TAB ==================== */}
        {activeTab === 'profile' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#000] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl border-2 border-slate-900 bg-amber-200 overflow-hidden flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_#000] shrink-0">
                  {userProfile.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt={userProfile.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span>{userProfile.name?.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{userProfile.name}</h3>
                  <p className="text-xs font-bold text-slate-500">{userProfile.college} • {userProfile.branch || "Student"}</p>
                  <div className="flex items-center gap-1 text-[11px] font-black text-amber-600 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{userProfile.rating} Compatibility Rating</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setProfileForm(userProfile); setIsEditingProfile(true); }}
                className="p-2 border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl shadow-[2px_2px_0px_#000] transition active:translate-y-0.5"
              >
                <Edit3 className="w-4 h-4 text-slate-800" />
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-700 italic">"{userProfile.bio || 'Up for campus outings and coffee!'}"</p>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#000]">
                <p className="text-xl font-black text-slate-900">{savedOutings.filter(o => o.created_by === userProfile.name).length}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">My Created Plans</p>
              </div>
              <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#000]">
                <p className="text-xl font-black text-[#6BCB77]">{userProfile.collabs_completed}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Collabs Completed</p>
              </div>
            </div>

            {/* Campus Friends & Incoming Requests */}
            <div className="pt-2 border-t-2 border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#4D96FF]" /> Campus Friends (
                  {friendsList.filter(f => f.status === 'accepted').length})
                </span>
              </div>

              {friendsList.filter(f => f.status === 'pending' && f.receiver_id === userProfile.id).length > 0 && (
                <div className="p-3 bg-blue-50 border-2 border-slate-900 rounded-xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">Friend Invites</span>
                  {friendsList
                    .filter(f => f.status === 'pending' && f.receiver_id === userProfile.id)
                    .map(req => (
                      <div key={req.id} className="flex justify-between items-center bg-white p-2 border border-slate-900 rounded-lg">
                        <span className="text-xs font-black">{req.requester_name}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleRespondFriend(req.id, 'accepted')}
                            className="px-2 py-1 text-[10px] font-black bg-emerald-500 text-white rounded border border-slate-900"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRespondFriend(req.id, 'rejected')}
                            className="px-2 py-1 text-[10px] font-black bg-slate-200 text-slate-700 rounded border border-slate-900"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <div className="space-y-1.5">
                {friendsList.filter(f => f.status === 'accepted').length === 0 ? (
                  <p className="text-[11px] font-medium text-slate-400 italic">No campus friends added yet. Inspect peers on the Outings tab to connect!</p>
                ) : (
                  friendsList
                    .filter(f => f.status === 'accepted')
                    .map(item => {
                      const friendName = item.requester_id === userProfile.id ? item.receiver_name : item.requester_name;
                      return (
                        <div key={item.id} className="p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl flex items-center justify-between shadow-[2px_2px_0px_#000]">
                          <span className="text-xs font-black text-slate-900">{friendName}</span>
                          <button
                            onClick={() => {
                              setActiveTab('home');
                              alert(`Ready! Choose hours and budget to plan an outing with ${friendName}`);
                            }}
                            className="text-[10px] font-black bg-amber-200 hover:bg-amber-300 px-2 py-1 rounded-lg border border-slate-900 shadow-[1px_1px_0px_#000]"
                          >
                            Plan Outing ↗
                          </button>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* Bookmarked Wishlist / Saved Outings */}
            <div className="pt-2 border-t-2 border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-amber-500 fill-amber-300" /> Saved Wishlist ({savedWishlistOutings.length})
                </span>
              </div>

              {savedWishlistOutings.length === 0 ? (
                <p className="text-[11px] font-medium text-slate-400 italic">No saved outings yet. Tap the bookmark icon on any card in the Home feed!</p>
              ) : (
                <div className="space-y-2">
                  {savedWishlistOutings.map(item => (
                    <div key={item.id} className="p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl flex items-center justify-between shadow-[2px_2px_0px_#000]">
                      <div>
                        <p className="text-xs font-black text-slate-900">{item.title}</p>
                        <p className="text-[10px] font-bold text-slate-500">Host: {item.created_by} • ₹{item.total_expense}</p>
                      </div>
                      <button
                        onClick={() => handleToggleBookmark(item.id)}
                        className="text-[10px] font-black bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded border border-slate-900"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Action */}
            <div className="pt-3 border-t-2 border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-wider rounded-xl border border-rose-300 transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout Account
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Inspecting Peer Modal */}
      {inspectingPeer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 max-w-sm w-full shadow-[6px_6px_0px_#000] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b-2 border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-slate-900">
                Campus Peer Verified
              </span>
              <button onClick={() => setInspectingPeer(null)}>
                <X className="w-5 h-5 text-slate-500 hover:text-slate-800" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl border-2 border-slate-900 bg-amber-200 overflow-hidden flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_#000] shrink-0">
                {inspectingPeer.avatar_url ? (
                  <img src={inspectingPeer.avatar_url} alt={inspectingPeer.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{inspectingPeer.name?.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">{inspectingPeer.name}</h3>
                <p className="text-xs font-bold text-slate-500">{inspectingPeer.college || "Campus Member"}</p>
                <div className="flex items-center gap-1 text-[11px] font-black text-amber-600 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{inspectingPeer.rating || 5.0} • {inspectingPeer.collabs || inspectingPeer.collabs_completed || 0} Collabs</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-semibold text-slate-700 italic">
              "{inspectingPeer.bio || 'Up for campus food walks and discovering budget cafes!'}"
            </div>

            <div>
              <span className="text-[11px] font-black text-slate-800 uppercase block mb-1.5">Shared Interests</span>
              <div className="flex flex-wrap gap-1.5">
                {(inspectingPeer.interests || ["Food", "Cafes"]).map((tag) => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-rose-50 border border-slate-900 text-rose-700 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-black text-slate-800 uppercase block mb-1.5">Peer Endorsements</span>
              <div className="flex gap-1.5">
                {["Punctual", "Cooperative", "5/5 Splitter"].map((badge) => (
                  <span key={badge} className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-md">
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>

            {inspectingPeer.id !== userProfile.id && (
              <button
                onClick={() => handleSendFriendRequest(inspectingPeer)}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition"
              >
                + Connect as Campus Friend
              </button>
            )}

            <button
              onClick={() => setInspectingPeer(null)}
              className="w-full py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_#000]"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 max-w-sm w-full shadow-[6px_6px_0px_#000] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase">Edit Profile & Photo</h3>
              <button onClick={() => setIsEditingProfile(false)}>
                <X className="w-5 h-5 text-slate-500 hover:text-slate-800" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1.5">Profile Photo</label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border-2 border-dashed border-slate-900 rounded-xl">
                  <div className="w-14 h-14 rounded-xl border-2 border-slate-900 bg-amber-100 overflow-hidden flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    {profileForm.avatar_url ? (
                      <img src={profileForm.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-black text-slate-700">
                        {profileForm.name?.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="inline-flex items-center justify-center px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 rounded-lg text-xs font-black shadow-[2px_2px_0px_#000] cursor-pointer active:translate-y-0.5 transition">
                      Upload from Gallery
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <p className="text-[9px] font-bold text-slate-500">Auto-compressed for fast load</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-0.5">Full Name</label>
                <input 
                  type="text" required 
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full px-3 py-1.5 text-xs font-semibold border-2 border-slate-900 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-0.5">College</label>
                <input 
                  type="text" required 
                  value={profileForm.college}
                  onChange={(e) => setProfileForm({...profileForm, college: e.target.value})}
                  className="w-full px-3 py-1.5 text-xs font-semibold border-2 border-slate-900 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-0.5">Branch & Batch</label>
                <input 
                  type="text" 
                  placeholder="e.g. CSE '28, ECE '27"
                  value={profileForm.branch || ""}
                  onChange={(e) => setProfileForm({...profileForm, branch: e.target.value})}
                  className="w-full px-3 py-1.5 text-xs font-semibold border-2 border-slate-900 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-0.5">Short Bio</label>
                <textarea 
                  rows={2}
                  placeholder="Tell peers what kind of outings you like..."
                  value={profileForm.bio || ""}
                  onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  className="w-full px-3 py-1.5 text-xs font-semibold border-2 border-slate-900 rounded-xl focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_#6BCB77] active:translate-y-0.5 transition"
              >
                Save Profile to Neon DB
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 max-w-sm w-full shadow-[6px_6px_0px_#000] space-y-4">
            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase">Rate Your Collab Peer</h3>
              <button onClick={() => setShowReviewModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1">Score Outing Experience (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingScore(star)}
                      className={`p-2 rounded-xl border-2 border-slate-900 transition ${
                        ratingScore >= star ? 'bg-amber-300 shadow-[2px_2px_0px_#000]' : 'bg-slate-50'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${ratingScore >= star ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1">Peer Behaviour Indicators</label>
                <div className="flex flex-wrap gap-1.5">
                  {["Punctual", "Friendly", "Cooperative", "Split Fairly", "Great Host"].map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setSelectedReviewTags(prev => 
                        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                      )}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-900 ${
                        selectedReviewTags.includes(tag) ? 'bg-[#FF6B6B] text-white' : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-0.5">Quick Experience Note</label>
                <input 
                  type="text" 
                  placeholder="e.g. Arrived on time, great cafe chat!" 
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold border-2 border-slate-900 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_#6BCB77]"
              >
                Submit Review & Complete Collab
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 max-w-md w-full bg-white border-t-2 border-slate-900 py-2.5 px-6 z-40 flex justify-between items-center shadow-[0px_-2px_0px_#000]">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-0.5 text-[11px] font-black ${activeTab === 'home' ? 'text-[#FF6B6B]' : 'text-slate-500'}`}>
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button onClick={() => setActiveTab('outing')} className={`flex flex-col items-center gap-0.5 text-[11px] font-black ${activeTab === 'outing' ? 'text-[#FF6B6B]' : 'text-slate-500'}`}>
          <Compass className="w-5 h-5" />
          <span>Outing</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-0.5 text-[11px] font-black ${activeTab === 'chat' ? 'text-[#FF6B6B]' : 'text-slate-500'}`}>
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-0.5 text-[11px] font-black ${activeTab === 'profile' ? 'text-[#FF6B6B]' : 'text-slate-500'}`}>
          <UserIcon className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>

    </div>
  );
}