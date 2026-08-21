import React, { useCallback, useReducer, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import {
  INITIAL_CORPORATE_LOGIN_STATE,
  type CorporateLoginFormState,
} from '../../../../types/corporateLogin';
import {
  authenticateCorporate,
  CORPORATE_LOGIN_SUCCESS_DELAY_MS,
  validateLoginFields,
} from '../../../../services/corporateLoginService';
import {
  CORPORATE_DEMO_HINT,
  CORPORATE_DEMO_COMPANY_ID,
} from '../../../../data/corporateAuthMock';
import { CorporateLoginHeader } from './CorporateLoginHeader';
import { SecureInput } from './SecureInput';
import { PasswordInput } from './PasswordInput';
import { LoginButton } from './LoginButton';
import { SecurityInfoCard } from './SecurityInfoCard';
import { HelpBottomSheet } from './HelpBottomSheet';

type LoginAction =
  | { type: 'SET_CORPORATE_ID'; value: string }
  | { type: 'SET_USER_ID'; value: string }
  | { type: 'SET_PASSWORD'; value: string }
  | { type: 'TOGGLE_PASSWORD_VISIBILITY' }
  | { type: 'SET_FOCUSED_FIELD'; field: CorporateLoginFormState['focusedField'] }
  | { type: 'SET_FIELD_ERROR'; field: CorporateLoginFormState['fieldError']; message: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_STATUS'; status: CorporateLoginFormState['status'] }
  | { type: 'SET_SHOW_HELP'; show: boolean };

function loginReducer(
  state: CorporateLoginFormState,
  action: LoginAction
): CorporateLoginFormState {
  switch (action.type) {
    case 'SET_CORPORATE_ID':
      return { ...state, corporateId: action.value };
    case 'SET_USER_ID':
      return { ...state, userId: action.value };
    case 'SET_PASSWORD':
      return { ...state, password: action.value };
    case 'TOGGLE_PASSWORD_VISIBILITY':
      return { ...state, showPassword: !state.showPassword };
    case 'SET_FOCUSED_FIELD':
      return { ...state, focusedField: action.field };
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        fieldError: action.field,
        fieldErrorMessage: action.message,
        status: 'idle',
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        fieldError: 'none',
        fieldErrorMessage: '',
        status: 'idle',
      };
    case 'SET_STATUS':
      return { ...state, status: action.status };
    case 'SET_SHOW_HELP':
      return { ...state, showHelp: action.show };
    default:
      return state;
  }
}

export const CorporateLogin: React.FC = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    addToast,
    setBankingType,
    clearSessionExpired,
    completeCorporateAuthentication,
    isSessionExpired,
  } = useBanking();

  const [state, dispatch] = useReducer(loginReducer, INITIAL_CORPORATE_LOGIN_STATE);

  const isLoading = state.status === 'loading';
  const isSuccess = state.status === 'success';
  const showInvalidCredentials = state.status === 'invalid_credentials';

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading || isSuccess) return;

      dispatch({ type: 'CLEAR_ERRORS' });

      const validation = validateLoginFields({
        corporateId: state.corporateId,
        userId: state.userId,
        password: state.password,
      });

      if (validation.valid === false) {
        dispatch({
          type: 'SET_FIELD_ERROR',
          field: validation.field,
          message: validation.message,
        });
        return;
      }

      dispatch({ type: 'SET_STATUS', status: 'loading' });

      const authenticated = await authenticateCorporate({
        corporateId: state.corporateId,
        userId: state.userId,
        password: state.password,
      });

      if (!authenticated) {
        dispatch({ type: 'SET_STATUS', status: 'invalid_credentials' });
        return;
      }

      dispatch({ type: 'SET_STATUS', status: 'success' });
      setBankingType('corporate');
      clearSessionExpired();

      setTimeout(() => {
        completeCorporateAuthentication(false, authenticated);
      }, CORPORATE_LOGIN_SUCCESS_DELAY_MS);
    },
    [
      isLoading,
      isSuccess,
      state.corporateId,
      state.userId,
      state.password,
      setBankingType,
      clearSessionExpired,
      completeCorporateAuthentication,
    ]
  );

  const handleFieldChange = () => {
    if (state.fieldError !== 'none' || showInvalidCredentials) {
      dispatch({ type: 'CLEAR_ERRORS' });
    }
  };

  const scrollFieldIntoView = (element: HTMLElement | null) => {
    if (!element) return;
    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <div className="min-h-dvh bg-[#F7F9FC] dark:bg-slate-950 text-[#111827] dark:text-white flex flex-col font-['Inter',sans-serif] safe-top safe-bottom max-w-107.5 mx-auto w-full">
      <CorporateLoginHeader
        onHelpClick={() => dispatch({ type: 'SET_SHOW_HELP', show: true })}
      />

      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center px-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#16A34A]/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-[#16A34A]" />
              </div>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">
                Credentials verified
              </p>
              <p className="text-[13px] text-[#667085] mt-1">
                Redirecting to verification...
              </p>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center px-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0B5CAB]/10 flex items-center justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-[#0B5CAB]/30 border-t-[#0B5CAB] rounded-full"
                />
              </div>
              <p className="text-[15px] font-semibold text-[#111827] dark:text-white">
                Signing you in...
              </p>
              <p className="text-[12px] text-[#667085] mt-1">
                Verifying your credentials securely
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex-1 flex flex-col"
            >
              {isSessionExpired && (
                <div className="mx-4 mb-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#111827] dark:text-white">
                      Session expired
                    </p>
                    <p className="text-[12px] text-[#667085] mt-0.5">
                      For your security, please sign in again.
                    </p>
                  </div>
                </div>
              )}

              <section className="px-4 mb-5">
                <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white tracking-tight leading-tight">
                  Welcome to Corporate Banking
                </h2>
                <p className="text-[14px] text-[#667085] dark:text-slate-400 mt-1.5 leading-relaxed">
                  Securely access your business accounts, payments and approvals.
                </p>
                <p className="mt-3 text-[11px] font-medium text-[#0B5CAB] dark:text-blue-400 bg-[#0B5CAB]/8 dark:bg-[#0B5CAB]/15 rounded-xl px-3 py-2">
                  {CORPORATE_DEMO_HINT}
                </p>
              </section>

              {showInvalidCredentials && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-4 mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40"
                  role="alert"
                >
                  <p className="text-sm font-semibold text-[#DC2626]">
                    Unable to sign in
                  </p>
                  <p className="text-[12px] text-[#667085] dark:text-slate-400 mt-0.5">
                    Please check your credentials and try again.
                  </p>
                </motion.div>
              )}

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="px-4 space-y-4 flex-1"
                noValidate
              >
                <SecureInput
                  label="Corporate ID"
                  value={state.corporateId}
                  onChange={(value) => {
                    dispatch({ type: 'SET_CORPORATE_ID', value });
                    handleFieldChange();
                  }}
                  placeholder={CORPORATE_DEMO_COMPANY_ID}
                  error={
                    state.fieldError === 'corporate_id'
                      ? state.fieldErrorMessage
                      : undefined
                  }
                  isFocused={state.focusedField === 'corporate_id'}
                  onFocus={(e) => {
                    dispatch({ type: 'SET_FOCUSED_FIELD', field: 'corporate_id' });
                    scrollFieldIntoView(e.currentTarget);
                  }}
                  onBlur={() =>
                    dispatch({ type: 'SET_FOCUSED_FIELD', field: null })
                  }
                  autoComplete="username"
                />

                <SecureInput
                  label="User ID"
                  value={state.userId}
                  onChange={(value) => {
                    dispatch({ type: 'SET_USER_ID', value });
                    handleFieldChange();
                  }}
                  placeholder="C001"
                  error={
                    state.fieldError === 'user_id'
                      ? state.fieldErrorMessage
                      : undefined
                  }
                  isFocused={state.focusedField === 'user_id'}
                  onFocus={(e) => {
                    dispatch({ type: 'SET_FOCUSED_FIELD', field: 'user_id' });
                    scrollFieldIntoView(e.currentTarget);
                  }}
                  onBlur={() =>
                    dispatch({ type: 'SET_FOCUSED_FIELD', field: null })
                  }
                  autoComplete="username"
                />

                <PasswordInput
                  value={state.password}
                  onChange={(value) => {
                    dispatch({ type: 'SET_PASSWORD', value });
                    handleFieldChange();
                  }}
                  showPassword={state.showPassword}
                  onToggleVisibility={() =>
                    dispatch({ type: 'TOGGLE_PASSWORD_VISIBILITY' })
                  }
                  error={
                    state.fieldError === 'password'
                      ? state.fieldErrorMessage
                      : undefined
                  }
                  isFocused={state.focusedField === 'password'}
                  onFocus={(e) => {
                    dispatch({ type: 'SET_FOCUSED_FIELD', field: 'password' });
                    scrollFieldIntoView(e.currentTarget);
                  }}
                  onBlur={() =>
                    dispatch({ type: 'SET_FOCUSED_FIELD', field: null })
                  }
                />

                <div className="pt-1">
                  <LoginButton isLoading={isLoading} disabled={isLoading} />
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/corporate/forgot-password')}
                  className="w-full py-3 text-sm font-medium text-[#0B5CAB] dark:text-blue-400 min-h-11"
                >
                  Forgot Password?
                </button>
              </form>

              <SecurityInfoCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <HelpBottomSheet
        isOpen={state.showHelp}
        onClose={() => dispatch({ type: 'SET_SHOW_HELP', show: false })}
        onContactSupport={() =>
          addToast({
            type: 'info',
            title: 'Contact Support',
            message: 'Corporate banking support: 1800-202-APEX (24/7).',
          })
        }
        onLoginHelp={() =>
          addToast({
            type: 'info',
            title: 'Login Help',
            message: 'Use your Corporate ID and password provided by your administrator.',
          })
        }
        onSecurityInfo={() =>
          addToast({
            type: 'info',
            title: 'Security Information',
            message: 'All sessions use encrypted authentication and device verification.',
          })
        }
      />
    </div>
  );
};
