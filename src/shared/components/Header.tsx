import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import PersonIcon from "@mui/icons-material/Person";

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  direction: ${({ theme }) => theme.direction};

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 60px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
  flex-direction: ${(props) =>
    props.theme.direction === "rtl" ? "row-reverse" : "row"};

  &:hover {
    transform: scale(1.02);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 18px;

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
`;

const LogoText = styled.h1`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 32px;
  flex-direction: ${({ theme }) =>
    theme.direction === "rtl" ? "row-reverse" : "row"};

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button<{ $isActive?: boolean }>`
  background: none;
  border: none;
  color: ${(props) =>
    props.$isActive ? "#ffd700" : "rgba(255, 255, 255, 0.9)"};
  font-size: 16px;
  font-weight: ${(props) => (props.$isActive ? "600" : "500")};
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #ffd700;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  ${(props) =>
    props.$isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      background: #ffd700;
      border-radius: 50%;
    }
  `}
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-direction: ${(props) =>
    props.theme.direction === "rtl" ? "row-reverse" : "row"};
`;

const LanguageToggle = styled.button<{ $isActive?: boolean }>`
  background: ${(props) =>
    props.$isActive ? "#ffd700" : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    ${(props) => (props.$isActive ? "#ffd700" : "rgba(255, 255, 255, 0.2)")};
  color: ${(props) => (props.$isActive ? "#333" : "white")};
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  direction: ltr; /* Always keep language toggle LTR */

  &:hover {
    background: ${(props) =>
      props.$isActive ? "#ffd700" : "rgba(255, 255, 255, 0.2)"};
    transform: translateY(-1px);
  }

  &::after {
    content: ${(props) => (props.$isActive ? '"✓"' : "none")};
    font-size: 12px;
    color: #333;
    margin-left: 4px;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const PersonIconStyled = styled(PersonIcon)`
  width: 24px;
  height: 24px;
  color: white;
  margin-top: 2px;
`;

const UserDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  ${({ theme }) => (theme.direction === "rtl" ? "left: 0;" : "right: 0;")}
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 180px;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.3s ease;
  z-index: 1001;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  text-align: ${(props) =>
    props.theme.direction === "rtl" ? "right" : "left"};
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  direction: ${(props) => props.theme.direction};

  &:hover {
    background: #f8f9fa;
  }

  &.danger {
    color: #dc3545;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transform: ${(props) =>
    props.$isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.3s ease;
  direction: ${(props) => props.theme.direction};

  @media (max-width: 768px) {
    display: block;
  }
`;

const LogoutConfirmation = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ConfirmationModal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  direction: ${(props) => props.theme.direction};
`;

const ConfirmationTitle = styled.h3`
  font-size: 1.5rem;
  color: #343a40;
  margin-bottom: 16px;
`;

const ConfirmationText = styled.p`
  color: #6c757d;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const ConfirmationButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-direction: ${(props) =>
    props.theme.direction === "rtl" ? "row-reverse" : "row"};
`;

const ConfirmButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
`;

const CancelButton = styled.button`
  background: transparent;
  color: #6c757d;
  border: 2px solid #dee2e6;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #adb5bd;
    color: #495057;
  }
`;

const MobileNavLink = styled.button<{ $isActive?: boolean }>`
  display: block;
  width: 100%;
  background: none;
  border: none;
  color: ${(props) =>
    props.$isActive ? "#ffd700" : "rgba(255, 255, 255, 0.9)"};
  font-size: 16px;
  font-weight: ${(props) => (props.$isActive ? "600" : "500")};
  padding: 12px 0;
  text-align: ${(props) =>
    props.theme.direction === "rtl" ? "right" : "left"};
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: #ffd700;
  }
`;

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { t, i18n } = useTranslation("header");
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "en" ? "he" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleLogoutRequest = () => {
    setShowLogoutConfirm(true);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("rememberMe");

    // Update state
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setShowLogoutConfirm(false);

    // Navigate to home page
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <HeaderContainer className={className}>
      <HeaderContent>
        <Logo onClick={() => navigate("/")}>
          <LogoIcon>AI</LogoIcon>
          <LogoText>{t("navigation.appName")}</LogoText>
        </Logo>

        <Navigation>
          <NavLink $isActive={isActivePath("/")} onClick={() => navigate("/")}>
            {t("navigation.home")}
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink
                $isActive={isActivePath("/survey")}
                onClick={() => navigate("/survey")}
              >
                {t("navigation.survey")}
              </NavLink>
              <NavLink
                $isActive={isActivePath("/dashboard")}
                onClick={() => navigate("/dashboard")}
              >
                {t("navigation.dashboard")}
              </NavLink>
            </>
          )}
        </Navigation>

        <UserSection>
          <LanguageToggle
            $isActive={i18n.language === "en"}
            onClick={handleLanguageToggle}
          >
            <span>
              {i18n.language === "en"
                ? t("language.english")
                : t("language.hebrew")}
            </span>
          </LanguageToggle>

          {isLoggedIn ? (
            <UserMenu onClick={(e) => e.stopPropagation()}>
              <UserAvatar onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <PersonIconStyled />
              </UserAvatar>
              <UserDropdown $isOpen={isUserMenuOpen}>
                <DropdownItem onClick={() => navigate("/profile")}>
                  {t("userMenu.profile")}
                </DropdownItem>
                <DropdownItem onClick={() => navigate("/settings")}>
                  {t("userMenu.settings")}
                </DropdownItem>
                <DropdownItem onClick={() => navigate("/help")}>
                  {t("userMenu.help")}
                </DropdownItem>
                <DropdownItem className="danger" onClick={handleLogoutRequest}>
                  {t("userMenu.logout")}
                </DropdownItem>
              </UserDropdown>
            </UserMenu>
          ) : (
            <NavLink onClick={() => navigate("/login")}>
              {t("navigation.login")}
            </NavLink>
          )}

          <MobileMenuButton
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
          >
            ☰
          </MobileMenuButton>
        </UserSection>
      </HeaderContent>

      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileNavLink
          $isActive={isActivePath("/")}
          onClick={() => handleNavigation("/")}
        >
          {t("navigation.home")}
        </MobileNavLink>

        {isLoggedIn ? (
          <>
            <MobileNavLink
              $isActive={isActivePath("/survey")}
              onClick={() => handleNavigation("/survey")}
            >
              {t("navigation.survey")}
            </MobileNavLink>
            <MobileNavLink
              $isActive={isActivePath("/dashboard")}
              onClick={() => handleNavigation("/dashboard")}
            >
              {t("navigation.dashboard")}
            </MobileNavLink>
            <MobileNavLink onClick={handleLogoutRequest}>
              {t("userMenu.logout")}
            </MobileNavLink>
          </>
        ) : (
          <>
            <MobileNavLink onClick={() => handleNavigation("/login")}>
              {t("navigation.login")}
            </MobileNavLink>
            <MobileNavLink onClick={() => handleNavigation("/register")}>
              {t("navigation.register")}
            </MobileNavLink>
          </>
        )}
      </MobileMenu>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation $isOpen={showLogoutConfirm}>
        <ConfirmationModal>
          <ConfirmationTitle>{t("logoutConfirm.title")}</ConfirmationTitle>
          <ConfirmationText>{t("logoutConfirm.text")}</ConfirmationText>
          <ConfirmationButtons>
            <ConfirmButton onClick={handleLogout}>
              {t("logoutConfirm.confirm")}
            </ConfirmButton>
            <CancelButton onClick={handleCancelLogout}>
              {t("logoutConfirm.cancel")}
            </CancelButton>
          </ConfirmationButtons>
        </ConfirmationModal>
      </LogoutConfirmation>
    </HeaderContainer>
  );
};

export default Header;
