
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage.css';

const onboardingSteps = [
  {
    title: 'Bienvenue sur MedChain',
    description: 'Votre carnet de santé numérique, sécurisé et décentralisé. Prenez le contrôle de vos données médicales.',
    icon: '🔒',
  },
  {
    title: 'Scan & Go',
    description: 'Scannez le QR code de vos médicaments pour accéder à leur historique complet et vérifier leur authenticité.',
    icon: '📲',
  },
  {
    title: 'Accès Sécurisé',
    description: 'Partagez vos données en toute sécurité avec les professionnels de santé de votre choix, quand vous le voulez.',
    icon: '🤝',
  },
  {
    title: 'Prêt à commencer ?',
    description: 'Rejoignez-nous et découvrez une nouvelle manière de gérer votre santé.',
    icon: '🚀',
  },
];

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('hasViewedOnboarding', 'true');
      window.location.href = '/login';
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasViewedOnboarding', 'true');
    window.location.href = '/login';
  };

  const { title, description, icon } = onboardingSteps[currentStep];

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-icon">{icon}</div>
        <h2 className="onboarding-title">{title}</h2>
        <p className="onboarding-description">{description}</p>
        <div className="onboarding-dots">
          {onboardingSteps.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentStep === index ? 'active' : ''}`}
            ></span>
          ))}
        </div>
        <button onClick={handleNext} className="onboarding-button">
          {currentStep < onboardingSteps.length - 1 ? 'Suivant' : 'Commencer'}
        </button>
        <button onClick={handleSkip} className="onboarding-skip-button">
          Passer
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
