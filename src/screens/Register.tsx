import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import api from "../api/client";

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  padding: 48px;
  width: 100%;
  max-width: 520px;
  animation: ${slideInUp} 0.6s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
    margin: 16px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #343a40;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #6c757d;
  font-size: 1.125rem;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid ${(props) => (props.hasError ? "#dc3545" : "#e9ecef")};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? "#dc3545" : "#28a745")};
    background: white;
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.hasError ? "rgba(220, 53, 69, 0.1)" : "rgba(40, 167, 69, 0.1)"};
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const PasswordStrength = styled.div<{ strength: number }>`
  height: 6px;
  width: 100%;
  background-color: #e9ecef;
  border-radius: 3px;
  margin: 8px 0;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(props) => (props.strength / 4) * 100}%;
    background: ${(props) => {
      if (props.strength <= 1)
        return "linear-gradient(90deg, #dc3545, #fd7e14)";
      if (props.strength <= 2)
        return "linear-gradient(90deg, #fd7e14, #ffc107)";
      if (props.strength <= 3)
        return "linear-gradient(90deg, #ffc107, #28a745)";
      return "linear-gradient(90deg, #28a745, #20c997)";
    }};
    transition: all 0.3s ease;
    border-radius: 3px;
  }
`;

const PasswordHint = styled.div<{ strength: number }>`
  font-size: 0.85rem;
  color: ${(props) => {
    if (props.strength <= 1) return "#dc3545";
    if (props.strength <= 2) return "#fd7e14";
    if (props.strength <= 3) return "#ffc107";
    return "#28a745";
  }};
  margin-top: 4px;
  font-weight: 500;
`;

const PasswordRequirements = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
`;

const RequirementTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  color: #495057;
`;

const RequirementsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
`;

const RequirementItem = styled.li<{ met: boolean }>`
  font-size: 0.85rem;
  color: ${(props) => (props.met ? "#28a745" : "#6c757d")};
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "${(props) => (props.met ? "✓" : "○")}";
    font-weight: bold;
  }
`;

const SubmitButton = styled.button<{ strength: number }>`
  background: ${(props) =>
    props.strength >= 2
      ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
      : "#6c757d"};
  color: white;
  border: none;
  padding: 16px 24px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: ${(props) => (props.strength >= 2 ? "pointer" : "not-allowed")};
  transition: all 0.3s ease;
  margin-top: 16px;
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

  &:hover:not(:disabled) {
    transform: ${(props) =>
      props.strength >= 2 ? "translateY(-2px)" : "none"};
    box-shadow: ${(props) =>
      props.strength >= 2 ? "0 8px 25px rgba(40, 167, 69, 0.4)" : "none"};

    &::before {
      left: ${(props) => (props.strength >= 2 ? "100%" : "-100%")};
    }
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "⚠️";
  }
`;

const SuccessMessage = styled.div`
  color: #155724;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "✅";
  }
`;

const TermsAgreement = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  text-align: center;
  line-height: 1.5;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 16px;
`;

const SignInPrompt = styled.div`
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
`;

const SignInText = styled.p`
  color: #6c757d;
  margin: 0 0 12px 0;
`;

const SignInLink = styled.button`
  background: none;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-1px);
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register = () => {
  const { t } = useTranslation("registerScreen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const calculatePasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;
    return strength;
  };

  const getPasswordRequirements = (pwd: string) => [
    { text: t("passwordRequirements.length"), met: pwd.length >= 8 },
    { text: t("passwordRequirements.uppercase"), met: /[A-Z]/.test(pwd) },
    { text: t("passwordRequirements.lowercase"), met: /[a-z]/.test(pwd) },
    { text: t("passwordRequirements.number"), met: /\d/.test(pwd) },
    {
      text: t("passwordRequirements.special"),
      met: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = t("errors.invalidEmail");
    }

    if (password.length < 8) {
      errors.password = t("errors.passwordTooShort");
    } else if (passwordStrength < 2) {
      errors.password = t("errors.passwordTooWeak");
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = t("errors.passwordMismatch");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
    if (validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: undefined }));
    }
    setError("");
  };

  const handleConfirmPasswordChange = (newConfirmPassword: string) => {
    setConfirmPassword(newConfirmPassword);
    if (validationErrors.confirmPassword) {
      setValidationErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
    setError("");
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (validationErrors.email) {
      setValidationErrors((prev) => ({ ...prev, email: undefined }));
    }
    setError("");
  };

  const getPasswordStrengthText = (): string => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return t("passwordStrength.veryWeak");
      case 2:
        return t("passwordStrength.weak");
      case 3:
        return t("passwordStrength.good");
      case 4:
        return t("passwordStrength.strong");
      default:
        return "";
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/users/register", { email, password });
      setSuccess(t("messages.success"));
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.error ||
          apiError.message ||
          t("errors.registrationFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <RegisterCard>
        <Header>
          <Title>{t("title")}</Title>
          <Subtitle>{t("subtitle")}</Subtitle>
        </Header>

        <Form onSubmit={handleRegister}>
          <InputGroup>
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={isLoading}
              hasError={!!validationErrors.email}
              autoComplete="email"
            />
            {validationErrors.email && (
              <ErrorMessage>{validationErrors.email}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              disabled={isLoading}
              hasError={!!validationErrors.password}
              autoComplete="new-password"
            />
            {password && (
              <>
                <PasswordStrength strength={passwordStrength} />
                <PasswordHint strength={passwordStrength}>
                  {t("passwordStrength.label")}: {getPasswordStrengthText()}
                </PasswordHint>
                <PasswordRequirements>
                  <RequirementTitle>
                    {t("passwordRequirements.title")}
                  </RequirementTitle>
                  <RequirementsList>
                    {getPasswordRequirements(password).map((req, index) => (
                      <RequirementItem key={index} met={req.met}>
                        {req.text}
                      </RequirementItem>
                    ))}
                  </RequirementsList>
                </PasswordRequirements>
              </>
            )}
            {validationErrors.password && (
              <ErrorMessage>{validationErrors.password}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              disabled={isLoading}
              hasError={!!validationErrors.confirmPassword}
              autoComplete="new-password"
            />
            {validationErrors.confirmPassword && (
              <ErrorMessage>{validationErrors.confirmPassword}</ErrorMessage>
            )}
          </InputGroup>

          <SubmitButton
            type="submit"
            disabled={isLoading || passwordStrength < 2}
            strength={passwordStrength}
          >
            {isLoading && <LoadingSpinner />}
            {isLoading ? t("registering") : t("register")}
          </SubmitButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <TermsAgreement>{t("termsAgreement")}</TermsAgreement>
        </Form>

        <SignInPrompt>
          <SignInText>{t("hasAccount")}</SignInText>
          <SignInLink type="button" onClick={() => navigate("/login")}>
            {t("signInLink")}
          </SignInLink>
        </SignInPrompt>
      </RegisterCard>
    </Container>
  );
};

export default Register;
