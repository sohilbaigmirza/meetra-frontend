import React, { useState, useEffect } from 'react';
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
  MapPin,
  Clock,
  IndianRupee,
  Navigation,
  Check
} from 'lucide-react';

const API_BASE = "https://meetra-backend-vjuy.onrender.com/api/v1";

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  // Plan generator form states
  const [hours, setHours] = useState(3);
  const [budget, setBudget] = useState(250);
  const [location, setLocation] = useState('College Main Gate');
  const [selectedInterests, setSelectedInterests] = useState(['Food', 'Cafes']);
  const [outingType, setOutingType] = useState('Casual Hangout');
  const [mode, setMode] = useState('match');
  
  // App state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState(null);
  const [invitedPeers, setInvitedPeers] = useState([]);
  
  // Real database outings
  const [savedOutings, setSavedOutings] = useState([]);

  // Fetch all saved outings from Neon DB via FastAPI on load
  const fetchOutings = async () => {
    try {
      const res = await fetch(`${API_BASE}/outings`);
      if (res.ok) {
        const data = await res.json();
        setSavedOutings(data);
      }
    } catch (err) {
      console.error("Failed to fetch outings from DB:", err);
    }
  };

  useEffect(() => {
    fetchOutings();
  }, []);

  const toggleInterest = (tag) => {
    setSelectedInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // 1. Generate Itinerary (Calculation)
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

  // 2. Persist to PostgreSQL Database via FastAPI
  const handleConfirmAndSave = async () => {
    if (!plan) return;
    setSaving(true);
    try {
      const payload = {
        title: plan.title,
        category: outingType,
        distance: "3.5 km",
        travel_mode: "E-Rickshaw / Walk",
        event_time: `${plan.est_duration} window`,
        total_expense: plan.total_cost,
        expense_breakdown: {
          transit: 40,
          activities_and_food: plan.total_cost - 40
        },
        tags: selectedInterests,
        max_seats: 4,
        is_solo: mode === 'solo',
        created_by: "Sohil Mirza"
      };

      const res = await fetch(`${API_BASE}/outings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchOutings(); // Refresh DB list
        alert("Plan locked and saved to database!");
        setActiveTab('home');
      }
    } catch (err) {
      console.error("Failed to save to database:", err);
      alert("Error saving to database.");
    } finally {
      setSaving(false);
    }
  };

  const toggleInvite = (id) => {
    setInvitedPeers(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col justify-between max-w-md mx-auto border-x-2 border-slate-900 shadow-2xl relative">
      
      {/* Top Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-slate-900 z-30 px-5 py-3.5 flex justify-between items-center shadow-[0px_2px_0px_#000]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-slate-900">MeetRa</span>
            <span className="text-[10px] bg-[#FF6B6B] text-white px-2 py-0.5 rounded-full font-bold tracking-wide">
              GEN-Z
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-bold">College Outings & Compatibility</p>
        </div>

        <div className="flex items-center gap-1 bg-amber-100 border-2 border-slate-900 px-2.5 py-1 rounded-xl text-[11px] font-black shadow-[2px_2px_0px_#000]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified</span>
        </div>
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
              <h2 className="text-2xl font-black text-slate-900 mt-2">Hey, ready to explore?</h2>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                Zero awkward plans. Input your free hours and pocket cash to build a custom outing.
              </p>
            </div>

            {/* Saved Outings From Neon Database */}
            {savedOutings.length > 0 && (
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Locked Database Plans ({savedOutings.length})
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 border border-slate-900 rounded-md">Neon DB</span>
                </div>
                <div className="space-y-2">
                  {savedOutings.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl flex justify-between items-center shadow-[2px_2px_0px_#000]">
                      <div>
                        <p className="text-xs font-black text-slate-900">{item.title}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{item.category} • By {item.created_by}</p>
                      </div>
                      <span className="text-xs font-black text-[#4D96FF] bg-white border border-slate-900 px-2 py-1 rounded-lg">
                        ₹{item.total_expense}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plan Generator Form Card */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#000] space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6B6B]" /> Plan Your Outing
              </h3>

              {/* Free Time */}
              <div>
                <div className="flex justify-between items-center text-xs font-black text-slate-800 mb-1">
                  <span>How much time?</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-900 rounded-md text-[#FF6B6B]">
                    {hours} Hours
                  </span>
                </div>
                <input 
                  type="range" min="1" max="8" value={hours} 
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full accent-slate-900"
                />
              </div>

              {/* Budget */}
              <div>
                <div className="flex justify-between items-center text-xs font-black text-slate-800 mb-1">
                  <span>Pocket Budget</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-900 rounded-md text-[#4D96FF]">
                    ₹{budget}
                  </span>
                </div>
                <input 
                  type="range" min="100" max="1500" step="50" value={budget} 
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full accent-slate-900"
                />
              </div>

              {/* Start Point */}
              <div>
                <label className="text-xs font-black text-slate-800 block mb-1">Start Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border-2 border-slate-900 rounded-xl focus:bg-white focus:outline-none"
                  placeholder="e.g. Hostels, Campus Gate"
                />
              </div>

              {/* Interests Multi-select */}
              <div>
                <label className="text-xs font-black text-slate-800 block mb-1.5">Where are you into today?</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Food', 'Cafes', 'Hidden Places', 'Adventure', 'Photography', 'Budget'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`text-xs font-black px-3 py-1.5 rounded-xl border-2 border-slate-900 transition ${
                        selectedInterests.includes(tag) 
                          ? 'bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#000]' 
                          : 'bg-white text-slate-700'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format: Solo vs Match */}
              <div>
                <label className="text-xs font-black text-slate-800 block mb-1.5">Outing Preference</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('solo')}
                    className={`py-2 text-xs font-black rounded-xl border-2 border-slate-900 transition ${
                      mode === 'solo' 
                        ? 'bg-[#4D96FF] text-white shadow-[2px_2px_0px_#000]' 
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Go Solo
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('match')}
                    className={`py-2 text-xs font-black rounded-xl border-2 border-slate-900 transition ${
                      mode === 'match' 
                        ? 'bg-[#6BCB77] text-white shadow-[2px_2px_0px_#000]' 
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Find a Match
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                disabled={loading}
                onClick={handleGeneratePlan}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_#FF6B6B] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? "Calculating Itinerary..." : "Create My Plan"}
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
                
                {/* Header Info */}
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

                {/* Timeline Stops */}
                <div className="mt-5 space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                  {plan.timeline.map((stop, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-1">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center shrink-0 z-10">
                        {idx + 1}
                      </div>
                      <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-3 flex-1 shadow-[2px_2px_0px_#000]">
                        <div className="flex justify-between text-[11px] font-bold text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {stop.time}
                          </span>
                          <span className="text-emerald-700">~₹{stop.est_cost}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 mt-1">{stop.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{stop.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Match Results */}
                {mode === 'match' && plan.potential_peers && (
                  <div className="mt-6 pt-5 border-t-2 border-dashed border-slate-200">
                    <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5 mb-3">
                      <Users className="w-4 h-4 text-[#FF6B6B]" /> Compatible Peers ({plan.match_score}%)
                    </span>

                    <div className="space-y-2">
                      {plan.potential_peers.map((peer) => {
                        const isInvited = invitedPeers.includes(peer.id);
                        return (
                          <div key={peer.id} className="flex items-center justify-between p-3 bg-amber-50 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#000]">
                            <div>
                              <p className="text-xs font-black text-slate-900">{peer.name}</p>
                              <p className="text-[10px] text-slate-600 font-bold">{peer.college} • {peer.collabs} Collabs</p>
                              <div className="flex gap-1 mt-1">
                                {peer.interests.map(t => (
                                  <span key={t} className="text-[9px] font-bold px-1.5 bg-white border border-slate-900 rounded">
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button 
                              onClick={() => toggleInvite(peer.id)}
                              className={`px-3 py-1.5 text-xs font-black rounded-lg border-2 border-slate-900 transition ${
                                isInvited 
                                  ? 'bg-emerald-500 text-white shadow-none' 
                                  : 'bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#000] active:translate-y-0.5'
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

                {/* Confirm & Save to Neon DB Button */}
                <div className="mt-6 pt-4 border-t-2 border-slate-100">
                  <button
                    disabled={saving}
                    onClick={handleConfirmAndSave}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2"
                  >
                    {saving ? "Saving to Database..." : "Confirm & Lock Plan"}
                    <Check className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-16 bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
                <Navigation className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-black text-slate-900 uppercase">No Active Outing</h4>
                <p className="text-xs text-slate-500 mt-1 font-semibold">Generate a fresh itinerary from the Home tab.</p>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl border border-slate-900"
                >
                  Start Plan
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== CHAT TAB ==================== */}
        {activeTab === 'chat' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_#000] text-center py-16 space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-black text-slate-900">Coordination Chats</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
              Real-time chats activate automatically once both students confirm and accept an outing invitation.
            </p>
          </div>
        )}

        {/* ==================== PROFILE TAB ==================== */}
        {activeTab === 'profile' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#000] space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-100">
              <div className="w-14 h-14 rounded-2xl border-2 border-slate-900 bg-amber-200 flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_#000]">
                SM
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Sohil Mirza</h3>
                <p className="text-xs font-bold text-slate-500">Student • 1st Year</p>
                <div className="flex items-center gap-1 text-[11px] font-black text-amber-600 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>4.9 Compatibility Rating</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-[11px] font-bold text-rose-900">
              📌 Profile purpose: Exclusively for <strong>outing collaboration compatibility</strong>, punctuality, and mutual hobby matching (Not for dating).
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#000]">
                <p className="text-xl font-black text-slate-900">{savedOutings.length}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Created Plans</p>
              </div>
              <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#000]">
                <p className="text-xl font-black text-[#6BCB77]">14</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Collabs Made</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-black text-slate-800 uppercase block mb-1.5">Preferred Outing Types</span>
              <div className="flex flex-wrap gap-1.5">
                {['Budget Cafes', 'Heritage Walk', 'Street Food Crawl', 'Study & Chai'].map(item => (
                  <span key={item} className="px-2.5 py-1 bg-slate-100 border border-slate-900 text-slate-800 text-[11px] font-bold rounded-lg">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 max-w-md w-full bg-white border-t-2 border-slate-900 py-2.5 px-6 z-40 flex justify-between items-center shadow-[0px_-2px_0px_#000]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-black transition ${
            activeTab === 'home' ? 'text-[#FF6B6B]' : 'text-slate-500'
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('outing')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-black transition ${
            activeTab === 'outing' ? 'text-[#FF6B6B]' : 'text-slate-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Outing</span>
        </button>

        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-black transition ${
            activeTab === 'chat' ? 'text-[#FF6B6B]' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-black transition ${
            activeTab === 'profile' ? 'text-[#FF6B6B]' : 'text-slate-500'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>

    </div>
  );
}