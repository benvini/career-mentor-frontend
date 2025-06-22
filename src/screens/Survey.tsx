import { useState } from "react";
import styled from "styled-components";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import MarkdownRenderer from "../utils/markdownRenderer";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const Container = styled.div`
  max-width: 800px;
  margin: 60px auto;
  padding: 0 20px;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-top: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Button = styled.button`
  margin-top: 24px;
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 16px;
  border: 1px solid #f5c6cb;
`;

// === החלפנו את ResponseBox ב-ResponseContainer מעוצב ===
const ResponseContainer = styled.div`
  background: white;
  padding: 2rem;
  margin-top: 32px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-height: 70vh;
  overflow-y: auto;
  direction: rtl;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;

    &:hover {
      background: #94a3b8;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-height: 60vh;
  }
`;

const ResponseHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
`;

const Survey = () => {
  const { t } = useTranslation("surveyScreen");
  const [experience, setExperience] = useState("junior");
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [aiPlan, setAiPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckboxChange = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiPlan("");
    setError("");

    try {
      const surveyData = {
        experience,
        interests,
        goal,
        language: i18n.language as "en" | "he",
      };

      const response = await api.surveys.create(surveyData);
      setAiPlan(response.data.aiPlan || t("noAiResponse"));
    } catch (err: unknown) {
      console.error("Survey submission error:", err);

      const axiosError = err as import("axios").AxiosError<ApiErrorResponse>;
      const errorData = axiosError.response?.data;
      const errorMessage =
        errorData?.error ||
        errorData?.message ||
        axiosError.message ||
        t("surveySubmitError");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2>{t("title")}</h2>
      <form onSubmit={handleSubmit}>
        <Label>{t("experience.label")}</Label>
        <Select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="student">{t("experience.options.student")}</option>
          <option value="junior">{t("experience.options.junior")}</option>
          <option value="mid">{t("experience.options.mid")}</option>
          <option value="senior">{t("experience.options.senior")}</option>
          <option value="lead">{t("experience.options.lead")}</option>
          <option value="executive">{t("experience.options.executive")}</option>
        </Select>

        <Label>{t("interests.label")}</Label>
        <CheckboxGroup>
          {[
            "frontend",
            "backend",
            "fullstack",
            "mobile",
            "ai",
            "ml",
            "data",
            "cyber",
            "devops",
            "product",
            "design",
            "qa",
            "blockchain",
            "iot",
          ].map((item) => (
            <CheckboxLabel key={item}>
              <input
                type="checkbox"
                checked={interests.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {t(`interests.options.${item}`)}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>

        <Label>{t("goal.label")}</Label>
        <Input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder={t("goal.placeholder")}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading
            ? t("submitting") || "Creating Plan..."
            : t("submit") || "Create Career Plan"}
        </Button>
      </form>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {aiPlan && (
        <ResponseContainer>
          <ResponseHeader>
            🎯 {t("aiPlanResponseLabel") || "תוכנית הקריירה שלך"}
          </ResponseHeader>
          <MarkdownRenderer content={aiPlan} />
        </ResponseContainer>
      )}
    </Container>
  );
};

export default Survey;
