import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center">
          <span className="text-white text-xs font-bold">DF</span>
        </div>
        <span className="text-[#1E293B] font-bold text-xl">Datafyle</span>
      </div>
      <SignIn
        fallbackRedirectUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  )
}
