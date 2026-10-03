import AuthPage from "@/components/auth/AuthPage"
import { Metadata } from "next"

export const metadata: Metadata = { title: "FPL Suite - Log in" }

export default function LoginPage() {
  return (
    <AuthPage mode="login" />
  )
}
