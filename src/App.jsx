import React, { useState, useEffect, useRef } from 'react';
import { auth, googleProvider, signInWithPopup } from './firebase';
import RouteMap from './components/RouteMap';
import { THEME } from './components/design/AppStyles';
import { MeetraLogo, ScallopedBadge, FloatingNavBar } from './components/design/BrandComponents';
import { 
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

const API_BASE = "https://meetra-backend-vjuy.onrender.com/api/v1";

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // User Profile State
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('meetra_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authLoading, setAuthLoading] = useState(false);

  // Feed Filter & Wishlist States
  const [activeFeedTag, setActiveFeedTag] = useState('All');
  const [activeFeedBudget, setActiveFeedBudget] = useState('all');
  const [bookmarkedOutingIds, setBookmarkedOutingIds] = useState([]);
  const [savedWishlistOutings, setSavedWishlistOutings] = useState([]);

  // Milestone 3.1: Partner Cafes & Spot Pre-Bookings State
  const [partnerCafes, setPartnerCafes] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [selectedCafeForBooking, setSelectedCafeForBooking] = useState(null);
  const [bookingPartySize, setBookingPartySize] = useState(2);
  const [bookingTime, setBookingTime] = useState("6:00 PM");
  const [bookingDate, setBookingDate] = useState("Today");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBookingPass, setConfirmedBookingPass] = useState(null);

  // Profile Edit / Setup Form
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    age: 19,
    college: 'ITM University',
    course: 'B.Tech',
    branchName: 'CSE',
    year: '1st Year',
    bio: 'Up for quick cafe hangouts & street food trails!',
    avatar_url: null,
    interests: ['Food', 'Cafes'],
    preferred_outing_types: ['Budget Cafes', 'Heritage Walk'],
    budget_preference: 300
  });

  const COLLEGES = [
    "ITM University",
    "ITM Universe",
    "MITS Gwalior",
    "Amity University Gwalior",
    "IPS College",
    "Jiwaji University",
    "Other"
  ];

  const COURSES = [
    "B.Tech",
    "B.Pharma",
    "BCA",
    "MCA",
    "BBA",
    "MBA",
    "Agriculture",
    "Other"
  ];

  const BTECH_BRANCHES = [
    "CSE",
    "IT",
    "AIML",
    "DS",
    "IOT",
    "Cyber Security",
    "Mechanical",
    "Civil"
  ];

  const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgrad"];

  const [inspectingPeer, setInspectingPeer] = useState(null);
  const [friendsList, setFriendsList] = useState([]);

  // Generator form states
  const [hours, setHours] = useState(3);
  const [budget, setBudget] = useState(300);
  const [selectedInterests, setSelectedInterests] = useState(['Food', 'Cafes']);
  const [outingType, setOutingType] = useState('Casual Hangout');
  const [mode, setMode] = useState('match'); // 'solo' | 'match' | 'group'

  // Dynamic Start Location & Coordinates State
  const [location, setLocation] = useState('MITS Main Gate');
  const [startCoords, setStartCoords] = useState([26.2183, 78.1828]);
  const [locating, setLocating] = useState(false);

  const CAMPUS_HUBS = [
    { name: "MITS Main Gate", coords: [26.2183, 78.1828] },
    { name: "ITM Gate 1", coords: [26.1415, 78.2045] },
    { name: "University Rd", coords: [26.2085, 78.1895] },
    { name: "City Center", coords: [26.2045, 78.1945] },
  ];

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setStartCoords(coords);
        setLocation("Current GPS Location");
        setLocating(false);
      },
      (err) => {
        console.error("GPS error:", err);
        alert("Could not fetch GPS. Please allow location permissions in your browser.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };
  
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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      auth.signOut();
      localStorage.removeItem('meetra_user');
      setUserProfile(null);
      setActiveTab('home');
    }
  };

  // ---------------- DATA FETCHING ---------------- //
  const fetchPartners = async () => {
    try {
      const res = await fetch(`${API_BASE}/partners`);
      if (res.ok) {
        const data = await res.json();
        setPartnerCafes(data);
      }
    } catch (err) {
      console.error("Partner cafes fetch error:", err);
    }
  };

  const fetchUserBookings = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/partners/bookings/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserBookings(data);
      }
    } catch (err) {
      console.error("Bookings fetch error:", err);
    }
  };

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

  const fetchMessages = async (peerIdOrOutingId, isGroup = false) => {
    if (!userProfile?.id || !peerIdOrOutingId) return;
    try {
      const url = isGroup 
        ? `${API_BASE}/chat/group/${peerIdOrOutingId}`
        : `${API_BASE}/chat/thread/${userProfile.id}/${peerIdOrOutingId}`;
      const res = await fetch(url);
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
    fetchPartners();
    if (userProfile?.id) {
      fetchCollabs(userProfile.id);
      fetchFriends(userProfile.id);
      fetchBookmarks(userProfile.id);
      fetchUserBookings(userProfile.id);
    }
  }, [userProfile?.id, activeFeedTag, activeFeedBudget]);

  useEffect(() => {
    if (activeChatCollab && activeTab === 'chat') {
      const isGroup = !!activeChatCollab.isGroup;
      const targetId = isGroup 
        ? activeChatCollab.id 
        : (activeChatCollab.peerId || (activeChatCollab.sender_id === userProfile.id ? activeChatCollab.receiver_id : activeChatCollab.sender_id));

      fetchMessages(targetId, isGroup);
      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchMessages(targetId, isGroup);
        }
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeChatCollab, activeTab, userProfile?.id]);

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
    const formattedBranch = profileForm.course === 'B.Tech'
      ? `B.Tech ${profileForm.branchName} • ${profileForm.year}`
      : `${profileForm.course} • ${profileForm.year}`;

    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userProfile.id,
          name: profileForm.name,
          age: Number(profileForm.age || 19),
          college: profileForm.college,
          branch: formattedBranch,
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
        alert("Profile personalized and saved to database!");
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
        max_seats: mode === 'group' ? 4 : 2,
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

    if (mode !== 'group') {
      const existing = collabRequests.find(
        c => (c.sender_id === peer.id || c.receiver_id === peer.id) && c.status === 'accepted'
      );

      if (existing) {
        alert(`You are already connected with ${peer.name}! Opening chat.`);
        setActiveChatCollab(existing);
        setActiveTab('chat');
        return;
      }
    }

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
        alert(mode === 'group' ? `Added ${peer.name} to your squad!` : `Invite sent to ${peer.name}!`);
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

    const isGroup = !!activeChatCollab.isGroup;
    const targetPeerId = isGroup 
      ? null 
      : (activeChatCollab.peerId || (activeChatCollab.sender_id === userProfile.id ? activeChatCollab.receiver_id : activeChatCollab.sender_id));

    const optimisticMsg = {
      id: Date.now(),
      collab_id: activeChatCollab.id,
      sender_id: userProfile.id,
      receiver_id: targetPeerId,
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
          receiver_id: targetPeerId,
          sender_name: userProfile.name,
          text: textToSend
        })
      });

      if (!res.ok) {
        fetchMessages(isGroup ? activeChatCollab.id : targetPeerId, isGroup);
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

  // ---------------- PARTNER CAFE PRE-BOOKING HANDLER ---------------- //
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedCafeForBooking || !userProfile) return;

    setBookingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/partners/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userProfile.id,
          user_name: userProfile.name,
          user_phone_or_email: userProfile.phone_or_email,
          cafe_id: selectedCafeForBooking.id,
          cafe_name: selectedCafeForBooking.name,
          party_size: Number(bookingPartySize),
          booking_time: bookingTime,
          booking_date: bookingDate
        })
      });

      if (res.ok) {
        const booking = await res.json();
        setConfirmedBookingPass(booking);
        fetchUserBookings(userProfile.id);
      } else {
        alert("Could not complete booking. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setBookingLoading(false);
    }
  };

  // ---------------- RENDER CLEAN AUTH SCREEN IF NOT LOGGED IN ---------------- //
  if (!userProfile) {
    const handleGoogleSignIn = async () => {
      setAuthLoading(true);
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const res = await fetch(`${API_BASE}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebase_uid: user.uid,
            email: user.email,
            name: user.displayName || "Student",
            avatar_url: user.photoURL || null
          })
        });

        if (res.ok) {
          const data = await res.json();
          const dbUser = data.user || data;
          setUserProfile(dbUser);
          localStorage.setItem('meetra_user', JSON.stringify(dbUser));
          
          setProfileForm({
            name: dbUser.name || user.displayName || '',
            age: dbUser.age || 19,
            college: dbUser.college && dbUser.college !== "Campus Member" ? dbUser.college : 'ITM University',
            course: 'B.Tech',
            branchName: 'CSE',
            year: '1st Year',
            bio: dbUser.bio || 'Up for quick cafe hangouts & street food trails!',
            avatar_url: dbUser.avatar_url || user.photoURL || null,
            interests: dbUser.interests || ['Food', 'Cafes']
          });

          if (data.is_new_user || !dbUser.college || dbUser.college === "Campus Member") {
            setIsEditingProfile(true);
          }
        } else {
          alert("Could not sync account with database. Please try again.");
        }
      } catch (err) {
        console.error("Google Auth error:", err);
        alert("Google Sign-In was cancelled or failed.");
      } finally {
        setAuthLoading(false);
      }
    };

    return (
      <div className={THEME.classes.screenContainer + " justify-between px-6 py-12"}>
        {/* Ambient Soft Pastel Blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E2EDFB] rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-10 left-0 w-64 h-64 bg-[#FDEEE9] rounded-full blur-3xl pointer-events-none -ml-16" />

        {/* Brand Splash Top (Screen 1) */}
        <div className="relative z-10 flex flex-col items-center text-center mt-6 space-y-3">
          <div className="w-24 h-24 bg-white rounded-3xl p-3 shadow-[0_12px_32px_rgba(34,66,125,0.08)] flex items-center justify-center">
            <MeetraLogo className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-black text-[#22427D] tracking-tight">MeetRa</h1>
          <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
            Find travelers whose plans already overlap with yours.
          </p>
        </div>

        {/* Welcome Aboard Card (Screen 3) */}
        <div className={THEME.classes.whiteCard + " relative z-10 p-6 space-y-4 my-auto text-left"}>
          <div>
            <h2 className="text-xl font-black text-slate-900">Welcome aboard</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Connect your verified college account to discover overlapping outings.
            </p>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            className={THEME.classes.btnPrimary}
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

  // ---------------- MAIN APPLICATION (MATCHING SCREEN 4) ---------------- //
  return (
    <div className={THEME.classes.screenContainer}>
      
      {/* Top Header Pill Bar (Screen 4) */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-30 px-5 pt-3 pb-2 flex justify-between items-center border-b border-slate-100">
        <div className="flex-1 pr-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search destinations or campus spots"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#EEF4FD] rounded-full text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
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

            {/* Plan a Trip Hero Card (Screen 4) */}
            <div className={THEME.classes.heroCard}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Plan a trip</h3>
                  <p className="text-[11px] font-bold text-slate-400">We'll match you at 60%+ overlap</p>
                </div>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  className="p-2 bg-white rounded-xl text-[#22427D] shadow-sm text-[10px] font-black flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{locating ? "GPS..." : "Detect"}</span>
                </button>
              </div>

              <div className="space-y-2">
                {/* Destination Pill */}
                <div className={THEME.classes.pillInput}>
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
                  <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                </div>

                {/* Hub Shortcuts */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {CAMPUS_HUBS.map((hub) => (
                    <button
                      key={hub.name}
                      type="button"
                      onClick={() => {
                        setLocation(hub.name);
                        setStartCoords(hub.coords);
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition ${
                        location === hub.name ? 'bg-[#22427D] text-white shadow-sm' : 'bg-white text-slate-600'
                      }`}
                    >
                      {hub.name}
                    </button>
                  ))}
                </div>

                {/* Depart & Return / Time Pills */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-2xl p-2.5 shadow-sm flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Depart</p>
                      <p className="text-xs font-black text-slate-900">Today</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-2.5 shadow-sm flex items-center justify-between">
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

                {/* Budget Slider */}
                <div className="bg-white rounded-2xl p-3 shadow-sm space-y-1.5">
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

                {/* 3-Way Outing Preference Pills */}
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
                className={THEME.classes.btnPrimary}
              >
                <span>{loading ? "Matching Overlaps..." : "Find My Match"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Suggested Matches Section (Screen 4) */}
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

            {/* Partner Cafes & Discounts Carousel (Milestone 3.1) */}
            {partnerCafes.length > 0 && (
              <div className={THEME.classes.whiteCard + " space-y-3"}>
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

            {/* Active Collab Requests Alert */}
            {collabRequests.filter(r => r.status === 'pending').length > 0 && (
              <div className="bg-[#FDEEE9] rounded-3xl p-4 shadow-sm space-y-3 border border-rose-100 text-left">
                <span className="text-xs font-black uppercase tracking-wider text-[#E8615A] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Active Collab Requests
                </span>
                {collabRequests.filter(r => r.status === 'pending').map(req => (
                  <div key={req.id} className="p-3 bg-white rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-xs font-black text-slate-900">
                        {req.sender_id === userProfile.id ? `Invited: ${req.receiver_name}` : `From: ${req.sender_name}`}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">Match Score: {req.match_percentage}%</p>
                    </div>
                    <button 
                      onClick={() => handleRespondCollab(req.id, 'accepted')}
                      className="px-3 py-1.5 text-xs font-black bg-[#22427D] text-white rounded-xl shadow-sm"
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Outings Feed with Discovery Filters & Wishlist */}
            <div className={THEME.classes.whiteCard + " space-y-3"}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Community Feed ({savedOutings.length})
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 bg-blue-50 text-[#22427D] rounded-full">Active</span>
              </div>

              {/* Filter Bar */}
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

                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Max Budget:
                  </span>
                  <div className="flex gap-1.5">
                    {['all', '150', '300', '500'].map(b => (
                      <button
                        key={b}
                        onClick={() => setActiveFeedBudget(b)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black transition ${
                          activeFeedBudget === b ? 'bg-[#22427D] text-white' : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {b === 'all' ? 'Any' : `< ₹${b}`}
                      </button>
                    ))}
                  </div>
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
              <div className={THEME.classes.whiteCard + " space-y-4 text-left"}>
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-50 text-[#22427D] rounded-full">
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

                {/* OpenStreetMap Live Route & Transit Split */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-[#22427D]" /> Live Route & Transit Split
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-[#22427D] rounded-full">
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

                {/* Squad assembly in Group Mode */}
                {(mode === 'match' || mode === 'group') && plan.potential_peers && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#E8615A]" /> 
                      {mode === 'group' ? `Squad (${invitedPeers.length + 1}/4 Members)` : `Compatible Peers`}
                    </span>
                    <div className="space-y-2">
                      {plan.potential_peers.map((peer) => {
                        const isInvited = invitedPeers.includes(peer.id) || collabRequests.some(c => c.receiver_id === peer.id);
                        return (
                          <div key={peer.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl">
                            <div>
                              <p className="text-xs font-black text-slate-900">{peer.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold">{peer.college}</p>
                            </div>
                            <button 
                              onClick={() => handleSendInvite(peer)}
                              className={`px-3 py-1.5 text-xs font-black rounded-xl transition ${
                                isInvited ? 'bg-emerald-600 text-white' : 'bg-[#22427D] text-white shadow-sm'
                              }`}
                            >
                              {isInvited ? "Added ✓" : "+ Invite"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  disabled={saving} onClick={handleConfirmAndSave}
                  className={THEME.classes.btnPrimary}
                >
                  {saving ? "Saving to Database..." : "Lock & Confirm Outing"}
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className={THEME.classes.whiteCard + " text-center py-16 space-y-3"}>
                <Navigation className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-black text-slate-900">No Active Plan</h4>
                <button onClick={() => setActiveTab('home')} className={THEME.classes.btnSecondary}>
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
                    className="text-[10px] font-black bg-[#22427D] text-white px-2.5 py-1 rounded-full shadow-sm"
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

                <form onSubmit={handleSendMessage} className="p-2 bg-white border-t border-slate-100 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type meetup details..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 rounded-full focus:outline-none"
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
              <div className={THEME.classes.whiteCard + " space-y-4 text-left"}>
                <h3 className="text-sm font-black uppercase text-slate-900">Active Conversations</h3>
                <div className="space-y-2">
                  {collabRequests.filter(c => c.status === 'accepted').map((convo) => (
                    <div 
                      key={convo.id}
                      onClick={() => setActiveChatCollab(convo)}
                      className="p-3 bg-slate-50 hover:bg-blue-50 rounded-2xl flex items-center justify-between cursor-pointer transition"
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
          <div className={THEME.classes.whiteCard + " space-y-4 text-left"}>
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
                onClick={() => setIsEditingProfile(true)}
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

      {/* Floating Bottom Nav (Screen 4) */}
      <FloatingNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Booking Pass Modal */}
      {confirmedBookingPass && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full text-center space-y-4 shadow-xl">
            <h3 className="text-lg font-black text-slate-900">{confirmedBookingPass.cafe_name}</h3>
            <div className="p-4 bg-[#EEF4FD] rounded-2xl space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">PIN to show staff</p>
              <div className="text-3xl font-black text-[#22427D] tracking-widest">{confirmedBookingPass.pass_code}</div>
            </div>
            <button onClick={() => setConfirmedBookingPass(null)} className={THEME.classes.btnPrimary}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* Profile Customize Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-4 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 uppercase">Customize Profile</h3>
              <button onClick={() => setIsEditingProfile(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                <input 
                  type="text" required value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl"
                />
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
              <button type="submit" className={THEME.classes.btnPrimary}>Save Profile</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}