import { useSupabase } from "@/contexts/SupabaseContext";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { Github, LogOut } from "lucide-react";
import { useState } from "react";

export const AuthButton = () => {
  const { user, signOut } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Authentication error:', error.message);
      }
    } catch (error) {
      console.error('Unexpected error during authentication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return user ? (
    <div className="flex items-center gap-3">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-purple-500/20">
          <span className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">
            {user.email}
          </span>
        </div>
      </div>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
        <Button
          onClick={signOut}
          className="relative bg-black/50 backdrop-blur-sm text-white font-medium px-6 py-2.5 rounded-full border border-purple-500/20 flex items-center gap-2 hover:bg-black/60 transition-all duration-300"
        >
          <LogOut className="w-4 h-4 text-[#8B5CF6]" />
          <span className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">Sign Out</span>
        </Button>
      </div>
    </div>
  ) : (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
      <Button
        onClick={handleSignIn}
        disabled={isLoading}
        className="relative bg-black/50 backdrop-blur-sm text-white font-medium px-6 py-2.5 rounded-full border border-purple-500/20 flex items-center gap-2 hover:bg-black/60 transition-all duration-300 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">Connecting...</span>
          </>
        ) : (
          <>
            <Github className="w-5 h-5 text-[#8B5CF6]" />
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">Connect GitHub</span>
          </>
        )}
      </Button>
    </div>
  );
};