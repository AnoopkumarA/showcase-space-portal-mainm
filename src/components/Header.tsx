import { useSupabase } from "@/contexts/SupabaseContext";
import { Button } from "./ui/button";
import { Github, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export const Header = () => {
	const { user, signOut } = useSupabase();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleSignIn = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: window.location.origin
			}
		});
		if (error) console.error('Error:', error.message);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<header className="w-full border-b border-[#8B5CF6]/20 backdrop-blur-xl relative">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">
					Showcase Space
				</h1>
				
				{/* Desktop Navigation */}
				<div className="hidden md:block">
					{user ? (
						<div className="flex items-center gap-4">
							<span className="text-white">{user.email}</span>
							<Button
								onClick={signOut}
								variant="outline"
								className="border-[#8B5CF6]/20 text-white hover:bg-[#8B5CF6]/20"
							>
								<LogOut className="w-4 h-4 mr-2" />
								Sign Out
							</Button>
						</div>
					) : (
						<Button
							onClick={handleSignIn}
							className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#C026D3] text-white"
						>
							<Github className="w-5 h-5 mr-2" />
							Sign in with GitHub
						</Button>
					)}
				</div>

				{/* Mobile Menu Button */}
				<button
					className="md:hidden text-white p-2"
					onClick={toggleMobileMenu}
					aria-label="Toggle mobile menu"
				>
					{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
				</button>
			</div>

			{/* Mobile Menu */}
			<div
				className={`fixed inset-0 bg-black/95 z-50 md:hidden transition-transform duration-300 ease-in-out ${
					isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className="flex flex-col items-center justify-center h-full gap-8">
					{user ? (
						<>
							<span className="text-white text-base text-center break-all px-4">{user.email}</span>
							<Button
								onClick={() => {
									signOut();
									setIsMobileMenuOpen(false);
								}}
								variant="outline"
								className="border-[#8B5CF6]/20 text-white hover:bg-[#8B5CF6]/20"
							>
								<LogOut className="w-4 h-4 mr-2" />
								Sign Out
							</Button>
						</>
					) : (
						<Button
							onClick={() => {
								handleSignIn();
								setIsMobileMenuOpen(false);
							}}
							className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#C026D3] text-white"
						>
							<Github className="w-5 h-5 mr-2" />
							Sign in with GitHub
						</Button>
					)}
				</div>
			</div>
		</header>
	);
};
