import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

let uri = process.env.MONGODB_URI;
if (!uri) {
  try {
    const envFile = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    const match = envFile.match(/MONGODB_URI=(.*)/);
    if (match) uri = match[1].trim();
  } catch (e) {}
}

if (!uri) {
  console.error("MONGODB_URI not found in environment or .env.local");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ["lawyer", "associate", "client", "admin"], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: "" },
    designation: { type: String, default: "" },
    lawyerId: { type: String, default: "" },
  },
  { timestamps: true }
);

const HearingSchema = new mongoose.Schema(
  { date: String, purpose: String, outcome: String, by: String },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  { date: String, title: String, text: String, citation: String, pdfUrl: String, addedBy: String },
  { _id: false }
);

const QuerySchema = new mongoose.Schema(
  { id: String, by: String, text: String, ts: String, answered: { type: Boolean, default: false }, reply: String },
  { _id: false }
);

const CaseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    caseNo: { type: String, required: true, index: true },
    cnr: { type: String, default: "" },
    title: { type: String, required: true },
    court: { type: String, required: true },
    courtRoom: { type: String, default: "" },
    itemNo: { type: String, default: "" },
    judge: { type: String, default: "" },
    lawyerId: { type: String, default: "u-lawyer", index: true },
    clientId: { type: String, required: true, index: true },
    associateIds: [{ type: String }],
    status: { type: String, enum: ["Active", "Listed", "Reserved", "Adjourned", "Disposed"], default: "Active" },
    stage: { type: String, default: "Fresh Filing" },
    filingDate: { type: String, required: true },
    limitationDate: { type: String, default: "" },
    limitationTask: { type: String, default: "" },
    notes: { type: String, default: "" },
    hearings: [HearingSchema],
    orders: [OrderSchema],
    queries: [QuerySchema],
  },
  { timestamps: true }
);

const DecisionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    by: String,
    byName: String,
    ts: String,
    type: String,
    label: String,
    payload: mongoose.Schema.Types.Mixed,
    status: { type: String, enum: ["approved", "rejected"], required: true },
    decidedAt: String,
    decidedBy: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Case = mongoose.models.Case || mongoose.model("Case", CaseSchema);
const Decision = mongoose.models.Decision || mongoose.model("Decision", DecisionSchema);

async function seed() {
  console.log("Connecting to MongoDB Atlas to seed Indian chamber matters...");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

  const rawUsers = [
    { id: "u-admin", role: "admin", name: "Devika Nair", email: "admin@chambers.in", password: "admin123", phone: "+91 98110 20001", designation: "Chamber Administrator & Registrar" },
    { id: "u-lawyer", role: "lawyer", name: "Adv. Arjun Mehta", email: "lawyer@chambers.in", password: "lawyer123", phone: "+91 98110 20002", designation: "Senior Counsel & Principal Advocate (D/1482/2012)" },
    { id: "u-assoc", role: "associate", name: "Priya Sharma", email: "associate@chambers.in", password: "assoc123", phone: "+91 98110 20003", designation: "Senior Associate Counsel", lawyerId: "u-lawyer" },
    { id: "u-assoc2", role: "associate", name: "Kabir Rao", email: "kabir@chambers.in", password: "assoc123", phone: "+91 98110 20007", designation: "Junior Associate / Briefing Counsel", lawyerId: "u-lawyer" },
    { id: "u-client", role: "client", name: "Rahul Verma", email: "client@chambers.in", password: "client123", phone: "+91 98110 20004", designation: "Managing Director, Verma Infra LLP", lawyerId: "u-lawyer" },
    { id: "u-client2", role: "client", name: "Sunrise Textiles Pvt. Ltd.", email: "sunrise@chambers.in", password: "client123", phone: "+91 98110 20005", designation: "Corporate Litigant (Through Director)", lawyerId: "u-lawyer" },
    { id: "u-lawyer2", role: "lawyer", name: "Adv. Rajeshwari Sen", email: "sen@chambers.in", password: "sen123", phone: "+91 98110 20008", designation: "Senior Advocate (D/2104/2015)", lawyerId: "u-lawyer2" },
    { id: "u-assoc-sen", role: "associate", name: "Ananya Deshmukh", email: "ananya@chambers.in", password: "assoc123", phone: "+91 98110 20009", designation: "Associate Counsel (High Court Dockets)", lawyerId: "u-lawyer2" },
    { id: "u-client-sen", role: "client", name: "Sen Infra Projects Pvt. Ltd.", email: "seninfra@chambers.in", password: "client123", phone: "+91 98110 20010", designation: "Corporate Litigant (Through MD)", lawyerId: "u-lawyer2" },
  ];

  for (const u of rawUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.findOneAndUpdate(
      { id: u.id },
      { $set: { id: u.id, role: u.role, name: u.name, email: u.email, passwordHash, phone: u.phone, designation: u.designation, lawyerId: u.lawyerId || "" } },
      { upsert: true }
    );
  }
  console.log(`✓ Seeded ${rawUsers.length} chamber accounts.`);

  const rawCases = [
    {
      id: "c-001",
      caseNo: "CS(OS) 442/2024",
      cnr: "DLHC01-004421-2024",
      title: "Rahul Verma v. Kapoor Constructions Pvt. Ltd. & Ors.",
      court: "High Court of Delhi (Original Civil Jurisdiction)",
      courtRoom: "Court Room No. 14",
      itemNo: "Item No. 18 (Regular Board)",
      judge: "Hon'ble Mr. Justice S. Khanna",
      lawyerId: "u-lawyer", clientId: "u-client",
      associateIds: ["u-assoc"],
      status: "Active",
      stage: "Plaintiff Evidence (PW-1 Cross-Examination)",
      filingDate: "2024-07-11",
      limitationDate: "2026-11-28",
      limitationTask: "Replication to Written Statement under Order VIII Rule 1 CPC (Statutory limit: 30 days from WS)",
      notes: "Original Tripartite Agreement and audited ledger extracts deposited in Registry Safe Custody. Vakalatnama on record for Plaintiff.",
      hearings: [
        { date: "2026-09-18", purpose: "Framing of Contentious Issues", outcome: "Four substantive issues framed; replication taken on record; matter scheduled for plaintiff evidence.", by: "u-lawyer" },
        { date: "2026-10-22", purpose: "Plaintiff Evidence — Examination-in-Chief of PW-1", outcome: "PW-1 tendered affidavit of evidence; Exhibits A-1 to A-7 marked; deferred for cross-examination by defendant's senior counsel.", by: "u-assoc" },
        { date: "2026-12-04", purpose: "Cross-Examination of PW-1 (Plaintiff Witness)", outcome: "", by: "u-lawyer" },
      ],
      orders: [
        { date: "2026-10-22", title: "Order on Record: Examination-in-Chief", text: "Affidavit of evidence on behalf of PW-1 taken on record. Exhibits A-1 through A-7 marked without prejudice. Matter to proceed with cross-examination on 04.12.2026.", citation: "2026:DHC:8412", addedBy: "u-lawyer" },
        { date: "2026-09-18", title: "Order on Record: Framing of Issues", text: "Four contentious issues framed in terms of pleadings. Counsel for Plaintiff undertakes to serve copies of affidavit of evidence 3 weeks in advance.", citation: "2026:DHC:7109", addedBy: "u-lawyer" },
      ],
      queries: [
        { id: "q-1", by: "u-client", text: "Advocate Sir, do I need to attend the High Court in person on December 4th for cross-examination?", ts: "2026-10-23T06:30:00Z", answered: true, reply: "Yes, Rahul-ji. Since your cross-examination as PW-1 is listed before the Joint Registrar / Hon'ble Bench, your physical presence in Court Room 14 at 10:30 AM sharp is mandatory." },
      ],
    },
    {
      id: "c-002",
      caseNo: "ARB.P. 118/2025",
      cnr: "DLHC01-001180-2025",
      title: "Sunrise Textiles Pvt. Ltd. v. Meridian Global Exports LLP",
      court: "High Court of Delhi (Commercial Division)",
      courtRoom: "Court Room No. 22",
      itemNo: "Item No. 04 (Supplementary Cause List)",
      judge: "Hon'ble Mr. Justice R. Menon",
      lawyerId: "u-lawyer", clientId: "u-client2",
      associateIds: ["u-assoc", "u-assoc2"],
      status: "Listed",
      stage: "Section 11 Petition (Appointment of Sole Arbitrator)",
      filingDate: "2025-02-03",
      limitationDate: "2026-12-02",
      limitationTask: "Filing of Rejoinder to Respondent's Reply within statutory 4-week window",
      notes: "Arbitration clause invoked under Section 21 of Arbitration & Conciliation Act, 1996. Dasti service completed on all partners of respondent firm.",
      hearings: [
        { date: "2026-10-14", purpose: "First Motion & Admission", outcome: "Notice issued to respondent; reply returnable within 4 weeks; Dasti permitted via Speed Post and email.", by: "u-lawyer" },
        { date: "2026-12-12", purpose: "Hearing on Respondent's Reply & Appointment of Arbitrator", outcome: "", by: "u-assoc" },
      ],
      orders: [
        { date: "2026-10-14", title: "Order on Record: Notice Issued to Respondent", text: "Issue notice to the respondent returnable on 12.12.2026. Dasti service in addition via registered speed post. Reply to petition within four weeks; rejoinder, if any, within two weeks thereafter.", citation: "2026:DHC:8219-COMM", addedBy: "u-lawyer" },
      ],
      queries: [],
    },
    {
      id: "c-003",
      caseNo: "FAO 77/2025",
      cnr: "DLHC01-000772-2025",
      title: "Mehta Steels Pvt. Ltd. v. Union of India (Northern Railway)",
      court: "High Court of Delhi (Appellate Jurisdiction)",
      courtRoom: "Court Room No. 03 (Division Bench)",
      itemNo: "Item No. 31 (After Notice Board)",
      judge: "Hon'ble Division Bench (Justice P.B. Rao & Justice M. Joshi)",
      lawyerId: "u-lawyer", clientId: "u-client",
      associateIds: ["u-assoc2"],
      status: "Reserved",
      stage: "Judgment Reserved",
      filingDate: "2025-05-19",
      limitationDate: "2026-11-20",
      limitationTask: "Daily Listing Track for Pronouncement of Reserved Judgment",
      notes: "Comprehensive written arguments along with landmark Supreme Court precedents submitted to Bench Secretary on 09.10.2026.",
      hearings: [
        { date: "2026-10-09", purpose: "Final Arguments Concluded", outcome: "Counsel for appellant and learned Additional Solicitor General heard at length. Matter reserved for pronouncement of judgment.", by: "u-lawyer" },
        { date: "2026-11-27", purpose: "Pronouncement of Judgment (Cause List Track)", outcome: "", by: "u-assoc2" },
      ],
      orders: [
        { date: "2026-10-09", title: "Order on Record: Judgment Reserved", text: "Heard learned Senior Counsel for the Appellant and learned ASG for the Union of India. Judgment reserved. Liberty granted to file brief notes of written arguments within 3 days.", citation: "2026:DHC:7944-DB", addedBy: "u-lawyer" },
      ],
      queries: [],
    },
    {
      id: "c-004",
      caseNo: "CC 2214/2023",
      cnr: "DLCT02-002214-2023",
      title: "Rahul Verma v. State & Rajesh Goel (Section 138 NI Act)",
      court: "Tis Hazari District Courts (Central District, Delhi)",
      courtRoom: "ACMM Court Room No. 28",
      itemNo: "Item No. 12 (Daily Board)",
      judge: "Sh. S. Yadav, Ld. Additional Chief Metropolitan Magistrate",
      lawyerId: "u-lawyer", clientId: "u-client",
      associateIds: ["u-assoc"],
      status: "Active",
      stage: "Complainant Evidence under Section 145(2) NI Act",
      filingDate: "2023-11-02",
      limitationDate: "2026-12-10",
      limitationTask: "Service of Bailable Warrant on Accused No. 2 via Process Server",
      notes: "Dishonoured Cheque No. 441092 of ₹18,50,000/- on record with Bank Return Memo (Insufficient Funds). Statutory Demand Notice duly served.",
      hearings: [
        { date: "2026-10-30", purpose: "Pre-Charge Evidence & Cross-Examination of Complainant", outcome: "CW-1 examined in part; counsel for accused sought accommodation; matter adjourned to 18.12.2026 subject to ₹5,000 costs.", by: "u-assoc" },
        { date: "2026-12-18", purpose: "Continuation of Complainant Evidence (Cross-Examination)", outcome: "", by: "u-assoc" },
      ],
      orders: [
        { date: "2026-10-30", title: "Order on Record: Adjournment with Costs", text: "Part cross-examination of CW-1 conducted. On request of learned counsel for accused, matter adjourned. Accused to pay ₹5,000 costs to complainant before next date of hearing.", addedBy: "u-assoc" },
      ],
      queries: [],
    },
    {
      id: "c-005",
      caseNo: "CP (IB) 88/PB/2022",
      cnr: "NCLT01-000088-2022",
      title: "Sunrise Textiles Pvt. Ltd. v. Bharat Logistics Ltd. (Section 9 IBC)",
      court: "National Company Law Tribunal (Principal Bench, New Delhi)",
      courtRoom: "Court Room No. 02",
      itemNo: "Disposed",
      judge: "Hon'ble Member (Judicial) & Hon'ble Member (Technical)",
      lawyerId: "u-lawyer", clientId: "u-client2",
      associateIds: [],
      status: "Disposed",
      stage: "Decreed — Consent Settlement Recorded under Rule 8 IBC",
      filingDate: "2022-06-08",
      notes: "Company petition fully satisfied in terms of Mediation Settlement Agreement. All settlement tranches cleared on schedule.",
      hearings: [
        { date: "2026-08-12", purpose: "Report on Mediation Consent Settlement", outcome: "Consent terms placed on record; operational debt resolved; corporate debtor discharged.", by: "u-lawyer" },
      ],
      orders: [
        { date: "2026-08-15", title: "Final Order: Consent Decree Passed", text: "Consent terms dated 10.08.2026 duly executed by authorised signatories taken on record. Company Petition disposed of as settled.", citation: "2026:NCLT:410-PB", addedBy: "u-lawyer" },
      ],
      queries: [],
    },
    {
      id: "c-006",
      caseNo: "W.P.(C) 8920/2024",
      cnr: "DLHC01-008920-2024",
      title: "Arora & Ors. v. Delhi Development Authority (DDA) & Anr.",
      court: "High Court of Delhi (Writ Jurisdiction, Article 226)",
      courtRoom: "Court Room No. 09",
      itemNo: "Item No. 07 (Urgent Motion Board)",
      judge: "Hon'ble Mr. Justice D.K. Sharma",
      lawyerId: "u-lawyer", clientId: "u-client",
      associateIds: ["u-assoc", "u-assoc2"],
      status: "Listed",
      stage: "Interim Relief / Stay Motion",
      filingDate: "2024-09-15",
      limitationDate: "2026-11-25",
      limitationTask: "Filing of Rejoinder to DDA Counter-Affidavit under High Court Rules",
      notes: "Stay application under Section 151 CPC pressed. Ad-interim status quo order granted in favor of petitioners.",
      hearings: [
        { date: "2026-10-18", purpose: "Urgent Motion on Interim Stay", outcome: "Notice issued; status quo directed regarding demolition until next date of hearing (NDOH).", by: "u-lawyer" },
        { date: "2026-11-26", purpose: "Hearing on Confirmation of Interim Injunction", outcome: "", by: "u-lawyer" },
      ],
      orders: [
        { date: "2026-10-18", title: "Interim Injunction Order: Status Quo Directed", text: "Issue notice. Learned Standing Counsel for DDA accepts notice. In the meantime, parties to maintain status quo as of today with respect to the subject property until the next date.", citation: "2026:DHC:8190-WRIT", addedBy: "u-lawyer" },
      ],
      queries: [],
    },
    {
      id: "c-101",
      caseNo: "W.P.(C) 1402/2026",
      cnr: "DLHC01-001402-2026",
      title: "Sen Infra Projects Pvt. Ltd. v. Municipal Corporation of Delhi (MCD)",
      court: "High Court of Delhi (Writ Jurisdiction, Court Room 05)",
      courtRoom: "Court Room No. 05",
      itemNo: "Item No. 11 (Advance List)",
      judge: "Hon'ble Mr. Justice V. Kameswar Rao",
      lawyerId: "u-lawyer2",
      clientId: "u-client-sen",
      associateIds: ["u-assoc-sen"],
      status: "Active",
      stage: "Notice Returnable & Counter-Affidavit",
      filingDate: "2026-01-15",
      limitationDate: "2026-12-15",
      limitationTask: "Filing of Rejoinder to MCD Status Report within 4 weeks",
      notes: "Challenge to municipal sealing order. Ad-interim stay granted on 18.01.2026.",
      hearings: [
        { date: "2026-11-14", purpose: "Hearing on MCD Status Report & Confirmation of Stay", outcome: "", by: "u-lawyer2" },
      ],
      orders: [
        { date: "2026-01-18", title: "Ad-Interim Stay on Coercive Sealing", text: "Issue notice to MCD. Until next date of hearing, no coercive sealing action shall be taken in respect of petitioner's commercial unit.", citation: "2026:DHC:1104-WRIT", addedBy: "u-lawyer2" },
      ],
      queries: [],
    },
  ];

  for (const c of rawCases) {
    await Case.findOneAndUpdate({ id: c.id }, { $set: c }, { upsert: true });
  }
  console.log(`✓ Seeded ${rawCases.length} Indian court matters to MongoDB Atlas.`);

  await Decision.findOneAndUpdate(
    { id: "a-hist-1" },
    {
      $set: {
        id: "a-hist-1",
        by: "u-assoc",
        byName: "Priya Sharma",
        ts: "2026-10-22T05:10:00Z",
        type: "addHearing",
        label: "Hearing Recorded: 22.10.2026 — CS(OS) 442/2024 (Court Room 14, High Court of Delhi)",
        payload: { caseId: "c-001", hearing: { date: "2026-10-22", purpose: "Plaintiff Evidence — PW-1 Examined", outcome: "Affidavit tendered; marked Exhibits A-1 to A-7." } },
        status: "approved",
        decidedBy: "u-lawyer",
        decidedAt: "2026-10-22T09:40:00Z",
      },
    },
    { upsert: true }
  );

  await mongoose.disconnect();
  console.log("✓ All seed operations completed successfully on MongoDB Atlas!");
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
