import React, { useState, useEffect, useRef } from 'react';
import { 
  Home as HomeIcon, 
  Compass, 
  MessageSquare, 
  User as UserIcon, 
  Sparkles, 
  Users, 
  ArrowRight, 
  Star, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  Navigation,
  Check,
  Edit3,
  X,
  Send
} from 'lucide-react';

const API_BASE = "https://meetra-backend-vjuy.onrender.com/api/v1";

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  // User Profile State
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('meetra_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      name: "Sumit",
      college: "MITS",
      branch: "CSE '28",
      bio: "Up for quick street food trails & weekend cafes.",
      interests: ["Food", "Cafes"],
      preferred_outing_types: ["Budget Cafes", "Heritage Walk"],
      budget_preference: 300,
      rating: 5.0,
      collabs_completed: 0
    };
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(userProfile);

  // Generator form states
  const [hours, setHours] = useState(3);
  const [budget, setBudget] = useState(userProfile.budget_preference || 300);
  const [location, setLocation] = useState('College Main Gate');
  const [selectedInterests, setSelectedInterests] = useState(userProfile.interests || ['Food', 'Cafes']);
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

  // Fetch Outings
  const fetchOutings = async () => {
    try {
      const res = await fetch(`${API_BASE}/outings`);
      if (res.ok) {
        const data = await res.json();
        setSavedOutings(data);
      }
    } catch (err) {
      console.error("DB Fetch Error:", err);
    }
  };

  // Fetch Collab Requests
  const fetchCollabs = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/collabs/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCollabRequests(data);
        // If an accepted collab exists, set it as active chat
        const accepted = data.find(c => c.status === 'accepted');
        if (accepted) {
          setActiveChatCollab(accepted);
        }
      }
    } catch (err) {
      console.error("Collabs fetch error:", err);
    }
  };

  // Fetch Chat Messages
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
    fetchOutings();
    if (userProfile?.id) {
      fetchCollabs(userProfile.id);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    if (activeChatCollab && activeTab === 'chat') {
      fetchMessages(activeChatCollab.id);
      const interval = setInterval(() => fetchMessages(activeChatCollab.id), 4000);
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

  // Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileForm.name,
          college: profileForm.college,
          branch: profileForm.branch,
          bio: profileForm.bio,
          interests: profileForm.interests,
          preferred_outing_types: profileForm.preferred_outing_types,
          budget_preference: Number(profileForm.budget_preference)
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setUserProfile(updated);
        localStorage.setItem('meetra_user', JSON.stringify(updated));
        setIsEditingProfile(false);
        fetchCollabs(updated.id);
        alert("Profile saved to database!");
      }
    } catch (err) {
      console.error("Profile save error:", err);
    }
  };

  // Generate Plan
  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/itinerary/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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

  // Lock & Save Outing
  const handleConfirmAndSave = async () => {
    if (!plan) return;
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

  // Send Collab Invite
  const handleSendInvite = async (peer) => {
    if (!userProfile?.id) {
      alert("Please save your profile first!");
      return;
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
        alert(`Invite sent to ${peer.name}!`);
      }
    } catch (err) {
      console.error("Invite error:", err);
    }
  };

  // Accept/Decline Collab
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

  // Send Chat Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChatCollab) return;

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collab_id: activeChatCollab.id,
          sender_id: userProfile.id,
          sender_name: userProfile.name,
          text: newMessageText.trim()
        })
      });

      if (res.ok) {
        setNewMessageText("");
        fetchMessages(activeChatCollab.id);
      }
    } catch (err) {
      console.error("Message send error:", err);
    }
  };

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

            {/* Outings Feed */}
            {savedOutings.length > 0 && (
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Community Outings Feed ({savedOutings.length})
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 border border-slate-900 rounded-md">Neon DB</span>
                </div>
                <div className="space-y-2">
                  {savedOutings.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl flex justify-between items-center shadow-[2px_2px_0px_#000]">
                      <div>
                        <p className="text-xs font-black text-slate-900">{item.title}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{item.category} • Host: {item.created_by}</p>
                      </div>
                      <span className="text-xs font-black text-[#4D96FF] bg-white border border-slate-900 px-2 py-1 rounded-lg">
                        ₹{item.total_expense}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                            <div>
                              <p className="text-xs font-black text-slate-900">{peer.name}</p>
                              <p className="text-[10px] text-slate-600 font-bold">{peer.college} • {peer.collabs} Collabs</p>
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
                    {saving ? "Saving to Database..." : `Confirm & Lock Plan (as ${userProfile.name})`}
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
                
                {/* Combined Itinerary Header */}
                <div className="p-3.5 bg-amber-100 border-b-2 border-slate-900 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-900">
                      Combined Itinerary
                    </span>
                    <h4 className="text-xs font-black text-slate-900 mt-1">
                      With {activeChatCollab.sender_id === userProfile.id ? activeChatCollab.receiver_name : activeChatCollab.sender_name}
                    </h4>
                    <p className="text-[10px] text-slate-600 font-bold">Split: ₹150 / student • Meeting: Tapri Point</p>
                  </div>
                  <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg border border-slate-900">
                    Active Collab
                  </span>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#FDFBF7]">
                  {messages.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs font-bold">
                      Coordination chat open! Say hello and pick your meeting time.
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
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#000] text-center py-16 space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-black text-slate-900">No Active Chat Yet</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
                  Coordination chat unlocks as soon as an invitation is accepted on the Home tab.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================== PROFILE TAB ==================== */}
        {activeTab === 'profile' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#000] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl border-2 border-slate-900 bg-amber-200 flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_#000]">
                  {userProfile.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{userProfile.name}</h3>
                  <p className="text-xs font-bold text-slate-500">{userProfile.college} • {userProfile.branch}</p>
                  <div className="flex items-center gap-1 text-[11px] font-black text-amber-600 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{userProfile.rating} Compatibility Rating</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setProfileForm(userProfile); setIsEditingProfile(true); }}
                className="p-2 border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl shadow-[2px_2px_0px_#000]"
              >
                <Edit3 className="w-4 h-4 text-slate-800" />
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-700 italic">"{userProfile.bio}"</p>

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
          </div>
        )}

      </main>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 max-w-sm w-full shadow-[6px_6px_0px_#000] space-y-4">
            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase">Edit Your Profile</h3>
              <button onClick={() => setIsEditingProfile(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-0.5">Full Name</label>
                <input 
                  type="text" required value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full px-3 py-1.5 text-xs font-semibold border-2 border-slate-900 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-0.5">College</label>
                <input 
                  type="text" required value={profileForm.college}
                  onChange={(e) => setProfileForm({...profileForm, college: e.target.value})}
                  className="w-full px-3 py-1.5 text-xs font-semibold border-2 border-slate-900 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_#6BCB77]"
              >
                Save Profile to Neon DB
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