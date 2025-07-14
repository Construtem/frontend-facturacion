// src/components/tab-wizard/Stepper.tsx
'use client'

import { useEffect, useState } from "react";
import {
  StepperContainerStyled,
  StepLabelStyled
} from "@/components/styled-components/stepper.styles";

interface Step {
  id: number;
  labelLarge: string;
  labelShort: string;
}

export default function Stepper({currentStep, steps}: {currentStep: number, steps: Step[]}) {

  // Determinar si es móvil o no
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  // Detectar el tamaño de la pantalla
  useEffect(() => {
      const checkSize = () => {
          const innerWidth = window.innerWidth;
          setIsMobile(innerWidth <= 767);
          setIsTablet(innerWidth >= 768 && innerWidth <= 1023);
      };

      checkSize(); // Verificar en primer render
      window.addEventListener('resize', checkSize);

      return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <StepperContainerStyled>
      {steps.map((step) => {
        const isDone = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} style={styles.stepItem}>
            <div style={{
              ...styles.stepId,
              borderRadius: isCurrent ? '40%' : '50%',
              backgroundColor: isCurrent ? '#1f282f' : '#cacaca',
            }}>
              {step.id}
            </div>
            <div style={{
              ...styles.stepId,
              position: 'absolute',
              backgroundColor:'#4CAF50',
              opacity: isDone ? 1 : 0,
              zIndex: 4,
            }}>
              ✔
            </div>
            <StepLabelStyled $iscurrent={isCurrent}>
              {(isMobile || isTablet) ? (
                  step.labelShort
                ) : (
                  step.labelLarge
                )
              }
            </StepLabelStyled>
          </div>
        );
      })}
    </StepperContainerStyled>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  stepItem: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: '0',
  },
  stepId: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '7px solid #F0F0F0',
    transition: 'opacity 0.6s ease-in-out, border-radius 0.6s ease-in-out, background-color 0.6s ease-in-out',
    backgroundColor: "#cacaca",
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    userSelect: 'none',
    zIndex: 3,
  },
}