// PHASE 4D - SERVICE CONTENT
//
// Eight pages, rewritten at their existing URLs. No slug changed.
//
// Rules this file follows, and why:
//
// 1. DEPTH IS SET BY THE TOPIC, NOT A WORD TARGET. audit/03-gap-analysis.md §3.3
//    measured the competitor median at 430 words and found the SHALLOWEST site
//    (228 words) outranking the DEEPEST (1748) by two places. Padding these pages
//    would cost 12,000 words of medical copy needing clinical sign-off to close a
//    gap the data says does not exist. Fillings is short because fillings are
//    simple. Full mouth rehabilitation is long because it is not.
//
// 2. THE PROCESS BEATS ARE SHARED; THE WORDS ARE NOT. Every page walks the same
//    five beats - see it on screen, hear it in plain words, agree the plan and the
//    cost, get numb and be told what is happening, come back for review - because
//    that is genuinely how the clinic runs. But audit/A-repo-reverse-engineering.md
//    §A4 measured mean pairwise similarity at 0.192 across these pages, and
//    templated clones score 0.8+. Identical process text on eight pages would
//    manufacture the duplication problem we currently do not have. Each is written
//    for its own procedure.
//
// 3. SPECIALISM IS ATTRIBUTED, NOT ASSERTED. Dr. Sahil is named on implants, full
//    mouth rehabilitation, dentures and smile design - the prosthodontic work his
//    MDS actually covers. Dr. Aishwarya is named on root canals and fillings AS A
//    GENERAL AND FAMILY DENTIST; she holds a BDS and endodontics training and is
//    NOT a specialist, and nothing here may imply she is.
//
// 4. TWO PAGES NAME NOBODY. Orthodontics and wisdom tooth surgery are offered, but
//    neither clinician's listed credentials cover orthodontics or oral surgery.
//    Rather than imply a qualification that has not been evidenced, those pages
//    describe the treatment and stay silent on who performs it.
//    See audit/NEEDS-INPUT.md C10 and C11.
//
// 5. NO PRICES. Every page says cost is discussed before treatment starts, which
//    is true. No figure appears anywhere - P1-P12 are unanswered.
//
// 6. LOCAL RELEVANCE IS TWO AREA NAMES PER PAGE, IN A SENTENCE THAT MEANS
//    SOMETHING. Assignments and reasoning: audit/01-content-spine.md §4.
//    Still gated on NEEDS-INPUT B3/L1 - these reflect how patients TRAVEL for a
//    given treatment, not measured patient origin.

export const services = [
  {
    slug: "dental-implants",
    locality: "Kothrud, Pune",
    isFeatured: true,
    title: "Dental Implants",
    shortDesc: "Fixed replacement teeth, planned by a specialist prosthodontist before anything is placed.",
    problem: "Tired of loose dentures or missing teeth that make you hesitate to smile?",
    solution: "A dental implant is a titanium root placed into the jawbone to carry a crown, bridge or denture - restoring how you chew and how you look.",
    benefit: "Fixed teeth that don't slip.",
    icon: "Sparkles",
    image: "https://images.pexels.com/photos/6502306/pexels-photo-6502306.jpeg",
    // NEEDS-INPUT T1: stock photograph, not a clinical image from this practice.
    // Alt text describes what the picture actually shows rather than naming the
    // treatment, because claiming it is our case would be a small lie.
    imageAlt: "A dental implant model showing a titanium fixture seated in the jawbone beneath a crown",
    hero: {
      headline: "The Gold Standard for Replacing Missing Teeth",
      promise:
        "Experience specialist-led dental implant treatment in Kothrud, Pune that restores your smile, confidence, and ability to eat comfortably -with natural-looking, long-lasting results backed by prosthodontic expertise.",
    },
    aboutHeading: "About Dental Implants in Kothrud",
    // Dr. Sahil's copy, near-verbatim. Do not genericise this. The mechanism-level
    // detail (osseointegration, CBCT, sub-millimetre positioning) is the point —
    // it is what a prosthodontist can say and a content writer cannot.
    fullDescription: "Missing teeth affect more than your smile -they compromise chewing efficiency, jawbone density, and long-term oral health. Dental implants remain the gold standard for tooth replacement, functioning as true root substitutes rather than surface-level fixes like dentures or bridges. Each implant is a biocompatible titanium fixture, surgically placed into the jawbone, where it undergoes osseointegration -fusing with your natural bone to create a stable, load-bearing foundation for a custom crown, bridge, or full-arch restoration.\n\nAt Aesthedent, dental implant treatment in Kothrud, Pune is planned and executed under the direct supervision of a specialist prosthodontist -a dental professional with advanced, additional training in tooth replacement and restorative dentistry. Treatment begins with detailed clinical evaluation and 3D imaging (CBCT) to assess bone quality and map implant positioning with sub-millimeter precision. This diagnostic-first approach reduces surgical risk and improves long-term implant survival rates.\n\nEvery procedure is performed under controlled local anesthesia, with protocols designed around patient comfort, minimal downtime, and predictable healing. From initial consultation through final restoration, each stage is guided by prosthodontic expertise -not general practice guesswork -to ensure implants that function, feel, and last like natural teeth for 10–15 years or longer.\n\nPatients travel to us from Bavdhan and Warje for implant work, largely because this is a decision people research rather than make on proximity -and it is worth asking whoever plans your case what their qualification actually is.",
    benefits: [
      "Acts as a true root substitute, transmitting bite force into the bone instead of resting on the gum",
      "Preserves jawbone density, which resorbs once a natural root is lost",
      "Fixed in place -no adhesive, no removal at night, no movement while eating",
      "Replaces a single tooth without cutting down the healthy teeth on either side",
      "Cleaned like a natural tooth rather than soaked",
      "Published survival data supports 10–15 years and often considerably longer",
    ],
    whyAesthedent: [
      {
        title: "Planned by a prosthodontist, not referred out",
        desc: "An implant is a restorative procedure as much as a surgical one. Dr. Sahil Wathodkar, BDS, MDS (Prosthodontics), Bharati Vidyapeeth, Pune, plans and supervises each case from consultation through final restoration.",
      },
      {
        title: "Diagnostic-first, with CBCT",
        desc: "3D imaging assesses bone quality and maps implant positioning to sub-millimetre precision before anything is placed. This reduces surgical risk and improves long-term survival rates.",
      },
      {
        title: "The final tooth is designed first",
        desc: "Implant position is dictated by where the finished crown needs to sit, not the other way round. Reversing that order is what produces implants that integrate but never bite correctly.",
      },
      {
        title: "We will tell you when it is not the answer",
        desc: "For some cases a bridge is simpler, cheaper and just as durable. You should hear that before you commit to surgery, not after.",
      },
    ],
    process: [
      { step: 1, title: "Clinical evaluation and CBCT imaging", desc: "A detailed examination followed by 3D imaging to assess bone volume and density, and to map the implant position against the nerve and sinus anatomy." },
      { step: 2, title: "Prosthodontic planning", desc: "The final restoration is designed first, then the implant position is derived from it. You see the plan on screen, with the stages and the honest alternatives -including doing nothing." },
      { step: 3, title: "The plan and the cost, agreed", desc: "Nothing is ordered or booked until you have accepted both. Cost depends on the number of fixtures, the system used and whether grafting is needed." },
      { step: 4, title: "Placement under controlled local anaesthesia", desc: "The site is numbed and tested before we begin, and you are told what is happening as it happens. Raise a hand at any point and we stop." },
      { step: 5, title: "Osseointegration", desc: "The fixture fuses with the surrounding bone over some months. This stage is mostly waiting rather than treatment, and it is what makes the result load-bearing." },
      { step: 6, title: "Final restoration and bite review", desc: "The custom crown, bridge or full-arch restoration is fitted and adjusted, then the bite is reviewed under real chewing rather than assumed to have settled." },
    ],
    faqs: [
      {
        q: "What is a dental implant, exactly?",
        a: "A titanium post placed into the jawbone to act as an artificial tooth root. Once the bone has grown around it, it carries a crown, bridge or denture. It is fixed in place rather than removable."
      },
      {
        q: "Why would I choose an implant over a bridge or a denture?",
        a: "An implant replaces a single tooth without cutting down the healthy teeth on either side, which a bridge requires. Against a denture, it is fixed rather than removable and loads the bone more naturally. It is not always the right answer, though - for some cases a bridge is simpler and just as durable, and we will say so."
      },
      {
        q: "Does it hurt?",
        a: "The placement is done under local anaesthetic, which is tested before we start. Most people describe the sensation as pressure rather than pain. Afterwards you can expect soreness for a few days, managed with ordinary painkillers. Everyone's experience differs, which is why we would rather tell you what to expect than promise you a feeling."
      },
      {
        q: "How long do dental implants last?",
        a: "Published survival data for implants is high over ten to fifteen years and many last considerably longer. Yours depends on the bone it sits in, how your bite loads it, whether you smoke, and how well the area is cleaned - which is why we review it rather than fit it and wave you off."
      },
      {
        q: "How long does the whole thing take?",
        a: "Usually several months, most of which is waiting rather than treatment. The implant needs time to integrate with the bone before the final tooth can be loaded onto it. We will give you the stages and rough timings for your case at the planning visit."
      },
      {
        q: "What if I do not have enough bone?",
        a: "It is common, particularly if the tooth has been missing for years, and it does not automatically rule an implant out. The scan tells us what is there. If grafting is needed we will explain what that adds in time and cost before you decide anything."
      },
      {
        q: "What does a dental implant cost in Pune?",
        a: "It depends on the number of implants, the system used and whether any grafting is needed. We give you a written figure after the scan and the planning discussion, before any treatment is booked - we would rather you compared a real number than a starting price."
      },
      {
        q: "I have been putting this off because I am frightened. Is that a problem?",
        a: "No, and you are in a large group. Tell us when you book and we will run the appointment differently: more explanation, more breaks, and a hand signal that stops everything immediately."
      }
    ]
  },
  {
    slug: "root-canal",
    locality: "Kothrud, Pune",
    title: "Root Canal Treatment",
    // COLLISION C4 (Part C): was "…with painless RCT." That put this page on the
    // same term as /insights/root-canal-pain-myths and re-opened the absolute pain
    // claim N6/N7/N8 closed. shortDesc is also this route's meta description.
    shortDesc: "Relieve the pain of an infected tooth and keep the natural tooth in place.",
    problem: "Severe tooth pain, or swelling that keeps coming back?",
    solution: "A root canal removes the infected pulp inside the tooth, disinfects the canal and seals it - which settles the pain and lets you keep the tooth.",
    benefit: "Keep the tooth instead of losing it.",
    icon: "Stethoscope",
    image: "https://images.pexels.com/photos/4971514/pexels-photo-4971514.jpeg",
    // NEEDS-INPUT T1: stock photograph, not a clinical image from this practice.
    imageAlt: "A dentist reviewing a digital dental X-ray on screen during a consultation",
    hero: {
      headline: "Save Your Tooth. Relieve Your Pain.",
      promise:
        "Using modern techniques and gentle care, our Root Canal Treatment removes infection, relieves pain, and preserves your natural tooth -helping you return to eating, smiling, and living comfortably.",
    },
    aboutHeading: "About Root Canal Treatment in Kothrud",
    // Dr. Sahil's copy, near-verbatim, WITH MANDATORY CORRECTION #1 APPLIED.
    //
    // His draft read "Dr. Aishwarya, our in-house endodontic specialist" and later
    // "Early diagnosis under a specialist's care". Both are false as written:
    // Dr. Aishwarya holds a BDS and has advanced TRAINING in endodontics. In Indian
    // dental practice "specialist" means an MDS, which she does not hold -so the
    // word is a credential claim, not a compliment. Both instances corrected; the
    // clinical substance (digital X-rays, rotary endodontics, single-sitting where
    // appropriate) is his and is untouched. See audit/NEEDS-INPUT.md C12.
    fullDescription: "A root canal treatment (RCT) is a procedure that removes infected or inflamed pulp -the nerve and blood vessel tissue inside your tooth -to eliminate infection at its source. At Aesthedent in Kothrud, Pune, root canal treatment is handled by Dr. Aishwarya Kulkarni Wathodkar, BDS, who has advanced training in endodontics (root canal treatment), using digital X-rays and rotary endodontic techniques for precise, minimally invasive treatment.\n\nUnlike an extraction, RCT lets you retain your natural tooth structure -which remains the gold standard in dental care, since no artificial replacement fully matches the strength and function of a natural tooth. With modern anesthesia and single-sitting protocols where clinically appropriate, the procedure is far more comfortable than most patients expect.\n\nIgnoring the early signs of pulp infection -lingering sensitivity to hot or cold, pain while chewing, or a darkening tooth -allows the infection to spread into the surrounding bone, often leading to an abscess, worsening pain, and eventual tooth loss. Early diagnosis means a simpler, faster procedure and quicker relief. If you're experiencing tooth pain in Kothrud or the surrounding Pune area, timely evaluation at Aesthedent can help save your natural tooth before the infection advances.\n\nBecause an infected tooth is urgent and nobody wants to cross the city with one, most of these patients come from Kothrud itself and the Paud Road side. If you are in pain today, phone rather than email.",
    benefits: [
      "Retains your natural tooth structure, which no artificial replacement fully matches",
      "Eliminates the infection at its source rather than masking the pain",
      "Stops the infection spreading into the surrounding bone and forming an abscess",
      "Avoids the cost and complication of replacing a missing tooth later",
      "Completed in a single sitting where clinically appropriate",
    ],
    whyAesthedent: [
      {
        title: "Treated by a dentist with advanced endodontic training",
        desc: "Root canals here are handled by Dr. Aishwarya Kulkarni Wathodkar, BDS, Bharati Vidyapeeth, Pune -a general and family dentist with advanced training in endodontics.",
      },
      {
        title: "Digital X-rays and rotary endodontics",
        desc: "Digital radiography confirms the diagnosis and the canal anatomy; rotary instrumentation cleans and shapes the canals more precisely and with less removal of sound tooth than hand filing.",
      },
      {
        title: "The crown conversation happens first",
        desc: "A treated tooth is more brittle than a live one and back teeth usually need covering to stop them splitting. You get that figure at the start, not as a surprise at the second appointment.",
      },
      {
        title: "Told before it happens, not after",
        desc: "You are numbed and tested before we begin, and each step is described as it comes. Raise a hand at any point and we stop.",
      },
    ],
    process: [
      { step: 1, title: "Diagnosis on a digital X-ray", desc: "We confirm which tooth is involved, how far the infection has spread, and whether a root canal is genuinely the answer -and we show you the image rather than describing it." },
      { step: 2, title: "The plan, including the crown", desc: "How many sittings your tooth is likely to need, whether it will need a crown afterwards, both costs, and what happens if you leave it untreated." },
      { step: 3, title: "Anaesthesia, tested before we start", desc: "Modern local anaesthesia, checked for effect before any instrument is used. If you need more, you say so and you get more." },
      { step: 4, title: "Removing the infected pulp", desc: "The inflamed or infected pulp is removed and the canals are cleaned and shaped using rotary endodontic instrumentation." },
      { step: 5, title: "Disinfection and sealing", desc: "The canal system is disinfected and sealed so bacteria cannot re-enter. Single-sitting where clinically appropriate; more complex molars may need a second visit." },
      { step: 6, title: "Protection and bite review", desc: "A crown where the tooth needs one, then a check that the bite is right. A restoration a fraction too high is the usual cause of lingering soreness afterwards." },
    ],
    faqs: [
      {
        q: "Is a root canal painful?",
        a: "The procedure relieves pain rather than causing it - what hurts is the infected nerve you arrive with. Under local anaesthetic most people say it feels similar to having a filling. Some soreness for a few days afterwards is normal and settles with ordinary painkillers."
      },
      {
        q: "How many appointments will I need?",
        a: "One or two for most teeth, depending on how many canals it has and how much infection is present. Molars take longer than front teeth. We will tell you which after the X-ray rather than after we have started."
      },
      {
        q: "Can I just have the tooth out instead?",
        a: "You can, and it is usually cheaper on the day. But the gap then needs managing - the teeth either side drift, and replacing it later with a bridge or implant costs more than the root canal would have. We will lay out both options honestly."
      },
      {
        q: "Do I really need a crown afterwards?",
        a: "Often, yes. A tooth that has had its nerve removed becomes more brittle and back teeth take heavy biting forces, so they tend to need covering to stop them splitting. Front teeth sometimes do not. We will tell you which category yours falls into."
      },
      {
        q: "What happens if I leave it?",
        a: "The infection does not resolve on its own. It typically spreads into the bone around the root, which can lead to an abscess, facial swelling and eventually losing the tooth. Treated early it is a simpler procedure with a better outcome."
      },
      {
        q: "What does a root canal cost in Pune?",
        a: "It depends on which tooth - front teeth have fewer canals than molars - and on whether a crown is needed afterwards. You get both figures in writing after the X-ray, before anything begins."
      },
      {
        q: "I am dreading this. Can you do anything about that?",
        a: "Tell us when you book. We schedule more time, explain each step before it happens rather than narrating it afterwards, and stop the moment you raise a hand. A lot of people here have avoided a dentist for years; nobody will comment on it."
      }
    ]
  },
  {
    slug: "full-mouth-rehabilitation",
    locality: "Pune",
    isFeatured: true,
    title: "Full Mouth Rehabilitation",
    shortDesc: "Rebuilding a worn or failing bite in planned stages, led by a specialist prosthodontist.",
    problem: "Multiple teeth broken, worn down, or old dental work failing all at once?",
    solution: "Full mouth rehabilitation restores the whole bite in planned stages, so the teeth, the jaw joints and the way you look are treated as one problem rather than eight separate ones.",
    benefit: "A bite that works, rebuilt in stages you agree to.",
    icon: "Sparkles",
    image: "/assets/treatment/full-rehabililation.jpeg",
    imageAlt: "A full-arch restoration case showing rebuilt upper and lower teeth in correct occlusion",
    hero: {
      headline: "Because Every Smile Deserves a Second Chance",
      promise:
        "Complex dental problems need specialist care. Our prosthodontist-led Full Mouth Rehabilitation restores function, comfort, and confidence.",
    },
    aboutHeading: "About Full Mouth Rehabilitation in Kothrud",
    // Dr. Sahil's copy, near-verbatim.
    fullDescription: "Full Mouth Rehabilitation (FMR) is a comprehensive treatment protocol designed for patients with extensive dental damage \u2014 including multiple missing teeth, generalized tooth wear, collapsed bite, or failing crowns, bridges, and fillings from previous dental work. When these issues go untreated, they can affect chewing efficiency, jaw joint health, and long-term oral function, not just appearance.\n\nAs a prosthodontist-led treatment, Full Mouth Rehabilitation follows a structured diagnostic process \u2014 evaluating occlusion (bite alignment), tooth proportions, jaw relationship, and facial symmetry before any restorative work begins. This ensures that smile design decisions are grounded in function, not aesthetics alone.\n\nTreatment is sequenced in carefully planned stages, allowing the bite to be rebuilt incrementally and predictably. This staged approach reduces patient discomfort, allows for functional testing at each phase, and results in a restoration that is both durable and naturally proportioned to your face.\n\nPatients come to us for this from Erandwane and Bavdhan, and distance matters less here than for anything else we do. Full mouth work is months of staged appointments, so people choose on who is planning it rather than on how far they are driving.",
    benefits: [
      "The bite is planned as one system rather than as eight separate repairs",
      "Restores chewing on both sides, not just one comfortable corner",
      "Addresses the loss of facial height that follows generalized tooth wear",
      "Staged so you keep a working, presentable set of teeth throughout",
      "Functional testing at each phase before the next one begins",
      "Planned and sequenced by an MDS-qualified prosthodontist",
    ],
    whyAesthedent: [
      {
        title: "Diagnosis before restoration",
        desc: "Occlusion, tooth proportions, jaw relationship and facial symmetry are all evaluated before any restorative work begins \u2014 so smile design decisions are grounded in function, not aesthetics alone.",
      },
      {
        title: "Prosthodontist-led sequencing",
        desc: "Dr. Sahil Wathodkar, BDS, MDS (Prosthodontics), Bharati Vidyapeeth, Pune, plans the order the work happens in. Sequencing is what keeps you functional through a treatment measured in months.",
      },
      {
        title: "You can stop between phases",
        desc: "Each phase is designed to leave the mouth in a stable state, so pausing for financial or personal reasons does not undo the work already done.",
      },
      {
        title: "Honest about the scale",
        desc: "This is the largest treatment we offer in time, cost and commitment. You get the staging and the figures before the first appointment, not partway through.",
      },
    ],
    process: [
      { step: 1, title: "Full diagnostic records", desc: "Scans, photographs, X-rays and an assessment of how your jaw actually closes. You see the whole picture at once, which for most people is the first time." },
      { step: 2, title: "Occlusal and facial analysis", desc: "Bite alignment, tooth proportions, jaw relationship and facial symmetry are evaluated together, because changing the height of a bite affects all four." },
      { step: 3, title: "A staged plan with figures", desc: "Broken into phases with a cost against each, so you can see what committing to phase one does and does not commit you to." },
      { step: 4, title: "Phase-by-phase rebuilding", desc: "Each phase is completed and allowed to settle before the next begins, with temporary restorations maintaining function in between." },
      { step: 5, title: "Functional testing at each stage", desc: "The rebuilt bite is tested in real chewing rather than signed off at the fitting appointment, and adjusted where it needs it." },
      { step: 6, title: "Final restoration and maintenance", desc: "Definitive restorations placed against a bite that has already proven itself, then a review interval set for the long term." },
    ],
    faqs: [
      {
        q: "How do I know if I need full mouth rehabilitation rather than a few crowns?",
        a: "The usual signs are wear across many teeth rather than one, repeated failure of existing crowns and fillings, difficulty chewing on either side, or jaw and muscle discomfort. If the problems are isolated, you do not need this - and we would rather tell you that than sell you a treatment plan."
      },
      {
        q: "How long does it take?",
        a: "Months rather than weeks, planned in phases. The exact number depends on how much is being rebuilt and whether implants or grafting are part of it. You get the staging at the planning visit."
      },
      {
        q: "Will I be without teeth at any point?",
        a: "No. The sequence is built specifically so you keep a working, presentable set of teeth throughout, using temporary restorations between phases where needed."
      },
      {
        q: "Can I stop partway through?",
        a: "Yes. That is the point of phasing it. Each phase is designed to leave you in a stable state, so pausing between phases for financial or personal reasons does not undo the work already done."
      },
      {
        q: "Why does this need a prosthodontist?",
        a: "Because the difficulty is not any one restoration, it is making them work together. A prosthodontist has three additional years of training specifically in restoring and replacing teeth, including how the bite and jaw joints behave when you change the height of it."
      },
      {
        q: "Is it painful?",
        a: "The individual procedures are done under anaesthetic and are comparable to having crowns or implants placed. The bigger factor is that there are more appointments, which is tiring rather than painful. We space them to suit you."
      },
      {
        q: "What does full mouth rehabilitation cost in Pune?",
        a: "It varies more than any other treatment we offer, because no two cases involve the same number of teeth or the same mix of crowns, implants and dentures. You get a phase-by-phase written estimate before anything starts."
      }
    ]
  },
  {
    slug: "tooth-fillings",
    locality: "Kothrud, Pune",
    title: "Tooth-Coloured Fillings",
    shortDesc: "Composite fillings matched to your tooth shade, keeping as much natural tooth as possible.",
    problem: "A small cavity, or old grey metal fillings you would rather not see?",
    solution: "Composite fillings bond directly to the tooth, so less healthy tooth has to be cut away - and they are matched to your own shade.",
    benefit: "Repairs that don't announce themselves.",
    icon: "Shield",
    image: "/assets/treatment/color-filling.jpeg",
    imageAlt: "A tooth-coloured composite filling shade-matched to the surrounding enamel",
    hero: {
      headline: "Small Repairs. Big Difference.",
      promise:
        "Invisible, strong, and conservative restorations for cavities \u2014 durable, aesthetic results with a minimally invasive approach.",
    },
    aboutHeading: "About Tooth-Coloured Fillings in Kothrud",
    // Dr. Sahil's copy, near-verbatim. The amalgam/composite retention contrast
    // is the clinically substantive part - do not flatten it to "looks better".
    fullDescription: "Tooth-coloured fillings, also known as composite resin restorations, treat cavities while preserving as much of your natural tooth as possible. The composite material is custom shade-matched to your enamel before application, so the repair blends invisibly into your smile.\n\nWhat sets composite resin apart from traditional silver amalgam fillings is how it attaches to the tooth. Amalgam fillings rely on mechanical retention, often requiring removal of healthy tooth structure just to hold the filling in place. Composite resin, by contrast, bonds directly to the tooth at a micro-mechanical level \u2014 allowing us to take a more conservative approach, removing only the decayed portion rather than reshaping the tooth around the filling.\n\nThe composite is applied and hardened in thin layers using a curing light, which minimizes shrinkage and creates a tight seal at the edges of the restoration \u2014 reducing the risk of leakage or decay returning around the filling later. The result is a restoration that's not just cosmetically seamless, but also restores the tooth's natural strength and function, typically completed in a single visit with no metal, mercury, or dark spots.\n\nEveryday restorative work here is done by Dr. Aishwarya Kulkarni Wathodkar, BDS, Bharati Vidyapeeth, Pune, a general and family dentist. Most of these patients are simply local \u2014 Kothrud and the Paud Road side \u2014 because for a half-hour appointment nobody sensibly drives across Pune.",
    benefits: [
      "Custom shade-matched to your enamel before placement",
      "Bonds micro-mechanically, so only the decayed portion is removed",
      "Layered and light-cured to minimise shrinkage and seal the margins",
      "Restores the tooth's natural strength and function, not just its appearance",
      "Typically a single visit, with no metal, mercury or dark spots",
    ],
    whyAesthedent: [
      {
        title: "Conservative by default",
        desc: "Because composite bonds rather than wedges, we remove decay rather than reshaping sound tooth around a filling. Tooth structure you keep is tooth structure you never have to replace.",
      },
      {
        title: "Layered and cured properly",
        desc: "Thin increments, each light-cured, rather than one bulk fill. It takes longer in the chair and it is what produces a tight marginal seal instead of a gap that lets decay back in.",
      },
      {
        title: "We will say when a filling is the wrong answer",
        desc: "A badly broken tooth or one that has lost a cusp needs a crown. Placing a large filling there produces a restoration that fails within a year, and we would rather show you why on the scan.",
      },
      {
        title: "The bite is checked before you leave",
        desc: "A filling left a fraction high is the most common reason a tooth aches afterwards. It takes a minute to check and saves a return visit.",
      },
    ],
    process: [
      { step: 1, title: "See the cavity yourself", desc: "On the intraoral camera or X-ray, so you can judge the size of it rather than take our word for how urgent it is." },
      { step: 2, title: "Confirm a filling is right", desc: "For a cavity, yes. For a badly broken tooth, we will explain why a crown will outlast a large composite." },
      { step: 3, title: "Shade match, then agree the cost", desc: "The composite shade is selected against your own enamel in natural light, and the figure is confirmed before we begin." },
      { step: 4, title: "Anaesthetic if you want it", desc: "Shallow cavities often need none, but that is your call rather than ours. There is no prize for going without." },
      { step: 5, title: "Remove decay and bond in layers", desc: "Only the decayed portion is removed, then the composite is placed in thin increments and light-cured to control shrinkage." },
      { step: 6, title: "Polish and check the bite", desc: "Polished so it feels like tooth rather than a patch, then the bite is checked and adjusted before you leave." },
    ],
    faqs: [
      {
        q: "How are these different from silver fillings?",
        a: "They are composite resin rather than amalgam, matched to your tooth shade so they are effectively invisible. They also bond to the tooth, which means less healthy tooth needs to be cut away to hold them in place."
      },
      {
        q: "How long do tooth-coloured fillings last?",
        a: "Commonly five to ten years, often longer. It depends on where the filling is, how heavily you bite on it, whether you grind your teeth, and how well the area is cleaned."
      },
      {
        q: "Does having a filling hurt?",
        a: "Shallow fillings often need no anaesthetic at all. Deeper ones are done under local anaesthetic and you should feel pressure rather than pain. If you would rather be numb regardless, just say so."
      },
      {
        q: "Should I replace my old metal fillings?",
        a: "Not automatically. A sound amalgam filling that is not leaking, cracked or decaying underneath is usually best left alone - replacing it means removing more tooth. If yours does need replacing, we will show you the reason on the X-ray."
      },
      {
        q: "Can a filling fix a chipped front tooth?",
        a: "Often, yes. Composite bonding can rebuild a chipped edge in one visit. For larger fractures or heavily worn front teeth, a veneer or crown may hold up better, and we will tell you which applies."
      },
      {
        q: "My tooth is sensitive after a filling. Is that normal?",
        a: "Mild sensitivity to cold for a week or two is common, especially with deeper fillings. What is not normal is pain on biting or sensitivity that worsens - that usually means the filling is fractionally high or the nerve is irritated. Come back and we will check it."
      }
    ]
  },
  {
    slug: "wisdom-tooth-surgery",
    locality: "Kothrud, Pune",
    title: "Wisdom Tooth Removal",
    shortDesc: "Assessment and removal of impacted or infected wisdom teeth, with the X-ray explained first.",
    problem: "Pain, swelling or a bad taste at the very back of your jaw?",
    solution: "An X-ray shows how the wisdom tooth is lying and whether it needs to come out. If it does, it is removed under local anaesthetic with clear aftercare.",
    benefit: "The recurring infections stop.",
    icon: "Shield",
    image: "/assets/treatment/wisdom-tooth-surgery.jpeg",
    imageAlt: "A dental X-ray showing an impacted lower wisdom tooth angled against the molar in front of it",
    // MANDATORY CORRECTION #3 APPLIED. Dr. Sahil's draft promise line read
    // "Painless wisdom tooth removal in Kothrud, Pune". Pain is an OUTCOME that
    // varies by patient and cannot be promised (the same reasoning that closed
    // N6/N7/N8). The hero and H1 now say "comfortable, minimally invasive".
    // His draft body also said patients remain "comfortable and pain-free
    // throughout" - "pain-free" is the same promise, so it is now "comfortable
    // throughout". The search phrase "painless wisdom tooth removal" survives
    // ONCE, in an FAQ, framed as the phrase people search rather than a promise.
    //
    // [NEEDS-INPUT C11] No clinician on /doctor lists oral surgery among their
    // credentials, so this page names nobody. Do not attribute it until confirmed.
    hero: {
      headline: "Relief from Wisdom Tooth Pain Starts Here",
      promise:
        "Comfortable, minimally invasive wisdom tooth removal in Kothrud, Pune, using modern surgical techniques and a clear plan you see before we begin.",
    },
    aboutHeading: "About Wisdom Tooth Removal in Kothrud",
    fullDescription: "Wisdom teeth \u2014 the last molars to emerge, usually between ages 17 and 25 \u2014 often don't have enough room to grow in properly. They can become impacted, angled, or push against neighbouring teeth, making this one of the most common reasons patients visit us at Aesthedent.\n\nLeft untreated, an impacted wisdom tooth can lead to recurrent infections, cyst formation, bone loss, or damage to adjacent teeth. Persistent jaw pain, swelling, or difficulty opening the mouth are common warning signs.\n\nAt Aesthedent, every extraction begins with a detailed clinical evaluation, including digital X-rays to assess the tooth's exact position, root structure, and proximity to nerves \u2014 this allows us to plan the safest and least invasive approach for your specific case. The procedure itself is performed under local anaesthesia, so you remain comfortable throughout.\n\nOur approach favours minimally invasive surgical techniques wherever possible, which typically means less swelling, a shorter recovery, and fewer post-operative complications. Before you leave, you'll receive clear, personalised aftercare instructions \u2014 covering pain management, diet, and warning signs to watch for \u2014 so your recovery stays on track.\n\nNot every wisdom tooth needs removing: one that has erupted cleanly, bites against its opposite number and can be brushed is best left alone. Most of these patients come from nearby \u2014 Karve Nagar and Warje mainly \u2014 since a short trip home matters more on this one than on anything else we do.",
    benefits: [
      "Stops the cycle of recurrent infection, swelling and jaw pain",
      "Prevents damage to the healthy molar in front and to the surrounding bone",
      "Digital X-rays map root structure and nerve proximity before anything begins",
      "Minimally invasive technique where possible, meaning less swelling and shorter recovery",
      "Performed under local anaesthesia, in the practice",
      "Personalised written aftercare, not instructions given while you are still numb",
    ],
    whyAesthedent: [
      {
        title: "The X-ray decides, and you see it",
        desc: "Position, root structure and proximity to the inferior alveolar nerve are assessed before any plan is made. We show you the film and point at the actual problem rather than describing it.",
      },
      {
        title: "We will tell you to keep it",
        desc: "A wisdom tooth that has erupted fully, occludes with its opposite number and can be cleaned should stay. Not every one needs removing, and you should not be talked into surgery you do not need.",
      },
      {
        title: "Minimally invasive wherever the case allows",
        desc: "Technique is chosen to reduce surgical trauma, which is what drives less swelling, shorter recovery and fewer post-operative complications.",
      },
      {
        title: "Aftercare in writing",
        desc: "Pain management, diet, and the specific warning signs to watch for \u2014 handed to you on paper, because nobody retains verbal instructions with a numb jaw.",
      },
    ],
    process: [
      { step: 1, title: "Clinical evaluation and digital X-ray", desc: "We assess the tooth's exact position, its root structure, and how close the roots run to the nerve in the lower jaw." },
      { step: 2, title: "Decide whether it needs to come out", desc: "Some wisdom teeth are best left in place. If yours is one of them we will say so and you can go home." },
      { step: 3, title: "Plan the least invasive approach", desc: "The surgical approach is chosen for your specific anatomy, and we explain what it involves, what the recovery looks like, and what it costs." },
      { step: 4, title: "Local anaesthesia, tested first", desc: "We confirm you are properly numb before starting. You will feel firm pressure and movement, which is expected and is not pain. Raise a hand and we stop." },
      { step: 5, title: "Minimally invasive removal", desc: "The tooth is removed with as little surgical trauma as the case allows, which is what shortens the recovery that follows." },
      { step: 6, title: "Written aftercare and a check", desc: "Personalised instructions covering pain management, diet and warning signs, plus who to call if something does not feel right." },
    ],
    faqs: [
      {
        q: "Does every wisdom tooth need to come out?",
        a: "No. A wisdom tooth that has erupted fully, bites against the tooth above or below it and can be cleaned properly is better left in place. Removal is for teeth that are impacted, repeatedly infected, decayed, or damaging the tooth in front."
      },
      {
        q: "Does the removal hurt?",
        a: "It is done under local anaesthetic, which is tested before starting. You will feel firm pressure and movement - that is expected and is not pain. Discomfort afterwards is managed with prescribed painkillers."
      },
      {
        // CORRECTION #3: this is the ONE permitted use of "painless" on this
        // page - quoted as the phrase patients search, then answered honestly
        // rather than confirmed as a promise. It must not migrate to the H1,
        // the title or the hero.
        q: "Is painless wisdom tooth removal actually possible?",
        a: "“Painless wisdom tooth removal” is the phrase most people search, so it is worth answering plainly. Under local anaesthetic the extraction itself should not be painful - you will feel firm pressure and movement, which is a different sensation. What we cannot promise is the recovery: expect two or three days of swelling and soreness, managed with prescribed painkillers. Anyone guaranteeing you feel nothing at all is overselling it."
      },
      {
        q: "How long is the recovery?",
        a: "Typically two to three days of swelling and soreness, easing over about a week. Lower impacted teeth take longer than simple upper ones. Plan a quiet couple of days rather than assuming you will be back to normal that evening."
      },
      {
        q: "What can I eat afterwards?",
        a: "Soft, cool food for the first day or two, then build back up as it settles. Avoid drinking through a straw, smoking, and poking the socket - those are the things that most often disturb healing."
      },
      {
        q: "Should I bring someone with me?",
        a: "For a straightforward upper wisdom tooth, most people drive themselves home fine. For a lower impacted one, it is worth arranging a lift - not because you will be incapacitated, but because it is more comfortable than managing traffic with a numb, sore jaw."
      },
      {
        q: "What happens if I keep putting it off?",
        a: "An impacted wisdom tooth that keeps getting infected tends to keep getting infected. Left long enough it can decay the healthy molar in front of it, which turns one extraction into two problems. Earlier removal is generally the simpler procedure."
      }
    ]
  },
  {
    slug: "orthodontic-treatment",
    locality: "Kothrud, Pune",
    title: "Braces & Aligners",
    shortDesc: "Braces and clear aligners for children, teenagers and adults, with the plan explained before the first bracket.",
    problem: "Crowded, gappy or crooked teeth - and unsure whether it is too late?",
    solution: "Fixed braces or removable clear aligners move teeth into position over months, with regular short appointments to adjust progress.",
    benefit: "Straightening that fits round your life.",
    icon: "Sparkles",
    image: "/assets/treatment/orthodontics.jpeg",
    imageAlt: "Ceramic brackets and a clear aligner tray shown side by side",
    // MANDATORY CORRECTION #2 APPLIED. Dr. Sahil's draft promise read "our
    // orthodontists offer metal braces, ceramic braces, and clear aligners".
    // The clinic has no orthodontist on its credentials list (NEEDS-INPUT C10),
    // so the sentence now describes what is OFFERED and names no performer.
    // Do not reintroduce "our orthodontists" until a qualification is on file.
    hero: {
      headline: "Braces & Aligners for Every Age",
      promise:
        "Whether you're a teenager or starting in your 40s, Aesthedent offers metal braces, ceramic braces and clear aligners tailored to your smile goals.",
    },
    aboutHeading: "About Orthodontic Treatment in Kothrud",
    fullDescription: "It's never too late to invest in your smile. Whether you're a teenager, a young professional, or even in your 40s, modern orthodontic options allow for treatment that fits discreetly into your daily life without disrupting your work, appearance, or confidence.\n\nAt Aesthedent, every orthodontic case begins with a clinical evaluation of your bite, jaw alignment, and tooth positioning \u2014 not a one-size-fits-all recommendation. This assessment determines which treatment approach will give you the most predictable, stable result for your specific case.\n\nWhich option is right for you depends on the complexity of your case, your treatment goals, and your lifestyle \u2014 something we determine together during your initial consultation, not before it.\n\nTreatment duration varies by case but typically averages 18 to 24 months. Throughout this period, we schedule regular monitoring visits \u2014 generally every 4 to 6 weeks \u2014 to track progress, make adjustments, and ensure your treatment stays on course. That cadence is why nearly all of our orthodontic patients live close by, in Kothrud and Karve Nagar: over a two-year course, ten minutes each way is the difference between keeping appointments and quietly abandoning them.\n\nAt the end there is a retainer, and it is not optional. Teeth drift back if nothing holds them.",
    aboutList: {
      heading: "Types of orthodontic treatment we offer",
      items: [
        {
          title: "Metal braces",
          desc: "The most time-tested and versatile option, effective for both simple and complex misalignments, including cases involving significant crowding or bite correction.",
        },
        {
          title: "Ceramic braces",
          desc: "Function like metal braces but use tooth-coloured brackets, offering a less visible alternative for patients who want effective correction with a more discreet appearance.",
        },
        {
          title: "Clear aligners",
          desc: "A series of custom, removable trays that gradually shift teeth into position. Best suited for mild-to-moderate misalignment, and popular among working professionals for their near-invisibility and convenience.",
        },
      ],
    },
    benefits: [
      "Discreet options for adults who would rather the treatment were not obvious",
      "Metal braces remain the most predictable choice for complex movements",
      "Suitable from childhood through to adulthood \u2014 bone responds at 40 as it does at 14",
      "Short adjustment appointments every 4 to 6 weeks, close to home",
      "Straighter teeth are easier to clean, which helps the gums long-term",
      "A retention phase planned in from the start, not added as an afterthought",
    ],
    whyAesthedent: [
      {
        title: "Assessment before recommendation",
        desc: "Every case starts with a clinical evaluation of your bite, jaw alignment and tooth positioning. Which appliance suits you is decided during that consultation, not before it.",
      },
      {
        title: "An honest answer about aligners",
        desc: "Aligners only work while they are in your mouth, which realistically means around twenty-two hours a day. If your case or your habits suit fixed braces better, we will say so rather than sell the tidier option.",
      },
      {
        title: "The schedule is part of the decision",
        desc: "Eighteen months to two years, with a visit every four to six weeks. We would rather you weighed the cumulative travel honestly at the start than abandoned treatment halfway.",
      },
      {
        title: "Retention planned from the outset",
        desc: "Treatment is not finished when the appliance comes off. Retainers hold the result, and skipping them is the single most common reason people need orthodontics twice.",
      },
    ],
    process: [
      { step: 1, title: "Clinical evaluation and records", desc: "Photographs, scans and X-rays, plus an assessment of your bite, jaw alignment and tooth positioning \u2014 which is often not what the mirror suggests." },
      { step: 2, title: "Choose the appliance together", desc: "Metal, ceramic or clear aligners, chosen against the complexity of your case, your goals and your lifestyle rather than a default recommendation." },
      { step: 3, title: "Plan, timeline and full cost", desc: "Expected duration, visit frequency, and the total figure including the retention phase \u2014 agreed before the first bracket is bonded." },
      { step: 4, title: "Fitting", desc: "The appliance is fitted or the first aligners issued. Some tightness for a few days afterwards is normal and settles." },
      { step: 5, title: "Monitoring every 4 to 6 weeks", desc: "Short appointments to track progress and make adjustments, keeping the treatment on course over the full 18 to 24 months." },
      { step: 6, title: "Retention", desc: "Retainers fitted and explained, because this is the stage that decides whether the result you paid for is still there in five years." },
    ],
    faqs: [
      {
        q: "Am I too old for braces?",
        a: "No. Teeth move through bone by the same mechanism at any age, so adult orthodontics is entirely routine. It can take somewhat longer than in a teenager, and clear aligners make it far less conspicuous at work."
      },
      {
        q: "How long does treatment take?",
        a: "Commonly eighteen months to two years, though simple cases finish sooner and complex ones run longer. You will get an estimate for your case before you commit, not a generic range."
      },
      {
        q: "How often will I need to come in?",
        a: "Roughly every four to six weeks for an adjustment. The appointments themselves are short. It is the cumulative travel over two years that people underestimate, which is worth factoring in when choosing a practice."
      },
      {
        q: "Braces or clear aligners - which is better?",
        a: "Neither, in the abstract. Fixed braces give more predictable control for complex movements and work whether you cooperate or not. Aligners are removable and discreet but only work while worn, which realistically means about twenty-two hours a day. The honest question is which suits your case and your habits."
      },
      {
        q: "Does it hurt?",
        a: "Not the fitting itself. For a few days after fitting and after each adjustment the teeth feel tender and biting into hard food is uncomfortable. It settles, and ordinary painkillers cover it."
      },
      {
        q: "What is the right age for a child to be assessed?",
        a: "Around seven is the usual recommendation for a first look, because that is when problems with the developing bite become visible. That does not mean treatment starts then - most begins between ten and fourteen, once enough permanent teeth are through."
      },
      {
        q: "Do I really have to wear a retainer afterwards?",
        a: "Yes. Teeth have a strong tendency to drift back toward where they started, particularly in the first year. A retainer is what holds the result. Skipping it is the single most common reason people end up needing treatment twice."
      },
      {
        q: "What do braces cost in Pune?",
        a: "It depends on which appliance and how long the case runs - aligners and fixed braces are priced differently. You get the full figure, retainers included, before anything is fitted."
      }
    ]
  },
  {
    slug: "dentures",
    locality: "Kothrud, Pune",
    isFeatured: true,
    title: "Dentures",
    shortDesc: "Full and partial dentures fitted by a specialist prosthodontist, with a try-in you approve before they are made.",
    problem: "Dentures that slip, rub, or look like dentures?",
    solution: "Dentures made from precise records of how your mouth actually moves - with a wax try-in you see and approve before the final set is finished.",
    benefit: "Eat and speak without thinking about them.",
    icon: "Shield",
    image: "/assets/treatment/Dentures.jpeg",
    imageAlt: "A complete upper denture with anatomically arranged teeth and a natural gum-shade match",
    // MANDATORY CORRECTION #4 APPLIED. Dr. Sahil's draft names the "BPS
    // (Biofunctional Prosthetic System)" protocol. BPS is a certified,
    // trademarked system - naming it asserts accreditation we do not have on
    // file, which is why Phase 4D stripped it (NEEDS-INPUT C9). The TECHNIQUE it
    // describes is real and is retained in full: muscle-movement recording, bite
    // dynamics, facial-bow bite registration. Only the branded name is held.
    // [NEEDS-INPUT: is Dr. Sahil BPS-certified? Certificate restores the name.]
    hero: {
      headline: "A Beautiful Smile Begins with the Perfect Fit",
      promise:
        "Designed and fitted by Dr. Sahil Wathodkar, Prosthodontist \u2014 for a bite that feels natural, a fit that lasts, and a smile that doesn't look like \"false teeth\".",
    },
    aboutHeading: "About Dentures in Kothrud",
    fullDescription: "At Aesthedent, every case begins with a clinical evaluation of your jaw ridge, muscle attachments, and remaining natural teeth (if any) before we decide which type of denture is right for you.\n\nStandard dentures often look like \"false teeth\" and lack stability \u2014 a common complaint we hear from patients who've been fitted elsewhere. Our approach corrects this at the design stage: a natural gum-shade match, anatomically accurate tooth arrangement, and a bite registration process using a facial bow that restores your youthful facial contours rather than just filling a gap.\n\nWhether you need a single-arch complete denture, a cast metal partial, or a flexible partial, the treatment is planned and reviewed personally by Dr. Sahil Wathodkar, BDS, MDS (Prosthodontics), Bharati Vidyapeeth, Pune, from impression to final fit.\n\nMany of our denture patients come from Deccan and Erandwane, and several are brought by family. Bring whoever you want to the appointments, particularly the try-in \u2014 a second opinion on how the teeth look is genuinely useful.",
    aboutList: {
      heading: "The types of denture we work with",
      items: [
        {
          title: "Complete dentures",
          desc: "For patients who have lost all natural teeth in an arch, built using a protocol that records your muscle movements and bite dynamics with far greater accuracy than conventional dentures.",
        },
        {
          title: "Cast metal partial dentures",
          desc: "The gold standard for patients retaining some natural teeth. The cast metal framework distributes chewing force more evenly, fits with greater precision, and is significantly more durable and hygienic than acrylic-only alternatives.",
        },
        {
          title: "Flexible partial dentures",
          desc: "A metal-free, flexible-resin option for patients who want a lighter, more comfortable partial denture, with clasps that blend naturally into the gumline \u2014 ideal for a more discreet, aesthetic solution.",
        },
      ],
    },
    benefits: [
      "Records capture how your mouth moves, not just its shape at rest",
      "Facial-bow bite registration, so upper and lower meet as they should",
      "Natural gum-shade match and anatomically accurate tooth arrangement",
      "Restores the lip and cheek support that is lost when teeth go",
      "A wax try-in you see, speak with and approve before the set is finished",
      "Planned and reviewed personally by an MDS-qualified prosthodontist",
    ],
    whyAesthedent: [
      {
        title: "Corrected at the design stage",
        desc: "\"Looks like false teeth\" is a design failure, not an inevitability. Shade, length and arrangement are chosen against your face and your age before anything is processed.",
      },
      {
        title: "Bite registration with a facial bow",
        desc: "This is what restores facial contour rather than simply filling a gap \u2014 and it is the step most often skipped when a denture ends up rocking or ageing the face.",
      },
      {
        title: "The right type for your ridge",
        desc: "Complete, cast metal partial or flexible partial. The choice follows an evaluation of your jaw ridge, muscle attachments and remaining teeth, not a house preference.",
      },
      {
        title: "Adjustments are part of the plan",
        desc: "You cannot tell how a denture behaves until you have chewed with it. Sore spots should be adjusted, not endured, and those visits are expected rather than a sign of a problem.",
      },
    ],
    process: [
      { step: 1, title: "Evaluate the ridge and remaining teeth", desc: "Jaw ridge, muscle attachments and any natural teeth you still have \u2014 this is what determines which type of denture is right for you." },
      { step: 2, title: "Precision impressions", desc: "Records that capture muscle movement and bite dynamics, not just the resting shape of the mouth. This stage decides whether the finished denture holds." },
      { step: 3, title: "Bite registration with a facial bow", desc: "Your bite is related to your jaw joints so the upper and lower sets meet correctly and facial height is restored properly." },
      { step: 4, title: "The wax try-in \u2014 your decision", desc: "Teeth set in wax for you to see and speak with. Too long, too white, not like you? Say so now, while changing it costs nothing." },
      { step: 5, title: "Processing and final fit", desc: "The approved arrangement is processed into the finished denture and fitted, with the occlusion checked at delivery." },
      { step: 6, title: "Review and adjustment", desc: "A short series of adjustment visits once you have eaten with them, because that is the only way to find the pressure spots." },
    ],
    faqs: [
      {
        q: "Will they look like false teeth?",
        a: "That depends on how the teeth are set, which is why there is a try-in stage. Shade, length and arrangement are all chosen against your face and your age, and you see them in wax and approve them before the final set is made."
      },
      {
        q: "How long does the whole process take?",
        a: "Usually four to five appointments spread over a few weeks. The records and the try-in are what take the time, and rushing them is what produces dentures that do not fit."
      },
      {
        q: "Will I be able to eat normally?",
        a: "You will manage a much wider diet than without them, but a denture is not the same as natural teeth - expect to start with softer food and build up, and expect the first couple of weeks to feel strange. Lower dentures are harder to stabilise than upper ones, which is worth knowing in advance."
      },
      {
        q: "Will they affect my speech?",
        a: "For a short while, yes. Most people find certain sounds awkward for the first week or two and then stop noticing. Reading aloud at home speeds it up considerably."
      },
      {
        q: "What is the difference between a full and a partial denture?",
        a: "A full denture replaces all the teeth in a jaw and is held by suction and muscle control. A partial replaces some of them and is supported by the teeth that remain - so it has to be designed carefully to avoid overloading them."
      },
      {
        q: "Can implants make a loose lower denture stable?",
        a: "Often, yes. A small number of implants can be used to secure a lower denture, which is the arrangement most people find transformative because lower dentures are the ones that tend to move. Whether it suits you depends on the bone available, which the scan shows."
      },
      {
        q: "Do they need adjusting after fitting?",
        a: "Almost always. You cannot tell how a denture behaves until you have chewed with it, so a couple of adjustment visits are part of the normal process rather than a sign of a problem. Sore spots should be adjusted, not endured."
      },
      {
        q: "How do I look after them?",
        a: "Clean them over a basin of water so they survive being dropped, brush them daily with a denture brush rather than toothpaste, and leave them out overnight so the tissues underneath recover. Bring them to your reviews."
      }
    ]
  },
  {
    slug: "digital-smile-design",
    locality: "Pune",
    isFeatured: true,
    title: "Digital Smile Design",
    shortDesc: "Plan and preview a cosmetic result on screen, and try it in your mouth, before any treatment starts.",
    problem: "Want cosmetic work but afraid of how you will look afterwards?",
    solution: "Digital Smile Design plans the result from photographs and scans, then produces a physical mock-up you can wear before any tooth is touched.",
    benefit: "See it before you commit to it.",
    icon: "Sparkles",
    image: "https://images.pexels.com/photos/9951391/pexels-photo-9951391.jpeg",
    imageAlt: "A smile design being planned on screen against a full-face photograph",
    // [NEEDS-INPUT C9] "Digital Smile Design" is offered industry-wide as a
    // branded protocol with formal accreditation. No certification is on file, so
    // this copy describes the METHOD and claims no accredited-provider status.
    hero: {
      headline: "See and test-drive your perfect smile before we even start treatment",
      promise:
        "Digital Smile Design in Kothrud, Pune \u2014 see and test-drive your perfect smile in 3D before treatment begins.",
    },
    aboutHeading: "About Digital Smile Design in Kothrud",
    fullDescription: "Most patients considering a smile makeover have the same question: what if I don't like the result? Digital Smile Design (DSD) exists to remove that uncertainty entirely \u2014 not through guesswork, but through a structured, evidence-based planning protocol used in cosmetic and restorative dentistry.\n\nAt Aesthedent, the process begins with high-resolution facial and intraoral photography, video analysis of your natural smile and speech patterns, and 3D intraoral scanning. This data is mapped against established facial esthetic parameters \u2014 your midline, smile line, lip dynamics, and gingival architecture \u2014 to build a precise digital blueprint of your new smile, calibrated to your face rather than a generic template.\n\nFrom this blueprint, we fabricate a physical mock-up you can wear and evaluate in function: speaking, smiling, biting, looking in the mirror \u2014 all before a single tooth is prepared or any permanent restoration is placed. This step lets both you and your dentist assess esthetics, phonetics, and occlusion in real time, and correct anything digitally rather than irreversibly.\n\nThe result: a smile that's biomechanically and esthetically integrated with your natural anatomy \u2014 one you've already seen, tried on, and approved, long before it becomes permanent.\n\nSmile design work here is planned by Dr. Sahil Wathodkar, BDS, MDS (Prosthodontics), Bharati Vidyapeeth, Pune, whose specialist training covers exactly this: how replacement teeth should be shaped, proportioned and arranged. Cosmetic work draws patients from further afield than routine treatment \u2014 Deccan and Erandwane in our case \u2014 because it is elective and people choose deliberately.",
    benefits: [
      "The result is agreed before any irreversible work begins",
      "Designed against your midline, smile line, lip dynamics and gingival architecture",
      "Video analysis captures how your smile actually moves, not how it poses",
      "A physical mock-up you can wear, speak with and evaluate in function",
      "Esthetics, phonetics and occlusion assessed in real time, not after fitting",
      "Corrections are digital and free at this stage, irreversible and costly after it",
    ],
    whyAesthedent: [
      {
        title: "Calibrated to your face, not a template",
        desc: "Facial esthetic parameters are measured and the design is built against them. A set of teeth that looks correct in isolation can look obviously wrong in a face.",
      },
      {
        title: "Tested in function, not just on screen",
        desc: "The mock-up is evaluated while you speak, smile and bite \u2014 phonetics and occlusion, not only appearance. Plenty of designs look right and sound wrong.",
      },
      {
        title: "Planned by a prosthodontist",
        desc: "Dr. Sahil Wathodkar's MDS training is precisely this discipline: how replacement teeth should be shaped, proportioned and arranged so they work as well as they look.",
      },
      {
        title: "We will tell you when to do less",
        desc: "The design shows how far back treatment realistically needs to go, which is often fewer teeth than people expect. Not every case needs veneers on every tooth.",
      },
    ],
    process: [
      { step: 1, title: "Photography, video and 3D scanning", desc: "High-resolution facial and intraoral photography, video analysis of your natural smile and speech, and a 3D intraoral scan. No impression trays." },
      { step: 2, title: "Facial analysis", desc: "The data is mapped against established esthetic parameters \u2014 midline, smile line, lip dynamics and gingival architecture." },
      { step: 3, title: "The digital blueprint", desc: "A precise design calibrated to your face, shown to you on screen. Your opinion at this stage carries the same weight as ours." },
      { step: 4, title: "The physical mock-up", desc: "The blueprint transferred into your mouth in temporary material, without preparing a single tooth. Wear it, speak with it, take it home." },
      { step: 5, title: "Assess and correct digitally", desc: "Esthetics, phonetics and occlusion evaluated in function. Anything that is not right is corrected in the design rather than in your teeth." },
      { step: 6, title: "Then, the treatment itself", desc: "Whatever the approved plan requires \u2014 veneers, crowns, bonding or alignment first \u2014 executed against a result you have already seen and approved." },
    ],
    faqs: [
      {
        q: "Is Digital Smile Design a treatment?",
        a: "No, it is a planning method. It determines what the final result should look like, and the treatment that follows might be veneers, crowns, bonding, orthodontics or a combination. Planning it first is what stops the result being a surprise."
      },
      {
        q: "What is the mock-up?",
        a: "The approved design placed in your mouth in a temporary material, without cutting your teeth. You can see it, speak with it and take it home for a day. It is the difference between imagining a result and looking at one."
      },
      {
        q: "Can I change my mind about the design?",
        a: "That is the entire purpose of the process. Changes at the design and mock-up stage cost time only. Changes after teeth have been prepared are expensive and sometimes not fully reversible, which is why we front-load the decisions."
      },
      {
        q: "Will my teeth look fake?",
        a: "Only if they are designed that way. Uniform, very white, identically shaped teeth are what read as artificial. Designing against your facial proportions and leaving natural variation is what avoids it - and you approve the look before anything is made."
      },
      {
        q: "Does any part of it hurt?",
        a: "The planning does not. Photographs, scanning and the mock-up are all non-invasive and involve no anaesthetic. Any discomfort belongs to the treatment that follows, and we will explain that separately once the plan is agreed."
      },
      {
        q: "Do I need to have every tooth done?",
        a: "Usually not. The design shows how far back the treatment realistically needs to go for the result to look even, which is often fewer teeth than people expect. If we think you are proposing more work than you need, we will say so."
      },
      {
        q: "What does Digital Smile Design cost in Pune?",
        a: "The planning and the treatment that follows are costed separately, because the treatment varies enormously depending on what the design calls for. You get both figures before committing to anything beyond the initial consultation."
      }
    ]
  }
];

export function getServiceBySlug(slug) {
  return services.find(service => service.slug === slug);
}

export function getAllServiceSlugs() {
  return services.map(service => service.slug);
}
