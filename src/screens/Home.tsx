import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Container = styled.div`
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  padding: 80px 24px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  animation: ${fadeInUp} 1s ease-out;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.h2`
  font-size: 1.5rem;
  color: #6c757d;
  font-weight: 400;
  margin-bottom: 20px;
  animation: ${fadeInUp} 1s ease-out 0.2s both;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.125rem;
  color: #495057;
  max-width: 700px;
  margin: 0 auto 40px;
  line-height: 1.7;
  animation: ${fadeInUp} 1s ease-out 0.4s both;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 30px;
  }
`;

const CTASection = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 60px;
  animation: ${fadeInUp} 1s ease-out 0.6s both;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 300px;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 14px 30px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 300px;
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 24px;
  background: white;

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturesTitle = styled.h3`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #343a40;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 40px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;

  @media (max-width: 768px) {
    gap: 30px;
  }
`;

const FeatureCard = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f8f9fa;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const FeatureTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 16px;
`;

const FeatureDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
  font-size: 1rem;
`;

const LoginPromptSection = styled.section`
  padding: 60px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const PromptContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const PromptText = styled.p`
  font-size: 1.125rem;
  color: #495057;
  margin-bottom: 24px;
`;

const PromptLink = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;

  &:hover {
    color: #764ba2;
  }
`;

const Home = () => {
  const { t } = useTranslation("homeScreen");
  const navigate = useNavigate();

  const features = [
    {
      icon: "🎯",
      titleKey: "features.personalized.title",
      descriptionKey: "features.personalized.description",
    },
    {
      icon: "🤖",
      titleKey: "features.aiPowered.title",
      descriptionKey: "features.aiPowered.description",
    },
    {
      icon: "📋",
      titleKey: "features.actionable.title",
      descriptionKey: "features.actionable.description",
    },
  ];

  return (
    <Container>
      <HeroSection>
        <HeroTitle>{t("title")}</HeroTitle>
        <HeroSubtitle>{t("subtitle")}</HeroSubtitle>
        <HeroDescription>{t("description")}</HeroDescription>

        <CTASection>
          <PrimaryButton onClick={() => navigate("/register")}>
            {t("cta.getStarted")}
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate("/login")}>
            {t("cta.loginPrompt")}
          </SecondaryButton>
        </CTASection>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <FeaturesTitle>{t("features.title")}</FeaturesTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon style={{ animationDelay: `${index * 0.5}s` }}>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{t(feature.titleKey)}</FeatureTitle>
                <FeatureDescription>
                  {t(feature.descriptionKey)}
                </FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <LoginPromptSection>
        <PromptContainer>
          <PromptText>{t("cta.loginPrompt")}</PromptText>
          <PromptLink onClick={() => navigate("/login")}>
            {t("cta.signInLink")}
          </PromptLink>
        </PromptContainer>
      </LoginPromptSection>
    </Container>
  );
};

export default Home;
