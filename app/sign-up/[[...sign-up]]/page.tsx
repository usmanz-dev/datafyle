import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="mb-6 text-2xl font-bold text-[#2563EB]">Datafyle</div>
      <SignUp />
    </div>
  )
}
