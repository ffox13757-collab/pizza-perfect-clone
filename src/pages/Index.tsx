import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { AboutSection } from '@/components/home/AboutSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { AddressModal } from '@/components/address/AddressModal';
import { PromotionsCarousel } from '@/components/home/PromotionsCarousel';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { DailyOfferBanner } from '@/components/home/DailyOfferBanner';
import { useAddressStore } from '@/stores/addressStore';
import { useCreateAddress } from '@/hooks/useAddresses';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { hasCheckedCep, setHasCheckedCep, setSelectedAddress } = useAddressStore();
  const [showCepModal, setShowCepModal] = useState(false);
  const createAddress = useCreateAddress();
  const { user } = useAuth();

  useEffect(() => {
    // Show CEP modal for first-time visitors
    if (!hasCheckedCep) {
      const timer = setTimeout(() => {
        setShowCepModal(true);
      }, 1500); // Delay to let the page load first
      return () => clearTimeout(timer);
    }
  }, [hasCheckedCep]);

  const handleAddressConfirm = async (addressData: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  }) => {
    setSelectedAddress(addressData);
    setHasCheckedCep(true);
    setShowCepModal(false);

    // If user is logged in, save the address
    if (user) {
      try {
        await createAddress.mutateAsync({
          label: 'Casa',
          cep: addressData.cep,
          street: addressData.street,
          number: addressData.number,
          complement: addressData.complement || null,
          neighborhood: addressData.neighborhood,
          city: addressData.city,
          state: addressData.state,
          is_default: true,
        });
      } catch {
        // Address creation failed, but we still have it in local state
      }
    }
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setHasCheckedCep(true); // Mark as checked even if closed without confirming
    }
    setShowCepModal(open);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <DailyOfferBanner />
        <PromotionsCarousel />
        <CategoriesGrid />
        <FeaturedSection />
        <AboutSection />
      </main>
      <Footer />
      <WhatsAppButton />

      <AddressModal
        open={showCepModal}
        onOpenChange={handleModalClose}
        onConfirm={handleAddressConfirm}
      />
    </div>
  );
};

export default Index;
