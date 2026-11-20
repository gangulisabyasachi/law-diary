"use client";

import React, { useState, useRef, useId, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Scale,
  Gavel,
  Calendar,
  Clock,
  Plus,
  Trash2,
  UploadCloud,
  Check,
  ChevronDown,
  ArrowLeft,
  Building,
  User,
  Users,
  Briefcase,
  DollarSign,
  Paperclip,
  FileText,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  X,
  CreditCard,
  FileCheck,
  File,
  Image as ImageIcon,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { CustomField, CaseAttachment, TimesheetEntry, FeeReceipt } from "@/types";

// ==========================================
// 1. Sleek Searchable / Creatable Combobox
// ==========================================
interface ComboboxProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  required?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
}

function SearchableCombobox({
  label,
  placeholder,
  value,
  onChange,
  options,
  required = false,
  icon,
  subtitle,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const isExactMatch = options.some(
    (opt) => opt.toLowerCase() === searchTerm.toLowerCase().trim()
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setSearchTerm(val);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
        <span className="flex items-center justify-between">
          <span>{label} {required && <span className="text-[#d9541e]">*</span>}</span>
          {subtitle && (
            <span className="text-[10px] font-sans font-normal text-[#111111]/50 dark:text-[#f3eee3]/50 italic">
              {subtitle}
            </span>
          )}
        </span>
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]/45 dark:text-[#f3eee3]/40 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type="text"
          value={searchTerm}
          required={required}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-9" : "pl-3.5"
            } pr-9 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 focus:outline-none focus:border-[#d9541e] dark:focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] transition-all shadow-2xs font-sans`}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#111111]/40 dark:text-[#f3eee3]/40 hover:text-[#111111] dark:hover:text-white transition-colors"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-40 left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1a1816] shadow-xl py-1 text-xs">
          {searchTerm.trim() && !isExactMatch && (
            <button
              type="button"
              onClick={() => handleSelect(searchTerm.trim())}
              className="w-full text-left px-3.5 py-2 font-medium text-[#d9541e] hover:bg-[#d9541e]/10 flex items-center gap-2 border-b border-[#111111]/10 dark:border-[#f3eee3]/10"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Create new entry: &ldquo;<strong>{searchTerm.trim()}</strong>&rdquo;</span>
            </button>
          )}

          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-3.5 py-2 hover:bg-[#f3eee3]/60 dark:hover:bg-[#282522] flex items-center justify-between transition-colors ${value === opt ? "bg-[#f3eee3]/80 dark:bg-[#282522] font-semibold text-[#111111] dark:text-[#f3eee3]" : "text-[#111111]/80 dark:text-[#f3eee3]/80"
                  }`}
              >
                <span>{opt}</span>
                {value === opt && <Check className="w-3.5 h-3.5 text-[#d9541e]" />}
              </button>
            ))
          ) : !searchTerm.trim() ? (
            <div className="px-3.5 py-3 text-center text-[11px] text-[#111111]/50 dark:text-[#f3eee3]/50 italic">
              Type to search or add a new entry
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// Preset Legal Options for Search & Creation
// ==========================================
// 1b. Multi-Select Case Type Combobox (Multiple Practice Areas)
// ==========================================
interface MultiSelectCaseTypeProps {
  label: string;
  selected: string[];
  onChange: (selected: string[]) => void;
  options: string[];
  placeholder?: string;
  icon?: React.ReactNode;
}

function MultiSelectCaseTypeCombobox({
  label,
  selected,
  onChange,
  options,
  placeholder = "Select or search case types...",
  icon,
}: MultiSelectCaseTypeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
    setSearchTerm("");
  };

  const handleRemove = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== item));
  };

  const handleAddCustom = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    if (!selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = searchTerm.trim();
      if (!trimmed) return;
      const exactMatch = options.find(
        (opt) => opt.toLowerCase() === trimmed.toLowerCase()
      );
      if (exactMatch) {
        if (!selected.includes(exactMatch)) {
          onChange([...selected, exactMatch]);
        }
      } else {
        if (!selected.includes(trimmed)) {
          onChange([...selected, trimmed]);
        }
      }
      setSearchTerm("");
    } else if (e.key === "Backspace" && !searchTerm && selected.length > 0) {
      onChange(selected.slice(0, selected.length - 1));
    }
  };

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const isCustomNew =
    searchTerm.trim() &&
    !options.some(
      (opt) => opt.toLowerCase() === searchTerm.trim().toLowerCase()
    );

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80">
          {label} <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(Select multiple if needed)</span>
        </label>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] font-cinzel text-red-500 hover:underline cursor-pointer font-bold"
          >
            Clear all ({selected.length})
          </button>
        )}
      </div>

      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`w-full min-h-[42px] px-3 py-1.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] focus-within:border-[#d9541e] focus-within:ring-1 focus-within:ring-[#d9541e] shadow-2xs flex flex-wrap items-center gap-1.5 cursor-text transition-all ${
          isOpen ? "border-[#d9541e] ring-1 ring-[#d9541e]" : ""
        }`}
      >
        {icon && (
          <span className="text-[#111111]/40 dark:text-[#f3eee3]/40 mr-1 flex-shrink-0">
            {icon}
          </span>
        )}

        {/* Selected chips */}
        {selected.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#d9541e]/10 text-[#d9541e] dark:bg-[#d9541e]/20 dark:text-[#ea6026] text-[11px] font-cinzel font-bold border border-[#d9541e]/30 shadow-2xs"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={(e) => handleRemove(item, e)}
              className="hover:text-red-600 rounded p-0.5 transition-colors cursor-pointer"
              title={`Remove ${item}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Typing input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? placeholder : "Add another case type..."}
          className="flex-1 min-w-[140px] bg-transparent text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 focus:outline-none py-1 font-serif"
        />

        <div className="ml-auto flex items-center gap-1 text-[#111111]/40 dark:text-[#f3eee3]/40">
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-40 left-0 right-0 mt-1.5 max-h-64 overflow-y-auto rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1a1816] shadow-2xl py-1.5 text-xs">
          <div className="px-3.5 py-1.5 border-b border-[#111111]/10 dark:border-[#f3eee3]/10 text-[10.5px] font-cinzel font-semibold uppercase tracking-wider text-[#111111]/50 dark:text-[#f3eee3]/50 flex items-center justify-between">
            <span>Select Practice Areas ({selected.length} chosen)</span>
            <span>{filtered.length} available</span>
          </div>

          {isCustomNew && (
            <div
              onClick={handleAddCustom}
              className="px-3.5 py-2.5 text-[#d9541e] font-serif hover:bg-[#d9541e]/10 cursor-pointer flex items-center gap-2 border-b border-[#111111]/10 dark:border-[#f3eee3]/10 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add custom: &ldquo;{searchTerm.trim()}&rdquo;</span>
            </div>
          )}

          {filtered.length > 0 ? (
            filtered.map((opt) => {
              const isSelected = selected.includes(opt);
              return (
                <div
                  key={opt}
                  onClick={() => handleToggle(opt)}
                  className={`px-3.5 py-2 hover:bg-[#f3eee3]/60 dark:hover:bg-[#282522] cursor-pointer transition-colors flex items-center justify-between border-b border-[#111111]/5 dark:border-[#f3eee3]/5 last:border-0 ${
                    isSelected ? "bg-[#d9541e]/10 dark:bg-[#d9541e]/15 text-[#d9541e] font-bold" : "text-[#111111] dark:text-[#f3eee3]"
                  }`}
                >
                  <span className="font-serif text-xs">{opt}</span>
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 text-[#d9541e] flex-shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded border border-[#111111]/20 dark:border-[#f3eee3]/20 flex-shrink-0" />
                  )}
                </div>
              );
            })
          ) : (
            !isCustomNew && (
              <div className="p-3 text-center text-xs font-serif text-[#111111]/50 dark:text-[#f3eee3]/50 italic">
                No matching case types. Press enter to add &ldquo;{searchTerm}&rdquo;
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 1c. Searchable Litigant Client Combobox (by Name, Phone, or Email)
// ==========================================
interface ClientComboboxProps {
  label: string;
  clientId: string;
  onChange: (id: string) => void;
  onSelectClient?: (client: { id: string; name: string; phone?: string; email?: string; designation?: string }) => void;
  clients: Array<{
    id: string;
    name: string;
    phone?: string;
    email?: string;
    designation?: string;
  }>;
  onAddNewContact: () => void;
}

function SearchableClientCombobox({
  label,
  clientId,
  onChange,
  onSelectClient,
  clients,
  onAddNewContact,
}: ClientComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelectedClient, setInternalSelectedClient] = useState<{
    id: string;
    name: string;
    phone?: string;
    email?: string;
    designation?: string;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [remoteLitigant, setRemoteLitigant] = useState<{ id: string; name: string; phone?: string; email?: string } | null>(null);

  const selectedClient =
    clients.find((c) => c.id === clientId) ||
    (remoteLitigant && remoteLitigant.id === clientId ? remoteLitigant : null) ||
    (internalSelectedClient && internalSelectedClient.id === clientId ? internalSelectedClient : null);

  useEffect(() => {
    if (selectedClient) {
      setSearchTerm(`${selectedClient.name}${selectedClient.phone ? ` (${selectedClient.phone})` : ""}`);
    } else if (!clientId) {
      setSearchTerm("");
    }
  }, [selectedClient, clientId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (selectedClient) {
          setSearchTerm(`${selectedClient.name}${selectedClient.phone ? ` (${selectedClient.phone})` : ""}`);
        } else if (!clientId) {
          setSearchTerm("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedClient, clientId]);

  const cleanTerm = searchTerm.toLowerCase().trim();
  const cleanDigits = searchTerm.replace(/[^0-9]/g, "");

  useEffect(() => {
    if (cleanDigits.length === 10) {
      let isSubscribed = true;
      fetch(`/api/clients/lookup?phone=${cleanDigits}`)
        .then((r) => r.json())
        .then((res) => {
          if (isSubscribed && res?.client) {
            setRemoteLitigant(res.client);
          }
        })
        .catch(() => {});
      return () => {
        isSubscribed = false;
      };
    } else {
      setRemoteLitigant(null);
    }
  }, [cleanDigits]);

  const filtered = clients.filter((c) => {
    if (!cleanTerm) return true;
    const nameMatch = (c.name || "").toLowerCase().includes(cleanTerm);
    const emailMatch = (c.email || "").toLowerCase().includes(cleanTerm);
    const phoneMatch = cleanDigits
      ? (c.phone || "").replace(/[^0-9]/g, "").includes(cleanDigits)
      : (c.phone || "").toLowerCase().includes(cleanTerm);
    return nameMatch || emailMatch || phoneMatch;
  });

  const comboboxItems = [
    ...(remoteLitigant && !filtered.some((c) => c.id === remoteLitigant.id) ? [remoteLitigant] : []),
    ...filtered,
  ];

  const handleSelect = (c: { id: string; name: string; phone?: string; email?: string; designation?: string }) => {
    setInternalSelectedClient(c);
    onChange(c.id);
    onSelectClient?.(c);
    setSearchTerm(`${c.name}${c.phone ? ` (${c.phone})` : ""}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInternalSelectedClient(null);
    onChange("");
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80">
          {label} <span className="text-[#d9541e]">*</span>
        </label>
        <button
          type="button"
          onClick={onAddNewContact}
          className="text-[11px] font-cinzel text-[#d9541e] hover:underline flex items-center gap-1 cursor-pointer font-bold"
        >
          <Plus className="w-3 h-3" />
          <span>Add a new contact</span>
        </button>
      </div>

      <div className="relative">
        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40 dark:text-[#f3eee3]/40 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            if (selectedClient && searchTerm.includes(selectedClient.name)) {
              setSearchTerm("");
            }
          }}
          placeholder="Search by client name, phone (+91...), or email..."
          className="w-full pl-9 pr-16 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-serif font-semibold text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#111111]/40 dark:text-[#f3eee3]/40">
          {clientId && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-red-500 rounded transition-colors cursor-pointer"
              title="Clear selected client"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-40 left-0 right-0 mt-1.5 max-h-64 overflow-y-auto rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1a1816] shadow-2xl py-1.5 text-xs">
          <div className="px-3.5 py-1.5 border-b border-[#111111]/10 dark:border-[#f3eee3]/10 text-[10.5px] font-cinzel font-semibold uppercase tracking-wider text-[#111111]/50 dark:text-[#f3eee3]/50 flex items-center justify-between">
            <span>Search by Name, Phone, or Email</span>
            <span>{comboboxItems.length} found</span>
          </div>

          {comboboxItems.length > 0 ? (
            comboboxItems.map((cl) => {
              const isSelected = cl.id === clientId;
              const isCrossChamber = remoteLitigant && cl.id === remoteLitigant.id && !clients.some((item) => item.id === cl.id);
              return (
                <div
                  key={cl.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(cl);
                  }}
                  onClick={() => handleSelect(cl)}
                  className={`px-3.5 py-2.5 hover:bg-[#f3eee3]/60 dark:hover:bg-[#282522] cursor-pointer transition-colors flex items-center justify-between border-b border-[#111111]/5 dark:border-[#f3eee3]/5 last:border-0 ${
                    isSelected ? "bg-[#d9541e]/10 dark:bg-[#d9541e]/15 text-[#d9541e]" : ""
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <p className="font-serif font-bold text-xs text-[#111111] dark:text-[#f3eee3] truncate">
                        {cl.name}
                      </p>
                      {isCrossChamber && (
                        <span className="text-[9px] px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-sans font-bold border border-emerald-500/25">
                          Universal Litigant
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-[11px] font-mono text-[#111111]/60 dark:text-[#f3eee3]/60">
                      {cl.phone && (
                        <span className="flex items-center gap-1 text-[#d9541e] font-semibold">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{cl.phone}</span>
                        </span>
                      )}
                      {cl.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" />
                          <span>{cl.email}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#d9541e] shrink-0" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 italic mb-2">
                No litigant client matches &ldquo;{searchTerm}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onAddNewContact();
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#d9541e] text-white text-[11px] font-cinzel font-bold shadow-xs hover:bg-[#bf4513] cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Client</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CASE_TYPES = [
  "Administrative Law",
  "Admiralty & Maritime Law",
  "Alternative Dispute Resolution (ADR)",
  "Antitrust & Competition Law",
  "Arbitration & Conciliation",
  "Armed Forces & Military Law",
  "Aviation Law",
  "Bail & Criminal Miscellaneous",
  "Banking and Finance Law",
  "Bankruptcy & Insolvency Law (IBC)",
  "Civil Law",
  "Commercial Law",
  "Company and Corporate Law",
  "Competition Law",
  "Constitutional Law",
  "Consumer Law",
  "Contempt of Court",
  "Contract Law",
  "Criminal Law",
  "Customs, GST & Indirect Taxes",
  "Cyber Law",
  "Debt Recovery (DRT / DRAT)",
  "Defamation Law",
  "Direct Tax & Income Tax Law",
  "Education Law",
  "Election Law",
  "Energy Law",
  "Environmental Law",
  "Family Law",
  "Health Law",
  "Human Rights Law",
  "Immigration Law",
  "Infrastructure and Construction Law",
  "Insurance Law",
  "Intellectual Property Law",
  "International Law",
  "International Trade Law",
  "Labour Law",
  "Land Acquisition and Development Law",
  "Maritime Law",
  "Matrimonial and Divorce Law",
  "Media and Entertainment Law",
  "Medical Negligence Law",
  "Mining & Minerals Law",
  "Motor Accident Claims (MACT)",
  "Narcotics & NDPS Act",
  "Negotiable Instruments / Cheque Bounce (Sec 138)",
  "POSH & Workplace Harassment Law",
  "Prevention of Corruption Act (PC Act)",
  "Property Law",
  "Public Interest Litigation",
  "Real Estate and RERA Law",
  "Rent Law",
  "Securities and Capital Markets Law",
  "Securities Law",
  "Service Law",
  "Special Leave Petition (SLP) & Appellate",
  "Sports Law",
  "Succession, Wills & Probate",
  "Tax Law",
  "Taxation Law",
  "Telecommunication Law",
  "Trusts and Estates Law",
  "Waqf & Religious Endowments Law",
  "White Collar Crime & PMLA",
  "Writ Petition (Civil / Criminal)",
];

const CASE_STAGES = [
  "Fresh Filing / Admission",
  "Notice Issued / Service",
  "Pleadings / Written Statement",
  "Rejoinder & Replication",
  "Framing of Issues",
  "Plaintiff / Petitioner Evidence",
  "Defendant / Respondent Evidence",
  "Final Arguments",
  "Reserved for Judgment / Orders",
  "Compliance & Execution",
  "Disposed / Closed",
];

const ADVOCATE_FOR_OPTIONS = [
  "Plaintiff",
  "Defendant",
  "Petitioner",
  "Respondent",
  "Appellant",
  "Caveator",
  "Applicant",
  "Non-Applicant",
  "Complainant",
  "Accused / Defense",
];

export function AddCaseView() {
  const router = useRouter();
  const { state, currentUser, sendOps, submitApproval, addToast } = useChamber();

  // 1. Case Details State
  const [officeFileNo, setOfficeFileNo] = useState("");
  const [caseNo, setCaseNo] = useState("");
  const [title, setTitle] = useState("");
  const [caseTypes, setCaseTypes] = useState<string[]>([]);
  const caseType = caseTypes.join(", ");
  const [stage, setStage] = useState("Fresh Filing / Admission");
  const [court, setCourt] = useState("");
  const [judge, setJudge] = useState("");
  const [city, setCity] = useState("");
  const [counselFor, setCounselFor] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [previousDate, setPreviousDate] = useState("");
  const [limitationDate, setLimitationDate] = useState("");
  const [limitationTask, setLimitationTask] = useState("");
  const [notes, setNotes] = useState("");

  // Custom Fields State
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  // Attachments State (50 MB limit)
  const MAX_STORAGE_BYTES = 50 * 1024 * 1024;
  const [attachments, setAttachments] = useState<CaseAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Contact Information State
  const [clientId, setClientId] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [opponentLawyer, setOpponentLawyer] = useState("");

  // Quick inline add new contact modal
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactTarget, setNewContactTarget] = useState<"client" | "opponent" | "opponentLawyer">("client");
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [matchedCrossChamberClient, setMatchedCrossChamberClient] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    accessCode?: string;
  } | null>(null);
  const [isLookingUpPhone, setIsLookingUpPhone] = useState(false);

  const handlePhoneLookup = async (phoneStr: string) => {
    const clean = phoneStr.replace(/\D/g, "");
    if (clean.length !== 10) {
      setMatchedCrossChamberClient(null);
      return;
    }
    // Check local clientUsers first
    const local = (state?.users || []).find(
      (u) => u.role === "client" && (u.phone || "").replace(/\D/g, "").slice(-10) === clean
    );
    if (local) {
      setMatchedCrossChamberClient(local as any);
      setNewContactName(local.name);
      if (local.email) setNewContactEmail(local.email);
      return;
    }

    try {
      setIsLookingUpPhone(true);
      const res = await fetch(`/api/clients/lookup?phone=${clean}`);
      const data = await res.json();
      if (data?.client) {
        setMatchedCrossChamberClient(data.client);
        setNewContactName(data.client.name);
        if (data.client.email) setNewContactEmail(data.client.email);
      } else {
        setMatchedCrossChamberClient(null);
      }
    } catch (e) {
      console.warn("Lookup failed:", e);
    } finally {
      setIsLookingUpPhone(false);
    }
  };

  // 3. Additional Information State
  const [timesheet, setTimesheet] = useState<TimesheetEntry[]>([]);
  const [showTimesheetForm, setShowTimesheetForm] = useState(false);
  const [tsDate, setTsDate] = useState(new Date().toISOString().slice(0, 10));
  const [tsAdvocate, setTsAdvocate] = useState(currentUser?.name || "Advocate");
  const [tsActivity, setTsActivity] = useState("");
  const [tsHours, setTsHours] = useState("2");
  const [tsRate, setTsRate] = useState("2000");

  const [feeAgreed, setFeeAgreed] = useState("");
  const [caseCharge, setCaseCharge] = useState("");
  const [feeReceipts, setFeeReceipts] = useState<FeeReceipt[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payReceiptNo, setPayReceiptNo] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState("Bank Transfer / NEFT");
  const [payNote, setPayNote] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Active chamber lawyer ID
  const chamberLawyerId =
    currentUser?.role === "lawyer"
      ? currentUser.id
      : currentUser?.lawyerId || "u-lawyer";

  // Filter clients belonging to chamber
  const clientUsers = (state?.users || []).filter(
    (u) =>
      u.role === "client" &&
      (currentUser?.role === "admin" || (u.lawyerId || "u-lawyer") === chamberLawyerId)
  );

  // Cross-chamber client dynamically resolved via phone lookup
  const [selectedRemoteClient, setSelectedRemoteClient] = useState<{
    id: string;
    name: string;
    phone?: string;
    email?: string;
    designation?: string;
  } | null>(null);

  const availableClients = [
    ...(selectedRemoteClient && !clientUsers.some((u) => u.id === selectedRemoteClient.id) ? [selectedRemoteClient] : []),
    ...clientUsers,
  ];

  // Track whether advocate manually modified title
  const [isTitleManual, setIsTitleManual] = useState(false);

  // Auto-generate title whenever client or opponent changes
  useEffect(() => {
    if (isTitleManual) return;
    const selectedClient = availableClients.find((c) => c.id === clientId);
    const cName = selectedClient ? selectedClient.name : "";
    const opp = opponentName.trim();

    if (cName && opp) {
      setTitle(`${cName} v. ${opp}`);
    } else if (cName) {
      setTitle(`${cName} v. Respondent`);
    } else if (opp) {
      setTitle(`Applicant v. ${opp}`);
    } else {
      setTitle("");
    }
  }, [clientId, opponentName, availableClients, isTitleManual]);

  // Financial calculations
  const parsedFeeAgreed = Number(feeAgreed) || 0;
  const parsedCaseCharge = Number(caseCharge) || 0;
  const totalFee = parsedFeeAgreed + parsedCaseCharge;
  const totalPaid = feeReceipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const remainingFee = Math.max(0, totalFee - totalPaid);

  // Attachment storage calculation
  const totalStorageUsed = attachments.reduce((acc, a) => acc + (a.size || 0), 0);
  const storageAvailable = Math.max(0, MAX_STORAGE_BYTES - totalStorageUsed);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Quick date chips
  const addDaysToNextDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setNextDate(d.toISOString().slice(0, 10));
  };

  // Custom field handlers
  const handleAddCustomField = () => {
    setCustomFields([
      ...customFields,
      { id: "cf-" + Date.now() + "-" + Math.random().toString(36).slice(2, 5), name: "", value: "" },
    ]);
  };

  const handleUpdateCustomField = (id: string, field: "name" | "value", val: string) => {
    setCustomFields(
      customFields.map((cf) => (cf.id === id ? { ...cf, [field]: val } : cf))
    );
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(customFields.filter((cf) => cf.id !== id));
  };

  // Attachment upload handler with database persistence
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    let currentTotal = totalStorageUsed;
    const newItems: CaseAttachment[] = [];

    for (const file of fileArray) {
      if (currentTotal + file.size > MAX_STORAGE_BYTES) {
        addToast(`Cannot add ${file.name}: exceeds 50 MB storage limit`, "error");
        continue;
      }
      currentTotal += file.size;

      // Read file content as base64 Data URL so it is persisted directly in MongoDB
      let dataUrl: string | undefined = undefined;
      if (file.size <= 8 * 1024 * 1024) {
        try {
          dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve("");
            reader.readAsDataURL(file);
          });
        } catch {
          dataUrl = undefined;
        }
      }

      newItems.push({
        id: "att-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
        dataUrl,
      });
    }

    if (newItems.length > 0) {
      setAttachments((prev) => [...prev, ...newItems]);
      addToast(`${newItems.length} document attachment(s) loaded for cloud database storage`, "success");
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  // Quick Add Contact
  const handleSaveQuickContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    if (newContactTarget === "client") {
      if (!newContactPhone.trim() || newContactPhone.trim().length !== 10) {
        addToast("Please enter a valid 10-digit mobile number for litigant contact", "error");
        return;
      }

      if (matchedCrossChamberClient) {
        setClientId(matchedCrossChamberClient.id);
        addToast(`Existing Litigant Profile ${matchedCrossChamberClient.name} linked to this matter across chambers.`, "success");
        setNewContactName("");
        setNewContactPhone("");
        setNewContactEmail("");
        setMatchedCrossChamberClient(null);
        setShowAddContactModal(false);
        return;
      }

      const newUserId = "c-" + Date.now().toString(36);
      const newClientUser = {
        id: newUserId,
        name: newContactName.trim(),
        email: newContactEmail.trim() || "",
        role: "client" as const,
        phone: newContactPhone.trim(),
        lawyerId: chamberLawyerId,
      };

      await sendOps([{ type: "addClient", payload: { user: newClientUser } }]);
      setClientId(newUserId);
      addToast(`Litigant contact ${newContactName} enrolled & assigned`, "success");
    } else if (newContactTarget === "opponent") {
      setOpponentName(newContactName.trim());
      addToast(`Opponent party set to ${newContactName}`, "info");
    } else if (newContactTarget === "opponentLawyer") {
      setOpponentLawyer(newContactName.trim());
      addToast(`Opponent advocate recorded as ${newContactName}`, "info");
    }

    setNewContactName("");
    setNewContactPhone("");
    setNewContactEmail("");
    setShowAddContactModal(false);
  };

  // Timesheet Entry
  const handleAddTimesheetEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tsActivity.trim()) {
      addToast("Please provide an activity description", "error");
      return;
    }

    const entry: TimesheetEntry = {
      id: "ts-" + Date.now(),
      date: tsDate,
      advocateName: tsAdvocate || currentUser?.name || "Advocate",
      activity: tsActivity.trim(),
      hours: parseFloat(tsHours) || 1,
      rate: parseFloat(tsRate) || 0,
    };

    setTimesheet([...timesheet, entry]);
    setTsActivity("");
    setShowTimesheetForm(false);
    addToast("Timesheet entry logged", "success");
  };

  // Payment Record
  const handleAddPaymentRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) {
      addToast("Please enter a valid payment amount", "error");
      return;
    }

    const rec: FeeReceipt = {
      receiptNo: payReceiptNo.trim() || `REC-${Date.now().toString().slice(-4)}`,
      date: payDate,
      amount: amt,
      mode: payMode,
      note: payNote.trim(),
    };

    setFeeReceipts([...feeReceipts, rec]);
    setPayReceiptNo("");
    setPayAmount("");
    setPayNote("");
    setShowPaymentForm(false);
    addToast(`Payment of ₹${amt.toLocaleString("en-IN")} recorded`, "success");
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseNo.trim()) {
      addToast("Please provide Court Case Number", "error");
      return;
    }
    if (!title.trim()) {
      addToast("Please fill in Client Information in Section 2 to generate Case Title", "error");
      return;
    }
    if (!nextDate) {
      addToast("Please pick a Next Date", "error");
      return;
    }

    setSubmitting(true);

    const nowIso = new Date().toISOString();
    const caseId = "case-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);

    const newCasePayload = {
      id: caseId,
      caseNo: caseNo.trim(),
      title: title.trim(),
      officeFileNo: officeFileNo.trim(),
      caseType: caseTypes.join(", "),
      caseTypes: caseTypes,
      stage: stage.trim(),
      court: court.trim(),
      judge: judge.trim(),
      city: city.trim(),
      counselFor: counselFor.trim(),
      clientId: clientId || availableClients[0]?.id || "c-client",
      opponentName: opponentName.trim(),
      opponentLawyer: opponentLawyer.trim(),
      limitationDate: limitationDate || "",
      limitationTask: limitationTask.trim() || "",
      notes: notes.trim(),
      feeAgreed: parsedFeeAgreed,
      caseCharge: parsedCaseCharge,
      feeReceived: totalPaid,
      feeReceipts,
      customFields: customFields.filter((cf) => cf.name.trim() !== ""),
      attachments,
      timesheet,
      hearings: [
        ...(previousDate
          ? [
            {
              date: previousDate,
              purpose: "Previous Proceedings / Prior Listing",
              outcome: "Matter transferred & registered in chamber diary",
              by: currentUser?.id || "u-lawyer",
            },
          ]
          : []),
        {
          date: nextDate,
          purpose: stage || "Next Date of Hearing",
          outcome: `Listed before ${court}${judge ? ` (${judge})` : ""}`,
          by: currentUser?.id || "u-lawyer",
        },
      ],
      orders: [],
      queries: [],
      status: "Active" as const,
      filingDate: nowIso.slice(0, 10),
      lawyerId: chamberLawyerId,
      associateIds: [],
    };

    try {
      if (currentUser?.role === "associate") {
        const approvalItem = {
          id: "a-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
          by: currentUser.id,
          byName: currentUser.name,
          ts: nowIso,
          type: "addCase",
          label: `Fresh Matter Draft: ${caseNo.trim()} — ${title.trim()}`,
          payload: { case: newCasePayload },
        };
        await submitApproval(approvalItem);
        addToast("Case draft submitted for Advocate verification.", "info");
        router.push("/dashboard/approvals");
      } else {
        await sendOps([{ type: "addCase", payload: { case: newCasePayload } }]);
        addToast(`Matter ${caseNo.trim()} officially docketed in Chamber Register.`, "success");
        if (currentUser?.role === "admin") {
          router.push(`/admin/cases/${encodeURIComponent(caseId)}`);
        } else {
          router.push(`/dashboard/cases/${encodeURIComponent(caseId)}`);
        }
      }
    } catch (err: any) {
      addToast(err.message || "Failed to register case", "error");
      setSubmitting(false);
    }
  };

  const selectedClientUser = availableClients.find((c) => c.id === clientId);

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#111111]/15 dark:border-[#f3eee3]/20 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-cinzel text-[#111111]/60 dark:text-[#f3eee3]/60 mb-1.5">
            <Link
              href={currentUser?.role === "admin" ? "/admin/cases" : "/dashboard/cases"}
              className="hover:text-[#d9541e] transition-colors flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Case Register</span>
            </Link>
            <span>/</span>
            <span className="text-[#111111] dark:text-[#f3eee3] font-bold">New Matter Docket</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#f3eee3] dark:bg-[#f3eee3] dark:text-[#111111] flex items-center justify-center shadow-md">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] tracking-tight">
                File Fresh Matter
              </h1>
              <p className="text-xs font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
                Judicial brief intake, litigant registers, cause-list tracking &amp; chamber ledger
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={currentUser?.role === "admin" ? "/admin/cases" : "/dashboard/cases"}
            className="px-4 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-xs font-cinzel font-semibold text-[#111111]/75 dark:text-[#f3eee3]/75 hover:bg-[#f3eee3]/40 dark:hover:bg-[#202020] transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-[#d9541e] hover:bg-[#ba4212] text-white text-xs font-cinzel font-bold tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{submitting ? "Registering..." : currentUser?.role === "associate" ? "Submit Draft" : "Docket & Register Case"}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Sections (8 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
          {/* ========================================================= */}
          {/* 1. CASE DETAILS */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[#111111]/10 dark:bg-[#f3eee3]/10 text-[#111111] dark:text-[#f3eee3] font-cinzel font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <h2 className="text-sm font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                    Case Details
                  </h2>
                  <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
                    Court identification, judicial bench &amp; suit classification
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#d9541e]/10 text-[#d9541e] font-semibold border border-[#d9541e]/20">
                Mandatory Details
              </span>
            </div>

            {/* Row 1: Office File Number & Court Case Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
                  Office File Number <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                  <input
                    type="text"
                    value={officeFileNo}
                    onChange={(e) => setOfficeFileNo(e.target.value)}
                    placeholder="e.g. 12"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-mono text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
                  Court Case Number <span className="text-[#d9541e]">*</span>
                </label>
                <div className="relative">
                  <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                  <input
                    type="text"
                    required
                    value={caseNo}
                    onChange={(e) => setCaseNo(e.target.value)}
                    placeholder="e.g., W.P.(C) 4120/2026 or CS(COMM) 312/2026"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-mono font-bold text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Case Title with Auto-Generate Helper */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80">
                  Case Title <span className="text-[#d9541e]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !isTitleManual;
                    setIsTitleManual(nextMode);
                    if (!nextMode) {
                      // Reset to auto-synced title
                      const selectedClient = availableClients.find((c) => c.id === clientId);
                      const cName = selectedClient ? selectedClient.name : "";
                      const opp = opponentName.trim();
                      if (cName || opp) {
                        setTitle(cName && opp ? `${cName} v. ${opp}` : cName ? `${cName} v. Respondent` : `Applicant v. ${opp}`);
                      } else {
                        setTitle("");
                      }
                    }
                  }}
                  className="text-[11px] font-cinzel text-[#d9541e] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  title="Toggle manual title override"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isTitleManual ? "Auto-sync with Parties" : "Edit Manually"}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  disabled={!title && !isTitleManual}
                  value={title}
                  onChange={(e) => {
                    setIsTitleManual(true);
                    setTitle(e.target.value);
                  }}
                  placeholder="Auto-generated cause title (e.g., 'Petitioner v. Respondent') — fill in Section 2 (Client Information) below"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-serif font-bold transition-all shadow-2xs ${!title && !isTitleManual
                    ? "bg-[#f3eee3]/40 dark:bg-[#181614] border-[#111111]/15 dark:border-[#f3eee3]/15 text-[#111111]/50 dark:text-[#f3eee3]/40 cursor-not-allowed placeholder:text-[#111111]/45 dark:placeholder:text-[#f3eee3]/45 placeholder:font-sans placeholder:normal-case placeholder:font-semibold placeholder:tracking-normal placeholder:text-[11px]"
                    : "bg-white dark:bg-[#1e1c19] border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e]"
                    }`}
                />
              </div>
              {!title && !isTitleManual && (
                <p className="mt-1.5 text-[11px] font-serif italic text-[#d9541e] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Cause title automatically synthesizes as &quot;[Client Name] v. [Opposing Party]&quot; once client information is entered in Section 2 below. (Click &apos;Edit Manually&apos; above to override).</span>
                </p>
              )}
            </div>

            {/* Row 3: Case Type & Case Stage (Search / Create) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MultiSelectCaseTypeCombobox
                label="Case Type"
                placeholder="Select or search practice areas..."
                selected={caseTypes}
                onChange={setCaseTypes}
                options={CASE_TYPES}
                icon={<Briefcase className="w-4 h-4" />}
              />

              <SearchableCombobox
                label="Case Stage"
                placeholder="Type to search or create new entry"
                value={stage}
                onChange={setStage}
                options={CASE_STAGES}
                icon={<Clock className="w-4 h-4" />}
              />
            </div>

            {/* Row 4: Court Name & Judge Name (Open Text Inputs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
                  Court Name <span className="text-[#d9541e]">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                  <input
                    type="text"
                    required
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                    placeholder="e.g., Supreme Court"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
                  Judge Name
                </label>
                <div className="relative">
                  <Gavel className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                  <input
                    type="text"
                    value={judge}
                    onChange={(e) => setJudge(e.target.value)}
                    placeholder="Type to enter judge name"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Row 5: City & Advocate For */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., New Delhi"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
                  />
                </div>
              </div>

              <SearchableCombobox
                label="Advocate For"
                placeholder="Select party representation (e.g. Plaintiff, Petitioner)..."
                value={counselFor}
                onChange={setCounselFor}
                options={ADVOCATE_FOR_OPTIONS}
              />
            </div>

            {/* Row 6: Previous Date & Next Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
                  Previous Date <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(Only for Old Case)</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40 dark:text-[#f3eee3]/40 pointer-events-none" />
                  <input
                    type="date"
                    value={previousDate}
                    onChange={(e) => setPreviousDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80">
                    Next Date <span className="text-[#d9541e]">*</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => addDaysToNextDate(7)}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f3eee3]/80 dark:bg-[#282522] hover:bg-[#d9541e] hover:text-white transition-colors"
                    >
                      +7d
                    </button>
                    <button
                      type="button"
                      onClick={() => addDaysToNextDate(14)}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f3eee3]/80 dark:bg-[#282522] hover:bg-[#d9541e] hover:text-white transition-colors"
                    >
                      +14d
                    </button>
                    <button
                      type="button"
                      onClick={() => addDaysToNextDate(30)}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f3eee3]/80 dark:bg-[#282522] hover:bg-[#d9541e] hover:text-white transition-colors"
                    >
                      +1mo
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d9541e] pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    placeholder="Pick a date"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#d9541e]/50 dark:border-[#d9541e]/50 bg-white dark:bg-[#1e1c19] text-xs font-semibold text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Row 6.5: Statutory Limitation Tracking (The Limitation Act, 1963) */}
            <div className="p-4.5 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#f3eee3]/20 dark:bg-[#1a1816] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#d9541e]" />
                  <span className="text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                    Statutory Limitation Deadline (The Limitation Act, 1963)
                  </span>
                </div>
                <span className="text-[10px] font-serif italic text-[#111111]/50 dark:text-[#f3eee3]/50">
                  Optional Tracking
                </span>
              </div>
              <p className="text-[11px] font-serif italic text-[#111111]/65 dark:text-[#f3eee3]/65">
                Set a statutory limitation cutoff (e.g. for filing an appeal, written statement, revision, or rejoinder). The Dashboard Radar will automatically monitor the countdown and flag urgent deadlines.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1">
                    Limitation Cutoff Date
                  </label>
                  <input
                    type="date"
                    value={limitationDate}
                    onChange={(e) => setLimitationDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-semibold text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1">
                    Pleading / Limitation Task
                  </label>
                  <input
                    type="text"
                    value={limitationTask}
                    onChange={(e) => setLimitationTask(e.target.value)}
                    placeholder="e.g. Filing Appeal under Sec 96 CPC or Replication"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 focus:outline-none focus:border-[#d9541e]"
                  />
                </div>
              </div>
            </div>

            {/* Row 7: Notes */}
            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
                Notes / Brief Background
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Important notes, brief background, prayer synopsis, interim injunction grounds..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-serif text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs leading-relaxed"
              />
            </div>

            {/* Custom Fields Sub-Section */}
            <div className="pt-4 border-t border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                    Custom Fields
                  </h3>
                  <p className="text-[11px] font-serif italic text-[#111111]/55 dark:text-[#f3eee3]/55">
                    Tailored chamber metadata (e.g. Police Station, FIR No, Shelf Location)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomField}
                  className="px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] hover:border-[#d9541e] hover:text-[#d9541e] text-[11px] font-cinzel font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Field</span>
                </button>
              </div>

              {customFields.length === 0 ? (
                <div className="p-4 rounded-2xl border border-dashed border-[#111111]/20 dark:border-[#f3eee3]/20 bg-[#f3eee3]/20 dark:bg-[#202020]/30 text-center">
                  <p className="text-xs font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
                    No custom fields added
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {customFields.map((cf) => (
                    <div key={cf.id} className="flex items-center gap-2.5">
                      <input
                        type="text"
                        placeholder="Field Name (e.g. FIR No)"
                        value={cf.name}
                        onChange={(e) => handleUpdateCustomField(cf.id, "name", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 focus:outline-none focus:border-[#d9541e]"
                      />
                      <input
                        type="text"
                        placeholder="Field Value"
                        value={cf.value}
                        onChange={(e) => handleUpdateCustomField(cf.id, "value", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 focus:outline-none focus:border-[#d9541e]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomField(cf.id)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Remove field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attachments Sub-Section */}
            <div className="pt-4 border-t border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                    Attachments
                  </h3>
                  <p className="text-[11px] font-serif italic text-[#111111]/55 dark:text-[#f3eee3]/55">
                    Pleadings, Vakalatnama, interim applications, citations &amp; orders
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-semibold text-[#111111]/70 dark:text-[#f3eee3]/70">
                    Used: {formatBytes(totalStorageUsed)} / 50 MB
                  </span>
                  <span className="text-[9.5px] font-mono text-[#111111]/45 dark:text-[#f3eee3]/45 block">
                    ({formatBytes(storageAvailable)} available)
                  </span>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFilesSelected(e.dataTransfer.files);
                }}
                className="p-6 rounded-2xl border-2 border-dashed border-[#111111]/20 dark:border-[#f3eee3]/20 hover:border-[#d9541e] dark:hover:border-[#d9541e] bg-[#f3eee3]/20 dark:bg-[#202020]/30 hover:bg-[#f3eee3]/40 dark:hover:bg-[#202020]/50 transition-all text-center cursor-pointer group"
              >
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                <UploadCloud className="w-8 h-8 mx-auto text-[#111111]/40 dark:text-[#f3eee3]/40 group-hover:text-[#d9541e] group-hover:scale-110 transition-all mb-2" />
                <p className="text-xs font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                  Drag and drop files, or <span className="text-[#d9541e] underline">click to select</span>
                </p>
                <p className="text-[10.5px] font-serif text-[#111111]/50 dark:text-[#f3eee3]/50 mt-0.5">
                  Supports PDF, DOCX, PNG, JPG up to 50 MB total dossier size
                </p>
              </div>

              {/* Uploaded Files List */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="p-2.5 rounded-xl border border-[#111111]/10 dark:border-[#f3eee3]/15 bg-[#f3eee3]/30 dark:bg-[#22201e] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#d9541e]/15 text-[#d9541e] flex items-center justify-center shrink-0">
                          {file.type.includes("image") ? (
                            <ImageIcon className="w-4 h-4" />
                          ) : (
                            <File className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          {file.dataUrl ? (
                            <a
                              href={file.dataUrl}
                              download={file.name}
                              className="text-xs font-serif font-semibold text-[#d9541e] hover:underline truncate block cursor-pointer"
                              title="Click to download file"
                            >
                              {file.name}
                            </a>
                          ) : (
                            <p className="text-xs font-serif font-semibold text-[#111111] dark:text-[#f3eee3] truncate">
                              {file.name}
                            </p>
                          )}
                          <p className="text-[10px] font-mono text-[#111111]/50 dark:text-[#f3eee3]/50">
                            {formatBytes(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAttachment(file.id);
                        }}
                        className="p-1 text-neutral-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete attachment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. CONTACT INFORMATION */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[#111111]/10 dark:bg-[#f3eee3]/10 text-[#111111] dark:text-[#f3eee3] font-cinzel font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h2 className="text-sm font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                    Contact Information
                  </h2>
                  <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
                    Litigant records, opposing parties &amp; adverse advocate registry
                  </p>
                </div>
              </div>
            </div>

            {/* Searchable Client Selector (Name, Phone, or Email) */}
            <SearchableClientCombobox
              label="Client Name"
              clientId={clientId}
              onChange={setClientId}
              onSelectClient={setSelectedRemoteClient}
              clients={availableClients}
              onAddNewContact={() => {
                setNewContactTarget("client");
                setShowAddContactModal(true);
              }}
            />

            {/* Opponent Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80">
                  Opponent Name
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNewContactTarget("opponent");
                    setShowAddContactModal(true);
                  }}
                  className="text-[11px] font-cinzel text-[#d9541e] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add a new contact</span>
                </button>
              </div>

              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40 dark:text-[#f3eee3]/40 pointer-events-none" />
                <input
                  type="text"
                  value={opponentName}
                  onChange={(e) => setOpponentName(e.target.value)}
                  placeholder="e.g. Union of India & Ors., Jane Doe, Acme Corp."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-serif text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
                />
              </div>
            </div>

            {/* Opponent Lawyer */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80">
                  Opponent Lawyer
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNewContactTarget("opponentLawyer");
                    setShowAddContactModal(true);
                  }}
                  className="text-[11px] font-cinzel text-[#d9541e] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add a new contact</span>
                </button>
              </div>

              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40 dark:text-[#f3eee3]/40 pointer-events-none" />
                <input
                  type="text"
                  value={opponentLawyer}
                  onChange={(e) => setOpponentLawyer(e.target.value)}
                  placeholder="e.g. Adv. Harish Salve, Additional Solicitor General"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-serif text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. ADDITIONAL INFORMATION (Financials & Timesheet) */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[#111111]/10 dark:bg-[#f3eee3]/10 text-[#111111] dark:text-[#f3eee3] font-cinzel font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <div>
                  <h2 className="text-sm font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                    Additional Information
                  </h2>
                  <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
                    Billable timesheet logs, vakalat fees, court charges &amp; payment receipts
                  </p>
                </div>
              </div>
            </div>

            {/* Time Sheet Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                    Time Sheet
                  </h3>
                  <p className="text-[11px] font-serif italic text-[#111111]/55 dark:text-[#f3eee3]/55">
                    Advocate drafting hours, conferences &amp; court arguments
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTimesheetForm(!showTimesheetForm)}
                  className="px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] hover:border-[#d9541e] hover:text-[#d9541e] text-[11px] font-cinzel font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add new timesheet entry</span>
                </button>
              </div>

              {/* Inline Timesheet Form */}
              {showTimesheetForm && (
                <div className="p-4 rounded-2xl border border-[#d9541e]/30 bg-[#d9541e]/5 space-y-3">
                  <h4 className="text-xs font-cinzel font-bold text-[#d9541e] uppercase">
                    Log Billable Activity
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={tsDate}
                        onChange={(e) => setTsDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 mb-1">
                        Advocate
                      </label>
                      <input
                        type="text"
                        value={tsAdvocate}
                        onChange={(e) => setTsAdvocate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 mb-1">
                          Hours
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={tsHours}
                          onChange={(e) => setTsHours(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 mb-1">
                          Rate / hr
                        </label>
                        <input
                          type="number"
                          value={tsRate}
                          onChange={(e) => setTsRate(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3]"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 mb-1">
                      Activity Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Drafting Writ Petition grounds, citation research, client conference"
                      value={tsActivity}
                      onChange={(e) => setTsActivity(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowTimesheetForm(false)}
                      className="px-3 py-1 rounded-lg text-xs font-cinzel hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddTimesheetEntry}
                      className="px-3 py-1 rounded-lg bg-[#d9541e] text-white text-xs font-cinzel font-bold shadow-xs cursor-pointer"
                    >
                      Save Timesheet Entry
                    </button>
                  </div>
                </div>
              )}

              {/* Recorded Timesheet List */}
              {timesheet.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-[#111111]/10 dark:border-[#f3eee3]/15">
                  <table className="w-full text-left text-xs font-serif">
                    <thead className="bg-[#f3eee3]/40 dark:bg-[#202020] text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Advocate</th>
                        <th className="py-2 px-3">Activity</th>
                        <th className="py-2 px-3 text-right">Hours</th>
                        <th className="py-2 px-3 text-right">Rate</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                        <th className="py-2 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111111]/5 dark:divide-[#f3eee3]/5">
                      {timesheet.map((ts) => (
                        <tr key={ts.id} className="hover:bg-[#f3eee3]/20 dark:hover:bg-[#22201e]">
                          <td className="py-2 px-3 font-mono text-[11px]">{ts.date}</td>
                          <td className="py-2 px-3 font-bold">{ts.advocateName}</td>
                          <td className="py-2 px-3 text-[#111111]/80 dark:text-[#f3eee3]/80">{ts.activity}</td>
                          <td className="py-2 px-3 text-right font-mono">{ts.hours}h</td>
                          <td className="py-2 px-3 text-right font-mono">₹{ts.rate?.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-[#d9541e]">
                            ₹{((ts.hours || 0) * (ts.rate || 0)).toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => setTimesheet(timesheet.filter((t) => t.id !== ts.id))}
                              className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Case Fee & Case Charge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#111111]/10 dark:border-[#f3eee3]/10">
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
                  Case Fee (Agreed Professional Honorarium)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#111111]/50 dark:text-[#f3eee3]/50">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={feeAgreed}
                    onChange={(e) => setFeeAgreed(e.target.value)}
                    placeholder="e.g., 50000"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-mono font-bold text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
                  Case Charge (Clerkage, Printing &amp; Incidental)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#111111]/50 dark:text-[#f3eee3]/50">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={caseCharge}
                    onChange={(e) => setCaseCharge(e.target.value)}
                    placeholder="e.g., 5000"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-mono font-bold text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e] shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Payment History Section */}
            <div className="pt-3 border-t border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                    Payment History
                  </h3>
                  <p className="text-[11px] font-serif italic text-[#111111]/55 dark:text-[#f3eee3]/55">
                    Logged advances, bank transfers &amp; client receipts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] hover:border-[#d9541e] hover:text-[#d9541e] text-[11px] font-cinzel font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add new payment record</span>
                </button>
              </div>

              {/* Inline Payment Form */}
              {showPaymentForm && (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <h4 className="text-xs font-cinzel font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Record Advance / Retainer Receipt
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 mb-1">
                        Receipt No
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. REC-101"
                        value={payReceiptNo}
                        onChange={(e) => setPayReceiptNo(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-mono text-[#111111] dark:text-[#f3eee3]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={payDate}
                        onChange={(e) => setPayDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 mb-1">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 25000"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-mono font-bold text-[#111111] dark:text-[#f3eee3]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 mb-1">
                        Payment Mode
                      </label>
                      <select
                        value={payMode}
                        onChange={(e) => setPayMode(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3]"
                      >
                        <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                        <option value="UPI / Online">UPI / Online</option>
                        <option value="Cheque / DD">Cheque / Demand Draft</option>
                        <option value="Cash Deposit">Cash Deposit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 mb-1">
                        Notes / Reference
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 50% mobilization advance"
                        value={payNote}
                        onChange={(e) => setPayNote(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowPaymentForm(false)}
                      className="px-3 py-1 rounded-lg text-xs font-cinzel hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddPaymentRecord}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-cinzel font-bold shadow-xs cursor-pointer"
                    >
                      Record Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Recorded Payments List */}
              {feeReceipts.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-[#111111]/10 dark:border-[#f3eee3]/15">
                  <table className="w-full text-left text-xs font-serif">
                    <thead className="bg-[#f3eee3]/40 dark:bg-[#202020] text-[10.5px] font-cinzel text-[#111111]/70 dark:text-[#f3eee3]/70 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
                      <tr>
                        <th className="py-2 px-3">Receipt No</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Mode</th>
                        <th className="py-2 px-3">Notes</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                        <th className="py-2 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111111]/5 dark:divide-[#f3eee3]/5">
                      {feeReceipts.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-[#f3eee3]/20 dark:hover:bg-[#22201e]">
                          <td className="py-2 px-3 font-mono font-bold">{rec.receiptNo}</td>
                          <td className="py-2 px-3 font-mono text-[11px]">{rec.date}</td>
                          <td className="py-2 px-3 font-semibold">{rec.mode || "Bank Transfer"}</td>
                          <td className="py-2 px-3 text-[#111111]/75 dark:text-[#f3eee3]/75">{rec.note || "—"}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{Number(rec.amount).toLocaleString("en-IN")}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => setFeeReceipts(feeReceipts.filter((_, i) => i !== idx))}
                              className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Dynamic Financial Summary Bar */}
              <div className="p-4 rounded-2xl bg-[#f3eee3]/40 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/15 grid grid-cols-3 gap-3 text-center">
                <div>
                  <span className="text-[10px] font-cinzel uppercase text-[#111111]/60 dark:text-[#f3eee3]/60 block">
                    Total Fee
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-[#111111] dark:text-[#f3eee3]">
                    ₹{totalFee.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-cinzel uppercase text-[#111111]/60 dark:text-[#f3eee3]/60 block">
                    Total Paid
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{totalPaid.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-cinzel uppercase text-[#111111]/60 dark:text-[#f3eee3]/60 block">
                    Remaining Fee
                  </span>
                  <span className={`text-base sm:text-lg font-mono font-bold ${remainingFee > 0 ? "text-[#d9541e]" : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                    ₹{remainingFee.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Right Column: Floating Dossier Summary & Live Action Desk (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Chamber Docket Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xl relative overflow-hidden">
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d9541e] via-[#ca8a04] to-[#111111]" />

            <div className="flex items-center justify-between pb-3.5 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg overflow-hidden border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] flex items-center justify-center p-0.5 shadow-2xs">
                  <Image src="/favicon.png" width={22} height={22} alt="LD" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                  Dossier Preview
                </span>
              </div>
              <div className="flex flex-wrap gap-1 max-w-[220px] justify-end">
                {caseTypes.length > 0 ? (
                  caseTypes.map((ct) => (
                    <span
                      key={ct}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d9541e]/10 text-[#d9541e] dark:bg-[#d9541e]/20 dark:text-[#ea6026] font-bold border border-[#d9541e]/25"
                    >
                      {ct}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f3eee3] dark:bg-[#25221f] text-[#111111]/70 dark:text-[#f3eee3]/70 font-bold border border-[#111111]/10 dark:border-[#f3eee3]/15">
                    Pending Selection
                  </span>
                )}
              </div>
            </div>

            <div className="py-4 space-y-3.5">
              <div>
                <span className="text-[10px] font-mono text-[#d9541e] font-bold block">
                  {caseNo.trim() || "CASE-NO-PENDING"}
                </span>
                <h3 className="text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3] leading-snug mt-0.5">
                  {title.trim() || "Untitled Legal Matter"}
                </h3>
                {officeFileNo.trim() && (
                  <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    File Ref: {officeFileNo.trim()}
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f3eee3]/30 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-2 text-xs font-serif">
                <div className="flex items-center justify-between">
                  <span className="text-[#111111]/60 dark:text-[#f3eee3]/60 text-[11px]">Court:</span>
                  <span className="font-bold text-[#111111] dark:text-[#f3eee3] text-right truncate max-w-[180px]">
                    {court || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#111111]/60 dark:text-[#f3eee3]/60 text-[11px]">City / Forum:</span>
                  <span className="font-semibold text-[#111111] dark:text-[#f3eee3]">
                    {city || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#111111]/60 dark:text-[#f3eee3]/60 text-[11px]">Advocate For:</span>
                  <span className="font-semibold text-[#d9541e]">
                    {counselFor || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#111111]/60 dark:text-[#f3eee3]/60 text-[11px]">Stage:</span>
                  <span className="font-semibold text-[#111111] dark:text-[#f3eee3] truncate max-w-[180px]">
                    {stage || "Fresh Filing"}
                  </span>
                </div>
              </div>

              {/* Litigants Row */}
              <div className="p-3.5 rounded-2xl bg-[#f3eee3]/30 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-1.5 text-xs font-serif">
                <div className="flex items-start justify-between">
                  <span className="text-[#111111]/60 dark:text-[#f3eee3]/60 text-[11px]">Client:</span>
                  <span className="font-bold text-[#111111] dark:text-[#f3eee3] text-right truncate max-w-[180px]">
                    {selectedClientUser?.name || "Unassigned Litigant"}
                  </span>
                </div>
                {opponentName && (
                  <div className="flex items-start justify-between">
                    <span className="text-[#111111]/60 dark:text-[#f3eee3]/60 text-[11px]">Opponent:</span>
                    <span className="font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 text-right truncate max-w-[180px]">
                      {opponentName}
                    </span>
                  </div>
                )}
                {opponentLawyer && (
                  <div className="flex items-start justify-between">
                    <span className="text-[#111111]/60 dark:text-[#f3eee3]/60 text-[11px]">Adv. Opponent:</span>
                    <span className="font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/70 text-right truncate max-w-[180px]">
                      {opponentLawyer}
                    </span>
                  </div>
                )}
              </div>

              {/* Hearing Date Banner */}
              <div className="p-3 rounded-2xl bg-[#d9541e]/10 border border-[#d9541e]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#d9541e]" />
                  <div>
                    <span className="text-[10px] font-cinzel font-bold text-[#d9541e] uppercase block">
                      Next Date
                    </span>
                    <span className="text-xs font-mono font-bold text-[#111111] dark:text-[#f3eee3]">
                      {nextDate || "Date Pending Selection"}
                    </span>
                  </div>
                </div>
                {nextDate && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-[#181818] text-[#d9541e] font-bold border border-[#d9541e]/30">
                    Scheduled
                  </span>
                )}
              </div>

              {/* Financial Snapshot */}
              <div className="pt-2 border-t border-[#111111]/10 dark:border-[#f3eee3]/10 flex items-center justify-between text-xs font-serif">
                <div>
                  <span className="text-[10px] font-cinzel text-[#111111]/55 dark:text-[#f3eee3]/55 block">
                    Balance Due
                  </span>
                  <span className={`font-mono font-bold text-sm ${remainingFee > 0 ? "text-[#d9541e]" : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                    ₹{remainingFee.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-cinzel text-[#111111]/55 dark:text-[#f3eee3]/55 block">
                    Dossier Attachments
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#111111] dark:text-[#f3eee3]">
                    {attachments.length} file(s) ({formatBytes(totalStorageUsed)})
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-2.5">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3 rounded-2xl bg-[#d9541e] hover:bg-[#ba4212] text-white text-xs font-cinzel font-bold tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Gavel className="w-4 h-4" />
                <span>{submitting ? "Docketing Matter..." : currentUser?.role === "associate" ? "Submit to Verification Desk" : "Register & Docket Case"}</span>
              </button>

              <Link
                href={currentUser?.role === "admin" ? "/admin/cases" : "/dashboard/cases"}
                className="w-full py-2.5 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs font-cinzel font-semibold text-[#111111]/70 dark:text-[#f3eee3]/70 hover:bg-[#f3eee3]/40 dark:hover:bg-[#25221f] transition-colors flex items-center justify-center"
              >
                Return Without Saving
              </Link>
            </div>

            {/* Footnote */}
            <div className="mt-4 pt-3 border-t border-[#111111]/10 dark:border-[#f3eee3]/10 flex items-center gap-2 text-[10.5px] font-serif text-[#111111]/50 dark:text-[#f3eee3]/50">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Full compliance with Bar Council of India chamber registry guidelines.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/75 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#d9541e]/15 text-[#d9541e] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                    {newContactTarget === "client"
                      ? "Enroll New Litigant Client"
                      : newContactTarget === "opponent"
                        ? "Add Opponent Party"
                        : "Record Opponent Advocate"}
                  </h3>
                  <p className="text-[10.5px] font-serif italic text-[#111111]/55 dark:text-[#f3eee3]/55">
                    Fast register &amp; instant selection
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddContactModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickContact} className="space-y-3.5 text-xs font-serif">
              {newContactTarget === "client" ? (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80">
                        Contact Mobile Phone <span className="text-[#d9541e]">*</span>
                      </label>
                      <span className="text-[10px] text-[#d9541e] font-serif italic">
                        Type 10 digits to autofill
                      </span>
                    </div>
                    <input
                      type="tel"
                      required
                      autoFocus
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={newContactPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setNewContactPhone(val);
                        handlePhoneLookup(val);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
                    />
                    {isLookingUpPhone && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-serif italic mt-1 animate-pulse">
                        Checking LexDaily universal litigant database...
                      </p>
                    )}
                    {matchedCrossChamberClient && (
                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-900 dark:text-emerald-200 font-serif">
                        <p className="font-bold font-cinzel text-emerald-800 dark:text-emerald-300">
                          ✓ Existing Litigant Profile Detected across Chambers
                        </p>
                        <p className="text-[10.5px] mt-0.5">
                          {matchedCrossChamberClient.name} is already registered in LexDaily. Full client details autofilled automatically. Their single universal login password will link all cases.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1">
                      Full Client Name <span className="text-[#d9541e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra Sharma"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1">
                      Email Address <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="litigant@chamber.in (Optional for case intake)"
                      value={newContactEmail}
                      onChange={(e) => setNewContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
                    />
                    <p className="text-[10px] font-serif italic text-[#111111]/50 dark:text-[#f3eee3]/50 mt-1">
                      Email is optional while entering client details for a case. You can add it later via Edit Client in the Client Register when granting portal login.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1">
                      Full Name <span className="text-[#d9541e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="e.g. Ramesh Chandra Sharma"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1">
                      Email Address <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="advocate@bar.in"
                      value={newContactEmail}
                      onChange={(e) => setNewContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#1e1c19] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#111111]/10 dark:border-[#f3eee3]/10">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel hover:bg-[#f3eee3]/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#d9541e] hover:bg-[#ba4212] text-white text-xs font-cinzel font-bold shadow-xs cursor-pointer"
                >
                  Save &amp; Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
