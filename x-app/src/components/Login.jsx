import { SignedIn, SignedOut, SignInButton, SignUp, SignUpButton, UserButton } from "@clerk/clerk-react";

export default function Login() {
  return (
    <header>
      <SignedOut>
        <SignUpButton>click</SignUpButton>
      </SignedOut>
        
     
    </header>
  )
}