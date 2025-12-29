import Navbar from "@components/navbar/navbar";
import Footer from "@components/footer/footer";
import CTASection from "@/components/landing-page-sections/CTASection";
import HeroSection from "@components/landing-page-sections/HeroSection";
import FeaturesSection from "@components/landing-page-sections/FeaturesSection";
import HowItWorksSection from "@components/landing-page-sections/HowItWorksSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 transition-colors duration-300">
      {/* NavBar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
