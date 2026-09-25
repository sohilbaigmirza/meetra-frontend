import React, { useState, useEffect, useRef } from 'react';
import { auth, googleProvider, signInWithPopup } from './firebase';
import AppView from './components/design/AppView';
import { AppContext } from './context/AppContext';

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
  const [mode, setMode] = useState('match');

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

  // ---------------- AUTH LOGIC ---------------- //
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

  const appContextValue = {
    activeTab,
    setActiveTab,
    userProfile,
    setUserProfile,
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
    outingType,
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
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <AppView />
    </AppContext.Provider>
  );
}