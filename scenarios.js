(function () {
  const data = window.DRS_DATA;
  if (!data || !Array.isArray(data.scenarios)) return;

  const commonInject = (title, narrative) => ({
    title,
    narrative,
    checklist: [
      "Protect life and follow trained emergency direction.",
      "Report status and location through the directed channel.",
      "Assign named custody of funds and records.",
      "Record the interruption and accountability impact.",
      "Resume transactions only after the team is cleared."
    ]
  });

  const decision = (type, title, time, narrative, question, correct, distractorA, distractorB) => ({
    type,
    title,
    time,
    narrative,
    question,
    choices: [
      { label: distractorA, detail: "This creates an accountability or control failure.", correct: false, stress: 12, feedback: "Finding. Recheck the governing mission condition and accountability effect." },
      { label: correct, detail: "This protects accountability and creates a defensible record.", correct: true, feedback: "Correct. The decision and its accountability effect are supportable." },
      { label: distractorB, detail: "This relies on assumption instead of evidence.", correct: false, stress: 15, feedback: "Finding. The decision must be supported and explained." }
    ]
  });

  const payment = (title, time, narrative, zd, rate, supportTask) => ({
    type: "Payment",
    title,
    time,
    narrative,
    question: "Type the payment amount, directed rate, USD equivalent, support status, and closeout explanation.",
    expectedPayment: {
      task: supportTask,
      zd,
      rate,
      usd: Number((zd / rate).toFixed(2)),
      support: "complete"
    }
  });

  const scenarios = [
    {
      id: "cashier-standup",
      title: "Cashier Stand-Up",
      level: "Beginner",
      meta: "Individual qualification / DD 577 + DD 1081 / 35-45 minutes",
      summary: "Stand up a cashier operation, verify appointment evidence, accept an advance, count a denomination drawer, reconcile issuer and recipient totals, and explain accountability.",
      threat: "Administrative",
      time: "D-1 / 0800L",
      comms: "Available",
      accountabilityUsd: 3000,
      startingUsd: 3000,
      startingZd: 0,
      directedRate: 1,
      usdDenominations: [100, 50, 20, 10, 5, 1],
      zdDenominations: ["Not used"],
      zdDenominationsNumeric: [],
      opordTitle: "TRAINING ORDER 26-02: Cashier Stand-Up",
      opord: [
        "1. Situation. A replacement cashier must assume accountability before customer service opens.",
        "2. Mission. NLT 0930L, verify appointment evidence, count the advance, reconcile DD Form 1081-style accountability, and brief the supervisor.",
        "3. Execution. Do not accept accountability until the appointment, drawer count, issuer total, and recipient total agree. Document discrepancies before signing.",
        "4. Sustainment. Training accountability is $3,000 in fictional USD denominations. No real identifiers or signatures are used.",
        "5. Command and Signal. Report appointment verified, count complete, discrepancy status, and accountability accepted."
      ],
      inject: commonInject("Count Interruption", "A customer-service interruption occurs during the count. The learner must preserve the count state, restrict access, and restart or verify the count using the local training method."),
      events: [
        decision("Appointment", "Appointment Review", "0810L", "The appointment packet contains a sanitized DD Form 577-style record, but the authority branch is intentionally labeled for local verification.", "What should the cashier do?", "Verify the appointment is valid for the role and flag unresolved authority for supervisor confirmation.", "Assume any signed form is sufficient.", "Ignore the appointment and accept funds first."),
        decision("Advance", "DD 1081 Acceptance", "0825L", "The issuer presents a $3,000 advance. The recipient count is short by $20 on the first pass.", "What is the correct action?", "Do not accept accountability; recount and reconcile issuer and recipient totals.", "Sign now and fix the shortage later.", "Change the form total to match the first count."),
        decision("Control", "Cashier Duty Separation", "0840L", "The cashier is asked to prepare a voucher that the same cashier will later pay.", "What should happen?", "Decline the incompatible duty and elevate the separation-of-duties issue.", "Prepare and pay it because the amount is small.", "Ask the customer to prepare the voucher."),
        decision("Handoff", "Accountability Brief", "0900L", "The supervisor asks what the cashier accepted.", "What is the strongest handoff?", "State appointment status, form purpose, amount counted, reconciliation result, and unresolved issues.", "Say only that the drawer looks correct.", "Hand over the form without an explanation.")
      ]
    },
    {
      id: "exchange-point",
      title: "Exchange Point",
      level: "Intermediate",
      meta: "Exchange + reverse exchange / eligibility and documentation / 45-55 minutes",
      summary: "Operate a fictional exchange point, evaluate eligibility, apply the directed rate, distinguish exchange from reverse exchange, and reconcile the drawer.",
      threat: "Low",
      time: "D+2 / 1000L",
      comms: "Available",
      accountabilityUsd: 5000,
      startingUsd: 0,
      startingZd: 305000,
      directedRate: 61,
      zdDenominations: ["50,000", "10,000", "5,000", "1,000", "500", "100"],
      zdDenominationsNumeric: [50000, 10000, 5000, 1000, 500, 100],
      opordTitle: "OPORD 26-03: Exchange Point",
      opord: [
        "1. Situation. Authorized personnel require limited accommodation exchange under a written fictional training policy.",
        "2. Mission. Conduct eligible exchange and reverse-exchange transactions while preserving drawer accountability.",
        "3. Execution. Apply 61 ZD/USD. Verify eligibility and required documentation before each transaction. Do not infer unresolved approval authority.",
        "4. Sustainment. Starting accountability is $5,000 represented by 305,000 ZD.",
        "5. Command and Signal. Report declined transactions, rate disputes, and final drawer reconciliation."
      ],
      inject: commonInject("Policy Challenge", "A customer challenges the written eligibility rule. The team must pause, consult the fictional policy, and document the decision."),
      events: [
        decision("Policy", "Eligibility Review", "1010L", "A customer requests exchange but cannot establish eligibility under the fictional written policy.", "What should the cashier do?", "Decline the transaction and explain the documentation requirement.", "Complete it as a courtesy.", "Use a teammate's eligibility."),
        payment("Authorized Exchange", "1030L", "An eligible customer exchanges for 61,000 ZD. Required fictional support is complete.", 61000, 61, "Issue 61,000 ZD at 61 ZD/USD and document complete support."),
        decision("Reverse Exchange", "Reverse-Exchange Request", "1100L", "A customer requests reverse exchange and meets the fictional scenario limitations.", "What is required?", "Apply the reverse-exchange branch and document eligibility separately from ordinary exchange.", "Treat it exactly like ordinary exchange with no explanation.", "Use the most favorable rate instead of the directed rate."),
        decision("Closeout", "Rate Dispute", "1120L", "A team member proposes changing the rate at closeout to remove a variance.", "What should happen?", "Retain the directed transaction rate and investigate the actual variance.", "Change the rate so the drawer balances.", "Average all rates used during the week.")
      ]
    },
    {
      id: "revaluation-loss",
      title: "Revaluation Loss",
      level: "Intermediate",
      meta: "Foreign currency / prevailing-rate branch / DD 2665 support / 45-60 minutes",
      summary: "Recognize a prevailing-rate change, calculate a fictional revaluation loss, keep it separate from APR, and explain the DD Form 2665 accountability effect.",
      threat: "Administrative",
      time: "D+4 / 0730L",
      comms: "Available",
      accountabilityUsd: 4000,
      startingUsd: 0,
      startingZd: 240000,
      directedRate: 60,
      zdDenominations: ["50,000", "10,000", "5,000", "1,000", "500", "100"],
      zdDenominationsNumeric: [50000, 10000, 5000, 1000, 500, 100],
      opordTitle: "FRAGO 26-04: Prevailing Rate Change",
      opord: [
        "1. Situation. A fictional prevailing rate changes while the agent holds foreign currency.",
        "2. Mission. Calculate and explain the resulting revaluation branch without using APR.",
        "3. Execution. Compare accountability before and after the directed prevailing-rate change. Record the training loss and supporting-document decision.",
        "4. Sustainment. Starting accountability is $4,000 represented by 240,000 ZD at 60 ZD/USD.",
        "5. Command and Signal. Report calculation method, supporting records, and DD Form 2665 accountability effect."
      ],
      inject: commonInject("Rate Message Interruption", "Communications briefly fail after the rate-change message. The team must preserve the last verified direction and avoid inventing a new rate."),
      events: [
        decision("Branch", "Select the Correct Process", "0740L", "Treasury has established a fictional prevailing rate. A teammate proposes using Average Purchase Rate.", "Which branch applies?", "Use the revaluation-loss branch and explain why APR does not apply.", "Use APR because currency was purchased locally last month.", "Blend both calculations."),
        decision("Calculation", "Revaluation Calculation", "0810L", "The scenario worksheet produces a $75 fictional loss after applying the verified rate change.", "How should the learner treat the result?", "Document the $75 training loss and its accountability effect using the directed support.", "Hide the loss by changing the drawer count.", "Record it as a customer payment."),
        decision("Form", "DD 2665 Support", "0830L", "The agent must explain how the rate change affects daily accountability.", "What is required?", "Show the rate branch, calculation, supporting record, and resulting accountability position.", "Enter only the final number.", "Use a receipt from an unrelated exchange."),
        decision("Handoff", "Agent-to-DDO Brief", "0900L", "The DDO asks why APR was rejected.", "What is the best explanation?", "The verified prevailing-rate condition triggered revaluation; APR is a separate branch.", "APR was harder to calculate.", "Either process is acceptable if totals match.")
      ]
    },
    {
      id: "average-purchase-rate",
      title: "Average Purchase Rate",
      level: "Intermediate",
      meta: "Foreign currency / locally purchased currency / certificate support / 45-60 minutes",
      summary: "Compute and defend an Average Purchase Rate when the fictional scenario has no Treasury prevailing rate, then reconcile foreign-currency accountability.",
      threat: "Administrative",
      time: "D+5 / 0830L",
      comms: "Available",
      accountabilityUsd: 3000,
      startingUsd: 0,
      startingZd: 100638,
      directedRate: 33.546,
      zdDenominations: ["20,000", "10,000", "5,000", "1,000", "500", "100", "20", "10", "5", "1"],
      zdDenominationsNumeric: [20000, 10000, 5000, 1000, 500, 100, 20, 10, 5, 1],
      opordTitle: "TRAINING ORDER 26-05: Average Purchase Rate",
      opord: [
        "1. Situation. Foreign currency is purchased locally and no fictional Treasury prevailing rate is available.",
        "2. Mission. Compute the Average Purchase Rate, document the source transaction, and reconcile accountability.",
        "3. Execution. Use the provided fictional purchase records. Do not use the revaluation-loss branch.",
        "4. Sustainment. Training accountability is $3,000 represented by 100,638 FC. Target APR is approximately 33.546 FC/USD.",
        "5. Command and Signal. Brief calculation inputs, certificate support, rounding, and accountability result."
      ],
      inject: commonInject("Missing Certificate Detail", "The fictional Certificate of Change is missing a required transaction detail. The team must stop and correct support before relying on the calculated rate."),
      events: [
        decision("Branch", "APR Trigger", "0840L", "No fictional Treasury prevailing rate exists and currency was purchased locally.", "Which process applies?", "Use the Average Purchase Rate branch and document the local purchase basis.", "Use revaluation loss.", "Choose whichever rate produces no variance."),
        decision("Calculation", "APR Calculation", "0900L", "The provided training records support approximately 33.5459555 FC per USD.", "How should the result be handled?", "Retain the supported calculation and apply the scenario's stated rounding rule consistently.", "Round differently for each transaction.", "Replace it with the budget rate."),
        payment("APR-Supported Transaction", "0930L", "A supported fictional payment is 33,546 FC using the rounded training APR of 33.546 FC/USD.", 33546, 33.546, "Pay 33,546 FC using the supported rounded APR and retain complete fictional support."),
        decision("Closeout", "APR Accountability Brief", "1000L", "The reviewer asks why revaluation was not used.", "What is the best answer?", "No prevailing-rate condition was provided; locally purchased currency required the APR branch.", "Revaluation is only for larger amounts.", "The two branches are interchangeable.")
      ]
    },
    {
      id: "duplicate-payment",
      title: "Duplicate Payment Trap",
      level: "Advanced",
      meta: "Voucher packet review / duplicate detection / internal controls / 50-60 minutes",
      summary: "Review a sanitized vendor-payment packet, detect a duplicate, verify authority and support, refuse improper payment, and explain the control failure.",
      threat: "Administrative",
      time: "D+7 / 1300L",
      comms: "Available",
      accountabilityUsd: 6000,
      startingUsd: 6000,
      startingZd: 0,
      directedRate: 1,
      zdDenominations: ["Not used"],
      zdDenominationsNumeric: [],
      opordTitle: "MISSION ORDER 26-06: Voucher Integrity",
      opord: [
        "1. Situation. Four sanitized vendor packets arrive during a high-volume closeout period.",
        "2. Mission. Conduct pre-payment review, identify the duplicate packet, and protect accountability.",
        "3. Execution. Verify legal authority, approval, support, payee, calculations, fictional accounting data, fund availability, and duplicate-payment indicators.",
        "4. Sustainment. Training drawer is $6,000 fictional USD. All vendors and identifiers are fictional.",
        "5. Command and Signal. Report rejected packets and the control basis without exposing sensitive source workflows."
      ],
      inject: commonInject("Urgent Payment Pressure", "A senior requester says the packet must be paid immediately. The team must maintain review standards and document escalation."),
      events: [
        decision("Review", "Packet One", "1310L", "Packet One contains complete sanitized support, approval, payee, calculation, and purpose.", "What should the reviewer do?", "Mark the packet supportable and record the review result.", "Reject every packet to avoid risk.", "Pay without recording review."),
        decision("Duplicate", "Packet Two", "1330L", "Packet Two repeats the same fictional invoice, amount, and receiving evidence as a previously paid packet.", "What is the correct decision?", "Reject or suspend the duplicate and document the duplicate-payment control.", "Pay because the approval signature is present.", "Change the invoice number and pay."),
        decision("Support", "Packet Three", "1350L", "Packet Three has a correct amount but missing evidence that the service was accepted.", "What should happen?", "Hold the packet pending adequate support and explain the missing control.", "Pay because the calculation is correct.", "Create fictional acceptance evidence."),
        decision("AAR", "Control Explanation", "1410L", "The facilitator asks what prevented the duplicate.", "What is the strongest response?", "Comparison of payee, invoice, amount, support, and payment history identified the duplicate.", "The packet looked suspicious.", "The requester admitted the mistake.")
      ]
    },
    {
      id: "continuity",
      title: "Accountability Under Pressure",
      level: "Advanced",
      meta: "Continuity / accountable official unavailable / inventory + custody / 50-60 minutes",
      summary: "Maintain accountability when an accountable official becomes unavailable, secure assets, establish custody, inventory funds and records, and continue only under valid direction.",
      threat: "Elevated",
      time: "D+9 / 0600L",
      comms: "Degraded",
      accountabilityUsd: 4500,
      startingUsd: 1500,
      startingZd: 180000,
      directedRate: 60,
      zdDenominations: ["50,000", "10,000", "5,000", "1,000", "500", "100"],
      zdDenominationsNumeric: [50000, 10000, 5000, 1000, 500, 100],
      opordTitle: "FRAGO 26-07: Accountability Continuity",
      opord: [
        "1. Situation. The accountable official becomes unexpectedly unavailable during deployed operations.",
        "2. Mission. Secure fictional assets and records, establish named custody, conduct an inventory, and preserve continuity.",
        "3. Execution. Do not reproduce sensitive seizure, safe, or destruction procedures. Focus on authorization, custody, inventory, reconciliation, and reporting.",
        "4. Sustainment. Accountability is $4,500: $1,500 USD plus 180,000 ZD at 60 ZD/USD.",
        "5. Command and Signal. Report custody changes, inventory status, discrepancies, and authorization to resume."
      ],
      inject: commonInject("Accountable Official Unavailable", "The accountable official is removed from the training lane. The team must secure assets, establish custody, and initiate a sanitized inventory process."),
      events: [
        decision("Continuity", "Secure Accountability", "0610L", "The accountable official is unavailable and no normal handoff occurred.", "What is the first accountability action?", "Stop nonessential transactions, secure assets and records, and obtain authorized continuity direction.", "Let the nearest member continue paying.", "Leave the drawer untouched until the official returns."),
        decision("Custody", "Named Custodian", "0630L", "A commander directs temporary custody while an inventory is organized.", "What must the team capture?", "Named custody, authorization, time, assets received, and limits on further action.", "Only the custodian's name.", "No record is needed during emergencies."),
        decision("Inventory", "Inventory Board", "0700L", "The team inventories public funds, vouchers, safekeeping items, and accountability records.", "What is the objective?", "Reconcile all assets and records to the accountability position and document discrepancies.", "Count only physical cash.", "Estimate records that are difficult to find."),
        decision("Resume", "Continuity Decision", "0730L", "The inventory is complete but a discrepancy remains unresolved.", "What should happen?", "Report the discrepancy and resume only within authorized limits and documented custody.", "Erase the discrepancy to restore operations.", "Resume full operations without reporting.")
      ]
    }
  ];

  scenarios.forEach((item) => {
    if (!data.scenarios.some((existing) => existing.id === item.id)) data.scenarios.push(item);
  });
})();
