import { useState, useEffect, useCallback, FormEvent } from "react";
import { 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Star, 
  ShoppingBag, 
  Clock, 
  X, 
  CheckCircle2, 
  Cpu, 
  Smartphone,
  Truck,
  Check,
  Plus,
  Minus,
  MessageCircle,
  Car
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
interface Bundle {
  id: string;
  name: string;
  quantity: number;
  price: number;
  originalPrice: number;
  badge?: string;
}

const bundles: Bundle[] = [
  { id: "1", name: "1x AutoScan Unit", quantity: 1, price: 28500, originalPrice: 45000 },
  { id: "2", name: "2 Units (Most Popular)", quantity: 2, price: 43500, originalPrice: 90000, badge: "SAVE ₦46,500" },
  { id: "3", name: "3 Units (Best Value)", quantity: 3, price: 54500, originalPrice: 135000, badge: "SAVE ₦80,500" },
];

export default function App() {
  const [page, setPage] = useState<'home' | 'product'>('home');
  const [selectedBundle, setSelectedBundle] = useState<Bundle>(bundles[1]);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "Lagos",
  });

  // --- Meta Pixel Tracking Mockups ---
  const trackEvent = useCallback((eventName: string, data?: object) => {
    console.log(`[Meta Pixel] Event: ${eventName}`, data);
  }, []);

  // --- Effects ---
  useEffect(() => {
    trackEvent('ViewContent');

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem("exit_popup_shown")) {
        setShowExitPopup(true);
        localStorage.setItem("exit_popup_shown", "true");
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [trackEvent]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Artificial delay for UX simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setOrderComplete(true);
    setIsSubmitting(false);

    const whatsappMessage = `AutoScan Pro Order:\n\n` +
      `Product: ${selectedBundle.name}\n` +
      `Total: ₦${selectedBundle.price.toLocaleString()}\n\n` +
      `Customer: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `State: ${formData.state}\n` +
      `Address: ${formData.address}`;
    window.open(`https://wa.me/2348039940408?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md bg-white p-12 rounded-[2.5rem] shadow-intense">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-display font-black mb-4">Order Received!</h1>
          <p className="text-slate-500 mb-8 font-medium">Thank you for choosing Easy Shop. We've redirected you to WhatsApp to finalize your delivery tracking details.</p>
          <button onClick={() => window.location.reload()} className="btn-primary w-full shadow-xl">Return Home</button>
        </motion.div>
      </div>
    );
  }

  const HomePage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white min-h-screen font-sans">
      {/* SECTION 1: White Background Logo Area */}
      <section className="bg-white py-12 px-8 border-b border-slate-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/10 scale-90">
              <Car className="w-7 h-7" />
            </div>
            <span className="text-3xl font-display font-black tracking-tighter text-slate-900 uppercase">Easy Shop</span>
          </div>
          <button onClick={() => setPage('product')} className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
            Our Products <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 2: Dark Background Hero */}
      <section className="bg-slate-900 py-32 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] -z-0" />
        <div className="max-w-6xl mx-auto relative z-10 text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="hook-text !text-blue-400">Mission: Empowering Nigerian Drivers</div>
            <h1 className="text-6xl md:text-9xl font-display font-black text-white mb-10 leading-[0.85] tracking-tighter">
              Tools for the <br /> <span className="italic text-blue-500 uppercase underline underline-offset-8 decoration-white/10">Smart Driver.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl mb-16">
              Our clinical-grade diagnostic tools put power back into your hands, saving you money and stopping mechanic overcharges across Nigeria.
            </p>
            <button onClick={() => setPage('product')} className="btn-primary">
              EXPLORE OUR TOOLS
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: Products Display (White BG) */}
      <section className="bg-white py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-32">
             <div className="hook-text">THE COLLECTION</div>
             <h2 className="text-5xl font-display font-black tracking-tight mb-16 text-slate-900">Our Products</h2>
             
             {/* Single Line Car Scanner Placeholder Display */}
             <div 
               className="flex flex-col md:flex-row items-center gap-12 p-12 bg-slate-50 border-4 border-white shadow-soft rounded-[3rem] group cursor-pointer transition-all hover:bg-slate-50/50" 
               onClick={() => setPage('product')}
             >
                <div className="w-full md:w-1/3 aspect-square bg-white rounded-[2.5rem] overflow-hidden relative flex items-center justify-center p-8 group-hover:bg-blue-50 transition-colors">
                   <img 
                     src="https://res.cloudinary.com/dmy2yiax9/image/upload/v1777581028/c74b6fce-72e5-4d66-9bcc-fbc25003e76a.png" 
                     alt="AutoScan Pro Device"
                     className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                     referrerPolicy="no-referrer"
                   />
                </div>
                <div className="flex-1 space-y-6">
                   <div className="flex items-center gap-3">
                      <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Available</span>
                      <span className="text-xs font-bold text-slate-400">Clinical Grade Tech</span>
                   </div>
                   <h3 className="text-4xl font-display font-black text-slate-900 italic">AutoScan Pro™</h3>
                   <p className="text-xl text-slate-500 font-medium leading-relaxed">
                      Optimized for West African fuel conditions. Read engine faults, clear check engine lights, and monitor fuel consumption in real-time.
                   </p>
                   <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest pt-4">
                      Shop scanner now <ChevronRight className="w-5 h-5" />
                   </div>
                </div>
             </div>
          </div>

          <div className="h-px bg-slate-100 mb-32" />

          {/* Harmonious Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
             {[
               { name: "Seyi V.", text: "I carried this thing to my mechanic just to test. His computer said one thing, my AutoScan showed the REAL issue. I saved ₦40k that day." },
               { name: "John O.", text: "Best ₦25,000 I've spent on my car. Now I clear my check engine light myself in 2 seconds." },
               { name: "Amaka E.", text: "Delivery to Lekki was fast. The setup was very simple on my iPhone. Highly recommended." }
             ].map((r, i) => (
               <div key={i} className="space-y-6">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-slate-900" />)}
                  </div>
                  <p className="text-lg font-medium italic text-slate-800 leading-relaxed">"{r.text}"</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{r.name}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="py-20 text-center border-t border-slate-50">
         <div className="flex items-center gap-2 justify-center mb-8 opacity-20 grayscale">
            <Car className="w-5 h-5" />
            <span className="text-lg font-display font-black tracking-tighter uppercase">Easy Shop</span>
         </div>
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200">© 2024 NIGERIA AUTOMOTIVE INTELLIGENCE</p>
      </footer>
    </motion.div>
  );

  const ProductPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
      {/* --- Conversion Hook Banner --- */}
      <div className="bg-red-600 text-white text-center py-4 px-6 fixed top-0 w-full z-[60] shadow-xl overflow-hidden">
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">
           ⚠️ NIGERIAN DRIVER ALERT: Read this before your next workshop visit
        </p>
      </div>

      <header className="pt-24 pb-12 px-10 flex items-center justify-between bg-white border-b border-slate-50 sticky top-0 z-50">
        <button onClick={() => setPage('home')} className="flex items-center gap-2">
          <Car className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-display font-black tracking-tighter uppercase">Easy Shop</span>
        </button>
        <button onClick={() => setPage('home')} className="bg-slate-100 text-slate-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">
          Home
        </button>
      </header>

      {/* --- Problem Hook (Fear/Distrust) --- */}
      <section className="section-container pt-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="hook-text">THE TRUTH ABOUT YOUR CAR</div>
          <h1 className="text-6xl md:text-9xl font-display font-black mb-8 tracking-tighter leading-[0.85]">
            Your Mechanic has <br /> <span className="text-red-600 underline underline-offset-8 decoration-red-100">been lying to you.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
            Check engine light came on? Read it yourself before the mechanic does. Know exactly what's wrong with your car before anyone tells you.
          </p>
        </div>
      </section>

      {/* --- Section 1: The Problem (Dashboard Light) --- */}
      <section className="section-container pt-32 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
           <div className="order-2 md:order-1">
              <div className="hook-text !text-red-500">THE SCENARIO</div>
              <h2 className="text-5xl font-display font-black tracking-tighter mb-8 italic">That light is not a suggestion. <br /> It's a warning.</h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
                Lagos traffic and poor fuel quality take a toll on your sensors. When the 'Check Engine' light comes on, it usually means your engine is working 3x harder than it should.
              </p>
              <div className="p-8 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-5">
                 <X className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                 <p className="text-sm font-bold text-red-900 leading-relaxed italic">
                   "Ignoring this light leads to fouled spark plugs, damaged catalytic converters, and eventually, a ₦2.5M engine knock."
                 </p>
              </div>
              <button 
                onClick={() => setShowCommitmentModal(true)}
                className="mt-10 px-10 py-5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3"
              >
                ORDER NOW <ChevronRight className="w-4 h-4" />
              </button>
           </div>
           <div className="order-1 md:order-2">
              <div className="aspect-[4/5] rounded-[3.5rem] bg-slate-900 overflow-hidden relative border-8 border-white shadow-intense">
                 <video 
                   src="https://res.cloudinary.com/dmy2yiax9/video/upload/v1777571940/202604301840_2_1_ufge0h.mp4"
                   className="absolute inset-0 w-full h-full object-cover"
                   autoPlay muted loop playsInline
                 />
                 <div className="absolute inset-0 bg-red-600/5" />
                 <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between z-10">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl border border-white">
                      Stage 1: Warning Detection
                    </span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- Section 2: The Solution (Installation) --- */}
      <section className="bg-slate-50 py-40">
        <div className="section-container">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div>
                 <div className="aspect-[4/3] rounded-[3.5rem] bg-slate-200 overflow-hidden relative border-8 border-white shadow-intense">
                    <video 
                      src="https://res.cloudinary.com/dmy2yiax9/video/upload/v1777572659/202604301840_3_1_jfgsqm.mp4"
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay muted loop playsInline
                    />
                    <div className="absolute inset-0 bg-blue-600/5" />
                 </div>
              </div>
              <div className="space-y-10">
                 <div>
                    <div className="hook-text">STEP 01: PLUG & PLAY</div>
                    <h2 className="text-5xl font-display font-black tracking-tighter mb-8 leading-tight">Install into any car in under 5 seconds.</h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                       Find your OBDII port (usually under the steering wheel), plug in AutoScan Pro™, and watch it pair instantly with your smartphone via Bluetooth 5.0.
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-soft text-center">
                       <Zap className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                       <h4 className="text-xs font-black uppercase tracking-widest">No Wires</h4>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-soft text-center">
                       <Check className="w-8 h-8 text-green-600 mx-auto mb-4" />
                       <h4 className="text-xs font-black uppercase tracking-widest">All Cars 1996+</h4>
                    </div>
                 </div>
                 <button 
                   onClick={() => setShowCommitmentModal(true)}
                   className="mt-6 px-10 py-5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-3 w-fit"
                 >
                   CLAIM YOUR SCANNER <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* --- Section 3: The Intelligence (App Decoding) --- */}
      <section className="section-container py-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <div className="hook-text">STEP 02: THE DECODING</div>
              <h2 className="text-5xl font-display font-black tracking-tighter mb-8 leading-tight italic">The app that speaks <br /> fluent car.</h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                 Don't just see a code. Understand the story. Our app translates complex error codes into plain English advice tailored for the Nigerian environment.
              </p>
              <ul className="space-y-4 pt-6">
                 {["Instant Code Identification", "Probable Causes List", "DIY Repair Suggestions", "Workshop Cost Estimates"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-slate-800">
                       <CheckCircle2 className="w-5 h-5 text-blue-600" /> {item}
                    </li>
                 ))}
              </ul>
              <button 
                onClick={() => setShowCommitmentModal(true)}
                className="mt-8 px-10 py-5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3 w-fit"
              >
                FIX YOUR CAR NOW <ChevronRight className="w-4 h-4" />
              </button>
           </div>
           <div>
              <div className="aspect-square bg-slate-900 rounded-[4rem] overflow-hidden relative border-8 border-white shadow-intense">
                 <video 
                   src="https://res.cloudinary.com/dmy2yiax9/video/upload/v1777572386/202604301840_4_1_kozdyi.mp4"
                   className="absolute inset-0 w-full h-full object-cover scale-110"
                   autoPlay muted loop playsInline
                 />
                 <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[2px] opacity-20" />
              </div>
           </div>
        </div>
      </section>

      {/* --- Section 4: The Result (Confidence) --- */}
      <section className="bg-slate-950 py-40 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[150px]" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20 relative z-10">
           <div className="w-full md:w-1/2">
              <div className="aspect-video rounded-[3rem] bg-slate-800 overflow-hidden border-4 border-slate-700 shadow-2xl relative">
                 <video 
                   src="https://res.cloudinary.com/dmy2yiax9/video/upload/v1777571801/202604301840_6_nrjwmd.mp4"
                   className="absolute inset-0 w-full h-full object-cover"
                   autoPlay muted loop playsInline
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              </div>
           </div>
           <div className="w-full md:w-1/2 text-white">
              <div className="hook-text !text-blue-400">THE FINAL RESULT</div>
              <h2 className="text-6xl font-display font-black tracking-tighter mb-10 leading-tight">Clinical Precision. <br /> <span className="italic text-slate-500">No More Lies.</span></h2>
              <p className="text-xl text-slate-300 font-medium leading-relaxed mb-12">
                 Walk into any workshop with your health report in hand. Tell the mechanic exactly which sensor to clean or which part to replace. You are finally in control.
              </p>
              <button onClick={() => setShowCommitmentModal(true)} className="btn-primary bg-white text-slate-950 hover:bg-slate-200">
                 GET CONTROL NOW
              </button>
           </div>
        </div>
      </section>

      {/* --- Tech Specs & Shipping --- */}
      <section className="bg-white py-24 px-8 border-b border-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-20">
             <div className="p-10 bg-slate-50 rounded-[2.5rem] space-y-4">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
                  <Zap className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight">Bluetooth 5.0 Tech</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Stable, high-speed connection to your smartphone. Works within 10 meters of your vehicle. No cables needed.</p>
             </div>
             <div className="p-10 bg-slate-50 rounded-[2.5rem] space-y-4">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight">Free Lifetime App</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Download the <b>AutoScan Pro</b> app for free on <b>Google Play Store</b> or Apple App Store. No monthly subscriptions.</p>
             </div>
             <div className="p-10 bg-slate-50 rounded-[2.5rem] space-y-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight">Free Nationwide Delivery</h4>
                <p className="text-slate-500 font-medium leading-relaxed">We ship to all 36 states for <b>FREE</b>. Most orders in Lagos & Abuja arrive within 24 hours.</p>
             </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                   <div className="hook-text !text-blue-400">TECHNICAL CAPABILITIES</div>
                   <h3 className="text-4xl md:text-5xl font-display font-black mb-8 leading-tight">Professional Grade <br /> Diagnostics in Your Pocket.</h3>
                   <ul className="space-y-6">
                      {[
                        "Read & Clear Check Engine Light (MIL)",
                        "Real-time Fuel Consumption Monitoring",
                        "View Live Sensor Data (RPM, Temp, Speed)",
                        "OBD2 / EOBD Protocol Support (1996+ Cars)",
                        "Emissions Readiness Check (Smog Test)",
                        "Freeze Frame Data for Pattern Analysis",
                        "Compatible with Toyota, Honda, Nissan, Lexus, etc."
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-slate-300">
                           <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 flex-shrink-0">
                              <Check className="w-3.5 h-3.5" />
                           </div>
                           <span className="font-medium">{item}</span>
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10">
                   <h4 className="text-2xl font-display font-black mb-6 text-blue-400 italic">"Save over ₦200,000 yearly by catching faults before they destroy your engine."</h4>
                   <p className="text-slate-400 leading-relaxed mb-8">
                      In Nigeria, poor fuel quality is the #1 cause of engine failure. AutoScan Pro monitors your oxygen sensors and fuel trim in real-time, alerting you to bad fuel before it ruins your injectors.
                   </p>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black">1YR</div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Full Technical Replacement Warranty Included</p>
                   </div>
                </div>
             </div>
             <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
          </div>
        </div>
      </section>

      {/* --- Detailed Pain Points (Mechanic Traps) --- */}
      <section className="section-container pt-32 pb-40">
        <div className="text-center mb-24">
          <div className="hook-text !text-red-600">THE DANGER OF IGNORANCE</div>
          <h2 className="text-6xl font-display font-black tracking-tighter">Don't be the Victim of <br /> <span className="text-red-500 italic underline decoration-red-100">Workshop "Experimentation".</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
           <div className="space-y-12">
              <div className="bg-red-50 p-12 rounded-[3rem] border border-red-100">
                 <X className="w-10 h-10 text-red-600 mb-6" />
                 <h4 className="text-2xl font-display font-black mb-4">The "Change Everything" Trap</h4>
                 <p className="text-slate-600 font-medium leading-relaxed italic">
                   "Your mechanic isn't sure, so he tells you to buy a new fuel pump, new plugs, and new coils. You spend ₦120,000. The car still jerks. Turns out it was just a ₦5,000 air filter issue. This happens every day in Nigeria."
                 </p>
              </div>
              <div className="bg-slate-50 p-12 rounded-[3rem]">
                 <Check className="text-green-600 w-10 h-10 mb-6" />
                 <h4 className="text-2xl font-display font-black mb-4 text-slate-800">Fact-Based Car Care</h4>
                 <p className="text-slate-600 font-medium leading-relaxed">
                   When you know the exact code, you buy exactly what is needed. No guesswork. No 'trying' parts at your expense.
                 </p>
              </div>
              <div className="bg-red-50 p-12 rounded-[3rem] border border-red-100">
                 <X className="w-10 h-10 text-red-600 mb-6" />
                 <h4 className="text-2xl font-display font-black mb-4">The "Small Light" Gamble</h4>
                 <p className="text-slate-600 font-medium leading-relaxed italic">
                    "That yellow light on your dashboard? It could be a loose gas cap, or it could be a failing oil pump. If you ignore it, you're gambling with a ₦2.5M engine replacement."
                 </p>
              </div>
           </div>
           <div className="space-y-12 md:pt-24">
              <div className="bg-red-50 p-12 rounded-[3rem] border border-red-100">
                 <X className="w-10 h-10 text-red-600 mb-6" />
                 <h4 className="text-2xl font-display font-black mb-4">The Resale Value Killer</h4>
                 <p className="text-slate-600 font-medium leading-relaxed italic">
                   "Trying to sell your car but the buyer sees a dash full of lights? They'll slash your price by ₦500k instantly. Clear the memory and fix the small issues now."
                 </p>
              </div>
              <div className="bg-slate-50 p-12 rounded-[3rem]">
                 <Check className="text-green-600 w-10 h-10 mb-6" />
                 <h4 className="text-2xl font-display font-black mb-4 text-slate-800">Maximum Resale Value</h4>
                 <p className="text-slate-600 font-medium leading-relaxed">
                    A well-maintained car with a clean health report sells faster and for 20% more money in the Nigerian used car market.
                 </p>
              </div>
              <div className="bg-slate-50 p-12 rounded-[3rem]">
                 <Check className="text-green-600 w-10 h-10 mb-6" />
                 <h4 className="text-2xl font-display font-black mb-4 text-slate-800">Confidence on the Road</h4>
                 <p className="text-slate-600 font-medium leading-relaxed">
                    Drive from Lagos to Onitsha or Abuja with the peace of mind that your car's critical systems are healthy.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* --- ROI & ROI (Empowerment) --- */}
      <section className="py-40 bg-slate-50 mt-32 relative overflow-hidden">
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
         <div className="section-container relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
               <h2 className="text-5xl font-display font-black tracking-tight leading-tight">This ₦25,000 device saved me <span className="text-green-600 underline decoration-green-100">₦180,000</span> at the mechanic.</h2>
               <p className="text-xl text-slate-500 font-medium leading-relaxed italic">
                 "Every Lagos driver needs this in their car. I caught my shop trying to charge me for a full engine top-gasket replacement when it was just a loose ₦2,000 sensor."
               </p>
               <div className="space-y-8 pt-6">
                 {[
                   { label: "Empowerment", text: "Read codes yourself before the mechanic speaks." },
                   { label: "ROI", text: "Pays for itself in 30 seconds of use." },
                   { label: "Control", text: "Reset lights and check real-time fuel wastage." }
                 ].map((h, i) => (
                   <div key={i} className="flex gap-6 group">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-soft group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <Check className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{h.label}</p>
                        <p className="text-xl font-black text-slate-900">{h.text}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
            <div className="grid grid-cols-1 gap-8">
               <div className="aspect-square rounded-[3rem] bg-white border border-slate-100 shadow-soft flex items-center justify-center flex-col p-6 text-center overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/dmy2yiax9/image/upload/v1777581028/c74b6fce-72e5-4d66-9bcc-fbc25003e76a.png" 
                    alt="AutoScan Pro Device"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
               </div>
            </div>
         </div>
      </section>

      {/* --- Technical Protocols & Compatibility --- */}
      <section className="bg-slate-50 py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
             <div className="hook-text">WIDE COMPATIBILITY</div>
             <h2 className="text-5xl font-display font-black tracking-tighter">Works with Your Car. Guaranteed.</h2>
             <p className="text-slate-500 mt-6 max-w-2xl mx-auto font-medium">AutoScan Pro™ supports all 5 standard OBDII protocols used by major manufacturers globally since 1996.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
             {[
               { p: "ISO 9141-2", c: "Chrysler, European, Asian" },
               { p: "ISO 14230 KWP", c: "Honda, Toyota, Hyundai" },
               { p: "SAE J1850 VPW", c: "GM, Chrysler" },
               { p: "SAE J1850 PWM", c: "Ford, Mazda" },
               { p: "ISO 15765 CAN", c: "All Cars 2008+" }
             ].map((protocol, i) => (
               <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft text-center group hover:bg-blue-600 transition-all duration-500">
                  <p className="text-blue-600 font-black text-xs mb-2 group-hover:text-white">{protocol.p}</p>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest group-hover:text-blue-100">{protocol.c}</p>
               </div>
             ))}
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div className="space-y-8">
                <div className="flex gap-6">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-soft flex-shrink-0">
                      <Zap className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-xl font-black mb-2">Battery Health Monitoring</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">Check your battery voltage in real-time. Know when your alternator is failing before it leaves you stranded at night.</p>
                   </div>
                </div>
                <div className="flex gap-6">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-soft flex-shrink-0">
                      <Smartphone className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-xl font-black mb-2">Detailed Error Explanations</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">The app doesn't just show 'P0420'. It explains that your catalytic converter is underperforming and what usually causes it in Nigeria.</p>
                   </div>
                </div>
                <div className="flex gap-6">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-soft flex-shrink-0">
                      <Check className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-xl font-black mb-2">Emissions Readiness</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">Perfect for passing VIO inspections. Know if your car's emissions systems are ready before you go for the test.</p>
                   </div>
                </div>
             </div>
             <div className="bg-white p-12 rounded-[3rem] shadow-intense border border-slate-50">
                <h4 className="text-2xl font-display font-black mb-8">Verified Brand Compatibility</h4>
                <div className="flex flex-wrap gap-4 opacity-40 grayscale">
                   {["Toyota", "Honda", "Lexus", "Nissan", "Mercedes", "BMW", "Hyundai", "Kia", "Ford", "Mazda", "Mitsubishi", "Volkswagen"].map(brand => (
                     <span key={brand} className="px-5 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest">{brand}</span>
                   ))}
                </div>
                <p className="mt-10 text-xs font-medium text-slate-400 italic font-sans leading-relaxed">
                   *Compatible with all petrol engines from 1996 and diesel engines from 2004. Works on both 12V cars and light trucks.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* --- Massive Social Proof & Reviews --- */}
      <section className="bg-white py-40">
        <div className="max-w-7xl mx-auto px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
              <div className="max-w-2xl">
                 <div className="hook-text !text-blue-600">THE REVIEWS ARE IN</div>
                 <h2 className="text-6xl font-display font-black tracking-tighter">Loved by thousands of <br /> <span className="italic opacity-30">Nigerian Car Owners.</span></h2>
              </div>
              <div className="bg-blue-600 text-white p-8 rounded-[2rem] shadow-xl">
                 <div className="text-5xl font-display font-black mb-2">4.9/5</div>
                 <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-white" />)}
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80">2,450 Verified Reviews</p>
              </div>
           </div>

           <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {[
                { name: "Seyi V.", text: "I carried this thing to my mechanic just to test. His computer said one thing, my AutoScan showed the REAL issue. I saved ₦40k that day.", loc: "Ikeja, Lagos" },
                { name: "John O.", text: "Best ₦25,000 I've spent on my car. Now I clear my check engine light myself in 2 seconds.", loc: "Gwarinpa, Abuja" },
                { name: "Amaka E.", text: "Delivery to Lekki was fast. The setup was very simple on my iPhone. Highly recommended.", loc: "Lekki, Lagos" },
                { name: "Chidi K.", text: "My Toyota Corolla was consuming too much fuel. The scanner showed my O2 sensor was dead. Fixed it and my fuel consumption dropped by 30%.", loc: "Gbagada, Lagos" },
                { name: "Blessing O.", text: "This is a must-have for every woman driving in Nigeria. It stops mechanics from taking advantage of you. Very simple to understand.", loc: "D-Line, Port Harcourt" },
                { name: "Musa S.", text: "The Bluetooth connection is very strong. I can stay inside my house and scan the car in the garage. Real clinical grade stuff.", loc: "Kano City" },
                { name: "Emeka I.", text: "I run a small taxi fleet in Enugu. I bought 5 units. Now I know when my drivers are being honest about car faults. Saved me a lot of money.", loc: "Enugu" },
                { name: "Funke A.", text: "I was scared of the 'Check Engine' light for months. Used this and found out it was just a loose gas cap. I was so relieved!", loc: "Abeokuta, Ogun" },
                { name: "Idris M.", text: "Works perfectly on my 2012 Lexus. Fast shipping to Kaduna. Packaging was original. 5 stars.", loc: "Kaduna" },
                { name: "Bolanle S.", text: "The app explains error codes in plain English. You don't need to be an engineer to use it. Extremely helpful gadget.", loc: "Akure, Ondo" }
              ].map((r, i) => (
                <div key={i} className="break-inside-avoid bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all group">
                   <div className="flex gap-1 mb-6">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-blue-600" />)}
                   </div>
                   <p className="text-xl font-medium italic text-slate-800 leading-relaxed mb-10 group-hover:text-blue-900 transition-colors">"{r.text}"</p>
                   <div>
                     <p className="text-slate-900 font-black text-sm uppercase tracking-widest">{r.name}</p>
                     <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{r.loc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- User Manual / Layout Steps --- */}
      <section className="section-container py-40">
        <h2 className="text-center text-7xl font-display font-black mb-24 tracking-tighter">As Simple as 1-2-3</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
           {[
             { step: "01", title: "Plug-In", desc: "Insert the unit into your car's OBD2 port (usually under the steering wheel)." },
             { step: "02", title: "Scan", desc: "Open the app on your iPhone or Android. Hit 'Diagnostic Scan'." },
             { step: "03", title: "Reveal", desc: "See the EXACT fault in plain English. No more mechanic guesswork." }
           ].map((s, i) => (
             <div key={i} className="text-center space-y-6">
                <div className="text-8xl font-display font-black text-slate-50">{s.step}</div>
                <h4 className="text-3xl font-display font-black tracking-tight">{s.title}</h4>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">{s.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* --- Bundle Selection --- */}
      <section id="checkout" className="bg-slate-950 py-40 text-center">
        <div className="section-container">
          <div className="hook-text !text-blue-400 mb-6">STEP 03: PICK YOUR VALUE</div>
          <h2 className="text-white text-6xl font-display font-black mb-20 tracking-tighter">Choose Your Package.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bundles.map((b) => (
              <div 
                key={b.id} 
                className={`bg-slate-900 border-2 rounded-[2.5rem] p-12 relative flex flex-col justify-between transition-all cursor-pointer group ${selectedBundle.id === b.id ? 'border-blue-600 bg-blue-600/5 ring-4 ring-blue-600/20' : 'border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'}`}
                onClick={() => setSelectedBundle(b)}
              >
                {b.badge && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full shadow-xl animate-pulse">
                    {b.badge}
                  </span>
                )}
                <div>
                   <h4 className="text-white text-2xl font-black mb-2">{b.name}</h4>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
                     {b.quantity === 1 ? "1 Device + Free App" : `${b.quantity} Devices + Pro Support`}
                   </p>
                   <div className="flex flex-col items-center gap-1 mb-10">
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl text-white font-display font-black">₦{b.price.toLocaleString()}</span>
                        <span className="text-slate-600 line-through font-bold text-lg">₦{b.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="bg-green-600/20 text-green-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 border border-green-600/30">
                        YOU SAVE ₦{(b.originalPrice - b.price).toLocaleString()}
                      </div>
                   </div>
                </div>
                <div className="space-y-4">
                  <div className="text-left space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" /> Free Delivery Included
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" /> Lifetime App Access
                    </div>
                    {b.quantity > 1 && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-green-500">
                        <CheckCircle2 className="w-3 h-3" /> Priority Technical Support
                      </div>
                    )}
                  </div>
                  <button className={`w-full py-6 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${selectedBundle.id === b.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
                    {selectedBundle.id === b.id ? 'PACKAGE SELECTED' : 'SELECT THIS PACKAGE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Checkout Form --- */}
      <section className="section-container pt-40 pb-40">
        <div className="max-w-4xl mx-auto glass-card flex flex-col items-center p-12 md:p-24 shadow-intense">
           <h3 className="text-4xl font-display font-black mb-10 tracking-tight">Finalize Delivery</h3>
           
           {/* Trust Icons Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
              <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex flex-col items-center text-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Truck className="w-6 h-6" />
                 </div>
                 <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Free Delivery</h5>
                    <p className="text-[9px] font-bold text-blue-900/60 uppercase tracking-tight">Lagos, Abuja & Rivers</p>
                 </div>
              </div>
              <div className="bg-green-50/50 p-6 rounded-[2rem] border border-green-100 flex flex-col items-center text-center gap-4">
                 <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1">Pay On Delivery</h5>
                    <p className="text-[9px] font-bold text-green-900/60 uppercase tracking-tight">Available in Lagos & Abuja</p>
                 </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center gap-4">
                 <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1">Money-Back</h5>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">7-Day Technical Warranty</p>
                 </div>
              </div>
           </div>

           <form onSubmit={handleSubmit} className="w-full space-y-12">
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Delivery Name</label>
                 <input required className="w-full border-b border-slate-200 py-4 outline-none focus:border-blue-600 font-bold text-xl" placeholder="Adebayo Ogunlesi" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp Number</label>
                    <input required className="w-full border-b border-slate-200 py-4 outline-none focus:border-blue-600 font-bold text-xl" placeholder="0803 000 0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select State</label>
                     <select 
                       required 
                       className="w-full border-b border-slate-200 py-4 outline-none focus:border-blue-600 font-bold text-xl bg-transparent transition-all cursor-pointer"
                       value={formData.state}
                       onChange={(e) => setFormData({...formData, state: e.target.value})}
                     >
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Rivers">Rivers</option>
                     </select>
                 </div>
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Delivery Address</label>
                 <textarea required className="w-full border-b border-slate-200 py-4 outline-none focus:border-blue-600 font-bold text-xl resize-none" rows={2} placeholder="No, Street, Landmark" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
               </div>

               <div className="space-y-6">
                 <div className="p-8 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Critical Availability Notice</h5>
                      <p className="text-sm text-red-950 font-black leading-relaxed font-sans uppercase tracking-tight italic">
                         DO NOT ORDER IF YOU WILL NOT BE AVAILABLE IN THE NEXT 24 TO 48 HRS TO RECEIVE YOUR CALL AND PACKAGE.
                      </p>
                    </div>
                 </div>

                 <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Payment Notice</h5>
                      <p className="text-sm text-blue-900 font-medium leading-relaxed font-sans uppercase tracking-tight">
                         Pay on delivery is <b>ONLY</b> available for <b>Lagos</b> and <b>Abuja</b>. Orders from <b>Rivers</b> require confirmation before delivery.
                      </p>
                    </div>
                 </div>
               </div>

               <button disabled={isSubmitting} className="btn-primary w-full py-8 text-2xl font-black">
                  {isSubmitting ? "PROCESSING..." : "CONFIRM ORDER"}
               </button>
              <div className="flex items-center justify-center gap-4 text-slate-300">
                 <ShieldCheck className="w-4 h-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Pay on Delivery Available Lagos & Abuja</p>
              </div>
           </form>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-slate-50 mt-40">
         <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">© 2024 EASY SHOP AUTOMOTIVE</div>
      </footer>
    </motion.div>
  );

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {page === 'home' ? <HomePage key="home" /> : <ProductPage key="product" />}
      </AnimatePresence>

      {/* --- Commitment Modal --- */}
      <AnimatePresence>
        {showCommitmentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] max-w-xl w-full p-12 md:p-16 relative overflow-hidden text-center shadow-intense"
            >
              <div className="inline-block p-6 bg-red-50 rounded-full mb-10 text-red-600">
                <Clock className="w-12 h-12" />
              </div>
              <h3 className="text-4xl font-display font-black mb-6 tracking-tighter leading-none italic uppercase">Are you ready <br /> to receive?</h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                To prevent wasted delivery costs, please confirm you will be <span className="text-red-600 font-black">available in the next 24 to 48 hours</span> to receive your call and package.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setShowCommitmentModal(false);
                    const el = document.getElementById('checkout');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="btn-primary w-full py-6 text-xl shadow-xl"
                >
                  YES, I AM AVAILABLE
                </button>
                <button 
                  onClick={() => setShowCommitmentModal(false)}
                  className="w-full text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-colors"
                >
                  I'm not sure, let me wait
                </button>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Exit Intent Popup (Nigerianized) --- */}
      <AnimatePresence>
        {showExitPopup && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] max-w-xl w-full p-12 md:p-16 relative overflow-hidden text-center shadow-intense"
            >
              <button onClick={() => setShowExitPopup(false)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
              
              <div className="relative z-10">
                <div className="inline-block p-6 bg-blue-50 rounded-[2.5rem] mb-10 text-blue-600">
                  <Zap className="w-14 h-14 fill-current" />
                </div>
                <h2 className="text-5xl font-display font-black mb-6 tracking-tighter">Oga, Wait!</h2>
                <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium">
                  We have a <span className="text-blue-600 font-black underline decoration-2 underline-offset-4 decoration-blue-200">₦2,500 DISCOUNT</span> voucher locked for you if you complete your order in the next 5 minutes.
                </p>
                <div className="space-y-4">
                  <button 
                    onClick={() => { setShowExitPopup(false); setPage('home'); setTimeout(() => { document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}
                    className="w-full py-6 bg-blue-600 text-white rounded-full font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
                  >
                    CLAIM MY VOUCHER
                  </button>
                  <button onClick={() => setShowExitPopup(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-slate-950 transition-colors">
                    No thanks, I'll pay full price
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
