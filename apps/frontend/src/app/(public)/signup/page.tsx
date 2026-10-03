import type { Metadata } from "next"
import AuthPage from "@/components/auth/AuthPage"

export const metadata: Metadata = { title: "Create your account" }

export default function SignupPage() {
  return <AuthPage mode="signup" />
}