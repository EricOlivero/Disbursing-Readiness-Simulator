(() => {
  "use strict";

  const STORAGE_KEY = "drsUnitPilotV2";

  const modules = [
    {
      id: "authority",
      short: "Authority",
      title: "Authority Before Accountability",
      duration: 7,
      standard: "Explain why appointment and scope must be verified before funds move.",
      why: "Cash is not handed to a person simply because the mission needs it. Accountability begins with authority, identity, scope, and acceptance.",
      concepts: [
        ["Appointment", "A valid appointment establishes the accountable role and the duties the member may perform."],
        ["Scope", "The member verifies what the appointment authorizes, where it applies, and any stated limits."],
        ["Acceptance", "The appointee acknowledges the responsibility before accepting public funds or accountable documents."]
      ],
      doctrine: "Training source connection: DD Form 577 appointment scenarios and accountable-official responsibilities. The reviewed source set contains an unresolved appointment-authority conflict, so this lesson teaches verification rather than inventing a single universal appointing chain.",
      source: "205_ A1110_Cashier_Appt.pdf pp.1-3; 210_ A1134_PA_Appt.pdf pp.1-4; conflict preserved from 44_ 36. DDO Ops.pdf and 41_ Appointment of Agents.pdf.",
      situation: "A newly arrived cashier is told to take a drawer immediately because customers are waiting.",
      analysis: "Operational urgency does not replace appointment control. Stop the handoff, verify the appointment and scope, then accept accountability through the proper transfer record.",
      takeaway: "No verified authority, no transfer of accountability.",
      form: {
        title: "SANITIZED APPOINTMENT RECORD",
        subtitle: "Training representation - not an official form",
        cells: [
          ["Appointee", "Fictional member", 4, false],
          ["Position", "Cashier", 4, true],
          ["Effective date", "Training date", 4, false],
          ["Duties / scope", "Authorized accountable functions and limits", 8, true],
          ["Authority reference", "Current approved source", 4, true],
          ["Acknowledgement", "Member accepts responsibilities", 6, true],
          ["Termination", "Completed when authority ends", 6, false]
        ]
      },
      practice: {
        prompt: "You are the receiving cashier. Which three controls must be confirmed before accepting a cash drawer?",
        type: "multi",
        options: [
          ["identity", "Confirm the person receiving accountability matches the appointment."],
          ["scope", "Confirm the appointment covers the assigned cashier duties."],
          ["acceptance", "Confirm the member acknowledged the responsibility."],
          ["schedule", "Confirm the customer-service schedule is busy."],
          ["rank", "Confirm the member has the highest rank in the room."]
        ],
        answers: ["identity", "scope", "acceptance"],
        explainPrompt: "In your own words, explain why you would pause the handoff.",
        concepts: ["appointment", "authority", "scope", "accountability", "verify"]
      }
    },
    {
      id: "dd1081",
      short: "DD 1081",
      title: "DD Form 1081: Transfer the Accountability",
      duration: 9,
      standard: "Reconcile the issuer and receiver totals and explain what the form proves.",
      why: "The DD Form 1081 documents accountability moving between authorized people. The form and the physical count must tell the same story.",
      concepts: [
        ["Purpose", "Use the record to document an advance or return between accountable officials."],
        ["Count", "The receiver counts the physical funds before accepting the transfer."],
        ["Reconcile", "The amount released by the issuer must match the amount accepted by the receiver."]
      ],
      doctrine: "Training source connection: cashier-advance scenarios require a DD Form 1081, a physical count, and matching issuer/recipient accountability. Foreign currency is represented in its U.S. dollar equivalent where required by the exercise.",
      source: "206_ A1111_Cashier_Advance.pdf pp.1-3; 395_ A2300_Cashier_Advance.pdf pp.1-3.",
      situation: "The DDO states the advance is $4,000. The cashier counts $3,980.",
      analysis: "The form cannot be signed as a $4,000 accepted advance. The receiving cashier reports the difference and the parties resolve the physical count before acceptance.",
      takeaway: "A signature does not correct a count. Reconcile first.",
      form: {
        title: "DD FORM 1081 WORKING MAP",
        subtitle: "Purpose map - sanitized training representation",
        cells: [
          ["From", "Issuer of accountability", 4, true],
          ["To", "Receiver of accountability", 4, true],
          ["Date", "Effective transfer date", 4, false],
          ["Transaction type", "Advance or return", 4, true],
          ["Description", "Type of funds or accountable item", 4, false],
          ["Amount", "USD accountability value", 4, true],
          ["Issuer certification", "Amount released", 6, true],
          ["Receiver certification", "Amount counted and accepted", 6, true]
        ]
      },
      practice: {
        prompt: "The form states $4,000. Your denomination count is $3,980. Work the accountability decision.",
        type: "dd1081",
        explainPrompt: "Explain what must happen before you sign as the receiver.",
        concepts: ["count", "difference", "reconcile", "before", "accept", "sign"]
      }
    },
    {
      id: "denominations",
      short: "Cash Count",
      title: "Physical Cash: Count What Exists",
      duration: 9,
      standard: "Compute a denomination total and compare physical cash with book accountability.",
      why: "A total typed into a box is not a cash count. Cashiers must be able to reconstruct the total from denominations and identify what the physical drawer actually contains.",
      concepts: [
        ["Quantity", "Count each denomination separately and record the number of notes or coins."],
        ["Extension", "Multiply denomination by quantity before summing the drawer."],
        ["Difference", "Physical cash minus book accountability produces zero, an overage, or a shortage."]
      ],
      doctrine: "Training source connection: cashier advance and accountability exercises require a physical count and reconciliation. Count sequence can vary by local practice; the app grades the defensible total and reconciliation outcome.",
      source: "206_ A1111_Cashier_Advance.pdf pp.1-3; 47_ 37.5.2 Cashier Accountability.pdf pp.1-23.",
      situation: "The book accountability is $3,525. A physical denomination count totals $3,515.",
      analysis: "$3,515 physical minus $3,525 book equals -$10. The negative sign matters: the physical drawer is short.",
      takeaway: "Physical minus book: negative is a shortage; positive is an overage.",
      form: {
        title: "DENOMINATION COUNT SHEET",
        subtitle: "Fictional training values",
        cells: [
          ["$100", "18 notes = $1,800", 4, false],
          ["$50", "20 notes = $1,000", 4, false],
          ["$20", "25 notes = $500", 4, false],
          ["$10", "10 notes = $100", 4, false],
          ["$5", "15 notes = $75", 4, false],
          ["$1", "40 notes = $40", 4, false],
          ["Physical total", "$3,515", 6, true],
          ["Book accountability", "$3,525", 6, true],
          ["Physical minus book", "-$10 shortage", 12, true]
        ]
      },
      practice: {
        prompt: "Count the fictional drawer and classify the result against a $3,525 book balance.",
        type: "denominations",
        rows: [[100,18],[50,20],[20,25],[10,10],[5,15],[1,40]],
        book: 3525,
        explainPrompt: "Explain what the sign of your difference means.",
        concepts: ["physical", "book", "short", "shortage", "difference", "negative"]
      }
    },
    {
      id: "dd2665",
      short: "DD 2665",
      title: "DD Form 2665: Agent Accountability Story",
      duration: 8,
      standard: "Identify the record's purpose and connect opening accountability, activity, and ending accountability.",
      why: "Agent accountability is a running story. The supporting record helps a reviewer follow what the agent started with, what changed, and what remains.",
      concepts: [
        ["Opening", "Begin with the accountability issued to the agent."],
        ["Activity", "Record supported increases, decreases, payments, exchanges, or approved adjustments."],
        ["Ending", "The record should reconcile to the agent's physical funds and supported documents."]
      ],
      doctrine: "Training source connection: DD Form 2665 appears in the reviewed foreign-currency agent-accountability scenarios. This public pilot teaches the accountability relationship without reproducing sensitive completed records.",
      source: "276_ A2312a_Confused_Agent.pdf p.1; 277_ A2312b_Confused_Agent.pdf p.1; evidence gap on 277 p.7 preserved.",
      situation: "An agent reports only the ending cash total but cannot show the supported activity that produced it.",
      analysis: "A plausible ending number is not enough. The reviewer needs the opening accountability, documented activity, and ending position to reconcile.",
      takeaway: "The ending balance is a conclusion; the record must prove how the agent got there.",
      form: {
        title: "DD FORM 2665 ACCOUNTABILITY MAP",
        subtitle: "Concept map - not a completed official form",
        cells: [
          ["Agent / location", "Who holds the accountability", 6, false],
          ["Reporting period", "When the activity occurred", 6, false],
          ["Opening accountability", "Amount brought forward", 4, true],
          ["Supported increases", "Authorized additions", 4, true],
          ["Supported decreases", "Payments, returns, or adjustments", 4, true],
          ["Ending accountability", "Computed accountability", 6, true],
          ["Physical / support", "Cash and documents that substantiate the ending", 6, true]
        ]
      },
      practice: {
        prompt: "An agent starts with $6,000, makes $1,250 in supported payments, and returns $300 of unused funds. Compute the ending accountability and identify what must support it.",
        type: "dd2665",
        opening: 6000,
        payments: 1250,
        returns: 300,
        explainPrompt: "Explain what records or physical assets must support the ending accountability.",
        concepts: ["opening", "payment", "return", "ending", "cash", "support", "document"]
      }
    },
    {
      id: "currency",
      short: "Currency",
      title: "Foreign Currency: Choose the Right Branch",
      duration: 9,
      standard: "Distinguish a mission budget rate, a transaction/daily rate, APR, and revaluation.",
      why: "The arithmetic can be correct and the accountability still be wrong if the learner selects the wrong rate or adjustment process.",
      concepts: [
        ["Mission planning", "A budget rate may support planning but does not automatically become the transaction rate."],
        ["Transaction", "Use the rate authorized for the specific exchange or payment event in the scenario."],
        ["APR vs revaluation", "Average Purchase Rate and revaluation loss are separate processes and must not be blended."]
      ],
      doctrine: "Training source connection: the reviewed evidence explicitly separates Average Purchase Rate from revaluation-loss processing. This pilot keeps the branches separate and uses fictional rates.",
      source: "276_ A2312a_Confused_Agent.pdf pp.1-3; 277_ A2312b_Confused_Agent.pdf pp.1-4.",
      situation: "A team sees a budget rate in the OPORD and a different authorized daily transaction rate in the finance annex.",
      analysis: "The budget rate supports planning. The team applies the authorized transaction rate to the transaction, records the source, and preserves the rate used.",
      takeaway: "Name the purpose of the rate before using the number.",
      form: {
        title: "FOREIGN-CURRENCY DECISION MAP",
        subtitle: "Fictional training branch",
        cells: [
          ["Budget rate", "Planning and resource estimate", 3, false],
          ["Daily / transaction rate", "Authorized conversion for the event", 3, true],
          ["Average Purchase Rate", "Locally purchased FC accountability branch", 3, true],
          ["Revaluation", "Change in accountability under the applicable prevailing-rate branch", 3, true],
          ["Required evidence", "Rate source, date, calculation, and supporting record", 12, true]
        ]
      },
      practice: {
        prompt: "Classify each situation before calculating.",
        type: "currency",
        explainPrompt: "Explain why APR and revaluation cannot be treated as the same calculation.",
        concepts: ["different", "separate", "purchase", "rate", "revaluation", "accountability"]
      }
    },
    {
      id: "voucher",
      short: "Vouchers",
      title: "Voucher Control: Prove Before You Pay",
      duration: 7,
      standard: "Identify missing support, duplicate-payment risk, and the correct hold-or-pay decision.",
      why: "Disbursing is the last control before public funds leave government accountability. A complete-looking packet can still contain a duplicate or unsupported payment.",
      concepts: [
        ["Authority", "Confirm the payment is authorized and properly approved."],
        ["Evidence", "Confirm payee, receipt, purpose, calculation, accounting support, and required documentation."],
        ["Duplicate control", "Search for evidence that the obligation or invoice was already paid before releasing funds."]
      ],
      doctrine: "Training source connection: the reviewed vendor-payment scenario emphasizes pre-payment review and duplicate-payment prevention. All names and accounting data in this pilot are fictional.",
      source: "368_ A2306_Cash_Payments_Revision.pdf pp.1-3; unreadable pp.8, 10, and 14 are not used.",
      situation: "A packet is signed and mathematically correct, but the invoice number matches a payment recorded yesterday.",
      analysis: "Do not pay. Hold the packet, verify the duplicate indicator, document the finding, and route it for resolution.",
      takeaway: "A signature authorizes review; it does not erase a duplicate.",
      form: {
        title: "SANITIZED VOUCHER PACKET MAP",
        subtitle: "Fictional vendor and document identifiers",
        cells: [
          ["Payee", "Fictional vendor identity", 4, false],
          ["Purpose", "Authorized mission requirement", 4, true],
          ["Approval", "Required certification present", 4, true],
          ["Invoice / receipt", "What was delivered and amount claimed", 4, true],
          ["Accounting support", "Valid funding reference - fictionalized", 4, false],
          ["Prior-payment check", "Duplicate search result", 4, true],
          ["Disbursing decision", "Pay, hold, or reject with rationale", 12, true]
        ]
      },
      practice: {
        prompt: "Review three fictional packets and decide pay, hold, or reject.",
        type: "voucher",
        explainPrompt: "Explain the control that prevents the highest-risk error.",
        concepts: ["duplicate", "support", "hold", "verify", "payment", "prior"]
      }
    },
    {
      id: "balance",
      short: "Balance",
      title: "Manual Balance: Explain the Result",
      duration: 7,
      standard: "Reconstruct book accountability, compare physical cash, and explain a balanced or discrepant result.",
      why: "Balancing is not guessing the expected total. It is rebuilding the accountability equation from opening funds, supported activity, and physical assets.",
      concepts: [
        ["Book", "Opening accountability plus supported increases minus supported decreases."],
        ["Physical", "Cash on hand plus valid accountable items included by the exercise."],
        ["Explain", "State the amount, direction, likely source, and immediate control action."]
      ],
      doctrine: "Training source connection: cashier advance and accountability assessments require reconciliation and explanation. This is the core qualification standard for the unit pilot.",
      source: "206_ A1111_Cashier_Advance.pdf p.3; 395_ A2300_Cashier_Advance.pdf pp.1-3.",
      situation: "Opening accountability is $4,000. Supported payments are $735. The physical drawer is $3,250.",
      analysis: "Book accountability is $3,265. Physical minus book is -$15, a shortage. Recount and review the activity before accepting a final conclusion.",
      takeaway: "Say the equation out loud: opening plus increases minus decreases equals book; physical minus book equals the result.",
      form: {
        title: "ACCOUNTABILITY EQUATION",
        subtitle: "Core mental model",
        cells: [
          ["Opening", "$4,000", 3, false],
          ["Increases", "$0", 3, false],
          ["Decreases", "$735", 3, false],
          ["Book", "$3,265", 3, true],
          ["Physical", "$3,250", 4, true],
          ["Physical minus book", "-$15", 4, true],
          ["Classification", "Shortage - investigate", 4, true]
        ]
      },
      practice: {
        prompt: "Work three accountability cases. Do not move on until you can classify each result and explain your immediate action.",
        type: "balance",
        explainPrompt: "Explain how you would defend one discrepancy result to the DDO.",
        concepts: ["opening", "increase", "decrease", "book", "physical", "difference", "recount", "review"]
      }
    },
    {
      id: "handoff",
      short: "Handoff",
      title: "Team Handoffs and Accountability Continuity",
      duration: 4,
      standard: "Deliver a concise role handoff that preserves funds, records, decisions, and unresolved risk.",
      why: "Deployed finance work is a team activity. A correct calculation can still fail operationally if the next person does not know what changed or what remains unresolved.",
      concepts: [
        ["Position", "State the current accountability and mission status."],
        ["Evidence", "Identify the cash, forms, documents, and decisions that support the position."],
        ["Risk", "State discrepancies, pending actions, control concerns, and who owns the next step."]
      ],
      doctrine: "Training source connection: joint operations and accountability-continuity scenarios support role handoffs. TCCC injects in this public pilot stop at scene safety, notification, continuity, and transfer of accountability; they do not teach medical procedures.",
      source: "57_ 37.22 Joint Deployed Operations.pdf pp.2-12; 382_ A2219_DA_Arrested.pdf pp.2-4.",
      situation: "A paying-agent team is interrupted. One member becomes unavailable and another team must secure and continue the accountability.",
      analysis: "Pause financial activity, protect people and funds, notify leadership, inventory the accountability with appropriate witnesses, and document the transfer before resuming.",
      takeaway: "A handoff is complete when the receiving role can state the position, evidence, risk, and next action.",
      form: {
        title: "PACE HANDOFF CARD",
        subtitle: "Position - Accountability - Controls - Execution",
        cells: [
          ["Position", "Current mission and cash status", 6, true],
          ["Accountability", "Book, physical, forms, and supported items", 6, true],
          ["Controls", "Discrepancies, restrictions, and unresolved risk", 6, true],
          ["Execution", "Next action, owner, and required confirmation", 6, true]
        ]
      },
      practice: {
        prompt: "Build a handoff for a team that has $2,895 remaining, two supported payments, and one unresolved vendor receipt.",
        type: "handoff",
        explainPrompt: "Write the final handoff exactly as you would brief the receiving team.",
        concepts: ["2895", "payment", "receipt", "unresolved", "next", "accountability", "document"]
      }
    }
  ];

  const missions = [
    {
      id: "cashier",
      code: "M-01",
      title: "Cashier Stand-Up",
      difficulty: "Foundational",
      focus: "Appointment, DD 1081, denomination count, closeout",
      roles: ["DDO", "Cashier", "Reviewer", "Team Chief"],
      objective: "Stand up a cash operation, accept an advance, process supported activity, and close the drawer.",
      situation: "A forward finance element must open limited service after a communications outage.",
      opord: [
        ["Situation", "Customers are queued and network access is intermittent. Manual controls are required."],
        ["Mission", "Establish a controlled cashier operation and maintain accountability through closeout."],
        ["Execution", "Verify authority, issue the drawer, record three transactions, then reconcile."],
        ["Sustainment", "Use fictional documents and preserve the manual evidence packet."],
        ["Command / signal", "Team Chief controls pacing. DDO resolves discrepancies before release."]
      ],
      opening: 4200,
      drawerRows: [[100,20],[50,20],[20,40],[10,20],[5,20],[1,100]],
      transactions: [["Payment A", -615], ["Payment B", -280], ["Unused funds returned", 300]],
      physical: 3605,
      decisionType: "cashier",
      inject: "FRAGO 01: Customer volume doubles. The team may not skip the independent count or supporting-document review.",
      injectTerms: ["continue controls", "count", "support", "pace", "notify"]
    },
    {
      id: "paying-agent",
      code: "M-02",
      title: "Paying Agent Market",
      difficulty: "Intermediate",
      focus: "Paying-agent authority, payment evidence, field handoff",
      roles: ["Commander", "Paying Agent", "Cashier", "Budget Officer", "Team Chief"],
      objective: "Prepare, execute, and reconcile a fictional local-purchase paying-agent mission.",
      situation: "A mission-essential purchase must be completed at an austere market using a paying-agent team.",
      opord: [
        ["Situation", "Local vendors accept cash only. Prices are fictional and no real vendor data is used."],
        ["Mission", "Execute two authorized payments and return unused accountability."],
        ["Execution", "Verify appointment and funding purpose, pay only supported amounts, retain receipts."],
        ["Sustainment", "Opening accountability is issued before departure and inventoried on return."],
        ["Command / signal", "Team Chief reports changes. Budget Officer confirms purpose; Cashier controls issue/return."]
      ],
      opening: 5000,
      drawerRows: [[100,25],[50,20],[20,50],[10,30],[5,20],[1,100]],
      transactions: [["Mission supply payment", -865], ["Transport support payment", -1240]],
      physical: 2915,
      decisionType: "paying-agent",
      inject: "FRAGO 02: A vendor changes the price after arrival. Do not exceed the authorized purpose or amount without revised authority.",
      injectTerms: ["pause", "authority", "amount", "budget", "document", "notify"]
    },
    {
      id: "exchange",
      code: "M-03",
      title: "Exchange Point",
      difficulty: "Intermediate",
      focus: "Eligibility, transaction rate, exchange documentation",
      roles: ["DDO", "Cashier", "Rate Reviewer", "Team Chief"],
      objective: "Operate a fictional accommodation-exchange point and defend the rate used.",
      situation: "Authorized personnel require foreign currency before movement outside the installation.",
      opord: [
        ["Situation", "The OPORD contains a planning rate; the finance annex supplies a fictional transaction rate."],
        ["Mission", "Complete authorized exchange transactions and preserve rate evidence."],
        ["Execution", "Verify eligibility, select the transaction rate, calculate, issue, and document."],
        ["Sustainment", "Maintain separate USD and fictional FC counts."],
        ["Command / signal", "Rate Reviewer confirms source and date before the first exchange."]
      ],
      opening: 3200,
      drawerRows: [[100,15],[50,10],[20,40],[10,20],[5,20],[1,100]],
      transactions: [["Authorized USD exchange", -450]],
      physical: 2750,
      decisionType: "exchange",
      rate: 2.4,
      inject: "FRAGO 03: A customer presents the OPORD budget rate instead of today's authorized transaction rate.",
      injectTerms: ["transaction rate", "budget", "verify", "source", "explain"]
    },
    {
      id: "revaluation",
      code: "M-04",
      title: "Revaluation Shift",
      difficulty: "Advanced",
      focus: "Prevailing-rate change, revaluation branch, accountability adjustment",
      roles: ["Disbursing Agent", "DDO", "Currency Reviewer", "Team Chief"],
      objective: "Recognize and document a fictional $75 revaluation loss without misclassifying it as a cash shortage.",
      situation: "A prevailing-rate change alters the USD equivalent of foreign currency held by the agent.",
      opord: [
        ["Situation", "The physical FC quantity is unchanged, but its accountability value changes under the exercise rate."],
        ["Mission", "Compute the revalued accountability and document the correct branch."],
        ["Execution", "Confirm rate source, compare old and new equivalent, preserve the calculation."],
        ["Sustainment", "Do not blend revaluation with Average Purchase Rate."],
        ["Command / signal", "Currency Reviewer independently verifies the branch and amount."]
      ],
      opening: 4800,
      issueMode: "fc",
      fcQuantity: 24000,
      oldRate: 5,
      transactions: [["Fictional revaluation adjustment", -75]],
      physical: 4725,
      decisionType: "revaluation",
      inject: "FRAGO 04: A teammate labels the $75 change a physical cash shortage. Correct the classification and explain why.",
      injectTerms: ["revaluation", "not shortage", "rate", "physical quantity", "document"]
    },
    {
      id: "apr",
      code: "M-05",
      title: "Average Purchase Rate",
      difficulty: "Advanced",
      focus: "Local FC purchase, APR branch, Certificate of Change",
      roles: ["Disbursing Agent", "DDO", "Bank Liaison", "Team Chief"],
      objective: "Compute and explain a fictional Average Purchase Rate while keeping it separate from revaluation.",
      situation: "No exercise prevailing rate is available. Foreign currency is purchased locally and added to existing holdings.",
      opord: [
        ["Situation", "Existing and newly purchased fictional FC must be represented by one weighted purchase rate."],
        ["Mission", "Compute the APR, identify support, and update accountability."],
        ["Execution", "Combine FC acquired and USD cost, compute FC per USD, preserve the source documents."],
        ["Sustainment", "Use only fictional bank data and a sanitized Certificate of Change."],
        ["Command / signal", "Bank Liaison confirms the purchase evidence; DDO approves the accountability update."]
      ],
      opening: 1043.34485,
      issueMode: "apr-evidence",
      existingFc: 25000,
      existingUsd: 745.25,
      purchaseFc: 10000,
      purchaseUsd: 298.09485,
      transactions: [],
      physical: 1043.34485,
      decisionType: "apr",
      aprFc: 35000,
      aprUsd: 1043.34485,
      inject: "FRAGO 05: Another team proposes using the budget rate because it is easier. Defend the APR branch.",
      injectTerms: ["purchase", "actual cost", "APR", "not budget", "support", "certificate"]
    },
    {
      id: "voucher",
      code: "M-06",
      title: "Voucher Control Cell",
      difficulty: "Advanced",
      focus: "Pre-payment review, missing support, duplicate-payment prevention",
      roles: ["Disbursing Officer", "Cashier", "Voucher Reviewer", "Budget Officer", "Team Chief"],
      objective: "Review four fictional packets, prevent a duplicate payment, and defend each disposition.",
      situation: "A backlog arrives shortly before the daily cutoff. Speed pressure increases the duplicate-payment risk.",
      opord: [
        ["Situation", "Four sanitized packets include a clean payment, missing receipt, duplicate invoice, and calculation error."],
        ["Mission", "Release only the packet that passes all required controls."],
        ["Execution", "Review authority, support, payee, amount, calculation, funding, and prior-payment evidence."],
        ["Sustainment", "Retain a decision log for the AAR."],
        ["Command / signal", "Voucher Reviewer briefs risk; Cashier does not pay until the review is complete."]
      ],
      opening: 6000,
      drawerRows: [[100,30],[50,20],[20,60],[10,40],[5,40],[1,200]],
      transactions: [["Approved packet", -920]],
      physical: 5070,
      decisionType: "voucher",
      inject: "FRAGO 06: A senior customer asks the cashier to pay the duplicate now and fix the record tomorrow.",
      injectTerms: ["do not pay", "duplicate", "control", "document", "route", "notify"]
    },
    {
      id: "continuity",
      code: "M-07",
      title: "Accountability Interruption",
      difficulty: "Advanced",
      focus: "Scene safety, secure funds, inventory, documented transfer",
      roles: ["Commander", "DDO", "Disbursing Agent", "TCCC / Safety Lead", "Inventory Recorder", "Team Chief"],
      objective: "Preserve accountability when a team member becomes unavailable during a field mission.",
      situation: "A simulated incident interrupts operations. The exercise assesses safety decisions and accountability continuity, not medical technique.",
      opord: [
        ["Situation", "The team is operating away from the finance site when the accountable member becomes unavailable."],
        ["Mission", "Protect people, secure funds and records, notify leadership, inventory, and transfer accountability."],
        ["Execution", "Stop activity, establish safety, preserve evidence, conduct witnessed inventory, document handoff."],
        ["Sustainment", "Do not resume payment operations until accountability is established."],
        ["Command / signal", "Safety Lead controls the immediate response; Commander and DDO direct continuity."]
      ],
      opening: 3900,
      drawerRows: [[100,20],[50,10],[20,50],[10,20],[5,20],[1,100]],
      transactions: [["Supported field payment", -740]],
      physical: 3160,
      decisionType: "continuity",
      inject: "INJECT 07: Simulated blast effects make the accountable member unavailable. State safety, notification, security, inventory, and transfer actions.",
      injectTerms: ["safety", "notify", "secure", "inventory", "witness", "transfer"]
    }
  ];

  const extensionInjects = [
    {
      id: "lda",
      title: "LDA Mission-Need Decision",
      prompt: "The team cannot support a fictional foreign-currency payment through the normal exercise channel. Explain the purpose of an LDA, identify that approval is required, and state what must be verified before any account action.",
      standard: "Explain purpose, current-policy validation, approval, and accounting-record requirements without naming real banks or routing steps.",
      boundary: "Abstract only. Do not reproduce banking, routing, or local approval details.",
      source: "358_ A2401_How_to_open_LDA.pdf pp.2-3; potentially outdated/local routing remains restricted."
    },
    {
      id: "check-cashing",
      title: "Check-Cashing Policy Review",
      prompt: "A customer requests a service that is not clearly covered by the fictional written policy. Decide whether to proceed and explain how current approval authority must be verified.",
      standard: "Stop unsupported service, consult the written policy, and validate current approval authority.",
      boundary: "The reviewed source contains an unresolved local-versus-theater approval conflict. Do not present one branch as universally correct.",
      source: "406_ Check_Cashing.pdf pp.1-2."
    },
    {
      id: "counterfeit",
      title: "Suspected Counterfeit Instrument",
      prompt: "A cashier suspects an instrument before accepting it. State the transaction-control response, evidence handling, notification, and accountability effect.",
      standard: "Stop acceptance, preserve the item and evidence, follow current reporting guidance, and distinguish U.S. currency from unresolved FC handling.",
      boundary: "No realistic counterfeit image and no merged U.S./foreign-currency procedure.",
      source: "216_ A1114_Counterfeit_Bill.pdf pp.1-3; 361_ A2311_Counterfeit_FC.pdf conflict preserved."
    },
    {
      id: "safeguarding",
      title: "Safeguarding Degradation",
      prompt: "A temporary workspace no longer meets the exercise safeguarding standard. Decide whether accountable operations continue and identify the control categories leadership must restore.",
      standard: "Pause or limit operations, secure funds and records, restrict access, and notify the accountable chain.",
      boundary: "Discuss control categories only. Do not reproduce safe, combination, or physical-security procedures.",
      source: "42_ 37.2 Safeguarding Funds, Negotiable Instruments, and Vouchers.pdf; 392_ A2231_Open-Close_Safe_1.pdf p.2."
    },
    {
      id: "loss",
      title: "Physical Loss Accountability",
      prompt: "A fictional change fund is short after an independent recount. Explain the accountability effect, documentation, notification, and why the loss remains visible until resolved.",
      standard: "Preserve the signed result, record and report the loss, retain accountability, and route for resolution.",
      boundary: "No real identifiers, accounting classifications, or site-specific investigative process.",
      source: "380_ A2211_Change_Fund_Loss.pdf p.2."
    }
  ];

  const defaultState = {
    profile: { name: "Airman", level: "new" },
    route: "dashboard",
    moduleIndex: 0,
    moduleTab: "learn",
    masteredModules: [],
    moduleAttempts: {},
    learnerNotes: {},
    retrieval: { completed: false, attempts: 0 },
    qualification: { step: 0, completed: false, attempts: 0, evidence: {} },
    selectedMission: null,
    missions: {},
    aar: [],
    teamSession: { code: "", teamName: "", assignedMission: "" },
    eventClock: { phase: 0, remainingSeconds: 0, running: false, updatedAt: null }
  };

  const loadState = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed && typeof parsed === "object" ? { ...structuredClone(defaultState), ...parsed } : structuredClone(defaultState);
    } catch {
      return structuredClone(defaultState);
    }
  };

  const state = loadState();
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value = "") => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  const money = value => Number(value || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
  const number = value => Number(String(value ?? "").replace(/[$,\s]/g, ""));
  const closeEnough = (a, b, tolerance = 0.01) => Number.isFinite(a) && Math.abs(a - b) <= tolerance;

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "AM";
  }

  function conceptScore(text, concepts) {
    const normalized = String(text || "").toLowerCase();
    const hits = concepts.filter(concept => normalized.includes(concept.toLowerCase()));
    return { hits, score: hits.length / Math.max(1, Math.min(3, concepts.length)) };
  }

  function allModulesMastered() {
    return modules.every(module => state.masteredModules.includes(module.id));
  }

  function readinessPercent() {
    const modulePoints = (state.masteredModules.length / modules.length) * 55;
    const qualPoints = state.qualification.completed ? 25 : 0;
    const missionPoints = Object.values(state.missions).some(progress => progress.completed) ? 20 : 0;
    return Math.round(modulePoints + qualPoints + missionPoints);
  }

  function setRoute(route) {
    const requested = route || "dashboard";
    state.route = requested;
    saveState();
    $$("[data-view]").forEach(view => view.classList.toggle("active", view.dataset.view === requested));
    $$("[data-route]").forEach(button => {
      const active = button.dataset.route === requested;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    $("#rail").classList.remove("open");
    if (requested === "dashboard") renderDashboard();
    if (requested === "academy") renderAcademy();
    if (requested === "qualification") renderQualification();
    if (requested === "team") renderTeam();
    if (requested === "aar") renderAAR();
    if (requested === "facilitator") renderFacilitator();
    $("#app").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextRequiredAction() {
    if (!allModulesMastered()) {
      const next = modules.find(module => !state.masteredModules.includes(module.id));
      return { route: "academy", title: `Master ${next.title}`, detail: "Complete the lesson cycle and pass the performance check.", button: "Go to Academy" };
    }
    if (!state.retrieval || !state.retrieval.completed) {
      return { route: "academy", title: "Complete the readiness recall", detail: "Retrieve the core controls without reopening the lesson or form map.", button: "Open recall check" };
    }
    if (!state.qualification.completed) {
      return { route: "qualification", title: "Complete the cashier qualification", detail: "Reconcile a complete accountability cycle without coaching prompts.", button: "Open qualification" };
    }
    if (!Object.values(state.missions).some(progress => progress.completed)) {
      return { route: "team", title: "Execute a team mission", detail: "Choose one of seven distinct missions and complete every role handoff.", button: "Open Team Ops" };
    }
    return { route: "aar", title: "Lead the after-action review", detail: "Use the evidence record to defend decisions and target remediation.", button: "Review performance" };
  }

  function renderDashboard() {
    const percent = readinessPercent();
    $("#readinessScore").textContent = `${percent}%`;
    $("#readinessHeadline").textContent = percent === 100 ? "Ready for facilitated evaluation" : nextRequiredAction().title;
    const missionDone = Object.values(state.missions).some(progress => progress.completed);
    const academyReady = allModulesMastered() && state.retrieval && state.retrieval.completed;
    const phases = [
      ["Academy", allModulesMastered() && !academyReady ? "recall pending" : `${state.masteredModules.length}/${modules.length} mastered`, academyReady],
      ["Qualification", state.qualification.completed ? "qualified" : "pending", state.qualification.completed],
      ["Team mission", missionDone ? "completed" : "pending", missionDone],
      ["AAR", state.aar.length ? `${state.aar.length} records` : "pending", state.aar.length > 0]
    ];
    let firstIncompleteSeen = false;
    $("#phaseTrack").innerHTML = phases.map(([title, detail, complete]) => {
      const current = !complete && !firstIncompleteSeen;
      if (current) firstIncompleteSeen = true;
      return `<div class="phase-segment ${complete ? "complete" : current ? "current" : ""}"><strong>${title}</strong>${detail}</div>`;
    }).join("");
    const next = nextRequiredAction();
    $("#nextAction").innerHTML = `<div><strong>${esc(next.title)}</strong><p>${esc(next.detail)}</p></div><button class="primary-button" type="button" data-route="${next.route}">${esc(next.button)}</button>`;
  }

  function renderModuleRail() {
    $("#moduleRail").innerHTML = modules.map((module, index) => {
      const mastered = state.masteredModules.includes(module.id);
      const unlocked = index === 0 || state.masteredModules.includes(modules[index - 1].id) || mastered;
      return `<button type="button" class="module-nav-button ${index === state.moduleIndex ? "active" : ""} ${mastered ? "mastered" : ""}" data-module-index="${index}" ${unlocked ? "" : "disabled"}>
        <span class="module-number">${mastered ? "OK" : String(index + 1).padStart(2, "0")}</span>
        <span><strong>${esc(module.short)}</strong><small>${module.duration} min</small></span>
        <span class="module-state">${mastered ? "mastered" : unlocked ? "open" : "locked"}</span>
      </button>`;
    }).join("");
  }

  function renderAcademy() {
    const recallPending = allModulesMastered() && !(state.retrieval && state.retrieval.completed);
    $("#academyProgressText").textContent = recallPending ? "8 mastered - recall pending" : `${state.masteredModules.length} of ${modules.length}`;
    renderModuleRail();
    if (allModulesMastered() && (recallPending || state.moduleIndex >= modules.length)) renderRetrievalCheck();
    else renderLesson();
  }

  function lessonTabs(module) {
    const hasForm = Boolean(module.form);
    return `<div class="lesson-tabs">
      <button type="button" data-lesson-tab="learn" class="${state.moduleTab === "learn" ? "active" : ""}">1. Learn</button>
      <button type="button" data-lesson-tab="example" class="${state.moduleTab === "example" ? "active" : ""}">2. See it</button>
      <button type="button" data-lesson-tab="form" class="${state.moduleTab === "form" ? "active" : ""}" ${hasForm ? "" : "disabled"}>3. Form map</button>
      <button type="button" data-lesson-tab="practice" class="${state.moduleTab === "practice" ? "active" : ""}">4. Work it</button>
    </div>`;
  }

  function renderLearn(module) {
    return `<div class="instruction-grid">
      <div>
        <section class="lesson-section">
          <h3>Why this matters</h3>
          <p>${esc(module.why)}</p>
        </section>
        <section class="lesson-section">
          <h3>The mental model</h3>
          <ul class="concept-list">${module.concepts.map(([title, detail], index) => `<li><b>${index + 1}</b><div><strong>${esc(title)}</strong><span>${esc(detail)}</span></div></li>`).join("")}</ul>
        </section>
      </div>
      <aside>
        <div class="doctrine-note"><strong>Evidence-backed training note</strong>${esc(module.doctrine)}<small style="display:block;margin-top:8px"><b>Source:</b> ${esc(module.source)}</small></div>
        <div class="coach-note" style="margin-top:12px"><strong>Use it in the mission</strong>You will need this exact mental model later. The mission changes the numbers and pressure, not the accountability principle.</div>
        <label class="field-notes" style="margin-top:12px">My field notes<textarea data-learner-note="${module.id}" placeholder="Write the rule, equation, or question you want available during review.">${esc((state.learnerNotes && state.learnerNotes[module.id]) || "")}</textarea><small>Saved only on this device.</small></label>
      </aside>
    </div>
    <div class="action-row"><button class="primary-button" type="button" data-action="lesson-next" data-next-tab="example">Show the worked example</button></div>`;
  }

  function renderExample(module) {
    return `<section class="lesson-section">
      <h3>Worked operational example</h3>
      <div class="worked-case">
        <div><span>Situation</span><p>${esc(module.situation)}</p></div>
        <div><span>Reasoning</span><p>${esc(module.analysis)}</p></div>
        <div><span>Takeaway</span><p><strong>${esc(module.takeaway)}</strong></p></div>
      </div>
    </section>
    <div class="coach-note"><strong>Pause and predict</strong>Before opening the form map, say what evidence you would want in front of you and what could go wrong if you skipped it.</div>
    <div class="action-row"><button class="secondary-button" type="button" data-action="lesson-next" data-next-tab="learn">Back to lesson</button><button class="primary-button" type="button" data-action="lesson-next" data-next-tab="form">Inspect the form map</button></div>`;
  }

  function renderForm(module) {
    const cells = module.form.cells.map(([label, detail, span, highlight]) => `<div class="form-cell ${highlight ? "highlight" : ""}" data-span="${span}"><b>${esc(label)}</b><small>${esc(detail)}</small></div>`).join("");
    return `<section class="lesson-section">
      <h3>Read the form by purpose</h3>
      <p>Do not memorize a picture. Connect each block to the accountability question it answers.</p>
    </section>
    <div class="form-simulator">
      <div class="form-title"><strong>${esc(module.form.title)}</strong><span>${esc(module.form.subtitle)}</span></div>
      <div class="form-grid">${cells}</div>
    </div>
    <div class="action-row"><button class="secondary-button" type="button" data-action="lesson-next" data-next-tab="example">Back to example</button><button class="primary-button" type="button" data-action="lesson-next" data-next-tab="practice">Work the performance check</button></div>`;
  }

  function denominationRows(rows, prefix = "denom") {
    return `<table class="denomination-table"><thead><tr><th>Denomination</th><th>Quantity</th><th>Extension</th></tr></thead><tbody>
      ${rows.map(([denom, quantity], index) => `<tr><td>${money(denom)}</td><td><input type="number" inputmode="numeric" min="0" data-${prefix}-qty="${index}" aria-label="${money(denom)} quantity"></td><td data-${prefix}-extension="${index}">$0.00</td></tr>`).join("")}
      <tr><th colspan="2">Physical total</th><th id="${prefix}Total">$0.00</th></tr>
    </tbody></table>`;
  }

  function renderPracticeFields(module) {
    const practice = module.practice;
    if (practice.type === "multi") {
      return `<div class="form-simulator" style="margin-bottom:16px">
        <div class="form-title"><strong>APPOINTMENT BLOCK PRACTICE</strong><span>Fictional training entry</span></div>
        <div class="field-grid" style="padding:14px">
          <label>Appointed position<input name="appointedRole" placeholder="Example: Cashier"></label>
          <label>Authorized duty / scope<input name="appointedScope" placeholder="What accountable work is authorized?"></label>
          <label>Acknowledgement<select name="acknowledgement"><option value="">Select</option><option value="accepted">Appointee acknowledges responsibilities</option><option value="pending">Appointment is still pending</option></select></label>
          <label>Transfer status<select name="transferStatus"><option value="">Select</option><option value="hold">Hold funds until appointment is valid</option><option value="issue">Issue funds while paperwork catches up</option></select></label>
        </div>
      </div>
      <div class="choice-grid">${practice.options.map(([value, label], index) => `<label class="choice-button"><input type="checkbox" name="practiceChoice" value="${value}"><span>${String.fromCharCode(65 + index)}</span><span>${esc(label)}</span></label>`).join("")}</div>`;
    }
    if (practice.type === "dd1081") {
      return `<div class="form-simulator" style="margin-bottom:16px">
        <div class="form-title"><strong>DD FORM 1081 BLOCK PRACTICE</strong><span>Sanitized training entry</span></div>
        <div class="field-grid" style="padding:14px">
          <label>From role<select name="fromRole"><option value="">Select</option><option value="ddo">DDO</option><option value="customer">Customer</option></select></label>
          <label>To role<select name="toRole"><option value="">Select</option><option value="cashier">Cashier</option><option value="vendor">Vendor</option></select></label>
          <label>Transaction type<select name="transactionType"><option value="">Select</option><option value="advance">Advance</option><option value="purchase">Purchase</option></select></label>
          <label>Description<input name="description" placeholder="What accountability is moving?"></label>
        </div>
      </div>
      <div class="field-grid three">
        <label>Form amount<input type="number" inputmode="decimal" name="formAmount" value="4000"></label>
        <label>Physical count<input type="number" inputmode="decimal" name="physicalAmount" value="3980"></label>
        <label>Physical minus form<input type="number" inputmode="decimal" step="any" name="difference" placeholder="Negative values allowed"></label>
      </div>
      <label>Receiver decision<select name="decision"><option value="">Select</option><option value="sign">Sign and accept</option><option value="reconcile">Stop and reconcile before acceptance</option><option value="edit">Change the form to the physical count without review</option></select></label>`;
    }
    if (practice.type === "denominations") {
      return `${denominationRows(practice.rows, "academy")}<div class="field-grid"><label>Book accountability<input type="number" value="${practice.book}" readonly></label><label>Physical minus book<input type="number" inputmode="decimal" step="any" name="difference" placeholder="Example: -10"></label></div>`;
    }
    if (practice.type === "dd2665") {
      return `<div class="form-simulator">
        <div class="form-title"><strong>DD FORM 2665 ACCOUNTABILITY PRACTICE</strong><span>Sanitized conceptual blocks</span></div>
        <div class="field-grid" style="padding:14px">
          <label>Accountable role<input name="agentRole" placeholder="Who holds the accountability?"></label>
          <label>Reporting period<input name="reportingPeriod" placeholder="Example: Daily closeout"></label>
          <label>Opening accountability<input type="number" value="${practice.opening}" readonly></label>
          <label>Supported increases<input type="number" value="0" readonly></label>
          <label>Supported payments / decreases<input type="number" value="${practice.payments}" readonly></label>
          <label>Unused funds returned / decreases<input type="number" value="${practice.returns}" readonly></label>
          <label>Ending accountability<input type="number" inputmode="decimal" name="ending" placeholder="Compute the result"></label>
          <label>Supporting position<input name="supportPosition" placeholder="What must substantiate the ending?"></label>
        </div>
      </div>`;
    }
    if (practice.type === "currency") {
      return `<div class="form-simulator" style="margin-bottom:16px">
        <div class="form-title"><strong>RATE EVIDENCE RECORD</strong><span>Fictional training source</span></div>
        <div class="field-grid" style="padding:14px">
          <label>Rate source<input name="rateSource" placeholder="Where did the authorized rate come from?"></label>
          <label>Effective date<input type="date" name="rateDate"></label>
          <label>Rate purpose<select name="ratePurpose"><option value="">Select</option><option value="planning">Mission planning</option><option value="transaction">Transaction / exchange</option><option value="purchase">Local FC purchase</option><option value="revaluation">Accountability revaluation</option></select></label>
          <label>Evidence retained<input name="rateEvidence" placeholder="What proves the rate and calculation?"></label>
        </div>
      </div>
      <div class="choice-grid">
        <label>Situation 1: OPORD rate is for planning; annex has today's authorized rate<select name="currencyOne"><option value="">Select branch</option><option value="budget">Use budget rate</option><option value="transaction">Use transaction rate</option><option value="apr">Compute APR</option></select></label>
        <label>Situation 2: FC is purchased locally with no exercise prevailing rate<select name="currencyTwo"><option value="">Select branch</option><option value="budget">Use budget rate</option><option value="revaluation">Record revaluation</option><option value="apr">Compute APR</option></select></label>
        <label>Situation 3: physical FC quantity is unchanged but prevailing-rate value changes<select name="currencyThree"><option value="">Select branch</option><option value="shortage">Record shortage</option><option value="revaluation">Use revaluation branch</option><option value="apr">Compute APR</option></select></label>
      </div>`;
    }
    if (practice.type === "voucher") {
      return `<div class="form-simulator" style="margin-bottom:16px">
        <div class="form-title"><strong>PRE-PAYMENT REVIEW RECORD</strong><span>Fictional packet</span></div>
        <div class="field-grid" style="padding:14px">
          <label>Authorized purpose<input name="voucherPurpose" placeholder="What mission need is supported?"></label>
          <label>Payee identity status<select name="payeeStatus"><option value="">Select</option><option value="verified">Verified against support</option><option value="unknown">Not verified</option></select></label>
          <label>Receipt / invoice status<select name="receiptStatus"><option value="">Select</option><option value="present">Present and legible</option><option value="missing">Missing</option></select></label>
          <label>Prior-payment search<select name="priorSearch"><option value="">Select</option><option value="clear">No match found</option><option value="match">Possible duplicate match</option></select></label>
        </div>
      </div>
      <div class="choice-grid">
        <label>Packet A: complete, approved, no prior payment<select name="packetA"><option value="">Disposition</option><option value="pay">Pay</option><option value="hold">Hold</option><option value="reject">Reject</option></select></label>
        <label>Packet B: receipt is missing<select name="packetB"><option value="">Disposition</option><option value="pay">Pay</option><option value="hold">Hold for support</option><option value="reject">Reject permanently</option></select></label>
        <label>Packet C: invoice number matches yesterday's paid record<select name="packetC"><option value="">Disposition</option><option value="pay">Pay</option><option value="hold">Hold</option><option value="reject">Stop as duplicate and route</option></select></label>
      </div>`;
    }
    if (practice.type === "balance") {
      return `<div class="form-simulator" style="margin-bottom:16px">
        <div class="form-title"><strong>MANUAL ACCOUNTABILITY WORKPAPER</strong><span>Physical minus book</span></div>
        <div class="field-grid three" style="padding:14px">
          <label>Opening accountability<input type="number" value="4000" readonly></label>
          <label>Supported increases<input type="number" value="0" readonly></label>
          <label>Supported decreases<input type="number" value="735" readonly></label>
          <label>Computed book<input type="number" inputmode="decimal" name="workpaperBook"></label>
          <label>Physical count<input type="number" value="3250" readonly></label>
          <label>Physical minus book<input type="number" inputmode="decimal" step="any" name="workpaperDifference"></label>
        </div>
      </div>
      <div class="field-grid three">
        <label>Case 1 book: 4000 - 735<input type="number" inputmode="decimal" name="bookOne"></label>
        <label>Case 1 physical<input type="number" value="3250" readonly></label>
        <label>Case 1 difference<input type="number" inputmode="decimal" step="any" name="diffOne"></label>
        <label>Case 2 book: 2800 + 200 - 950<input type="number" inputmode="decimal" name="bookTwo"></label>
        <label>Case 2 physical<input type="number" value="2050" readonly></label>
        <label>Case 2 difference<input type="number" inputmode="decimal" step="any" name="diffTwo"></label>
        <label>Case 3 book: 5000 - 2105<input type="number" inputmode="decimal" name="bookThree"></label>
        <label>Case 3 physical<input type="number" value="2900" readonly></label>
        <label>Case 3 difference<input type="number" inputmode="decimal" step="any" name="diffThree"></label>
      </div>`;
    }
    if (practice.type === "handoff") {
      return `<div class="form-simulator">
        <div class="form-title"><strong>PACE HANDOFF RECORD</strong><span>Position - Accountability - Controls - Execution</span></div>
        <div style="padding:14px">
      <div class="field-grid">
        <label>From role<select name="fromRole"><option>Paying Agent</option><option>Cashier</option><option>Team Chief</option></select></label>
        <label>To role<select name="toRole"><option>Cashier</option><option>DDO</option><option>Team Chief</option></select></label>
      </div>
      <label>Accountability position<input name="position" placeholder="Amount remaining and activity completed"></label>
      <label>Controls and unresolved risk<input name="risk" placeholder="What support or decision is still missing?"></label>
      <label>Execution / next owner<input name="nextOwner" placeholder="Who acts next, and what must they confirm?"></label>
      </div></div>`;
    }
    return "";
  }

  function renderPractice(module) {
    const mastered = state.masteredModules.includes(module.id);
    return `<div class="practice-shell">
      <div class="practice-brief"><h3>Performance check</h3><p>${esc(module.practice.prompt)}</p></div>
      <form id="modulePracticeForm" data-module-id="${module.id}">
        ${renderPracticeFields(module)}
        <label style="margin-top:14px">${esc(module.practice.explainPrompt)}<textarea name="explanation" placeholder="Use your own words. Exact wording is not required."></textarea></label>
        <div class="action-row"><button class="primary-button" type="submit">${mastered ? "Recheck mastery" : "Submit performance check"}</button><button class="quiet-button" type="button" data-action="lesson-next" data-next-tab="learn">Review lesson</button></div>
      </form>
      <div id="moduleFeedback">${mastered ? `<div class="success-note"><strong>Mastery recorded</strong>You may repeat this check or continue.</div>${module.id === modules[modules.length - 1].id && !(state.retrieval && state.retrieval.completed) ? `<div class="action-row"><button class="primary-button" type="button" data-action="open-retrieval">Start readiness recall</button></div>` : ""}` : ""}</div>
    </div>`;
  }

  function renderLesson() {
    const module = modules[state.moduleIndex];
    let body = renderLearn(module);
    if (state.moduleTab === "example") body = renderExample(module);
    if (state.moduleTab === "form") body = renderForm(module);
    if (state.moduleTab === "practice") body = renderPractice(module);
    $("#lessonStage").innerHTML = `<header class="lesson-command">
      <div><p class="eyebrow">Module ${state.moduleIndex + 1} of ${modules.length} - ${module.duration} minutes</p><h2>${esc(module.title)}</h2><p>${esc(module.why)}</p></div>
      <div class="standard-box"><span>Performance standard</span><strong>${esc(module.standard)}</strong></div>
    </header>${lessonTabs(module)}<div class="lesson-body">${body}</div>`;
    updateAcademyDenominations();
  }

  function updateAcademyDenominations() {
    const module = modules[state.moduleIndex];
    if (state.moduleTab !== "practice" || module.practice.type !== "denominations") return;
    const inputs = $$("[data-academy-qty]");
    const update = () => {
      let total = 0;
      inputs.forEach((input, index) => {
        const extension = (number(input.value) || 0) * module.practice.rows[index][0];
        total += extension;
        $(`[data-academy-extension="${index}"]`).textContent = money(extension);
      });
      $("#academyTotal").textContent = money(total);
    };
    inputs.forEach(input => input.addEventListener("input", update));
  }

  function moduleEvaluation(module, form) {
    const data = new FormData(form);
    const explanation = data.get("explanation");
    const concepts = conceptScore(explanation, module.practice.concepts);
    let taskPass = false;
    const coaching = [];

    if (module.practice.type === "multi") {
      const selected = data.getAll("practiceChoice").sort();
      const role = String(data.get("appointedRole") || "").toLowerCase();
      const scope = String(data.get("appointedScope") || "").toLowerCase();
      taskPass = JSON.stringify(selected) === JSON.stringify([...module.practice.answers].sort()) &&
        role.includes("cashier") && scope.length >= 8 && data.get("acknowledgement") === "accepted" && data.get("transferStatus") === "hold";
      if (!taskPass) coaching.push("Verify identity, authorized scope, and acknowledged acceptance. Operational demand and rank are not substitutes.");
    }
    if (module.practice.type === "dd1081") {
      const description = String(data.get("description") || "").toLowerCase();
      taskPass = data.get("fromRole") === "ddo" && data.get("toRole") === "cashier" && data.get("transactionType") === "advance" &&
        (description.includes("cash") || description.includes("fund")) && closeEnough(number(data.get("difference")), -20) && data.get("decision") === "reconcile";
      if (!taskPass) coaching.push("Compute physical minus form: 3,980 - 4,000 = -20. Stop and reconcile before signing.");
    }
    if (module.practice.type === "denominations") {
      const total = module.practice.rows.reduce((sum, [denom], index) => sum + denom * (number($(`[data-academy-qty="${index}"]`).value) || 0), 0);
      taskPass = closeEnough(total, 3515) && closeEnough(number(data.get("difference")), -10);
      if (!taskPass) coaching.push("Extend each denomination, total the physical drawer, then subtract the $3,525 book balance. Negative results are allowed.");
    }
    if (module.practice.type === "dd2665") {
      const role = String(data.get("agentRole") || "").toLowerCase();
      const period = String(data.get("reportingPeriod") || "").toLowerCase();
      const support = String(data.get("supportPosition") || "").toLowerCase();
      taskPass = (role.includes("agent") || role.includes("cashier")) && period.length >= 5 &&
        closeEnough(number(data.get("ending")), 4450) && (support.includes("cash") || support.includes("document") || support.includes("support"));
      if (!taskPass) coaching.push("Opening 6,000 minus 1,250 in supported payments minus 300 returned equals 4,450 ending accountability.");
    }
    if (module.practice.type === "currency") {
      const rateSource = String(data.get("rateSource") || "").trim();
      const rateEvidence = String(data.get("rateEvidence") || "").toLowerCase();
      taskPass = rateSource.length >= 5 && Boolean(data.get("rateDate")) && data.get("ratePurpose") &&
        (rateEvidence.includes("rate") || rateEvidence.includes("source") || rateEvidence.includes("calculation") || rateEvidence.includes("document")) &&
        data.get("currencyOne") === "transaction" && data.get("currencyTwo") === "apr" && data.get("currencyThree") === "revaluation";
      if (!taskPass) coaching.push("Identify the rate's purpose first: transaction rate for the event, APR for locally purchased FC, revaluation for a value change with unchanged physical quantity.");
    }
    if (module.practice.type === "voucher") {
      const purpose = String(data.get("voucherPurpose") || "").trim();
      taskPass = purpose.length >= 5 && data.get("payeeStatus") === "verified" && data.get("receiptStatus") === "present" && data.get("priorSearch") === "clear" &&
        data.get("packetA") === "pay" && data.get("packetB") === "hold" && data.get("packetC") === "reject";
      if (!taskPass) coaching.push("Pay the complete packet, hold the unsupported packet, and stop the duplicate payment for routing and resolution.");
    }
    if (module.practice.type === "balance") {
      taskPass = closeEnough(number(data.get("workpaperBook")), 3265) && closeEnough(number(data.get("workpaperDifference")), -15) &&
        closeEnough(number(data.get("bookOne")), 3265) && closeEnough(number(data.get("diffOne")), -15) &&
        closeEnough(number(data.get("bookTwo")), 2050) && closeEnough(number(data.get("diffTwo")), 0) &&
        closeEnough(number(data.get("bookThree")), 2895) && closeEnough(number(data.get("diffThree")), 5);
      if (!taskPass) coaching.push("Rebuild each book balance first. Then compute physical minus book, preserving the positive or negative sign.");
    }
    if (module.practice.type === "handoff") {
      const position = String(data.get("position") || "").toLowerCase();
      const risk = String(data.get("risk") || "").toLowerCase();
      const nextOwner = String(data.get("nextOwner") || "").toLowerCase();
      taskPass = position.includes("2895") && (position.includes("payment") || position.includes("paid")) &&
        (risk.includes("receipt") || risk.includes("support")) && nextOwner.length >= 8;
      if (!taskPass) coaching.push("State the $2,895 position, the two completed payments, and the unresolved receipt/support risk.");
    }

    const explanationPass = concepts.hits.length >= Math.min(2, module.practice.concepts.length);
    if (!explanationPass) coaching.push(`Your explanation is on the right path, but include at least two of these ideas: ${module.practice.concepts.slice(0, 6).join(", ")}.`);
    return { pass: taskPass && explanationPass, taskPass, explanationPass, coaching };
  }

  function submitModulePractice(form) {
    const module = modules.find(item => item.id === form.dataset.moduleId);
    const result = moduleEvaluation(module, form);
    state.moduleAttempts[module.id] = (state.moduleAttempts[module.id] || 0) + 1;
    const feedback = $("#moduleFeedback");
    if (result.pass) {
      if (!state.masteredModules.includes(module.id)) state.masteredModules.push(module.id);
      saveState();
      feedback.innerHTML = `<div class="feedback-panel pass"><h4>Mastery demonstrated</h4><p>You completed the task and explained the accountability principle in your own words.</p></div>
        <div class="action-row">${state.moduleIndex < modules.length - 1 ? `<button class="primary-button" type="button" data-action="next-module">Continue to module ${state.moduleIndex + 2}</button>` : `<button class="primary-button" type="button" data-action="open-retrieval">Start readiness recall</button>`}</div>`;
      renderModuleRail();
      $("#academyProgressText").textContent = allModulesMastered() && !(state.retrieval && state.retrieval.completed) ? "8 mastered - recall pending" : `${state.masteredModules.length} of ${modules.length}`;
      showToast("Module mastery recorded.");
    } else {
      const attempts = state.moduleAttempts[module.id];
      const scaffold = attempts >= 2 ? `<div class="coach-note" style="margin-top:10px"><strong>Targeted scaffold after ${attempts} attempts</strong>${esc(module.takeaway)} Return to the form map and point to the block that proves each part of your answer.</div>` : "";
      feedback.innerHTML = `<div class="feedback-panel retry"><h4>Not mastered yet - attempt ${attempts}</h4><p>The app is holding this module so the mission does not become guesswork.</p><ul>${result.coaching.map(item => `<li>${esc(item)}</li>`).join("")}</ul></div>${scaffold}<div class="action-row"><button class="secondary-button" type="button" data-action="lesson-next" data-next-tab="form">Review form map</button><button class="quiet-button" type="button" data-action="lesson-next" data-next-tab="example">Review worked example</button></div>`;
      saveState();
    }
  }

  function renderRetrievalCheck() {
    $("#lessonStage").innerHTML = `<header class="lesson-command">
      <div><p class="eyebrow">Academy capstone - 6 minutes</p><h2>Readiness Recall</h2><p>The lesson and form maps are closed. Retrieve the core rules before individual qualification.</p></div>
      <div class="standard-box"><span>Performance standard</span><strong>Answer all five controls and explain the accountability equation.</strong></div>
    </header>
    <div class="lesson-body"><form id="retrievalForm" class="practice-shell">
      <div class="practice-brief"><h3>No-reference retrieval check</h3><p>These questions mix concepts from all eight modules. Exact wording is not required.</p></div>
      <div class="choice-grid">
        <label>A DD Form 1081 says $4,000; physical cash is $3,980. What comes next?<select name="recallOne"><option value="">Select</option><option value="sign">Sign and fix later</option><option value="reconcile">Pause and reconcile before acceptance</option><option value="adjust">Change the form without review</option></select></label>
        <label>Physical cash is $2,900 and book is $2,895. What is the result?<select name="recallTwo"><option value="">Select</option><option value="shortage">$5 shortage</option><option value="overage">$5 overage</option><option value="balanced">Balanced</option></select></label>
        <label>Locally purchased FC must be combined with existing holdings. Which branch applies?<select name="recallThree"><option value="">Select</option><option value="budget">Budget rate</option><option value="apr">Average Purchase Rate</option><option value="revaluation">Revaluation</option></select></label>
        <label>An invoice matches a payment recorded yesterday. What is the disbursing decision?<select name="recallFour"><option value="">Select</option><option value="pay">Pay because it is signed</option><option value="duplicate">Stop and route the duplicate indicator</option><option value="discount">Reduce the amount and pay</option></select></label>
        <label>An accountable member becomes unavailable during a field mission. What must precede resumed payments?<select name="recallFive"><option value="">Select</option><option value="memory">A verbal estimate from memory</option><option value="continuity">Safety, notification, security, witnessed inventory, and documented transfer</option><option value="replacement">A new person simply takes the cash</option></select></label>
      </div>
      <label>State the manual balance equation and what a negative result means.<textarea name="recallExplanation" placeholder="Use opening, increases, decreases, book, physical, and difference."></textarea></label>
      <div class="action-row"><button class="primary-button" type="submit">Submit readiness recall</button><button class="quiet-button" type="button" data-action="review-academy">Review a module</button></div>
      <div id="retrievalFeedback"></div>
    </form></div>`;
  }

  function submitRetrieval(form) {
    const data = new FormData(form);
    const score = conceptScore(data.get("recallExplanation"), ["opening", "increase", "decrease", "book", "physical", "difference", "negative", "shortage"]);
    const pass = data.get("recallOne") === "reconcile" &&
      data.get("recallTwo") === "overage" &&
      data.get("recallThree") === "apr" &&
      data.get("recallFour") === "duplicate" &&
      data.get("recallFive") === "continuity" &&
      score.hits.length >= 4;
    if (!state.retrieval) state.retrieval = { completed: false, attempts: 0 };
    state.retrieval.attempts += 1;
    if (pass) {
      state.retrieval.completed = true;
      saveState();
      $("#retrievalFeedback").innerHTML = `<div class="feedback-panel pass"><h4>Recall standard met</h4><p>You retrieved the control decisions and accountability equation without lesson prompts.</p></div><div class="action-row"><button class="primary-button" type="button" data-route="qualification">Open individual qualification</button></div>`;
      showToast("Academy readiness recall complete.");
    } else {
      const weak = [];
      if (data.get("recallOne") !== "reconcile") weak.push("DD Form 1081 reconciliation");
      if (data.get("recallTwo") !== "overage") weak.push("signed physical-minus-book result");
      if (data.get("recallThree") !== "apr") weak.push("APR branch selection");
      if (data.get("recallFour") !== "duplicate") weak.push("duplicate-payment control");
      if (data.get("recallFive") !== "continuity") weak.push("accountability continuity");
      if (score.hits.length < 4) weak.push("manual balance equation");
      $("#retrievalFeedback").innerHTML = `<div class="feedback-panel retry"><h4>Recall needs reinforcement</h4><p>Review: ${esc(weak.join(", "))}.</p></div>`;
      saveState();
    }
  }

  function qualificationSteps() {
    return ["Authority", "Opening issue", "Activity", "Closeout", "Explain"];
  }

  function qualStepComplete(index) {
    return Boolean(state.qualification.evidence[`step${index}`]);
  }

  function renderQualification() {
    const unlocked = allModulesMastered() && state.retrieval && state.retrieval.completed;
    $("#qualificationStatus").textContent = state.qualification.completed ? "Qualified" : unlocked ? "Available" : "Locked";
    if (!unlocked) {
      const remaining = modules.filter(module => !state.masteredModules.includes(module.id));
      const detail = remaining.length ? `Master all Academy modules first. Remaining: ${remaining.map(item => esc(item.short)).join(", ")}` : "Complete the no-reference readiness recall at the end of the Academy.";
      $("#qualificationWorkspace").innerHTML = `<div class="qualification-shell"><div class="gate-banner locked"><div><strong>Qualification locked</strong><span>${detail}</span></div><button class="primary-button" type="button" data-route="academy">Return to Academy</button></div></div>`;
      return;
    }
    const step = state.qualification.step;
    $("#qualificationWorkspace").innerHTML = `<div class="qualification-shell">
      <div class="gate-banner"><div><strong>${state.qualification.completed ? "Qualification complete" : "No coaching prompts during qualification"}</strong><span>One fictional drawer. Five linked stations. Every answer becomes part of the AAR record.</span></div><b>${state.qualification.completed ? "PASS" : `Station ${step + 1}/5`}</b></div>
      <div class="step-strip">${qualificationSteps().map((label, index) => `<button type="button" data-qual-step="${index}" class="${index === step ? "active" : ""} ${qualStepComplete(index) ? "complete" : ""}" ${index <= step || qualStepComplete(index) ? "" : "disabled"}>${index + 1}. ${label}</button>`).join("")}</div>
      <div class="workbench">${renderQualificationStep(step)}</div>
    </div>`;
    attachQualificationCount();
  }

  function renderQualificationStep(step) {
    if (state.qualification.completed) {
      return `<div class="success-note"><strong>Individual mission access granted</strong>You reconciled the accountability cycle and explained the result. Team Ops is now available.</div>
      <div class="action-row"><button class="primary-button" type="button" data-route="team">Choose a team mission</button><button class="secondary-button" type="button" data-action="reset-qualification">Repeat qualification</button></div>`;
    }
    if (step === 0) {
      return `<form id="qualificationForm" data-qual-form="0"><p class="eyebrow">Station 1 - authority gate</p><h2>Accept or pause the assignment</h2><p>You are assigned as cashier. A supervisor says your appointment is "being processed."</p>
        <label>Decision<select name="decision"><option value="">Select</option><option value="accept">Accept the drawer because the mission is urgent</option><option value="pause">Pause and verify valid appointment, identity, and scope</option></select></label>
        <label>Reasoning<textarea name="reasoning" placeholder="Explain the control in your own words."></textarea></label>
        <div class="action-row"><button class="primary-button" type="submit">Record decision</button></div><div id="qualificationFeedback"></div></form>`;
    }
    if (step === 1) {
      const rows = [[100,20],[50,20],[20,40],[10,20],[5,20],[1,100]];
      return `<form id="qualificationForm" data-qual-form="1"><p class="eyebrow">Station 2 - opening issue</p><h2>Verify the DD Form 1081 advance</h2><p>The issuer states the advance is $4,200. Count the fictional drawer by denomination before acceptance.</p>
        ${denominationRows(rows, "qual")}
        <div class="field-grid"><label>DD Form 1081 amount<input type="number" value="4200" readonly></label><label>Physical minus form<input type="number" inputmode="decimal" step="any" name="difference" placeholder="Negative values allowed"></label></div>
        <label>Acceptance decision<select name="decision"><option value="">Select</option><option value="accept">Counts match - accept</option><option value="pause">Counts differ - pause</option></select></label>
        <div class="action-row"><button class="primary-button" type="submit">Complete opening issue</button></div><div id="qualificationFeedback"></div></form>`;
    }
    if (step === 2) {
      return `<form id="qualificationForm" data-qual-form="2"><p class="eyebrow">Station 3 - supported activity</p><h2>Rebuild book accountability</h2>
        <table class="transaction-table"><thead><tr><th>Activity</th><th>Effect</th></tr></thead><tbody><tr><td>Opening accountability</td><td class="amount-positive">$4,200</td></tr><tr><td>Supported payment A</td><td class="amount-negative">-$615</td></tr><tr><td>Supported payment B</td><td class="amount-negative">-$280</td></tr><tr><td>Unused funds returned to cashier</td><td class="amount-positive">+$300</td></tr></tbody></table>
        <label>Closing book accountability<input type="number" inputmode="decimal" name="book" placeholder="Opening plus increases minus decreases"></label>
        <label>Reasoning<textarea name="reasoning" placeholder="State the equation you used."></textarea></label>
        <div class="action-row"><button class="primary-button" type="submit">Post activity</button></div><div id="qualificationFeedback"></div></form>`;
    }
    if (step === 3) {
      const rows = [[100,27],[50,8],[20,15],[10,10],[5,10],[1,45]];
      return `<form id="qualificationForm" data-qual-form="3"><p class="eyebrow">Station 4 - closeout count</p><h2>Determine the accountability result</h2><p>Count the final physical drawer. Then calculate physical minus the $3,605 book accountability.</p>
        ${denominationRows(rows, "qual")}
        <div class="field-grid"><label>Book accountability<input type="number" value="3605" readonly></label><label>Physical minus book<input type="number" inputmode="decimal" step="any" name="difference" placeholder="Example: -10"></label></div>
        <label>Classification<select name="classification"><option value="">Select</option><option value="balanced">Balanced</option><option value="shortage">Shortage</option><option value="overage">Overage</option></select></label>
        <div class="action-row"><button class="primary-button" type="submit">Record closeout result</button></div><div id="qualificationFeedback"></div></form>`;
    }
    return `<form id="qualificationForm" data-qual-form="4"><p class="eyebrow">Station 5 - defend the result</p><h2>Brief the DDO</h2><p>Your book accountability is $3,605. Your physical count is $3,595.</p>
      <label>Closeout explanation<textarea name="reasoning" placeholder="State the amount and direction, how you calculated it, and the immediate control actions."></textarea></label>
      <div class="choice-grid">
        <label class="choice-button"><input type="checkbox" name="actions" value="recount"><span>A</span><span>Conduct an independent recount.</span></label>
        <label class="choice-button"><input type="checkbox" name="actions" value="review"><span>B</span><span>Review supported transactions and count extensions.</span></label>
        <label class="choice-button"><input type="checkbox" name="actions" value="hide"><span>C</span><span>Change the book balance so the numbers match.</span></label>
      </div>
      <div class="action-row"><button class="primary-button" type="submit">Submit qualification</button></div><div id="qualificationFeedback"></div></form>`;
  }

  function attachQualificationCount() {
    const form = $("#qualificationForm");
    if (!form) return;
    const step = Number(form.dataset.qualForm);
    if (![1,3].includes(step)) return;
    const rows = step === 1 ? [[100,20],[50,20],[20,40],[10,20],[5,20],[1,100]] : [[100,27],[50,8],[20,15],[10,10],[5,10],[1,45]];
    const inputs = $$("[data-qual-qty]", form);
    const update = () => {
      let total = 0;
      inputs.forEach((input, index) => {
        const extension = (number(input.value) || 0) * rows[index][0];
        total += extension;
        $(`[data-qual-extension="${index}"]`, form).textContent = money(extension);
      });
      $("#qualTotal").textContent = money(total);
    };
    inputs.forEach(input => input.addEventListener("input", update));
  }

  function submitQualification(form) {
    const step = Number(form.dataset.qualForm);
    const data = new FormData(form);
    let pass = false;
    let feedback = "";
    if (step === 0) {
      const concepts = conceptScore(data.get("reasoning"), ["appointment", "authority", "scope", "verify", "accountability"]);
      pass = data.get("decision") === "pause" && concepts.hits.length >= 2;
      feedback = "Pause the transfer until appointment, identity, and authorized scope are verified.";
    }
    if (step === 1) {
      const expectedRows = [[100,20],[50,20],[20,40],[10,20],[5,20],[1,100]];
      const total = expectedRows.reduce((sum, [denom], index) => sum + denom * (number($(`[data-qual-qty="${index}"]`, form).value) || 0), 0);
      pass = closeEnough(total, 4200) && closeEnough(number(data.get("difference")), 0) && data.get("decision") === "accept";
      feedback = "The denomination count must total $4,200, the difference must be zero, and the acceptance decision must match.";
    }
    if (step === 2) {
      const concepts = conceptScore(data.get("reasoning"), ["opening", "increase", "decrease", "payment", "return", "3605"]);
      pass = closeEnough(number(data.get("book")), 3605) && concepts.hits.length >= 2;
      feedback = "Book accountability is $4,200 - $615 - $280 + $300 = $3,605.";
    }
    if (step === 3) {
      const expectedRows = [[100,27],[50,8],[20,15],[10,10],[5,10],[1,45]];
      const total = expectedRows.reduce((sum, [denom], index) => sum + denom * (number($(`[data-qual-qty="${index}"]`, form).value) || 0), 0);
      pass = closeEnough(total, 3595) && closeEnough(number(data.get("difference")), -10) && data.get("classification") === "shortage";
      feedback = "The physical count is $3,595. Physical minus book is -$10, so the drawer is short.";
    }
    if (step === 4) {
      const concepts = conceptScore(data.get("reasoning"), ["3595", "3605", "10", "short", "recount", "review", "physical", "book"]);
      const actions = data.getAll("actions");
      pass = concepts.hits.length >= 3 && actions.includes("recount") && actions.includes("review") && !actions.includes("hide");
      feedback = "A defensible brief states the -$10 shortage, the physical-minus-book equation, an independent recount, and review of supported activity.";
    }

    state.qualification.attempts += 1;
    if (!pass) {
      $("#qualificationFeedback").innerHTML = `<div class="feedback-panel retry"><h4>Station not passed</h4><p>${esc(feedback)}</p></div>`;
      saveState();
      return;
    }
    state.qualification.evidence[`step${step}`] = { completedAt: new Date().toISOString() };
    if (step < 4) {
      state.qualification.step = step + 1;
    } else {
      state.qualification.completed = true;
      state.qualification.step = 4;
      state.aar.push({ type: "qualification", title: "Individual Cashier Qualification", result: "Pass", at: new Date().toISOString(), note: "Completed authority, DD 1081, activity, denomination closeout, and explanation stations." });
    }
    saveState();
    renderQualification();
    showToast(step === 4 ? "Individual qualification complete." : `Station ${step + 1} complete.`);
  }

  function missionProgress(id) {
    if (!state.missions[id]) state.missions[id] = { stage: 0, completedStages: [], completed: false, evidence: {}, roles: {}, roleChecks: {}, handoffs: [], stageAttempts: {} };
    if (!state.missions[id].roleChecks) state.missions[id].roleChecks = {};
    if (!state.missions[id].handoffs) state.missions[id].handoffs = [];
    if (!state.missions[id].stageAttempts) state.missions[id].stageAttempts = {};
    return state.missions[id];
  }

  function generateTeamCode(missionId = "open") {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let suffix = "";
    for (let index = 0; index < 4; index += 1) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
    const mission = missions.find(item => item.id === missionId);
    return `${mission ? mission.code.replace("-", "") : "DRS"}-${suffix}`;
  }

  function teamSessionReady() {
    return Boolean(state.teamSession && state.teamSession.code && state.teamSession.teamName);
  }

  function renderTeam() {
    if (!state.qualification.completed) {
      $("#missionLibrary").innerHTML = `<div class="qualification-shell"><div class="gate-banner locked"><div><strong>Team Ops locked</strong><span>Each learner must complete individual qualification before receiving a team role.</span></div><button class="primary-button" type="button" data-route="qualification">Open qualification</button></div></div>`;
      $("#missionWorkspace").innerHTML = "";
      return;
    }
    const session = state.teamSession || { code: "", teamName: "", assignedMission: "" };
    $("#missionLibrary").innerHTML = `<section class="team-session-panel">
      <div><p class="eyebrow">Offline team session</p><h2>${teamSessionReady() ? `${esc(session.teamName)} - ${esc(session.code)}` : "Create a team roster slip"}</h2><p>${teamSessionReady() ? "This code labels the local mission and AAR record. It does not transmit data." : "The facilitator assigns a team name and mission. The generated code keeps paper notes and local AAR records together."}</p></div>
      <div class="team-session-controls">
        <label>Team name<input id="teamNameInput" value="${esc(session.teamName || "")}" placeholder="Example: Team Falcon"></label>
        <label>Assigned mission<select id="teamMissionInput"><option value="">Select mission</option>${missions.map(mission => `<option value="${mission.id}" ${session.assignedMission === mission.id ? "selected" : ""}>${mission.code} ${esc(mission.title)}</option>`).join("")}</select></label>
        <button class="primary-button" type="button" data-action="create-team-session">${teamSessionReady() ? "Update roster slip" : "Create roster slip"}</button>
      </div>
    </section>
    <div class="mission-library-grid">${missions.map(mission => {
      const progress = missionProgress(mission.id);
      const assigned = session.assignedMission === mission.id;
      return `<article class="mission-card">
        <span class="mission-code">${mission.code} - ${mission.difficulty}${assigned ? " - assigned" : ""}</span>
        <h3>${esc(mission.title)}</h3>
        <p>${esc(mission.objective)}</p>
        <div class="mission-tags">${mission.roles.slice(0, 4).map(role => `<span>${esc(role)}</span>`).join("")}</div>
        <div class="action-row"><button class="${progress.completed ? "secondary-button" : "primary-button"}" type="button" data-select-mission="${mission.id}">${progress.completed ? "Review mission" : progress.completedStages.length ? "Continue mission" : assigned ? "Start assigned mission" : "Open mission"}</button></div>
      </article>`;
    }).join("")}</div>`;
    renderMissionWorkspace();
  }

  function missionStageAvailable(stage, progress) {
    return stage === 0 || progress.completedStages.includes(stage - 1) || progress.completedStages.includes(stage);
  }

  function renderMissionWorkspace() {
    const root = $("#missionWorkspace");
    if (!state.selectedMission) {
      root.innerHTML = `<div class="coach-note" style="margin-top:18px"><strong>Facilitator move</strong>Assign different missions to different teams. Each mission varies the control problem, opening accountability, documents, inject, and required handoff.</div>`;
      return;
    }
    const mission = missions.find(item => item.id === state.selectedMission);
    const progress = missionProgress(mission.id);
    const labels = ["OPORD", "Roles", "Issue", "Execute", "Inject", "Closeout"];
    const sessionLabel = teamSessionReady() ? `${state.teamSession.teamName} - ${state.teamSession.code}` : "Local unassigned team";
    root.innerHTML = `<div class="mission-shell">
      <header class="mission-command"><div><p class="eyebrow">${mission.code} - ${mission.difficulty}</p><h2>${esc(mission.title)}</h2><p>${esc(mission.objective)}</p><span class="mission-session-label">${esc(sessionLabel)}</span></div><div class="mission-clock"><strong>70</strong><span>mission minutes</span><button class="secondary-button print-brief-button" type="button" data-action="print-mission">Print brief</button></div></header>
      <div class="step-strip mission-stage-strip">${labels.map((label, index) => `<button type="button" data-mission-stage="${index}" class="${progress.stage === index ? "active" : ""} ${progress.completedStages.includes(index) ? "complete" : ""}" ${missionStageAvailable(index, progress) ? "" : "disabled"}>${index + 1}. ${label}</button>`).join("")}</div>
      <div class="workbench">${renderMissionStage(mission, progress)}</div>
      ${renderPrintPacket(mission, progress, sessionLabel)}
    </div>`;
    attachMissionCount(mission, progress);
  }

  function renderMissionStage(mission, progress) {
    const stage = progress.stage;
    if (progress.completed) {
      return `<div class="success-note"><strong>Mission complete</strong>The team produced role evidence, preserved accountability, responded to the inject, and completed closeout.</div><div class="action-row"><button class="primary-button" type="button" data-route="aar">Open AAR record</button><button class="secondary-button" type="button" data-action="replay-mission">Replay with a new local variant</button></div>`;
    }
    if (stage === 0) {
      return `<p class="eyebrow">Five-paragraph mission order</p><div class="opord-grid">${mission.opord.map(([title, text], index) => `<section><span>${index + 1}</span><h4>${esc(title)}</h4><p>${esc(text)}</p></section>`).join("")}</div>
        <div class="intent-grid">
          <section><p class="eyebrow">Commander's intent</p><h3>Purpose</h3><p>${esc(missionIntent(mission).purpose)}</p></section>
          <section><p class="eyebrow">Key tasks</p><ul>${missionIntent(mission).tasks.map(task => `<li>${esc(task)}</li>`).join("")}</ul></section>
          <section><p class="eyebrow">End state</p><h3>Success</h3><p>${esc(missionIntent(mission).endState)}</p></section>
        </div>
        <div class="mission-brief-grid">
          <section><h4>Coordinating instructions</h4><ul><li>No accountable activity before authority and opening position are verified.</li><li>Every material decision must identify its supporting evidence.</li><li>Stop and elevate unresolved discrepancies; do not force a balance.</li></ul></section>
          <section><h4>Execution timeline</h4><ol><li>T+00: receive OPORD and assign roles</li><li>T+10: establish opening accountability</li><li>T+25: execute mission activity</li><li>T+45: respond to FRAGO or inject</li><li>T+60: reconcile, hand off, and brief</li></ol></section>
          <section><h4>Mission success criteria</h4><ul>${missionSuccessCriteria(mission).map(item => `<li>${esc(item)}</li>`).join("")}</ul></section>
        </div>
        <label style="margin-top:16px">Team leader's mission backbrief<textarea id="missionBackbrief" placeholder="State the mission, accountability objective, and two controls your team cannot skip."></textarea></label>
        <div class="action-row"><button class="primary-button" type="button" data-action="complete-mission-stage" data-stage="0">Accept mission</button></div><div id="missionFeedback"></div>`;
    }
    if (stage === 1) {
      return `<p class="eyebrow">Role assignment</p><h2>Every role owns evidence</h2><p>Enter a callsign for each station. One person may hold two roles on a small team, but every station must be briefed.</p>
        <div class="role-board">${mission.roles.map(role => `<label class="role-station"><strong>${esc(role)}</strong><span>${esc(rolePurpose(role))}</span><input data-role-name="${esc(role)}" value="${esc(progress.roles[role] || "")}" placeholder="Callsign"><span class="station-check">This member will brief the station evidence during closeout.</span></label>`).join("")}</div>
        <div class="action-row"><button class="primary-button" type="button" data-action="complete-mission-stage" data-stage="1">Lock team roles</button></div><div id="missionFeedback"></div>`;
    }
    if (stage === 2) {
      if (mission.issueMode === "fc") {
        return `<p class="eyebrow">Initial accountability evidence</p><h2>Verify physical FC and its opening equivalent</h2><p>The agent holds ${mission.fcQuantity.toLocaleString()} units of fictional FC. The exercise opening rate is ${mission.oldRate} FC per $1 USD.</p>
          <div class="field-grid three"><label>Physical FC quantity<input type="number" value="${mission.fcQuantity}" readonly></label><label>Opening rate: FC per USD<input type="number" value="${mission.oldRate}" readonly></label><label>Opening USD equivalent<input type="number" inputmode="decimal" id="missionFcEquivalent"></label></div>
          <label>Agent to DDO accountability handoff<textarea id="missionIssueHandoff" placeholder="State the physical FC, rate source, equivalent, and acceptance decision."></textarea></label>
          <div class="action-row"><button class="primary-button" type="button" data-action="complete-mission-stage" data-stage="2">Accept FC accountability</button></div><div id="missionFeedback"></div>`;
      }
      if (mission.issueMode === "apr-evidence") {
        return `<p class="eyebrow">Initial accountability evidence</p><h2>Build the APR cost basis</h2><p>Verify the existing fictional FC and the new locally purchased FC before computing the combined rate.</p>
          <table class="transaction-table"><thead><tr><th>Evidence</th><th>FC</th><th>USD cost</th></tr></thead><tbody><tr><td>Existing holdings</td><td>${mission.existingFc.toLocaleString()}</td><td>${money(mission.existingUsd)}</td></tr><tr><td>New local purchase</td><td>${mission.purchaseFc.toLocaleString()}</td><td>${money(mission.purchaseUsd)}</td></tr></tbody></table>
          <div class="field-grid"><label>Total FC<input type="number" inputmode="decimal" id="missionAprTotalFc"></label><label>Total USD cost basis<input type="number" inputmode="decimal" step="any" id="missionAprTotalUsd"></label></div>
          <label>Bank Liaison to DDO handoff<textarea id="missionIssueHandoff" placeholder="State the two evidence sources, combined FC, combined USD cost, and next calculation."></textarea></label>
          <div class="action-row"><button class="primary-button" type="button" data-action="complete-mission-stage" data-stage="2">Accept APR evidence</button></div><div id="missionFeedback"></div>`;
      }
      const rows = mission.drawerRows || decomposeDrawer(mission.opening);
      return `<p class="eyebrow">Initial issue</p><h2>Count before the team moves</h2><p>Verify the fictional opening accountability of ${money(mission.opening)} by denomination and record the receiving handoff.</p>
        ${denominationRows(rows, "mission")}
        <div class="field-grid"><label>Issue record amount<input type="number" value="${mission.opening}" readonly></label><label>Physical minus issue record<input type="number" inputmode="decimal" step="any" id="missionIssueDifference"></label></div>
        <label>Receiving role handoff<textarea id="missionIssueHandoff" placeholder="State who received the funds, the count result, and whether accountability was accepted."></textarea></label>
        <div class="action-row"><button class="primary-button" type="button" data-action="complete-mission-stage" data-stage="2">Accept initial issue</button></div><div id="missionFeedback"></div>`;
    }
    if (stage === 3) {
      return renderMissionExecution(mission);
    }
    if (stage === 4) {
      return `<div class="inject-banner"><p class="eyebrow">Time-sensitive FRAGO / inject</p><h3>${mission.code} change to conditions</h3><p>${esc(mission.inject)}</p><small>All portions of the base order not changed by this inject remain in effect.</small></div>
        <label style="margin-top:16px">Team response<textarea id="missionInjectResponse" placeholder="State immediate action, control preserved, notification, and next owner."></textarea></label>
        <label>Handoff from / to<input id="missionInjectHandoff" placeholder="Example: Paying Agent to DDO"></label>
        <div class="action-row"><button class="primary-button" type="button" data-action="complete-mission-stage" data-stage="4">Submit inject response</button></div><div id="missionFeedback"></div>`;
    }
    const expectedBook = mission.opening + mission.transactions.reduce((sum, [, amount]) => sum + amount, 0);
    return `<p class="eyebrow">Mission closeout</p><h2>Reconcile and defend</h2>
      <table class="transaction-table"><thead><tr><th>Accountability event</th><th>Effect</th></tr></thead><tbody><tr><td>Opening accountability</td><td>${money(mission.opening)}</td></tr>${mission.transactions.map(([label, amount]) => `<tr><td>${esc(label)}</td><td class="${amount < 0 ? "amount-negative" : "amount-positive"}">${amount < 0 ? "-" : "+"}${money(Math.abs(amount))}</td></tr>`).join("")}</tbody></table>
      <div class="field-grid three"><label>Closing book accountability<input type="number" inputmode="decimal" id="missionClosingBook"></label><label>Physical / supported accountability<input type="number" inputmode="decimal" value="${mission.physical}" readonly></label><label>Physical minus book<input type="number" inputmode="decimal" step="any" id="missionClosingDifference"></label></div>
      <label>Team Chief closeout brief<textarea id="missionCloseoutBrief" placeholder="State the book, physical, result, supporting evidence, and unresolved risk."></textarea></label>
      <section class="role-evidence-board"><p class="eyebrow">Pass-device closeout</p><h3>Each role confirms its own evidence</h3><p>Pass the device to each assigned member. A Team Chief cannot certify another member's station.</p>
        <div class="role-check-grid">${mission.roles.map(role => `<label class="role-check-card"><input type="checkbox" data-role-check="${esc(role)}" ${progress.roleChecks[role] ? "checked" : ""}><span><strong>${esc(role)}</strong><small>${esc(progress.roles[role] || "Unassigned")}</small><em>${esc(roleCloseoutPrompt(role, mission))}</em></span></label>`).join("")}</div>
      </section>
      <div class="action-row"><button class="primary-button" type="button" data-action="complete-mission-stage" data-stage="5">Complete mission</button></div><div id="missionFeedback"></div>`;
  }

  function rolePurpose(role) {
    const purposes = {
      "Commander": "Sets mission intent and directs continuity when accountable personnel become unavailable.",
      "Budget Officer": "Confirms authorized purpose and funding constraints in the fictional mission.",
      "Disbursing Officer": "Owns disbursing accountability and release controls.",
      "DDO": "Supervises issue, operations, reconciliation, and discrepancy resolution.",
      "Disbursing Agent": "Maintains assigned accountability and supporting records.",
      "Cashier": "Counts, accepts, pays or exchanges, records, and closes assigned funds.",
      "Paying Agent": "Executes authorized payments and returns funds and support.",
      "Reviewer": "Independently checks count, calculation, support, and result.",
      "Voucher Reviewer": "Reviews authority, support, amount, and duplicate risk before payment.",
      "Rate Reviewer": "Verifies the fictional rate source, purpose, date, and calculation.",
      "Currency Reviewer": "Confirms the correct currency-accountability branch and adjustment.",
      "Bank Liaison": "Verifies fictional purchase evidence used in the APR branch.",
      "TCCC / Safety Lead": "Controls scene-safety decisions and notification; medical procedures are outside this app.",
      "Inventory Recorder": "Documents the witnessed inventory and transfer position.",
      "Team Chief": "Controls pace, cross-checks handoffs, and delivers the final brief."
    };
    return purposes[role] || "Owns assigned evidence and briefs the next role.";
  }

  function renderPrintPacket(mission, progress, sessionLabel) {
    const intent = missionIntent(mission);
    return `<article class="print-packet">
      <header><p>${esc(mission.code)} - FICTIONAL TRAINING ORDER</p><h1>${esc(mission.title)}</h1><strong>${esc(sessionLabel)}</strong></header>
      <section><h2>Mission</h2><p>${esc(mission.objective)}</p></section>
      <div class="print-opord">${mission.opord.map(([title, text], index) => `<section><h3>${index + 1}. ${esc(title)}</h3><p>${esc(text)}</p></section>`).join("")}</div>
      <section><h2>Commander's intent</h2><h3>Purpose</h3><p>${esc(intent.purpose)}</p><h3>Key tasks</h3><ul>${intent.tasks.map(task => `<li>${esc(task)}</li>`).join("")}</ul><h3>End state</h3><p>${esc(intent.endState)}</p></section>
      <section><h2>Team roster</h2><table><thead><tr><th>Role</th><th>Assigned member</th><th>Evidence responsibility</th></tr></thead><tbody>${mission.roles.map(role => `<tr><td>${esc(role)}</td><td>${esc(progress.roles[role] || "Assign during mission")}</td><td>${esc(roleCloseoutPrompt(role, mission))}</td></tr>`).join("")}</tbody></table></section>
      <section><h2>Success criteria</h2><ul>${missionSuccessCriteria(mission).map(item => `<li>${esc(item)}</li>`).join("")}</ul></section>
      <footer>Training use only. All names, rates, amounts, vendors, and documents are fictional. Verify current policy before operational use.</footer>
    </article>`;
  }

  function missionIntent(mission) {
    const common = {
      purpose: "Provide timely finance support without losing accountability, evidence, or command visibility.",
      tasks: [
        "Establish a verified opening position.",
        "Apply the correct control and calculation branch.",
        "Preserve supporting evidence through every handoff."
      ],
      endState: "The mission requirement is supported, the accountability position is defensible, and the receiving role can continue without reconstructing the team's work."
    };
    const overrides = {
      "paying-agent": {
        purpose: "Support a mission-essential local purchase while keeping every dollar and receipt traceable.",
        tasks: ["Confirm appointment and authorized purpose.", "Pay only supported amounts within authority.", "Return unused funds and complete a cashier handoff."],
        endState: "Authorized purchases are complete, unsupported changes are paused, and all remaining accountability is returned."
      },
      "exchange": {
        purpose: "Provide authorized exchange support using the correct fictional transaction rate.",
        tasks: ["Verify customer eligibility.", "Distinguish planning and transaction rates.", "Maintain separate USD and FC counts with rate evidence."],
        endState: "Each exchange is correctly calculated, documented, and reconciled to both currency positions."
      },
      "revaluation": {
        purpose: "Update the accountability value of held FC without inventing a physical cash loss.",
        tasks: ["Verify the fictional prevailing-rate change.", "Compute the change in USD equivalent.", "Document the revaluation branch separately from APR."],
        endState: "Physical FC is accounted for and the $75 value change is correctly classified and supported."
      },
      "apr": {
        purpose: "Establish a defensible Average Purchase Rate from fictional local FC purchase evidence.",
        tasks: ["Combine existing and newly purchased FC.", "Combine the actual USD cost basis.", "Compute and document FC per $1 USD."],
        endState: "The new APR is reproducible from sanitized purchase evidence and remains separate from revaluation."
      },
      "voucher": {
        purpose: "Release public funds only for payment packets that pass pre-payment controls.",
        tasks: ["Verify authority, support, payee, and calculation.", "Search for prior payment indicators.", "Document pay, hold, or reject decisions."],
        endState: "Only the valid packet is paid; missing support, duplicate risk, and calculation error are stopped."
      },
      "continuity": {
        purpose: "Protect people and preserve public-fund accountability during an operational interruption.",
        tasks: ["Stop activity and establish scene safety.", "Secure funds and records.", "Conduct a witnessed inventory and documented transfer."],
        endState: "Leadership knows the position, accountability is transferred, and operations resume only after control is re-established."
      }
    };
    return overrides[mission.id] || common;
  }

  function missionSuccessCriteria(mission) {
    const criteria = [
      "Opening accountability is independently verified.",
      "Required decisions are explained, not guessed.",
      "Book and physical or supported accountability are compared and any difference is correctly classified.",
      "Every assigned role completes a closeout confirmation."
    ];
    if (mission.id === "voucher") criteria.splice(2, 0, "The duplicate-payment indicator prevents release.");
    if (mission.id === "revaluation") criteria.splice(2, 0, "The value change is not mislabeled as a physical shortage.");
    if (mission.id === "apr") criteria.splice(2, 0, "APR uses fictional purchase evidence and not the budget rate.");
    if (mission.id === "continuity") criteria.splice(0, 0, "Scene safety and command notification precede accountability transfer.");
    return criteria;
  }

  function accountabilityLabel(difference, mission) {
    if (mission.id === "revaluation") return "Revaluation position";
    if (mission.id === "apr") return "APR cost-basis position";
    if (closeEnough(difference, 0)) return "Balanced";
    return difference < 0 ? "Shortage" : "Overage";
  }

  function roleCloseoutPrompt(role, mission) {
    const prompts = {
      "Commander": "Confirms mission intent, interruption decisions, and command notifications.",
      "Budget Officer": "Confirms the fictional purpose and amount stayed within mission authority.",
      "Disbursing Officer": "Confirms release controls and the final accountability conclusion.",
      "DDO": "Confirms issue, reconciliation, discrepancy response, and final handoff.",
      "Disbursing Agent": "Confirms physical assets, supporting records, and ending accountability.",
      "Cashier": "Confirms denomination count, transactions, and drawer closeout.",
      "Paying Agent": "Confirms payments, receipts, unused funds, and return handoff.",
      "Reviewer": "Confirms an independent check of math, support, and result.",
      "Voucher Reviewer": "Confirms each packet disposition and duplicate-payment control.",
      "Rate Reviewer": "Confirms the rate source, purpose, date, and calculation.",
      "Currency Reviewer": "Confirms the currency branch and accountability adjustment.",
      "Bank Liaison": "Confirms fictional purchase evidence used for APR.",
      "TCCC / Safety Lead": "Confirms scene safety and notification decisions only.",
      "Inventory Recorder": "Confirms witnessed inventory and documented transfer.",
      "Team Chief": "Confirms all role handoffs and delivers the final mission brief."
    };
    return prompts[role] || `Confirms the evidence produced for ${mission.title}.`;
  }

  function decomposeDrawer(total) {
    const denominations = [100, 50, 20, 10, 5, 1];
    let remaining = Math.round(total);
    return denominations.map((denom, index) => {
      let quantity;
      if (index === denominations.length - 1) {
        quantity = remaining;
      } else {
        const divisor = index === 0 ? 3 : index === 1 ? 4 : 5;
        quantity = Math.max(0, Math.floor(remaining / denom / divisor));
      }
      remaining -= quantity * denom;
      return [denom, quantity];
    });
  }

  function attachMissionCount(mission, progress) {
    if (progress.stage !== 2 || mission.issueMode) return;
    const rows = mission.drawerRows || decomposeDrawer(mission.opening);
    const inputs = $$("[data-mission-qty]");
    const update = () => {
      let total = 0;
      inputs.forEach((input, index) => {
        const extension = (number(input.value) || 0) * rows[index][0];
        total += extension;
        $(`[data-mission-extension="${index}"]`).textContent = money(extension);
      });
      $("#missionTotal").textContent = money(total);
    };
    inputs.forEach(input => input.addEventListener("input", update));
  }

  function renderMissionExecution(mission) {
    if (mission.decisionType === "cashier") {
      return `<p class="eyebrow">Execution station</p><h2>Process supported activity</h2><table class="transaction-table"><thead><tr><th>Event</th><th>Accountability effect</th></tr></thead><tbody>${mission.transactions.map(([label, amount]) => `<tr><td>${esc(label)}</td><td>${amount < 0 ? "Decrease" : "Increase"} ${money(Math.abs(amount))}</td></tr>`).join("")}</tbody></table><label>Expected book after activity<input id="missionExecutionValue" type="number" inputmode="decimal"></label><label>Reviewer note<textarea id="missionExecutionReason" placeholder="Explain the accountability equation and support reviewed."></textarea></label>${missionExecutionButton()}`;
    }
    if (mission.decisionType === "paying-agent") {
      return `<p class="eyebrow">Execution station</p><h2>Decide what the paying agent may pay</h2>
        <div class="choice-grid"><label>Payment 1: authorized purpose, receipt available<select data-execution-choice="one"><option value="">Decision</option><option value="pay">Pay</option><option value="hold">Hold</option></select></label><label>Payment 2: authorized purpose, amount within authority<select data-execution-choice="two"><option value="">Decision</option><option value="pay">Pay</option><option value="hold">Hold</option></select></label><label>Additional purchase: useful but outside stated purpose<select data-execution-choice="three"><option value="">Decision</option><option value="pay">Pay</option><option value="hold">Pause for revised authority</option></select></label></div>
        <label>Paying Agent to Cashier handoff<textarea id="missionExecutionReason" placeholder="State payments, support, unused funds, and unresolved items."></textarea></label>${missionExecutionButton()}`;
    }
    if (mission.decisionType === "exchange") {
      return `<p class="eyebrow">Execution station</p><h2>Select and defend the transaction rate</h2><div class="field-grid"><label>Authorized transaction rate (FC per USD)<input type="number" value="${mission.rate}" readonly></label><label>USD presented<input type="number" value="450" readonly></label><label>FC to issue<input id="missionExecutionValue" type="number" inputmode="decimal"></label><label>Rate branch<select data-execution-choice="one"><option value="">Select</option><option value="budget">OPORD budget rate</option><option value="transaction">Authorized transaction rate</option></select></label></div><label>Rate Reviewer note<textarea id="missionExecutionReason" placeholder="Identify the rate source and why it applies."></textarea></label>${missionExecutionButton()}`;
    }
    if (mission.decisionType === "revaluation") {
      return `<p class="eyebrow">Execution station</p><h2>Classify the $75 change</h2><div class="field-grid"><label>Old USD-equivalent accountability<input type="number" value="4800" readonly></label><label>New USD-equivalent accountability<input type="number" value="4725" readonly></label><label>Change<input id="missionExecutionValue" type="number" inputmode="decimal" step="any"></label><label>Classification<select data-execution-choice="one"><option value="">Select</option><option value="shortage">Physical cash shortage</option><option value="revaluation">Revaluation loss branch</option><option value="apr">Average Purchase Rate</option></select></label></div><label>Currency Reviewer note<textarea id="missionExecutionReason" placeholder="Explain why the physical FC quantity can stay the same while value changes."></textarea></label>${missionExecutionButton()}`;
    }
    if (mission.decisionType === "apr") {
      return `<p class="eyebrow">Execution station</p><h2>Compute the fictional Average Purchase Rate</h2><div class="field-grid three"><label>Total fictional FC acquired<input type="number" value="${mission.aprFc}" readonly></label><label>Total USD purchase cost<input type="number" value="${mission.aprUsd}" readonly></label><label>APR: FC per $1 USD<input id="missionExecutionValue" type="number" inputmode="decimal" step="any"></label></div><label>Branch<select data-execution-choice="one"><option value="">Select</option><option value="apr">Average Purchase Rate</option><option value="revaluation">Revaluation</option><option value="budget">Budget rate</option></select></label><label>Bank Liaison note<textarea id="missionExecutionReason" placeholder="Explain the calculation and supporting purchase evidence."></textarea></label>${missionExecutionButton()}`;
    }
    if (mission.decisionType === "voucher") {
      return `<p class="eyebrow">Execution station</p><h2>Disposition four fictional packets</h2><div class="choice-grid">
        <label>Packet Alpha: complete and no prior payment<select data-execution-choice="one"><option value="">Disposition</option><option value="pay">Pay</option><option value="hold">Hold</option></select></label>
        <label>Packet Bravo: missing receipt<select data-execution-choice="two"><option value="">Disposition</option><option value="pay">Pay</option><option value="hold">Hold for support</option></select></label>
        <label>Packet Charlie: duplicate invoice indicator<select data-execution-choice="three"><option value="">Disposition</option><option value="pay">Pay</option><option value="reject">Stop and route as duplicate</option></select></label>
        <label>Packet Delta: calculation error<select data-execution-choice="four"><option value="">Disposition</option><option value="pay">Pay</option><option value="hold">Return for correction</option></select></label>
      </div><label>Voucher Reviewer brief<textarea id="missionExecutionReason" placeholder="Defend each disposition and identify the highest-risk control."></textarea></label>${missionExecutionButton()}`;
    }
    return `<p class="eyebrow">Execution station</p><h2>Build the interruption checklist</h2><div class="choice-grid">
      ${["Stop financial activity and establish scene safety","Notify the chain and request continuity direction","Secure funds, records, and accountable items","Conduct and document a witnessed inventory","Transfer accountability before resuming operations"].map((label, index) => `<label class="choice-button"><input type="checkbox" data-execution-check="${index}"><span>${index + 1}</span><span>${label}</span></label>`).join("")}
    </div><label>Inventory Recorder note<textarea id="missionExecutionReason" placeholder="State the accountability position and how the transfer will be documented."></textarea></label>${missionExecutionButton()}`;
  }

  function missionExecutionButton() {
    return `<div class="action-row"><button class="primary-button" type="button" data-action="complete-mission-stage" data-stage="3">Record execution decisions</button></div><div id="missionFeedback"></div>`;
  }

  function missionStageEvaluation(mission, progress, stage) {
    if (stage === 0) {
      const score = conceptScore($("#missionBackbrief").value, ["mission", "accountability", "count", "support", "control", "reconcile", "rate", "document"]);
      return { pass: $("#missionBackbrief").value.trim().length >= 45 && score.hits.length >= 2, feedback: "Backbrief the mission, accountability objective, and at least two controls the team cannot skip." };
    }
    if (stage === 1) {
      const entries = $$("[data-role-name]");
      entries.forEach(input => { progress.roles[input.dataset.roleName] = input.value.trim(); });
      return { pass: entries.every(input => input.value.trim().length >= 2), feedback: "Assign a callsign to every role station before execution." };
    }
    if (stage === 2) {
      if (mission.issueMode === "fc") {
        const handoff = $("#missionIssueHandoff").value;
        const score = conceptScore(handoff, ["physical", "FC", "rate", "equivalent", "accept"]);
        return { pass: closeEnough(number($("#missionFcEquivalent").value), mission.opening) && score.hits.length >= 2, feedback: `Divide ${mission.fcQuantity.toLocaleString()} FC by ${mission.oldRate} FC per USD. The opening equivalent is ${money(mission.opening)}.` };
      }
      if (mission.issueMode === "apr-evidence") {
        const handoff = $("#missionIssueHandoff").value;
        const score = conceptScore(handoff, ["existing", "purchase", "FC", "USD", "cost", "evidence", "APR"]);
        return { pass: closeEnough(number($("#missionAprTotalFc").value), mission.aprFc) && closeEnough(number($("#missionAprTotalUsd").value), mission.aprUsd, 0.001) && score.hits.length >= 2, feedback: `Combine both evidence sources: ${mission.aprFc.toLocaleString()} FC and ${money(mission.aprUsd)} USD cost basis.` };
      }
      const rows = mission.drawerRows || decomposeDrawer(mission.opening);
      const total = rows.reduce((sum, [denom], index) => sum + denom * (number($(`[data-mission-qty="${index}"]`).value) || 0), 0);
      const handoff = $("#missionIssueHandoff").value;
      const score = conceptScore(handoff, ["receive", "received", "count", "match", "accept", "accountability"]);
      return { pass: closeEnough(total, mission.opening) && closeEnough(number($("#missionIssueDifference").value), 0) && score.hits.length >= 2, feedback: `The denomination count must total ${money(mission.opening)}, the difference must be zero, and the handoff must state count and acceptance.` };
    }
    if (stage === 3) return missionExecutionEvaluation(mission);
    if (stage === 4) {
      const response = $("#missionInjectResponse").value;
      const score = conceptScore(response, mission.injectTerms);
      return { pass: score.hits.length >= Math.min(3, mission.injectTerms.length) && $("#missionInjectHandoff").value.trim().length >= 5, feedback: `Address at least three of these mission controls: ${mission.injectTerms.join(", ")}. Name the handoff roles.` };
    }
    const expectedBook = mission.opening + mission.transactions.reduce((sum, [, amount]) => sum + amount, 0);
    const expectedDifference = mission.physical - expectedBook;
    const brief = $("#missionCloseoutBrief").value;
    const expectedLabel = accountabilityLabel(expectedDifference, mission);
    const requiredResultTerms = expectedLabel === "Shortage" ? ["short", "shortage", "negative"] :
      expectedLabel === "Overage" ? ["over", "overage", "positive"] :
      expectedLabel === "Revaluation position" ? ["revaluation", "rate", "value"] :
      expectedLabel === "APR cost-basis position" ? ["APR", "purchase", "cost"] :
      ["balance", "balanced", "zero"];
    const score = conceptScore(brief, ["book", "physical", "support", "evidence", "risk", ...requiredResultTerms]);
    const roleChecks = $$("[data-role-check]");
    roleChecks.forEach(check => { progress.roleChecks[check.dataset.roleCheck] = check.checked; });
    const allRolesChecked = roleChecks.length === mission.roles.length && roleChecks.every(check => check.checked);
    return { pass: closeEnough(number($("#missionClosingBook").value), expectedBook) && closeEnough(number($("#missionClosingDifference").value), expectedDifference) && score.hits.length >= 3 && allRolesChecked, feedback: `Book should be ${money(expectedBook)} and physical minus book should be ${money(expectedDifference)} (${expectedLabel}). Brief the result, evidence, and remaining risk, then pass the device so every assigned role confirms its station.` };
  }

  function missionExecutionEvaluation(mission) {
    const reason = $("#missionExecutionReason").value;
    if (mission.decisionType === "cashier") {
      const expected = mission.opening + mission.transactions.reduce((sum, [, amount]) => sum + amount, 0);
      const score = conceptScore(reason, ["opening", "payment", "return", "support", "3605"]);
      return { pass: closeEnough(number($("#missionExecutionValue").value), expected) && score.hits.length >= 2, feedback: `Expected book accountability is ${money(expected)}. Explain opening, supported decreases, and the returned funds.` };
    }
    if (mission.decisionType === "paying-agent") {
      const score = conceptScore(reason, ["payment", "support", "receipt", "unused", "return", "cashier"]);
      return { pass: $('[data-execution-choice="one"]').value === "pay" && $('[data-execution-choice="two"]').value === "pay" && $('[data-execution-choice="three"]').value === "hold" && score.hits.length >= 2, feedback: "Pay the two authorized supported purchases; pause the additional purchase for revised authority. Include support and unused-fund handoff." };
    }
    if (mission.decisionType === "exchange") {
      const score = conceptScore(reason, ["transaction", "rate", "source", "date", "authorized"]);
      return { pass: closeEnough(number($("#missionExecutionValue").value), 1080) && $('[data-execution-choice="one"]').value === "transaction" && score.hits.length >= 2, feedback: "Use 2.4 FC per USD: $450 x 2.4 = 1,080 FC. Identify the authorized transaction-rate source." };
    }
    if (mission.decisionType === "revaluation") {
      const score = conceptScore(reason, ["physical", "quantity", "rate", "value", "revaluation", "not shortage"]);
      return { pass: closeEnough(number($("#missionExecutionValue").value), -75) && $('[data-execution-choice="one"]').value === "revaluation" && score.hits.length >= 2, feedback: "The value change is -$75 under the revaluation branch; the physical FC quantity did not disappear." };
    }
    if (mission.decisionType === "apr") {
      const expectedApr = mission.aprFc / mission.aprUsd;
      const score = conceptScore(reason, ["purchase", "cost", "FC", "USD", "support", "certificate", "APR"]);
      return { pass: closeEnough(number($("#missionExecutionValue").value), expectedApr, 0.001) && $('[data-execution-choice="one"]').value === "apr" && score.hits.length >= 2, feedback: `Divide ${mission.aprFc.toLocaleString()} FC by ${money(mission.aprUsd)}. The APR is approximately ${expectedApr.toFixed(6)} FC per $1.` };
    }
    if (mission.decisionType === "voucher") {
      const score = conceptScore(reason, ["duplicate", "receipt", "support", "calculation", "hold", "pay"]);
      return { pass: $('[data-execution-choice="one"]').value === "pay" && $('[data-execution-choice="two"]').value === "hold" && $('[data-execution-choice="three"]').value === "reject" && $('[data-execution-choice="four"]').value === "hold" && score.hits.length >= 3, feedback: "Only Alpha pays. Bravo needs support, Charlie is stopped as a duplicate, and Delta returns for correction." };
    }
    const checks = $$("[data-execution-check]");
    const score = conceptScore(reason, ["inventory", "accountability", "transfer", "witness", "document"]);
    return { pass: checks.every(check => check.checked) && score.hits.length >= 2, feedback: "Complete all continuity controls and explain the witnessed inventory and documented transfer." };
  }

  function completeMissionStage(stage) {
    const mission = missions.find(item => item.id === state.selectedMission);
    const progress = missionProgress(mission.id);
    progress.stageAttempts[stage] = (progress.stageAttempts[stage] || 0) + 1;
    const result = missionStageEvaluation(mission, progress, stage);
    if (!result.pass) {
      $("#missionFeedback").innerHTML = `<div class="feedback-panel retry"><h4>Stage evidence incomplete</h4><p>${esc(result.feedback)}</p></div>`;
      saveState();
      return;
    }
    progress.evidence[`stage${stage}`] = { completedAt: new Date().toISOString() };
    if (!progress.completedStages.includes(stage)) progress.completedStages.push(stage);
    if (stage < 5) {
      progress.stage = stage + 1;
    } else {
      progress.completed = true;
      const totalAttempts = Object.values(progress.stageAttempts).reduce((sum, value) => sum + value, 0);
      state.aar.push({
        type: "mission",
        missionId: mission.id,
        title: mission.title,
        result: "Complete",
        at: new Date().toISOString(),
        note: mission.objective,
        teamCode: state.teamSession.code || "Local session",
        teamName: state.teamSession.teamName || "Unassigned team",
        attempts: totalAttempts,
        dimensions: [
          ["Mission comprehension", Boolean(progress.evidence.stage0)],
          ["Role ownership", Object.values(progress.roleChecks).filter(Boolean).length === mission.roles.length],
          ["Initial accountability", Boolean(progress.evidence.stage2)],
          ["Operational decisions", Boolean(progress.evidence.stage3)],
          ["Inject response", Boolean(progress.evidence.stage4)],
          ["Closeout explanation", Boolean(progress.evidence.stage5)]
        ]
      });
    }
    saveState();
    renderTeam();
    showToast(stage === 5 ? `${mission.title} complete.` : `Mission stage ${stage + 1} complete.`);
  }

  function renderAAR() {
    if (!state.aar.length) {
      $("#aarWorkspace").innerHTML = `<div class="aar-card"><h3>No completed evaluation records yet</h3><p>Complete the individual qualification or a team mission to generate an evidence-backed AAR.</p><button class="primary-button" type="button" data-route="${allModulesMastered() ? "qualification" : "academy"}">Continue training</button></div>`;
      return;
    }
    $("#aarWorkspace").innerHTML = `<div class="aar-grid">${state.aar.slice().reverse().map(record => {
      const dimensions = record.dimensions || (record.type === "qualification" ? [
        ["Authority decision", true],
        ["DD Form 1081 issue", true],
        ["Book reconstruction", true],
        ["Physical closeout", true],
        ["Constructed explanation", true]
      ] : []);
      const attempts = record.attempts || (record.type === "qualification" ? state.qualification.attempts : 0);
      const expectedAttempts = record.type === "qualification" ? 5 : 6;
      const coaching = attempts > expectedAttempts ? "Review the stations that required retries before the next mission." : "Performance was completed without excessive retries. Increase pressure on replay.";
      return `<article class="aar-card"><p class="eyebrow">${esc(record.type)} record</p><h3>${esc(record.title)}</h3><p>${esc(record.note)}</p><ul class="evidence-list">${record.type === "mission" ? `<li><span>Team</span><b>${esc(record.teamName || "Unassigned")}</b></li><li><span>Session code</span><b>${esc(record.teamCode || "Local")}</b></li>` : ""}<li><span>Result</span><b>${esc(record.result)}</b></li><li><span>Total submissions</span><b>${attempts || "Recorded"}</b></li><li><span>Recorded</span><b>${new Date(record.at).toLocaleString()}</b></li></ul>
        <div class="aar-dimensions">${dimensions.map(([label, passed]) => `<div><span>${esc(label)}</span><b class="${passed ? "dimension-pass" : "dimension-review"}">${passed ? "Demonstrated" : "Review"}</b></div>`).join("")}</div>
        <div class="coach-note"><strong>Next coaching move</strong>${esc(coaching)}</div>
        <label style="margin-top:14px">Facilitator observation<textarea data-aar-note="${esc(record.at)}" placeholder="What should the learner sustain or improve?">${esc(record.facilitatorNote || "")}</textarea></label>
        <div class="action-row"><button class="secondary-button" type="button" data-action="copy-aar" data-aar-id="${esc(record.at)}">Copy debrief summary</button></div></article>`;
    }).join("")}</div>`;
  }

  function renderFacilitator() {
    const completedMissions = Object.entries(state.missions).filter(([, progress]) => progress.completed).map(([id]) => missions.find(mission => mission.id === id)?.code).filter(Boolean);
    const preflight = state.lastPreflight ? `${state.lastPreflight.passed}/${state.lastPreflight.total} on ${new Date(state.lastPreflight.at).toLocaleString()}` : "Not run";
    $("#facilitatorWorkspace").innerHTML = `<div class="facilitator-grid">
      <article class="facilitator-card preflight-card"><p class="eyebrow">Device preflight</p><h3>Run before learners arrive</h3><p>Check the actual browser, local storage, learning data, mission data, signed-number inputs, and offline capability on this device.</p><button class="primary-button" type="button" data-action="run-preflight">Run device self-check</button><div id="preflightResults" aria-live="polite"></div></article>
      <article class="facilitator-card"><p class="eyebrow">Local readiness snapshot</p><h3>No hidden completion gates</h3><ul class="evidence-list"><li><span>Academy modules</span><b>${state.masteredModules.length}/${modules.length}</b></li><li><span>Readiness recall</span><b>${state.retrieval && state.retrieval.completed ? "Complete" : "Pending"}</b></li><li><span>Individual qualification</span><b>${state.qualification.completed ? "Qualified" : "Pending"}</b></li><li><span>Team roster</span><b>${teamSessionReady() ? esc(state.teamSession.code) : "Not created"}</b></li><li><span>Completed missions</span><b>${completedMissions.length ? esc(completedMissions.join(", ")) : "None"}</b></li><li><span>Last device preflight</span><b>${esc(preflight)}</b></li></ul></article>
      <article class="facilitator-card event-clock-card"><p class="eyebrow">Event control</p><h3>Three-hour run of show</h3>${renderEventClock()}</article>
      <article class="facilitator-card extension-card"><p class="eyebrow">Advanced extension deck</p><h3>For fast teams and later training days</h3><p>These evidence-backed injects expand coverage without changing the core qualification. Copy one and deliver it verbally after a team completes its base FRAGO.</p><div class="extension-grid">${extensionInjects.map(inject => `<section><span>${esc(inject.title)}</span><p>${esc(inject.prompt)}</p><small><b>Standard:</b> ${esc(inject.standard)}</small><small><b>Boundary:</b> ${esc(inject.boundary)}</small><button class="quiet-button" type="button" data-action="copy-extension" data-extension-id="${inject.id}">Copy inject</button></section>`).join("")}</div></article>
      <article class="facilitator-card"><p class="eyebrow">Anti-copy assignment</p><h3>Send teams down different paths</h3><p>Assign one mission code per team. Rotate missions on later training days rather than giving all teams the same numbers and decisions.</p><ul class="evidence-list">${missions.map((mission, index) => `<li><span>Team ${index + 1}</span><b>${mission.code} ${esc(mission.title)}</b></li>`).join("")}</ul></article>
      <article class="facilitator-card"><p class="eyebrow">Observe</p><h3>Do not rescue too early</h3><p>Watch for the learner's mental model. Ask, "What is the book? What is physical? What evidence supports the difference? Who owns the next action?"</p></article>
      <article class="facilitator-card"><p class="eyebrow">Public release</p><h3>Sanitized by design</h3><p>The pilot uses fictional names, values, vendors, rates, and documents. It excludes safe-combination details, real banking/routing information, realistic counterfeit images, emergency destruction methods, and medical procedures.</p></article>
      <article class="facilitator-card"><p class="eyebrow">Local reset</p><h3>Prepare this device for a new learner</h3><p>Reset only after exporting or discussing the current AAR record.</p><button class="danger-button" type="button" data-action="reset-all">Reset local training data</button></article>
      <article class="facilitator-card"><p class="eyebrow">Evidence boundary</p><h3>Training aid, not policy</h3><p>Validate current governing guidance before operational use. Unresolved source conflicts remain unresolved in the app rather than being converted into invented rules.</p></article>
    </div>`;
    syncEventClock();
  }

  const eventPhases = [
    { name: "Academy and coached practice", minutes: 60, route: "academy", prompt: "Learners work individually. Coach the mental model, not the answer." },
    { name: "Individual qualification", minutes: 35, route: "qualification", prompt: "No coaching prompts. Send failed learners back to the related module." },
    { name: "Team mission execution", minutes: 70, route: "team", prompt: "Assign different missions. Require role-owned evidence and handoffs." },
    { name: "AAR and remediation", minutes: 15, route: "aar", prompt: "Defend the math, controls, and handoffs. Assign the next practice." }
  ];

  function currentClockRemaining() {
    const clock = state.eventClock || defaultState.eventClock;
    if (!clock.running || !clock.updatedAt) return Math.max(0, clock.remainingSeconds || 0);
    const elapsed = Math.floor((Date.now() - new Date(clock.updatedAt).getTime()) / 1000);
    return Math.max(0, (clock.remainingSeconds || 0) - elapsed);
  }

  function renderEventClock() {
    if (!state.eventClock) state.eventClock = structuredClone(defaultState.eventClock);
    const phase = eventPhases[state.eventClock.phase] || eventPhases[0];
    const remaining = currentClockRemaining();
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `<div class="event-clock">
      <div class="event-clock-display"><span>Current phase</span><strong>${esc(phase.name)}</strong><time id="eventClockTime">${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}</time><p>${esc(phase.prompt)}</p></div>
      <div class="event-clock-controls"><button class="primary-button" type="button" data-action="event-start">${state.eventClock.running ? "Pause phase" : remaining > 0 ? "Resume phase" : "Start phase"}</button><button class="secondary-button" type="button" data-action="event-next">Next phase</button><button class="quiet-button" type="button" data-action="event-reset">Reset event</button></div>
      <ol class="event-phase-list">${eventPhases.map((item, index) => `<li class="${index === state.eventClock.phase ? "active" : ""} ${index < state.eventClock.phase ? "complete" : ""}"><span>${index + 1}</span><div><strong>${esc(item.name)}</strong><small>${item.minutes} minutes</small></div></li>`).join("")}</ol>
    </div>`;
  }

  function syncEventClock() {
    clearInterval(syncEventClock.timer);
    const clock = state.eventClock;
    if (!clock || !clock.running) return;
    syncEventClock.timer = setInterval(() => {
      const remaining = currentClockRemaining();
      const display = $("#eventClockTime");
      if (display) display.textContent = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
      if (remaining <= 0) {
        clock.remainingSeconds = 0;
        clock.running = false;
        clock.updatedAt = null;
        saveState();
        clearInterval(syncEventClock.timer);
        showToast("Training phase time expired.");
        renderFacilitator();
      }
    }, 1000);
  }

  function runPreflight() {
    const checks = [];
    const add = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });

    add("Academy data", modules.length === 8 && new Set(modules.map(module => module.id)).size === 8, `${modules.length} modules; IDs must be unique.`);
    add("Team mission data", missions.length === 7 && new Set(missions.map(mission => mission.id)).size === 7, `${missions.length} missions; IDs must be unique.`);
    add("Role ownership", missions.every(mission => mission.roles.length >= 4), "Every mission needs at least four role stations.");
    add("OPORD structure", missions.every(mission => mission.opord.length === 5), "Every mission needs all five OPORD paragraphs.");
    add("Manual balance equation", closeEnough(4000 - 735, 3265) && closeEnough(3250 - 3265, -15), "Expected book $3,265 and signed difference -$15.");
    add("Qualification equation", closeEnough(4200 - 615 - 280 + 300, 3605) && closeEnough(3595 - 3605, -10), "Expected book $3,605 and signed difference -$10.");
    add("APR calculation", closeEnough(35000 / 1043.34485, 33.5459555, 0.00001), "Expected approximately 33.545956 FC per $1.");
    add("Signed-number input", (() => {
      const input = document.createElement("input");
      input.type = "number";
      input.step = "any";
      input.value = "-15";
      return input.value === "-15";
    })(), "Browser must preserve a negative discrepancy.");
    add("Local progress storage", (() => {
      try {
        const key = `${STORAGE_KEY}Preflight`;
        localStorage.setItem(key, "ok");
        const pass = localStorage.getItem(key) === "ok";
        localStorage.removeItem(key);
        return pass;
      } catch {
        return false;
      }
    })(), "Browser must allow local storage.");
    add("Offline capability", "serviceWorker" in navigator || location.protocol === "file:", "Service worker support is required when hosted; file preview remains available.");
    add("Mobile navigation", $$(".bottom-nav [data-route]").length === 5, "Five primary mobile destinations are present.");
    add("Public-release controls", !/ssn|dssn|routing number|safe combination/i.test(JSON.stringify({ missions, extensionInjects })), "Mission and extension data must not contain restricted identifiers or procedures.");

    const passed = checks.filter(check => check.pass).length;
    const panel = $("#preflightResults");
    panel.innerHTML = `<div class="preflight-summary ${passed === checks.length ? "ready" : "review"}"><strong>${passed}/${checks.length} checks passed</strong><span>${passed === checks.length ? "This device is ready for a facilitated pilot." : "Resolve failed checks before using this device for training."}</span></div>
      <ul class="preflight-list">${checks.map(check => `<li class="${check.pass ? "pass" : "fail"}"><b>${check.pass ? "PASS" : "FAIL"}</b><div><strong>${esc(check.name)}</strong><span>${esc(check.detail)}</span></div></li>`).join("")}</ul>`;
    state.lastPreflight = { at: new Date().toISOString(), passed, total: checks.length };
    saveState();
    return checks;
  }

  function handleAction(action, target) {
    if (action === "continue-training") setRoute(nextRequiredAction().route);
    if (action === "event-start") {
      if (!state.eventClock) state.eventClock = structuredClone(defaultState.eventClock);
      if (state.eventClock.running) {
        state.eventClock.remainingSeconds = currentClockRemaining();
        state.eventClock.running = false;
        state.eventClock.updatedAt = null;
      } else {
        if (currentClockRemaining() <= 0) state.eventClock.remainingSeconds = eventPhases[state.eventClock.phase].minutes * 60;
        state.eventClock.running = true;
        state.eventClock.updatedAt = new Date().toISOString();
      }
      saveState();
      renderFacilitator();
    }
    if (action === "event-next") {
      if (!state.eventClock) state.eventClock = structuredClone(defaultState.eventClock);
      state.eventClock.phase = Math.min(eventPhases.length - 1, state.eventClock.phase + 1);
      state.eventClock.remainingSeconds = eventPhases[state.eventClock.phase].minutes * 60;
      state.eventClock.running = false;
      state.eventClock.updatedAt = null;
      saveState();
      renderFacilitator();
    }
    if (action === "event-reset") {
      state.eventClock = structuredClone(defaultState.eventClock);
      saveState();
      renderFacilitator();
    }
    if (action === "print-mission") window.print();
    if (action === "open-retrieval") {
      state.moduleIndex = modules.length;
      state.moduleTab = "learn";
      saveState();
      renderAcademy();
    }
    if (action === "review-academy") {
      state.moduleIndex = 0;
      state.moduleTab = "learn";
      saveState();
      renderAcademy();
    }
    if (action === "run-preflight") {
      const checks = runPreflight();
      showToast(checks.every(check => check.pass) ? "Device preflight passed." : "Device preflight found an issue.");
    }
    if (action === "create-team-session") {
      const teamName = $("#teamNameInput").value.trim();
      const assignedMission = $("#teamMissionInput").value;
      if (teamName.length < 2 || !assignedMission) {
        showToast("Enter a team name and assigned mission.");
        return;
      }
      state.teamSession = {
        teamName,
        assignedMission,
        code: state.teamSession.code || generateTeamCode(assignedMission)
      };
      state.selectedMission = assignedMission;
      saveState();
      renderTeam();
      showToast(`Roster slip ${state.teamSession.code} created.`);
    }
    if (action === "lesson-next") {
      state.moduleTab = target.dataset.nextTab;
      saveState();
      renderLesson();
    }
    if (action === "next-module") {
      state.moduleIndex = Math.min(modules.length - 1, state.moduleIndex + 1);
      state.moduleTab = "learn";
      saveState();
      renderAcademy();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (action === "reset-qualification") {
      state.qualification = structuredClone(defaultState.qualification);
      saveState();
      renderQualification();
    }
    if (action === "complete-mission-stage") completeMissionStage(Number(target.dataset.stage));
    if (action === "replay-mission") {
      state.missions[state.selectedMission] = { stage: 0, completedStages: [], completed: false, evidence: {}, roles: {}, roleChecks: {}, handoffs: [], stageAttempts: {} };
      saveState();
      renderTeam();
    }
    if (action === "reset-all") {
      if (window.confirm("Reset all local learner progress on this device?")) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    }
    if (action === "copy-aar") {
      const record = state.aar.find(item => item.at === target.dataset.aarId);
      if (!record) return;
      const dimensions = (record.dimensions || []).map(([label, passed]) => `${label}: ${passed ? "Demonstrated" : "Review"}`).join("\n");
      const summary = [
        "DISBURSING READINESS DEBRIEF",
        `Team: ${record.teamName || state.profile.name}`,
        `Session: ${record.teamCode || "Individual"}`,
        `Event: ${record.title}`,
        `Result: ${record.result}`,
        dimensions,
        `Facilitator observation: ${record.facilitatorNote || "Not entered"}`
      ].filter(Boolean).join("\n");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(summary).then(() => showToast("Debrief summary copied.")).catch(() => showToast("Copy was blocked by this browser."));
      } else {
        showToast("Clipboard is unavailable in this browser.");
      }
    }
    if (action === "copy-extension") {
      const inject = extensionInjects.find(item => item.id === target.dataset.extensionId);
      if (!inject) return;
      const text = [
        `ADVANCED INJECT: ${inject.title}`,
        inject.prompt,
        `Performance standard: ${inject.standard}`,
        `Training boundary: ${inject.boundary}`,
        `Evidence source: ${inject.source}`
      ].join("\n");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => showToast("Advanced inject copied.")).catch(() => showToast("Copy was blocked by this browser."));
      } else {
        showToast("Clipboard is unavailable in this browser.");
      }
    }
  }

  document.addEventListener("click", event => {
    const route = event.target.closest("[data-route]");
    if (route) {
      event.preventDefault();
      setRoute(route.dataset.route);
      return;
    }
    const moduleButton = event.target.closest("[data-module-index]");
    if (moduleButton) {
      state.moduleIndex = Number(moduleButton.dataset.moduleIndex);
      state.moduleTab = "learn";
      saveState();
      renderAcademy();
      return;
    }
    const tab = event.target.closest("[data-lesson-tab]");
    if (tab && !tab.disabled) {
      state.moduleTab = tab.dataset.lessonTab;
      saveState();
      renderLesson();
      return;
    }
    const qualStep = event.target.closest("[data-qual-step]");
    if (qualStep && !qualStep.disabled) {
      state.qualification.step = Number(qualStep.dataset.qualStep);
      saveState();
      renderQualification();
      return;
    }
    const selectMission = event.target.closest("[data-select-mission]");
    if (selectMission) {
      state.selectedMission = selectMission.dataset.selectMission;
      saveState();
      renderTeam();
      $("#missionWorkspace").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const missionStage = event.target.closest("[data-mission-stage]");
    if (missionStage && !missionStage.disabled) {
      const progress = missionProgress(state.selectedMission);
      progress.stage = Number(missionStage.dataset.missionStage);
      saveState();
      renderMissionWorkspace();
      return;
    }
    const action = event.target.closest("[data-action]");
    if (action) handleAction(action.dataset.action, action);
  });

  document.addEventListener("submit", event => {
    if (event.target.id === "modulePracticeForm") {
      event.preventDefault();
      submitModulePractice(event.target);
    }
    if (event.target.id === "qualificationForm") {
      event.preventDefault();
      submitQualification(event.target);
    }
    if (event.target.id === "retrievalForm") {
      event.preventDefault();
      submitRetrieval(event.target);
    }
  });

  document.addEventListener("change", event => {
    const learnerNote = event.target.closest("[data-learner-note]");
    if (learnerNote) {
      if (!state.learnerNotes) state.learnerNotes = {};
      state.learnerNotes[learnerNote.dataset.learnerNote] = learnerNote.value;
      saveState();
      showToast("Field note saved locally.");
      return;
    }
    const note = event.target.closest("[data-aar-note]");
    if (!note) return;
    const record = state.aar.find(item => item.at === note.dataset.aarNote);
    if (!record) return;
    record.facilitatorNote = note.value.trim();
    saveState();
    showToast("Facilitator observation saved locally.");
  });

  $("#profileButton").addEventListener("click", () => {
    $("#profileNameInput").value = state.profile.name;
    $("#profileLevelInput").value = state.profile.level;
    $("#profileDialog").showModal();
  });

  $("#profileForm").addEventListener("submit", event => {
    const submitter = event.submitter;
    if (submitter && submitter.value === "cancel") return;
    event.preventDefault();
    state.profile.name = $("#profileNameInput").value.trim() || "Airman";
    state.profile.level = $("#profileLevelInput").value;
    saveState();
    updateProfile();
    $("#profileDialog").close();
    showToast("Local profile updated.");
  });

  $("#menuButton").addEventListener("click", () => $("#rail").classList.toggle("open"));

  function updateProfile() {
    $("#profileName").textContent = state.profile.name;
    $("#profileInitials").textContent = initials(state.profile.name);
  }

  updateProfile();
  setRoute(state.route);

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("service-worker-v2.js").catch(() => {});
  }
})();
