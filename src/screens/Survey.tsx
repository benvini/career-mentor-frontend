import { useState } from "react";
import styled from "styled-components";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const Container = styled.div`
  max-width: 600px;
  margin: 60px auto;
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
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 16px;
  border: 1px solid #f5c6cb;
`;

const ResponseBox = styled.pre`
  background: #f9f9f9;
  padding: 16px;
  margin-top: 24px;
  border-radius: 6px;
  font-size: 0.95rem;
  white-space: pre-wrap;
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
        <ResponseBox>
          <strong>{t("aiPlanResponseLabel")}</strong>
          <br />
          {aiPlan}
        </ResponseBox>
      )}
    </Container>
  );
};

export default Survey;
