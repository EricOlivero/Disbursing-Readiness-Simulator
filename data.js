window.DRS_DATA = {
  lessons: [
    {
      id: "accountability-stack",
      title: "Accountability Stack: Who Owns What",
      body: "Disbursing is not just paying cash. It is a chain of accountability. Every handoff must explain who has the funds, what authority supports the funds, what document proves the handoff, and what must return at closeout.",
      why: "When members only memorize transactions, they miss the reason cash must balance. The stack keeps them from confusing budget authority, disbursing accountability, cashier custody, and paying agent responsibility.",
      do: [
        "State the mission purpose and funding limit.",
        "Identify the Disbursing Officer or DDO accountable for the advance.",
        "Identify who physically holds the funds at each point.",
        "Tie every cash movement to a source document.",
        "Explain what evidence must return before closeout."
      ],
      failure: [
        "The team can name the cash amount but cannot name who is accountable.",
        "A member treats a budget approval as proof that cash was advanced.",
        "A payment is made but nobody can explain what supporting document closes the loop."
      ],
      prompt: "A paying agent says, 'The commander approved it, so I can pay and settle it later.' What is the best response?",
      choices: [
        {
          label: "Correct the accountability chain before payment.",
          detail: "Commander intent matters, but the cash holder, authority, supporting documents, and closeout requirement must be clear first.",
          correct: true,
          feedback: "Correct. Approval does not replace custody, documentation, or closeout accountability."
        },
        {
          label: "Pay now because command intent is enough.",
          detail: "This skips disbursing accountability and invites an unsupported transaction.",
          correct: false,
          feedback: "Not enough. Command intent does not prove funds advanced, funds held, or payment support."
        },
        {
          label: "Wait until the end of mission to decide who owns the cash.",
          detail: "This creates a gap exactly when the team is under pressure.",
          correct: false,
          feedback: "Too late. Accountability must be clear before cash moves."
        }
      ],
      lab: {
        type: "form",
        title: "Accountability chain drill",
        prompt: "Say what each role proves during a cash mission.",
        rows: [
          { label: "Commander", value: "Mission intent and risk acceptance" },
          { label: "Budget Officer", value: "Purpose, limit, and LOA availability" },
          { label: "DDO/DA/Cashier", value: "Funds advanced, held, paid, and returned" },
          { label: "Paying Agent", value: "Receipts, rate used, cash remaining, explanation" }
        ]
      }
    },
    {
      id: "dd1081-purpose",
      title: "DD 1081: Statement of Agent Officer Account",
      body: "For training purposes, treat DD 1081 as the handoff and return accountability document. It tells the team what funds were advanced to an accountable agent and what must come back as cash, paid vouchers, or other authorized support.",
      why: "A member who understands the DD 1081 can explain the mission's beginning and end. Without that, closeout becomes guessing.",
      do: [
        "Verify the amount advanced before the mission starts.",
        "Tie the advance to the role receiving the funds.",
        "Track cash remaining and supported payments against the advance.",
        "Use it during closeout to explain the return of funds and documents."
      ],
      failure: [
        "The team treats the DD 1081 as a generic receipt.",
        "Cash returned plus supported payments does not equal the advance.",
        "The paying agent cannot explain shortages, overages, or unsupported payments."
      ],
      prompt: "What question should DD 1081 help the team answer at closeout?",
      choices: [
        {
          label: "What happened to every dollar advanced?",
          detail: "Cash returned plus supported transactions should explain the advance.",
          correct: true,
          feedback: "Correct. DD 1081 is the accountability bridge from advance to return."
        },
        {
          label: "Which items were tactically useful?",
          detail: "That may matter for the mission, but it is not the form's main purpose.",
          correct: false,
          feedback: "Mission usefulness is not enough. The form is about accountable funds."
        },
        {
          label: "Who liked the vendor best?",
          detail: "This has no closeout value.",
          correct: false,
          feedback: "No. Keep the learner focused on accountability and support."
        }
      ],
      lab: {
        type: "form",
        title: "DD 1081 closeout equation",
        prompt: "Advance must be explained by cash returned plus supported payments.",
        rows: [
          { label: "Funds advanced", value: "$4,000" },
          { label: "Supported payments", value: "$1,275" },
          { label: "Cash expected back", value: "$2,725" }
        ]
      }
    },
    {
      id: "dd2665-purpose",
      title: "DD 2665: Daily Agent Accountability Summary",
      body: "For training purposes, treat DD 2665 as the daily balancing summary. It helps the cashier or agent organize cash on hand, vouchers, collections, advances, and the explanation for the final accountability position.",
      why: "This is where weak manual balancing shows up. The form forces a disciplined count instead of a vibe check.",
      do: [
        "Count physical cash by denomination.",
        "Separate supported vouchers from unsupported notes.",
        "Compare expected accountability to actual cash and support.",
        "Write a clear explanation for any variance."
      ],
      failure: [
        "The member can enter numbers but cannot explain what the form proves.",
        "Foreign currency is counted but not converted consistently.",
        "Receipts are included without confirming they are valid support."
      ],
      prompt: "A trainee has cash, receipts, and a shortage. What should they do on the DD 2665-style closeout?",
      choices: [
        {
          label: "Count, compare, identify support, and explain the variance.",
          detail: "The form is a disciplined accountability summary.",
          correct: true,
          feedback: "Correct. Balancing requires both math and explanation."
        },
        {
          label: "Enter the receipts as cash so the total balances.",
          detail: "Receipts and cash are not the same thing.",
          correct: false,
          feedback: "No. Receipts may support payments, but they do not become physical cash."
        },
        {
          label: "Ignore the shortage if the team was under stress.",
          detail: "Stress explains risk; it does not erase accountability.",
          correct: false,
          feedback: "No. Operational stress must be documented, not used to hide a finding."
        }
      ],
      lab: {
        type: "form",
        title: "DD 2665 purpose drill",
        prompt: "Classify each item before calculating accountability.",
        rows: [
          { label: "Cash in drawer", value: "Physical asset" },
          { label: "Valid receipt", value: "Support for payment" },
          { label: "Missing receipt", value: "Finding / explanation required" },
          { label: "Rate used", value: "Must match scenario instruction" }
        ]
      }
    },
    {
      id: "voucher-support",
      title: "Voucher Packet: Prove the Payment",
      body: "A payment is not complete because the item was received. The packet must prove who paid, who received, what was bought, why it was authorized, what rate was used, and what support returned.",
      why: "Most training scenarios become too easy when the app only asks for arithmetic. Real readiness requires the learner to defend the payment.",
      do: [
        "Check vendor, amount, date, purpose, and signature/acknowledgment.",
        "Confirm the purchase stayed inside mission authority.",
        "Reject or flag support that does not prove the payment.",
        "Write the explanation a DDO could understand without being there."
      ],
      failure: [
        "The member accepts a vague handwritten note as full support.",
        "The team pays outside the mission purpose because the item seemed useful.",
        "The closeout packet cannot be reconstructed by another person."
      ],
      prompt: "A receipt says only 'supplies - 900 ZD' with no vendor or date. What is the best training response?",
      choices: [
        {
          label: "Flag it and require an explanation or better support.",
          detail: "The packet must be defensible.",
          correct: true,
          feedback: "Correct. Weak support is a finding until resolved."
        },
        {
          label: "Accept it because the amount is small.",
          detail: "Small unsupported payments still weaken accountability.",
          correct: false,
          feedback: "No. Amount alone does not decide whether support is valid."
        },
        {
          label: "Throw it away and use memory instead.",
          detail: "That destroys the evidence trail.",
          correct: false,
          feedback: "No. The app should train reconstruction, not memory shortcuts."
        }
      ],
      lab: {
        type: "form",
        title: "Packet evidence check",
        prompt: "A strong packet should answer these before closeout.",
        rows: [
          { label: "Who", value: "Paying agent and vendor/recipient" },
          { label: "What", value: "Item/service and amount" },
          { label: "Why", value: "Mission authority / purpose" },
          { label: "How", value: "Currency and rate used" }
        ]
      }
    },
    {
      id: "foreign-currency",
      title: "Foreign Currency: Budget Rate vs Daily Rate",
      body: "Training scenarios can provide a budget rate and a daily rate. The learner must use the rate specified by the mission instructions and explain the effect when rates move.",
      why: "Foreign currency makes manual balancing harder because the team must separate operational decision-making from accounting consistency.",
      do: [
        "Read the OPORD or FRAGO to identify which rate applies.",
        "Record the rate used at the time of payment.",
        "Do not mix rates inside the same calculation unless the scenario tells you to.",
        "Explain rate fluctuation separately from missing cash."
      ],
      failure: [
        "The member uses whichever rate creates a clean answer.",
        "The team mistakes a rate difference for theft or a shortage.",
        "The closeout cannot show why a specific rate was selected."
      ],
      prompt: "The OPORD says use the daily rate for local market payments. Budget rate is 62 ZD/USD. Daily rate is 60 ZD/USD. Which rate should be used?",
      choices: [
        {
          label: "Use 60 ZD/USD and document that it is the daily rate.",
          detail: "Follow the mission instruction and record the rate.",
          correct: true,
          feedback: "Correct. The chosen rate must match the scenario rule and be explainable."
        },
        {
          label: "Use 62 ZD/USD because it gives more local currency.",
          detail: "That ignores the OPORD instruction.",
          correct: false,
          feedback: "No. Do not choose rates to make the math easier or more favorable."
        },
        {
          label: "Average both rates.",
          detail: "Averaging is not authorized by the scenario.",
          correct: false,
          feedback: "No. Use the directed rate."
        }
      ],
      lab: {
        type: "rate",
        title: "Rate selection drill",
        prompt: "Convert 1,200 ZD at the directed daily rate of 60 ZD/USD.",
        rates: ["Budget: 62 ZD/USD", "Daily: 60 ZD/USD", "Correct USD equivalent: $20.00"]
      }
    },
    {
      id: "opord-frago",
      title: "Read the OPORD Before Touching Cash",
      body: "The mission brief should read like an order: situation, mission, execution, sustainment, and command/signal. A FRAGO changes part of that order and should trigger a deliberate pause.",
      why: "If the mission is unclear, the learner guesses. If the order is structured, the team can brief roles, risk, money, rates, and closeout before deploying.",
      do: [
        "Extract the mission purpose, location, timeline, and limit.",
        "Identify payment authority, rate rule, and prohibited purchases.",
        "Brief role responsibilities before movement.",
        "Treat FRAGOs as changes that must be repeated back."
      ],
      failure: [
        "The team starts the scenario without marking the brief complete.",
        "A rate change is missed because nobody reads the FRAGO.",
        "Members cannot explain commander's intent or closeout timeline."
      ],
      prompt: "A FRAGO changes the local currency rate and adds a second vendor stop. What should the team do first?",
      choices: [
        {
          label: "Pause, repeat back the change, update the ledger plan, and continue.",
          detail: "FRAGO changes must be acknowledged and documented.",
          correct: true,
          feedback: "Correct. The order changed, so the accountability plan changes."
        },
        {
          label: "Continue and fix the math at closeout.",
          detail: "This creates preventable findings.",
          correct: false,
          feedback: "No. Rate and route changes must be handled before more cash moves."
        },
        {
          label: "Ignore the second vendor because the original OPORD had one.",
          detail: "The FRAGO is the newer instruction.",
          correct: false,
          feedback: "No. A valid FRAGO updates the mission."
        }
      ],
      lab: {
        type: "form",
        title: "Five-paragraph scan",
        prompt: "Find these items in the mission order before deployment.",
        rows: [
          { label: "Situation", value: "Threat, vendors, currency environment" },
          { label: "Mission", value: "Who pays what, where, when, and why" },
          { label: "Execution", value: "Tasks, limits, route, decision points" },
          { label: "Sustainment", value: "Funds, forms, rates, comms, evacuation" },
          { label: "Command/Signal", value: "Reporting, authority, emergency calls" }
        ]
      }
    },
    {
      id: "tccc-accountability",
      title: "TCCC Injects Without Losing Accountability",
      body: "This app does not certify TCCC. It reinforces that finance teams on real movements may face injury, attack, evacuation, or communication loss. The team must act within training, call for help, and preserve funds and documents.",
      why: "The learning goal is not to turn finance members into medics. It is to prevent panic from causing both casualty-response failure and cash accountability failure.",
      do: [
        "Prioritize life safety and call for help.",
        "Use only trained TCCC actions within scope.",
        "Secure cash, vouchers, and forms during movement.",
        "Document the interruption and who held funds during the event."
      ],
      failure: [
        "A member focuses on cash while ignoring immediate life safety.",
        "A member abandons funds and support without assigning custody.",
        "The closeout does not explain the disruption."
      ],
      prompt: "During a movement inject, the paying agent is injured and the cash pouch is on the floorboard. What is the best response?",
      choices: [
        {
          label: "Follow trained emergency actions, call for help, and assign custody of the pouch.",
          detail: "Life safety and accountability both need deliberate action.",
          correct: true,
          feedback: "Correct. This is exactly why the inject belongs in the disbursing scenario."
        },
        {
          label: "Finish counting the money before checking the member.",
          detail: "Life safety comes first.",
          correct: false,
          feedback: "No. The app should reinforce trained emergency priorities."
        },
        {
          label: "Leave the pouch and reconstruct later from memory.",
          detail: "This creates a preventable accountability gap.",
          correct: false,
          feedback: "No. Assign custody as soon as it is safe to do so."
        }
      ],
      lab: {
        type: "form",
        title: "Interruption memo drill",
        prompt: "A strong explanation should include these facts.",
        rows: [
          { label: "What happened", value: "IED/small arms/medical/vehicle issue scenario inject" },
          { label: "Who held funds", value: "Name and role before/during/after event" },
          { label: "What changed", value: "Payments paused, route changed, rate or vendor changed" },
          { label: "How closed out", value: "Cash, support, shortage/overage explanation" }
        ]
      }
    },
    {
      id: "closeout-ritual",
      title: "Closeout Ritual: Count, Support, Explain",
      body: "The closeout standard is not just getting the right number. The member must count physical cash, identify supported payments, isolate unsupported items, and explain the result clearly.",
      why: "The unit's learning gap is manual balancing under scenario pressure. This block makes the closeout routine repeatable.",
      do: [
        "Count cash by denomination first.",
        "List supported payments separately.",
        "Compare actual accountability to expected accountability.",
        "Write a plain-language explanation of results.",
        "Use the same rate rule throughout the scenario."
      ],
      failure: [
        "The member changes the rate to make the closeout balance.",
        "The member cannot explain why a supported receipt reduces cash on hand.",
        "The member reports 'balanced' without showing the equation."
      ],
      prompt: "Which closeout explanation is strongest?",
      choices: [
        {
          label: "Advanced $4,000; supported $1,275; cash returned $2,725; no variance.",
          detail: "It explains the equation and the result.",
          correct: true,
          feedback: "Correct. A strong closeout is math plus explanation."
        },
        {
          label: "It balanced because the app says it balanced.",
          detail: "This cannot survive real review.",
          correct: false,
          feedback: "No. The learner must explain the result without hiding behind the app."
        },
        {
          label: "Receipts plus cash were somewhere near the advance.",
          detail: "Closeout requires exactness.",
          correct: false,
          feedback: "No. Near is not balanced."
        }
      ],
      lab: {
        type: "form",
        title: "Closeout equation",
        prompt: "Say this out loud before the AAR.",
        rows: [
          { label: "Beginning accountability", value: "Funds advanced" },
          { label: "Minus", value: "Supported payments" },
          { label: "Equals", value: "Cash expected back" },
          { label: "Compare to", value: "Physical cash counted" }
        ]
      }
    },
    {
      id: "readiness-check",
      title: "Mission Readiness Check",
      body: "Before the app unlocks the mission, the learner should be able to explain roles, forms, rate rules, OPORD tasking, TCCC interruption response, and the closeout equation.",
      why: "This turns the app from a simple game into a training day sequence: learn individually, deploy as a team, close out, then AAR.",
      do: [
        "Brief DD 1081 purpose in one sentence.",
        "Brief DD 2665 purpose in one sentence.",
        "State the directed rate and why.",
        "Name who holds the funds.",
        "State the closeout equation."
      ],
      failure: [
        "The learner can click choices but cannot brief the process.",
        "The team starts the mission without roles.",
        "The AAR focuses only on score instead of readiness evidence."
      ],
      prompt: "What is the minimum standard before moving to mission execution?",
      choices: [
        {
          label: "The member can balance cash and explain the result using forms, rates, and support.",
          detail: "This matches the core learning gap.",
          correct: true,
          feedback: "Correct. The mission is now unlocked because the learner can explain the closeout standard."
        },
        {
          label: "The member can click through the screens quickly.",
          detail: "Speed is not readiness.",
          correct: false,
          feedback: "No. Fast clicking is not disbursing competence."
        },
        {
          label: "The member memorized one answer key.",
          detail: "The app should train transfer across scenarios.",
          correct: false,
          feedback: "No. The goal is explainable balancing under changing conditions."
        }
      ],
      lab: {
        type: "form",
        title: "Final verbal check",
        prompt: "Before mission, each team member should be able to answer these.",
        rows: [
          { label: "DD 1081", value: "What was advanced and what must return?" },
          { label: "DD 2665", value: "How do we summarize daily accountability?" },
          { label: "Rate", value: "Which rate was directed and where is it documented?" },
          { label: "Closeout", value: "Can I balance cash and explain the result?" }
        ]
      }
    }
  ],
  scenarios: [
    {
      id: "market",
      title: "Operation Market Ledger",
      level: "Intermediate",
      meta: "Team mission / 45-60 minutes / OPORD + FRAGO + TCCC inject",
      summary: "A paying agent team deploys to a local market to make authorized contingency purchases, respond to a FRAGO, handle a movement inject, and close out cash manually.",
      threat: "Elevated",
      time: "D+0 / 0830L",
      comms: "Intermittent tactical net",
      startingUsd: 4000,
      startingZd: 240000,
      opordTitle: "OPORD 26-01: Market Ledger",
      opord: [
        "1. Situation. Forward Operating Site Resolute is restoring limited services after a storm and civil disruption. Local vendors accept Zarian Dinar (ZD). Recent rate movement and intermittent communications increase risk of unsupported payments and poor closeout. Route Hawk has moderate IED and small-arms risk.",
        "2. Mission. NLT 1130L, Paying Agent Team 2 conducts authorized local purchases at Rafiq Market to support water distribution and generator repair, while maintaining full cash accountability from advance through closeout.",
        "3. Execution. Commander's intent is to obtain mission-essential supplies without losing accountability. Use the daily rate unless changed by FRAGO. Do not exceed $4,000 total accountability. Do not pay without vendor, amount, date, purpose, and receipt/acknowledgment. Halt and call back for any purchase outside the mission purpose.",
        "4. Sustainment. Initial advance is $4,000 or 240,000 ZD equivalent for training. Budget planning rate is 62 ZD/USD. Directed daily payment rate is 60 ZD/USD. Required closeout products: DD 1081-style advance/return explanation, DD 2665-style accountability summary, receipt packet, and variance explanation.",
        "5. Command and Signal. Team lead reports SP, arrival, FRAGO acknowledgement, casualty/movement injects, and closeout complete. If comms fail, preserve documents, stop nonessential payments, and return to base at the directed rally point."
      ],
      inject: {
        title: "Route Hawk Casualty and Accountability Inject",
        narrative: "After departing the market, the vehicle halts after a simulated blast report nearby. One team member reports leg pain and the paying agent's cash pouch is loose. You are not being certified in TCCC here; apply only trained actions, call for help, and preserve accountability.",
        checklist: [
          "Announce the hazard and follow the controller's safety direction.",
          "Call for help and report location/status.",
          "Use trained TCCC actions within scope.",
          "Assign named custody of cash pouch and documents.",
          "Record time, custody change, and mission impact for closeout."
        ]
      },
      events: [
        {
          type: "Brief",
          title: "Mission Brief and Role Lock",
          time: "0830L",
          narrative: "The team receives the OPORD and the cash advance. The commander wants the team moving quickly, but the DDO asks for a role cross-check before release.",
          question: "What is the correct first action?",
          choices: [
            {
              label: "Brief roles, funds advanced, rate rule, support standard, and closeout time.",
              detail: "This protects the mission before movement.",
              correct: true,
              supportedUsd: 0,
              feedback: "Good. Teams must understand the order before cash moves."
            },
            {
              label: "Depart immediately and read the OPORD en route.",
              detail: "This creates a preventable mission-control failure.",
              correct: false,
              stress: 15,
              feedback: "Finding. Mission execution started before the team understood role and form requirements."
            },
            {
              label: "Let only the paying agent read the OPORD.",
              detail: "This turns a team mission into a single point of failure.",
              correct: false,
              stress: 10,
              feedback: "Finding. The team needs shared understanding."
            }
          ]
        },
        {
          type: "Payment",
          title: "Water Containers Purchase",
          time: "0920L",
          narrative: "Vendor One offers water containers for 72,000 ZD. The receipt has vendor name, date, amount, and purpose. OPORD says use the daily rate of 60 ZD/USD.",
          question: "How should the team record this payment?",
          choices: [
            {
              label: "Record 72,000 ZD as a $1,200 supported payment at 60 ZD/USD.",
              detail: "The receipt is valid and the rate matches the OPORD.",
              correct: true,
              supportedUsd: 1200,
              zdDelta: -72000,
              feedback: "Correct. Supported payment reduces cash and must appear in closeout."
            },
            {
              label: "Record 72,000 ZD as $1,161.29 using the budget rate.",
              detail: "Budget rate was not directed for payment.",
              correct: false,
              stress: 12,
              feedback: "Finding. The team used the wrong rate for the directed payment."
            },
            {
              label: "Pay and wait to decide the rate at closeout.",
              detail: "That creates avoidable confusion.",
              correct: false,
              stress: 18,
              feedback: "Finding. Rate must be recorded at payment."
            }
          ]
        },
        {
          type: "FRAGO",
          title: "FRAGO 1: Generator Vendor Added",
          time: "0955L",
          narrative: "Higher directs a second stop for generator belts. FRAGO confirms daily rate remains 60 ZD/USD and caps this stop at 24,000 ZD.",
          question: "What should happen before the team pays Vendor Two?",
          choices: [
            {
              label: "Repeat back the FRAGO, update the ledger plan, and enforce the 24,000 ZD cap.",
              detail: "The order changed, so the accountability plan changes.",
              correct: true,
              feedback: "Correct. FRAGOs must be briefed and documented."
            },
            {
              label: "Treat the second stop as informal because it came after SP.",
              detail: "This ignores the updated instruction.",
              correct: false,
              stress: 12,
              feedback: "Finding. The FRAGO is mission authority and must be captured."
            },
            {
              label: "Use the budget rate because this is a new vendor.",
              detail: "The FRAGO confirms the same daily rate.",
              correct: false,
              stress: 15,
              feedback: "Finding. The team missed the rate instruction."
            }
          ]
        },
        {
          type: "Payment",
          title: "Generator Belts and Weak Receipt",
          time: "1010L",
          narrative: "Vendor Two has generator belts for 22,800 ZD. The vendor can sign the receipt but initially leaves the purpose blank.",
          question: "What should the paying agent team do?",
          choices: [
            {
              label: "Require the purpose to be completed before accepting the receipt, then record $380 supported.",
              detail: "22,800 ZD at 60 ZD/USD equals $380.",
              correct: true,
              supportedUsd: 380,
              zdDelta: -22800,
              feedback: "Correct. The team fixed support before closeout."
            },
            {
              label: "Accept the blank purpose because the vendor signed.",
              detail: "Signature alone is not full support.",
              correct: false,
              stress: 12,
              feedback: "Finding. The receipt did not explain what mission purpose was supported."
            },
            {
              label: "Pay 25,000 ZD because the belts are important.",
              detail: "That exceeds the FRAGO cap.",
              correct: false,
              stress: 20,
              feedback: "Finding. The team exceeded the FRAGO limit."
            }
          ]
        },
        {
          type: "TCCC",
          title: "Route Hawk Interruption",
          time: "1040L",
          narrative: "A simulated blast report pauses movement. One member is injured in the training lane. The cash pouch and receipt folder are separated during vehicle exit.",
          question: "What is the best response?",
          choices: [
            {
              label: "Follow trained emergency actions, report, assign custody, and document the interruption.",
              detail: "Life safety and accountability are both preserved.",
              correct: true,
              feedback: "Correct. This is the right link between TCCC injects and paying agent operations."
            },
            {
              label: "Keep driving because closeout is the priority.",
              detail: "This fails the casualty-response purpose.",
              correct: false,
              stress: 25,
              feedback: "Critical finding. Life safety cannot be skipped to protect paperwork."
            },
            {
              label: "Leave the pouch in place and reconstruct later.",
              detail: "This creates a custody gap.",
              correct: false,
              stress: 20,
              feedback: "Finding. The team failed to assign custody of funds and documents."
            }
          ]
        },
        {
          type: "Closeout",
          title: "DD 1081 / DD 2665 Closeout",
          time: "1135L",
          narrative: "The team returns to base. They must explain beginning accountability, supported payments, cash remaining, rate used, and any findings.",
          question: "Which closeout statement is correct if both payments were properly supported?",
          choices: [
            {
              label: "Advanced $4,000; supported $1,580; expected cash back $2,420 plus remaining ZD equivalent.",
              detail: "$1,200 + $380 = $1,580 supported.",
              correct: true,
              feedback: "Correct. The member can balance cash and explain the result."
            },
            {
              label: "Advanced $4,000; supported $1,580; expected cash back $4,000 because receipts do not matter.",
              detail: "Supported payments explain why cash decreased.",
              correct: false,
              stress: 20,
              feedback: "Finding. The team does not understand how support affects accountability."
            },
            {
              label: "Use the budget rate at closeout to make the ZD drawer match.",
              detail: "This changes the rules after the fact.",
              correct: false,
              stress: 18,
              feedback: "Finding. Rate shopping destroys the explanation."
            }
          ]
        }
      ]
    }
  ]
};
