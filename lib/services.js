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
    fullDescription: "A dental implant replaces the root of a missing tooth. A titanium post is placed into the jawbone, left to integrate with it, and then topped with a crown, bridge or denture. Unlike a removable plate, it is fixed - you chew on it and clean it much like a natural tooth.\n\nThe part patients rarely hear is that an implant is a restorative procedure as much as a surgical one. Where the post sits determines whether the final tooth can be made to bite correctly, so the finished tooth has to be planned before the implant goes in, not after. That planning is what your treatment here is built around, and it is done by Dr. Sahil Wathodkar, BDS, MDS (Prosthodontics), Bharati Vidyapeeth, Pune.\n\nPatients travel to us from Bavdhan and Warje for implant work, largely because it is a decision people research rather than make on proximity. That is reasonable - this is a treatment you live with for a long time, and it is worth asking whoever plans it what their qualification actually is.\n\nWe will tell you if an implant is not the right answer for you. Sometimes a bridge is simpler, cheaper and just as durable, and you should hear that before you commit to surgery.",
    benefits: [
      "Fixed in place - no slipping, no adhesive, no removing it at night",
      "Loads the jawbone the way a natural root does, which helps preserve it",
      "Cleaned like a normal tooth, not soaked in a glass",
      "Replaces one tooth without cutting down the healthy teeth either side",
      "Planned by an MDS-qualified prosthodontist, not referred out"
    ],
    process: [
      { step: 1, title: "See the gap on screen", desc: "We scan the area and show you the 3D image - the bone you have, the space available, and what is realistically possible." },
      { step: 2, title: "Hear it in plain words", desc: "What an implant would involve for your case specifically, how long each stage takes, and the honest alternatives including doing nothing." },
      { step: 3, title: "Agree the plan and the cost", desc: "The final tooth is designed first, so the implant position serves it. Nothing is ordered or booked until you have said yes to the plan and the figure." },
      { step: 4, title: "Placement, fully numb", desc: "The site is numbed and tested before we begin, and you are told what is happening as it happens. Raise a hand and we stop." },
      { step: 5, title: "Healing and the final tooth", desc: "The implant integrates over some months, then the crown is fitted and adjusted. We review the bite afterwards rather than assuming it settled." }
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
    fullDescription: "Root canal treatment is what saves a tooth once the nerve inside it has become infected. The pulp is removed, the canals are cleaned and disinfected, and the space is sealed so bacteria cannot get back in. The tooth stays in your mouth, which is nearly always a better outcome than removing it and dealing with the gap later.\n\nIt is worth being clear about the pain, because the reputation is what stops people coming. A root canal relieves pain - it does not create it. What hurts is the infected nerve you already have. Under proper anaesthetic most people report the appointment feels much like having a filling done. That is a statement about the procedure, not a promise about your nerves; if it turns out you need more anaesthetic, you say so and you get more.\n\nRoot canals and everyday restorative work here are handled by Dr. Aishwarya Kulkarni Wathodkar, BDS, Bharati Vidyapeeth, Pune, a general and family dentist with additional training in endodontics.\n\nBecause an infected tooth is urgent and nobody wants to cross the city with one, most of these patients come from Kothrud itself and the Paud Road side. If you are in pain today, phone rather than email.\n\nThe part people skip is the crown afterwards. A treated tooth is more brittle than a live one and usually needs covering to stop it splitting. We will tell you whether yours does.",
    benefits: [
      "Keeps the natural tooth rather than extracting it",
      "Settles the pain of an infected nerve at its source",
      "Stops the infection spreading into the bone around the root",
      "Avoids the cost and complication of replacing a missing tooth later",
      "Usually completed in one or two visits depending on the tooth"
    ],
    process: [
      { step: 1, title: "Confirm it on the X-ray", desc: "We take a digital X-ray and show it to you - which tooth, how far the infection has gone, and whether a root canal is genuinely the answer." },
      { step: 2, title: "Explain what is involved", desc: "How many visits your tooth is likely to need, whether it will need a crown afterwards, and what happens if you leave it." },
      { step: 3, title: "Agree it before we start", desc: "Including the cost, and the cost of the crown if one is needed - so the second figure is not a surprise at the second appointment." },
      { step: 4, title: "Numb, then cleaned and sealed", desc: "We test that you are numb before starting and keep telling you what is coming next. If you need a break, raise a hand." },
      { step: 5, title: "Protect it and review", desc: "A crown where the tooth needs one, then a check that the bite feels right - a filling or crown a fraction too high is the usual cause of lingering soreness." }
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
    fullDescription: "Full mouth rehabilitation is what you need when the problem is no longer a tooth but the whole bite. It applies to severe wear, multiple failing restorations, teeth lost across both sides, or a bite that has collapsed over years and taken the lower face down with it.\n\nThis is prosthodontics in its most literal sense, and it is the reason a prosthodontist exists as a separate qualification. Treating eight teeth one at a time produces eight technically adequate restorations that do not work together. The bite has to be planned as a single system - where the jaw closes, how the front teeth guide it, how much height can be restored without overloading the joints - and then delivered in a sequence that keeps you functional throughout. That planning is done here by Dr. Sahil Wathodkar, BDS, MDS (Prosthodontics), Bharati Vidyapeeth, Pune.\n\nPatients come to us for this from Erandwane and Bavdhan, and the distance matters less here than for anything else we do. Full mouth work is months of staged appointments, so people choose on who is planning it rather than on how far they are driving.\n\nWe will be straightforward about the scale. This is the largest treatment on our list in time, in cost and in commitment. You will get the staging and the figures before the first appointment, and you can stop between stages.",
    benefits: [
      "The bite is planned as one system, not eight separate repairs",
      "Restores chewing on both sides rather than one comfortable corner",
      "Addresses the facial height that collapses as teeth wear down",
      "Staged over months, so you are never left without working teeth",
      "Planned and sequenced by an MDS-qualified prosthodontist"
    ],
    process: [
      { step: 1, title: "Full records, shown to you", desc: "Scans, photographs and X-rays of everything, plus how your jaw actually closes. You see the whole picture at once, which for most people is the first time." },
      { step: 2, title: "The problem, explained in order", desc: "Which issues are urgent, which are cosmetic, and which are causing the others. Not everything on the list has to be done, and we will say which parts are optional." },
      { step: 3, title: "A staged plan with figures", desc: "Broken into phases with a cost against each, so you can see what committing to phase one does and does not commit you to." },
      { step: 4, title: "Rebuilt phase by phase", desc: "Each phase is completed and settled before the next begins, and you keep a working bite throughout. You can pause between phases." },
      { step: 5, title: "Bite review, then maintenance", desc: "A rebuilt bite needs checking under real chewing, not just at the fitting appointment. We adjust it, then set a review interval." }
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
    // S1/S2 family (audit/01-content-spine.md §5.1): "Colored" -> "Coloured",
    // Indian English. Drives the H1, the <title> and every card label.
    title: "Tooth-Coloured Fillings",
    shortDesc: "Composite fillings matched to your tooth shade, keeping as much natural tooth as possible.",
    problem: "A small cavity, or old grey metal fillings you would rather not see?",
    solution: "Composite fillings bond directly to the tooth, so less healthy tooth has to be cut away - and they are matched to your own shade.",
    benefit: "Repairs that don't announce themselves.",
    icon: "Shield",
    image: "/assets/treatment/color-filling.jpeg",
    fullDescription: "A tooth-coloured filling is a composite resin bonded directly into the prepared cavity and shaped to match the tooth around it. There are two real advantages over the older metal fillings. The obvious one is that you cannot see it. The one that matters more clinically is that because composite bonds to the tooth, less healthy tooth structure has to be removed to hold the filling in - with metal, the cavity has to be cut to a shape that grips.\n\nThis is straightforward, single-visit treatment, and it is the least dramatic thing on this page. Most of our filling patients are simply local - Kothrud and the Paud Road side - because for a half-hour appointment nobody sensibly drives across Pune.\n\nEveryday restorative work here is done by Dr. Aishwarya Kulkarni Wathodkar, BDS, Bharati Vidyapeeth, Pune, a general and family dentist.\n\nOne honest note: a filling is the right answer for a cavity, not for a tooth that has broken badly or lost a cusp. If yours needs a crown instead we will show you why on the scan rather than placing a large filling that fails in a year.",
    benefits: [
      "Matched to your own tooth shade",
      "Bonds to the tooth, so less healthy structure is cut away",
      "Usually done in a single visit",
      "No mercury or metal",
      "Can replace old metal fillings that have started to leak or stain"
    ],
    process: [
      { step: 1, title: "Look at the cavity together", desc: "On the intraoral camera or X-ray, so you can see the size of it rather than take our word for how urgent it is." },
      { step: 2, title: "Say whether a filling is right", desc: "For a cavity, yes. For a badly broken tooth, a filling will fail and we will explain why a crown is the better answer." },
      { step: 3, title: "Agree it, then match the shade", desc: "Cost confirmed first, then the composite shade is chosen against your own enamel in natural light." },
      { step: 4, title: "Numbed if you want it", desc: "Shallow cavities often do not need anaesthetic - but it is your call, not ours, and there is no prize for going without." },
      { step: 5, title: "Shape, polish, check the bite", desc: "Polished so it feels like tooth and not like a patch, then the bite is checked. A filling left high is the usual reason a tooth aches afterwards." }
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
    // [NEEDS-INPUT C11] No clinician on /doctor lists oral surgery among their
    // credentials, so this page deliberately names nobody. Do not attribute this
    // treatment to a named doctor until qualifications are confirmed.
    fullDescription: "Wisdom teeth cause trouble when there is not enough room for them. They come in at an angle, get partly covered by gum, and that flap traps food and bacteria - which is why the symptom is usually a recurring ache and bad taste rather than one dramatic event.\n\nNot every wisdom tooth needs removing. One that has come through cleanly, bites against its opposite number and can be brushed is best left alone. The decision comes from the X-ray: how the tooth is lying, how close its roots sit to the nerve in the lower jaw, and whether it is realistically cleanable. We will show you the film and point at the actual problem.\n\nIf it does need to come out, it is done under local anaesthetic. You are numb, you feel pressure and movement but not pain, and you are told what is happening throughout. The recovery is the part worth planning around: expect two or three days of swelling and soreness, and arrange to be driven home if you would rather not travel alone afterwards. That is why most of these patients come from nearby - Karve Nagar and Warje mainly - since a short trip home matters more on this one than on anything else we do.\n\nWe will give you written aftercare, not verbal instructions you have to remember while your mouth is numb.",
    benefits: [
      "Stops the cycle of recurring infection and swelling",
      "Protects the healthy molar in front from decay at the contact point",
      "Removes a tooth you cannot realistically keep clean",
      "Done under local anaesthetic, in the practice",
      "Written aftercare rather than instructions given while you are still numb"
    ],
    process: [
      { step: 1, title: "X-ray, and we show you it", desc: "How the tooth is angled, how developed the roots are, and how close they run to the nerve in the lower jaw." },
      { step: 2, title: "Whether it needs to go at all", desc: "Some wisdom teeth are fine and should be left. If yours is one of them we will say so and you can go home." },
      { step: 3, title: "The plan, the cost, the recovery", desc: "How long it should take, what the days afterwards look like, and what it costs - agreed before anything is booked." },
      { step: 4, title: "Numbed, then removed", desc: "We check you are properly numb first. You will feel pressure, which is normal and not the same as pain. Raise a hand and we stop." },
      { step: 5, title: "Aftercare in writing, then a check", desc: "What to eat, what to avoid, how to keep the socket clean, and who to call if something is not right." }
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
    // S2 (audit/01-content-spine.md §5.1): "Orthodontic Treatment" is clinician
    // vocabulary; patients search "braces". Drives H1, <title> and card labels.
    title: "Braces & Aligners",
    shortDesc: "Braces and clear aligners for children, teenagers and adults, with the plan explained before the first bracket.",
    problem: "Crowded, gappy or crooked teeth - and unsure whether it is too late?",
    solution: "Fixed braces or removable clear aligners move teeth into position over months, with regular short appointments to adjust progress.",
    benefit: "Straightening that fits round your life.",
    icon: "Sparkles",
    image: "/assets/treatment/orthodontics.jpeg",
    // [NEEDS-INPUT C10] Neither clinician on /doctor lists orthodontics among
    // their credentials. This page names nobody and claims no specialist status
    // for the treatment. Do not add attribution until qualifications are confirmed.
    fullDescription: "Straightening teeth is a slow, mechanical process: steady light pressure moves teeth through bone over months, and the bone rebuilds behind them. That is why it cannot be rushed, and why the appointments are frequent but short.\n\nThere are two broad options. Fixed braces are bonded to the teeth and work continuously, which makes them the more predictable choice for complicated movements. Clear aligners are removable and far less visible, which suits adults who would rather not announce the treatment at work - but they only work while they are actually in your mouth, which for most cases means around twenty-two hours a day. Being honest with yourself about that is the main thing that decides between them.\n\nIt is not too late. Adult orthodontics is routine now, and bone responds to the same forces at forty as at fourteen; it simply takes a little longer.\n\nThe practical consideration people underestimate is the schedule. Treatment usually runs eighteen months to two years with an adjustment every four to six weeks, which is a lot of short trips. That is why nearly all of our orthodontic patients live close by, in Kothrud and Karve Nagar - over a two-year course, ten minutes each way is the difference between keeping appointments and quietly abandoning them.\n\nAt the end there is a retainer, and it is not optional. Teeth drift back if nothing holds them.",
    benefits: [
      "Clear aligners available for adults who would rather it were not obvious",
      "Fixed braces for cases that need more predictable control",
      "Suitable from childhood through to adulthood",
      "Short adjustment appointments, close to home",
      "Straighter teeth are easier to clean, which helps the gums long-term"
    ],
    process: [
      { step: 1, title: "See the problem measured", desc: "Photographs, scans and X-rays, and a look at how your teeth actually meet - which is often not what people expect from the mirror." },
      { step: 2, title: "Braces or aligners, honestly", desc: "Which is realistic for your case and your discipline. Aligners suit some people badly, and we will say so rather than sell the tidier option." },
      { step: 3, title: "The plan, the timeline, the cost", desc: "Expected duration, how often you will need to come in, and the full figure including retainers - agreed before the first appliance is fitted." },
      { step: 4, title: "Fitting and regular adjustments", desc: "Fitting takes a while; the adjustments afterwards are short. Some tightness for a few days after each one is normal and settles." },
      { step: 5, title: "Retainers, and keeping them", desc: "The treatment is not finished when the braces come off. Retainers hold the result, and we will show you what happens if they are abandoned." }
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
    // S1 (audit/01-content-spine.md §5.1): was "Specialist Grade Dentures".
    // "Specialist Grade" is an unsourced quality claim and nobody searches it.
    // NOTE: this drives the H1 and <title> of one of only three INDEXED pages.
    title: "Dentures",
    shortDesc: "Full and partial dentures fitted by a specialist prosthodontist, with a try-in you approve before they are made.",
    problem: "Dentures that slip, rub, or look like dentures?",
    solution: "Dentures made from precise records of how your mouth actually moves - with a wax try-in you see and approve before the final set is finished.",
    benefit: "Eat and speak without thinking about them.",
    icon: "Shield",
    image: "/assets/treatment/Dentures.jpeg",
    fullDescription: "A denture is a removable replacement for missing teeth - a full set where all the teeth are gone, or a partial one that clips around the teeth you still have. Made well, it restores chewing, supports the lips and cheeks, and does not look like dentistry. Made badly, it rocks, rubs and gets left in a drawer.\n\nThe difference is almost entirely in the records. A denture is held by suction and by the muscles around it, so the impression has to capture how your mouth moves, not just its shape at rest. The bite has to be registered so the upper and lower sets meet correctly. And the teeth have to be set to suit your face and your age rather than to a standard arrangement. This is core prosthodontic work, and it is done here by Dr. Sahil Wathodkar, BDS, MDS (Prosthodontics), Bharati Vidyapeeth, Pune.\n\nYou see the teeth before they are finished. At the try-in stage they are set in wax so you can look at them, speak with them, and say if they are too long, too white or not like you - while it is still easy to change.\n\nMany of our denture patients come from Deccan and Erandwane, and several are brought by family. That is fine - bring whoever you want to the appointments, particularly the try-in, because a second opinion on how the teeth look is genuinely useful.\n\nIt takes several visits. We would rather take the extra appointment than hand over a set that rubs.",
    benefits: [
      "Made from records of how your mouth moves, not just its resting shape",
      "Wax try-in stage - you approve the look before the set is finished",
      "Teeth set to suit your face and age, not a standard arrangement",
      "Restores the lip support that is lost when teeth go",
      "Partial dentures designed to protect the remaining teeth, not strain them"
    ],
    process: [
      { step: 1, title: "Look at what is there", desc: "The ridges, any remaining teeth, and how an existing denture is failing if you have one - shown to you, so the problem is visible rather than described." },
      { step: 2, title: "Full or partial, and why", desc: "Whether teeth can be saved and worked around, and how implants could stabilise a lower denture if that is relevant to you." },
      { step: 3, title: "Precision records and the bite", desc: "Impressions that capture muscle movement, then the bite registered so upper and lower meet properly. This is the stage that decides whether it fits." },
      { step: 4, title: "The wax try-in - your call", desc: "Teeth set in wax for you to see and speak with. Too long, too white, not like you? Say so now; changing it later means remaking it." },
      { step: 5, title: "Fitting, then the adjustments", desc: "A new denture nearly always needs adjusting once you have eaten with it. Those appointments are expected, not a sign something went wrong." }
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
    // [NEEDS-INPUT C9] "Digital Smile Design" is presented industry-wide as a
    // branded protocol with formal accreditation. We have no named certification
    // on file, so this copy describes the METHOD (photographs, scans, mock-up)
    // and does not claim accredited-provider status.
    fullDescription: "Digital Smile Design is a planning method, not a treatment in itself. The point of it is to decide what the result should look like before any irreversible work begins, rather than discovering the answer at the fitting appointment.\n\nIt works from photographs of your face and scans of your teeth. The proposed teeth are designed against your facial proportions, your lip line and how much tooth actually shows when you talk and smile - because a set of teeth that looks correct in isolation can look obviously wrong in a face. You see the design on screen and can push back on it.\n\nThe stage that matters most is the mock-up. The planned shape is transferred into your mouth in a temporary material, so you can look at it, speak with it and go home and think about it. If it is too long, too square or too white, you say so and it is changed - at a stage where changing it costs nothing but time.\n\nSmile design work here is planned by Dr. Sahil Wathodkar, BDS, MDS (Prosthodontics), Bharati Vidyapeeth, Pune, whose specialist training covers exactly this: how replacement teeth should be shaped, proportioned and arranged.\n\nCosmetic work draws patients from further afield than routine treatment - Deccan and Erandwane in our case - because it is elective and people choose deliberately.\n\nWe will also tell you when the honest answer is to do less. Not every case needs veneers on every tooth.",
    benefits: [
      "The result is agreed before any irreversible work begins",
      "Teeth designed against your face, not to a standard template",
      "A physical mock-up you can wear, speak with and think about",
      "Changes are free at the design stage and expensive after it",
      "Planned by an MDS-qualified prosthodontist"
    ],
    process: [
      { step: 1, title: "Photographs and scans", desc: "Your face at rest, talking and smiling, plus a 3D scan of the teeth. No impression trays." },
      { step: 2, title: "What you actually want, in words", desc: "Whiter, straighter, longer, or simply less obviously repaired - these mean different things to different people, so we pin it down before designing anything." },
      { step: 3, title: "The design, on screen and open to argument", desc: "Proposed shape and proportion shown against your own face. Your opinion at this stage carries the same weight as ours." },
      { step: 4, title: "The mock-up, worn home", desc: "The design placed in your mouth in temporary material. Look at it in your own mirror and lighting, not ours, and take a day over it." },
      { step: 5, title: "Only then, the actual treatment", desc: "Whatever the plan requires - veneers, crowns, bonding, alignment first - carried out against a design you have already approved." }
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
