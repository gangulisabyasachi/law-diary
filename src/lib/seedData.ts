export interface RawUserSeed {
  id: string;
  role: "lawyer" | "associate" | "client" | "admin";
  name: string;
  email: string;
  password: string;
  phone?: string;
  designation?: string;
  lawyerId?: string;
}

export function getSeedData() {
  const users: RawUserSeed[] = [
    {
      id: "u-admin",
      role: "admin",
      name: "Devika Nair",
      email: "admin@chambers.in",
      password: "admin123",
      phone: "+91 98110 20001",
      designation: "Chamber Administrator",
    },
    {
      id: "u-lawyer",
      role: "lawyer",
      name: "Adv. Arjun Mehta",
      email: "lawyer@chambers.in",
      password: "lawyer123",
      phone: "+91 98110 20002",
      designation: "Senior Counsel & Principal",
    },
    {
      id: "u-assoc",
      role: "associate",
      name: "Priya Sharma",
      email: "associate@chambers.in",
      password: "assoc123",
      phone: "+91 98110 20003",
      designation: "Senior Associate",
      lawyerId: "u-lawyer",
    },
    {
      id: "u-assoc2",
      role: "associate",
      name: "Kabir Rao",
      email: "kabir@chambers.in",
      password: "assoc123",
      phone: "+91 98110 20007",
      designation: "Junior Associate",
      lawyerId: "u-lawyer",
    },
    {
      id: "u-client",
      role: "client",
      name: "Rahul Verma",
      email: "client@chambers.in",
      password: "client123",
      phone: "+91 98110 20004",
      designation: "Managing Director",
      lawyerId: "u-lawyer",
    },
    {
      id: "u-client2",
      role: "client",
      name: "Sunrise Textiles Pvt. Ltd.",
      email: "sunrise@chambers.in",
      password: "client123",
      phone: "+91 98110 20005",
      designation: "Corporate Client",
      lawyerId: "u-lawyer",
    },
  ];

  const cases = [
    {
      id: "c-001",
      caseNo: "CS(OS) 442/2024",
      cnr: "DLHC01-002934-2024",
      title: "Verma v. Kapoor Constructions Ltd.",
      court: "Delhi High Court",
      courtRoom: "Court Room 14",
      itemNo: "09",
      judge: "Hon'ble Justice S. Khanna",
      clientId: "u-client",
      associateIds: ["u-assoc"],
      status: "Active",
      stage: "Evidence & Cross-Examination",
      filingDate: "2024-07-11",
      limitationDate: "2026-12-15",
      limitationTask: "Filing affidavit of admission/denial of documents",
      notes: "Primary suit for specific performance and damages. Original tri-party agreement submitted in registry safe custody.",
      hearings: [
        {
          date: "2026-09-18",
          purpose: "Framing of issues",
          outcome: "Issues framed; matter listed for plaintiff evidence",
          by: "u-lawyer",
        },
        {
          date: "2026-10-22",
          purpose: "Plaintiff evidence — PW1 examined",
          outcome: "PW1 partly examined; examination-in-chief completed",
          by: "u-assoc",
        },
        {
          date: "2026-12-04",
          purpose: "Cross-examination of PW1",
          outcome: "",
          by: "u-lawyer",
        },
      ],
      orders: [
        {
          date: "2026-10-22",
          title: "Order on examination-in-chief",
          text: "Examination-in-chief affidavit of PW1 taken on record. Exhibits A-1 to A-7 marked. Matter to proceed with cross-examination on 04.12.2026.",
          addedBy: "u-lawyer",
          citation: "2024 SCC OnLine Del 3412",
        },
        {
          date: "2026-09-18",
          title: "Order framing issues",
          text: "Four contentious issues framed. Replication on behalf of plaintiff taken on record. List for plaintiff evidence.",
          addedBy: "u-lawyer",
          citation: "2024 DHC 7819",
        },
      ],
      queries: [
        {
          id: "q-1",
          by: "u-client",
          text: "Advocate Sir, do I need to attend the court in person on December 4th for cross-examination?",
          ts: "2026-10-23T06:30:00Z",
          answered: false,
        },
      ],
    },
    {
      id: "c-002",
      caseNo: "ARB.P. 118/2025",
      cnr: "DLHC01-001180-2025",
      title: "Sunrise Textiles v. Meridian Exports",
      court: "Delhi High Court",
      courtRoom: "Court Room 28",
      itemNo: "24",
      judge: "Hon'ble Justice R. Menon",
      clientId: "u-client2",
      associateIds: ["u-assoc", "u-assoc2"],
      status: "Listed",
      stage: "Section 11 Petition — Notice Stage",
      filingDate: "2025-02-03",
      limitationDate: "2026-12-28",
      limitationTask: "Statutory notice compliance & section 11 invocation",
      notes: "Arbitration clause invoked under clause 18.2 of commercial agreement. Counter-claim readiness to be audited.",
      hearings: [
        {
          date: "2026-10-14",
          purpose: "First motion hearing",
          outcome: "Notice issued to respondent; reply returnable within 4 weeks",
          by: "u-lawyer",
        },
        {
          date: "2026-12-12",
          purpose: "Reply by respondent / rejoinder",
          outcome: "",
          by: "u-assoc",
        },
      ],
      orders: [
        {
          date: "2026-10-14",
          title: "Notice issued to Respondent",
          text: "Issue notice to the respondent returnable on 12.12.2026. Dasti service in addition via registered speed post. Reply within four weeks.",
          addedBy: "u-lawyer",
          citation: "2025 SCC OnLine Del 112",
        },
      ],
      queries: [],
    },
    {
      id: "c-003",
      caseNo: "FAO 77/2025",
      cnr: "APTT02-000077-2025",
      title: "Mehta Steels Pvt. Ltd. v. Union of India",
      court: "Appellate Tribunal, New Delhi",
      courtRoom: "Bench II, Tribunal Hall",
      itemNo: "04",
      judge: "Member (Judicial) — Bench II",
      clientId: "u-client",
      associateIds: ["u-assoc2"],
      status: "Reserved",
      stage: "Judgment Reserved",
      filingDate: "2025-05-19",
      limitationDate: "2026-12-10",
      limitationTask: "Limitation window for civil appeal filing",
      notes: "Comprehensive written submissions filed on 09.10.2026. Keep listing track active daily.",
      hearings: [
        {
          date: "2026-10-09",
          purpose: "Final arguments concluded",
          outcome: "Matter reserved for judgment; written arguments placed on record",
          by: "u-lawyer",
        },
        {
          date: "2026-11-27",
          purpose: "Pronouncement of judgment (expected)",
          outcome: "",
          by: "u-assoc2",
        },
      ],
      orders: [
        {
          date: "2026-10-09",
          title: "Judgment Reserved",
          text: "Learned counsel for both parties heard at length. Matter reserved for pronouncement. Notes of arguments taken on record.",
          addedBy: "u-lawyer",
          citation: "2025 ATND 94",
        },
      ],
      queries: [],
    },
    {
      id: "c-004",
      caseNo: "CC 2214/2023",
      cnr: "DLCT02-002214-2023",
      title: "Verma v. State & Ors. (NI Act)",
      court: "Magistrate Court, Tis Hazari",
      courtRoom: "Court Room 102",
      itemNo: "17",
      judge: "ACMM S. Yadav",
      clientId: "u-client",
      associateIds: ["u-assoc"],
      status: "Active",
      stage: "Complainant Evidence",
      filingDate: "2023-11-02",
      notes: "Dishonoured cheque of ₹18,50,000. Statutory legal demand notice duly served.",
      hearings: [
        {
          date: "2026-10-30",
          purpose: "Pre-charge evidence of complainant",
          outcome: "Complainant examined in part; defence sought adjournment",
          by: "u-assoc",
        },
        {
          date: "2026-12-18",
          purpose: "Continuation of complainant's evidence",
          outcome: "",
          by: "u-assoc",
        },
      ],
      orders: [],
      queries: [],
    },
    {
      id: "c-005",
      caseNo: "CP 88/2022",
      cnr: "NCLT01-000088-2022",
      title: "Sunrise Textiles v. Bharat Logistics Ltd.",
      court: "NCLT, New Delhi Bench",
      courtRoom: "Court Room 03",
      itemNo: "02",
      judge: "Hon'ble Member (Judicial)",
      clientId: "u-client2",
      associateIds: [],
      status: "Disposed",
      stage: "Decreed — Consent Settlement",
      filingDate: "2022-06-08",
      notes: "Fully settled in court-annexed mediation. Recovery tranches completed on schedule.",
      hearings: [
        {
          date: "2026-08-12",
          purpose: "Mediation settlement report",
          outcome: "Settled; consent decree recorded",
          by: "u-lawyer",
        },
      ],
      orders: [
        {
          date: "2026-08-15",
          title: "Consent decree passed",
          text: "Consent terms filed in mediation, signed by all directors, taken on record. Company petition disposed of in terms of settlement.",
          addedBy: "u-lawyer",
          citation: "2022 NCLT Del 448",
        },
      ],
      queries: [],
    },
  ];

  const decided = [
    {
      id: "a-hist-1",
      by: "u-assoc",
      byName: "Priya Sharma",
      ts: "2026-10-22T05:10:00Z",
      type: "addHearing",
      label: "Add hearing date on 22.10.2026 — CS(OS) 442/2024",
      payload: {
        caseId: "c-001",
        hearing: {
          date: "2026-10-22",
          purpose: "Plaintiff evidence — PW1 examined",
          outcome: "PW1 partly examined",
        },
      },
      status: "approved" as const,
      decidedBy: "u-lawyer",
      decidedAt: "2026-10-22T09:40:00Z",
    },
  ];

  return { users, cases, decided };
}

