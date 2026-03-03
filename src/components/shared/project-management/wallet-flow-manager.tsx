/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CenterModal, Delete, SideModal } from '@/components/shared';
import {
  useSendWalletOtpMutation,
  useVerifyWalletOtpMutation,
  useSetWalletPinMutation,
  useAddWithdrawFundsMutation,
  useDeleteBeneficiaryMutation
} from '@/services/paymentService';
import { errorToast, successToast } from '@/services';
import { getErrorMessage } from '@/utils';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { numberFormat } from '@/lib/numbers';
import { EmptyTable, SmallAvatar, SmallHome } from '@/app/assets/svgs';
import Success from '@/app/assets/pngs/success.png';
import DeleteIcon from '@/app/assets/pngs/delete.png';

type FlowStep =
  | 'SETUP_PROMPT'
  | 'OTP_INPUT'
  | 'PIN_SETUP'
  | 'PIN_CONFIRM_SET'
  | 'PIN_SUCCESS'
  | 'WITHDRAW_DETAILS'
  | 'TRANSACTION_PIN_ENTRY'
  | 'SUCCESS';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: any;
  beneficiaries: any[];
  onAddAccount: () => void;
  refetchBeneficiaries: () => void;
  refetchWallet: () => void;
}

export function WithdrawalFlowManager({isOpen,onClose,wallet,beneficiaries,onAddAccount,refetchBeneficiaries,refetchWallet}: IProps) {

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const transactionPinRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [step, setStep] = useState<FlowStep>('SETUP_PROMPT');
  const [otpArray, setOtpArray] = useState(['', '', '', '']);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinArray, setPinArray] = useState(['', '', '', '']);
  const [confirmPinArray, setConfirmPinArray] = useState(['', '', '', '']);
  const [withdrawData, setWithdrawData] = useState({ amount: '', beneficiary: null as any,});
  const [transactionPin, setTransactionPin] = useState('');
  const [transactionPinArray, setTransactionPinArray] = useState(['', '', '', '']);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [deletedAccounts, setDeletedAccounts] = useState<string[]>([]);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  const [sendOtp, { isLoading: isSendingOtp }] = useSendWalletOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyWalletOtpMutation();
  const [setWalletPin, { isLoading: isSettingPin }] = useSetWalletPinMutation();
  const [withdraw, { isLoading: isWithdrawing }] = useAddWithdrawFundsMutation();
  const [triggerDelete, { isLoading }] = useDeleteBeneficiaryMutation();

  const otpString = otpArray.join('');

  useEffect(() => {
    if (isOpen) {
      setStep(wallet?.isWalletPinSetup ? 'WITHDRAW_DETAILS' : 'SETUP_PROMPT');
      resetStates();
    }
  }, [isOpen, wallet?.isWalletPinSetup]);

   useEffect(() => {
    if (!isOpen) setDeletedAccounts([]);
  }, [isOpen]);

  const handleOtpChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue && value !== '') return;

    const newOtp = [...otpArray];
    newOtp[index] = cleanValue.substring(cleanValue.length - 1);
    setOtpArray(newOtp);

    if (cleanValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePinChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue && value !== '') return;
    const next = [...pinArray];
    next[index] = cleanValue.substring(cleanValue.length - 1);
    setPinArray(next);
    setNewPin(next.join(''));
    if (cleanValue && index < 3) pinRefs.current[index + 1]?.focus();
  };

  const handleTransactionPinChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue && value !== '') return;
    const next = [...transactionPinArray];
    next[index] = cleanValue.substring(cleanValue.length - 1);
    setTransactionPinArray(next);
    setTransactionPin(next.join(''));
    if (cleanValue && index < 3) transactionPinRefs.current[index + 1]?.focus();
  };

  const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !pinArray[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handlePinPaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').replace(/\D/g, '').split('');
    if (data.length === 4) {
      setPinArray(data.slice(0, 4));
      setNewPin(data.slice(0, 4).join(''));
      pinRefs.current[3]?.focus();
    }
  };

  const handleConfirmPinChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue && value !== '') return;
    const next = [...confirmPinArray];
    next[index] = cleanValue.substring(cleanValue.length - 1);
    setConfirmPinArray(next);
    setConfirmPin(next.join(''));
    if (cleanValue && index < 3) confirmPinRefs.current[index + 1]?.focus();
  };

  const handleConfirmPinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !confirmPinArray[index] && index > 0) {
      confirmPinRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirmPinPaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').replace(/\D/g, '').split('');
    if (data.length === 4) {
      setConfirmPinArray(data.slice(0, 4));
      setConfirmPin(data.slice(0, 4).join(''));
      confirmPinRefs.current[3]?.focus();
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await sendOtp().unwrap();
      if (response?.isSuccess) {
        successToast(response?.message || 'OTP sent to your email');
        setStep('OTP_INPUT');
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      errorToast(getErrorMessage(error) || 'Something went wrong');
    }
  };

  const handleVerifyOtp = async (code: string) => {
    try {
      const response = await verifyOtp({ otp: code }).unwrap();
      if (response?.isSuccess) {
        successToast(response?.message || 'OTP verified successfully');
        setStep('PIN_SETUP');
      } else {
        errorToast(response?.message || 'Invalid OTP, please try again');
      }
    } catch (e) {
      errorToast(getErrorMessage(e));
    }
  };

  const handleSetPinFinal = async () => {
    if (newPin !== confirmPin) return errorToast('PINs do not match');
    try {
      const response = await setWalletPin({ pin: newPin, confirmPin }).unwrap();
      if (response?.isSuccess) {
        successToast(response?.message || 'Wallet PIN set successfully');
        await refetchWallet();
        setStep('PIN_SUCCESS');
      } else {
        errorToast(response?.message || 'Failed to set PIN, please try again');
      }
    } catch (e) {
      errorToast(getErrorMessage(e));
    }
  };

  const handleWithdrawal = async () => {
    try {
      const response = await withdraw({
        beneficiaryAccountNumber: withdrawData.beneficiary.accountNumber,
        amount: Number(withdrawData.amount),
        walletId: wallet?.accountNumber,
        pin: transactionPin,
      }).unwrap();
      if (response?.isSuccess) {
        successToast(response?.message || 'Withdrawal successful');
        await refetchWallet();
        setStep('SUCCESS');
      } else {
        errorToast(response?.message || 'Withdrawal failed, please try again');
      }
    } catch (e) {
      errorToast(getErrorMessage(e));
    }
  };

  const handleDelete = async (accountNumber?: string | null) => {
    if (!accountNumber) {
      errorToast('Invalid account number');
      return;
    }
    try {
      const response = await triggerDelete(accountNumber).unwrap();
      if (response?.isSuccess) {
        setDeletedAccounts((prev) => [...prev, accountNumber]);
        successToast(response?.message || 'Account deleted successfully');
        setIsDecisionModalOpen(false);
        refetchBeneficiaries();
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      errorToast(getErrorMessage(error) || 'Something went wrong');
    }
  };

   const resetStates = () => {
    setOtpArray(['', '', '', '']);
    setNewPin('');
    setConfirmPin('');
    setPinArray(['', '', '', '']);
    setConfirmPinArray(['', '', '', '']);
    setTransactionPin('');
  };

  return (
    <>
      {/* Step 1: Setup Prompt */}
      <CenterModal
        isOpen={isOpen && step === 'SETUP_PROMPT'}
        onClose={onClose}
        headerImageType={2}
      >
        <div className="text-center py-">
          <div className="flex justify-center items-center mb-4">
            <EmptyTable />
          </div>
          <p className="font-bold text-[#262626]">
            No transaction PIN has been set
          </p>
          <p className="text-[#6D6D6D] mb-8 mt-2">
            Click “Setup PIN” button to get started
          </p>
          <Button
            className="w-full rounded-full bg-[#7B37F0] py-7 hover:bg-[#7B37F0]/90 "
            onClick={handleSendOtp}
            isLoading={isSendingOtp}
          >
            Setup PIN
          </Button>
        </div>
      </CenterModal>

      {/* Step 2: OTP Input */}
      <CenterModal
        isOpen={isOpen && step === 'OTP_INPUT'}
        onClose={onClose}
        headerImageType={2}
      >
        <div className="flex flex-col gap-10 px-2 pt-2 pb-4">
          <h3 className="text-[#262626] text-[16px] font-bold leading-[1.3] max-w-[350px]">
            To proceed, kindly enter the OTP sent to your email address
          </h3>

          <div className="flex justify-between gap-3">
            {otpArray.map((digit, index) => {
              const isActive = otpArray.findIndex((v) => v === '') === index || digit !== '';
              return (
                <div
                  key={index}
                  className={`w-[58.61px] h-[65.68px] flex items-center justify-center border-2 rounded-[10.1px] transition-all duration-200
                  ${isActive ? 'border-[#7B37F0]' : 'border-[#F2F4F7]'}
                `}
                >
                  <input
                    ref={(el) => {inputRefs.current[index] = el;}}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    autoFocus={index === 0}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full h-full text-center text-[32px] font-bold bg-transparent outline-none text-[#1D2939]"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-6 mt-2">
            <Button
              className={`w-full rounded-full h-[45px] text-lg font-bold transition-all duration-300  ${
                otpString.length === 4
                  ? 'bg-[#7B37F0] hover:bg-[#7B37F0]/90 text-white shadow-lg'
                  : 'bg-[#EAEAEA] text-[#98A2B3] cursor-not-allowed shadow-none'
              }`}
              disabled={otpString.length < 4 || isVerifyingOtp}
              onClick={() => handleVerifyOtp(otpString)}
              isLoading={isVerifyingOtp}
            >
              Proceed
            </Button>

            <div className="text-center">
              <button
                onClick={handleSendOtp}
                className="text-[#7B37F0] text-sm font-bold hover:underline decoration-2 underline-offset-4"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </CenterModal>

      {/* Step 3: Setup PIN */}
      <CenterModal
        isOpen={isOpen && step === 'PIN_SETUP'}
        onClose={onClose}
        headerImageType={2}
        title="Setup PIN"
        subtitle="Create a secure 4-digit PIN to confirm your transactions"
      >
        <div className="space-y-6">
          <div className="flex justify-between gap-3" onPaste={handlePinPaste}>
            {pinArray.map((digit, index) => (
              <div
                key={index}
                className={`w-[58.61px] h-[65.68px] flex items-center justify-center border-2 rounded-[10.1px] transition-all duration-200 ${
                  digit ? 'border-[#7B37F0]' : 'border-[#F2F4F7]'
                }`}
              >
                <input
                  ref={(el) => {pinRefs.current[index] = el;}}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handlePinKeyDown(e, index)}
                  className="w-full h-full text-center text-2xl font-bold bg-transparent outline-none"
                />
              </div>
            ))}
          </div>
          <Button
            className={`w-full rounded-full h-14 ${newPin.length === 4 ? 'bg-[#7B37F0] hover:bg-[#7B37F0]/90' : 'bg-gray-100 text-gray-400'}`}
            disabled={newPin.length < 4}
            onClick={() => setStep('PIN_CONFIRM_SET')}
          >
            Proceed
          </Button>
        </div>
      </CenterModal>

      {/* Step 4: Confirm PIN */}
      <CenterModal
        isOpen={isOpen && step === 'PIN_CONFIRM_SET'}
        onClose={() => setStep('PIN_SETUP')}
        headerImageType={2}
        title="Confirm PIN"
      >
        <div className="space-y-8">
          <div
            className="flex justify-between gap-3"
            onPaste={handleConfirmPinPaste}
          >
            {confirmPinArray.map((digit, index) => (
              <div
                key={index}
                className={`w-[58.61px] h-[65.68px] flex items-center justify-center border-2 rounded-[10.1px] transition-all duration-200 ${
                  digit ? 'border-[#7B37F0]' : 'border-[#F2F4F7]'
                }`}
              >
                <input
                  ref={(el) => {confirmPinRefs.current[index] = el;}}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleConfirmPinChange(e.target.value, index)}
                  onKeyDown={(e) => handleConfirmPinKeyDown(e, index)}
                  className="w-full h-full text-center text-2xl font-bold bg-transparent outline-none"
                />
              </div>
            ))}
          </div>
          <Button
            className={`w-full rounded-full h-14 ${confirmPin.length === 4 ? 'bg-[#7B37F0] hover:bg-[#7B37F0]/90' : 'bg-gray-100 text-gray-400'}`}
            disabled={confirmPin.length < 4 || isSettingPin}
            onClick={handleSetPinFinal}
            isLoading={isSettingPin}
          >
            Confirm Transaction PIN
          </Button>
        </div>
      </CenterModal>

      {/* Step 5: PIN Success */}
      <CenterModal isOpen={isOpen && step === 'PIN_SUCCESS'} onClose={onClose} headerImageType={0}>
        <div className="flex flex-col items-center py-10 gap-4 text-center">
          <div className="">
            <Image src={Success} className='w-[78px]' alt="success" unoptimized />
          </div>
          <h3 className="text-xl font-bold">
            Your transaction PIN has been set successfully
          </h3>
          <Button
            className="mt-6 w-full rounded-full bg-white hover:bg-[#7B37F0]/90 h-14 text-[#7B37F0] border border-[#7B37F0]"
            onClick={() => setStep('WITHDRAW_DETAILS')}
          >
            Proceed to make withdrawal
          </Button>
        </div>
      </CenterModal>

      {/* Step 6: Withdrawal Details */}
      <SideModal
        isOpen={isOpen && step === 'WITHDRAW_DETAILS'}
        onClose={onClose}
        title="Withdraw Funds"
        showFooter
        usebg
        footerChildren={
          <div className="p-4 w-full">
            <Button
              disabled={!withdrawData.amount || !withdrawData.beneficiary}
              className="w-full bg-[#7B37F0] hover:bg-[#7B37F0]/90 rounded-full h-14"
              onClick={() => setStep('TRANSACTION_PIN_ENTRY')}
            >
              Withdraw
            </Button>
          </div>
        }
      >
        <div className="space-y-8 mt-4">
          <Input
            placeholder="Withdrawal Amount"
            type="number"
            value={withdrawData.amount}
            onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
          />
          <p className="text-sm font-semibold -mt-6">
            {numberFormat(wallet?.availableBalance ?? 0)}
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Select Bank Account</p>
              <button
                className="text-[#7B37F0] flex items-center gap-1"
                onClick={onAddAccount}
              >
                <Plus size={16} /> Add Account
              </button>
            </div>
            {beneficiaries?.filter((item: any) => !deletedAccounts.includes(item.accountNumber))?.map((item: any) => (
              <div
                key={item.accountNumber}
                onClick={() => setWithdrawData({ ...withdrawData, beneficiary: item })}
                className={`p-4 border rounded cursor-pointer ${withdrawData.beneficiary?.accountNumber === item.accountNumber ? 'border-[#7B37F0] bg-[#F9F5FF]' : 'border-[#888888] bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xl text-[#333333]">
                    {item?.accountNumber}
                  </p>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDecisionModalOpen(true);
                      setAccountToDelete(item?.accountNumber);
                    }}
                    className="cursor-pointer"
                  >
                    <Delete />
                  </div>
                </div>
                <div className="text-[#262626] space-y-3 mt-5">
                  <p className="flex items-center gap-3">
                    <span>
                      <SmallHome />
                    </span>
                    {item?.bankName}
                  </p>
                  <p className="flex items-center gap-3">
                    <SmallAvatar />
                    {item?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SideModal>

      {/* Step 7: Transaction PIN Entry */}
      <CenterModal
        isOpen={isOpen && step === 'TRANSACTION_PIN_ENTRY'}
        onClose={() => setStep('WITHDRAW_DETAILS')}
        headerImageType={2}
        title="Enter your PIN"
      >
        <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="flex justify-between gap-3">
                {transactionPinArray.map((digit, index) => (
                  <div
                    key={index}
                    className={`w-[58.61px] h-[65.68px] flex items-center justify-center border-2 rounded-[10.1px] transition-all duration-200 ${
                      digit ? 'border-[#7B37F0]' : 'border-[#F2F4F7]'
                    }`}
                  >
                    <input
                      ref={(el) => {transactionPinRefs.current[index] = el;}}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      className="w-full h-full text-center text-2xl font-bold bg-transparent outline-none"
                      onChange={(e) => handleTransactionPinChange(e.target.value, index)}
                    />
                  </div>
                ))}
              </div>
              <div className="w-full max-w-[700px] mt-10 mb-6">
                <div className="h-[1px] bg-[#E7E7E7] w-full rounded" />
              </div>
            </div>
          <Button
            className="w-full bg-[#7B37F0] hover:bg-[#7B37F0]/90 rounded-full h-14 mt-6"
            isLoading={isWithdrawing}
            onClick={handleWithdrawal}
            disabled={transactionPin.length < 4}
          >
            Confirm Transaction PIN
          </Button>
        </div>
      </CenterModal>

      {/* Step 8: Final Success */}
      <CenterModal isOpen={isOpen && step === 'SUCCESS'} onClose={onClose} headerImageType={0}>
        <div className="flex flex-col items-center py-10 gap-4 text-center">
          <div className="">
            <Image src={Success} alt="success" className='w-[62px]' unoptimized />
          </div>
          <h3 className="text-2xl font-bold">Withdrawal Successful</h3>
        </div>
      </CenterModal>

      {/* Decision Modal for Deletion */}
      <CenterModal
        headerImageType={0}
        isOpen={isDecisionModalOpen}
        onClose={() => {
          setIsDecisionModalOpen(false);
          setAccountToDelete(null);
        }}
        showFooter
        footerChildren={
          <div className="w-full flex items-center gap-5">
            <button
              className="border p-3 rounded-full w-full border-[#F1F1F1] text-[#262626] font-bold"
              onClick={() => {
                setIsDecisionModalOpen(false);
                setAccountToDelete(null);
              }}
            >
              Cancel
            </button>
            <button
              className="border p-3 bg-[#F9403A] rounded-full w-full border-[#F1F1F1] text-[#fff] font-bold"
              onClick={() => handleDelete(accountToDelete)}
              disabled={isLoading || !accountToDelete}
              type="button"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin mx-auto" />
              ) : (
                'Delete'
              )}
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center gap-4">
            <Image src={DeleteIcon} alt="delete" className='w-[62px]' />
          <p className="font-bold text-[#262626] text-center">
            Are you sure you want to delete account?
          </p>
          <p className='text-[#888888] '>Account will be deleted permanently</p>
        </div>
      </CenterModal>
      
    </>
  );
}