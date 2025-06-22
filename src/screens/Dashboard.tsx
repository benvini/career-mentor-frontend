import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";
import { AuthService } from "../api/authService";
import type { Survey } from "../api/api";
import MarkdownRenderer from "../utils/markdownRenderer";
import { useContext } from "react";
import { RTLContext } from "../contexts/rtlUtils";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

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
`;

const DashboardHeader = styled.div`
  max-width: 1400px;
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

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
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

const SidebarCard = styled.div<{ $isRTL: boolean }>`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #f8f9fa;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    ${({ $isRTL }) => ($isRTL ? "right: 0;" : "left: 0;")}
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }
`;

const CardTitleWrapper = styled.div<{ $isRTL: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-direction: ${({ $isRTL }) => ($isRTL ? "row-reverse" : "row")};
  margin-bottom: 16px;
  width: 100%;
`;

const CardTitleText = styled.h2<{ $isRTL: boolean }>`
  font-size: 1.75rem;
  font-weight: 600;
  color: #343a40;
  margin: 0;
  flex: 1;
  text-align: ${({ $isRTL }) => ($isRTL ? "right" : "left")};
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};
`;

const SidebarTitleText = styled.h3<{ $isRTL: boolean }>`
  font-size: 1.2rem;
  font-weight: 600;
  color: #343a40;
  margin: 0;
  flex: 1;
  text-align: ${({ $isRTL }) => ($isRTL ? "right" : "left")};
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};
`;

const CardTitleIcon = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const SidebarTitleIcon = styled.span`
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const PlanContainer = styled.div<{ $isRTL: boolean }>`
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  border-radius: 16px;
  padding: 32px;
  border: 2px solid #e9ecef;
  position: relative;
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const PlanHeader = styled.div<{ $isRTL: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  flex-direction: ${({ $isRTL }) => ($isRTL ? "row-reverse" : "row")};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const PlanTitleSection = styled.div<{ $isRTL: boolean }>`
  flex: 1;
  min-width: 300px;
  text-align: ${({ $isRTL }) => ($isRTL ? "right" : "left")};
`;

const PlanTitle = styled.h3<{ $isRTL: boolean }>`
  font-size: 1.8rem;
  font-weight: 600;
  color: #343a40;
  margin: 0 0 8px 0;
  text-align: ${({ $isRTL }) => ($isRTL ? "right" : "left")};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const LastUpdated = styled.span`
  color: #6c757d;
  font-size: 0.95rem;
`;

const PlanActions = styled.div<{ $isRTL: boolean }>`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex-direction: ${({ $isRTL }) => ($isRTL ? "row-reverse" : "row")};

  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;

    & > * {
      flex: 1;
      min-width: 120px;
    }
  }
`;

const ActionButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  background: ${(props) =>
    props.$variant === "primary"
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "transparent"};
  color: ${(props) => (props.$variant === "primary" ? "white" : "#667eea")};
  border: 2px solid #667eea;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: ${(props) =>
      props.$variant === "primary"
        ? "linear-gradient(135deg, #5a6fd8 0%, #6c4f8f 100%)"
        : "#667eea"};
    color: white;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
`;

const PlanContent = styled.div<{ $isRTL: boolean }>`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  max-height: 600px;
  overflow-y: auto;
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 5px;

    &:hover {
      background: #94a3b8;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-height: 500px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
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

const StatLabel = styled.div<{ $isRTL: boolean }>`
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};
`;

const QuickActionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QuickActionItem = styled.button<{ $isRTL: boolean }>`
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
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
  flex-direction: ${({ $isRTL }) => ($isRTL ? "row-reverse" : "row")};
  justify-content: ${({ $isRTL }) => ($isRTL ? "flex-end" : "flex-start")};
  text-align: ${({ $isRTL }) => ($isRTL ? "right" : "left")};
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};
  width: 100%;

  &:hover {
    border-color: #667eea;
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.1) 0%,
      rgba(118, 75, 162, 0.1) 100%
    );
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const QuickActionIcon = styled.span`
  font-size: 1.3rem;
  flex-shrink: 0;
  padding: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const QuickActionText = styled.div`
  flex: 1;
  font-size: 0.95rem;
  font-weight: 600;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActivityItem = styled.div<{ $isRTL: boolean }>`
  padding: 14px 16px;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.03) 0%,
    rgba(118, 75, 162, 0.03) 100%
  );
  border-radius: 10px;
  font-size: 0.9rem;
  color: #495057;
  text-align: ${({ $isRTL }) => ($isRTL ? "right" : "left")};
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};
  transition: all 0.2s ease;

  ${({ $isRTL }) =>
    $isRTL
      ? "border-right: 3px solid #667eea;"
      : "border-left: 3px solid #667eea;"}

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.08) 0%,
      rgba(118, 75, 162, 0.08) 100%
    );
    transform: ${({ $isRTL }) =>
      $isRTL ? "translateX(-2px)" : "translateX(2px)"};
  }
`;

const EmptyState = styled.div<{ $isRTL: boolean }>`
  text-align: center;
  padding: 80px 24px;
  color: #6c757d;
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 24px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3<{ $isRTL: boolean }>`
  font-size: 2rem;
  margin-bottom: 16px;
  color: #495057;
  text-align: center;
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};
`;

const EmptyText = styled.p<{ $isRTL: boolean }>`
  margin-bottom: 32px;
  line-height: 1.6;
  font-size: 1.1rem;
  text-align: center;
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
`;

const ErrorMessage = styled.div<{ $isRTL: boolean }>`
  background: #f8d7da;
  color: #721c24;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #f5c6cb;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: ${({ $isRTL }) => ($isRTL ? "right" : "left")};
  flex-direction: ${({ $isRTL }) => ($isRTL ? "row-reverse" : "row")};

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

const Dashboard = () => {
  const { t, i18n } = useTranslation("dashboardScreen");
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const { isRTL, direction } = useContext(RTLContext);

  console.log("Dashboard RTL:", {
    language: i18n.language,
    isRTL,
    direction,
    timestamp: Date.now(),
  });

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

  const renderCardTitle = (titleKey: string) => {
    const title = t(titleKey);
    return (
      <CardTitleWrapper $isRTL={isRTL}>
        <CardTitleText $isRTL={isRTL}>{title}</CardTitleText>
        <CardTitleIcon>{getCardIcon(title)}</CardTitleIcon>
      </CardTitleWrapper>
    );
  };

  const renderSidebarTitle = (titleKey: string) => {
    const title = t(titleKey);
    return (
      <CardTitleWrapper $isRTL={isRTL}>
        <SidebarTitleText $isRTL={isRTL}>{title}</SidebarTitleText>
        <SidebarTitleIcon>{getCardIcon(title)}</SidebarTitleIcon>
      </CardTitleWrapper>
    );
  };

  const renderQuickActionItem = (textKey: string, onClick?: () => void) => {
    const text = t(textKey);
    return (
      <QuickActionItem $isRTL={isRTL} onClick={onClick}>
        <QuickActionIcon>{getQuickActionIcon(text)}</QuickActionIcon>
        <QuickActionText>{text}</QuickActionText>
      </QuickActionItem>
    );
  };

  const fetchSurveys = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.surveys.getAll();
      setSurveys(response.data || []);
    } catch (err: unknown) {
      console.error("Error fetching surveys:", err);

      if (AuthService.handleAuthError(err)) {
        navigate("/login");
        return;
      }

      const axiosError = err as import("axios").AxiosError<ApiErrorResponse>;
      const errorData = axiosError.response?.data;
      const errorMessage =
        errorData?.error ||
        errorData?.message ||
        axiosError.message ||
        t("messages.fetchError");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [t, navigate]);

  const handleRegeneratePlan = async (surveyId: string) => {
    try {
      setLoading(true);
      const response = await api.surveys.regeneratePlan(surveyId);

      setSurveys((prev) =>
        prev.map((survey) =>
          survey.id === surveyId
            ? {
                ...survey,
                aiPlan: response.data.aiPlan,
                updatedAt: new Date().toISOString(),
              }
            : survey
        )
      );
    } catch (err: unknown) {
      console.error("Error regenerating plan:", err);
      if (AuthService.handleAuthError(err)) {
        navigate("/login");
        return;
      }
      const axiosError = err as import("axios").AxiosError<ApiErrorResponse>;
      const errorData = axiosError.response?.data;
      const errorMessage =
        errorData?.error ||
        errorData?.message ||
        axiosError.message ||
        "Failed to regenerate plan";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPlan = async (surveyId: string) => {
    try {
      const response = await api.surveys.export(surveyId, "pdf");

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `career-plan-${surveyId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error("Error downloading plan:", err);
      const axiosError = err as import("axios").AxiosError;
      setError(axiosError.message || "Failed to download plan");
    }
  };

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    const email = AuthService.getCurrentUserEmail();
    setUserEmail(email || "");

    fetchSurveys();
  }, [navigate, fetchSurveys]);

  useEffect(() => {
    console.log("Language changed:", i18n.language, "isRTL:", isRTL);
  }, [i18n.language, isRTL]);

  const getLatestSurvey = (): Survey | null => {
    if (surveys.length === 0) return null;
    return surveys[surveys.length - 1];
  };

  const getUserName = () => {
    if (!userEmail) return t("welcome").replace("{{name}}", "");
    const name = userEmail.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
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
    <Container key={`container-${direction}`} style={{ direction }}>
      <DashboardHeader>
        <WelcomeTitle>
          {t("welcome").replace("{{name}}", getUserName())}
        </WelcomeTitle>
        <Subtitle>{t("subtitle")}</Subtitle>
      </DashboardHeader>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          gap: "32px",
          direction,
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        {isRTL ? (
          <>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              <StatsSection>
                <Card>
                  {renderCardTitle("sections.overview")}
                  <StatsGrid>
                    <StatItem>
                      <StatNumber>{surveys.length}</StatNumber>
                      <StatLabel $isRTL={isRTL}>
                        {t("stats.plansGenerated")}
                      </StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatNumber>0</StatNumber>
                      <StatLabel $isRTL={isRTL}>
                        {t("stats.goalsCompleted")}
                      </StatLabel>
                    </StatItem>
                  </StatsGrid>
                </Card>
              </StatsSection>

              {/* === התוכנית === */}
              {latestSurvey?.aiPlan ? (
                <Card>
                  {renderCardTitle("sections.currentPlan")}
                  <PlanContainer $isRTL={isRTL}>
                    <PlanHeader $isRTL={isRTL}>
                      <PlanTitleSection $isRTL={isRTL}>
                        <PlanTitle $isRTL={isRTL}>
                          {t("currentPlan.title")}
                        </PlanTitle>
                        <LastUpdated>
                          {t("currentPlan.lastUpdated").replace(
                            "{{date}}",
                            formatDate(latestSurvey.updatedAt)
                          )}
                        </LastUpdated>
                      </PlanTitleSection>

                      <PlanActions $isRTL={isRTL}>
                        <ActionButton
                          $variant="primary"
                          onClick={handleRetakeSurvey}
                        >
                          {t("currentPlan.regenerate")}
                        </ActionButton>
                        {latestSurvey.id && (
                          <ActionButton
                            $variant="secondary"
                            onClick={() =>
                              handleRegeneratePlan(latestSurvey.id!)
                            }
                          >
                            Regenerate Plan
                          </ActionButton>
                        )}
                        <ActionButton
                          $variant="secondary"
                          onClick={() =>
                            latestSurvey.id &&
                            handleDownloadPlan(latestSurvey.id)
                          }
                        >
                          {t("currentPlan.download")}
                        </ActionButton>
                        <ActionButton $variant="secondary">
                          {t("currentPlan.share")}
                        </ActionButton>
                      </PlanActions>
                    </PlanHeader>

                    <PlanContent $isRTL={isRTL}>
                      <MarkdownRenderer content={latestSurvey.aiPlan} />
                    </PlanContent>
                  </PlanContainer>
                </Card>
              ) : (
                <Card>
                  <EmptyState $isRTL={isRTL}>
                    <EmptyIcon>🎯</EmptyIcon>
                    <EmptyTitle $isRTL={isRTL}>
                      {t("messages.noPlan")}
                    </EmptyTitle>
                    <EmptyText $isRTL={isRTL}>
                      {t("sections.overview")}
                    </EmptyText>
                    <CTAButton onClick={handleRetakeSurvey}>
                      {t("quickActions.retakeSurvey")}
                    </CTAButton>
                  </EmptyState>
                </Card>
              )}

              {error && (
                <Card>
                  <ErrorMessage $isRTL={isRTL}>{error}</ErrorMessage>
                </Card>
              )}
            </div>

            <div
              style={{
                width: "320px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <SidebarCard $isRTL={isRTL}>
                {renderSidebarTitle("quickActions.title")}
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
              </SidebarCard>

              <SidebarCard $isRTL={isRTL}>
                {renderSidebarTitle("recentActivity.title")}
                <ActivityList>
                  {surveys.length > 0 ? (
                    surveys
                      .slice(-3)
                      .reverse()
                      .map((survey, index) => (
                        <ActivityItem key={survey.id || index} $isRTL={isRTL}>
                          {t("surveyCompletedOn")}{" "}
                          {formatDate(survey.createdAt)}
                        </ActivityItem>
                      ))
                  ) : (
                    <ActivityItem $isRTL={isRTL}>
                      {t("recentActivity.noActivity")}
                    </ActivityItem>
                  )}
                </ActivityList>
              </SidebarCard>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                width: "320px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <SidebarCard $isRTL={isRTL}>
                {renderSidebarTitle("quickActions.title")}
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
              </SidebarCard>

              <SidebarCard $isRTL={isRTL}>
                {renderSidebarTitle("recentActivity.title")}
                <ActivityList>
                  {surveys.length > 0 ? (
                    surveys
                      .slice(-3)
                      .reverse()
                      .map((survey, index) => (
                        <ActivityItem key={survey.id || index} $isRTL={isRTL}>
                          {t("surveyCompletedOn")}{" "}
                          {formatDate(survey.createdAt)}
                        </ActivityItem>
                      ))
                  ) : (
                    <ActivityItem $isRTL={isRTL}>
                      {t("recentActivity.noActivity")}
                    </ActivityItem>
                  )}
                </ActivityList>
              </SidebarCard>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              <StatsSection>
                <Card>
                  {renderCardTitle("sections.overview")}
                  <StatsGrid>
                    <StatItem>
                      <StatNumber>{surveys.length}</StatNumber>
                      <StatLabel $isRTL={isRTL}>
                        {t("stats.plansGenerated")}
                      </StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatNumber>0</StatNumber>
                      <StatLabel $isRTL={isRTL}>
                        {t("stats.goalsCompleted")}
                      </StatLabel>
                    </StatItem>
                  </StatsGrid>
                </Card>
              </StatsSection>

              {latestSurvey?.aiPlan ? (
                <Card>
                  {renderCardTitle("sections.currentPlan")}
                  <PlanContainer $isRTL={isRTL}>
                    <PlanHeader $isRTL={isRTL}>
                      <PlanTitleSection $isRTL={isRTL}>
                        <PlanTitle $isRTL={isRTL}>
                          {t("currentPlan.title")}
                        </PlanTitle>
                        <LastUpdated>
                          {t("currentPlan.lastUpdated").replace(
                            "{{date}}",
                            formatDate(latestSurvey.updatedAt)
                          )}
                        </LastUpdated>
                      </PlanTitleSection>

                      <PlanActions $isRTL={isRTL}>
                        <ActionButton
                          $variant="primary"
                          onClick={handleRetakeSurvey}
                        >
                          {t("currentPlan.regenerate")}
                        </ActionButton>
                        {latestSurvey.id && (
                          <ActionButton
                            $variant="secondary"
                            onClick={() =>
                              handleRegeneratePlan(latestSurvey.id!)
                            }
                          >
                            Regenerate Plan
                          </ActionButton>
                        )}
                        <ActionButton
                          $variant="secondary"
                          onClick={() =>
                            latestSurvey.id &&
                            handleDownloadPlan(latestSurvey.id)
                          }
                        >
                          {t("currentPlan.download")}
                        </ActionButton>
                        <ActionButton $variant="secondary">
                          {t("currentPlan.share")}
                        </ActionButton>
                      </PlanActions>
                    </PlanHeader>

                    <PlanContent $isRTL={isRTL}>
                      <MarkdownRenderer content={latestSurvey.aiPlan} />
                    </PlanContent>
                  </PlanContainer>
                </Card>
              ) : (
                <Card>
                  <EmptyState $isRTL={isRTL}>
                    <EmptyIcon>🎯</EmptyIcon>
                    <EmptyTitle $isRTL={isRTL}>
                      {t("messages.noPlan")}
                    </EmptyTitle>
                    <EmptyText $isRTL={isRTL}>
                      {t("sections.overview")}
                    </EmptyText>
                    <CTAButton onClick={handleRetakeSurvey}>
                      {t("quickActions.retakeSurvey")}
                    </CTAButton>
                  </EmptyState>
                </Card>
              )}

              {error && (
                <Card>
                  <ErrorMessage $isRTL={isRTL}>{error}</ErrorMessage>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default Dashboard;
