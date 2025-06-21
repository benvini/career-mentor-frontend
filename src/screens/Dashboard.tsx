import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import api from "../api/client";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
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
    transform: translateY(-5px);
  }
`;

const Container = styled.div`
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 16px;
  direction: ${({ theme }) => theme.direction};
`;

const DashboardHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 40px;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #343a40;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: #6c757d;
  font-size: 1.25rem;
  margin: 0;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: ${({ theme }) =>
    theme.direction === "rtl" ? "300px 1fr" : "1fr 300px"};
  gap: 32px;
  direction: ${({ theme }) => theme.direction};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const PrimarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1024px) {
    order: -1;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #f8f9fa;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out;
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
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const SideCard = styled(Card)`
  padding: 24px;

  &:hover {
    transform: translateY(-3px);
  }
`;

const CardTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-direction: ${({ theme }) =>
    theme.direction === "rtl" ? "row-reverse" : "row"};
  margin-bottom: 16px;
  width: 100%;
`;

const CardTitleText = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #343a40;
  margin: 0;
  flex: 1;
  text-align: ${({ theme }) => (theme.direction === "rtl" ? "right" : "left")};
  direction: ${({ theme }) => theme.direction};
`;

const CardTitleIcon = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const SideCardTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: ${({ theme }) =>
    theme.direction === "rtl" ? "row-reverse" : "row"};
  margin-bottom: 16px;
  width: 100%;
`;

const SideCardTitleText = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #343a40;
  margin: 0;
  flex: 1;
  text-align: ${({ theme }) => (theme.direction === "rtl" ? "right" : "left")};
  direction: ${({ theme }) => theme.direction};
`;

const SideCardTitleIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
`;

const RTLTextWrapper = styled.div`
  flex: 1;
  text-align: ${({ theme }) => (theme.direction === "rtl" ? "right" : "left")};
  direction: ${({ theme }) => theme.direction};
`;

const PlanContainer = styled.div`
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e9ecef;
  position: relative;
  direction: ${({ theme }) => theme.direction};
`;

const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const PlanTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #343a40;
  margin: 0;
`;

const LastUpdated = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
`;

const PlanActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex-direction: ${({ theme }) =>
    theme.direction === "rtl" ? "row-reverse" : "row"};
`;

const ActionButton = styled.button<{ variant?: "primary" | "secondary" }>`
  background: ${(props) =>
    props.variant === "primary"
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "transparent"};
  color: ${(props) => (props.variant === "primary" ? "white" : "#667eea")};
  border: 2px solid #667eea;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.variant === "primary"
        ? "linear-gradient(135deg, #5a6fd8 0%, #6c4f8f 100%)"
        : "#667eea"};
    color: white;
    transform: translateY(-1px);
  }
`;

const PlanContent = styled.pre`
  background: white;
  padding: 24px;
  border-radius: 12px;
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap;
  color: #343a40;
  border: 1px solid #e9ecef;
  max-height: 400px;
  overflow-y: auto;
  margin: 0;
  font-family: inherit;
  text-align: ${({ theme }) => (theme.direction === "rtl" ? "right" : "left")};
  direction: ${({ theme }) => theme.direction};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatItem = styled.div`
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  animation: ${float} 3s ease-in-out infinite;

  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.15) 0%,
      rgba(118, 75, 162, 0.15) 100%
    );
  }

  &:nth-child(2) {
    animation-delay: 0.5s;
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
  direction: ${({ theme }) => theme.direction};
`;

const QuickActionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QuickActionItem = styled.button`
  background: white;
  border: 2px solid #e9ecef;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-direction: ${({ theme }) =>
    theme.direction === "rtl" ? "row-reverse" : "row"};
  justify-content: ${({ theme }) =>
    theme.direction === "rtl" ? "flex-end" : "flex-start"};
  text-align: ${({ theme }) => (theme.direction === "rtl" ? "right" : "left")};
  direction: ${({ theme }) => theme.direction};
  width: 100%;

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    transform: ${({ theme }) =>
      theme.direction === "rtl" ? "translateX(-4px)" : "translateX(4px)"};
  }
`;

const QuickActionIcon = styled.span`
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActivityItem = styled.div`
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #495057;
  text-align: ${({ theme }) => (theme.direction === "rtl" ? "right" : "left")};
  direction: ${({ theme }) => theme.direction};

  ${({ theme }) =>
    theme.direction === "rtl"
      ? "border-right: 4px solid #667eea;"
      : "border-left: 4px solid #667eea;"}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6c757d;
  direction: ${({ theme }) => theme.direction};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: #495057;
  text-align: center;
  direction: ${({ theme }) => theme.direction};
`;

const EmptyText = styled.p`
  margin-bottom: 24px;
  line-height: 1.6;
  text-align: center;
  direction: ${({ theme }) => theme.direction};
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #f5c6cb;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: ${({ theme }) => (theme.direction === "rtl" ? "right" : "left")};
  flex-direction: ${({ theme }) =>
    theme.direction === "rtl" ? "row-reverse" : "row"};

  &::before {
    content: "⚠️";
    font-size: 1.2rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;

  &::before {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid #e9ecef;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface Survey {
  id: string;
  answers: {
    experience: string;
    interests: string[];
    skills?: string;
    goal: string;
    timeline?: string;
    budget?: string;
  };
  aiPlan?: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const { t } = useTranslation("dashboardScreen");
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  // Helper functions for icons
  const getCardIcon = (title: string) => {
    if (title.includes("Plan") || title.includes("תוכנית")) return "🎯";
    if (title.includes("Progress") || title.includes("התקדמות")) return "📊";
    if (title.includes("Resources") || title.includes("משאבים")) return "📚";
    if (title.includes("Actions") || title.includes("פעולות")) return "⚡";
    if (title.includes("Activity") || title.includes("פעילות")) return "📋";
    if (
      title.includes("Stats") ||
      title.includes("סטטיסטיקה") ||
      title.includes("overview") ||
      title.includes("סקירה")
    )
      return "📈";
    return "🔧";
  };

  const getQuickActionIcon = (text: string) => {
    if (text.includes("Survey") || text.includes("שאלון")) return "📝";
    if (text.includes("Goals") || text.includes("מטרות")) return "🎯";
    if (text.includes("Resources") || text.includes("משאבים")) return "📚";
    if (text.includes("Progress") || text.includes("התקדמות")) return "📊";
    return "▶️";
  };

  // Render functions for titles with icons
  const renderCardTitle = (titleKey: string) => {
    const title = t(titleKey);
    return (
      <CardTitleWrapper>
        <CardTitleText>{title}</CardTitleText>
        <CardTitleIcon>{getCardIcon(title)}</CardTitleIcon>
      </CardTitleWrapper>
    );
  };

  const renderSideCardTitle = (titleKey: string) => {
    const title = t(titleKey);
    return (
      <SideCardTitleWrapper>
        <SideCardTitleText>{title}</SideCardTitleText>
        <SideCardTitleIcon>{getCardIcon(title)}</SideCardTitleIcon>
      </SideCardTitleWrapper>
    );
  };

  const renderQuickActionItem = (textKey: string, onClick?: () => void) => {
    const text = t(textKey);
    return (
      <QuickActionItem onClick={onClick}>
        <QuickActionIcon>{getQuickActionIcon(text)}</QuickActionIcon>
        <RTLTextWrapper>{text}</RTLTextWrapper>
      </QuickActionItem>
    );
  };

  // ... כל שאר הפונקציות נשארות זהות

  const fetchSurveys = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/surveys");
      setSurveys(res.data || []);
    } catch (err) {
      console.error("Error fetching surveys:", err);
      setError(t("messages.fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (!token) {
      navigate("/login");
      return;
    }

    setUserEmail(email || "");
    fetchSurveys();
  }, [navigate, fetchSurveys]);

  const getLatestSurvey = (): Survey | null => {
    if (surveys.length === 0) return null;
    return surveys[surveys.length - 1];
  };

  const getUserName = () => {
    if (!userEmail) return t("welcome").replace("{{name}}", "");
    const name = userEmail.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRetakeSurvey = () => {
    navigate("/survey");
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  const latestSurvey = getLatestSurvey();

  return (
    <Container>
      <DashboardHeader>
        <WelcomeTitle>
          {t("welcome").replace("{{name}}", getUserName())}
        </WelcomeTitle>
        <Subtitle>{t("subtitle")}</Subtitle>
      </DashboardHeader>

      <MainContent>
        <PrimarySection>
          {latestSurvey?.aiPlan ? (
            <Card>
              {renderCardTitle("sections.currentPlan")}
              <PlanContainer>
                <PlanHeader>
                  <PlanTitle>{t("currentPlan.title")}</PlanTitle>
                  <LastUpdated>
                    {t("currentPlan.lastUpdated").replace(
                      "{{date}}",
                      formatDate(latestSurvey.updatedAt)
                    )}
                  </LastUpdated>
                </PlanHeader>
                <PlanActions>
                  <ActionButton variant="primary" onClick={handleRetakeSurvey}>
                    {t("currentPlan.regenerate")}
                  </ActionButton>
                  <ActionButton variant="secondary">
                    {t("currentPlan.download")}
                  </ActionButton>
                  <ActionButton variant="secondary">
                    {t("currentPlan.share")}
                  </ActionButton>
                </PlanActions>
                <PlanContent>{latestSurvey.aiPlan}</PlanContent>
              </PlanContainer>
            </Card>
          ) : (
            <Card>
              <EmptyState>
                <EmptyIcon>🎯</EmptyIcon>
                <EmptyTitle>{t("messages.noPlan")}</EmptyTitle>
                <EmptyText>{t("sections.overview")}</EmptyText>
                <CTAButton onClick={handleRetakeSurvey}>
                  {t("quickActions.retakeSurvey")}
                </CTAButton>
              </EmptyState>
            </Card>
          )}

          {error && (
            <Card>
              <ErrorMessage>{error}</ErrorMessage>
            </Card>
          )}
        </PrimarySection>

        <SidebarSection>
          <SideCard>
            {renderSideCardTitle("sections.overview")}
            <StatsGrid>
              <StatItem>
                <StatNumber>{surveys.length}</StatNumber>
                <StatLabel>{t("stats.plansGenerated")}</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>0</StatNumber>
                <StatLabel>{t("stats.goalsCompleted")}</StatLabel>
              </StatItem>
            </StatsGrid>
          </SideCard>

          <SideCard>
            {renderSideCardTitle("quickActions.title")}
            <QuickActionsList>
              {renderQuickActionItem(
                "quickActions.retakeSurvey",
                handleRetakeSurvey
              )}
              {renderQuickActionItem("quickActions.updateGoals", () =>
                navigate("/survey")
              )}
              {renderQuickActionItem("quickActions.viewResources")}
              {renderQuickActionItem("quickActions.trackProgress")}
            </QuickActionsList>
          </SideCard>

          <SideCard>
            {renderSideCardTitle("recentActivity.title")}
            <ActivityList>
              {surveys.length > 0 ? (
                surveys
                  .slice(-3)
                  .reverse()
                  .map((survey, index) => (
                    <ActivityItem key={survey.id || index}>
                      {t("surveyCompletedOn")} {formatDate(survey.createdAt)}
                    </ActivityItem>
                  ))
              ) : (
                <ActivityItem>{t("recentActivity.noActivity")}</ActivityItem>
              )}
            </ActivityList>
          </SideCard>
        </SidebarSection>
      </MainContent>
    </Container>
  );
};

export default Dashboard;
