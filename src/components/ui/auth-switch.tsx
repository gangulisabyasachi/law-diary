"use client";

import React, { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Scale,
  ArrowRight,
  X,
  Check,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChamber } from "@/context/ChamberContext";

export interface AuthSwitchProps {
  initialSignUp?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
  isModal?: boolean;
  className?: string;
}

/**
 * AnimatedTickCross:
 * Spring-physics morphing indicator that animates from a cross (✕) to a tick (✓)
 * when criteria or password matches are satisfied.
 */
function AnimatedTickCross({
  isValid,
  size = 13,
}: {
  isValid: boolean;
  size?: number;
}) {
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size + 8, height: size + 8 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isValid ? (
          <motion.div
            key="tick"
            initial={{ scale: 0.2, rotate: -70, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.2, rotate: 70, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 480,
              damping: 20,
            }}
            className="w-full h-full rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs ring-2 ring-emerald-500/30"
          >
            <motion.svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.polyline
                points="20 6 9 17 4 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              />
            </motion.svg>
          </motion.div>
        ) : (
          <motion.div
            key="cross"
            initial={{ scale: 0.2, rotate: 70, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.2, rotate: -70, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 480,
              damping: 24,
            }}
            className="w-full h-full rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shadow-xs ring-1 ring-red-400/50"
          >
            <motion.svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.18 }}
              />
              <motion.line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.18, delay: 0.05 }}
              />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * CriteriaTile:
 * Clear, highly legible, well-defined card tile showing requirement status with animated cross-to-tick.
 */
function CriteriaTile({
  label,
  sublabel,
  met,
}: {
  label: string;
  sublabel?: string;
  met: boolean;
}) {
  return (
    <motion.div
      layout
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 border ${
        met
          ? "bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500/50 shadow-xs"
          : "bg-white/95 dark:bg-[#23201d] border-neutral-300 dark:border-neutral-700 shadow-2xs"
      }`}
    >
      <div className="shrink-0 flex items-center justify-center">
        <AnimatedTickCross isValid={met} size={12} />
      </div>
      <div className="flex flex-col min-w-0">
        <span
          className={`text-[12px] font-semibold leading-tight transition-colors duration-200 ${
            met
              ? "text-emerald-900 dark:text-emerald-200"
              : "text-neutral-800 dark:text-neutral-100"
          }`}
        >
          {label}
        </span>
        {sublabel && (
          <span
            className={`text-[10px] leading-tight transition-colors duration-200 mt-0.5 ${
              met
                ? "text-emerald-700/80 dark:text-emerald-300/80 font-medium"
                : "text-neutral-500 dark:text-neutral-400 font-medium"
            }`}
          >
            {sublabel}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function AuthSwitch({
  initialSignUp = false,
  onSuccess,
  onClose,
  isModal = false,
  className = "",
}: AuthSwitchProps) {
  const router = useRouter();
  const { login, signupLawyer, addToast } = useChamber();

  const [isSignUp, setIsSignUp] = useState(initialSignUp);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const [signUpBarEnrollment, setSignUpBarEnrollment] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  // Option 1 Password Security Criteria:
  // 1. Minimum 8 characters
  // 2. Uppercase and lowercase letters
  // 3. At least one number
  // 4. At least one special symbol
  const passCriteria = {
    length: signUpPassword.length >= 8,
    upperLower: /[A-Z]/.test(signUpPassword) && /[a-z]/.test(signUpPassword),
    number: /[0-9]/.test(signUpPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(signUpPassword),
  };

  const isPasswordSafe =
    passCriteria.length &&
    passCriteria.upperLower &&
    passCriteria.number &&
    passCriteria.special;

  // Real-time password match verification status
  const confirmPasswordTouched = signUpConfirmPassword.length > 0;
  const passwordsMatch = confirmPasswordTouched && signUpConfirmPassword === signUpPassword;
  const passwordsMismatch = confirmPasswordTouched && signUpConfirmPassword !== signUpPassword;

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      addToast("Please provide both email and password.", "error");
      return;
    }
    setSigningIn(true);
    try {
      const success = await login(signInEmail, signInPassword);
      setSigningIn(false);
      if (success) {
        addToast("Welcome back to your chamber diary.", "success");
        onSuccess?.();
        onClose?.();
        router.push("/dashboard");
      } else {
        addToast("Invalid credentials. Please verify your email & password.", "error");
      }
    } catch {
      setSigningIn(false);
      addToast("Authentication service unavailable. Please retry.", "error");
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim()) {
      addToast("Advocate Full Name is mandatory (*)", "error");
      return;
    }
    if (!signUpEmail.trim()) {
      addToast("Email ID is mandatory (*)", "error");
      return;
    }
    if (!signUpPassword) {
      addToast("Password is mandatory (*)", "error");
      return;
    }
    if (!signUpConfirmPassword) {
      addToast("Confirm password is mandatory (*)", "error");
      return;
    }
    if (!isPasswordSafe) {
      if (!passCriteria.length) {
        addToast("Security Requirement: Password must be at least 8 characters.", "error");
      } else if (!passCriteria.upperLower) {
        addToast("Security Requirement: Password must contain both UPPERCASE and lowercase letters.", "error");
      } else if (!passCriteria.number) {
        addToast("Security Requirement: Password must include at least one number (0-9).", "error");
      } else if (!passCriteria.special) {
        addToast("Security Requirement: Password must include at least one special symbol (!@#$).", "error");
      }
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      addToast("Passwords do not match. Please verify your confirm password.", "error");
      return;
    }
    setSigningUp(true);
    try {
      const success = await signupLawyer({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        barEnrollment: signUpBarEnrollment.trim() || undefined,
        chamberName: `Chambers of ${signUpName}`,
        primaryCourt: "High Court of Delhi",
      });
      setSigningUp(false);
      if (success) {
        addToast("Chamber successfully commissioned! Welcome, Counsel.", "success");
        onSuccess?.();
        onClose?.();
        router.push("/dashboard");
      } else {
        addToast("Enrolment registration failed. Please review details.", "error");
      }
    } catch {
      setSigningUp(false);
      addToast("Registration service error. Please retry.", "error");
    }
  };

  return (
    <div
      className={`auth-switch-root ${isModal ? "modal-mode" : "standalone"} ${className}`}
    >
      <style>{`
        .auth-switch-root,
        .auth-switch-root * {
          box-sizing: border-box;
        }

        .auth-switch-root {
          font-family: var(--font-body, 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .auth-switch-root.standalone {
          min-height: 100vh;
          padding: 24px 16px;
          background: radial-gradient(circle at 10% 20%, #faf8f3 0%, #f3eee3 60%, #e6dfcf 100%);
        }

        :global(.dark) .auth-switch-root.standalone {
          background: radial-gradient(circle at 10% 20%, #1a1815 0%, #111111 60%, #080706 100%);
        }

        .auth-switch-root.modal-mode {
          min-height: auto;
          padding: 0;
          background: transparent;
        }

        .auth-switch-container {
          position: relative;
          width: 100%;
          max-width: 900px;
          height: 670px;
          background: #ffffff;
          border-radius: 28px;
          border: 1px solid rgba(17, 17, 17, 0.12);
          box-shadow: 0 30px 70px -15px rgba(17, 17, 17, 0.25), 0 10px 25px -5px rgba(217, 84, 30, 0.08);
          overflow: hidden;
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        :global(.dark) .auth-switch-container {
          background: #171717;
          border: 1px solid rgba(243, 238, 227, 0.15);
          box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 10px 30px -5px rgba(217, 84, 30, 0.15);
        }

        .as-forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .as-signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        .as-form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0.8rem 3.5rem 0.6rem 3.5rem;
          transition: all 0.2s 0.7s;
          overflow: visible;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
          width: 100%;
        }

        .as-form.as-sign-up-form {
          opacity: 0;
          z-index: 1;
          pointer-events: none;
        }

        .as-form.as-sign-in-form {
          opacity: 1;
          z-index: 2;
          pointer-events: all;
        }

        .as-brand-tag {
          font-family: 'Clagista', cursive, sans-serif;
          color: #d9541e;
          font-size: 2.15rem;
          line-height: 1.35;
          margin-bottom: 2px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          padding: 4px 14px;
        }

        .as-brand-tag span {
          display: inline-block;
          line-height: 1.3;
          padding: 0.1em 0.28em 0.2em 0.14em;
          overflow: visible;
        }

        .as-title {
          font-family: 'Cinzel', serif;
          font-size: 1.65rem;
          color: #111111;
          margin-bottom: 3px;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-align: center;
        }

        :global(.dark) .as-title {
          color: #f3eee3;
        }

        .as-subtitle {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-size: 0.88rem;
          color: rgba(17, 17, 17, 0.65);
          margin-bottom: 10px;
          text-align: center;
        }

        :global(.dark) .as-subtitle {
          color: rgba(243, 238, 227, 0.65);
        }

        .as-input-field {
          max-width: 380px;
          width: 100%;
          background-color: #f7f4ec;
          border: 1px solid rgba(17, 17, 17, 0.12);
          margin: 3px 0;
          height: 44px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          padding: 0 0.85rem;
          gap: 0.6rem;
          position: relative;
          transition: all 0.25s ease;
        }

        :global(.dark) .as-input-field {
          background-color: #22201e;
          border: 1px solid rgba(243, 238, 227, 0.14);
        }

        .as-input-field:focus-within {
          background-color: #ffffff;
          border-color: #d9541e;
          box-shadow: 0 0 0 3px rgba(217, 84, 30, 0.18);
        }

        :global(.dark) .as-input-field:focus-within {
          background-color: #282522;
          border-color: #d9541e;
          box-shadow: 0 0 0 3px rgba(217, 84, 30, 0.25);
        }

        .as-input-field.is-valid {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important;
        }

        .as-input-field.is-invalid {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
        }

        .as-input-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d9541e;
          flex-shrink: 0;
          width: 20px;
          transition: 0.3s;
        }

        .as-input-action {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .as-input-eye-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: rgba(17, 17, 17, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        :global(.dark) .as-input-eye-btn {
          color: rgba(243, 238, 227, 0.45);
        }

        .as-input-eye-btn:hover {
          color: #d9541e;
        }

        .as-input-field input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 500;
          font-size: 0.88rem;
          color: #111111;
          flex: 1;
          min-width: 0;
          padding: 0;
        }

        :global(.dark) .as-input-field input {
          color: #f3eee3;
        }

        .as-input-field input::placeholder {
          color: rgba(17, 17, 17, 0.4);
          font-weight: 400;
          font-size: 0.84rem;
        }

        :global(.dark) .as-input-field input::placeholder {
          color: rgba(243, 238, 227, 0.4);
        }

        .as-btn {
          width: 100%;
          max-width: 380px;
          background-color: #d9541e;
          border: none;
          outline: none;
          height: 46px;
          border-radius: 9999px;
          color: #ffffff;
          font-family: 'Cinzel', serif;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.06em;
          margin: 10px 0 6px 0;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 20px -4px rgba(217, 84, 30, 0.45);
        }

        .as-btn:hover:not(:disabled) {
          background-color: #bf4513;
          transform: translateY(-2px);
          box-shadow: 0 12px 26px -4px rgba(217, 84, 30, 0.55);
        }

        .as-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .as-panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .as-panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .as-left-panel {
          pointer-events: all;
          padding: 3rem 16% 2.5rem 12%;
        }

        .as-right-panel {
          pointer-events: none;
          padding: 3rem 12% 2.5rem 16%;
        }

        .as-panel .as-content {
          color: #f3eee3;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
          max-width: 340px;
        }

        .as-panel h3 {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          line-height: 1.18;
          font-size: 1.55rem;
          margin-bottom: 8px;
          color: #f3eee3;
          letter-spacing: -0.01em;
        }

        .as-panel p {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1rem;
          line-height: 1.55;
          padding: 0.5rem 0 1.1rem 0;
          color: rgba(243, 238, 227, 0.9);
        }

        .as-btn.transparent {
          margin: 0 auto;
          background: none;
          border: 2px solid rgba(243, 238, 227, 0.85);
          color: #f3eee3;
          width: 165px;
          height: 42px;
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: none;
        }

        .as-btn.transparent:hover {
          background: rgba(243, 238, 227, 0.15);
          border-color: #ffffff;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .as-right-panel .as-content {
          transform: translateX(800px);
        }

        .auth-switch-container.sign-up-mode:before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .auth-switch-container.sign-up-mode .as-left-panel .as-content {
          transform: translateX(-800px);
        }

        .auth-switch-container.sign-up-mode .as-signin-signup {
          left: 25%;
        }

        .auth-switch-container.sign-up-mode .as-form.as-sign-up-form {
          opacity: 1;
          z-index: 2;
          pointer-events: all;
        }

        .auth-switch-container.sign-up-mode .as-form.as-sign-in-form {
          opacity: 0;
          z-index: 1;
          pointer-events: none;
        }

        .auth-switch-container.sign-up-mode .as-right-panel .as-content {
          transform: translateX(0%);
        }

        .auth-switch-container.sign-up-mode .as-left-panel {
          pointer-events: none;
        }

        .auth-switch-container.sign-up-mode .as-right-panel {
          pointer-events: all;
        }

        .auth-switch-container:before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: linear-gradient(-45deg, #111111 0%, #1c1815 45%, #d9541e 100%);
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.35);
        }

        :global(.dark) .auth-switch-container:before {
          background: linear-gradient(-45deg, #0e0d0b 0%, #1a1714 42%, #d9541e 100%);
        }

        .as-modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 50;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(17, 17, 17, 0.08);
          border: 1px solid rgba(17, 17, 17, 0.15);
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        :global(.dark) .as-modal-close {
          background: rgba(243, 238, 227, 0.1);
          border: 1px solid rgba(243, 238, 227, 0.2);
          color: #f3eee3;
        }

        .as-modal-close:hover {
          background: #d9541e;
          color: #ffffff;
          border-color: #d9541e;
          transform: rotate(90deg);
        }

        @media (max-width: 870px) {
          .auth-switch-container {
            min-height: 820px;
            height: 96vh;
            max-height: 920px;
            overflow-y: auto;
          }
          .as-signin-signup {
            width: 100%;
            top: 92%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }
          .as-signin-signup,
          .auth-switch-container.sign-up-mode .as-signin-signup {
            left: 50%;
          }
          .as-panels-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }
          .as-panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2rem 8%;
            grid-column: 1 / 2;
          }
          .as-right-panel {
            grid-row: 3 / 4;
          }
          .as-left-panel {
            grid-row: 1 / 2;
          }
          .as-panel .as-content {
            padding-right: 5%;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.8s;
          }
          .as-panel h3 {
            font-size: 1.22rem;
            margin-bottom: 2px;
          }
          .as-panel p {
            font-size: 0.82rem;
            padding: 0.2rem 0 0.5rem 0;
          }
          .as-btn.transparent {
            width: 135px;
            height: 36px;
            font-size: 0.72rem;
          }
          .auth-switch-container:before {
            width: 1500px;
            height: 1500px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }
          .auth-switch-container.sign-up-mode:before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }
          .auth-switch-container.sign-up-mode .as-left-panel .as-content {
            transform: translateY(-300px);
          }
          .auth-switch-container.sign-up-mode .as-right-panel .as-content {
            transform: translateY(0px);
          }
          .as-right-panel .as-content {
            transform: translateY(300px);
          }
          .auth-switch-container.sign-up-mode .as-signin-signup {
            top: 8%;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 570px) {
          .as-form {
            padding: 0 1.25rem;
          }
          .as-panel .as-content {
            padding: 0.25rem 0.5rem;
          }
          .as-panel h3 {
            font-size: 1.05rem;
          }
          .as-panel p {
            display: none;
          }
          .as-title {
            font-size: 1.35rem;
          }
          .as-input-field {
            height: 44px;
            margin: 4px 0;
          }
        }
      `}</style>

      <div className={isSignUp ? "auth-switch-container sign-up-mode" : "auth-switch-container"}>
        {/* Optional Close Button in Modal Mode */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="as-modal-close"
            aria-label="Close authentication panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="as-forms-container">
          <div className="as-signin-signup">
            {/* 1. SIGN IN FORM */}
            <form className="as-form as-sign-in-form" onSubmit={handleSignIn}>
              <div className="as-brand-tag select-none">
                <span className="font-clagista">LexDaily</span>
              </div>
              <h2 className="as-title">Sign In</h2>
              <p className="as-subtitle">Authenticate credentials to enter private chamber diary</p>

              <div className="as-input-field">
                <div className="as-input-icon">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email ID"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="as-input-field">
                <div className="as-input-icon">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showSignInPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <div className="as-input-action">
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="as-input-eye-btn"
                    tabIndex={-1}
                    aria-label={showSignInPassword ? "Hide password" : "Show password"}
                  >
                    {showSignInPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={signingIn}
                className="as-btn solid"
              >
                <span>{signingIn ? "Signing In..." : "Sign In"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* 2. SIGN UP FORM */}
            <form className="as-form as-sign-up-form" onSubmit={handleSignUp}>
              <div className="as-brand-tag select-none">
                <span className="font-clagista">LexDaily</span>
              </div>
              <h2 className="as-title">Sign Up</h2>
              <p className="as-subtitle">Solely for advocates enrolled under Bar Council of India</p>

              <div className="as-input-field">
                <div className="as-input-icon">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Advocate Full Name *"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div className="as-input-field">
                <div className="as-input-icon">
                  <Scale className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Bar Enrollment No. (Optional)"
                  value={signUpBarEnrollment}
                  onChange={(e) => setSignUpBarEnrollment(e.target.value)}
                />
              </div>

              <div className="as-input-field">
                <div className="as-input-icon">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email ID *"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              {/* Password field with real-time Option 1 security verification */}
              <div className={`as-input-field ${
                signUpPassword.length > 0
                  ? isPasswordSafe
                    ? "is-valid"
                    : "is-invalid"
                  : ""
              }`}>
                <div className="as-input-icon">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showSignUpPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password *"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  autoComplete="new-password"
                />
                <div className="as-input-action">
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="as-input-eye-btn"
                    tabIndex={-1}
                    aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                  >
                    {showSignUpPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {signUpPassword.length > 0 && (
                    <div className="flex items-center gap-1 select-none">
                      <AnimatedTickCross isValid={isPasswordSafe} size={11} />
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider hidden xs:inline ${
                          isPasswordSafe
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-500"
                        }`}
                      >
                        {isPasswordSafe ? "Secure" : "Safe Pass"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Real-time Option 1 Security Criteria Panel with animated cross-to-tick */}
              <AnimatePresence>
                {(passwordFocused || signUpPassword.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.98 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="w-full max-w-[380px] overflow-hidden my-1.5"
                  >
                    <div className="p-2.5 rounded-2xl bg-[#f7f4ec] dark:bg-[#1f1d1a] border border-neutral-300 dark:border-neutral-700/80 shadow-xs">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[10px] font-cinzel font-bold tracking-[0.16em] uppercase text-neutral-600 dark:text-neutral-400">
                          Password Criteria
                        </span>
                        <span
                          className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                            isPasswordSafe
                              ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {isPasswordSafe
                            ? "✓ Safe Combination"
                            : `${[passCriteria.length, passCriteria.upperLower, passCriteria.number, passCriteria.special].filter(Boolean).length}/4 Met`}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <CriteriaTile
                          label="8+ Characters"
                          sublabel="Minimum length"
                          met={passCriteria.length}
                        />
                        <CriteriaTile
                          label="Upper & Lower"
                          sublabel="A-Z and a-z"
                          met={passCriteria.upperLower}
                        />
                        <CriteriaTile
                          label="Numbers"
                          sublabel="0 through 9"
                          met={passCriteria.number}
                        />
                        <CriteriaTile
                          label="Special Symbol"
                          sublabel="e.g. ! @ # $"
                          met={passCriteria.special}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirm password field with real-time match verification */}
              <div className={`as-input-field ${
                confirmPasswordTouched
                  ? passwordsMatch
                    ? "is-valid"
                    : "is-invalid"
                  : ""
              }`}>
                <div className="as-input-icon">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showSignUpConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm password *"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <div className="as-input-action">
                  <button
                    type="button"
                    onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                    className="as-input-eye-btn"
                    tabIndex={-1}
                    aria-label={showSignUpConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showSignUpConfirmPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {confirmPasswordTouched && (
                    <div className="flex items-center gap-1 select-none">
                      <AnimatedTickCross isValid={passwordsMatch} size={11} />
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider hidden xs:inline ${
                          passwordsMatch
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-500"
                        }`}
                      >
                        {passwordsMatch ? "Match" : "Mismatch"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={signingUp}
                className="as-btn"
              >
                <span>{signingUp ? "Signing Up..." : "Sign Up"}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* 3. SLIDING PANELS */}
        <div className="as-panels-container">
          <div className="as-panel as-left-panel">
            <div className="as-content">
              <h3>New Chamber?</h3>
              <p>
                Initialize an encrypted digital operating system for your legal practice. Cause lists, CNR dockets, and statutory limitation radar.
              </p>
              <button
                type="button"
                className="as-btn transparent"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="as-panel as-right-panel">
            <div className="as-content">
              <h3>Already Enrolled?</h3>
              <p>
                Welcome back, Counsel. Authenticate your chamber master key to access confidential daily hearings and court dockets.
              </p>
              <button
                type="button"
                className="as-btn transparent"
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
