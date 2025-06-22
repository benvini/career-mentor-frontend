import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";

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

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  padding: 48px;
  width: 100%;
  max-width: 480px;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid ${({ $hasError }) => ($hasError ? "#dc3545" : "#e9ecef")};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
  text-align: ${({ theme }) => (theme.direction === "rtl" ? "right" : "left")};
  direction: ${({ theme }) => theme.direction};

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? "#dc3545" : "#667eea")};
    background: white;
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError ? "rgba(220, 53, 69, 0.1)" : "rgba(102, 126, 234, 0.1)"};
  }

  &::placeholder {
    color: #adb5bd;
    text-align: ${({ theme }) =>
      theme.direction === "rtl" ? "right" : "left"};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: #495057;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
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
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
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
  margin-top: 16px;

  &::before {
    content: "⚠️";
  }
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: underline;
  align-self: flex-end;
  transition: color 0.3s ease;

  &:hover {
    color: #764ba2;
  }
`;

const SignUpPrompt = styled.div`
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
`;

const SignUpText = styled.p`
  color: #6c757d;
  margin: 0 0 12px 0;
`;

const SignUpLink = styled.button`
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

interface ValidationErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const { t } = useTranslation("loginScreen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!email) {
      errors.email = t("errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t("errors.invalidEmail");
    }

    if (!password) {
      errors.password = t("errors.passwordRequired");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (validationErrors.email) {
      setValidationErrors((prev) => ({ ...prev, email: undefined }));
    }
    setError("");
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    if (validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: undefined }));
    }
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Use the login function from Auth Context
      const success = await login(email, password, rememberMe);

      if (success) {
        // Navigation will happen automatically via context
        navigate("/dashboard");
      } else {
        setError(t("errors.loginFailed"));
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(t("errors.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Header>
          <Title>{t("title")}</Title>
          <Subtitle>{t("subtitle")}</Subtitle>
        </Header>

        <Form onSubmit={handleLogin}>
          <InputGroup>
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={isLoading}
              $hasError={!!validationErrors.email}
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
              $hasError={!!validationErrors.password}
              autoComplete="current-password"
            />
            {validationErrors.password && (
              <ErrorMessage>{validationErrors.password}</ErrorMessage>
            )}
            <ForgotPasswordLink type="button">
              {t("forgotPassword")}
            </ForgotPasswordLink>
          </InputGroup>

          <CheckboxGroup>
            <Checkbox
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <CheckboxLabel htmlFor="remember">{t("rememberMe")}</CheckboxLabel>
          </CheckboxGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading && <LoadingSpinner />}
            {isLoading ? t("loggingIn") : t("login")}
          </SubmitButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>

        <SignUpPrompt>
          <SignUpText>{t("noAccount")}</SignUpText>
          <SignUpLink type="button" onClick={() => navigate("/register")}>
            {t("signUpLink")}
          </SignUpLink>
        </SignUpPrompt>
      </LoginCard>
    </Container>
  );
};

export default Login;
