'use client';
import React, { useEffect, useState, forwardRef } from "react";
import Image from 'next/image';
import logo from "@/assets/images/logo.png";
import exit from '@/assets/images/exit.png';
import { useRouter } from "next/navigation";
import {
  HeaderStyled,
  RightContainerStyled,
  UserInfoContainerStyled,
  RoleBadgeStyled,
  FloatingBoxStyled,
  ButtonContainerStyled
} from './styled-components/header.styles';

interface UserData {
  name: string;
  email: string;
  photoURL?: string;
  rol: string;
}


export default forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function Header(props, ref) {
    const [user, setUser] = useState<UserData | null>(null);
    const router = useRouter();
    const frontLoginUrl = process.env.NEXT_PUBLIC_FRONT_LOGIN || "https://login.tssw.cl/";
    const ventasUrl = process.env.NEXT_PUBLIC_VENTAS_URL || "https://ventas.tssw.cl/";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Usar esto solo para pruebas separadas
    { /*
    useEffect(() => {
      localStorage.removeItem("user");
      if (!localStorage.getItem("user")) {
        // Crear un usuario falso
        const fakeUser: UserData = {
          name: "Usuario Prueba",
          email: "google@example.com",
          photoURL: logo.src,
          rol: "usuario",
        };
        // Lo guarda en localStorage
        localStorage.setItem("user", JSON.stringify(fakeUser));
      }
    }, []);
    */ }

    // Obtiene los datos locales del usuario
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: UserData = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error("Error al parsear datos de usuario, limpiando localStorage:", err);
          localStorage.removeItem("user");
        }
      }
    },[]);

    // Verifica el tamaño de la pantalla
    const [isTooStretched, setIsTooStretched] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
      const handleResize = () => {
        setIsTooStretched(window.innerWidth < 512);
      };

      window.addEventListener('resize', handleResize);

      // Ejecuta una vez para inicializar valores
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    const handleLogout = async () => {
      localStorage.removeItem("user");
      console.log("Usuario ha cerrado sesión");
      window.location.href = `${frontLoginUrl}`;
    };

    return (
      <HeaderStyled ref={ref}>
        <div style={styles.logoContainer}>
          <Image
            src={logo}
            alt="ConstrUTEM Logo"
            style={styles.logoImage}
            onClick={() => router.push(ventasUrl)}
          />
        </div>

        <RightContainerStyled>
          {user && (
            <UserInfoContainerStyled>
              {!isTooStretched &&
                <RoleBadgeStyled>
                  {user.rol}
                </RoleBadgeStyled>
              }

              {isTooStretched && (isOpen ?
                <span style={{ fontSize: '24px' }}>˄</span>
              :
                <span style={{ fontSize: '24px' }}>˅</span>
              )}
              <span style={styles.photoWrapper} onClick={isTooStretched ? () => setIsOpen(!isOpen) : undefined}>
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Foto perfil"
                    width={32}
                    height={32}
                    style={styles.userImage}
                  />
                ) : (
                  "👤"
                )}
              </span>

              {(!isTooStretched || isOpen) && (
                <FloatingBoxStyled>
                  {isTooStretched &&
                    <RoleBadgeStyled>
                      {user.rol}
                    </RoleBadgeStyled>
                  }
                  <div style={styles.nameBlock}>
                    <div style={styles.name}>
                      {user.name}
                    </div>
                    <div style={styles.email}>
                      {user.email}
                    </div>
                  </div>
                </FloatingBoxStyled>
              )}
            </UserInfoContainerStyled>
          )}

          <Image
            src={exit}
            alt="Cerrar sesión"
            width={28}
            height={28}
            style={styles.logoutIcon}
            onClick={openModal}
          />
        </RightContainerStyled>

        {isModalOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <button style={{ ...styles.closeButton, border: 'none', padding: '0px', fontSize: '32px' }} onClick={closeModal}>
                  ×
                </button>
              </div>
              <h2>Confirmar cierre de sesión</h2>
              <p>Esta acción cerrará tu sesión actual. ¿Quieres continuar?</p>
              <div style={styles.modalFooter}>
                <ButtonContainerStyled>
                  <button style={styles.closeButton} onClick={closeModal}>
                    Cancelar
                  </button>
                </ButtonContainerStyled>
                <ButtonContainerStyled>
                  <button style={styles.button} onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </ButtonContainerStyled>
              </div>
            </div>
          </div>
        )}
      </HeaderStyled>
    );
  }
);

const styles: { [key: string]: React.CSSProperties } = {
  logoContainer: {
    display: "flex",
    alignItems: "center",
    height: "100%"
  },
  logoImage: {
    maxHeight: "58px",
    width: "auto",
    cursor: "pointer"
  },
  photoWrapper: {
    backgroundColor: "#ffffff",
    color: "#2d2d2d",
    borderRadius: "9999px",
    padding: "6px",
    fontSize: "1.125rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  userImage: {
    borderRadius: "9999px",
    objectFit: "cover",
    minWidth: "32px",
    minHeight: "32px",
    maxWidth: "32px",
    maxHeight: "32px",
    userSelect: "none"
  },
  nameBlock: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.2,
    textAlign: "right"
  },
  logoutIcon: {
    cursor: "pointer",
    userSelect: "none"
  },
  name: {
    color: "white",
    fontSize: "0.875rem",
    fontFamily: "Montserrat, sans-serif",
  },
  email: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "0.75rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  floatingBox: {
    position: 'absolute',
    top: '99%',
    right: 0,
    backgroundColor: '#2d2d2d',
    borderBottomLeftRadius: '16px',
    padding: '12px',
    zIndex: 999,
    width: 'auto',
    height: 'auto',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0B1631',
    padding: '20px',
    margin: '6px',
    maxWidth: '800px',
    width: 'auto',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    borderRadius: '16px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'right',
    alignItems: 'center',
    marginBottom: '10px',
  },
  closeButton: {
    padding: '12px 24px',
    border: '1px solid white',
    backgroundColor: '#0B1631',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#2563B6',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    alignContent: 'center',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
};